# The Content Engine — Email Sequences

**Product:** The Content Engine (Elevated AI)
**Last updated:** July 2026
**Voice:** Second person. Short sentences. Specific numbers. No corporate jargon. No emojis. No fake testimonials — "pilot" framing only.

---

## Setup notes (read before loading into your ESP)

**Merge tags used:**

| Tag | What it is |
|---|---|
| `{{first_name}}` | Recipient first name (fallback: "there") |
| `{{company}}` | Recipient company name (fallback: "your business") |
| `{{tier_name}}` | Tier purchased: Engine / Engine + Influencer / Full Stack |
| `{{vsl_link}}` | `/content-engine/vsl.html` |
| `{{pricing_link}}` | `/content-engine/index.html#pricing` |
| `{{resume_checkout_link}}` | Stripe-recovered checkout URL |
| `{{upsell_checkout_link}}` | `https://buy.stripe.com/REPLACE_CE_UPSELL_DFY_LAUNCH` |
| `{{onboarding_form_link}}` | Onboarding form URL (placeholder) |
| `{{capture_kit_link}}` | Clone Capture Kit URL (placeholder) |
| `{{calendar_link}}` | Build-call scheduler URL (placeholder) |
| `{{dashboard_link}}` | Client dashboard URL (placeholder) |
| `{{support_email}}` | support@elevatedaisolutions.com (placeholder) |
| `{{unsubscribe_link}}` | ESP unsubscribe (required) |
| `{{mailing_address}}` | Physical address for CAN-SPAM footer (placeholder) |

**Sending rules:**

- From name: a real human at Elevated AI (e.g., "Logan at Elevated AI"). Never "noreply."
- Plain-text look. No header images, no heavy HTML. One primary link per email.
- Every email carries the footer: `{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}`
- Canonical figures only: $1,500 setup · $997 / $1,997 / $2,997 per month · DFY Launch $4,997 one-time.
- Guarantee language is always keep-working-free. Never money-back.

---

# Sequence 1 — Launch (cold list → VSL)

**Goal:** get the click to the 6-minute VSL. Sell the click, not the product.
**Cadence:** Day 0, 2, 4, 6, 8. Stop on purchase or checkout start.

---

### Email 1 of 5 — Day 0

**Subject:** I didn't film this
**Preview text:** Nobody did. That's the point.

{{first_name}} —

Quick confession.

The best video we've ever produced wasn't filmed. No camera. No studio. No editor.

The person on screen is an AI clone, built from about 20 minutes of reference footage. And most people can't tell.

That clone now ships reels every day — scripted, edited, captioned, scheduled — while its owner runs the business.

We recorded a 6-minute breakdown showing exactly how the machine works. The presenter is the clone. The video is its own demo.

Watch it here: {{vsl_link}}

If you've ever said "I know I should post more," these are the most useful 6 minutes you'll spend this week.

— Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 5 — Day 2

**Subject:** $250 per video vs $25 per video
**Preview text:** The math your agency hopes you never do.

{{first_name}} —

Do this math once and you can't unsee it.

A human UGC video costs $150–$250. An in-house editor is ~$100k fully loaded — for 1–2 videos a day. A "$5k/mo" agency quietly becomes $67k–$100k a year once creative production and tool fees hit the invoice. For 15–20 assets a month.

Now the other column.

The Content Engine ships 50+ posts and 30 reels a month — 80 finished assets — for $1,997 a month. That's about $25 per asset. Your face, your voice, your offer. Nothing publishes without your approval.

Same output as a creative department. A tenth of the payroll.

The 6-minute breakdown shows the whole machine: {{vsl_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 5 — Day 4

**Subject:** One voice memo. Fifty posts.
**Preview text:** A Tuesday with the Engine installed.

{{first_name}} —

Here's a Tuesday with the Engine running at {{company}}.

9:04 am — you record a 4-minute voice memo on your drive in. A client win. An opinion. Anything.

9:45 — the Engine has cut it into 12 posts and 3 reel scripts, each with a hook, a payoff, and B-roll markers.

10:15 — your clone has "filmed" all three reels. Captions burned in. Loop point checked.

10:20 — your phone buzzes once. You scroll the approval queue at lunch, kill the one you don't love, approve the rest. Two minutes.

The rest of the week runs itself. Posts drip out at peak times on every platform. A blog targeting a keyword your buyers search goes live on your site.

That's the whole job. One input in, fifty outputs out.

See it end to end (6 minutes): {{vsl_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 4 of 5 — Day 6

**Subject:** "Won't it look like AI?"
**Preview text:** Fair question. Here's the honest answer.

{{first_name}} —

The three questions everyone asks before watching the breakdown:

**"Won't it look like AI?"**
The clone is built from your real footage and your real voice. Scripts follow the organic formats already winning your feed. And here's the kicker: UGC-style creative runs ~4x the CTR of polished brand content at about half the CPC — precisely because it doesn't look produced. If a video reads fake to you, you kill it with one tap. Nothing ships without your approval.

**"Is this even allowed?"**
Yes. TikTok and Meta allow AI content when labeled, and the Engine applies the right label per platform automatically. Meta has said its AI label carries no distribution penalty.

**"Who owns the clone?"**
You do. Your likeness, your voice model, every asset — contractually yours. Cancel and we hand over the files.

The clone answers the rest itself, on camera, in 6 minutes: {{vsl_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 5 of 5 — Day 8

**Subject:** Onboarding closes when the slots fill
**Preview text:** 50 posts in 30 days — or we work free.

{{first_name}} —

Last note on this, then I'll stop.

Two things you should know before deciding:

**1. The guarantee.** 50 posts live in your first 30 days, or we keep working free until they are. No refund theater. The Engine delivers or we don't stop.

**2. The calendar.** Clone builds are hands-on — voice calibration, movement capture, review passes. We onboard a limited number of new engines each month. When this month's slots fill, the next batch starts 30 days later. That's a month of content your competitors post and you don't.

Plans start at $997/mo with a $1,500 one-time setup. Most people pick Engine + Influencer at $1,997 — that's the clone tier.

Watch the breakdown, then pick your tier: {{vsl_link}}

Or skip straight to pricing: {{pricing_link}}

— Logan

P.S. Still on the fence? Reply to this email with your biggest hesitation. A human reads every reply.

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 2 — Cart / Checkout Abandonment

**Trigger:** started checkout, no purchase.
**Cadence:** +1 hour, +24 hours, +72 hours. Stop on purchase.

---

### Email 1 of 3 — 1 hour after abandonment

**Subject:** Your Engine is still sitting there
**Preview text:** Your tier is saved. Two minutes to finish.

{{first_name}} —

You picked a tier. You didn't finish checkout.

Usually that's a meeting, a kid, or a card in another room — not a change of heart. So we saved your spot.

Finish here (about 2 minutes): {{resume_checkout_link}}

Quick recap of what starts the moment you do:

- Onboarding form hits your inbox today
- Clone Capture Kit within 24 hours (~20 minutes of footage, phone is fine)
- First 50 posts in your approval queue by Week 2
- First clone reel within 21 days

If something on the checkout page stopped you, reply and tell me what. I'll give you a straight answer.

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 3 — 24 hours after abandonment

**Subject:** The guarantee, in one sentence
**Preview text:** 50 posts live in 30 days — or we keep working free.

{{first_name}} —

Here's the sentence that closes most fence-sitters:

**50 posts live in your first 30 days — or we keep working for free until they are.**

Not "money back if you fill out a form." We keep working. The risk of the Engine not delivering sits with us, not you.

And the things people usually stall on:

- **Contract?** Month to month. No annual lock-in.
- **My time?** ~20 minutes a week in the approval queue after setup week.
- **Ownership?** Your clone, your voice model, your content. Cancel and keep everything.
- **Looks like AI?** Nothing publishes without your one-tap approval.

Your checkout is still saved: {{resume_checkout_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 3 — 72 hours after abandonment

**Subject:** Releasing your build slot tomorrow
**Preview text:** Slots are per month. Yours goes back in the pool.

{{first_name}} —

Housekeeping note.

Clone builds are hands-on, so we onboard a limited number of new engines each month. Starting checkout held a build slot for you. Tomorrow we release it back to the pool for this month's batch — the next batch starts about 30 days later.

If it's a no, no hard feelings. Delete this and you won't hear about it again.

If it's a "yes, but not $1,997" — start smaller. The Engine tier is $997/mo: 50+ posts a month, SEO blog autopilot, auto-scheduling, approval workflow. No clone yet. Upgrade whenever the posts prove it out.

Finish checkout (2 minutes): {{resume_checkout_link}}
Or compare tiers again: {{pricing_link}}

Either way — decide. A month of daily content is worth more than a month of thinking about it.

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 3 — Post-Purchase Onboarding

**Trigger:** successful purchase (any tier).
**Cadence:** immediately, Day 1, Day 3, Day 7.
**Note:** If the buyer took the Done-For-You Launch upsell, suppress Email 2 (capture kit) — their capture session happens on the build call.

---

### Email 1 of 4 — Immediately after purchase

**Subject:** You're in. Do this one 10-minute thing.
**Preview text:** Onboarding form + build call. Everything else is on us.

{{first_name}} —

Welcome to the Engine. Your receipt is attached; your build starts today.

Two things from you — everything else is on us:

**1. Fill the onboarding form (10 minutes).**
Your offer, your voice notes, your account access. This is the only thing that can hold up your build, so do it now:
{{onboarding_form_link}}

**2. Book your build call (30 minutes).**
Your launch strategist walks through footage, brand assets, and access, and locks your Week 2 launch date. Bring nothing — we drive:
{{calendar_link}}

What happens on our side this week: clone build, brand ingest, account wiring, approval workflow. You'll get your dashboard login as pieces go live.

And the guarantee starts now: 50 posts live in your first 30 days, or we keep working free until they are.

— Your launch team at Elevated AI
Questions? Reply here or write {{support_email}}.

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 4 — Day 1

**Subject:** Your Clone Capture Kit (20 minutes, phone is fine)
**Preview text:** Three clips. One take each is fine. Don't overthink it.

{{first_name}} —

Time to film the last footage you'll ever have to film.

Your Clone Capture Kit is here: {{capture_kit_link}}

The short version — three clips, about 20 minutes total, phone camera is fine:

**Clip 1 — Talking head (10 min).** You, chest-up, talking to camera about your business. Natural light from a window. Don't perform. Talk like you're on a Zoom call with a friendly client.

**Clip 2 — Full body (5 min).** Standing, framed knees-up. Gesture like you normally do. Walk a few steps, turn, talk.

**Clip 3 — Range (5 min).** Same framing as Clip 1. Read the short script in the kit — it walks you through emphatic, casual, and serious deliveries so your clone gets your full range.

Rules of thumb: quiet room, no music, one take is fine, mistakes are fine — we cut around everything. Perfect is the enemy of shipped.

Upload straight from your phone via the link in the kit. Footage in by Friday keeps your Week 2 launch date.

— Your launch team

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 4 — Day 3

**Subject:** How to approve like an editor-in-chief
**Preview text:** Your first batch lands next week. Here's the 2-minute habit.

{{first_name}} —

Next week your first 50 posts hit the approval queue. Before they do, steal the habit our best-performing pilot accounts share: they approve fast and kill without mercy.

The 2-minute drill:

- **Scan, don't study.** Your gut read in 3 seconds mirrors how viewers judge it. If frame one bores you, kill it.
- **Kill anything off-brand without guilt.** Every kill teaches the Engine your taste. The queue gets sharper every week because of what you reject.
- **Don't wordsmith.** Rewriting captions by hand is the old job. Leave a one-line note ("too formal," "never say 'folks'") and the Engine applies it to everything after.
- **Batch it.** One sitting, once or twice a week. Most clients are under 20 minutes a week by day 60.

You stay editor-in-chief. You just stop being the factory.

Your dashboard is live now if you want to look around: {{dashboard_link}}

— Your launch team

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 4 of 4 — Day 7

**Subject:** Week 1 done. Here's your status.
**Preview text:** What's built, what's next, what to watch.

{{first_name}} —

End of build week. Status check:

**Built so far:** your clone (in QA passes now), brand and voice ingested, accounts wired, approval workflow live on your dashboard.

**Next week:** your first 50 posts land in the queue. You'll get one notification — that's your cue for the 20-minute review sitting. Approved posts start auto-scheduling to peak times immediately.

**Weeks 3–4:** your clone's first reels go live — 6.3-second loops and 14–16 second formats. First clone reel inside 21 days of your order.

**What to watch on the dashboard:** hook rate (3-second hold) and completion. Those two numbers decide distribution in 2026. The Engine kills anything under a 25% hook rate at 48 hours and scales what wins — you'll see it happen live.

The clock on the guarantee is running: 50 posts live by day 30, or we keep working free until they are.

Anything feel off? Reply here or write {{support_email}} — build-week replies get priority.

— Your launch team

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 4 — Upsell Follow-Up (DFY Launch decliners)

**Trigger:** purchased a tier, declined the $4,997 Done-For-You Launch on the post-checkout page.
**Cadence:** Day 1, Day 3, Day 6. Stop on upsell purchase.
**Framing note:** the upsell page is one-time-viewing. These emails don't resurrect the page — they extend the *decision*: the build slot assigned at checkout is held for 7 days, then released. Day 7 is a hard stop; honor it.

---

### Email 1 of 3 — Day 1

**Subject:** The page is gone. Your build slot isn't — yet.
**Preview text:** We hold it for 7 days after your order. Then it's released.

{{first_name}} —

After checkout you saw a one-time page for the Done-For-You Launch + Clone Build. You passed — completely fine. Standard onboarding is genuinely good, and your build is already moving.

One thing you should know: the done-for-you build slot assigned at your checkout stays reserved for 7 days after your order. After that we release it to the next order in line.

What it is, in one breath: our launch team runs a directed capture session with you (90 minutes, we drive), builds and QAs your clone, scripts and schedules your first 30 reels, wires every account and pixel, and runs your first 100-video testing matrix — then hands you the winners report.

$8,994 of build work. $4,997 once. Your monthly plan doesn't change.

Claim the slot: {{upsell_checkout_link}}

No pressure either way — your capture kit works. This is just faster.

— Your launch team

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 3 — Day 3

**Subject:** 15 hours vs 90 minutes
**Preview text:** Same Engine. Different first month.

{{first_name}} —

The honest math on the two onboarding paths:

**You build it (included):** ~15 hours across four weeks. Filming per the kit, forms, clone review passes, account wiring with our checklist. First clone reel around day 21. First testing matrix weeks 5–8. Autopilot at day 60.

**We build it ($4,997 once):** 90 minutes of your time, total. One directed capture session. We do everything else — including producing your first 30 reels and running your first matrix sprint. Autopilot at day 30.

Value your time at $250 an hour and the hours alone are worth $3,375. Then add the month: 30 days of daily presence — roughly 80 assets — that exist in one timeline and not the other.

You've already made the hard decision. This one's just about speed.

Slot's held through day 7: {{upsell_checkout_link}}

— Your launch team

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 3 — Day 6

**Subject:** Your DFY slot releases tomorrow night
**Preview text:** Last note about this — then we build your Engine either way.

{{first_name}} —

Last email about this, promise.

Tomorrow night your done-for-you build slot goes back into the pool. After that, the $4,997 Done-For-You Launch isn't available for your account — we only run it as part of a fresh launch, and yours will be underway.

If it's a no: excellent. Your capture kit is in your inbox, your launch team is on standby, and the guarantee protects you either way — 50 posts live in 30 days or we keep working free.

If it's a yes: one click, one-time charge, monthly plan unchanged. We take over from here — directed capture, clone build, first 30 reels, full wiring, first matrix run with the winners report on your desk by day 30.

Take the slot: {{upsell_checkout_link}}

Either way — we're building. See you in the approval queue.

— Your launch team

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

## Claims inventory (for compliance pass)

| Claim | Source / framing |
|---|---|
| Tier pricing, $1,500 setup, DFY $4,997 | Canonical offer terms |
| $150–$250 per UGC video / ~$100k loaded editor / $67k–$100k real agency cost | docs/research/market-offer-research.md |
| ~4x CTR at ~half CPC for UGC-style creative | docs/research/short-form-best-practices-2026.md |
| 6.3s loops, 14–16s formats, 25% hook-rate kill threshold, 48h kills | docs/research/short-form-best-practices-2026.md |
| Platform AI labeling (TikTok/Meta), no distribution penalty | docs/research/short-form-best-practices-2026.md |
| Guarantee: keep-working-free, never money-back | House guarantee framing |
| "Pilot accounts" language only — no client testimonials anywhere | House rule: no fake testimonials |
| DFY slot held 7 days post-order, then released | Operational rule — honor the hard stop |
