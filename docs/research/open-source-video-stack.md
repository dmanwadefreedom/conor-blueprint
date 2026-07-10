# Open-Source Video Production Stack — July 2026

Research for the automated UGC / short-form content engine. Repo stats (stars, license, last push) verified against the GitHub API on **2026-07-10**. Honest capability notes included — star counts measure hype, not output quality.

---

## 1. End-to-end short-video generators

| Repo | Stars | License | Activity | Verdict |
|---|---|---|---|---|
| `harry0703/MoneyPrinterTurbo` | 96.5k | MIT | Active (v1.3.0 Jun 2026) | Best-known keyword→video pipeline. Script (LLM) → Pexels footage → TTS → subtitles → BGM. Output is generic stock-footage slop — fine as a **reference architecture**, not a brand-quality product. Chinese-first project; English docs OK. |
| `calesthio/OpenMontage` | 36.3k | **AGPL-3.0** | Very active (created Mar 2026, pushed daily) | The 2026 breakout. Agentic video production system built to be driven by Claude Code/Cursor: 12 pipelines (Talking Head, Avatar Spokesperson, Clip Factory, Documentary Montage, Hybrid, Podcast Repurpose…), 52 tools, 500+ agent skills. Wraps paid providers (Kling, Veo, HeyGen, ElevenLabs, Suno) *and* local tools (Remotion, WhisperX, FFmpeg, Piper TTS, Real-ESRGAN). CLIP-indexed B-roll retrieval, approval gates, budget controls. Caveats: 3 months old, AGPL copyleft (fine for internal content ops; a problem if you resell it as a hosted service). |
| `FujiwaraChoki/MoneyPrinterV2` | 31.2k | MIT | Semi-active | Broader "make money online" automation (YT + Twitter + outreach). Video module is weaker than MPT; stars ≠ substance. Original MoneyPrinter is superseded. |
| `RayVentura/ShortGPT` | 7.7k | MIT | **Dormant** (last push Feb 2025) | The 2023 pioneer. EdgeTTS/ElevenLabs + Pexels + MoviePy. Good ideas (content engines abstraction), stale deps. Read it, don't build on it. |
| `SamurAIGPT/AI-Youtube-Shorts-Generator` | 4.2k | MIT | Active | Different job: long-form → viral 9:16 clips (open Opus Clip/Klap alternative). Whisper transcription + LLM highlight detection + auto vertical crop. Useful for repurposing, not for net-new UGC. |
| `mutonby/openshorts` | 2.6k | MIT | New (Dec 2025); note: is a GitHub fork | Self-hosted "Clip Generator + AI Shorts (UGC with AI actors) + YouTube Studio". Closest OSS attempt at the AI-UGC-actor product category; young and JS-monolithic. Watch, don't bet on. |

**Takeaway:** none of these produce client-ready UGC out of the box. MoneyPrinterTurbo proves the plumbing; OpenMontage is the right *orchestration* skeleton (and is literally designed to be driven by Claude Code). The quality comes from the component choices below.

## 2. Programmatic / CapCut-like editors (30s+ assembly)

| Repo | Stars | License | Activity | Verdict |
|---|---|---|---|---|
| `remotion-dev/remotion` | 52.7k | **Source-available** (free for individuals & ≤3-person companies; paid company license) | Very active | The industry default for templated, data-driven video in React. Official TikTok template with word-timed captions (`@remotion/captions`, `@remotion/install-whisper-cpp`), Lambda/node rendering, 9:16 first-class. Best choice for a repeatable branded format. Budget the license if the company grows. |
| `motion-canvas/motion-canvas` | 18.8k | MIT | Active but maintainer-constrained (170 open issues) | Truly open. Imperative/generator animation model — superb for hand-crafted motion graphics, worse for "render 50 videos from JSON". Not the automation tool. |
| `redotvideo/revideo` | ~3k | MIT | **Dormant upstream** | Motion Canvas fork aimed at exactly our use case (parametrized video apps). Team pivoted to Midrender (closed product); OSS repo no longer receives their new work. Avoid for new builds. |
| `WyattBlue/auto-editor` | 4.5k | Unlicense (public domain) | Very active (pushed this week; rewritten in Nim) | Not a compositor — an automatic *cutter*: strips silence/dead frames from raw takes, exports to timeline formats. Perfect pre-pass on real talking-head footage. |
| `mifi/editly` | 5.4k | MIT | **Unmaintained** (declared by author) | Was the nicest declarative CLI editor. Dead; keep only as API-design reference. |
| `tnfe/FFCreator` | 3.2k | MIT | Dormant | Node/canvas short-video renderer from Tencent; effectively legacy. |
| FFmpeg (+ MoviePy v2 / ffmpeg-python) | — | LGPL/GPL | Evergreen | The substrate everything above shells out to. For a fixed 30–60s format, a bare FFmpeg filtergraph pipeline (overlay, xfade, subtitles=ass, loudnorm) is the fastest and most reliable path — this is what MPT and OpenMontage do internally. |

**Takeaway:** Remotion for the branded template + captions; auto-editor for cleaning raw takes; FFmpeg for the final mux. Skip editly/FFCreator/revideo.

## 3. B-roll injection / smart asset matching

No mature standalone repo owns this. The working patterns:

- **`Anil-matcha/AI-B-roll`** (126 stars) — tiny but canonical pattern: transcript → per-segment keyword extraction → Pexels API → overlay cutaways. Treat as reference code, not a dependency.
- **OpenMontage's Documentary/Hybrid pipelines** — the best open implementation of *smart* matching: builds a **CLIP-indexed corpus** from Pexels, Pixabay, Archive.org, NASA, Wikimedia, then does retrieval-first editing. Steal this design.
- **MoneyPrinterTurbo footage stage** — LLM-generated search terms → Pexels/Pixabay download. Simple, works, dumb-keyword failure modes.
- **Recommended DIY (own it, ~200 LOC):** whisperX segments → LLM writes 2–3 visual queries per script beat → Pexels+Pixabay API pull → re-rank candidates with `open_clip` (`mlfoundations/open_clip`, MIT) against the beat text → enforce 2–4s cutaway grammar. For shots stock can't provide (product-in-hand, specific rooms), generate with Wan 2.2 locally or a paid gen API (Higgsfield/Kling/Veo).

## 4. Auto-captioning (whisper-based, karaoke)

| Tool | Stats | Notes |
|---|---|---|
| `openai/whisper` | 104.6k, MIT | The base model. Use a wrapper below, not raw. |
| `m-bain/whisperX` | 23.0k, BSD, active | **The workhorse.** 70x-realtime (faster-whisper backend), forced-alignment **word-level timestamps**, integrated pyannote diarization. Emits the JSON every caption renderer wants. |
| Remotion `@remotion/captions` + TikTok template | part of Remotion | Production-grade karaoke/word-pop captions (Hormozi/MrBeast styles) rendered inside the same composition as everything else. Pairs with whisper.cpp or whisperX JSON. |
| `unconv/captacity` | 139 stars | Micro-repo: whisper word timestamps → MoviePy burned-in word-by-word captions. The pattern is right; the repo is a snippet. Fork/vendor it. |
| `absadiki/subsai` | ~2k, GPL | Web-UI/CLI over whisper variants; good for humans, less for pipelines. |
| ASS/libass route | — | whisperX JSON → styled `.ass` with `\k` karaoke tags → `ffmpeg -vf subtitles`. Zero-dependency, fully scriptable, CapCut-look with the right style block. Best choice if the renderer is FFmpeg rather than Remotion. |

## 5. Talking head / lip-sync / avatar clone + voice clone TTS

### Face / lip-sync

| Repo | Stars | License | Activity | Honest assessment |
|---|---|---|---|---|
| `bytedance/LatentSync` | 5.9k | Apache-2.0 | Last push Jun 2025 (v1.6) | **Best open visual quality** for lip-syncing *existing footage* to new audio — sharp mouth interior, holds at 720p+. Slow and VRAM-hungry (plan on 24GB-class GPU for comfort; ~6.8GB possible with optimizations at lower res). The default OS choice for a "clone the creator" engine. |
| `TMElyralab/MuseTalk` | 6.1k | Custom (code open, weights separately licensed — check before commercial) | v1.5; last push Sep 2025 | Real-time-capable (30fps on V100) latent inpainting. Faster than LatentSync, slightly softer identity/sync. Pick for throughput. |
| `antgroup/echomimic_v3` | 1.0k (v2 ~3k) | Apache-2.0 | Active (AAAI 2026) | 1.3B unified multi-modal human animation (face + body from audio). Impressive demos; research-grade edges; photo-driven rather than footage-driven. |
| `fudan-generative-vision/hallo3` | 1.4k | Research license | CVPR 2025 | Video-diffusion portrait animation from one image. Cinematic but slow; identity drift on long clips. |
| `OpenTalker/SadTalker` | 13.9k | Apache-2.0 (relicensed; non-commercial restriction removed) | Dormant since ~2024 | The 2023 legacy single-image talker. Uncanny head-bob; superseded — keep only as fallback. |
| `Rudrabha/Wav2Lip` | 13.1k | **Non-commercial** research license | Ancient (2020) but immortal | Still the most robust cheap lip-sync; blurry 96px mouth. Commercial HD path = Sync Labs' paid API. |
| `duixcom/Duix-Avatar` (ex-Duix.Heygem) | 13.9k | Free commercial use (custom; agreement required above 100k users / $10M revenue) | Active; v1.0.6 Sep 2025 | **Open HeyGen-alike**: fully offline avatar+voice clone from ~10s of video, Windows/Linux, RTX 4070-class. The most product-shaped OS avatar stack; quality below HeyGen Avatar IV, well above SadTalker. |
| `KwaiVGI/LivePortrait` | ~15k | MIT (InsightFace dep is non-commercial — swap detector for commercial use) | 2024-era | Expression/motion retargeting, not audio lip-sync; useful to add liveliness to stills. |

### Voice clone TTS

| Repo | Stars | License | Assessment |
|---|---|---|---|
| `resemble-ai/chatterbox` | 25.4k | **MIT** | Zero-shot clone + emotion-exaggeration control, built-in PerTh watermark. Beat ElevenLabs in blind tests on some sets. **Best commercial-safe open default in mid-2026.** |
| `index-tts/index-tts` | 21.8k | Code Apache-2.0; weights custom Index license | IndexTTS-2 (late 2025): emotion-controllable, duration-controllable zero-shot — the current OS quality frontier, esp. bilingual EN/ZH. Verify weight license for commercial ads. |
| `SWivid/F5-TTS` | 14.9k | Code MIT; **weights CC-BY-NC** (Emilia data) | Excellent 3-second-reference cloning; non-commercial weights make it a prototyping tool, not a product component. |
| `fishaudio/fish-speech` | 31.2k | Code open; weights CC-BY-NC-SA; commercial via fish.audio API | OpenAudio S1 lineage; top naturalness; same weights-license trap. |
| `coqui-ai/TTS` (XTTS-v2) | 45.7k | CPML (non-commercial) | Coqui the company died Jan 2024; use community fork `idiap/coqui-ai-TTS` (2.3k) if at all. XTTS-v2 now clearly behind Chatterbox/IndexTTS-2. Legacy. |

## 6. Frame-by-frame reverse-engineering of a sample reel

| Tool | Stats | Role |
|---|---|---|
| `Breakthrough/PySceneDetect` | 5.0k, BSD-3, active | Shot boundaries → cut cadence, avg shot length, pacing curve. |
| `m-bain/whisperX` | 23.0k | Transcript + word timing → hook text, WPM, pause map, caption timing to imitate. |
| `pyannote/pyannote-audio` | 10.3k, MIT (HF-gated models) | Speaker diarization (single creator vs dialogue format). `MahmoudAshraf97/whisper-diarization` (5.6k) is convenient glue. |
| `mlfoundations/open_clip` | MIT | Cheap per-shot embedding: talking-head vs B-roll classification, near-duplicate shot detection. |
| Local VLM: Qwen2.5-VL / LLaVA-Video | Apache-ish | Keyframe tagging: shot type, framing, on-screen text, product presence, facial emotion. |
| `FunASR / emotion2vec` | open | Voice emotion/energy per segment — matches delivery style, not just words. |
| Paid shortcut | — | Gemini 2.x video-in or GPT-4o frames: one call returns shot list + style notes; and **Higgsfield's `video_analysis` + `virality_predictor` MCP tools are already wired into this workspace** — use them as the first-pass analyzer and keep the OSS stack as the deterministic/local fallback. |

Practical recipe: `ffprobe` metadata → PySceneDetect scene list → 1 keyframe/scene → VLM tag pass → whisperX transcript aligned to scenes → emit a single `reel_spec.json` (hook_ms, cuts/sec, caption style, b-roll ratio, CTA placement). That spec then drives script + assembly.

---

## Recommended reference pipeline (sample reel → finished 9:16)

**Philosophy:** open source for orchestration, analysis, assembly, captions, export (deterministic, free at volume); paid APIs only at the two quality cliffs — **voice** and **face**.

```
sample_reel.mp4
  │ 1. ANALYZE      PySceneDetect + whisperX + pyannote + VLM keyframe tags
  │                 (or Higgsfield video_analysis first-pass) → reel_spec.json
  │ 2. SCRIPT       Claude: reel_spec + brand brief → beat sheet
  │                 {hook, beats[], broll_queries[], caption_emphasis, cta}
  │ 3. VOICE        Chatterbox (MIT, self-host) — clone from 30s reference
  │                 ▲ paid upgrade: ElevenLabs Pro Voice Clone (still wins on
  │                   emotional stability & long-read consistency)
  │ 4. FACE         One consented 2–3 min base video of the creator, shot once.
  │                 Per video: LatentSync 1.6 lip-syncs base footage to the new
  │                 TTS track (MuseTalk 1.5 if throughput > fidelity;
  │                 Duix-Avatar if you want the packaged offline clone).
  │                 ▲ paid upgrade: HeyGen Avatar IV (~$4/min 1080p API) —
  │                   still clearly better gestures/hands/authenticity for
  │                   client-facing UGC ads
  │ 5. B-ROLL       per-beat queries → Pexels+Pixabay APIs → open_clip re-rank
  │                 vs beat text → 2–4s cutaways (OpenMontage retrieval pattern)
  │                 ▲ paid/gen fill: Higgsfield / Kling / Veo for impossible shots
  │ 6. ASSEMBLE     Remotion 1080x1920 comp: talking-head base layer, B-roll
  │                 cutaways on beat grid, karaoke captions from whisperX JSON
  │                 (@remotion/captions, brand fonts/colors), music bed with
  │                 sidechain duck; auto-editor pre-pass if using real takes
  │ 7. EXPORT       Remotion render → ffmpeg: H.264 high, yuv420p, CRF 18,
  │                 30fps, AAC 192k, loudnorm to -14 LUFS, +faststart;
  │                 emit .srt sidecar + cover frame
  └─► out/{slug}_9x16.mp4
```

**Where paid beats open source (July 2026, be honest with clients):**
- **ElevenLabs** > any OS TTS for emotional range, retake-free long reads, and voice stability across 50 videos. Chatterbox is ~90% there and $0; the last 10% matters for ad accounts.
- **HeyGen Avatar IV** > LatentSync/MuseTalk/Duix for full-body gesture, hands, and "doesn't look AI at 2 seconds" — the bar for paid UGC placements. ~$1/min standard, ~$4/min Avatar IV via API (no free API credits since Feb 2026).
- **Higgsfield** — not a talking-head engine historically, but its 2026 platform (already connected to this workspace via MCP) covers cinematic gen B-roll, Speak-style avatar clips, voice cloning, Shorts Studio, and uniquely **video analysis + virality prediction**; cheapest way to prototype steps 1 and 5 before self-hosting.
- Everything else — analysis, scripting, B-roll retrieval, captions, assembly, export — open source is now equal or better, and at 30+ videos/month dramatically cheaper.

**Licensing watchlist for a commercial engine:** Remotion company license ($ once >3 people), OpenMontage AGPL (don't resell it hosted), Wav2Lip & F5-TTS/Fish weights (non-commercial — exclude from prod), MuseTalk & IndexTTS-2 weight licenses (read before shipping ads), Pexels/Pixabay ToS (fine for commercial use, no redistribution of raw clips).
