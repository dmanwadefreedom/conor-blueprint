# Ops Runbook — Infrastructure That Survives a Laptop Closing

**Scope:** Hermes (Telegram agent), GIZMO (ads agent), the Content Engine workers, Vercel-hosted funnel pages, media storage, GitHub, backups.
**Principle:** nothing revenue-touching runs on a laptop. Laptops sleep. Servers don't.
**Date:** July 2026.

---

## Known Incidents (as of July 10, 2026)

| # | Problem | Status | Fix |
|---|---|---|---|
| 1 | Hermes dies when the laptop sleeps | Open | §1 — move to VPS today |
| 2 | Vercel Blob maxed out (Hobby cap), uploads blocked | Open | §2 — cleanup + R2 migration |
| 3 | Meta API usage block on the ad account (from an earlier integration attempt) | Open | `docs/conor-funnel-fixes.md` §5c |
| 4 | Repos scattered across personal accounts, agents holding broad tokens | Open | §4 — GitHub consolidation |
| 5 | No tested backups anywhere | Open | §5 |

---

## 1) Hermes: Laptop → VPS

**Symptom:** Hermes (the Telegram agent) runs on a laptop. Laptop sleeps, agent dies, messages go unanswered, scheduled jobs silently skip. Unacceptable for anything client-facing.

**Target:** Hermes runs on a small VPS with auto-restart, boots on reboot, survives crashes. The Hostinger KVM 2 plan (~$8–10/mo) already used in client setups is fine. Any 2 vCPU / 8 GB box works.

### One-time VPS prep
```bash
# as root on the fresh VPS
adduser --system --group --home /opt/hermes hermes
apt-get update && apt-get -y upgrade
apt-get -y install ufw fail2ban
ufw default deny incoming && ufw default allow outgoing
ufw allow ssh          # remove after Tailscale SSH is confirmed working (§3)
ufw enable
```
Hermes talks *outbound* to Telegram's API (long polling). It needs **zero inbound public ports**. Keep it that way — if you later use webhooks, put them behind Tailscale, not the public internet.

### Option A — systemd (default choice)
`/etc/systemd/system/hermes.service`:
```ini
[Unit]
Description=Hermes Telegram agent
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=hermes
Group=hermes
WorkingDirectory=/opt/hermes
EnvironmentFile=/etc/hermes/hermes.env
ExecStart=/usr/bin/node /opt/hermes/index.js
# python variant: ExecStart=/opt/hermes/.venv/bin/python /opt/hermes/main.py
Restart=always
RestartSec=5
StartLimitIntervalSec=0

# Hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/hermes/data
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
```bash
systemctl daemon-reload
systemctl enable --now hermes
systemctl status hermes          # verify
journalctl -u hermes -f          # live logs
```
`Restart=always` + `enable` = survives crashes AND reboots. Test both before calling it done: `kill -9` the process and watch it come back; `reboot` the VPS and watch it come back.

### Option B — Docker
`/opt/hermes/docker-compose.yml`:
```yaml
services:
  hermes:
    build: .
    restart: always            # the whole point
    env_file: /etc/hermes/hermes.env
    volumes:
      - ./data:/app/data
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }
```
`docker compose up -d`. For an already-running container: `docker update --restart=always hermes`. Docker's daemon starts on boot, so `restart: always` covers reboots too.

### Env and secrets handling
- Secrets live in **one file on the VPS**: `/etc/hermes/hermes.env`, owned `root:hermes`, mode `640`. Never in the repo, never in the image, never in a Telegram message to yourself.
  ```bash
  install -o root -g hermes -m 640 hermes.env /etc/hermes/hermes.env
  ```
- Contents (typical): `TELEGRAM_BOT_TOKEN`, CRM API key, Meta access token, LLM provider API keys, `STRIPE_KEY` (use a **restricted** key — read charges, create invoices, nothing else).
- The canonical copy of every secret lives in the password manager, not on any laptop. The VPS file is a deployment artifact you can recreate in 5 minutes.
- Rotate: quarterly, plus immediately on any laptop loss/repair, team change, or repo migration (§4).
- Least privilege per token: Meta token scoped to the specific ad account; CRM key scoped to the sub-account; never reuse one god-token across Hermes and GIZMO — when one leaks you should only have to rotate one system.

### Monitoring (10 minutes, do it now)
- Add a heartbeat: Hermes pings a free dead-man's-switch (healthchecks.io / cron `curl`) every 5 minutes; you get a Telegram/email alert when it stops. An agent that fails silently is worse than no agent.

---

## 2) Vercel Blob: Maxed Out

Full recon in `docs/research/vercel-status.md`. Summary: the account is a Hobby-style personal team (43 static projects, all healthy). Hobby Blob is a fixed free allotment (~1 GB storage / ~10 GB transfer per month) with **no overage billing — when it's maxed, uploads block until the cycle resets or you upgrade.** The Content Engine outputs dozens of videos a day; Blob was never going to hold.

### Immediate (today, ~30 min)
1. Check real usage: Vercel dashboard → Storage → the blob store → Usage (not readable via API tooling).
2. Delete the fat: `vercel blob list --limit 100`, then `vercel blob del <pathname>` for videos/large media. Batch version: `@vercel/blob` `list()` + `del(batch)` loop with cursor pagination and backoff on `BlobServiceRateLimited` (script pattern in the research doc).
3. If uploads must work *today* and cleanup isn't enough: upgrade to Pro (~$20/mo), set a Spend Management cap immediately so a runaway upload can't become a surprise bill.

### Permanent (this week): media moves to Cloudflare R2
- **R2:** 10 GB free, zero egress fees, S3-compatible. (Alternative: Bunny Storage + CDN at ~$0.01/GB if you want a pure CDN play.)
- Create bucket `elevated-media`, enable public access via a custom domain, e.g. `media.elevatedaisolutions.com`.
- Upload path for the engine: workers write finished renders to R2 (S3 API), pages reference `https://media.elevatedaisolutions.com/...`.
- Migrate existing assets: `vercel blob list` → download → `rclone copy ./media r2:elevated-media` → update references → delete blobs.
- **Standing rule: no video ever goes in Vercel Blob again.** Blob is for small dynamic uploads only (form attachments, tiny images), with long `cacheControlMaxAge` so reads hit the CDN cache instead of counting as transfer.

---

## 3) Tailscale: Private Network + Agent Isolation

Goal: agents talk to each other over a private tailnet, admin access goes over Tailscale SSH, and **GIZMO is reachable by Hermes on exactly one port — nothing else.** No agent API is ever exposed to the public internet.

### Tailnet layout

| Node | Tag | MagicDNS name | Runs |
|---|---|---|---|
| Hermes VPS | `tag:hermes` | `hermes.<tailnet>.ts.net` | Hermes agent, its API on :8686 |
| GIZMO sandbox host | `tag:gizmo` | `gizmo.<tailnet>.ts.net` | GIZMO in one container/VM, agent API on :8787 |
| Content Engine worker | `tag:engine` | `engine.<tailnet>.ts.net` | render/caption/publish workers |
| Founder laptops | (user devices) | `dylan-laptop`, `conor-laptop` | admin only, run nothing |

Enable **MagicDNS** so config says `http://gizmo:8787`, not an IP that changes. Servers: disable key expiry on the tagged nodes (Machines → node → Disable key expiry) so a forgotten 180-day expiry doesn't take production down.

### ACL (default-deny; only what's listed is allowed)
Tailscale admin console → Access Controls:
```jsonc
{
  "tagOwners": {
    "tag:hermes": ["autogroup:admin"],
    "tag:gizmo":  ["autogroup:admin"],
    "tag:engine": ["autogroup:admin"]
  },
  "acls": [
    // Admin laptops can reach everything (ops/debug).
    { "action": "accept", "src": ["autogroup:admin"], "dst": ["*:*"] },

    // Agent-to-agent: Hermes may call GIZMO's API, and only that port.
    { "action": "accept", "src": ["tag:hermes"], "dst": ["tag:gizmo:8787"] },

    // GIZMO may call back to Hermes' API, and only that port.
    { "action": "accept", "src": ["tag:gizmo"], "dst": ["tag:hermes:8686"] },

    // Engine workers may receive jobs from Hermes.
    { "action": "accept", "src": ["tag:hermes"], "dst": ["tag:engine:8080"] }
  ],
  "ssh": [
    { "action": "check", "src": ["autogroup:admin"],
      "dst": ["tag:hermes", "tag:gizmo", "tag:engine"],
      "users": ["root", "hermes", "gizmo"] }
  ]
}
```
What this buys you:
- GIZMO cannot reach the engine, the laptops, or anything else — if it's ever compromised or just misbehaves, the blast radius is one API on one box.
- No public ports anywhere: bind every agent API to the Tailscale interface only (listen on the node's `100.x.y.z` address or `tailscale0`), keep UFW deny-all inbound, then remove the public SSH allow once Tailscale SSH (`check` mode = re-auth prompt) is confirmed.
- `tailscale serve` can front an internal dashboard with HTTPS inside the tailnet if you want the admin panel (`content-engine/admin/`) private instead of public.

---

## 4) GitHub Consolidation: One Org, Sandboxed Agents

**Now:** repos scattered across personal accounts, mirrored copies in Drive, 43 Vercel projects deploying from mixed sources, agents holding tokens with personal-account reach.

**Target:** one `elevated-ai` GitHub org. Everything deploys from it. Agents get machine accounts with least-privilege tokens.

### Steps
1. **Create the org** `elevated-ai` (free tier is fine). Owners: the two founders. Enforce 2FA org-wide. Enable secret scanning + push protection on all repos (free for public; make private repos' history clean per step 4).
2. **Migrate repos** (GitHub transfer keeps issues/stars; redeploy links from Vercel after transfer). Initial list, matching the live Vercel projects:
   - `content-engine` (platform + funnel pages in this repo's `content-engine/`)
   - `ads-system` (GIZMO's funnel + docs)
   - `botmo` (site + audit worker)
   - `elevated-lp`, `logan-alpha`, `ai-sales-team`, other live client funnels
   - `hermes` (agent code), `gizmo` (agent code), `engine-workers` (render/caption/publish)
   - Archive, don't migrate, the dead experiments (the one-off `*-optins`, spare share pages). Fewer repos = smaller attack surface.
3. **Reconnect Vercel** to the org repos project by project; confirm each domain still serves, then delete stale project links.
4. **Rotate every secret at migration time.** Assume old repo history contains leaked keys until proven otherwise — run secret scanning across the migrated history, then rotate regardless: Meta tokens, CRM keys, Stripe keys, Telegram bot token, Vercel tokens, R2 keys, LLM provider keys. Migration day is rotation day; you're touching everything anyway.
5. **Branch protection** on `main` for anything that auto-deploys: PRs required for the funnel repos during sales weeks. A typo'd force-push to a live sales page during launch month is a real revenue event.

### GIZMO sandboxing (least privilege, one box)
- GIZMO lives in **one container/VM on the `gizmo` host** (§3) — never on a laptop, never sharing a box with Hermes.
- GitHub access via a **machine user** (`elevated-ai-gizmo`) holding a **fine-grained PAT**: repository access = only the 1–2 repos it needs (e.g. `ads-system` creative output), permissions = Contents read/write on those repos, nothing org-level, no admin, 90-day expiry with a calendar reminder.
- Same doctrine for every credential GIZMO holds: Meta token scoped to the client's own ad account (clients pay Meta directly on their own accounts — multi-tenant isolation rule), CRM key scoped to the sub-account. Remember the standing lesson: a prior over-eager API integration triggered a Meta usage block that is *still* being cleaned up (`docs/conor-funnel-fixes.md` §5c). Rate-limit GIZMO's Meta calls in code, not in hope.
- Hermes gets its own machine user with its own scopes. One leaked token = one rotation, one system.

---

## 5) Backups & Recovery

Three questions per system: where's the source of truth, where's the copy, when did you last test a restore?

| System | Source of truth | Backup | Test |
|---|---|---|---|
| Code + funnel pages | GitHub org | Git is the backup; Vercel redeploys from it in minutes | Redeploy one project cold, quarterly |
| Agent state (Hermes/GIZMO data dirs) | VPS `/opt/*/data` | Nightly `restic` to R2 (encrypted, versioned) + weekly Hostinger snapshot | Restore one file monthly |
| Secrets | Password manager (single vault) | Manager's own export, stored offline | On every rotation |
| Media / renders | R2 bucket | R2 object versioning on; monthly `rclone sync` to a second bucket/provider | Spot-check URLs monthly |
| CRM (contacts, pipelines, workflows) | The CRM | Monthly contact CSV export + screenshots of workflow configs to Drive | With each export |
| Stripe | Stripe | It is its own system of record; enable email receipts to a shared inbox | — |

Nightly agent-state backup (cron on each VPS):
```bash
# /etc/cron.d/restic-backup  (02:30 nightly)
30 2 * * * root restic -r s3:https://<accountid>.r2.cloudflarestorage.com/elevated-backups \
  backup /opt/hermes/data /etc/hermes --tag hermes && restic forget --keep-daily 7 --keep-weekly 4 --prune
```
`RESTIC_PASSWORD` and R2 keys live in `/root/.restic.env` (mode 600) — and in the password manager.

**Recovery targets:** funnel page down → redeploy from git, < 15 min. Hermes VPS dead → new VPS + systemd unit + env file + restic restore, < 60 min. Laptop stolen → zero production impact (that's the whole point of this document), rotate its cached credentials same day.

---

## Standing Rules

1. Nothing revenue-touching runs on a laptop.
2. No agent API on the public internet. Tailnet only.
3. No video in Vercel Blob. R2 serves media.
4. One token, one system, one scope. Rotation is a calendar event, not a crisis response.
5. Every automation has a heartbeat alert. Silent failure is the only unacceptable failure.
6. Test one restore a month. An untested backup is a rumor.
