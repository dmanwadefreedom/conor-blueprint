# The Content Engine — Backend Architecture (Build Spec)

Status: build spec, July 2026. The admin mock at `content-engine/admin/index.html` is the UI contract — every screen in it maps to a route and a set of tables defined here.

---

## 1. Constraints that shape the design

1. **Vercel cannot run video jobs.** Serverless functions cap out long before a single ffmpeg/Remotion render finishes, and there is no GPU. All rendering, voice cloning, and lip-sync runs on a dedicated worker VPS. Vercel serves the dashboard, API routes, and webhooks only.
2. **Vercel Blob is not the media store.** The current account is a Hobby-style personal account and Blob is a fixed free allotment (~1 GB storage / ~10 GB transfer per month) with no overage path — when maxed, uploads block until cycle reset. See `docs/research/vercel-status.md`. Media goes to **Cloudflare R2** (10 GB free, zero egress, S3-compatible), which matters because every rendered reel gets downloaded/posted multiple times.
3. **Agents must survive laptop shutdown.** Hermes (the Telegram approval/ops agent) and the render worker run on the VPS under systemd, not on anyone's machine. Tailscale connects dashboard, worker, and any operator device on a private mesh.
4. **Video volume is the product.** 50 videos/day at Full Stack. The pipeline must be a queue with retries, not a request/response call. Open-source handles orchestration, analysis, assembly, captions, and export; paid APIs are reserved for the two quality cliffs — voice and face. Full component research: `docs/research/open-source-video-stack.md`.

---

## 2. Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Web app + API | **Next.js (App Router) on Vercel** | Static deploys already live on this account; API routes for Stripe webhooks + dashboard API; zero-ops. |
| Database + Auth | **Supabase (Postgres + Auth + RLS)** | One service for DB, magic-link/Google auth, row-level security for client-facing views, realtime for queue status. |
| Queue | **Postgres-backed job queue (Graphile Worker)** on the VPS | No Redis to babysit; jobs live in the same Postgres as everything else; `LISTEN/NOTIFY` latency is fine at this volume. |
| Video worker | **GPU VPS** (RTX 4090-class, e.g. Hetzner GPU line or a dedicated box) running a Node + Python worker | LatentSync/MuseTalk need 16–24 GB VRAM; Chatterbox and whisperX ride along on the same card. |
| Object storage | **Cloudflare R2** | Zero egress; renders get pulled by schedulers, ad platforms, and clients repeatedly. |
| Billing | **Stripe** (Checkout + Billing + Customer Portal) | Section 4. |
| Ops agent | **Hermes** — Telegram bot (grammY/Node) on the VPS | Section 8. |
| Networking | **Tailscale** | Worker is never exposed publicly; dashboard talks to it over the tailnet; SSH only via tailnet. |
| Scheduling/posting | Platform APIs where official (TikTok Content Posting API, Meta Graph, YouTube Data, LinkedIn) behind a `scheduler` job type | One posting adapter per platform; per-account cadence rules enforced in code (warm-up, daily caps). |

Rendering split: **Remotion** composition (1080×1920) for captions/branding/assembly on the worker, **ffmpeg** for the final mux/loudnorm. Remotion's company license is budgeted the moment the team passes 3 people — line-item it now so it never becomes a surprise.

---

## 3. System diagram

```
                    ┌───────────────────────────────┐
  Client browser ──►│  Next.js on Vercel            │
  (sales pages,     │  - marketing pages (static)   │
   admin, portal)   │  - /api/stripe/webhook        │
                    │  - /api/* dashboard API       │
                    └──────────┬────────────────────┘
                               │  SQL over TLS
                    ┌──────────▼────────────────────┐
                    │  Supabase Postgres            │◄── Auth (magic link / Google)
                    │  tables + Graphile Worker     │
                    │  job queue                    │
                    └──────────┬────────────────────┘
                               │  LISTEN/NOTIFY (over Tailscale)
                    ┌──────────▼────────────────────┐         ┌──────────────┐
                    │  GPU VPS (systemd services)   │────────►│ Cloudflare R2 │
                    │  - worker: analyze/script/    │  S3 API │ base footage, │
                    │    voice/face/broll/assemble/ │         │ renders, srt, │
                    │    export/post jobs           │         │ covers, blogs │
                    │  - hermes: Telegram bot       │         └──────────────┘
                    │  - tailscaled                 │
                    └──────────┬────────────────────┘
                               │ platform APIs
                    ┌──────────▼────────────────────┐
                    │ TikTok / IG / YT / LinkedIn / │
                    │ Meta Ads (whitelisted)        │
                    └───────────────────────────────┘

  Stripe ──webhooks──► /api/stripe/webhook ──► Postgres ──► Hermes notification
  Winners (tests.status = won) ──push job──► GIZMO / AI Ads Department intake
```

---

## 4. Stripe wiring

### 4.1 Products and Prices (canonical — create with lookup keys)

| Lookup key | Product | Price | Type |
|---|---|---|---|
| `ce_setup` | Content Engine — Setup | $1,500 | one-time |
| `ce_tier1_engine` | The Content Engine — Engine | $997/mo | recurring |
| `ce_tier2_influencer` | The Content Engine — Engine + Influencer | $1,997/mo | recurring |
| `ce_tier3_fullstack` | The Content Engine — Full Stack | $2,997/mo | recurring |
| `ce_upsell_dfy` | Done-For-You Launch + Clone Build | $4,997 | one-time |
| `ads_install` | The AI Ads Department — Install | $19,997 | one-time |
| `ads_ops` | The AI Ads Department — Operations | $1,997/mo | recurring |
| `ads_whitelabel` | AI Ads Department — Agency White-Label | $4,997/mo | recurring |
| `ads_ce_bundle` | Content Engine Full Stack (ads-buyer bundle) | $2,497/mo | recurring |

Rules:
- Prices are immutable in Stripe; never edit — create a new price and repoint the lookup key.
- The sales pages currently link `https://buy.stripe.com/REPLACE_<PRODUCT_KEY>` placeholders. Replace with **server-created Checkout Sessions** (below), not Payment Links, because the setup fee and the one-click upsell need session control. If Payment Links are kept for speed, one link per tier bundling the tier price + `ce_setup`.

### 4.2 Checkout flow (tier purchase)

`POST /api/checkout` with `{ tier }`:

```ts
const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [
    { price: prices[tier], quantity: 1 },       // recurring tier
    { price: prices.ce_setup, quantity: 1 },    // $1,500 one-time on first invoice
  ],
  payment_method_collection: "always",
  subscription_data: { metadata: { tier } },
  // save card for the one-click upsell:
  saved_payment_method_options: { payment_method_save: "enabled" },
  allow_promotion_codes: true,
  success_url: `${SITE_URL}/content-engine/upsell.html?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${SITE_URL}/content-engine/index.html#pricing`,
});
```

Success redirects to `upsell.html` (post-purchase one-click), which then continues to `thank-you.html` whether or not the upsell converts.

### 4.3 One-click upsell ($4,997 DFY)

On `checkout.session.completed`, store `customer` and the default `payment_method`. The upsell page calls `POST /api/upsell` with the session id; the server charges off-session — no card re-entry:

```ts
await stripe.paymentIntents.create({
  amount: 499700, currency: "usd",
  customer, payment_method,
  off_session: true, confirm: true,
  description: "Done-For-You Launch + Clone Build",
  metadata: { kind: "ce_upsell_dfy", origin_session: sessionId },
});
```

Handle `authentication_required` decline by falling back to a normal one-time Checkout Session for the same price (rare, but 3DS can force it).

### 4.4 Webhooks (single endpoint `/api/stripe/webhook`)

Verify signature, insert raw event into `webhook_events` (idempotency on `event.id`), then process:

| Event | Action |
|---|---|
| `checkout.session.completed` | Create/attach `users` row, create `subscriptions` row, save payment method, kick onboarding job, notify Hermes |
| `invoice.paid` | Mark period paid; reset monthly quotas (reels, posts) |
| `invoice.payment_failed` | Flag account `past_due`; Hermes alert; pause render queue for that client after 7 days |
| `customer.subscription.updated` | Sync tier/status changes (upgrades, downgrades, cancel-at-period-end) |
| `customer.subscription.deleted` | Set `churned`; retain assets 90 days; Hermes alert |
| `payment_intent.succeeded` (metadata `ce_upsell_dfy`) | Create DFY project record; notify Hermes with onboarding checklist |
| `payment_intent.payment_failed` | Log; surface in admin |
| `charge.refunded` / `charge.dispute.created` | Flag account; Hermes alert immediately |

### 4.5 Customer portal

Enable Stripe Customer Portal (update card, view invoices, cancel). Configure: cancellations take effect at period end; tier switches allowed between the three CE tiers with proration. Link from the client dashboard header.

---

## 5. Auth

- **Supabase Auth**: magic link (default) + Google OAuth.
- Roles via `users.role`: `owner` (Conor/team), `operator`, `client`.
- Admin panel routes require `owner`/`operator`. Clients get a scoped portal: their queue, their approvals, their reports — enforced with RLS (`client_id = auth.uid()`-mapped) so a bug in the API can't leak cross-client data.
- Worker and Hermes authenticate to Postgres with a dedicated `service_role`-adjacent DB user restricted to the tables they touch; they are only reachable over the tailnet.

---

## 6. Database schema (Postgres)

```sql
-- People & money ------------------------------------------------------------
create table users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique,                        -- supabase auth.users.id
  email text unique not null,
  name text,
  role text not null default 'client',        -- owner | operator | client
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  stripe_subscription_id text unique not null,
  tier text not null,                          -- engine | influencer | fullstack | ads_ops | ads_whitelabel | ads_ce_bundle
  status text not null,                        -- active | past_due | canceled | trialing
  current_period_end timestamptz,
  setup_fee_paid boolean not null default false,
  dfy_purchased boolean not null default false,
  created_at timestamptz not null default now()
);

create table webhook_events (
  id text primary key,                         -- stripe event id (idempotency)
  type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  received_at timestamptz not null default now()
);

-- Clones & scripts ----------------------------------------------------------
create table clones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  name text not null,                          -- "Logan v2"
  status text not null default 'training',     -- training | active | archived
  base_video_url text,                         -- R2 key: consented 2–3 min base footage
  voice_ref_url text,                          -- 30s+ clean voice reference
  voice_engine text not null default 'chatterbox',   -- chatterbox | elevenlabs
  face_engine text not null default 'latentsync',    -- latentsync | musetalk | duix | heygen
  consent_doc_url text,                        -- signed consent on file, non-negotiable
  monthly_reel_quota int not null default 30,
  created_at timestamptz not null default now()
);

create table scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  clone_id uuid references clones(id),
  content_path text not null,                  -- A | B | C
  format text not null,                        -- loop_6s | reel_14_16s | demo_30s
  hook_formula text,                           -- contrarian | mistake | list | outcome | curiosity | discovery | pov | comment_bait
  hook text not null,
  beats jsonb not null,                        -- [{t0,t1,copy,broll_queries[]}]
  caption_emphasis jsonb,
  source_reel_spec_id uuid,                    -- from analyzer, nullable
  status text not null default 'draft',        -- draft | approved | rendered
  created_at timestamptz not null default now()
);

-- Video production ----------------------------------------------------------
create table videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  script_id uuid references scripts(id),
  clone_id uuid references clones(id),
  status text not null default 'queued',       -- queued | analyzing | scripting | voicing | facing | broll | assembling | exporting | done | failed
  duration_s numeric,
  r2_key text,                                 -- out/{client}/{slug}_9x16.mp4
  srt_key text,
  cover_key text,
  render_cost_cents int,                       -- track COGS per video
  error text,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create table reel_specs (                       -- Sample Reel Analyzer output
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  source_file_key text not null,
  spec jsonb not null,                          -- {hook_ms, wpm, cuts_per_s, avg_shot_s, broll_ratio, caption_style, cta_ms, shots[], voice{emotion,pauses,energy[]}}
  created_at timestamptz not null default now()
);

-- Distribution --------------------------------------------------------------
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  video_id uuid references videos(id),
  platform text not null,                       -- tiktok | instagram | youtube | linkedin | x
  account_handle text not null,
  caption text,
  scheduled_at timestamptz,
  status text not null default 'needs_approval',-- needs_approval | scheduled | posted | failed
  platform_post_id text,
  ai_label_applied boolean not null default true,  -- TikTok/Meta AI labels; EU AI Act mandatory Aug 2 2026
  posted_at timestamptz,
  created_at timestamptz not null default now()
);

-- Testing matrix ------------------------------------------------------------
create table test_sprints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  name text not null,                           -- "Sprint 07 — Hook isolation"
  variable text not null,                       -- hook | offer | avatar | cta
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table test_variants (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid not null references test_sprints(id),
  video_id uuid references videos(id),
  label text not null,                          -- "V-728"
  hook text,
  metrics jsonb not null default '{}',          -- {views, ctr, hold_3s, completion, saves, shares, comments}
  status text not null default 'live',          -- live | killed | winner
  killed_at timestamptz,
  won_at timestamptz
);

create table winners (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references test_variants(id),
  pushed_to_gizmo_at timestamptz,               -- ads handoff timestamp
  gizmo_status text,                            -- testing | scaling | retired
  ads_ready_key text,                           -- re-exported ads-safe master in R2
  created_at timestamptz not null default now()
);

-- SEO module (botmo) ---------------------------------------------------------
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  keyword text not null,
  intent text,                                  -- informational | commercial | transactional
  stage text not null default 'researching',    -- researching | drafting | in_review | published | indexed | cited
  title text,
  body_key text,                                -- R2 key, rendered markdown/html
  published_url text,
  impressions_28d int default 0,
  ai_citations int default 0,
  created_at timestamptz not null default now()
);

-- Queue (Graphile Worker owns its own tables; this is the app-level view) ----
create table jobs_log (
  id bigserial primary key,
  job_type text not null,                       -- analyze|script|voice|face|broll|assemble|export|post|scrape_metrics|blog
  ref_id uuid,
  status text not null,                         -- queued|running|done|failed
  attempts int not null default 0,
  detail jsonb,
  created_at timestamptz not null default now()
);
```

Indexes: `posts(user_id, status, scheduled_at)`, `videos(user_id, status)`, `test_variants(sprint_id, status)`, `webhook_events(type, received_at)`.

---

## 7. Video job pipeline

Component selection and licensing rationale live in `docs/research/open-source-video-stack.md` — this section is the operational wiring. One `videos` row moves through eight job types; each job is idempotent, retried max 3 times with backoff, and writes its artifact to R2 before marking done.

```
queued → analyzing → scripting → voicing → facing → broll → assembling → exporting → done
```

| Stage | Job | Tooling | Notes |
|---|---|---|---|
| 1. Analyze | `analyze` | PySceneDetect + whisperX + pyannote + VLM keyframe tags → `reel_specs.spec` | Only when a sample reel drives the template. ~40s per reel on the GPU box. |
| 2. Script | `script` | LLM API call: reel_spec + brand brief + hook formula → beat sheet JSON | Validated against a JSON schema; rejects hooks over 14 words; stores to `scripts`. |
| 3. Voice | `voice` | **Chatterbox** (MIT, self-hosted, watermarked) default; **ElevenLabs** flag per clone for client-facing ad reads | 30s reference per clone. Cache by (clone, script hash). |
| 4. Face | `face` | **LatentSync 1.6** default (best open fidelity); **MuseTalk 1.5** when throughput matters; **HeyGen API** paid upgrade per client flag | Input is the clone's consented base footage, lip-synced to the new voice track. Never Wav2Lip/F5/Fish weights in prod (non-commercial). |
| 5. B-roll | `broll` | Per-beat queries → Pexels + Pixabay APIs → `open_clip` re-rank vs beat text → 2–4s cutaways | ~200 LOC we own. Generated fill (Higgsfield/Kling) only for shots stock can't provide. |
| 6. Assemble | `assemble` | **Remotion** 1080×1920 comp: talking-head base, B-roll on beat grid, karaoke captions from whisperX word JSON, music bed with sidechain duck | `auto-editor` pre-pass when input is real (non-clone) footage. |
| 7. Export | `export` | ffmpeg: H.264 high, yuv420p, CRF 18, 30fps, AAC 192k, loudnorm −14 LUFS, +faststart; emit .srt + cover frame | Upload `out/{client}/{slug}_9x16.mp4` to R2; write `render_cost_cents`. |
| 8. Post | `post` | Platform adapter per network; applies AI-content labels; respects cadence + warm-up rules | Creates/updates `posts`; failures alert Hermes and auto-retry once. |

Supporting recurring jobs:

- `scrape_metrics` (hourly): pulls public view/engagement counts for live `test_variants`, updates `metrics`, applies the **kill rule** (3-sec hold < 25% at 48h → `killed`) and **winner rule** (hold ≥ 60% + top-decile CTR → `winner`, insert `winners` row, notify Hermes).
- `push_to_gizmo` (on winner confirm): re-exports an ads-safe master (no platform watermarks), writes `winners.ads_ready_key`, posts the creative + hook data to the AI Ads Department intake.
- `blog` (daily, botmo): keyword gap scan → draft → `in_review` → publish → index check → AI-citation check; updates `blog_posts.stage`.

Worker sizing: one RTX 4090 sustains roughly 40–60 finished reels/day with face-sync as the bottleneck (~2–4 min per 15s reel). Full Stack's 100-video matrix is mostly hook-swaps on a shared base render — voice + captions + first 2s re-render, not 100 full face-syncs — which is what makes 100 variants/sprint affordable. Second GPU box is the scale-out unit; the queue makes that a config change, not a rewrite.

---

## 8. Hermes agent integration

Hermes is the ops agent the client actually talks to. It is a **Telegram bot (grammY on Node) running on the VPS under systemd** — it survives laptop shutdowns, deploys, and everything short of the VPS itself dying (systemd restarts it in seconds if it crashes).

Integration points:

1. **Approval workflow.** When a `posts` row hits `needs_approval`, Hermes DMs the client's approval group: preview link (R2 signed URL), caption, scheduled slot, inline buttons `Approve` / `Edit caption` / `Reject`. Button callbacks hit the same API the admin panel uses (`PATCH /api/posts/:id`), so the queue is one source of truth.
2. **Alerts.** Payment failed, render job failed 3x, platform token expired, variant killed/won, dispute opened. Severity-tagged; critical alerts also ping the owner channel.
3. **Daily digest** (8:00 AM client-local): videos produced, posts shipped, approvals waiting, test standings, blog stage changes.
4. **Commands:** `/status` (pipeline + queue depth), `/queue`, `/approve_all`, `/pause`, `/winners`, `/push V-741` (ads handoff), `/report` (link to client report page).
5. **Stripe events** flow to Hermes through the webhook handler — a new subscription posts the onboarding checklist to the ops channel automatically.

systemd units on the VPS (both `Restart=always`, `WantedBy=multi-user.target`):

```ini
# /etc/systemd/system/hermes.service
[Unit]
Description=Hermes Telegram agent
After=network-online.target tailscaled.service

[Service]
WorkingDirectory=/opt/engine/hermes
EnvironmentFile=/opt/engine/.env
ExecStart=/usr/bin/node dist/bot.js
Restart=always
RestartSec=3
User=engine

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/engine-worker.service
[Unit]
Description=Content Engine render worker
After=network-online.target tailscaled.service

[Service]
WorkingDirectory=/opt/engine/worker
EnvironmentFile=/opt/engine/.env
ExecStart=/usr/bin/node dist/worker.js
Restart=always
RestartSec=5
User=engine

[Install]
WantedBy=multi-user.target
```

Networking: the VPS joins the tailnet (`tailscale up --ssh`). Postgres, the dashboard's server-side calls to the worker's health endpoint, and operator SSH all ride the tailnet. Nothing on the worker is exposed to the public internet except outbound calls to platform APIs.

---

## 9. Admin panel → real app mapping

The static mock (`content-engine/admin/index.html`) becomes these routes:

| Mock tab | Route | Backing data |
|---|---|---|
| Dashboard | `/admin` | KPI queries over `videos`, `test_variants`, `winners`, `subscriptions` (MRR from Stripe, cached) |
| Content Queue | `/admin/queue` | `posts` + approval mutations |
| UGC Studio | `/admin/studio` | `clones`, `scripts` + `script` job enqueue |
| Reel Analyzer | `/admin/analyzer` | upload → R2 → `analyze` job → `reel_specs` |
| Testing Matrix | `/admin/tests` | `test_sprints`, `test_variants` (realtime via Supabase channel) |
| SEO · botmo | `/admin/seo` | `blog_posts` |
| Ads Handoff | `/admin/ads` | `winners` + `push_to_gizmo` |
| Settings | `/admin/settings` | Stripe status, platform tokens, worker/Hermes health over tailnet |

Client portal reuses Queue, Dashboard (scoped), and Reports at `/portal/*` with RLS enforcement.

---

## 10. Environment variables

```bash
# App
SITE_URL=                       # https://<domain>
NODE_ENV=production

# Supabase
DATABASE_URL=                   # Postgres, pooled for Vercel; direct for worker
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server/worker only, never client-side

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PORTAL_CONFIG_ID=

# Storage — Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=content-engine
R2_PUBLIC_BASE_URL=             # CDN/custom domain for signed previews

# LLM provider (scripts, blog drafts, beat sheets)
LLM_API_KEY=
LLM_MODEL=                      # pin per environment; change via config, not code

# Voice / face
ELEVENLABS_API_KEY=             # optional per-clone upgrade
HEYGEN_API_KEY=                 # optional per-clone upgrade
CHATTERBOX_HOST=                # local worker service, tailnet address
FACE_ENGINE_DEFAULT=latentsync

# B-roll
PEXELS_API_KEY=
PIXABAY_API_KEY=

# Platforms
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
META_APP_ID=
META_APP_SECRET=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Hermes
TELEGRAM_BOT_TOKEN=
TELEGRAM_OWNER_CHAT_ID=
TELEGRAM_OPS_CHANNEL_ID=

# Worker
WORKER_CONCURRENCY=4
GPU_VISIBLE_DEVICES=0
TAILSCALE_AUTHKEY=              # provisioning only; rotate after join
```

Secrets live in Vercel env (app) and `/opt/engine/.env` chmod 600 (VPS). Nothing secret ships in the static pages.

---

## 11. Build order

1. **Week 1 — Money first.** Stripe products/prices with lookup keys, Checkout Session endpoint, webhook handler + `webhook_events`, upsell one-click, customer portal. Swap the `REPLACE_*` placeholder links on the sales pages. Supabase project + `users`/`subscriptions`.
2. **Week 2 — Pipeline skeleton.** VPS + Tailscale + systemd services. Graphile Worker with `script → voice → assemble → export` on one clone (Chatterbox + Remotion + ffmpeg, no face-sync yet). R2 wiring. First end-to-end reel from a text prompt.
3. **Week 3 — Face + approvals.** LatentSync stage, Hermes approval flow, `posts` scheduler with TikTok + IG adapters, admin panel v1 (Dashboard, Queue, Studio) replacing the mock.
4. **Week 4 — Testing loop.** `scrape_metrics`, kill/winner rules, Testing Matrix screen, ads handoff to GIZMO, analyzer (`analyze` job + Reel Analyzer screen), botmo blog job.
5. **Ongoing.** Second GPU box when queue P95 wait exceeds 2h; Remotion company license at hire #4; quarterly license re-check on all model weights per the watchlist in `docs/research/open-source-video-stack.md`.
