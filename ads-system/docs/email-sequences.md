# The AI Ads Department — Email Sequences

**Product:** The AI Ads Department (Elevated AI) — agent codename GIZMO
**Last updated:** July 2026
**Voice:** Second person. Short sentences. Specific numbers. No corporate jargon. No emojis. No fake testimonials — "pilot" framing only.

---

## Setup notes (read before loading into your ESP)

**Merge tags used:**

| Tag | What it is |
|---|---|
| `{{first_name}}` | Recipient first name (fallback: "there") |
| `{{company}}` | Recipient company name (fallback: "your business") |
| `{{agency_name}}` | Recipient's agency name — agency-owner variant only (fallback: "your agency") |
| `{{vsl_link}}` | `/ads-system/vsl.html` |
| `{{pricing_link}}` | `/ads-system/index.html#pricing` |
| `{{install_call_link}}` | Install-call scheduler (`https://cal.com/REPLACE_ELEVATED_AI/install-call`) |
| `{{proposal_link}}` | Per-prospect proposal doc URL |
| `{{deposit_link}}` | `https://buy.stripe.com/REPLACE_ADS_INSTALL_DEPOSIT` |
| `{{baseline_cpa}}` | Prospect's current cost per acquisition, captured on the call |
| `{{monthly_stack_cost}}` | Prospect's current agency + creative spend, captured on the call |
| `{{onboarding_form_link}}` | Onboarding form / access checklist URL (placeholder) |
| `{{kickoff_call_link}}` | Kickoff scheduler (`https://cal.com/REPLACE_ELEVATED_AI/kickoff-call`) |
| `{{slack_invite_link}}` | Private client Slack channel invite (placeholder) |
| `{{dashboard_link}}` | Client reporting dashboard URL (placeholder) |
| `{{bundle_checkout_link}}` | `https://buy.stripe.com/REPLACE_ADS_CE_FULLSTACK_BUNDLE` |
| `{{support_email}}` | support@elevatedaisolutions.com (placeholder) |
| `{{unsubscribe_link}}` | ESP unsubscribe (required) |
| `{{mailing_address}}` | Physical address for CAN-SPAM footer (placeholder) |

**Sending rules:**

- From name: a real human at Elevated AI (e.g., "Logan at Elevated AI"). Never "noreply."
- Plain-text look. No header images, no heavy HTML. One primary link per email.
- Every email carries the footer: `{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}`
- Canonical figures only: **$19,997 install · $1,997/mo operations · $4,997/mo agency white-label · Content Engine Full Stack bundle $2,497/mo (save $500/mo)**. Year one all-in: $43,961. Every year after: $23,964. Anchor: $5k/mo agency + $8k/mo creative team = $156k/yr.
- Guarantee language is always **install fee credited back against operations** if we don't beat the written baseline CPA within 90 days of operations. Never money-back. Never cash refund.
- "4 installs per month" is a real capacity constraint. Only send scarcity emails when it's true.
- Cold sends go to verified B2B contacts only, with a working unsubscribe from email one.

---

# Sequence 1 — Cold outbound → VSL

**Goal:** get the click to the 11-minute VSL, then the install-call booking. Sell the click, not the department.
**Audience:** founders/CMOs spending $10k+/mo on ads (Variant A), and agency owners (Variant B). Email 1 splits by audience; emails 2–5 are shared.
**Cadence:** Day 0, 2, 5, 8, 12. Stop on VSL watch (move to Sequence 2) or call booked.

---

### Email 1 of 5 — Day 0 — VARIANT A: in-house founder / CMO

**Subject:** the two invoices at {{company}}
**Preview text:** Most people never add them up.

{{first_name}} —

Add up two invoices for me.

The first is your ad agency. Call it $5k a month — and read the fine print, because creative isn't included. Neither are the tool fees they pass through.

The second is the creative work around it. An editor, a designer, a content person — about $8k a month fully loaded, running lean.

That's $156,000 a year. For 15–20 assets a month and a report you don't read.

We built the machine that replaces both invoices — the strategy, the media buying, and the entire creative department. It runs about $44k in year one, about $24k a year after. And you own it instead of renting it.

It explains itself in an 11-minute video. The presenter is the system's own creative output — which is sort of the point.

Watch it here: {{vsl_link}}

Worth 11 minutes if either invoice made you wince.

— Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 1 of 5 — Day 0 — VARIANT B: agency owner

**Subject:** this either kills {{agency_name}} or doubles its margin
**Preview text:** Creative is your biggest unbundled cost. We fixed that.

{{first_name}} —

Blunt version first: AI ads departments are coming for the retainer model. You know it. Your clients' procurement teams know it.

Here's the move that makes it your advantage instead.

We built a full AI ads department — CMO-level strategy, daily media buying, and a creative engine that ships up to 50 video variants a day. It licenses white-label at $4,997/mo. Your brand on the reporting, the dashboard, and the creative. Unlimited use across your book.

What that does to your P&L:

- Creative production — your biggest unbundled cost center — becomes margin
- No new media buyer hires as you add accounts
- Two clients at typical retainers covers the license. Everything after is yours

The 11-minute breakdown shows exactly what's inside (the white-label door is near the end): {{vsl_link}}

Watch it before your competitors' pitch decks do.

— Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 5 — Day 2 (shared)

**Subject:** 15 assets a month is why your ads plateau
**Preview text:** Winners are a volume problem. Agencies can't do volume.

{{first_name}} —

Here's the uncomfortable math behind most "our ads stopped working" stories.

Winning ads come from testing 100+ variants per angle — one variable isolated per batch. Hooks. Offers. Openers. Avatars.

Your agency ships 15–20 assets a month. Total. That's not testing. That's guessing slowly and billing monthly.

The AI Ads Department runs the loop no human team has the patience for:

- 100 variants tested at a time
- Anything under a 25% hook rate at 48 hours — killed
- Winners scaled 20–30% every 3–4 days
- Fresh creative every 10–14 days, before fatigue eats the CPA

And it feeds on UGC-style creative — the format running roughly 4x the click-through at about half the cost per click of polished brand ads.

An agency finds a winning ad by luck, a few times a year. A 100-variant matrix finds one on schedule.

The 11-minute breakdown: {{vsl_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 5 — Day 5 (shared)

**Subject:** your Monday, with the department installed
**Preview text:** Total involvement: four minutes.

{{first_name}} —

A Monday at {{company}} with the AI Ads Department running:

7:00 am — GIZMO (the agent that runs it) has already read the weekend. Every campaign, every variant, every dollar. The CMO report is in your inbox before your coffee: two winners found, three variants killed, budgets already shifted.

8:30 — today's creative batch lands: fifty fresh variants built off last week's winning hooks. They pass your brand guardrails and stack in the approval queue.

9:15 — you scroll the queue on your phone. Approve, approve, kill one, approve. Four minutes.

That was your entire involvement in the ads department today.

No status calls. No "quick syncs." No waiting three weeks for a creative refresh.

Watch the full walkthrough — 11 minutes: {{vsl_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 4 of 5 — Day 8 (shared)

**Subject:** cancel your agency and you keep… nothing
**Preview text:** The part of the retainer model nobody says out loud.

{{first_name}} —

Try this thought experiment. Cancel your agency tomorrow. What do you keep?

Not the pixel setup. Not the naming conventions. Not the creative library or the learnings. It all lives in their accounts. You rented a department for years and own zero of it. That's not an accident — it's what keeps you paying.

The AI Ads Department is built the other way around:

- Everything installed in YOUR ad accounts, on your own isolated deployment (Tailscale-secured — your data never touches a shared system)
- SOPs and documentation handed over, so the system runs even if we part ways
- Cancel operations anytime — the tracking architecture, creative library, and playbooks stay yours

And the honest answer to "why not just buy an AI ad tool?" — the market already ran that experiment. Software without an operator is a hobby. This is a system plus an operator plus accountability.

(Agency owner? The white-label license runs the whole thing under your brand at $4,997/mo. Ask on the call.)

Two ways in:

Watch the 11-minute breakdown: {{vsl_link}}
Or skip ahead and book the install call: {{install_call_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 5 of 5 — Day 12 (shared)

**Subject:** closing your file
**Preview text:** One question before I do.

{{first_name}} —

This is the last one from me.

Before I close your file, one question: what's the plan for the $156k/yr problem?

Because "keep paying the agency and hope" is a plan. It's just an expensive one — and next year it costs $156k again, and you still won't own anything.

If the timing is wrong, reply "later" and I'll check back in a quarter. No drip, no games.

If you want to see what you'd be replacing it with, the 11-minute breakdown is here: {{vsl_link}}

And if you're already convinced, book the install call — it's a working session on your real numbers, not a pitch, and you leave with a free audit either way: {{install_call_link}}

We take four installs a month. That's a real capacity limit, not a marketing device.

— Logan
Elevated AI

P.S. The guarantee, in one line: we set your baseline CPA in writing at install — beat it within 90 days of operations, or the $19,997 install fee is credited back against operations.

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 2 — Post-VSL, no call booked

**Trigger:** watched the VSL (or hit the watch page) but didn't book the install call within 24 hours.
**Goal:** book the install call. One idea per email.
**Cadence:** Day 1, 3, 6 after the watch. Stop on booking.

---

### Email 1 of 3 — Day 1

**Subject:** the number you should have written down
**Preview text:** $112,039. Here's where it comes from.

{{first_name}} —

You watched the breakdown. One number is worth writing down: **$112,039.**

That's what stays in your business in year one when the department replaces the standard stack:

- Agency + creative team: $156,000/yr
- AI Ads Department: $19,997 install + $1,997/mo = $43,961 year one
- Difference: $112,039. Year two and after: $132,036 — every year

The install call is where those become your numbers instead of ours. Thirty minutes. Bring your ad account. We pull your real spend, price what your current setup actually costs, and map your first 90 days.

It's a working session, not a pitch. If the math doesn't work for your business, we'll say so — and you keep the audit either way.

Book it here: {{install_call_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 3 — Day 3

**Subject:** what the guarantee actually says
**Preview text:** In writing, at install. Not vibes.

{{first_name}} —

The part of the video most people rewind is the guarantee. Here it is in plain terms.

At install, we set your baseline — your current cost per acquisition, in writing, from your own account data.

If after 90 days of operations the department isn't beating that baseline, the entire $19,997 install fee gets credited back against operations. That's roughly ten months of us working for free until it does.

We can offer that because the testing matrix makes performance a math problem: 100 variants at a time, losers killed at 48 hours, winners scaled on schedule. We're not guessing with your money.

Your agency will never put its retainer on the line. Ask them why.

The baseline gets set on the install call. Book it here: {{install_call_link}}

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 3 — Day 6

**Subject:** 4 installs a month (this isn't a countdown timer)
**Preview text:** It's payroll math. Here's how the queue works.

{{first_name}} —

Last note on this.

Every install is a real build — tracking architecture rebuilt, GIZMO trained on your numbers, creative engine calibrated, launch supervised. A senior operator leads each one. So we take **four installs a month.** Not fake scarcity. Payroll math.

The queue works in booking order. Calls booked this week get scoped for the next open window; when a month fills, the next call books into the month after — while the current stack keeps invoicing you at $13k a month.

If it's a no, no hard feelings — reply and tell me, and I'll stop here.

If it's a "not yet," reply "later" and I'll check back in a quarter.

If it's a "let's look at the numbers," this is the link: {{install_call_link}}

Thirty minutes. Your real data. A free audit either way.

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 3 — Post-call proposal follow-up

**Trigger:** install call completed, proposal sent, not yet signed.
**Goal:** get the deposit. Use the prospect's own numbers from the call — that's what makes these convert.
**Cadence:** Day 0 (2 hours after the call), Day 3, Day 7. Stop on deposit.

---

### Email 1 of 3 — Day 0 (send ~2 hours after the call)

**Subject:** your numbers, in writing
**Preview text:** Everything we walked through, one page.

{{first_name}} —

Good call today. As promised, everything in writing: {{proposal_link}}

Your numbers, from your own accounts:

- Current stack cost: **{{monthly_stack_cost}}/mo**
- Current baseline CPA: **{{baseline_cpa}}** — this is the number we're contractually chasing
- The department: $19,997 install + $1,997/mo operations, month to month once live
- Year one all-in: $43,961 against what you're paying now

What happens when you say go: Week 1 access + audit. Week 2 your isolated deployment and tracking architecture. Week 3 first campaigns live with daily reporting in your Slack. Week 4 handover — SOPs, documentation, training. You own all of it.

And the guarantee from the call, restated: beat {{baseline_cpa}} within 90 days of operations, or the full install fee is credited back against operations.

To lock your install slot: {{deposit_link}}

Questions the proposal doesn't answer — just reply. I read everything.

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 3 — Day 3

**Subject:** what waiting costs at {{company}}
**Preview text:** The do-nothing option has a price tag too.

{{first_name}} —

Quick gut-check on the "let me think about it" math.

Every month at the current setup, {{monthly_stack_cost}} goes out the door — and buys you 15–20 assets, a monthly PDF, and zero equity in the system producing them.

Every month after the install, $1,997 goes out — and buys you 100-variant testing, daily budget moves, daily reporting, and a department you own.

So the real question isn't "should we do this." It's "how many more times do we want to pay {{monthly_stack_cost}} for the old one first?"

One more practical note: your install slot from the call is provisionally held, and we take four installs a month. When this month fills, the next window is 4–6 weeks out.

Proposal: {{proposal_link}}
Lock the slot: {{deposit_link}}

If anything in the proposal is blocking a yes, reply and tell me what it is. If it's a no, that's a fine answer too — I'd rather know.

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 3 — Day 7

**Subject:** releasing your install slot Friday
**Preview text:** No pressure — just how the queue works.

{{first_name}} —

Housekeeping, not hard sell.

We've held an install slot next to your name since the call. Four installs a month means someone else is waiting on it, so on Friday it goes back in the queue.

If you take it after that, nothing bad happens — you just book into the next open window, usually 4–6 weeks out, and the current stack invoices you at least once more in the meantime.

Three ways to close this loop, all fine:

1. Lock the slot: {{deposit_link}}
2. Reply with the one thing still in the way — I'll answer it straight
3. Reply "pass" — the audit from your call is yours to keep either way

Whatever you choose, thanks for the working session. Your numbers made the case better than I could.

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 4 — Onboarding (post-purchase)

**Trigger:** install deposit or full install payment completed.
**Goal:** access collected in 48 hours, kickoff booked in week one, client knows exactly what happens for 30 days. These emails do the hand-holding so the build never stalls.
**Cadence:** immediately, Day 1, Day 7, Day 18.

---

### Email 1 of 4 — Immediately after purchase

**Subject:** Install confirmed — one thing to do today
**Preview text:** Access checklist (20 min) + your kickoff call.

{{first_name}} —

It's official: the AI Ads Department is being installed at {{company}}. Welcome.

Here's the entire next 30 days in four lines:

- Week 1 — access + full audit; your baseline CPA set in writing
- Week 2 — your private, isolated deployment + tracking architecture, built in your accounts
- Week 3 — first campaigns live, daily numbers in your Slack
- Week 4 — handover: SOPs, training, and a department you own

Two things from you, and the clock starts:

1. **The access checklist — about 20 minutes:** {{onboarding_form_link}}
   Ad accounts (Meta, TikTok, Google/YouTube), pixel/analytics, one folder of brand assets, your offer docs. This is the only thing that can delay your build. Do it today.

2. **Book your kickoff call:** {{kickoff_call_link}}
   Thirty minutes with the senior operator leading your install. We confirm access, lock your baseline, and set your launch date.

The guarantee starts with that baseline: beat it within 90 days of operations, or the $19,997 install fee is credited back against operations. In writing, on the kickoff call.

Reply to this email anytime — a human on your install team reads it.

— Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 4 — Day 1

**Subject:** the only thing that can delay your build
**Preview text:** If you can invite a user and forward a folder, you're done.

{{first_name}} —

Every install that's ever run late ran late for the same reason: waiting on access. So here's the full list, in plain terms. None of it needs a designer or a developer.

**Ad account access — admin invites to:**
- Meta Business Manager
- TikTok Ads Manager
- Google Ads / YouTube
- Pixel, analytics, and CRM (read access is enough to start)

**Brand assets — one folder is fine:**
- Logo, fonts, colors
- Banned claims and compliance rules
- Past creative that worked — and anything that's ever embarrassed the brand

**Offer docs:**
- Pricing, guarantee, funnel URLs, sales pages
- The top 5 objections your buyers raise

**One decision-maker:**
- Joins your private Slack channel ({{slack_invite_link}})
- Approves creative from their phone — about 4 minutes a day, no meetings

Checklist link again: {{onboarding_form_link}}

Twenty minutes now buys you a Week 3 launch. Stuck on any item — an old agency holds the pixel, you can't find a login — reply and we'll untangle it with you. It's what the install fee is for.

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 4 — Day 7

**Subject:** your deployment is live (here's what's running)
**Preview text:** Week 1 done. Week 2 is the wiring.

{{first_name}} —

End-of-week-one report, the short version:

- **Audit — done.** Account history, funnel, and offer mapped into testable angles. Your baseline CPA is documented and locked into the guarantee.
- **Your deployment — standing up.** Your installation runs on its own Tailscale-isolated network. Your ad accounts, customer data, and API keys touch no shared system, train nobody else's models, and are visible to no other client.
- **This week:** tracking architecture goes into your accounts, GIZMO trains on your brand and numbers, and the creative feed gets wired in.

Watch your Slack channel — the daily reporting line goes live before campaigns do, so you'll see the department think before you see it spend.

One decision still open if you haven't made it: the creative feed. GIZMO tests 100 variants at a time, and that math needs volume. The Content Engine Full Stack bundles for Ads Department clients at $2,497/mo — $500 under standalone, every month: {{bundle_checkout_link}}

If you're supplying your own creative volume instead, tell your operator on Slack this week so we wire your pipeline in.

Week 3 is launch. Nothing needed from you until then except approvals.

— Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 4 of 4 — Day 18

**Subject:** campaigns are live — how to read your daily report
**Preview text:** Spend, CPA vs baseline, kills, scales. Four minutes a day.

{{first_name}} —

Your first campaigns are live at controlled budgets. From here, the department runs a rhythm — here's how to read it.

**The daily report (in your Slack, every morning):**
- Spend and CPA — always shown against your written baseline
- Hook rates by variant — anything under 25% at 48 hours gets killed automatically
- What changed — every budget move, explained: what moved, why, what happens next

**Your job — about 4 minutes a day:**
- Scroll the approval queue. Approve, or kill anything off-brand
- That's it. No status calls. Ask the channel anything, anytime

**What happens next:**
- Winners get budgets raised 20–30% every 3–4 days
- Fresh creative rotates in every 10–14 days, before fatigue shows up
- Week 4: handover — SOPs, documentation, and training delivered. The department is yours

Two housekeeping notes: operations billing ($1,997/mo) started when campaigns went live, and so did your 90-day guarantee clock against {{baseline_cpa}}. Both are tracked in your dashboard: {{dashboard_link}}

The machine is running. Let the data do the arguing.

— Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

## Sequence routing map (for the automation build)

| Event | Action |
|---|---|
| Cold contact added | Start Sequence 1 (pick Email 1 variant by audience tag: `in-house` / `agency`) |
| VSL watched, no booking in 24h | Stop Sequence 1 → Start Sequence 2 |
| Install call booked | Stop Sequences 1 & 2 |
| Call held + proposal sent | Start Sequence 3 |
| Deposit / install paid | Stop Sequence 3 → Start Sequence 4 → redirect flow: `upsell.html` → `thank-you.html` |
| Bundle purchased | Suppress bundle paragraph in Sequence 4, Email 3 |
| Reply "later" / "pass" | Stop all, tag for quarterly re-engage (manual) |
