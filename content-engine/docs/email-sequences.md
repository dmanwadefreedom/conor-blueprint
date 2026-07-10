# The Content Engine: Email Sequences

**Product:** The Content Engine (Elevated AI)
**Last updated:** July 2026
**Voice:** Second person. Short sentences. Specific numbers. No corporate jargon. No emojis. No em dashes. No fake testimonials: "pilot" framing only.

---

## Setup notes (read before loading into your ESP)

**Merge tags used:**

| Tag | What it is |
|---|---|
| `{{first_name}}` | Recipient first name (fallback: "there") |
| `{{company}}` | Recipient company name (fallback: "your business") |
| `{{tier_name}}` | Plan purchased: Starter / Creator / Influencer |
| `{{vsl_link}}` | `/content-engine/vsl.html` |
| `{{resume_checkout_link}}` | Stripe-recovered checkout URL |
| `{{upsell_checkout_link}}` | `https://buy.stripe.com/REPLACE_CE_DFY` |
| `{{dashboard_link}}` | Client dashboard / login URL (placeholder) |
| `{{capture_kit_link}}` | Clone footage guide URL, Influencer plans only (placeholder) |
| `{{support_email}}` | support@elevatedaisolutions.com (placeholder) |
| `{{unsubscribe_link}}` | ESP unsubscribe (required) |
| `{{mailing_address}}` | Physical address for CAN-SPAM footer (placeholder) |

**Sending rules:**

- From name: a real human at Elevated AI (e.g., "Logan at Elevated AI"). Never "noreply."
- Plain-text look. No header images, no heavy HTML. One primary link per email. Exactly one.
- Every email carries the footer: `{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}`
- Canonical figures only: Starter $49/mo · Creator $297/mo · Influencer $997/mo · no setup fees · DFY Launch $4,997 one-time.
- Guarantee language: 14-day money-back on the first payment, plainly stated. Never promise or imply income, revenue, or business results. Cost comparisons are fine; outcome promises are not.

---

# Sequence 1: Launch (cold list to VSL)

**Goal:** get the click to the 6-minute VSL. Sell the click, not the product.
**Cadence:** Day 0, 2, 4, 6, 8. Stop on purchase or checkout start.

---

### Email 1 of 5 (Day 0)

**Subject:** I didn't film this
**Preview text:** Nobody did. That's the point.

{{first_name}},

Quick confession.

The best video we've ever produced wasn't filmed. No camera. No studio. No editor.

The person on screen is an AI clone, built from about 20 minutes of reference footage. And most people can't tell.

That clone now ships reels every day, scripted, edited, captioned, and scheduled, while its owner runs the business.

We recorded a 6-minute breakdown showing exactly how the machine works. The presenter is the clone. The video is its own demo.

Watch it here: {{vsl_link}}

If you've ever said "I know I should post more," these are the most useful 6 minutes you'll spend this week.

Logan
Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 5 (Day 2)

**Subject:** $250 per video vs $12 per video
**Preview text:** The math your agency hopes you never do.

{{first_name}},

Do this math once and you can't unsee it.

A human UGC video costs $150 to $250. An in-house editor is roughly $100k fully loaded, for 1 to 2 videos a day. A "$5k/mo" agency quietly becomes $67k to $100k a year once creative production and tool fees hit the invoice. For 15 to 20 assets a month.

Now the other column.

The Content Engine ships 50+ posts and 30 reels a month, 80 finished assets, for $997 a month on the Influencer plan. That's about $12 per asset, with your face and your voice on it. On Creator, stock AI avatars do the talking for $297 a month, under $4 per asset. Nothing publishes without your approval.

The output of a creative department, at software pricing. No setup fees, month to month.

The 6-minute breakdown shows the whole machine: {{vsl_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 5 (Day 4)

**Subject:** One voice memo. Fifty posts.
**Preview text:** A Tuesday with the Engine installed.

{{first_name}},

Here's a Tuesday with the Engine running at {{company}}.

9:04 am. You record a 4-minute voice memo on your drive in. A client win. An opinion. Anything.

9:45. The Engine has cut it into 12 posts and 3 reel scripts, each with a hook, a payoff, and B-roll markers.

10:15. Your clone has "filmed" all three reels. Captions burned in. Loop point checked.

10:20. Your phone buzzes once. You scroll the approval queue at lunch, kill the one you don't love, approve the rest. Two minutes.

The rest of the week runs itself. Posts drip out at peak times on every platform. A blog targeting a keyword your buyers search goes live on your site.

That's the whole job. One input in, fifty outputs out.

See it end to end (6 minutes): {{vsl_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 4 of 5 (Day 6)

**Subject:** "Won't it look like AI?"
**Preview text:** Fair question. Here's the honest answer.

{{first_name}},

The three questions everyone asks before watching the breakdown:

**"Won't it look like AI?"**
On the Influencer plan, the clone is built from your real footage and your real voice. Scripts follow the organic formats already winning your feed. And here's the kicker: UGC-style creative runs roughly 4x the CTR of polished brand content at about half the CPC, precisely because it doesn't look produced. If a video reads fake to you, you kill it with one tap. Nothing ships without your approval.

**"Is this even allowed?"**
Yes. TikTok and Meta allow AI content when labeled, and the Engine applies the right label per platform automatically. Meta has said its AI label carries no distribution penalty.

**"Who owns the clone?"**
You do. Your likeness, your voice model, every asset: contractually yours. Cancel and we hand over the files.

The clone answers the rest itself, on camera, in 6 minutes: {{vsl_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 5 of 5 (Day 8)

**Subject:** Two things before you decide
**Preview text:** The guarantee, and the calendar.

{{first_name}},

Last note on this, then I'll stop.

Two things you should know before deciding:

**1. The guarantee.** Every plan carries a 14-day money-back guarantee. If the Engine isn't for you, request a full refund of your first payment within 14 days of purchase. No forms, no hoops.

**2. The calendar.** Starter and Creator switch on the moment you check out: answer a few questions, connect your accounts, and Hermes fills in your brand voice, strategy, and content plan in a couple of clicks. Custom clone builds on Influencer are hands-on, so we take a limited number of new clone builds each month.

Plans start at $49 a month, no setup fees, month to month. Creator is $297. Influencer, the plan with your own custom clone, is $997.

Watch the breakdown, then pick your plan: {{vsl_link}}

Logan

P.S. Still on the fence? Reply to this email with your biggest hesitation. A human reads every reply.

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 2: Cart / Checkout Abandonment

**Trigger:** started checkout, no purchase.
**Cadence:** +1 hour, +24 hours, +72 hours. Stop on purchase.

---

### Email 1 of 3 (1 hour after abandonment)

**Subject:** Your Engine is still sitting there
**Preview text:** Your plan is saved. Two minutes to finish.

{{first_name}},

You picked a plan. You didn't finish checkout.

Usually that's a meeting, a kid, or a card in another room, not a change of heart. So we saved your spot.

Finish here (about 2 minutes): {{resume_checkout_link}}

Quick recap of what starts the moment you do:

- You log in, and Hermes asks a few questions about your business
- You connect your accounts; Hermes fills in your brand voice, strategy, and content plan in a couple of clicks
- Your first posts hit the approval queue this week
- On Influencer, your clone build starts with about 20 minutes of footage, phone camera is fine

If something on the checkout page stopped you, reply and tell me what. I'll give you a straight answer.

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 3 (24 hours after abandonment)

**Subject:** The guarantee, in one sentence
**Preview text:** 14 days. Full refund of your first payment. No hoops.

{{first_name}},

Here's the sentence that settles most fence-sitters:

**If the Engine isn't for you, request a full refund of your first payment within 14 days of purchase.**

Try the real product, in your real accounts, with your real content. Judge the fit for yourself.

And the things people usually stall on:

- **Contract?** Month to month. No setup fees. No annual lock-in.
- **My time?** About 20 minutes a week in the approval queue after your first week.
- **Ownership?** Your clone, your voice model, your content. Cancel and keep everything.
- **Looks like AI?** Nothing publishes without your one-tap approval.

Your checkout is still saved: {{resume_checkout_link}}

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 3 (72 hours after abandonment)

**Subject:** Your saved checkout expires tomorrow
**Preview text:** Last housekeeping note, then we're done.

{{first_name}},

Housekeeping note.

Your saved checkout link expires tomorrow. After that, the cart resets and you'd start fresh from the pricing page.

If it's a no, no hard feelings. Delete this and you won't hear about it again.

If it's a "yes, but not $997": start smaller. Starter is $49 a month. Same Hermes onboarding, content repurposing, blog and SEO autopilot, approval queue, auto-scheduling. No clone yet. Creator at $297 adds avatar reels with stock AI avatars. Upgrade whenever the posts prove it out.

Finish checkout (2 minutes): {{resume_checkout_link}}

Either way, decide. A month of daily content is worth more than a month of thinking about it.

Logan

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 3: Post-Purchase Onboarding

**Trigger:** successful purchase (any plan).
**Cadence:** immediately, Day 1, Day 3, Day 7.
**Note:** Email 2 (clone footage) goes to Influencer buyers only. Suppress it for Starter and Creator, and for buyers who took the Done-For-You Launch upsell: their capture happens in a directed session with the launch team.

---

### Email 1 of 4 (Immediately after purchase)

**Subject:** You're in. Two minutes, then Hermes takes over.
**Preview text:** Log in, answer a few questions, connect your accounts. Done.

{{first_name}},

Welcome to the Engine. Your receipt is attached, and your {{tier_name}} plan is live.

One thing from you, and it takes a couple of minutes:

**Log in and let Hermes onboard you.**
Hermes asks a few questions about your business and your offer. Connect your accounts, and it fills in your entire brand voice, content strategy, and a ready-to-run content plan. Review, adjust anything, approve. No calls, no forms, no blank pages.

Start here: {{dashboard_link}}

The sooner you log in, the sooner your first posts hit the approval queue. Most accounts see their first batch this week.

And the guarantee is simple: if the Engine isn't for you, request a full refund of your first payment within 14 days of purchase.

Your team at Elevated AI
Questions? Reply here or write {{support_email}}.

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 4 (Day 1, Influencer plans only)

**Subject:** Your clone footage guide (20 minutes, phone is fine)
**Preview text:** Three clips. One take each is fine. Don't overthink it.

{{first_name}},

Time to film the last footage you'll ever have to film.

Your clone footage guide is here: {{capture_kit_link}}

The short version: three clips, about 20 minutes total, phone camera is fine.

**Clip 1: Talking head (10 min).** You, chest-up, talking to camera about your business. Natural light from a window. Don't perform. Talk like you're on a Zoom call with a friendly client.

**Clip 2: Full body (5 min).** Standing, framed knees-up. Gesture like you normally do. Walk a few steps, turn, talk.

**Clip 3: Range (5 min).** Same framing as Clip 1. Read the short script in the guide. It walks you through emphatic, casual, and serious deliveries so your clone gets your full range.

Rules of thumb: quiet room, no music, one take is fine, mistakes are fine. We cut around everything. Perfect is the enemy of shipped.

Upload straight from your phone via the link in the guide. Footage in this week keeps your clone build on schedule: first cloned reels in roughly 2 to 3 weeks.

Your team at Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 4 (Day 3)

**Subject:** How to approve like an editor-in-chief
**Preview text:** Your first batch is coming. Here's the 2-minute habit.

{{first_name}},

Your first posts are landing in the approval queue this week. Before they do, steal the habit our best-performing pilot accounts share: they approve fast and kill without mercy.

The 2-minute drill:

- **Scan, don't study.** Your gut read in 3 seconds mirrors how viewers judge it. If frame one bores you, kill it.
- **Kill anything off-brand without guilt.** Every kill teaches the Engine your taste. The queue gets sharper every week because of what you reject.
- **Don't wordsmith.** Rewriting captions by hand is the old job. Leave a one-line note ("too formal," "never say 'folks'") and the Engine applies it to everything after.
- **Batch it.** One sitting, once or twice a week. Most accounts are under 20 minutes a week by day 60.

You stay editor-in-chief. You just stop being the factory.

Open your queue: {{dashboard_link}}

Your team at Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 4 of 4 (Day 7)

**Subject:** Week 1 done. Here's your status.
**Preview text:** What's live, what's next, what to watch.

{{first_name}},

End of week one. Status check:

**Live so far:** your brand voice, strategy, and content plan (the ones Hermes filled in and you approved), your connected accounts, and your approval queue. Approved posts are auto-scheduling to peak times.

**On Influencer:** your clone is in QA passes now. You'll get drafts to review, and your first cloned reels ship in roughly 2 to 3 weeks: 6.3-second loops and 14 to 16 second formats. Then the 100-video testing matrix turns on.

**What to watch on the dashboard:** hook rate (3-second hold) and completion. Those two numbers decide distribution in 2026. The Engine retires weak variants at 48 hours and scales what wins. You'll see it happen live.

One admin note: your 14-day money-back window runs through day 14. If anything feels off before then, tell us and we'll fix it, or refund your first payment. Your call.

Anything unclear? Check your numbers, then reply here: {{dashboard_link}}

Your team at Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

# Sequence 4: Upsell Follow-Up (DFY Launch decliners)

**Trigger:** purchased a plan, declined the $4,997 Done-For-You Launch on the post-checkout page.
**Cadence:** Day 1, Day 3, Day 6. Stop on upsell purchase.
**Framing note:** the upsell page is one-time-viewing. These emails don't resurrect the page. They extend the *decision*: the build slot assigned at checkout is held for 7 days, then released. Day 7 is a hard stop; honor it.

---

### Email 1 of 3 (Day 1)

**Subject:** The page is gone. Your build slot isn't. Yet.
**Preview text:** We hold it for 7 days after your order. Then it's released.

{{first_name}},

After checkout you saw a one-time page for the Done-For-You Launch + Clone Build. You passed. Completely fine. Hermes onboarding is genuinely good, and your Engine is already live.

One thing you should know: the done-for-you build slot assigned at your checkout stays reserved for 7 days after your order. After that we release it to the next order in line.

What it is, in one breath: our launch team runs a directed capture session with you (90 minutes, we drive), builds and QAs your clone, scripts, produces, and schedules your first 30 reels, wires every account and pixel, and runs your first 100-video testing matrix. Then hands you the winners report.

$9,000 of build work. $4,997 once. Your monthly plan doesn't change.

Claim the slot: {{upsell_checkout_link}}

No pressure either way. Self-serve works. This is just faster and more finished.

Your team at Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 2 of 3 (Day 3)

**Subject:** Self-serve vs delivered assembled
**Preview text:** Same Engine. Different first month.

{{first_name}},

The honest comparison between the two paths:

**You set it up (included):** Hermes fills in your brand voice, strategy, and plan in a couple of clicks. You film about 20 minutes of clone footage with the guide, review the drafts, approve your batches, and run your first testing matrix as you learn the dashboard. It's genuinely light. It's just on you.

**We build it ($4,997 once):** 90 minutes of your time, total. One directed capture session with a launch strategist. We build and QA the clone, produce and schedule your first 30 reels, wire every account and pixel, and run your first matrix sprint. The winners report lands on your desk with the numbers in it.

Price the pieces on the open market and it's plain: human UGC videos run $150 to $250 each, so 30 finished reels is $4,500 to $7,500 in production alone, before the clone build, the wiring, and the analyst.

You've already made the hard decision. This one's just about how assembled it arrives.

Slot's held through day 7: {{upsell_checkout_link}}

Your team at Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

### Email 3 of 3 (Day 6)

**Subject:** Your DFY slot releases tomorrow night
**Preview text:** Last note about this. Then we build your Engine either way.

{{first_name}},

Last email about this, promise.

Tomorrow night your done-for-you build slot goes back into the pool. After that, the $4,997 Done-For-You Launch isn't available for your account. We only run it as part of a fresh launch, and yours will be underway.

If it's a no: excellent. Hermes has your plan filled in, your queue is warming up, and your 14-day money-back guarantee protects the whole decision.

If it's a yes: one click, one-time charge, monthly plan unchanged. We take over from here. Directed capture, clone build, first 30 reels produced and scheduled, full wiring, and your first matrix run with the winners report by day 30.

Take the slot: {{upsell_checkout_link}}

Either way, we're building. See you in the approval queue.

Your team at Elevated AI

{{mailing_address}} · Unsubscribe: {{unsubscribe_link}}

---

## Claims inventory (for compliance pass)

| Claim | Source / framing |
|---|---|
| Plan pricing $49 / $297 / $997 per month, no setup fees, DFY $4,997 one-time | Canonical offer terms |
| $150 to $250 per UGC video / ~$100k loaded editor / $67k to $100k real agency cost | docs/research/market-offer-research.md |
| ~4x CTR at ~half CPC for UGC-style creative | docs/research/short-form-best-practices-2026.md |
| 6.3s loops, 14 to 16s formats, 48h kill window for weak variants | docs/research/short-form-best-practices-2026.md |
| Platform AI labeling (TikTok/Meta), no distribution penalty | docs/research/short-form-best-practices-2026.md |
| Guarantee: 14-day money-back on first payment only; never income, revenue, or results promises | House guarantee framing (FTC-safe) |
| "Pilot accounts" language only; no client testimonials anywhere | House rule: no fake testimonials |
| Limited clone builds per month (Influencer); DFY slot held 7 days post-order, then released | Operational rule; conservative scarcity only, no countdowns |
