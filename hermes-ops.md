# Hermes Ops — Single Source of Truth

> Purpose: 24/7 operating reference for Hermes (WhatsApp agent) and all other agents.
> Owner: Dylan Ewing (dylan@thedylanewing.com) · Timezone: Asia/Bangkok (GMT+7)
> Last updated: 2026-07-07

---

## 1. North Star

One offer, one niche, until $40k/mo run rate:
**Realtor Appointment Engine** — "Start getting qualified appointments in 30 days; 10 qualified, exclusive, shown appointments in 60 days or money back." ICP: realtors doing 10+ deals/year, $12–25k GCI targets.

Path to $1M/yr: ~21 clients × ~$4k/mo. Everything that doesn't add a client or make delivery cheaper is deferred.

Long-term mission this funds: retreats + healing work (Chiang Mai base).

## 2. Agent Roster

| Agent | Platform | Role | Status |
|---|---|---|---|
| Hermes | WhatsApp + Meta app "Hermes" | 24/7 ops assistant, Meta Ads MCP (OAuth) | Meta business verification pending |
| Gizmo ("Max") | Slack — Daily Paid Ads Operator Brief channel | AI ads manager: reads Meta data, pauses losers, generates variants | Live, human-in-the-loop |
| Jarvis | Calendar/daily sync | 8:30am daily review: done yesterday, tasks, blockers, priorities | Live daily |
| Kaya | Google Sheets | Cold email monitor | Live |
| Content Engine | content.thedylanewing.com | Brand interview → daily post generation → DM-to-phone publishing | Live, onboarding clients |

## 3. Payments & Payouts Ledger

| Item | Amount | Status | Rule |
|---|---|---|---|
| Ty Shane — AI ads agent build | $5,000 total | $2,500 paid 2026-06-26 (PayPal); $2,500 due on completion & running system | Release only when system is live and verified running |
| Conor — tools payment #2 | $397 | PENDING | Do NOT charge until Conor confirms in writing. Send heads-up first. |
| Logan Nelson — pay | TBD | Open action item (from 2026-07-02 call, owner: Conor) | Confirm amount + date this week |
| OpenRouter credit (agent build) | $20 loaded | Active | Shared GPT+Claude key for Ty's build |

Standing rule for all agents: **no charge to any client without written confirmation from that client.** No exceptions.

## 4. Tool Stack — Monthly Costs & Cuts

Keep (core): GoHighLevel $97 · Google Workspace ~$54 · Twilio $20 · VAPI $50 · Canva $30 · Postiz $29

Cut / consolidate this week (~$300–450/mo back):
- OpenAI x3 accounts ($60) → keep 1 ($20)
- ChatGPT $20 → cancel (redundant with Claude)
- ManyChat $82.50 + Zernio $40.78 → pick one, Postiz covers scheduling
- Video: Higgsfield $129 + Enhancor $45 (+HeyGen/Hedra/Arcads overlap) → pick 1–2 workhorses
- HuachengHK $3.79 → cancel (unidentified)
- Claude Max $200 → downgrade tier; agents run on API keys and are NOT affected by the subscription tier

## 5. Model Routing Policy (cost-optimized)

- Routine agent loops (Hermes check-ins, Gizmo briefs, monitoring): **Haiku 4.5** (`claude-haiku-4-5-20251001`)
- Default working model (drafting, ads analysis, client comms): **Sonnet 5** (`claude-sonnet-5`)
- Strategy/deep sessions only: top-tier model, batched into one session per week
- Always: prompt caching on repeated system prompts; batch API for non-urgent jobs; OpenRouter as fallback

## 6. Current Blockers (as of 2026-07-07)

1. Meta app/business verification (address/EIN mismatch) — blocks full Hermes + ads automation
2. VSL: script done → film scrappy version, pro cut after (Logan)
3. GHL lead notifications (email + mobile) — Conor
4. Onboarding intake checklist for realtor clients — not finalized

## 7. Daily Rhythm (Hermes enforces)

- 08:30 — Jarvis sync (yesterday, tasks, blockers, top 3)
- 09:00–11:00 — Revenue block: sales calls, follow-ups, pipeline (no building)
- Afternoon — Delivery/build block
- 21:30–22:30 — Team calls window (batch ALL meetings here; max 2/day)
- Friday — Scorecard: leads, appointments booked, show rate, cash collected, burn

## 8. Weekly Scorecard Targets

| Metric | Target |
|---|---|
| New qualified appointments (clients') | 10/wk/client |
| Sales calls booked (own pipeline) | 5/wk |
| New clients closed | 1/wk |
| Cash collected | ≥ $4k/wk by August |
| Monthly tool burn | ≤ $700 |
