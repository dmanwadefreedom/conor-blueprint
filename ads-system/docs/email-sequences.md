# The AI Ads Department: Email Sequences

**Product:** The AI Ads Department (Elevated AI), agent codename GIZMO
**Last updated:** July 2026
**Voice:** Second person. Short sentences. Specific numbers. No corporate jargon. No emojis. No em dashes anywhere. No fake testimonials: "pilot" and "live install" framing only.

**Campaign hooks (rotate through subjects and openers; never stack more than one per email):**

- Fire your ads agency. Agentic Ad Departments are here.
- The entire ads agency, run from your phone.
- You have about a year before this is normal.
- Agency variant: Have your agency use it now, or be tossed aside by someone who does.

<!-- DO-NOT-USE-UNTIL-TRUE: the claim "tested over 400 installs" may not appear in any sent email, subject line, or preview text until it is factually true. -->

---

## Setup notes (read before loading into your ESP)

**Merge tags used:**

| Tag | What it is |
|---|---|
| `{{first_name}}` | Recipient first name (fallback: "there") |
| `{{company}}` | Recipient company name (fallback: "your business") |
| `{{agency_name}}` | Recipient's agency name, agency-owner variant only (fallback: "your agency") |
| `{{vsl_link}}` | `/ads-system/vsl.html` |
| `{{pricing_link}}` | `/ads-system/index.html#pricing` |
| `{{install_call_link}}` | Install-call scheduler (`https://cal.com/REPLACE_ELEVATED_AI/install-call`) |
| `{{proposal_link}}` | Per-prospect proposal doc URL |
| `{{deposit_link}}` | `https://buy.stripe.com/REPLACE_ADS_INSTALL` |
| `{{baseline_cpa}}` | Prospect's current cost per acquisition, captured on the call |
| `{{monthly_stack_cost}}` | Prospect's current agency + creative spend, captured on the call |
| `{{onboarding_form_link}}` | Onboarding form / access checklist URL (placeholder) |
| `{{kickoff_call_link}}` | Kickoff scheduler (`https://cal.com/REPLACE_ELEVATED_AI/kickoff-call`) |
| `{{slack_invite_link}}` | Private client Slack channel invite (placeholder) |
| `{{dashboard_link}}` | Client reporting dashboard URL (placeholder) |
| `{{bundle_checkout_link}}` | `https://buy.stripe.com/REPLACE_ADS_BUNDLE` |
| `{{support_email}}` | support@elevatedaisolutions.com (placeholder) |
| `{{unsubscribe_link}}` | ESP unsubscribe (required) |
| `{{mailing_address}}` | Physical address for CAN-SPAM footer (placeholder) |

**Sending rules:**

- From name: a real human at Elevated AI (e.g., "Logan at Elevated AI"). Never "noreply."
- Plain-text look. No header images, no heavy HTML. One primary link per email.
- Every email carries the footer: `{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}`
- Canonical figures only: **$19,997 install · $1,997/mo operations · $4,997/mo agency white-label · Content Engine Influencer plan bundled at $747/mo (save $250/mo off the standalone $997/mo)**. Year one all-in: $43,961. Every year after: $23,964. Anchor: $5k/mo agency + $8k/mo creative team = $156k/yr.
- Guarantee language, always these three points and nothing more: (1) every part of the install delivered as scoped, or we keep working at no extra charge until it is; (2) a 30-day money-back window on the install fee after launch; (3) operations is month to month and the client keeps the system either way. Never promise results, ROAS, revenue, income, or that we will beat any number. Baseline CPA is a measurement anchor, not a promise.
- Cost-comparison math is allowed (what they spend now vs. what the system costs). Never rephrase it as earnings, profit, ROI, or business outcomes.
- Proof: one live install is running a real estate operation's ads right now. Say that, nothing more. Never name clients. No invented stats, install counts, or testimonials.
- "4 installs a month" is a real capacity constraint. Only send scarcity emails when it's true.
- Cold sends go to verified B2B contacts only, with a working unsubscribe from email one.

---

# Sequence 1: Cold outbound to VSL

**Goal:** get the click to the 11-minute VSL, then the install-call booking. Sell the click, not the department.
**Audience:** founders/CMOs spending $10k+/mo on ads (Variant A), and agency owners (Variant B). Email 1 splits by audience; emails 2 to 5 are shared.
**Cadence:** Day 0, 2, 5, 8, 12. Stop on VSL watch (move to Sequence 2) or call booked.

---

### Email 1 of 5, Day 0, VARIANT A: in-house founder / CMO

**Subject (A):** the two invoices at {{company}}
**Subject (B):** fire your ads agency (here's the math)
**Preview text:** Most people never add them up.

{{first_name}},

Add up two invoices for me.

The first is your ad agency. Call it $5k a month, and read the fine print, because creative isn't included. Neither are the tool fees they pass through.

The second is the creative work around it. An editor, a designer, a content person: about $8k a month fully loaded, running lean.

That's $156,000 a year. For 15–20 assets a month and a report you don't read.

We built the machine that replaces both invoices: the strategy, the media buying, and the entire creative department, rebuilt as one agentic system installed in your accounts. The entire ads agency, run from your phone. It runs about $44k in year one, about $24k a year after. And you own it instead of renting it.

It explains itself in an 11-minute video. The presenter is the system's own creative output, which is sort of the point.

Watch it here: {{vsl_link}}

Worth 11 minutes if either invoice made you wince.

Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 1 of 5, Day 0, VARIANT B: agency owner

**Subject (A):** use it now, or be tossed aside by someone who does
**Subject (B):** the retainer model has about a year left
**Preview text:** Creative is your biggest unbundled cost. We fixed that.

{{first_name}},

Blunt version first: Agentic Ad Departments are here, and they're coming for the retainer model. Your clients are going to hear "fire your ads agency" a lot in the next year. The agencies that adopt the system are the ones that line doesn't apply to.

Here's the move that makes it your advantage instead.

We built a full AI ads department: CMO-level strategy, daily media buying, and a creative engine that ships UGC-style video at machine volume. It licenses white-label at $4,997/mo. Your brand on the reporting, the dashboard, and the creative. Unlimited use across your book.

What that does to your cost structure:

- Creative production, your biggest unbundled cost center, drops to one flat license fee
- No new media buyer hires as you add accounts
- The license costs less than one junior media buyer, fully loaded

The 11-minute breakdown shows exactly what's inside (the white-label door is near the end): {{vsl_link}}

Have your agency use it now, or watch clients leave for one that does.

Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 5, Day 2 (shared)

**Subject (A):** 15 assets a month is why your ads plateau
**Subject (B):** winners are a volume problem
**Preview text:** Winners are a volume problem. Agencies can't do volume.

{{first_name}},

Here's the uncomfortable math behind most "our ads stopped working" stories.

Winning ads come from testing 100+ variants per angle, one variable isolated per batch. Hooks. Offers. Openers. Avatars.

Your agency ships 15–20 assets a month. Total. That's not testing. That's guessing slowly and billing monthly.

The AI Ads Department runs the loop no human team has the patience for:

- 100 variants tested at a time
- Anything under a 25% hook rate at 48 hours gets killed
- Winners scaled 20–30% every 3–4 days
- Fresh creative every 10–14 days, before fatigue eats the CPA

And it feeds on UGC-style creative, the format that keeps beating polished brand ads on clicks and cost.

An agency finds a winning ad by luck, a few times a year. A 100-variant matrix finds one on schedule.

The 11-minute breakdown: {{vsl_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 5, Day 5 (shared)

**Subject (A):** your Monday, with the department installed
**Subject (B):** the entire ads agency, run from your phone
**Preview text:** Total involvement: four minutes.

{{first_name}},

A Monday at {{company}} with the AI Ads Department running:

7:00 am. GIZMO (the agent that runs it) has already read the weekend. Every campaign, every variant, every dollar. The CMO report is in your inbox before your coffee: two winners found, three variants killed, budgets already shifted.

8:30. Today's creative batch lands: fresh variants built off last week's winning hooks. They pass your brand guardrails and stack in the approval queue.

9:15. You scroll the queue on your phone. Approve, approve, kill one, approve. Four minutes.

That was your entire involvement in the ads department today. The entire ads agency, run from your phone.

No status calls. No "quick syncs." No waiting three weeks for a creative refresh.

Watch the full walkthrough, 11 minutes: {{vsl_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 4 of 5, Day 8 (shared)

**Subject (A):** cancel your agency and you keep... nothing
**Subject (B):** who keeps the pixel when you leave?
**Preview text:** The part of the retainer model nobody says out loud.

{{first_name}},

Try this thought experiment. Cancel your agency tomorrow. What do you keep?

Not the pixel setup. Not the naming conventions. Not the creative library or the learnings. It all lives in their accounts. You rented a department for years and own zero of it. That's not an accident. It's what keeps you paying.

The AI Ads Department is built the other way around:

- Everything installed in YOUR ad accounts, on your own isolated deployment (Tailscale-secured, so your data never touches a shared system)
- SOPs and documentation handed over, so the system runs even if we part ways
- Cancel operations anytime; the tracking architecture, creative library, and playbooks stay yours

And this isn't a concept deck. A live install is running a real estate operation's ads right now: creative briefed, budget moved, numbers reported, daily. We don't name clients, and we won't name yours either.

The honest answer to "why not just buy an AI ad tool?": the market already ran that experiment. Software without an operator is a hobby. This is a system plus an operator plus accountability.

(Agency owner? The white-label license runs the whole thing under your brand at $4,997/mo. Ask on the call.)

Two ways in:

Watch the 11-minute breakdown: {{vsl_link}}
Or skip ahead and book the install call: {{install_call_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 5 of 5, Day 12 (shared)

**Subject (A):** closing your file
**Subject (B):** you have about a year before this is normal
**Preview text:** One question before I do.

{{first_name}},

This is the last one from me.

Before I close your file, one question: what's the plan for the $156k/yr problem?

Because "keep paying the agency and hope" is a plan. It's just an expensive one. Next year it costs $156k again, and you still won't own anything.

One more thing worth saying plainly: agentic ad departments are not a someday idea. You have about a year before this is normal. The only question is whether you're early or late.

If the timing is wrong, reply "later" and I'll check back in a quarter. No drip, no games.

If you want to see what you'd be replacing the stack with, the 11-minute breakdown is here: {{vsl_link}}

And if you're already convinced, book the install call. It's a working session on your real numbers, not a pitch, and you leave with a free audit either way: {{install_call_link}}

We take four installs a month. That's a real capacity limit, not a marketing device.

Logan
Elevated AI

P.S. The guarantee, in one line: the install is delivered as scoped or we keep working at no extra charge, and you get a 30-day money-back window on the install fee after launch. We don't promise results. We promise the work, the system, and your way out.

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 2: Post-VSL, no call booked

**Trigger:** watched the VSL (or hit the watch page) but didn't book the install call within 24 hours.
**Goal:** book the install call. One idea per email.
**Cadence:** Day 1, 3, 6 after the watch. Stop on booking.

---

### Email 1 of 3, Day 1

**Subject (A):** the number you should have written down
**Subject (B):** $112,039
**Preview text:** $112,039. Here's where it comes from.

{{first_name}},

You watched the breakdown. One number is worth writing down: **$112,039.**

That's what stops going out the door in year one when the department replaces the standard stack:

- Agency + creative team: $156,000/yr
- AI Ads Department: $19,997 install + $1,997/mo = $43,961 year one
- Difference: $112,039. Year two and after: $132,036, every year

That's spend you stop spending, not a revenue promise. The install call is where those become your numbers instead of ours. Thirty minutes. Bring your ad account. We pull your real spend, price what your current setup actually costs, and map your first 90 days.

It's a working session, not a pitch. If the math doesn't work for your business, we'll say so, and you keep the audit either way.

Book it here: {{install_call_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 3, Day 3

**Subject (A):** what the guarantee actually says
**Subject (B):** in writing, and what we won't promise
**Preview text:** In writing. And what it deliberately leaves out.

{{first_name}},

The part of the video most people rewind is the guarantee. Here it is in plain terms.

First, the build. If any part of the install isn't delivered as scoped, we keep working at no extra charge until it is. The install fee buys a finished department, not a best attempt.

Second, the money-back window. Launch the department, run it for 30 days, and if you decide it isn't for you, tell us and we refund the install fee. All $19,997 of it.

Third, no lock-in. Operations is month to month, and if you ever walk, the department stays with you: the system, the SOPs, everything we built.

One thing the guarantee deliberately leaves out: specific results. Nobody can honestly guarantee what your market does, and anyone who does is guessing with your money. What we do instead is set your baseline CPA in writing at install, so every daily report is measured against reality instead of vibes.

Your agency will never put its retainer on the line. Ask them why.

The baseline gets documented on the install call. Book it here: {{install_call_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 3, Day 6

**Subject (A):** 4 installs a month (this isn't a countdown timer)
**Subject (B):** how the install queue works
**Preview text:** It's payroll math. Here's how the queue works.

{{first_name}},

Last note on this.

Every install is a real build: tracking architecture rebuilt, GIZMO trained on your numbers, creative engine calibrated, launch supervised. A senior operator leads each one. So we take **four installs a month.** Not fake scarcity. Payroll math.

The queue works in booking order. Calls booked this week get scoped for the next open window. When a month fills, the next call books into the month after, while the current stack keeps invoicing you at $13k a month.

If it's a no, no hard feelings. Reply and tell me, and I'll stop here.

If it's a "not yet," reply "later" and I'll check back in a quarter.

If it's a "let's look at the numbers," this is the link: {{install_call_link}}

Thirty minutes. Your real data. A free audit either way.

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 3: Post-call proposal follow-up

**Trigger:** install call completed, proposal sent, not yet signed.
**Goal:** get the deposit. Use the prospect's own numbers from the call; that's what makes these convert.
**Cadence:** Day 0 (2 hours after the call), Day 3, Day 7. Stop on deposit.

---

### Email 1 of 3, Day 0 (send ~2 hours after the call)

**Subject:** your numbers, in writing
**Preview text:** Everything we walked through, one page.

{{first_name}},

Good call today. As promised, everything in writing: {{proposal_link}}

Your numbers, from your own accounts:

- Current stack cost: **{{monthly_stack_cost}}/mo**
- Current baseline CPA: **{{baseline_cpa}}**. This is the number every daily report gets measured against, in writing
- The department: $19,997 install + $1,997/mo operations, month to month once live
- Year one all-in: $43,961, against what you're paying now

What happens when you say go: Week 1 access + audit. Week 2 your isolated deployment and tracking architecture. Week 3 first campaigns live with daily reporting in your Slack. Week 4 handover: SOPs, documentation, training. You own all of it.

And the guarantee from the call, restated: the install delivered as scoped or we keep working at no extra charge, a 30-day money-back window on the install fee after launch, and month-to-month operations with the system yours either way.

To lock your install slot: {{deposit_link}}

Questions the proposal doesn't answer? Just reply. I read everything.

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 3, Day 3

**Subject:** what waiting costs at {{company}}
**Preview text:** The do-nothing option has a price tag too.

{{first_name}},

Quick gut-check on the "let me think about it" math.

Every month at the current setup, {{monthly_stack_cost}} goes out the door, and buys you 15–20 assets, a monthly PDF, and zero equity in the system producing them.

Every month after the install, $1,997 goes out, and buys you 100-variant testing, daily budget moves, daily reporting, and a department you own.

So the real question isn't "should we do this." It's "how many more times do we want to pay {{monthly_stack_cost}} for the old one first?"

One more practical note: your install slot from the call is provisionally held, and we take four installs a month. When this month fills, the next window is 4–6 weeks out.

Proposal: {{proposal_link}}
Lock the slot: {{deposit_link}}

If anything in the proposal is blocking a yes, reply and tell me what it is. If it's a no, that's a fine answer too. I'd rather know.

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 3, Day 7

**Subject:** releasing your install slot Friday
**Preview text:** No pressure. Just how the queue works.

{{first_name}},

Housekeeping, not hard sell.

We've held an install slot next to your name since the call. Four installs a month means someone else is waiting on it, so on Friday it goes back in the queue.

If you take it after that, nothing bad happens. You just book into the next open window, usually 4–6 weeks out, and the current stack invoices you at least once more in the meantime.

Three ways to close this loop, all fine:

1. Lock the slot: {{deposit_link}}
2. Reply with the one thing still in the way, and I'll answer it straight
3. Reply "pass," and the audit from your call is yours to keep either way

Whatever you choose, thanks for the working session. Your numbers made the case better than I could.

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 4: Onboarding (post-purchase)

**Trigger:** install deposit or full install payment completed.
**Goal:** access collected in 48 hours, kickoff booked in week one, client knows exactly what happens for 30 days. These emails do the hand-holding so the build never stalls.
**Cadence:** immediately, Day 1, Day 7, Day 18.

---

### Email 1 of 4, Immediately after purchase

**Subject:** Install confirmed. One thing to do today
**Preview text:** Access checklist (20 min) + your kickoff call.

{{first_name}},

It's official: the AI Ads Department is being installed at {{company}}. Welcome.

Here's the entire next 30 days in four lines:

- Week 1: access + full audit; your baseline CPA documented in writing
- Week 2: your private, isolated deployment + tracking architecture, built in your accounts
- Week 3: first campaigns live, daily numbers in your Slack
- Week 4: handover. SOPs, training, and a department you own

Two things from you, and the clock starts:

1. **The access checklist, about 20 minutes:** {{onboarding_form_link}}
   Ad accounts (Meta, TikTok, Google/YouTube), pixel/analytics, one folder of brand assets, your offer docs. This is the only thing that can delay your build. Do it today.

2. **Book your kickoff call:** {{kickoff_call_link}}
   Thirty minutes with the senior operator leading your install. We confirm access, document your baseline, and set your launch date.

And the guarantee you bought under, in writing: every part of the install delivered as scoped or we keep working at no extra charge, plus a 30-day money-back window on the install fee once you launch. Operations stays month to month, and the system is yours either way.

Reply to this email anytime. A human on your install team reads it.

Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 4, Day 1

**Subject:** the only thing that can delay your build
**Preview text:** If you can invite a user and forward a folder, you're done.

{{first_name}},

Every install that's ever run late ran late for the same reason: waiting on access. So here's the full list, in plain terms. None of it needs a designer or a developer.

**Ad account access, admin invites to:**
- Meta Business Manager
- TikTok Ads Manager
- Google Ads / YouTube
- Pixel, analytics, and CRM (read access is enough to start)

**Brand assets, one folder is fine:**
- Logo, fonts, colors
- Banned claims and compliance rules
- Past creative that worked, and anything that's ever embarrassed the brand

**Offer docs:**
- Pricing, guarantee, funnel URLs, sales pages
- The top 5 objections your buyers raise

**One decision-maker:**
- Joins your private Slack channel ({{slack_invite_link}})
- Approves creative from their phone, about 4 minutes a day, no meetings

Checklist link again: {{onboarding_form_link}}

Twenty minutes now buys you a Week 3 launch. Stuck on any item, like an old agency holding the pixel or a login you can't find? Reply and we'll untangle it with you. It's what the install fee is for.

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 4, Day 7

**Subject:** your deployment is live (here's what's running)
**Preview text:** Week 1 done. Week 2 is the wiring.

{{first_name}},

End-of-week-one report, the short version:

- **Audit: done.** Account history, funnel, and offer mapped into testable angles. Your baseline CPA is documented, and every daily report from launch on will be measured against it.
- **Your deployment: standing up.** Your installation runs on its own Tailscale-isolated network. Your ad accounts, customer data, and API keys touch no shared system, train nobody else's models, and are visible to no other client.
- **This week:** tracking architecture goes into your accounts, GIZMO trains on your brand and numbers, and the creative feed gets wired in.

Watch your Slack channel. The daily reporting line goes live before campaigns do, so you'll see the department think before you see it spend.

One decision still open if you haven't made it: the creative feed. GIZMO tests 100 variants at a time, and that math needs volume. Ads Department clients get the Content Engine Influencer plan, with your own custom AI clone, the 100-video testing matrix, winner detection, and ads-ready creative output, bundled at $747/mo instead of the standalone $997/mo. That's $250 off every month, for as long as you run both systems: {{bundle_checkout_link}}

If you're supplying your own creative volume instead, tell your operator on Slack this week so we wire your pipeline in.

Week 3 is launch. Nothing needed from you until then except approvals.

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 4 of 4, Day 18

**Subject:** campaigns are live. How to read your daily report
**Preview text:** Spend, CPA vs baseline, kills, scales. Four minutes a day.

{{first_name}},

Your first campaigns are live at controlled budgets. From here, the department runs a rhythm. Here's how to read it.

**The daily report (in your Slack, every morning):**
- Spend and CPA, always shown against your written baseline
- Hook rates by variant; anything under 25% at 48 hours gets killed automatically
- What changed: every budget move, explained. What moved, why, what happens next

**Your job, about 4 minutes a day:**
- Scroll the approval queue. Approve, or kill anything off-brand
- That's it. No status calls. Ask the channel anything, anytime

**What happens next:**
- Winners get budgets raised 20–30% every 3–4 days
- Fresh creative rotates in every 10–14 days, before fatigue shows up
- Week 4: handover. SOPs, documentation, and training delivered. The department is yours

Two housekeeping notes: operations billing ($1,997/mo) started when campaigns went live, and your 30-day money-back window on the install fee opened at launch. Spend and CPA against your baseline are tracked in your dashboard: {{dashboard_link}}

The machine is running. Let the data do the arguing.

Logan
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
