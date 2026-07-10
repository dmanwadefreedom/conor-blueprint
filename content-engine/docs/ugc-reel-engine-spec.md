# UGC Reel Engine — Engineering & Creative Spec

**Module:** UGC / AI Influencer Studio
**Product:** The Content Engine by Elevated AI — Tier 2 "Engine + Influencer" ($1,997/mo) and Tier 3 "Full Stack" ($2,997/mo)
**Status:** Build spec v1.0 — July 2026
**Reads first:** [`open-source-video-stack.md`](../../docs/research/open-source-video-stack.md) · [`short-form-best-practices-2026.md`](../../docs/research/short-form-best-practices-2026.md)
**Related:** [`backend-architecture.md`](backend-architecture.md) · [`vsl-script.md`](vsl-script.md) · The AI Ads Department ([`../../ads-system/index.html`](../../ads-system/index.html))

---

## 0. What this module is

The machine behind the Tier 2 promise: **30 talking-head and full-body reels per month**, in the client's own cloned presenter, in the 6.3s loop and 14–16s viral formats, with B-roll injected automatically and full scripts generated per beat. At Tier 3 it also runs the **100-video testing matrix**, the **sample-reel analyzer**, and hands winners to GIZMO (The AI Ads Department) as ads-ready creative.

Design philosophy, straight from the stack research: **open source for orchestration, analysis, assembly, captions, and export. Paid APIs only at the two quality cliffs — voice and face.** Everything deterministic runs at near-zero marginal cost, which is what makes 30 reels/mo at $1,997 carry 70%+ gross margin.

---

## 1. Purpose & product paths

One engine, three seller types. Each maps to a default mix of the three content paths (Section 3).

| Seller type | What they sell | Default content-path mix | Primary formats |
|---|---|---|---|
| **Software / apps** | SaaS, mobile apps, AI tools | 40% Path C (demo-native — screen recordings are free B-roll), 40% Path A (storytelling pitch), 20% Path B | 14–16s reels + 15–30s demos |
| **Physical products** | Ecom, DTC, retail | 40% Path B (real-life use, loopable), 40% Path C (show-and-tell, unboxing, before/after), 20% Path A | 6.3s loops + 15–30s demos (30–60s if TikTok Shop tagged) |
| **Coaching / services** | Coaches, agencies, local service | 60% Path A (founder story / PAS pitch), 25% Path C (result walkthroughs), 15% Path B | 14–16s reels + 15–35s pitches |

Why all three lanes run at once: Paths A and C carry direct-response weight; Path B compounds trust and lowers blended CAC. Each lane gets its own hook matrix in testing. This is the portfolio model codified in the best-practices research (§4).

**Output contract per client per month (Tier 2):** 30 finished reels = roughly 12 × Path A, 10 × Path C, 8 × Path B, spread across the client's warmed accounts and platforms. Tier 3 clients additionally get a 100-variant testing cycle per angle (Section 6).

---

## 2. Clone system — the brand-consistent presenter

Every client gets one (or more) cloned presenters: a consistent face + voice that fronts all their content. The canonical internal reference build is the **"Logan" clone** — Logan is the face of Elevated AI's own funnel (brand: near-black navy `#050608`, cyan `#00d4ff` accent, Inter — see the Elevated AI Brand Sheet in Drive), and his clone is our proof-of-concept, demo asset, and QA benchmark. Every pipeline change ships only after it passes on the Logan clone.

### 2.1 Capture kit — what we need from the client (or from Logan)

Shot once, used for months. This is the deliverable inside the $4,997 "Done-For-You Launch + Clone Build" upsell; DIY clients follow this checklist during onboarding.

**Video (face + body base footage):**

| Asset | Minimum | Recommended | Why |
|---|---|---|---|
| Talking-head base takes | 1 × 2 min | 3–5 × 2–3 min, different outfits/settings | LatentSync re-lips existing footage; one base video per "look" = wardrobe variety across 30 reels without reshoots |
| Full-body / gesture takes | 1 × 60s | 3 × 60s (standing, seated, walking) | Full-body reels and paid-upgrade avatar builds |
| Neutral listening loops | 30s | 2 × 30s | B-roll of the presenter "reacting"; loop seams |
| Packaged-clone capture | 10s | 30s | Duix-Avatar builds an offline clone from ~10s if we go the packaged route |

Capture rules: 4K 30fps, locked or lightly handheld, even soft light, plain audio-dead room, no occlusions of the mouth, 10% of each take silent (for loop seams and lip-sync padding). Phone footage is fine — native-looking beats studio-looking in this market.

**Voice:**

| Asset | Minimum | Recommended | Why |
|---|---|---|---|
| Clean read, conversational | 30s | 10 min varied-emotion reads | Chatterbox zero-shot clones from ~30s; more reference = better stability |
| Pro-clone corpus (paid tier) | — | 30–60 min | ElevenLabs Professional Voice Clone for clients whose ad accounts justify the last 10% of quality |

**Stack choices (from `open-source-video-stack.md`, §5):**
- **Voice default:** `resemble-ai/chatterbox` — MIT, watermarked, best commercial-safe open clone in mid-2026. Paid upgrade: ElevenLabs (wins on emotional stability and long-read consistency across 50 videos).
- **Face default:** `bytedance/LatentSync` v1.6 (Apache-2.0) — best open visual quality for lip-syncing existing footage to new audio; plan a 24GB-class GPU. Throughput fallback: MuseTalk 1.5 (verify weight license before ads use). Packaged offline alternative: Duix-Avatar. Paid upgrade: HeyGen Avatar IV (~$4/min 1080p API) for client-facing paid placements where gesture/hands realism is the bar.
- **Excluded from production:** Wav2Lip, F5-TTS weights, Fish Speech weights (non-commercial licenses); XTTS-v2 (legacy, dead company).

### 2.2 Consent & likeness rights checklist

No clone gets built without every box checked. This is a hard gate in onboarding.

- [ ] Written likeness + voice license signed by the person captured (not just the company)
- [ ] Scope enumerated: platforms, organic vs paid, geographic markets, term length
- [ ] Revocation clause: what happens to in-flight content and trained assets on termination
- [ ] Explicit consent to synthetic regeneration (voice clone + lip-sync + full-body gen), not just footage reuse
- [ ] No third-party likenesses in capture footage (background people, brand marks)
- [ ] Client confirms the presenter is an owner/employee/contracted creator — if contracted, 365-day whitelisting authorization collected up front (Spark Ads / Meta partnership ads need it later; see §6)
- [ ] Platform AI-labeling plan on file: TikTok 4-tier synthetic labels (C2PA auto-detects — never skip self-disclosure), Meta "AI Info" self-label, YT Studio altered/synthetic toggle
- [ ] EU delivery? AI-content labeling is mandatory under the EU AI Act from Aug 2, 2026
- [ ] TikTok testimonial rule acknowledged: AI avatars may state facts, pricing, features, demos — **never** "I tried this and…" personal endorsements. The script engine enforces this (Section 3)
- [ ] FTC disclosure plan: promotional posts disclose in-video, immediately obvious — $53,088 per violation, per post

---

## 3. Script engine

Input: client brand brief + offer + product path. Output: a **beat sheet JSON** the assembly pipeline can execute without human interpretation.

```json
{
  "path": "A|B|C",
  "format": "loop_6.3|reel_14_16|demo_15_30",
  "hook": {"spoken": "...", "overlay": "...", "formula": "contrarian"},
  "beats": [
    {"t": [0.0, 1.5], "vo": "...", "visual": "clone_talking|broll|demo",
     "broll_queries": ["...", "..."], "caption_emphasis": ["word1", "word2"]}
  ],
  "cta": {"spoken": "...", "caption": "...", "pinned_comment": "..."},
  "compliance": {"ai_label": true, "ad_disclosure": "in_video", "testimonial_language": false}
}
```

### 3.1 The three content paths — prompt templates

The generation LLM gets one of three system prompts. Placeholders in `{{double_braces}}` come from the client brief.

**Path A — Pure storytelling pitch → CTA (15–35s)**

```
You write short-form video scripts that feel like a person talking, not an ad.

PRODUCT: {{product_name}} — {{one_line_what_it_is}}
BUYER: {{icp}} who feels {{core_pain}} daily.
PROOF: {{single_strongest_proof_point_with_number}}
OFFER/CTA: {{cta_action}}

Write a {{length}}s talking-head script using the {{framework: PAS | founder_story}} spine:
1. HOOK (first 1.5s, 10–14 words, start mid-sentence, no greeting): use the
   {{hook_formula}} formula. Also write a 4–7 word text overlay for frame 1.
2. AGITATE (2–3 short sentences): the downstream cost of the pain. Specific,
   second person, numbers where possible.
3. REVEAL (1 sentence): name the product once as the release valve. No feature list.
4. PROOF (1 sentence): the single proof point. One number.
5. CTA (final 3s, 1 sentence): one ask only. Also write the pinned comment.

RULES: sentences under 12 words. No corporate words (solution, leverage, seamless,
innovative). No exclamation marks. Write like texting a friend who asked for advice.
The presenter is a synthetic avatar: state facts and demonstrations only — never
first-person usage claims or testimonials ("I tried", "changed my life" = rejected).
Mark 2–4 emphasis words per beat for caption highlighting.
For each beat, write 2–3 concrete B-roll search queries (things a stock library
would actually have).
```

**Path B — Real-life product use, loopable (6–15s)**

```
You write scripts for lifestyle clips where the product appears incidentally.
The video should not know it's an ad. No pitch. No feature naming on camera.

PRODUCT: {{product_name}} used naturally during {{daily_moment}}.
VIBE: {{aesthetic — e.g. 7am kitchen light, desk setup, gym bag}}

Write a {{6.3|10|15}}s clip spec:
1. VISUAL SEQUENCE: 3–5 shots, each 1–3s, describing exactly what's on screen.
   Product visible but never presented to camera. Mid-action from frame 1.
2. SPOKEN LINE (optional, one sentence max) OR ambient-only with a 3–6 word
   text overlay. If 6.3s loop: split the sentence — SECOND half opens the video,
   FIRST half closes it, so the loop point completes the thought.
3. CAPTION + pinned comment: this is where the only CTA lives.
4. AUDIO: one continuous bed (trending-audio slot or original ambient), no cut
   at the loop seam.

RULES: nothing that reads as an ad in the first 5 seconds. No logos in frame 1.
No discount codes on screen. The FTC disclosure goes in the on-screen text of
the final second and the caption ("#ad") — it must still be obvious.
```

**Path C — Show-and-tell demo (15–30s; 30–60s if TikTok Shop tagged)**

```
You write demo scripts where the result IS the hook. Product on screen from frame 1.

PRODUCT: {{product_name}}. DEMONSTRABLE MOMENT: {{the_thing_that_removes_doubt}}
BEFORE/AFTER available: {{yes/no + description}}

Write a {{length}}s demo script:
1. HOOK (frame 1): show the END RESULT or the most satisfying demo moment first.
   Spoken line ≤12 words framing what they're about to watch ("watch what happens
   when…"). Overlay text: the outcome, with a number.
2. DEMO BEATS (3–5 beats, 2–4s each): each beat = one action on screen + one
   spoken sentence tying the feature to a felt benefit. Doubt-removal order:
   biggest objection first.
3. PROOF BEAT: one number on screen (time saved, count, before/after delta).
4. CTA (final 3s): one direct ask. If TikTok Shop tagged, reference the tag.

RULES: narrate what the viewer sees, never what the brand wants to say.
A demo removes doubt — every beat answers "yeah but does it actually…".
Avatar states facts and demonstrations only, no personal endorsements.
```

### 3.2 Hook libraries

Eight formulas ship with the engine (from the 2026 hook research). The variant generator (Section 6) draws from these per path. Per-seller-type starter examples:

| Formula | Software/app | Physical product | Coaching |
|---|---|---|---|
| Contrarian claim | "Your CRM is why you're losing deals, not your leads." | "Expensive skincare is mostly water and marketing." | "Posting more content is killing your sales." |
| Mistake warning | "Stop paying for ads before you fix this one screen." | "You're storing this wrong and it's costing you." | "Most coaches price themselves out of referrals." |
| List tease | "Three settings nobody turns on in this app." | "Three things in your kitchen doing this job worse." | "Three questions that close high-ticket calls." |
| Outcome-first | Show the dashboard after: "42 booked calls. Zero cold outreach." | Before/after in frame 1, then rewind. | "From 2 clients to a waitlist. Here's the exact change." |
| Curiosity gap | "Here's what nobody tells you about churn." | "Here's why this sells out every restock." | "Here's what the top 1% of closers never say." |
| Discovery | "I was today years old when I found out my invoices could chase themselves." | "I was today years old when I found out what this button does." | "I was today years old when I learned discovery calls have a script." |
| POV / question | "POV: you finally found the tool your ops person kept begging for." | "POV: your morning routine got 20 minutes back." | "POV: your calendar fills itself." |
| Comment-bait opener | "…and that's why the free plan is actually the trap." | "…which is exactly why it keeps selling out." | "…no, the niche isn't too saturated. Here's proof." |

Kill rule inherited from research: any hook variant under **25% 3-second hold at 48h** dies. Above **60% 3-sec hold** = distribution expands beyond followers.

### 3.3 Format specs — beat timing tables

**6.3s seamless loop** (189 frames @ 30fps). Goal: viewer watches 2–3 times before noticing the restart; average watch time >100%. TikTok weights rewatches ~2x.

| Beat | Time | Frames | Job |
|---|---|---|---|
| Cold entry | 0.00–0.80s | 0–24 | SECOND half of the loop sentence, already mid-word. Motion in frame 1. Overlay text visible. |
| Payoff | 0.80–4.20s | 24–126 | One visual payoff only: the demo moment, transformation, or satisfying action. No cut longer than 1.5s. |
| Loop seam | 4.20–6.30s | 126–189 | FIRST half of the loop sentence, ending exactly where frame 0 picks up. Final frame is a pixel-match to frame 1. Audio bed continuous across the seam — one black frame or a millisecond of silence kills the illusion. |

Assembly enforcement: renderer diffs last-frame vs first-frame (open_clip embedding distance below threshold) and rejects loops with an audible seam (waveform discontinuity check at the cut).

**14–16s reel** (IG completion sweet spot — completion is the biggest discovery signal and hardest to fail at ~15s; 2026 viral threshold ≈70% completion).

| Beat | Time | Job |
|---|---|---|
| Hook | 0.0–1.5s | Spoken hook lands inside 1.5s (10–14 words total, delivery starts mid-sentence). Frame-1 text overlay. Cut at 1.5s. |
| Agitate / context | 1.5–5.0s | Pain amplification or setup. Exactly one B-roll cutaway (2–3s). |
| Reveal | 5.0–8.5s | Product named once. Path C: product action on screen. Back to clone. |
| Proof | 8.5–12.0s | One number, one shot. B-roll or screen capture. |
| CTA | 12.0–15.5s | Single ask, spoken + overlay. Disclosure visible. End on a frame that rewards a replay (callback to hook overlay). |

**15–30s demo (Path C)** follows the same grid with 3–5 demo beats of 2–4s each replacing Agitate/Reveal; 30–60s allowed only when TikTok Shop tagged (tagged discovery-commerce converts ~3.2x vs traditional ecommerce).

### 3.4 "Ad that doesn't look like an ad" rules (hard-coded linter)

Every script passes a rules check before assembly. Failures bounce back to the generator with the violation named.

1. Hook first, brand last. Product name never appears before the reveal beat (Path A/B).
2. No greeting, no intro, no logo sting, no "as a business owner…".
3. Sentence length ≤12 words. Reject: solution, leverage, seamless, revolutionize, game-changer, unlock.
4. One CTA. Two asks = rejection.
5. Native texture: handheld or locked-off single setup, no lower-thirds, captions in platform-native style.
6. Litmus question logged with every script: *does this feel native to the platform, or like an ad?*
7. Compliance is not optional native-ness: FTC disclosure must be immediately obvious inside the video experience (final-second overlay + caption), AI labels applied per platform, and no avatar testimonial language ever (regex + LLM check for first-person usage claims).

---

## 4. Assembly pipeline

Reference pipeline from the stack research, productionized. Each stage is an idempotent worker consuming/emitting job JSON on a queue (see [`backend-architecture.md`](backend-architecture.md)); any stage can be re-run in isolation.

```
beat_sheet.json
  1. VOICE     Chatterbox (self-host, MIT) renders VO from the client's voice clone.
               Per-beat WAVs + a full-track render. Paid lane: ElevenLabs API.
  2. FACE      LatentSync 1.6 lip-syncs the chosen base take (outfit/setting picked
               per variant) to the VO track. MuseTalk lane when throughput > fidelity.
               Full-body/gesture lane: Duix-Avatar packaged clone or HeyGen Avatar IV
               (paid, ~$4/min) for ads-bound creative.
  3. B-ROLL    Per-beat: broll_queries → Pexels + Pixabay APIs → candidate pull →
               open_clip re-rank against beat text → best clip trimmed to 2–4s.
               Gen-fill lane for impossible shots (product-in-hand, specific rooms):
               Higgsfield / Kling / Veo via API. Client-supplied asset library is
               always ranked first (their real product footage beats stock).
  4. CAPTIONS  whisperX on the final VO → word-level timestamps → karaoke captions.
               Renderer A (default): whisperX JSON → styled .ass with \k tags →
               burned by ffmpeg/libass. Renderer B (branded template): Remotion
               composition with @remotion/captions (word-pop style, brand fonts/colors).
               Emphasis words from the beat sheet get the highlight color.
  5. MUSIC/SFX Licensed bed per format (continuous bed mandatory for loops), sidechain
               duck under VO (-8dB), SFX only on demo beats (whoosh/pop ≤2 per reel).
               Loudness target -14 LUFS.
  6. COMPOSE   1080×1920 timeline: clone base layer, B-roll cutaways on the beat grid,
               captions, overlay text layer, disclosure/label layer. Remotion comp or
               bare FFmpeg filtergraph (overlay + xfade + subtitles=ass) — filtergraph
               is the default for fixed formats; Remotion when the client has a
               branded template. auto-editor pre-pass strips dead air from any real takes.
  7. EXPORT    H.264 high, yuv420p, CRF 18, 30fps, AAC 192k, loudnorm -14 LUFS,
               +faststart. Emit .srt sidecar + cover frame + loop-seam QA report.
  8. VARIANTS  Per-platform mutations from one master: TikTok (native captions burned,
               AI label metadata), IG Reels (safe-zone check for UI chrome, AI Info
               self-label), YT Shorts (30–45s cut-up lane where the format allows,
               synthetic-content flag reminder in the post packet).
└─► out/{client}/{campaign}/{variant_id}_9x16.mp4 + post-packet.json
```

**QA gates (automatic):** hook overlay present in frame 1 · loop seam frame/audio diff pass (6.3s only) · caption/word alignment drift <80ms · disclosure layer present on promotional posts · avatar-testimonial lint pass · duration within format tolerance (±0.2s).

**Throughput math:** the two GPU stages (face, upscale) budget ~3–6 min/reel on a 24GB card; everything else is CPU-cheap. One GPU box sustains 100+ reels/week — the Tier 3 testing matrix and the "50 videos/day" feed that The AI Ads Department (GIZMO) consumes.

---

## 5. Sample Reel Analyzer (Tier 3)

Client (or we) drops in any reel that's working — a competitor's, a viral reference, their own past winner — and the engine reverse-engineers it into a reusable spec, then regenerates "our version" with the client's clone and product.

Pipeline (tools per `open-source-video-stack.md` §6):

```
sample_reel.mp4
  1. PROBE        ffprobe: duration, fps, resolution, bitrate.
  2. SHOTS        PySceneDetect: shot boundaries → cut cadence, avg shot length,
                  pacing curve (cuts/sec over time).
  3. TRANSCRIPT   whisperX: full transcript + word-level timing → hook text, WPM,
                  pause map, caption timing to imitate.
  4. VOICES       pyannote diarization: single creator vs dialogue format.
  5. EMOTION      emotion2vec on the audio: energy/valence per segment — captures
                  DELIVERY style, not just words.
  6. FRAMES       1 keyframe per shot → local vision-language model tags: shot type
                  (talking-head / B-roll / demo / screen-rec), framing, on-screen
                  text (OCR), product presence, facial emotion.
  7. CLASSIFY     open_clip embeddings: talking-head vs B-roll ratio, near-duplicate
                  shot detection, loop detection (first/last frame similarity).
  8. HOSTED LANE  Higgsfield video_analysis + virality_predictor as the fast
                  first-pass; the OSS stack above is the deterministic/local fallback.
└─► reel_spec.json
```

**`reel_spec.json` (the contract between analyzer and generator):**

```json
{
  "duration_s": 14.8, "format_guess": "reel_14_16",
  "hook": {"ms": 1400, "text": "...", "type": "contrarian", "overlay_frame1": true},
  "pacing": {"cuts_per_sec": 0.61, "avg_shot_s": 1.6, "curve": [/* per-second */]},
  "structure": [{"beat": "hook", "t": [0, 1.4]}, {"beat": "agitate", "t": [1.4, 5.1]}],
  "broll_ratio": 0.42, "caption_style": {"karaoke": true, "words_per_group": 3},
  "delivery": {"wpm": 168, "energy_curve": [/* per-beat */], "pause_map": []},
  "cta": {"t": [12.1, 14.8], "type": "spoken+overlay"},
  "loop": {"is_loop": false}
}
```

**Regeneration:** the script engine takes `reel_spec.json` + the client brief and writes a new beat sheet that copies the *structure* (beat timing, pacing curve, caption grouping, energy curve, hook formula) while replacing all *content* (their product, their clone, their B-roll, their proof points). Delivery matching: the TTS emotion controls are driven from the sample's energy curve. What we never copy: their words, their footage, their audio. Structure isn't ownable; content is.

---

## 6. Testing Matrix (Tier 3 — the 100-video engine)

The 2026 operating model from the research: **cheap validation first, paid budget after data confirms.** AI-UGC organic posting is the validation layer; Spark Ads / whitelisting is the scaling layer.

### 6.1 Variant generation

Matrix per angle cycle: **hooks (8 formulas × 2–3 lines each) × scripts (2 frameworks) × B-roll sets (2) × formats (6.3s loop / 14–16s reel / 15–30s demo)** → prune to 100–120 variants. Structured as sprints of **10–20 variants, each sprint isolating exactly one variable** (hook, offer framing, avatar look, or CTA). Under 10 = too little signal; over ~30 simultaneous = fragmented signal. Variants within a sprint run **simultaneously, not sequentially**.

Iteration rule: iterate winners, don't clone them — new hook on a winning body, or new body under a winning hook. One variable at a time.

### 6.2 Distribution across warmed accounts

Posted across a bench of AI-influencer accounts per client (plus the client's own handles). Non-negotiable account hygiene from the platform research:

- **14-day warm-up for every new account:** days 1–2 profile + feed training (browse the target niche/geo), days 3–5 light engagement, days 6–10 one low-pressure post/day, days 11–14 test two formats/windows, then ramp. Skipping this gets a sticky spam label.
- Unique bios, avatars, posting schedules per account. No shared devices or IPs — identical fingerprints get banned in batches. (Residential proxy per account identity; managed by Hermes, Section 8.)
- Every account carries the platform AI labels (TikTok synthetic label, Meta AI-creator label — Meta states no distribution penalty).
- Cadence caps per research: IG 2–4 reels/week/account, Shorts 3–5/week, TikTok ramped per warm-up curve.

### 6.3 KPI thresholds (decision table)

| Signal | Threshold | Action |
|---|---|---|
| 3-sec hook rate | <25% at 48h | Kill variant |
| 3-sec hook rate | >60% | Flag: distribution expanding — watch for winner |
| Completion | >70% (TikTok), >50% (IG) | Winner candidate |
| Loop rate (6.3s) | avg watch time >100% | Winner candidate |
| Saves + shares | top decile of sprint | Winner candidate |
| Comment quality | buying-intent questions present | Route comments to script engine as comment-reply variants |

Winner = clears hook + completion thresholds and top-3 of its sprint on saves/shares. Metric pulls: platform APIs where available; public-count scraping via the Obscura headless-browser lane (see [`obscura-browser-ai.md`](../../docs/research/obscura-browser-ai.md)) on a cron for view/engagement counts across all variants at trivial cost.

### 6.4 Winners → ads (GIZMO handoff)

Cleared winners get packaged for The AI Ads Department:

1. Collect the **Spark Ads code** (TikTok) / confirm the **365-day whitelisting authorization** (Meta partnership ads) — collected at onboarding, verified here.
2. Emit `winner-packet.json`: video master + variants, organic benchmark numbers, hook/formula lineage, audience notes from comments.
3. GIZMO runs the paid side: equal budgets across 3–5 finalists → kill losers → raise winner budgets **20–30% every 3–4 days** → refresh creative every **10–14 days (TikTok) / 14–21 days (Meta)**, pulling the next matrix cycle from this engine.

Benchmarks that justify the handoff: Spark/whitelisted ads run ~142% higher engagement, ~43% higher CVR, ~67% lower CPA than cold creative.

---

## 7. Expansion modules

Adjacent channels the same pipeline can serve. Each carries an explicit policy-risk grade from the research — sold as add-ons only with the risk stated.

### 7a. Ambient / rain-sound YouTube channels — risk: MEDIUM

- **Pipeline reuse:** music/SFX stage generates or licenses original ambient beds; compose stage renders long-form (1–10h) loops with distinctive generated visuals; Hermes schedules uploads.
- **Revenue path:** art-track distribution via a music aggregator monetizes through YouTube Music **without** channel YPP approval — the reliable lane. Diversify to DSPs, licensing, sponsorships.
- **Risk notes:** massively oversaturated; squarely inside YouTube's "inauthentic content" policy if templated. Mitigations: original recorded/composed audio (no loop packs), distinctive visuals per video, slower cadence.

### 7b. AI kids-cartoon channels — risk: HIGH (do not sell without a signed risk acknowledgment)

- **Policy stack:** COPPA "Made for Kids" labeling mandatory (FTC fines to $53,088/violation; a ~$10M fine landed in late 2025); YouTube Misleading Family Content rules; 200+ advocacy groups petitioned for an outright ban in April 2026; an AI kids channel was terminated in the Jan 2026 enforcement wave.
- **Concrete tripwires:** <30% of runtime with commentary triggers review; 5+ videos sharing a visual template with <20% script variation can be bulk-demonetized.
- **If pursued anyway:** human-written stories with a real editorial voice, high per-video variation, correct MFK labels, synthetic disclosure — and expect ad rates capped by MFK's disabled personalization. Our default recommendation: don't.

### 7c. Educational / mystery cartoon B-roll niches — risk: MEDIUM-HIGH

- **Why it works:** animated storytelling + dark-history/mystery = 70–82% retention on 15–30 min deep dives, $5–12 RPMs, cheap production via the B-roll and caption stages.
- **Risk notes:** recycled cartoon clips + verbatim TTS narration is *exactly* the templated pattern purged in the Feb 2026 enforcement wave; reused cartoon footage carries Content ID exposure; sensational/tragedy-adjacent content had ad limits added Jan 2026.
- **Mitigations:** original animation or heavily transformed B-roll, human-written scripts with original research, directed voice with personality, "explaining/debunking the theory" framing — curiosity, never assertion. Synthetic-scene disclosure toggled.

---

## 8. Hermes — the agent that runs the engine

Hermes is the Tier 3 automation agent. It lives on a VPS (not the GPU box), owns the operational loop, and is controlled from Telegram.

**Jobs:**

1. **Queue management** — feeds the assembly pipeline: pulls approved beat sheets, orders jobs by client SLA (Tier 2 monthly quotas first, then matrix sprints), retries failed stages, escalates hard failures.
2. **Approval workflow** — pushes finished reels to the client approval surface (the Content Engine admin dashboard, [`../admin/index.html`](../admin/index.html)); nothing posts without an approval record. Auto-approve rules per client are opt-in and logged.
3. **Posting** — schedules approved reels across the warmed account bench per the cadence caps; enforces warm-up curves for new accounts; applies per-platform AI labels and disclosure text on every promotional post; staggers posting windows per account identity.
4. **Metric pulls** — platform APIs + Obscura scraping cron every 6h; writes to the metrics store; evaluates the §6.3 decision table; kills, flags, and packages winners automatically.
5. **Telegram control surface** — the client-facing and operator-facing remote: `/status` (queue + quota), `/approve <id>` `/reject <id> <reason>`, `/kill <variant>`, `/winners`, `/sprint new <variable>`, `/pause <account>`, daily digest at 8am client-local (posted, killed, winners, spend handoffs). Operator-only commands gated by chat ID allowlist.
6. **Housekeeping** — proxy health checks, account-fingerprint hygiene alerts, storage rotation (masters to cold storage after 60 days), license watchlist pings (Remotion seat count, weight-license changes).

**Infra:** single VPS (4 vCPU / 8GB) for Hermes + queue + metrics DB; GPU box (24GB-class) for face/upscale stages; object storage for masters and post-packets. All jobs idempotent; Hermes state survives restarts via the queue, never in-memory.

---

## 9. Build phases & effort estimates

Estimates are focused dev-days for one experienced builder with the research already done (it is). Phases 1–3 = Tier 2 shippable. Phases 4–5 = Tier 3.

| Phase | Scope | Effort | Exit criteria |
|---|---|---|---|
| **0 — Clone foundation** | Capture kit doc + consent gate; Logan capture session; Chatterbox voice clone; LatentSync base-footage pipeline on the GPU box; one hand-assembled reel | 4–5 days | Logan clone passes the "2-second test" internally on one 14–16s reel |
| **1 — Script engine** | Three path prompts, hook libraries, beat-sheet JSON schema, format linter, compliance linter (testimonial/disclosure/banned-words) | 4 days | 20 beat sheets generated, 100% linter-clean, human spot-check ≥80% usable |
| **2 — Assembly MVP** | Voice → face → captions (.ass lane) → compose (FFmpeg filtergraph) → export + QA gates; 14–16s format only | 6–8 days | Beat sheet → finished reel with zero manual steps; 10 reels batch-run clean |
| **3 — B-roll + loops + variants** | Pexels/Pixabay pull + open_clip re-rank + client asset library; 6.3s loop lane with seam QA; per-platform variant mutations; Remotion branded-template lane | 6–8 days | Loop seam auto-QA passing; 30-reel monthly batch for first client delivered. **← Tier 2 live** |
| **4 — Testing matrix + Hermes** | Variant matrix generator; account-bench management + warm-up scheduler; posting + metric pulls (API + Obscura cron); KPI decision table; Telegram surface; GIZMO winner-packet handoff | 10–12 days | One full 100-variant cycle run end-to-end; winners packaged and accepted by the ads system. **← Tier 3 live** |
| **5 — Sample Reel Analyzer** | Analyzer pipeline (PySceneDetect/whisperX/pyannote/emotion2vec/VLM/open_clip), Higgsfield hosted lane, `reel_spec.json` → regeneration path | 6–8 days | Any pasted reel → our-version reel in under 30 min of compute |
| **6 — Expansion modules** | 7a/7c pipelines only if sold; 7b off the menu by default | scoped per deal | Signed risk acknowledgment on file before build |

**Total to Tier 2:** ~20–25 dev-days. **Total to Tier 3:** ~36–45 dev-days.

**Running costs per client (Tier 2, 30 reels/mo):** GPU amortization + stock APIs + storage ≈ $60–120/mo on the self-host lanes; +$100–300/mo if the client's ad spend justifies the ElevenLabs/HeyGen paid lanes. Against $1,997/mo, margin holds above 70% either way — which is the whole point of paying the open-source tax up front.

**Licensing watchlist (re-check before each client launch):** Remotion company license once the team passes 3 people; OpenMontage is AGPL — steal its patterns, never resell it hosted; MuseTalk and IndexTTS-2 weight licenses read-before-shipping-ads; Wav2Lip / F5-TTS / Fish Speech weights stay excluded; Pexels/Pixabay ToS fine for commercial use, no raw-clip redistribution.
