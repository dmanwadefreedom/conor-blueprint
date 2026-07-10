# Go-To-Market: $0 → $100k in 30 Days

**Owner:** Founder (you). Nobody else closes money this month.
**Products:** The AI Ads Department ($19,997 install + $1,997/mo) and The Content Engine (self-serve SaaS: Starter $49/mo, Creator $297/mo, Influencer $997/mo, no setup fees, $4,997 Done-For-You Launch upsell).
**Date:** July 2026. Clock starts the day Week 0 is done, not the day you feel ready.

---

## The One-Paragraph Truth

Installs carry the $100k. Not SaaS. One Ads Department install is $21,994 cash in month one. You need roughly four of them plus a couple of $4,997 Done-For-You upsells. The Content Engine is now a $49–$997/mo volume SaaS — its job this month is not revenue, it's pipeline, proof, and the creative ammunition that makes the installs sellable; the meaningful month-one cash it produces comes from the Done-For-You upsell, not subscriptions. If you spend this month "growing MRR," you miss. If you spend it closing installs while the engine posts for you, you hit.

---

## Week 0 — Prerequisites (Do Not Start the 30 Days Without These)

Everything below must be checked before Day 1. Target: 3–5 working days.

### Money can move
- [ ] Stripe account live, payouts verified.
- [ ] Products created: Ads Department Install ($19,997), Ads Ops ($1,997/mo), Agency License ($4,997/mo), Content Engine Starter ($49/mo), Creator ($297/mo), Influencer ($997/mo), Done-For-You Launch + Clone Build ($4,997 one-time), Content Engine Influencer bundled for ads buyers ($747/mo). No setup fees anywhere.
- [ ] Replace every `https://buy.stripe.com/REPLACE_*` placeholder (`REPLACE_CE_STARTER`, `REPLACE_CE_CREATOR`, `REPLACE_CE_INFLUENCER`, `REPLACE_CE_DFY`, `REPLACE_ADS_INSTALL`, `REPLACE_ADS_BUNDLE`) in `content-engine/index.html`, `content-engine/upsell.html`, and the ads pages with live links.
- [ ] Post-purchase one-click upsell flow tested end to end: buy → `content-engine/upsell.html` → `content-engine/thank-you.html`.
- [ ] One $1 live test transaction, then refund it.

### Domains and pages
- [ ] Custom domains live (not vercel.app subdomains). Custom domains also unlock Meta domain verification — see `docs/conor-funnel-fixes.md` §5.
- [ ] `content-engine/index.html` and `ads-system/index.html` deployed with cross-links working both directions.
- [ ] Pixel + CAPI firing on every page. Test events verified.

### The clone and the VSLs
- [ ] AI clone built (talking-head presenter). This is non-negotiable: the clone IS the demo. Every VSL view is a product demo.
- [ ] Content Engine VSL rendered from `content-engine/docs/vsl-script.md`, live at `content-engine/vsl.html`.
- [ ] Ads Department VSL rendered from `ads-system/docs/vsl-script.md`, live at `ads-system/vsl.html`.

### Pipes
- [ ] Email sequences loaded into the CRM: `ads-system/docs/email-sequences.md` and `content-engine/docs/email-sequences.md`.
- [ ] Calendar set: 30-minute call, 30-minute post-buffer, 60-minute slot interval (`docs/conor-funnel-fixes.md` §6).
- [ ] Pipeline stages built and automated (`docs/conor-funnel-fixes.md` §4).
- [ ] Speed-to-lead automation: booking link SMS within 5 minutes of any opt-in. 78% of buyers go with the first vendor to respond.

### Infrastructure
- [ ] Hermes moved off the laptop onto the already-provisioned Hostinger VPS (`docs/ops-runbook.md` §1 — the deploy is ready on `jarvis-telegram` `claude/vps-deploy`; this is an afternoon, not a project). An agent that dies when your laptop sleeps cannot be in a sales demo.
- [ ] Vercel Blob unblocked, media on R2 (`docs/ops-runbook.md` §2). The engine outputs video daily; storage cannot be the bottleneck.
- [ ] TikTok/IG/YT accounts warmed up or warming (TikTok needs ~14 days of normal behavior before posting cadence ramps — start this the first day of Week 0).

---

## The Revenue Math

Three stacked paths. Each path is real cash collected inside 30 days, not booked revenue.

### Path A — Close the warm ads buyer (Days 1–5)
One buyer has already raised their hand. This is the fastest $22k in the company.

| Item | Cash |
|---|---|
| Install (one-time) | $19,997 |
| Month 1 operations | $1,997 |
| **Path A total** | **$21,994** |

### Path B — 2–4 more Ads Department installs (Days 3–28)
Founder-led outbound + the VSL. This is where the month is won or lost.

| Scenario | Installs | Cash |
|---|---|---|
| Conservative | 2 | $43,988 |
| Base | 3 | $65,982 |
| Stretch | 4 | $87,976 |

### Path C — Content Engine self-serve + Done-For-You upsells (Days 8–30)
Fed by the engine's daily organic output plus retargeting everyone who touched either page. No setup fees, so month-one cash per subscriber = first month's subscription. The cash in this path is the $4,997 Done-For-You Launch upsell; the subscriptions are the MRR base and the proof engine.

| Client mix (base case: 10 signups) | Cash |
|---|---|
| 5 × Starter ($49/mo) | $245 |
| 3 × Creator ($297/mo) | $891 |
| 2 × Influencer ($997/mo) | $1,994 |
| 2 of 10 take the $4,997 Done-For-You Launch upsell | $9,994 |
| **Path C total** | **$13,124** |

Conservative = 4 signups + 1 upsell ≈ $6,400. Stretch = 20 signups + 3 upsells ≈ $21,300.

### The stack

| Path | Conservative | Base | Stretch |
|---|---|---|---|
| A — Warm buyer | $21,994 | $21,994 | $21,994 |
| B — Outbound installs | $43,988 | $65,982 | $87,976 |
| C — Content Engine + DFY | $6,389 | $13,124 | $21,251 |
| **Total** | **$72,371** | **$101,100** | **$131,221** |

**Honesty check:** installs are 84–91% of the number in every scenario, and inside Path C roughly three-quarters of the cash is the $4,997 upsell, not subscriptions. That's by design: at $49–$997 the Content Engine is a volume SaaS, and ten signups in month one is pipeline and proof, not the payday. Its real value is what you exit with: ~$12k/mo recurring (4 × $1,997 ads ops + ~$3k Content Engine subscriptions + any $747/mo ads-buyer bundles) walking into month two. The conservative case misses $100k — the gap-closers are the agency white-label license ($4,997/mo; two licenses add $9,994, and agencies already resell white-label at 65–80% margins) and a harder Done-For-You upsell sweep. Both are real levers, not fantasy line items.

---

## Path A — Exact Steps (Days 1–5)

This buyer is warm. Do not run them through the cold funnel. Founder-to-founder, five days, invoice on the call.

**Day 1 — Send the package personally.**
- Text or DM (not just email): "Built the full breakdown of the system we talked about. 11-minute video plus the numbers. Worth 15 minutes before we talk: [ads-system/vsl.html link]. When are you free this week for 45 minutes?"
- Follow with an email: link to `ads-system/index.html` (the full page) + the VSL. One CTA: book the call.
- Book the call for Day 2 or 3. Not next week. Momentum is the offer.

**Day 2–3 — The call (45–90 minutes).**
- 60–70% discovery before any pitch. Get their two invoices on the table: what they pay their agency, what they pay for creative. Let them say the number out loud.
- Anchor: $5k/mo agency + creative + tools = $67k–$100k/yr all-in. In-house department = $300k+. This system: ~$44k year one, ~$24k/yr after — and they own it.
- Guarantee/terms stated plainly on the call. Price stated on the call — win rates run ~10% higher when pricing is discussed on the first call.
- Close: "The install is $19,997, operations are $1,997 a month. I'll send the invoice while we're on. First working session is this week."
- Send the Stripe invoice during the call. Not after.

**Day 3–4 — If unpaid.**
- Same-day recap email: three bullets of what they said their problem costs, the two-invoice math, invoice link, and a real deadline: "Install slots are scheduled Monday. I'm holding yours until Friday 5pm."
- One phone call the next morning. No third chase — move them to the nurture sequence and keep building Path B.

**Day 5 — Paid. Kickoff.**
- Onboarding call booked within 48 hours of payment. Access checklist sent (ad account, pixel, brand assets, CRM).
- Ask for permission on day one: "We document this install as a case study — numbers, screenshots, timeline. You get final approval." That's your Path B proof engine.

---

## Path B — Founder-Led Outbound (Days 3–28)

**Who:** founders and CMOs spending $3k–$10k/mo on an agency or carrying in-house creative payroll; agency owners drowning in creative production (they become license buyers).

**List:** 100 names by Day 7. Sources: your network, past clients, warm buyer's peer group, local operators you already know, agencies you've been in rooms with. Warm-ish beats cold every time this month.

**The motion (per prospect):**
1. Personal first touch (DM/text/email — whatever channel you actually know them on). One line of context, one link (`ads-system/vsl.html`), one ask (30-minute call).
2. Sequences from `ads-system/docs/email-sequences.md` carry non-responders.
3. Every VSL viewer gets retargeted with the engine's daily UGC output.
4. Call → invoice on the call → install scheduled.

**Volume math (from July 2026 funnel benchmarks):** application/booking → call 30–60%, show ~70%, call → close 10–25%. To land 3 installs at a 20% close you need ~15 held calls, which means ~20 booked, which means 100 real outbound conversations started. That's 20 first-touches a day, Days 3–12, founder-sent. It's a job. It's also $65k.

**The agency variant:** any agency owner who says "my clients would want this" — stop selling the install. Sell the white-label license: $4,997/mo, they deliver creative volume without hiring editors, 65–80% margin on their side. One-call close for the right shop.

---

## Path C — Content Engine Self-Serve (Days 8–30)

- Traffic: the dogfood content (below) + retargeting pools from both product pages + VSL viewers who didn't book.
- Funnel: organic clip → `content-engine/index.html` → `#pricing` → Stripe → `upsell.html` ($4,997 Done-For-You Launch) → `thank-you.html`. Fully self-serve by design: Hermes onboarding does the setup in a couple of clicks, so zero founder-hours per signup.
- Push Influencer ($997/mo, the recommended tier) as the default everywhere. It's the tier the demo sells — viewers are literally watching a custom AI clone work, and the clone is the Influencer feature. Starter ($49/mo, no setup fee) is the volume door; upgrades come later.
- The $4,997 Done-For-You upsell is where Path C's month-one cash lives. Every buyer sees it once, post-purchase, one click.
- Every install buyer from Paths A/B gets offered the bundled Influencer plan at $747/mo (saves $250/mo) at onboarding. GIZMO feeds on the engine's output; the bundle is the natural state of the system.

---

## Dogfooding: The Daily Content Quota

The engine sells itself by existing in public. You are client zero. If you won't run your business on it, nobody else will.

**The daily ritual (30 minutes of your time, engine does the rest):**
1. Record a 5–10 minute screen walkthrough of the platform doing real work — today's creative batch rendering, GIZMO's morning report, the kill/scale decisions, real dashboards. Talk over it like you're showing a friend.
2. Feed it to the engine. It becomes:

| Output | Count/day | Spec |
|---|---|---|
| 6.3s seamless loops | 2 | Split-sentence loop, rewatch bait |
| 14–16s reels | 3 | IG sweet spot, completion-optimized |
| 30–45s Shorts | 2 | YT watch-through format |
| TikTok posts | 3–4 | After the 14-day warm-up; hooks in first 1.5s |
| LinkedIn post | 1 | The day's numbers, plain text |
| Blog post (botmo autopilot) | 1 | SEO/AEO wired, walkthrough transcript as source |

3. Approve the batch in the admin queue. Ship.

**Content rules (from `docs/research/short-form-best-practices-2026.md`):** spoken hooks 10–14 words; kill any variant under 25% hook rate at 48h; run the three lanes simultaneously — storytelling pitch, product-in-use loops, show-and-tell demo; single CTA per asset; AI-content labels on where required (EU labeling becomes mandatory Aug 2, 2026 — be early, not scrambling).

**Quota is a floor, not a goal:** ~12 short-form posts/day across platforms by Week 2. The engine's at-scale capacity is 50–100 videos/day; the founder feed only needs to prove the machine is real in public. The full firehose — the 100-video testing matrix — is what Influencer subscribers and install clients buy, and week one of the warm buyer's install should be running at that volume where it can be screenshotted.

---

## The 30-Day Calendar

### Week 1 — Close the warm buyer. Start everything else.
| Day | Focus | Done means |
|---|---|---|
| 1 | Send warm buyer the VSL + page. Book the call. First walkthrough recorded and fed to the engine. | Call on calendar. First clips queued. |
| 2 | Warm buyer call. Invoice on the call. | Invoice sent. Daily quota shipped. |
| 3 | Follow-up/recap if unpaid. Start the 100-name list. | 50 names listed. |
| 4 | Outbound wave 1: 20 first-touches. Warm buyer onboarding prep. | 20 sent. |
| 5 | **Path A cash lands: $21,994.** Kickoff scheduled. Wave 2: 20 touches. | $22k collected. |
| 6–7 | Weekend: content compounds. Build retargeting audiences from all page traffic. Finish the 100-name list. | Audiences live. List done. |

### Week 2 — Fill the calendar.
| Day | Focus | Done means |
|---|---|---|
| 8 | Waves 3–4 begin: 20 touches/day, every day this week. Content Engine ads live against retargeting pools. | 2 calls booked. |
| 9–10 | First Path B calls. Same script as Path A: discovery, two invoices, price on the call. | 1 invoice out. |
| 11 | Warm buyer install in progress — screenshot everything for the case study. | Proof bank started. |
| 12 | Calls + follow-ups. Offer warm buyer the bundled Influencer plan ($747/mo) at onboarding. | Bundle decision logged. |
| 13–14 | Weekend: review hook rates, kill losers, double the winning hook family next week. | Creative review done. |

### Week 3 — Close installs #2 and #3.
| Day | Focus | Done means |
|---|---|---|
| 15–17 | Path B calls stacked mornings. Invoices on calls. First Content Engine self-serve buyers should be appearing from retargeting. | Install #2 paid (~$44k cumulative). |
| 18–19 | Chase every open invoice by phone. New touches to keep 20/day pace. | 3+ calls booked for week 4. |
| 20 | **Checkpoint: at or above $50k collected?** If not, run the Miss Playbook below — today, not Day 27. | Decision made in writing. |
| 21 | Publish week-3 pilot numbers as content (real screenshots, "pilot results" framing — no invented testimonials, ever). | Proof post live. |

### Week 4 — Collect.
| Day | Focus | Done means |
|---|---|---|
| 22–24 | Install #3 close. Agency license conversations with any agency owners in the pipeline. | ~$66–76k cumulative. |
| 25–26 | Install #4 call or 2 agency licenses. Content Engine upsell sweep: every subscriber who skipped the one-click gets one $4,997 Done-For-You offer by email. | Gap to $100k < $15k. |
| 27–28 | Invoice chase day. Phone, not email. Every verbal yes becomes a paid invoice or a dead deal. | Nothing "pending." |
| 29 | Month-2 pipeline: book next month's calls now while you're hot. | 10 calls scheduled. |
| 30 | Tally. Write the real numbers into next month's content. | **$100k+ collected.** |

---

## KPI Dashboard (Check Daily, 10 Minutes)

| Metric | Target | Kill/fix threshold |
|---|---|---|
| Cash collected (cumulative) | W1 $22k / W2 $30k / W3 $65k / W4 $100k | >20% behind → Miss Playbook |
| Founder first-touches sent | 20/day (Days 3–19) | <15/day two days running → calendar block, no meetings before it's done |
| Calls booked | 20 total by Day 19 | <10 by Day 14 → double volume, loosen targeting |
| Show rate | ≥70% | <60% → tighten reminder sequence (24h email, 1h SMS, 10m SMS) |
| Call → close | 15–25% | <10% after 6 calls → record calls, fix discovery ratio |
| Speed to lead | <5 min | Any miss → automation is broken, fix same day |
| VSL page → application/booking | ≥3% | <1.5% → new hook section above the fold |
| Hook rate (any organic variant, 48h) | ≥25% | Below → kill variant, next hook in the matrix |
| 3-sec hold on shipped content | ≥60% | Below → hooks too slow; product on screen frame 1 |
| Daily content shipped | 12 posts/day by W2 | Missed day → the engine is the product; treat as a P1 outage |
| Content Engine signups | 10 by Day 30 | <5 by Day 22 → push the $49 Starter as the entry, upgrade later |

---

## Miss Playbook — When Something Breaks

**Warm buyer stalls past Day 5.**
Don't discount the install — the price is the positioning. Move the terms instead: 50% to schedule the install, 50% at day 30 go-live. Add a deadline tied to a real constraint (install slots). If they go quiet twice, they're Path B prospect #101, and you tell them so kindly.

**Fewer than 10 calls booked by Day 14.**
Volume first: 30 touches/day. Then channel: switch from email-first to DM/phone-first — warm networks answer phones. Then offer: lead with the Content Engine (Creator $297/mo or Influencer $997/mo, no setup fee, cancel anytime) as the foot in the door and upgrade to the Department after they've seen 30 days of output. A smaller yes now beats a bigger no.

**Calls happening, nothing closing.**
You're pitching too early. Force 60–70% discovery. Get their agency invoice number spoken out loud before you say a price. State the price on the call, every call. And check the anchor order: in-house department first ($300k+), agency all-in second ($67–100k), then yours ($44k year one).

**Organic content flat (views <500/post in week 2).**
Normal — accounts are young. Don't stop. Check warm-up compliance (TikTok sticky spam-labels un-warmed accounts). Run hook sprints: 10 variants of one video, one variable changed. Winners under the 25%-hook-rate bar still die. Distribution follows the loop mechanics: the 6.3s split-sentence loops are the cheapest wins.

**Blob/infra failure mid-month.**
`docs/ops-runbook.md`. Media serves from R2, agents run on the VPS, nothing depends on a laptop being awake. If a demo asset 404s during a sales week, that's a same-hour fix, not a ticket.

**Day 20 checkpoint below $50k.**
Cut Path C effort to the daily quota only. All hours to installs. Open the agency license lane hard: every agency owner you know gets the white-label pitch this week ($4,997/mo, they mark it up, creative is their biggest unbundled cost center). Two licenses + one install closes a $30k gap in ten days.

**Everything hits early.**
Raise nothing yet. Bank the case studies, screenshot everything, pre-book month two's calls, and start the waitlist framing: "Installs are scheduled 3 weeks out." Scarcity you can prove is next month's conversion rate.

---

## What Month Two Inherits

- ~$12k MRR (4 × $1,997 ads ops + ~$3k Content Engine subscriptions + any $747/mo ads-buyer bundles) before any new sales.
- A documented install case study with real numbers ("pilot results" framing).
- 300+ published clips, warmed accounts, seasoned pixels, retargeting pools.
- A repeatable install motion with a known close rate — which is the moment $19,997 stops being a price you defend and starts being a price you raise.
