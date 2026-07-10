# GHL + Stripe Wiring Guide

**Status:** internal build doc, July 2026.
**Scope:** exact wiring for both offers. Part A wires The Content Engine (self-serve SaaS) into **Dylan's GHL + Dylan's Stripe**. Part B wires The AI Ads Department (high ticket) into **Conor's GHL**.
**Cross-references (read alongside, don't duplicate):**

- `content-engine/docs/backend-architecture.md` §4 — Stripe wiring spec (products, checkout, upsell, webhooks, portal) and §10 env vars
- `content-engine/docs/email-sequences.md` — the four Content Engine sequences this doc imports into GHL workflows
- `ads-system/docs/email-sequences.md` — the four Ads Department sequences + the "Sequence routing map" at the bottom
- `docs/conor-funnel-fixes.md` §4 (8-stage pipeline), §6 (calendar settings), §3 (copy consistency checklist)
- `docs/ops-runbook.md` — where the webhook backend actually runs

Account boundary rule, stated once: **Content Engine money flows through Dylan's Stripe and Dylan's GHL location. Ads Department money flows through Conor's Stripe and Conor's GHL location.** Nothing crosses over. The only shared object is the repo's sales pages, which carry per-product Stripe placeholders.

---

# Part A — The Content Engine → Dylan's GHL + Dylan's Stripe

## A1. Ownership map

| Thing | Lives in | Notes |
|---|---|---|
| Products, Prices, Checkout, Portal, refunds | **Dylan's Stripe** | Source of truth for all money state |
| Billing endpoints (`backend/billing_service.py`) | Product repo backend (Vercel API routes per `backend-architecture.md`) | Uses Dylan's Stripe keys |
| Contacts, tags, pipelines, email workflows | **Dylan's GHL location** | CRM + ESP layer only; GHL never charges a card for this product |
| Sales pages (`content-engine/*.html`) | This repo, deployed on Vercel | GHL funnel steps point at these URLs |

## A2. Stripe: Products and Prices

Create in Dylan's Stripe with **lookup keys** (canonical table lives in `backend-architecture.md` §4.1; repeated here because this is the doc you'll have open while clicking):

| Product name | Lookup key | Price | Type | Env var |
|---|---|---|---|---|
| The Content Engine — Starter | `ce_starter` | $49/mo | recurring | `STRIPE_PRICE_STARTER` |
| The Content Engine — Creator | `ce_creator` | $297/mo | recurring | `STRIPE_PRICE_CREATOR` |
| The Content Engine — Influencer | `ce_influencer` | $997/mo | recurring | `STRIPE_PRICE_INFLUENCER` |
| Done-For-You Launch + Clone Build | `ce_upsell_dfy` | $4,997 | one-time | `STRIPE_PRICE_DFY` |

Rules (full rationale in `backend-architecture.md` §4.1):

- **No setup-fee product exists.** If a `ce_setup` or any $1,500 setup / $997-$1,997-$2,997 tier artifact survives from the old pricing iteration, archive it now (prices are immutable — archive, never delete, never edit).
- The 14-day money-back guarantee is a **refund policy, not a Stripe trial**. Do not set `trial_period_days`. Refunds within the window are processed manually or via the Customer Portal.
- To change a price later: create a new Price, repoint the lookup key, update the matching `STRIPE_PRICE_*` env var. No code change.

### Payment Links vs Checkout Sessions

- **Payment Links** are now viable for the three tiers (single recurring line item, no setup fee), and they're the fastest thing to paste behind the `https://buy.stripe.com/REPLACE_CE_STARTER` / `REPLACE_CE_CREATOR` / `REPLACE_CE_INFLUENCER` placeholders on `content-engine/index.html` for day-one launch.
- **But the one-click upsell requires a server-created Checkout Session** (a Payment Link can't save the payment method for an off-session charge). So the end state is: all three tier buttons call `POST /api/billing/checkout` with `{ tier }`, which creates the Checkout Session per `backend-architecture.md` §4.2 (`saved_payment_method_options: { payment_method_save: "enabled" }`, success URL → `upsell.html?session_id={CHECKOUT_SESSION_ID}`, cancel URL → `index.html#pricing`).
- Practical sequencing: launch on Payment Links if the backend isn't deployed yet, swap to Checkout Sessions before turning on paid traffic — the upsell is worth too much to skip.

### One-click upsell ($4,997 DFY)

Flow per `backend-architecture.md` §4.3:

1. `checkout.session.completed` fires → webhook handler stores `customer` + default `payment_method`.
2. Buyer lands on `content-engine/upsell.html`. The accept button hits the billing service with the origin `session_id`; the server charges $4,997 **off-session** via PaymentIntent (`metadata.kind = ce_upsell_dfy`) — no card re-entry.
3. Decline of `authentication_required` (3DS) → fall back to a normal one-time Checkout Session for `ce_upsell_dfy`. The `REPLACE_CE_DFY` placeholder is this fallback link and the link used in the decliner email sequence.
4. Accept or decline, the page continues to `thank-you.html`.

### Customer Portal

Enable in Dylan's Stripe (Settings → Billing → Customer Portal): card updates, invoice history, cancel **at period end**, tier switches allowed between the three CE prices with proration. Store the config id in `STRIPE_PORTAL_CONFIG_ID`. Link it from the client dashboard header, not from marketing pages.

## A3. Backend scaffold: `backend/billing_service.py`

The billing surface already exists as a scaffold in the product repo — **do not rebuild it**. Endpoint map:

| Endpoint | Does | Spec section |
|---|---|---|
| `POST /api/billing/checkout` | Takes `{ tier }` (`starter\|creator\|influencer`), resolves the Price from `STRIPE_PRICE_STARTER/CREATOR/INFLUENCER`, creates the Checkout Session; also carries the one-click DFY charge path resolving `STRIPE_PRICE_DFY` | `backend-architecture.md` §4.2–4.3 |
| `POST /api/billing/webhook` | Verifies Stripe signature, inserts raw event into `webhook_events` (idempotent on `event.id`), dispatches per event type | §4.4 |
| `GET /api/billing/status` | Returns current subscription tier/status for a customer — backs the dashboard header and the GHL sync sanity checks below | §4.5 / §9 |

The scaffold reads the four `STRIPE_PRICE_*` env vars rather than hardcoded ids. Remaining work per the spec: wire it to Supabase (`users`/`subscriptions`) and Hermes notifications, plus the GHL forwarding in A7 below.

## A4. GHL funnel steps ↔ repo pages

Build one funnel in Dylan's GHL (Sites → Funnels → "Content Engine"). The pages are self-contained HTML deployed on Vercel; GHL funnel steps exist for tracking, domain consistency, and workflow triggers — **do not rebuild the pages in the GHL page builder**. Each step is a redirect (or an iframe-free custom-code step pasting the deployed URL is not needed; plain redirect steps are fine).

| # | GHL funnel step | Repo page | Purpose | Exit |
|---|---|---|---|---|
| 1 | Sales page | `content-engine/index.html` | Offer + pricing, three tier CTAs (`REPLACE_CE_STARTER/CREATOR/INFLUENCER` → Checkout Sessions per A2) | Stripe Checkout |
| 1b | VSL (secondary path) | `content-engine/vsl.html` | 6-minute VSL; single CTA back to `#pricing` | Step 1 |
| 2 | Checkout | Stripe-hosted | Created by `/api/billing/checkout` | success → step 3, cancel → step 1 `#pricing` |
| 3 | Upsell | `content-engine/upsell.html` | One-time-view $4,997 DFY one-click | Accept or decline → step 4 |
| 4 | Thank you | `content-engine/thank-you.html` | Confirms purchase, points to dashboard login | Onboarding sequence takes over |

Wire GHL page-view tracking (or just UTM discipline) so "hit checkout but no purchase" is observable; the actual abandonment *trigger* comes from Stripe/backed tags (A5), not GHL page views, because checkout happens on Stripe's domain.

## A5. Tag taxonomy (Dylan's GHL)

All automation keys off tags. One writer: the Stripe→GHL bridge (A7), plus the ESP opt-in form for `lead_*` tags.

| Tag | Applied when | Applied by |
|---|---|---|
| `lead_cold` | Contact added to cold list / lead magnet opt-in | Import / form |
| `vsl_watched` | VSL watch event (if tracked) | GHL page trigger (optional) |
| `purchase_started` | Stripe `checkout.session` created / checkout page reached, no completion | Bridge (A7) |
| `purchased` | `checkout.session.completed` | Bridge |
| `tier_starter` / `tier_creator` / `tier_influencer` | Same event, from `subscription_data.metadata.tier` | Bridge |
| `upsell_declined` | Upsell page decline (or 24h after `purchased` with no DFY charge) | Bridge / workflow wait-step |
| `dfy_purchased` | `payment_intent.succeeded` with `metadata.kind = ce_upsell_dfy` | Bridge |
| `past_due` | `invoice.payment_failed` | Bridge |
| `churned` | `customer.subscription.deleted` | Bridge |
| `refunded` | `charge.refunded` | Bridge |

Tier changes (portal upgrades/downgrades): the bridge swaps `tier_*` tags on `customer.subscription.updated`.

## A6. Email sequences → GHL workflows

Source of truth for copy: `content-engine/docs/email-sequences.md`. Import each sequence as one GHL workflow. Merge-tag translation: `{{first_name}}` → `{{contact.first_name}}`, `{{company}}` → `{{contact.company_name}}`, the rest ({{vsl_link}}, {{dashboard_link}}, {{support_email}}, etc.) become custom values in GHL Settings → Custom Values so one edit updates every email.

| GHL workflow | Source sequence | Trigger | Stop / removal conditions | Branches |
|---|---|---|---|---|
| CE-1 Launch | Sequence 1 (5 emails, Day 0/2/4/6/8) | Tag `lead_cold` added | Remove on `purchase_started` or `purchased` | none |
| CE-2 Checkout Abandonment | Sequence 2 (3 emails, +1h/+24h/+72h) | Tag `purchase_started` added | Remove on `purchased` | none |
| CE-3 Post-Purchase Onboarding | Sequence 3 (4 emails, 0/D1/D3/D7) | Tag `purchased` added | Remove on `refunded` or `churned` | Email 2 (clone footage) sends **only if** `tier_influencer` AND NOT `dfy_purchased` — if/else branch on those two tags |
| CE-4 DFY Decliners | Sequence 4 (3 emails, D1/D3/D6) | Tag `upsell_declined` added | Remove on `dfy_purchased`; hard stop after Day 6 email (7-day slot rule in the copy is real — honor it) | none |
| CE-5 Dunning (minimal) | not in the sequences doc; 1–2 plain payment-fix emails | Tag `past_due` added | Remove when tag removed (`invoice.paid`) | none |

Workflow settings for all of the above: "Allow re-entry" **off** except CE-2 (a contact can abandon twice), sender = a real human at Elevated AI per the sequences doc's sending rules, and every email carries the CAN-SPAM footer custom values.

## A7. Stripe → GHL bridge (webhook flow)

Do **not** use GHL's native Stripe integration as the source of events here — it's built for payments taken through GHL order forms, and checkout happens on Stripe-hosted pages owned by the billing service. Instead:

```
Stripe (Dylan) ──signed webhook──► POST /api/billing/webhook (billing_service.py)
                                        │  1. verify sig, insert webhook_events (idempotent)
                                        │  2. update Supabase users/subscriptions
                                        │  3. notify Hermes (ops)
                                        └──► 4. forward to GHL Inbound Webhook URL
                                                  { email, event, tier, kind }
GHL workflow "Stripe Bridge" (trigger: Inbound Webhook)
   └► upsert contact by email → apply/remove tags per A5 table
       (tags then trigger CE-1..CE-5 and pipeline moves)
```

Implementation notes:

- In Dylan's GHL create one workflow, trigger type **Inbound Webhook** (Premium Triggers & Actions must be enabled on the location). Copy its unique URL into the billing service env (`GHL_INBOUND_WEBHOOK_URL`, add it next to the §10 vars).
- The forward payload only needs `email`, `event` (one of the A5 rows), `tier`, `kind`. Keep Stripe ids out of GHL; money state lives in Stripe/Supabase, GHL only needs marketing state.
- Idempotency lives in the billing service (`webhook_events` on `event.id`), so GHL-side duplicate protection isn't needed beyond "re-applying an existing tag is a no-op."
- `purchase_started`: emit when the Checkout Session is **created** by `/api/billing/checkout` (you know the email if the contact came from the funnel; if anonymous, emit on Stripe's `checkout.session.expired` instead and accept the shorter recovery window). `{{resume_checkout_link}}` in Sequence 2 is the Stripe-recovered checkout URL from the session.
- `upsell_declined`: emitted by the upsell page's decline path via the billing service; belt-and-suspenders fallback is a CE-3 workflow branch that waits 24h after `purchased` and applies the tag if `dfy_purchased` is absent.

## A8. Pipeline (Dylan's GHL)

Self-serve SaaS needs a thin pipeline, not the 8-stage sales pipeline. Opportunities → Pipelines → "Content Engine":

| Stage | Entry trigger |
|---|---|
| Lead | `lead_cold` added |
| Checkout Started | `purchase_started` |
| Customer | `purchased` (record monetary value = tier price) |
| Customer + DFY | `dfy_purchased` |
| Past Due | `past_due` |
| Churned / Refunded | `churned` or `refunded` |

All moves are automated off the A5 tags (Workflow action: "Move opportunity"). Nobody should be dragging cards in a self-serve funnel.

## A9. Go-live test checklist (run in Stripe test mode end to end)

1. Buy each tier with test card `4242…`: contact appears in GHL with `purchased` + correct `tier_*`, CE-3 fires, CE-1/CE-2 stop, opportunity lands in Customer.
2. Start checkout, close the tab: `purchase_started` applied, CE-2 email 1 arrives at +1h, buying afterwards removes the contact from CE-2.
3. Take the upsell: single off-session charge, `dfy_purchased` applied, CE-4 never fires, CE-3 Email 2 suppressed.
4. Decline the upsell: `upsell_declined` applied, CE-4 Day 1 email arrives, CE-4 stops if the fallback DFY link is used.
5. Fail a renewal (Stripe test clock): `past_due` applied, Hermes alert fires, `invoice.paid` clears it.
6. Cancel via portal: cancel-at-period-end reflected by `/api/billing/status`; `churned` applied at period end.
7. Influencer vs Starter purchase: confirm clone-footage email only reaches the Influencer buyer.

---

# Part B — The AI Ads Department → Conor's GHL (high ticket)

## B1. Funnel shape

```
Meta ads → ads-system/vsl.html (11-min VSL)
        → ads-system/index.html (offer page, secondary)
        → GHL calendar booking (30-min install call)
        → one-call close on the call:
            $19,997 install (Stripe invoice or REPLACE_ADS_INSTALL payment link, paid on/after the call)
        → onboarding (Sequence 4) → go-live
        → $1,997/mo operations subscription starts at go-live
        → post-purchase upsell page: Content Engine Influencer bundle at $747/mo (REPLACE_ADS_BUNDLE)
```

This is the same funnel skeleton diagnosed in `docs/conor-funnel-fixes.md`; every fix there applies. In particular the copy sweep in §3 (everything says "quick 30 minute call", no em dashes client-facing) must be done in Conor's GHL account before ads restart.

## B2. Pipeline: the 8 stages

Create per `docs/conor-funnel-fixes.md` §4 — that section has the full stage definitions and automation triggers; build it exactly as written. Summary for quick reference (pipeline order as in §4):

| Stage | One-liner | Automation (detail in funnel-fixes §4) |
|---|---|---|
| Lead Form | Opted in from VSL page, hasn't booked | Speed-to-lead SMS with booking link in 5 min; 4-touch no-book nudge over 3 days |
| Booked Call | Appointment confirmed | Confirmation email + 24h email / 1h SMS / 10-min SMS reminders (funnel-fixes §3 rows 5–8) |
| Needs to Reschedule | Asked to move the call | Instant reschedule link, 3-touch over 5 days; rebook → Booked Call |
| No Show | Call time passed, never joined | SMS in 10 min, email same day, call task next morning; 7 days silent → Lost |
| Cancellation | Cancelled, didn't rebook | 2-touch win-back; 14 days → Lost |
| Follow Up | Took the call, didn't close, still live | Recap email + 5-touch over 14 days; stalled 21 days → Lost |
| Closed | Paid / signed | Stop sales automations, fire onboarding handoff (B5) |
| Lost | Dead | Tag `lost-{reason}`, monthly nurture + retargeting audience |

Stage moves ride the **Appointment Status** workflow trigger wherever possible; only Follow Up, Closed, and Lost are human moves (funnel-fixes §4 notes).

## B3. Calendar

Configure per `docs/conor-funnel-fixes.md` §6, verbatim: **30 min duration, 30 min post-buffer, 60 min slot interval**, max bookings/day set to the closer's real ceiling, 2–4h minimum notice. Result: one prospect per hour, 30 to close, 30 to onboard inside the buffer. Any additional call type (kickoff, reschedule) gets its own calendar so buffers don't collide.

## B4. Payments (Conor's Stripe)

Products (lookup keys per `backend-architecture.md` §4.1 table, ads rows):

| Product | Lookup key | Price | Vehicle |
|---|---|---|---|
| AI Ads Department — Install | `ads_install` | $19,997 one-time | **Stripe invoice sent live on the call** (preferred: itemized, net-0 terms, card or ACH) or the `REPLACE_ADS_INSTALL` payment link for buyers who want to self-checkout from the thank-you email |
| AI Ads Department — Operations | `ads_ops` | $1,997/mo recurring | Subscription created **at go-live**, not at install payment. Simplest reliable mechanics: at go-live, send a subscription payment link or create the subscription off the saved payment method from the install invoice. Do not backdate; anchor billing to go-live day |
| Agency White-Label | `ads_whitelabel` | $4,997/mo recurring | Same go-live pattern, agency deals only |
| Content Engine Influencer (ads-buyer bundle) | `ads_ce_bundle` | $747/mo recurring | `REPLACE_ADS_BUNDLE` on `ads-system/upsell.html`; saves $250/mo vs the standalone $997 Influencer plan. Note: this bundle price lives in **Conor's** Stripe even though fulfillment is the Content Engine — one buyer, one biller |

Wiring payment state back into Conor's GHL: at this volume (a few installs a month) a full webhook bridge is optional. Minimum viable: Stripe payment notification → whoever ran the call moves the opportunity to **Closed** → the Closed-stage workflow does the rest (B5). If/when automation is wanted, reuse the Part A bridge pattern with Conor's keys: `invoice.paid` (install) → tag `ads_install_paid`; subscription created → `ads_ops_active`.

## B5. Email workflows + onboarding handoff

Copy source: `ads-system/docs/email-sequences.md`. The **"Sequence routing map"** section at the bottom of that file is the trigger table — build the four workflows exactly to it:

| GHL workflow | Source | Trigger | Stop |
|---|---|---|---|
| ADS-1 Cold outbound | Sequence 1 (Day 0/2/5/8/12; Email 1 splits by `in-house` / `agency` tag) | Cold contact added | VSL watched → ADS-2; call booked → stop |
| ADS-2 Post-VSL no booking | Sequence 2 | VSL watched, no booking in 24h | Call booked |
| ADS-3 Proposal follow-up | Sequence 3 | Call held + proposal sent (manual trigger tag `proposal_sent` from Follow Up stage) | Deposit / install paid |
| ADS-4 Onboarding | Sequence 4 | Install paid (opportunity → Closed) | — |

Onboarding checklist handoff, fired by the move to **Closed**:

1. Stop ADS-1/2/3 and all sales automations (funnel-fixes §4, Closed row).
2. Send Sequence 4 Email 1 with `{{onboarding_form_link}}` (access checklist: ad accounts, pixel, domain, creative assets) and `{{kickoff_call_link}}` (separate calendar per B3).
3. Notify the fulfillment channel (Hermes ops channel per `backend-architecture.md` §8.5 pattern — a new install posts the onboarding checklist automatically).
4. Create the kickoff task for the operator with a go-live target date; at go-live, start the $1,997/mo subscription (B4) and, on the upsell page / Sequence 4 Email 3, offer the $747/mo bundle.

## B6. Test checklist

1. Book a live test call: confirmation email + all three reminders arrive saying "quick 30 minute call"; slots render hourly.
2. Reply "R" to the SMS: contact moves to Needs to Reschedule and gets the reschedule link.
3. No-show a test appointment: 10-min SMS, same-day email, next-morning call task all fire.
4. Move a test opportunity to Closed: sales sequences stop, onboarding email + fulfillment notification fire.
5. Pay a $1 test invoice in Stripe test mode: whatever payment→Closed path you chose actually runs.
