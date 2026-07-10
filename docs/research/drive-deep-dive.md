# Google Drive Deep-Dive: Marketing Assets Synthesis

> Compiled 2026-07-10 from Dylan Ewing's Google Drive (drive owner: dylan@thedylanewing.com).
> Sources are cited by Drive file title + file ID so anything can be traced back.
> Note: the "Obsidian Vault" folder (ID 1MrWvIzJq3gCK3NTnDrfOrROhMEZ-Vhk1) and "Obsidian" folder
> (ID 1Xe0QVATEIxDukSEvB1JIXH_PLZMFaE1T) are effectively empty shells (Welcome.md, an empty daily
> note, an empty DylanHQ.md, .obsidian config). The real working notes live as loose markdown
> mirrored from `dylan-hq` elsewhere in Drive; the most relevant were located by topical search
> and are covered in section (e).

---

## (a) Hermes AI Agent Setup facts

Source: "Hermes AI Agent Setup Checklist" (Google Doc ID `1eiufLZJlrjWszTC1pnkcFoC0fsRqnvrASjLKZAv8sOg`).

- Positioning: Hermes = "a dedicated AI employee running 24/7 on its own server infrastructure."
- Client-provided access required:
  1. **Meta**: Business Manager admin, Facebook Pages, Instagram accounts, Ad accounts, Business assets. Connection may be OAuth vs API "based on new June updates from Meta" (decided in first 24h).
  2. **Slack**: add ty@10xcoldleads.com as admin (Hermes is installed inside Slack).
  3. **HighLevel (GHL)**: add ty@10xcoldleads.com as admin, "to integrate conversion datas."
  4. **Hostinger VPS**: client creates account, buys **KVM 2 plan (~$8-10/mo)**, adds tyler@10xcoldleads.com as administrator. Hermes runs on this dedicated VPS.
  5. **Brand + marketing + performance assets**: logos, guidelines, fonts, palette; website, landing pages, decks, case studies, creatives, social, emails, videos, VSLs; best ads/emails/posts, winning offers, brand messaging docs. ("The AI is only as good as what it's trained on.")
  6. **Composio**: client creates account and adds the team; used to connect apps fast, plus Google Analytics and "all pixel based traffic datas."
  7. **AI model access**: preferred = OpenRouter API key ($20+ loaded) as backup for text + images; optional/best = OpenAI OAuth or existing OpenAI Pro sub.
  8. **Availability**: client stays reachable first 24h for MFA/permission/API approvals.
- Architecture chain: Meta MCP / AI connectors -> Hermes -> Slack -> CRM -> Revenue data -> Decision Engine. Doctrine: "An agent is only as good as its inputs. The agent's outputs should be refining future inputs" (endless feedback loop; needs CRM + conversion + pixel data).
- Capabilities via Meta's official AI connectors: analyze/create/update campaigns, manage budgets, create ads, monitor FB + IG ads, generate reports, identify winners/losers, recommend budget changes, post insights to Slack, connect marketing performance to revenue data.
- Commercials: **$500/mo Agent Management** offering; "agents that fix your agents" generally built once a client hits 2+ agents. Delivery target in the doc: "Tuesday night." Payment via a Wise pay link embedded in the doc (see the doc itself; not reproduced here).
- Proof point cited in doc: client running business through Facebook Messenger ads, screenshots "from 2 days ago... not stale social proof"; "We've already built Paid Ads Agents, we're only building it specifically for your company & needs now."

## (b) PATCH-C-MAY-2026-CONTENT-ENGINE (May 2026 patch spec)

Source: "PATCH-C-MAY-2026-CONTENT-ENGINE.md" (Doc ID `1XND8HHC9iOyLETBTHwqTxR6OSsKGsqljZq3ijuK1emI`; duplicate copy exists as Doc ID `1t67bXIWk9mZmIAdMTmuCjx270xL3-N7PCxddhHeMVnw`). Drops into `~/dylan-hq/cashclaw-site/` alongside COWORK-BUILD-BRIEF.md; layers on top of "Patch A." Applies to the BotMo product.

- **Strategy flips (May 2026)**:
  1. Google does NOT penalize AI content, only bad AI content. May 2026 update strengthens E-E-A-T, no AI-detection in ranking. Data: 50-100 quality AI articles w/ light human editing = +30-80% traffic; 1,000+ unedited = -40-90%.
  2. AI search citations (ChatGPT/Perplexity/AI Overviews) = separate game, "AEO." Citation lift triggers: expert quotes +41%, statistics density +30%, inline citations to authoritative sources +30%, schema markup (88% of sites lack it), llms.txt (new standard, read like robots.txt for context).
  3. AI-detection-bypass humanizers mostly irrelevant for Google, somewhat real for AI-citation engines. Named tools: Ryne AI, Humanize AI Pro, Phrasly, Undetectable.ai, StealthGPT. Rule: **skip the humanizer by default**; run only if a spot-check gets flagged by GPTZero (humanizers can degrade clarity).
- **Model stack (text)**: Claude Opus 4.6 for outline/research ($15/$75 per M tokens) -> Claude Sonnet 4.6 first draft ($3/$15 per M) -> optional Phrasly/StealthGPT humanization pass (~$0.01/1k words) -> Sonnet 4.6 fact-check + citation-injection pass.
- **Model stack (images)**: FLUX 1.1 Pro via Replicate API for blog heroes (recommended, best price-quality); Recraft v3 for score-delta infographics; Imagen 4 for photoreal people; Adobe Firefly if enterprise indemnification needed; skip Midjourney (no API, expensive).
- **8 new AEO checks** to add to seo-audit-api: llms.txt present, FAQ schema, Article schema (author/datePublished/dateModified), LocalBusiness schema w/ aggregateRating, statistics density per 1000 words, external citation count, author byline + bio page, review schema w/ <90-day reviews. Moves BotMo hero copy from "24 checks" to **"32 checks."**
- **Three variations**: A = Polish (1 day, $0: E-E-A-T prompts in fulfillment-worker/src/skills.js requiring 1 expert quote, 3 sourced stats, 2 outbound citations, author byline; the 8 AEO checks; hero copy 32; FLUX 1.1 Pro). B = full 2026 stack (2-3 days, $10-30/mo: two-pass generation, auto llms.txt/schema artifacts in $497 tier, live model badge, streaming chat via SSE). C = "AI runs your SEO" (1-2 wks, $30-50/mo: customer War Room dashboard w/ live AEO score, score-delta animation, one-click fixes on $497 tier, competitor monitoring, voice input, in-chat mini-tools). Recommendation: ship A now, layer B in 2 weeks, defer C until 10+ paying customers.
- **Chat widget upgrades (2h)**: SSE streaming, inline source chips ([CITE:n] markers + citations array), score-delta mini-widgets ("41 -> 53 up 12" is the #1 retention message), 3 mini-tool quick-reply chips (generate schema JSON-LD, rewrite title tag, copy fix code), mobile drag-resize/swipe-dismiss, mobile voice input.
- **Aesthetic pushes**: Lottie "AI brain" animation replacing static 3-step grid, "2026 stack" badge row, count-up score reveal (0 -> score over 1.2s), replace failing 500kb Three.js gauge with CSS radial, before/after carousel with real customer screenshots, light/dark toggle, skip-to-results link.

## (c) UNDERGROUND-MASTER-BRIEF essentials

Source: "UNDERGROUND-MASTER-BRIEF.md" (file ID `1OuWs3Krk_uttz-KggSbJT3HWUE5Thi-0`, ~46KB, built 2026-05-28). This is Dylan's personal brand (The Underground), separate from Elevated AI/BotMo, but it defines his voice rules and funnel doctrine that bleed into everything.

- **Positioning**: "A private community for truth seekers, deep thinkers, and people taking back control of their health, mind, and future." Big idea: "You think the system will save you. It won't. The Underground is the place you go once you realize that." Frame = "down the rabbit hole," NOT detox-led, NOT NDE-led ("lineage of one. No competition.").
- **Product ladder**: Letter free ($0, the 3 detoxes Dylan runs) -> The Bible $7 one-time (13 detoxes + order + brand list) -> The Underground $27/mo Skool (+ bi-weekly lives + monthly mini-detox) -> Founders Circle (first 50, free forever). Upgrade plan adds the MISSING mid-ticket rung: **$497-$1,497 30-Day Guided Reset cohort**, then $2,500 (7-day) to $15k (30-day) retreat. "Without it, $27 to $2,500 is a cliff nobody jumps."
- **Hard voice rules (anything written as Dylan)**: no em dashes; no "most people"/"no one talks about" openers; no AI cliches (straightforward, genuinely, honestly, certainly, absolutely); 6th-7th grade level; one thought per line; sentence-start capitals, not title case, not all-lowercase; never the clinical-death phrasing (always "almost died," "left my body," "ECMO," "24 hours out"); kids are private; Shane is Filipina, never been to USA, keep private.
- **Canonical story arc** (exact sequence locked): small-town PA -> addiction/homeless -> military Iraq 2003-05 -> American-dream $100k months but hollow -> 4 near-deaths in 4 months (ECMO coma; the 24-hours-out NDE at the "School of In-Between Lives"; access stayed open = the rare differentiator) -> 8 years testing everything (Dispenza 4-yr advanced student, plant medicine, shamanism, all detoxes) -> off ALL meds (PTSD, depression, ADHD, scoliosis, DDD) -> "Now it's time to share." Fact-check guardrails baked in (e.g. the "doctor who hated addicts" is a composite myth, do not present as real; use the documented Silkworth/Jellinek framing for addiction-as-disease).
- **Protocols** (the content spine): Rule Zero = remove 100% of sugar; minerals daily (Real/Celtic salt never Himalayan, beef liver caps, magnesium glycinate, lime water); DETOX 01 yearly 72h water fast; DETOX 02 heavy metals 14 days (cilantro mobilize -> chlorella bind); DETOX 03 parasite moon cycle 7 days; universal 8-stage detox checklist; order matters more than the detox; never stack metals + parasites.
- **Funnel mechanics**: 7-stage client journey (Stranger -> comments "888" -> ManyChat DM w/ /letter link -> Letter visitor/VSL -> $7 buyer -> $27 member -> Founder). Targets: /letter to Bible 8%, Bible-buyer 7-day upsell to $27 at 25%, VSL under 4 min w/ 60% midpoint retention, month-1 churn <8%. One number per day (Mon new members, Tue conversion, Wed engagement, Thu churn flags, Fri cash).
- **Content system**: the spine narrative ("You're not crazy, you're early. Seeing the poison is the DOOR, not the destination"); every post formula = hook -> the door -> alchemize -> soft invite (max 3 hard CTAs/week, single CTA always "comment 888"); text-on-screen carries the message (no forced talking-head); fact-checked framings for sunscreen and fluoride with explicit DO-NOT-SAY lines ("sunscreen causes cancer" banned; "same day"/"worldwide" fluoride claims banned).
- **Roles**: Dylan (content/voice/founders, ~12h/wk), Katreen (brand VA, replies as "Dylan's team," never as Dylan), Mika (Telegram AI, content-scope only, never customer-facing, never pretends to be Dylan), Shane (cross-pollination), Skool CM hire at 25 paid members. Stripe = Dylan's own account (not LegalShield). Skool ~$99/mo, ManyChat Pro link-only.

## (d) Logan Script Pack extraction (Elevated AI)

Source: "Logan Script Pack - Elevated AI (Jul 7 call goldmine)" (Doc ID `1bgnLqxHhkIKtSL9eamLbCdFxePL44YbFyk3ArLHboEA`). Extracted from the 1h48m Jul 7 strategy call (Dylan, Conor, Logan, Shreyas/Extro). Numbers marked (SAMPLE) are placeholders; swap in real market numbers before publishing.

### The core offer (locked one-liner, Conor's version)
"We install a scalable appointment channel that puts **10 vetted, exclusive, shown appointments** on your calendar every **30 to 60 days**, without burning cash on shared leads or wasting hours chasing cold prospects." Not a one-time hit; a system that refills the calendar with ad spend ("$50-60/day = 100+ at-bats a year").

Beta positioning (first 5-10 clients): "We're beta testing a **$20,000 AI system** with a handful of real estate agents. You do NOT pay an agency fee. You only pay for qualified appointments. We guarantee 10 exclusive shown appointments in 60 days, and if we miss, **we keep working for free until you get them**. All we ask in return is a testimonial." Risk frame: "The only person who doesn't make money here is us."

### Guarantee language rules (LOCKED)
- **NEVER money-back language.** Keep-working guarantee only. Exact line: "If we do not deliver all 10 within 60 days, **we keep working until we deliver the remaining appointments**." (VSSL wording: "If we don't deliver all 10, we keep working until we do." NEVER "we refund you.")
- Conditions attached: onboarding completed, ad spend live, calendar availability open, feedback given on appointment quality. Internal caveat (not public): some markets/agents aren't a fit for ads.
- **Do NOT over-define "vetted"** (Conor's critical warning: more written detail = more technicality outs). Contract definitions locked as:
  - **Vetted**: matches the agreed campaign criteria and wants to buy or sell a property. Stop there.
  - **Exclusive**: generated only for you; never resold or shared with any other agent.
  - **Shown**: they attend, answer, or engage in a real conversation with you or your team.
- On-call "vetted" script if pushed: Meta found them by criteria/demographic, they signed up, filled the lead form, got on the calendar = vetted. Local enough + looking to act soon = qualified.

### VSSL outline (target 5-10 min, hard cut past 12)
Model copied: a "guaranteed qualified sellers on demand or you don't pay" seller-funnel VSSL. Audience = agents doing 10+ deals/yr.
1. Hook (name the wrong belief, flip it): "You think you need more leads. You don't. The leads you already paid for are dying in the one place you can't see: your follow-up."
2. Who this is for: full-time agents doing OK who want to level up; know ads are the answer; agencies cost 2k/mo minimum with no guarantee.
3. Who this is NOT for (aggressive, bolded): brand-new agents / not willing to invest $40/day ad spend; want guaranteed closings; won't keep calendar open; won't give appointment-quality feedback; want cheap bulk leads. Close: "If you want cheap leads, this isn't it..."
4. The real bottleneck: time spent with the right person, not closing ability. Positioning line: "The top agents already run paid systems. If you're not, you're already behind."
5. The solution: direct-response ads + AI follow-up, qualification, ad optimization. SHOW A CALENDAR full of appointment blocks (Conor: "get it in the VSSL").
6. What Elevated AI does: fully customized appointment-setting and client-acquisition system, completely done for you.
7. The guarantee (exact language above).
8. The math slide (below), numbers on screen.
9. Comparison: Zillow / cold calling / paid leads suck; ours are exclusive, qualified, and the system is yours.
10. CTA: watch the free training / book the call. Retention bribe: free swipe file of top-performing ads at the end.
Split-test formats: (a) Logan talking-head over screenshots; (b) Zoom screen-record through the doc; (c) Shreyas casual walk-around.

### The math slide (SAMPLE numbers, swap per market)
Median home $429k (SAMPLE) at 3%, 80/20 split ~= $10k/deal (SAMPLE). Ad spend $40/day x 60 days = $2,400; all-in ~$4,600. Decent closer closes ~2 of 10 = ~$20k gross, net ~$16k = **4x** ("Even if you suck, you at least 2x. If you're good, 6x."). "You already know the price before you jump on the call." Million-dollar median doubles everything. Dylan owns building the ROI calculator + break-even countdown for the landing page.

### The 6 ad angles (verbatim summaries)
1. **"Watch it work"** (hero angle, Dylan's favorite): the fear is AI getting your ad account shut down; "What if there was an agency dumb enough to test every account until it was perfect? We have it." Zero to 7 appointments first week, shut down underperforming campaigns, built 15 new creatives overnight from researching 20 competitors, "booking us appointments while I sit here."
2. **Big-city / chewed-up leads**: "Tired of Zillow feeding you the same lead as 15 other agents?"
3. **Ideal-client targeting**: realtor doing 10+ deals/yr who wants 3-5/mo and a team, but YOU are the entire business with no system that predictably books qualified appointments.
4. **Ugly-ad / show-don't-tell**: raw, unpolished, just the system booking appointments; show the calendar filling.
5. **Level-up (not entry-level)**: speak to agents already winning who want the next level.
6. **Authority stack**: "10+ years combined ads experience, proven across 40 different niches, now installing AI agents built specifically for real estate that replace a 5k/month sales team."

Copy direction: Facebook's new AI rewards LONG, specific copy mirroring the prospect's exact language/pains/identity; the pixel transcribes the video and landing page (backlink the VSSL transcript so the AI can read it).

### Pricing ladder (keep the two offers straight)
- **Front offer (beta, Logan sells now)**: 10 exclusive shown appointments / 60 days. No agency fee; pay per appointment pack (**~$2k for a 10-pack**) + $40/day minimum ad spend. First 10 clients get the $20k system installed free for a testimonial. Closing lever: 30-50% off first pack if needed.
- **The AI system itself (enterprise / after proof)**: Managed **$5,000 setup + $1,500/mo**; Buyout **~$15,000** one-time; after 5 testimonials bump to **$7,500 + $3,000/mo**; "when it's fully operational we're selling this for $25,000." Value positioning: "$20,000+ system built with Tai... proprietary access for pennies on the dollar."
- Note the Jun 29 funnel audit (section e) records the current live pack pricing as Standard $1,800 / Premium $3,000 + $200 single-appointment trial, closed on Logan's call; Founding-5 = pay-per-appointment beta.

### Sales-call talk tracks + ops
- Goal-attach opener (Dylan): "If everything we have works exactly the way you want it to, what's the outcome you're after?" (also add to the application form).
- Same-side-of-the-table frame (Conor): "We need you to be successful more than you do... we're both incentivized." End goal: they ask YOU "do you think this is a good idea?"
- Reverse-vetting: "We can't work with agents doing two deals a year... this call is us checking fit too."
- Trust objection handled upstream: "Of course you pay now... it's in writing. If you don't trust us, that's a different conversation."
- Open every call with real energy; bland tempo reads as AI or disinterest.
- GHL fixes owed: kill the book-a-call nudge after booking ("if negative response then remove from workflow"); new pipeline stages (Lead Form -> Booked Call -> Needs Reschedule -> Follow Up -> Lost/Closed -> Canceled/No-Show); separate onboarding pipeline; cost-per-client + break-even tiles; feedback loop Logan -> Slack/GHL -> Shreyas trains Meta -> AI updates creatives.
- Parked growth ideas: clipper bounty (~$300/1M views), $27 low-ticket "set up Meta ads in 5 minutes" funnel, Higgsfield virtual home tours from Zillow listings as seller lead magnet, Elevated AI YouTube authority channel, Ashley (Conor's realtor) as live test client.

## (e) Obsidian/working-notes findings (7 key notes read)

The Obsidian vault folders are empty; these are the actual working notes found across Drive.

1. **TY-AI-ONBOARDING-ADS-MANAGER-SOP.md** (file ID `1lPx1HwWxM-j4hjVDb47sPTbP6gy2Ipt-`, Jun 17 2026) — the ads-system build spec for Ty Shane (ClawRevOps). One-line ask: realtor goes from "closer pushed them in GHL" to "ads live and self-optimizing" with no human bottleneck. Five "employee AI" modules: Closer-Assist, Onboarding (auto-creates GHL subaccount inside Conor's account, injects name/market/zips/pixel), Ads AI Manager (Meta Ads Library research -> clone realtor assets via Higgsfield -> deploy $50/day default, 3-5 split-test variants -> weekly cull), Customer Service (4-point appointment bar), Reliability (retry/rollback/alerts). Hard rules: multi-tenant isolation (`broker:{broker_id}` tags, realtor pays Meta directly on own ad account, never use Dylan's GHL for Conor's clients); **Meta API safety is scope item one — a prior pulls-only attempt triggered a still-unresolved API usage block on Conor's ad account**; KPIs: CPL < $30, booking rate > 30% in 24h, pack delivery 5-pack 2/wk, 10-pack 3/wk, 20-pack 5/wk, time-to-live < 4 business days; model tiering Claude first (Max OAuth fixed cost), Hermes mid, OpenAI fallback; no em dashes in client-facing copy.
2. **Gizmo** (from "Elevated Ai" meeting transcripts, e.g. Doc IDs `12oJaEP7zsrkW5cBJyZMo0iwxPFtMGdD6200V1uWzHFA` Jul 7, `1yoXoCOPGvssxaGmoEwVqgzYq75S1T5qHXqPf2nAEGJw` Jul 6, `1O50GKf9aLnKX2Zng4DwCW1XkTT7owweDsSg5uKbxpKQ` Jul 9 recap) — Gizmo is the team's Slack-resident agent in the "tesla" channel of the Elevated AI workspace: team members open a thread topic, tag @Gizmo inside the thread (onboarding interviews, "give me a high-level breakdown of how our ads are performing over the last 3 days and 2-3 highest leverage problems"). Ty's Meta agent paused an underperforming campaign and created ~20 ad variants w/ copy + creatives autonomously in week one. Jul 9 recap decisions: shift from task-based pricing to higher retainer; goal = 5 proof-of-concept clients, then sell the AI system at $20k tickets; YouTube long-form chosen as the high-quality-lead channel; media-buying roles expected obsolete in 1-2 years.
3. **MASTER-FUNNEL-MAP.md** (file ID `1ZIpekVPRGEmCW-nIX_U9nhLf9dKPHr01`, Jun 15 2026) — The Underground funnel/content blueprint. Doctrine: "never sell, sells itself" (small win -> new way of seeing -> the door is obvious). REACH (reels + YT long-form) -> CAPTURE (one door: 60-sec quiz at underground-optins.vercel.app/metals-check) -> NURTURE (15 live emails) -> CORE ($27/mo Skool, 7-day trial) -> ASCEND ($7 Bible tripwire, $497 cohort, retreat). Storytelling frameworks: the **bubble-head method** (face-in-bubble over b-roll, hook headline top, captions above bubble); the **Lego gap** (place two facts side by side, never connect them out loud — "a belief they reached themselves cannot be argued away"); 4-video YouTube arc (Origin / Documents / Protocol / Why-Underground, only V4 pitches); sell cap 3 hard CTAs/week; discipline: prove ONE format + ONE door for 4 weeks, 10 people at $27, then scale.
4. **Elevated-AI-Brand-Sheet** (Doc ID `1z62cA6HAtMxPowWo2jTqNxD8e2a0mPQFW7iKclx65C8`, compiled 2026-07-05) — brand: dark, high-contrast "premium tech for realtors." Base #050608 near-black navy (LP stack #05080f...#1a2236); canonical accent cyan #00d4ff BUT live LP + creatives actually use mint/emerald green (#36d399 / #2ecc71) — open item: confirm go-forward accent with Dylan before locking new creative. Text #ffffff/#e9edef/#8696a0; urgency red #e74c3c; rating gold #ffd700->#ffa500. Type: Inter. Creative pattern: bold white headline, ONE word in green, green eyebrow + "Elevated AI" wordmark. Offer headline verbatim: "**10 shown appointments in 60 days or we keep working free.**"
5. **Funnel Audit - Conor Elevated AI (Jun 29 2026)** (Doc ID `1azTWMHYkU-pJA9AMVK6vLbGkkTfkXQHCTyBb3Q09gfA`) — audit of lp.elevatedaisolutions.com (score 5/10, first real lead landed at ~60% lower CPL). TIER 1 fix-now: strip income claims ($25k-45k commission, "$38,400 commission") — the offer's own compliance rule is **never state or imply income, commissions, closings, or close rate**; pull fabricated testimonials (James R., Sarah K., Marcus T., Diana M.) and fabricated stats ("200+ agents" vs "130+ agents"); FTC teeth: 16 CFR Part 465 fake-testimonial fines ~$53,088/violation + proposed Earnings Claim Rule. TIER 2: one payment story everywhere; compress 2MB Logan photo; soften "most booked agent in your market"; align scarcity to "2 agents per market." TIER 3: one CTA label; fix $75/day vs actual $60/day ad-spend mismatch. Pricing note: page must never confuse ad spend ($2,250) with pack price ($1,800/$3,000).
6. **BOTMO-KEYWORD-RESEARCH.md** (file ID `1uqpfw43nETGzkfaDUyxLPwgpFi18ZCdO`, Apr 9 2026) — BotMo = free AI-visibility scan for small businesses. Funnel: **free scan -> $27 fix code -> $297 done-for-you -> $197/mo growth -> $497/mo agent**. Target: US SMB owners (dentists, plumbers, realtors, restaurants, lawyers); secondary Filipino SMBs. Quick-win keywords (low competition, new market): "can chatgpt find my business," "ai seo checker," "ai visibility scan," "free ai website audit," "how to show up on chatgpt." Positioning vs Semrush/Ahrefs: they check SEO, BotMo checks AI visibility. GEO/AEO blog clusters trigger AI answer citations. Companion assets found: botmo-tokens.css (brand tokens: primary #22c55e green, secondary #06b6d4, accent #6366f1, dark panel #0a0a0f) and CASHCLAW-PERSONALITY.md in the same repo mirror.
7. **SEO-AUDIT-BUSINESS-RESEARCH.md** (file ID `1X1xfx01LT6qKuBE-Bw5ISG4c7bsf5bTF`, Mar 22 2026) — **the AI-SEO projections / sample-company economics**. Competitive tiers mapped (SaaS suites; white-label audit-as-lead-gen "the exact play": MySiteAuditor $39-65/mo, RoboAuditor $49/mo, MyWebAudit up to $200/mo, WebCEO $0.49/lead; AI-native: Auditsky $49/mo w/ AEO checks, LearnWithHasan free open-source). **Agentic-SEO pricing model**: Quick Audit $500 one-time (API cost $30-50 = ~90% margin), Deep Audit $1,200, retainer $2,000/mo ($500-700 cost = 65-75% margin); solo operators projected **$2,000-6,000/mo within 90 days**. Sample small-agency revenue math: 2 audits/mo @ $600 = $14,400/yr; 1-in-6 converts to $3,000 redesign = +$18,000/yr; **$32,400/yr from the audit funnel alone** plus $1-2k/mo retainers. Benchmark case study (Detailed.com): $40 video audits, 1,500+ sold, avg $5,500 upsells, six figures, one client worth $80k/2.5yr; pricing insight $40->$49 no impact, $59 dropped conversions. Free-audit-to-client conversion 30-50% when issues found. Geo finding: CPM follows TARGET country (US ~$20.48) not billing country — the PH arbitrage is in fulfillment cost (~80% lower labor), not ad cost; never mix countries in one ad set.

Also located but not deep-read (for follow-up): "Elevated AI - Logan Onboarding Package (Funnel + VSL + Proof Closes)" (Doc `1NdbAoxiyB3P3u5jCcwgZv681k_ZHHrhVhpyQYKOo8wY`), "REFERENCE - James Visionize Realtor Funnel Walkthrough" (Doc `11VboGyVmHP6X-SuN3osF9bw3ckvbTo_greqyEwWmTwI`), EA-realtor-approved-ads-copy-2026-07-06 folder (`1cOZrfKbbhLypajCqQc_QD0J7wOGmmVih`), content-engine / content-engine-platform / realestate-content-engine folders under `1MyMuysrpGQ_DhWvG8RpKJjNfCPnZAaYP`.

## (f) COPY RULES LOCKED

Any funnel copy for Elevated AI (and adjacent Dylan properties) must respect ALL of the following. Sources: Logan Script Pack (Jul 7), Funnel Audit (Jun 29), Elevated-AI-Brand-Sheet (Jul 5), TY SOP (Jun 17), UNDERGROUND-MASTER-BRIEF (May 28).

1. **Guarantee = keep-working, never money-back.** Exact: "10 shown appointments in 60 days or we keep working free." / "If we do not deliver all 10 within 60 days, we keep working until we deliver the remaining appointments." NEVER "refund," NEVER "your money back."
   - CONFLICT FLAG: older ad-copy file `15_15_ai_runs_ads_guarantee_copy.md` (file ID `1qvzjc_qfRNf00CRmRPA15igW1j0Eqx3C`) and its paired PNG still say "10 appointments in 60 days **or your money back**" in short/medium/long variants. That copy predates the Jul 7 lock and is superseded; do not reuse it as-is.
2. **No income/commission/closing claims.** Never state or imply income, commissions, closings, or close rate ($38,400-commission-style lines killed by the Jun 29 audit; FTC earnings-claim exposure). The only ROI language allowed is the agent's own attributed words. Appointment counts are fine — that is what the offer guarantees.
3. **No fabricated testimonials or stats.** Real results only (FTC 16 CFR Part 465). Use "founding spots" and mechanism framing until real Founding-5 results exist.
4. **Do not over-define "vetted."** Contract/public definitions stay exactly: vetted (matches agreed criteria + wants to buy/sell), exclusive (never resold/shared), shown (attends/answers/engages). No market-radius/intent/contact-info sub-rules in writing.
5. **Scarcity = "2 agents per market"** (not "one agent per market"). Keep scarcity claims consistent everywhere.
6. **One payment story.** Never mix "you pay for the system" with "you don't pay unless it's a real appointment" on the same asset. Never let ad-spend numbers ($40-60/day; $2,250 was the FAQ error) read as the pack price ($1,800 / $3,000; ~$2k 10-pack in beta framing).
7. **No em dashes in any client-facing copy** (Dylan's global rule; also codified in the TY SOP standards).
8. **Aggressive but truthful framing.** "Who this is NOT for" sections stay bold and disqualifying; numbers marked (SAMPLE) must be swapped for the client's real market numbers before publishing.
9. **Long, specific ad copy** that mirrors the prospect's exact language/pains/identity (Meta's AI rewards it; the pixel transcribes video + LP; backlink the VSSL transcript).
10. **Single consistent CTA per asset.** Elevated AI primary CTA: "Check availability" / market-check; pick one label and keep it identical page-wide. (Underground equivalent: single CTA "comment 888," max 3 hard CTAs/week.)
11. **Brand look (Elevated AI):** near-black navy base + one green-highlighted word per headline (mint #36d399 family), Inter type, "Elevated AI" wordmark; canonical token accent is cyan #00d4ff — confirm accent direction with Dylan before new creative.
12. **Dylan-voice rules apply wherever Dylan is the speaker** (Underground and personal-brand assets): no AI cliches, 6th-7th grade level, one thought per line, sentence-start capitals, banned-phrasing list for the NDE story, kids/Shane privacy rules.
13. **Outcome claims stay non-clinical** on Underground/health assets: feelings + self-scored before/afters, never cure/heal claims; use only the fact-checked sunscreen/fluoride framings verbatim, never the banned overclaims.
