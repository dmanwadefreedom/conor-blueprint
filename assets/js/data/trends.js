/* Content Engine — data/trends.js
 * Trend intelligence dataset powering Discover, Dashboard, Create and Coach.
 * Exposes window.CE.trends per SPEC.md. Pure data + tiny read-only accessors.
 * Loaded after store.js, before views.
 */
(function () {
  'use strict';

  var CE = (window.CE = window.CE || {});

  /* ── per-platform trend library (mid-2026 snapshot) ─────────────────
   * Each trend: {id, name, type, desc, whyItWorks, howToUse, examplePrompt,
   *              momentum, tags[], formats[]}
   * type ∈ format|visual|audio|topic|hook, momentum ∈ rising|peaking|steady
   * formats drawn from CE.const.FORMATS.
   */
  var byPlatform = {

    /* ════════ INSTAGRAM ════════ */
    instagram: [
      {
        id: 'ig-photo-dump',
        name: 'Curated photo-dump carousels',
        type: 'format',
        desc: 'Loose, lightly edited 8–15 slide carousels that feel like a camera-roll dump but are secretly sequenced to tell one story.',
        whyItWorks: 'Anti-polish reads as honesty, and every swipe counts as engagement, so dumps routinely out-reach single images by 2–3x.',
        howToUse: 'Pick one theme per dump (a launch week, a client shoot, a routine), lead with the strongest candid, and bury one soft CTA slide around position 7.',
        examplePrompt: 'Plan a 10-slide Instagram photo-dump carousel recapping our last 30 days behind the scenes. For each slide, give the photo direction, a 1-line caption fragment, and put a soft "DM us WORD" CTA on slide 8. Keep the vibe candid, not corporate.',
        momentum: 'peaking',
        tags: ['authenticity', 'bts', 'storytelling'],
        formats: ['carousel', 'image']
      },
      {
        id: 'ig-carousel-mini-guide',
        name: 'Carousel mini-guides',
        type: 'format',
        desc: 'Save-optimized 6–10 slide educational carousels that compress one useful playbook into big-type, one-idea-per-slide pages.',
        whyItWorks: 'Saves and shares are the signals Instagram weights hardest in 2026, and reference-style content is the most saved format on the platform.',
        howToUse: 'Slide 1 is a bold promise ("Steal our 5-step brief"), slides 2–8 deliver one step each with a concrete example, and the last slide asks for the save explicitly.',
        examplePrompt: 'Write an 8-slide Instagram carousel mini-guide titled "The 15-minute content audit". Give each slide a headline under 8 words plus 1–2 supporting lines, end with a save CTA, and suggest 5 keyword-rich caption hashtags.',
        momentum: 'steady',
        tags: ['educational', 'saveable', 'authority'],
        formats: ['carousel']
      },
      {
        id: 'ig-keyword-caption-seo',
        name: 'Search-first captions (IG SEO)',
        type: 'topic',
        desc: 'Captions and on-screen text written around the exact phrases people type into Instagram and Google search, since IG posts now surface in both.',
        whyItWorks: 'Instagram indexes captions for search and Google crawls public posts, so keyworded content keeps earning views months after the algorithm moves on.',
        howToUse: 'Open the caption with the search phrase in plain language ("how to plan a week of content in 1 hour"), then write natively; repeat the phrase once in on-screen text.',
        examplePrompt: 'Rewrite this Instagram caption to rank for the search phrase "[topic] for beginners": keep it under 150 words, put the phrase in the first sentence and in one on-screen text suggestion, and keep the voice conversational.',
        momentum: 'rising',
        tags: ['seo', 'discoverability', 'educational'],
        formats: ['image', 'carousel', 'short-video']
      },
      {
        id: 'ig-comment-keyword-dm',
        name: '"Comment WORD" DM funnels',
        type: 'hook',
        desc: 'Reels and carousels that end with "comment GUIDE and I\'ll DM it to you", using automation to deliver a lead magnet in the DMs.',
        whyItWorks: 'Comments spike distribution while the DM turns a passive viewer into a warm, addressable lead — one post does reach and capture at once.',
        howToUse: 'Offer something genuinely worth a comment (template, checklist, swipe file), use a single memorable keyword, and confirm the offer in the pinned comment.',
        examplePrompt: 'Script a 30-second Instagram Reel that teaches one quick win from our niche and ends with a "comment SYSTEM to get the full checklist" CTA. Include the hook line, 3 beat-by-beat talking points, and the pinned-comment copy.',
        momentum: 'peaking',
        tags: ['leadgen', 'community', 'conversion'],
        formats: ['short-video', 'carousel']
      },
      {
        id: 'ig-lofi-founder-reels',
        name: 'Lo-fi founder talking heads',
        type: 'visual',
        desc: 'Front-camera, no-edit Reels of the founder or lead creator talking straight into the phone — walking, in the car, or mid-task.',
        whyItWorks: 'Polished brand video now pattern-matches to ads and gets skipped; a shaky selfie take pattern-matches to a friend and earns the first 3 seconds.',
        howToUse: 'Film in one take under 45 seconds, open with the point (not "hey guys"), and add auto-captions since most viewers watch muted.',
        examplePrompt: 'Give me 5 one-take lo-fi Reel scripts (max 45 seconds each) where our founder shares a strong opinion about [industry]. Each needs a first-line hook that states the take outright and a closing line that invites disagreement in the comments.',
        momentum: 'steady',
        tags: ['authenticity', 'personalbrand', 'lofi'],
        formats: ['short-video', 'story']
      },
      {
        id: 'ig-day-in-life-twist',
        name: '"Day in the life" with a twist',
        type: 'format',
        desc: 'Classic DITL Reels reframed around a tension or surprise — "day in the life of a founder who works 4 hours", "DITL but everything goes wrong".',
        whyItWorks: 'The vlog structure is familiar enough to feel safe, but the twist creates a curiosity gap that carries viewers to the end.',
        howToUse: 'Write the twist first, then shoot only the 6–8 clips that prove it; keep each clip under 2 seconds and narrate over the top.',
        examplePrompt: 'Outline a "day in the life" Instagram Reel for our client with the twist "[unexpected angle]". List 7 b-roll shots in order, the voiceover line for each, and an on-screen hook for the first frame.',
        momentum: 'steady',
        tags: ['storytelling', 'bts', 'relatable'],
        formats: ['short-video']
      },
      {
        id: 'ig-before-after-process',
        name: 'Before/after with the messy middle',
        type: 'visual',
        desc: 'Transformation posts that show the before, the after, AND 2–3 honest steps in between instead of jump-cutting straight to the result.',
        whyItWorks: 'Pure before/afters trigger skepticism in 2026; showing the messy middle makes the result believable and positions you as the guide.',
        howToUse: 'Structure as before → obstacle → decision → after; caption should name the one step people always skip.',
        examplePrompt: 'Turn this client result into a 6-slide before/after Instagram carousel that includes the messy middle: slide-by-slide visuals, captions, and a final slide that names the step most people skip. Result: [describe outcome].',
        momentum: 'rising',
        tags: ['proof', 'storytelling', 'trust'],
        formats: ['carousel', 'short-video']
      },
      {
        id: 'ig-collab-posts',
        name: 'Collab posts with adjacent accounts',
        type: 'format',
        desc: 'Co-authored posts and Reels published to two audiences at once via Instagram\'s Collab feature, usually with a complementary (non-competing) brand or creator.',
        whyItWorks: 'You borrow a warm audience with built-in social proof — collab posts average roughly double the reach of solo posts for the smaller account.',
        howToUse: 'Pitch partners whose audience shares your customer but not your offer, agree on one shared takeaway, and split the CTA (their freebie, your follow).',
        examplePrompt: 'Brainstorm 6 Instagram Collab post concepts pairing our client ([niche]) with adjacent accounts. For each: the partner type, the shared hook, the format (Reel or carousel), and what each side promotes.',
        momentum: 'rising',
        tags: ['community', 'reach', 'partnership'],
        formats: ['short-video', 'carousel', 'image']
      },
      {
        id: 'ig-broadcast-channel-drops',
        name: 'Broadcast channel exclusives',
        type: 'topic',
        desc: 'Using an Instagram broadcast channel as a low-effort "inner circle" — voice notes, early drops, and raw takes that never hit the feed.',
        whyItWorks: 'Push notifications beat feed reach every time, and exclusivity gives followers a reason to opt in before you need to sell anything.',
        howToUse: 'Promote the channel in Reels ("full breakdown in my channel"), post 2–3x/week max, and keep at least one recurring segment so members know what to expect.',
        examplePrompt: 'Design a weekly Instagram broadcast-channel content rhythm for our client: 3 recurring segment ideas, example messages for each, and 2 feed-post hooks that drive channel joins.',
        momentum: 'rising',
        tags: ['community', 'retention', 'exclusive'],
        formats: ['story', 'text-post', 'image']
      },
      {
        id: 'ig-trial-reels-testing',
        name: 'Trial Reels for hook testing',
        type: 'format',
        desc: 'Publishing Reels to non-followers first via Trial Reels, then promoting only the versions whose retention proves the hook works.',
        whyItWorks: 'You get clean data from strangers (no follower bias), so the content that hits your main grid is already validated.',
        howToUse: 'Ship 3 hook variations of the same core video as trials, compare 3-second retention after 24 hours, then post the winner publicly.',
        examplePrompt: 'Take this Reel concept and write 4 alternative opening hooks (first 3 seconds: spoken line + on-screen text) to A/B test as Instagram Trial Reels. Concept: [describe video].',
        momentum: 'rising',
        tags: ['testing', 'data', 'hooks'],
        formats: ['short-video']
      }
    ],

    /* ════════ TIKTOK ════════ */
    tiktok: [
      {
        id: 'tt-faceless-broll-vo',
        name: 'Faceless voiceover b-roll',
        type: 'format',
        desc: 'Calm, confident voiceover laid over aesthetic b-roll (workspace, hands, city, process shots) — no face on camera at any point.',
        whyItWorks: 'It scales past camera-shyness and one voiceover can be re-cut over endless b-roll, so accounts ship daily without burning out a founder.',
        howToUse: 'Write the voiceover like a spoken essay with a hard 1-line hook, shoot a reusable b-roll bank in one afternoon, and match cut pace to the narration beats.',
        examplePrompt: 'Write a 60-second faceless TikTok voiceover script about [topic] with a hook in the first line, a 3-point body, and a reflective closer. Then list 8 b-roll shots from a typical office/home that could cover it.',
        momentum: 'peaking',
        tags: ['faceless', 'storytelling', 'scalable'],
        formats: ['short-video']
      },
      {
        id: 'tt-pov-micro-vlog',
        name: 'POV micro-vlogs',
        type: 'format',
        desc: '20–40 second first-person vlogs framed as "POV: you\'re a [role] and [situation]", shot from the subject\'s eye line.',
        whyItWorks: 'POV framing drops the viewer inside the story instead of watching it, which drives comments from everyone who has lived that exact moment.',
        howToUse: 'Pick a hyper-specific situation your audience knows too well, show it in 5–7 quick shots, and let the on-screen text carry the narrative.',
        examplePrompt: 'Generate 8 "POV:" micro-vlog concepts for a [niche] brand on TikTok. Each needs the POV caption, 5 quick shots, and one on-screen punchline that makes the target audience say "this is literally me".',
        momentum: 'peaking',
        tags: ['relatable', 'storytelling', 'pov'],
        formats: ['short-video']
      },
      {
        id: 'tt-photo-mode-carousels',
        name: 'TikTok photo-mode slideshows',
        type: 'format',
        desc: 'Swipeable image carousels with trending audio underneath — memes, mini-guides, and receipts threads in slideshow form.',
        whyItWorks: 'Photo posts are cheaper to make than video, dwell time per slide counts as watch time, and TikTok is actively boosting the format to compete with carousels elsewhere.',
        howToUse: 'Treat slide 1 like a video hook (big text, bold claim), keep to 6–10 slides, and pick an audio that\'s trending in the last 7 days.',
        examplePrompt: 'Create a 7-slide TikTok photo-mode post titled "[bold claim about niche]". Write the text overlay for each slide (max 15 words), a caption with 3 hashtags, and describe the visual style for the background images.',
        momentum: 'peaking',
        tags: ['carousel', 'educational', 'lowlift'],
        formats: ['carousel', 'image']
      },
      {
        id: 'tt-storytime-receipts',
        name: 'Storytime with receipts',
        type: 'hook',
        desc: 'A dramatic first-person story ("the client fired us, then called back 6 months later") told to camera with screenshots, invoices, or DMs shown as proof.',
        whyItWorks: 'Story drives retention and receipts kill the "sure buddy" reflex — the proof cut is where rewatches and shares happen.',
        howToUse: 'Open at the climax, rewind to the start, and time the receipt reveal for the final third; blur anything sensitive.',
        examplePrompt: 'Turn this real business story into a 60-second TikTok storytime script with a cold-open at the climax, a rewind structure, and a marked moment to flash the receipt/screenshot. Story: [paste story].',
        momentum: 'steady',
        tags: ['storytelling', 'proof', 'drama'],
        formats: ['short-video']
      },
      {
        id: 'tt-reply-to-comment',
        name: 'Comment-reply video chains',
        type: 'format',
        desc: 'Filming every follow-up video as a video reply to a real comment, turning one hit into a self-feeding series.',
        whyItWorks: 'The pinned comment gives instant context and social proof, and answering real people trains the audience to comment more — fuel for the next video.',
        howToUse: 'End videos with an open question, sort replies for the spiciest or most-asked one, and open the reply video by reading it aloud.',
        examplePrompt: 'Here are 5 real comments on our last TikTok: [paste comments]. Pick the 2 best to answer with video replies and script a 30-second response for each, opening by reading the comment out loud.',
        momentum: 'steady',
        tags: ['community', 'series', 'engagement'],
        formats: ['short-video']
      },
      {
        id: 'tt-7s-loop',
        name: '7-second seamless loops',
        type: 'format',
        desc: 'Ultra-short clips engineered so the last frame flows into the first, quietly racking 3–5 rewatches before the viewer notices.',
        whyItWorks: 'Completion rate is TikTok\'s heaviest signal and a good loop posts 200–400% completion, which the algorithm reads as exceptional.',
        howToUse: 'Use one satisfying action or one-line setup whose answer is the first frame; write on-screen text that takes two viewings to fully read.',
        examplePrompt: 'Design 5 seven-second looping TikTok concepts for [brand]: describe the action, the on-screen text (slightly too long to read once), and exactly how the last frame hands off to the first.',
        momentum: 'peaking',
        tags: ['loops', 'retention', 'lowlift'],
        formats: ['short-video']
      },
      {
        id: 'tt-asmr-process',
        name: 'ASMR process videos',
        type: 'audio',
        desc: 'Close-mic, no-talking footage of the actual work — packing orders, sketching, keyboard sounds, espresso pulls — cut to the natural audio.',
        whyItWorks: 'Sensory audio is a scroll-stopper in a feed full of people talking at you, and process footage doubles as effortless product proof.',
        howToUse: 'Record real audio (never stock), keep cuts long enough to be satisfying, and put a single quiet text line on screen naming what\'s being made.',
        examplePrompt: 'List 10 ASMR-friendly process moments in a [type of business] we could film close-up for TikTok, with the sound to capture in each and one subtle on-screen text line per video.',
        momentum: 'rising',
        tags: ['asmr', 'bts', 'sensory'],
        formats: ['short-video']
      },
      {
        id: 'tt-grwm-story',
        name: 'GRWM while telling a story',
        type: 'format',
        desc: '"Get ready with me" (or make coffee / set up the desk) as visual wallpaper while narrating one focused story or lesson.',
        whyItWorks: 'The routine gives hands and eyes something to follow, which relaxes viewers into listening to a story they\'d skip as a talking head.',
        howToUse: 'Match the story arc to the routine (payoff lands as the routine finishes) and tease the ending up front: "so the launch flopped — let me explain while I set up".',
        examplePrompt: 'Write a 60-second "get ready with me"-style TikTok script where our founder preps their workspace while telling the story of [lesson/failure/win]. Sync 3 story beats to 3 physical actions and land the payoff on the final action.',
        momentum: 'peaking',
        tags: ['storytelling', 'relatable', 'routine'],
        formats: ['short-video']
      },
      {
        id: 'tt-search-answer-videos',
        name: 'TikTok-SEO answer videos',
        type: 'topic',
        desc: 'Videos built to answer one specific search query, saying the query out loud and pinning it in the caption, title and text overlay.',
        whyItWorks: 'A large share of under-35s search TikTok before Google now, and search traffic compounds for months instead of dying in 48 hours.',
        howToUse: 'Mine autocomplete for "how/why/best [your niche]" queries, answer in the first 5 seconds, then expand — one query per video, never bundled.',
        examplePrompt: 'Give me 10 TikTok search queries people in [niche] actually type, then script a 30-second answer video for the best one: spoken hook that repeats the query, 3-step answer, and an SEO caption under 100 characters.',
        momentum: 'rising',
        tags: ['seo', 'educational', 'evergreen'],
        formats: ['short-video']
      },
      {
        id: 'tt-ai-disclosure-authentic',
        name: 'Human-made as the hook',
        type: 'hook',
        desc: 'Openly contrasting your real, imperfect footage against the AI-slop wave — "no AI, just me and a tripod" as an explicit positioning line.',
        whyItWorks: 'As generated video floods feeds in 2026, verified human mess has become a differentiator that audiences reward with trust and comments.',
        howToUse: 'Don\'t rant about AI; just show unfakeable moments (hands, mistakes, live reactions) and drop one light line acknowledging it\'s all real.',
        examplePrompt: 'Script 3 TikToks for [brand] that showcase unfakeably human moments of our work (mistakes, live reactions, hands-on process), each with a light one-line nod to being 100% real footage — confident, not preachy.',
        momentum: 'rising',
        tags: ['authenticity', 'ai', 'trust'],
        formats: ['short-video', 'live']
      },
      {
        id: 'tt-live-shopping-demos',
        name: 'Casual live demo sessions',
        type: 'format',
        desc: 'Low-production TikTok LIVEs where you demo the product or work in public, answer chat in real time, and clip the best moments for the feed.',
        whyItWorks: 'LIVE gets its own discovery surface and notification push, and one hour of live yields 5–10 clippable shorts — the feed content pays for the stream.',
        howToUse: 'Schedule a recurring weekly slot, run a loose agenda (one demo + open Q&A), and mark timestamps live so clipping takes minutes, not hours.',
        examplePrompt: 'Plan a 45-minute weekly TikTok LIVE for [brand]: a repeatable 4-part run of show, 5 chat prompts to keep comments moving, and 3 moments to engineer specifically so they clip well as standalone shorts.',
        momentum: 'rising',
        tags: ['live', 'community', 'repurposing'],
        formats: ['live', 'short-video']
      }
    ],

    /* ════════ YOUTUBE ════════ */
    youtube: [
      {
        id: 'yt-chaptered-breakdown',
        name: 'High-retention chaptered breakdowns',
        type: 'format',
        desc: '10–20 minute deep dives structured as tightly labeled chapters, each opening with its own mini-hook so viewers can\'t find a clean exit point.',
        whyItWorks: 'Chapters raise perceived value and searchability while per-chapter hooks flatten the retention curve — the metric that decides whether YouTube pushes the video.',
        howToUse: 'Outline chapters before scripting, give each a payoff-promising title ("The pricing mistake that cost us $40k"), and cold-open with the single best moment from mid-video.',
        examplePrompt: 'Outline a 15-minute YouTube breakdown of [topic] with 6 chapters: for each, write a curiosity-driven chapter title, a 1-line opening hook, and the key point. Include a 20-second cold open pulled from the most dramatic chapter.',
        momentum: 'steady',
        tags: ['retention', 'educational', 'longform'],
        formats: ['long-video']
      },
      {
        id: 'yt-shorts-loop',
        name: 'Looping Shorts with delayed payoff',
        type: 'format',
        desc: 'Sub-35-second Shorts where the payoff lands in the last second and cuts straight back to the hook, engineering the rewatch.',
        whyItWorks: 'Shorts ranking is dominated by average % viewed; a loop that earns even 1.5 viewings per person doubles that number instantly.',
        howToUse: 'Script backwards from the payoff, trim every breath, and never end with an outro — the last frame should be mid-energy so the loop feels seamless.',
        examplePrompt: 'Write 5 YouTube Shorts scripts (max 30 seconds each) about [topic], each structured hook → escalation → last-second payoff that loops cleanly back to the opening line. Mark the exact loop point in each.',
        momentum: 'peaking',
        tags: ['loops', 'retention', 'shorts'],
        formats: ['short-video']
      },
      {
        id: 'yt-30-day-experiment',
        name: '"I did X for 30 days" experiments',
        type: 'topic',
        desc: 'Documented challenge videos with a clear rule set, visible checkpoints, and honest numbers at the end — win or fail.',
        whyItWorks: 'The built-in narrative arc (commitment → struggle → verdict) holds retention, and a failed experiment often outperforms a win because it\'s more believable.',
        howToUse: 'Choose an experiment your buyers wish they could run themselves, log short clips during the 30 days as you go, and lead the title with the result number.',
        examplePrompt: 'Design a 30-day experiment our client could run and film for YouTube around [goal]. Define the rules, 4 weekly checkpoint beats, what to measure, and 3 title/thumbnail combos that lead with the outcome.',
        momentum: 'rising',
        tags: ['experiment', 'storytelling', 'proof'],
        formats: ['long-video', 'short-video']
      },
      {
        id: 'yt-faceless-docu',
        name: 'Faceless mini-documentaries',
        type: 'format',
        desc: 'Researched, narrated video essays on niche industry stories — the rise/fall/weird-history genre — built from stock, screenshots and motion graphics.',
        whyItWorks: 'Documentary framing borrows Netflix-level trust, and business-story content attracts exactly the analytical audience B2B brands want.',
        howToUse: 'Pick stories adjacent to your niche with real stakes, script narration like a podcast with cliffhanger act breaks, and cite sources on screen for credibility.',
        examplePrompt: 'Pitch 5 faceless mini-documentary topics adjacent to [industry] with real narrative stakes. For the strongest one, write a 3-act outline, the first 30 seconds of narration, and the on-screen source list style.',
        momentum: 'rising',
        tags: ['faceless', 'storytelling', 'authority'],
        formats: ['long-video']
      },
      {
        id: 'yt-screen-share-tutorial',
        name: 'Over-the-shoulder screen tutorials',
        type: 'format',
        desc: 'Real-time screen recordings solving one specific problem end-to-end, with the messy parts (errors, retries) left in.',
        whyItWorks: 'Search intent on "how to" queries is evergreen, and watching someone hit and fix real errors builds more trust than a flawless demo.',
        howToUse: 'Title with the exact search phrase, show the finished result in the first 20 seconds, then rebuild it from zero; timestamp every step in the description.',
        examplePrompt: 'Script a screen-share YouTube tutorial: "[exact how-to query]". Give me the 20-second result-first cold open, 7 timestamped steps, one deliberate mistake-and-fix moment to keep in, and a description optimized for search.',
        momentum: 'steady',
        tags: ['educational', 'seo', 'evergreen'],
        formats: ['long-video']
      },
      {
        id: 'yt-podcast-clip-engine',
        name: 'Podcast-to-Shorts clip engines',
        type: 'format',
        desc: 'Recording one long conversation per week, then mining it for 8–12 vertical Shorts with punch-in framing and bold captions.',
        whyItWorks: 'One recording session feeds two surfaces: long-form watch time from the full episode and daily Shorts reach that funnels subscribers back to it.',
        howToUse: 'Seed the conversation with 5 pre-planned "clippable" questions, cut clips to a single complete thought (20–45s), and always caption the first line as the hook.',
        examplePrompt: 'Here is a podcast transcript excerpt: [paste]. Find the 5 most clippable moments for YouTube Shorts; for each give the in/out lines, a caption hook for frame one, and a title under 50 characters.',
        momentum: 'peaking',
        tags: ['repurposing', 'podcast', 'scalable'],
        formats: ['short-video', 'long-video']
      },
      {
        id: 'yt-thumbnail-ab-titles',
        name: 'Thumbnail/title A-B iteration',
        type: 'visual',
        desc: 'Treating packaging as its own content discipline: 3 thumbnail/title variants per video, rotated via YouTube\'s built-in Test & Compare.',
        whyItWorks: 'Click-through rate gates everything else — a 2%→4% CTR jump can double a video\'s lifetime views with zero editing changes.',
        howToUse: 'Design the thumbnail before you film (if you can\'t package it, don\'t make it), test 3 variants for 2 weeks, and re-package old videos whose retention beat their CTR.',
        examplePrompt: 'For a video about [topic], write 3 title + thumbnail concept pairs to A/B test on YouTube: each with a different emotional angle (curiosity, fear of loss, aspiration). Describe thumbnail composition in one sentence each, max 4 words of thumbnail text.',
        momentum: 'steady',
        tags: ['testing', 'packaging', 'data'],
        formats: ['long-video', 'short-video']
      },
      {
        id: 'yt-community-polls',
        name: 'Community-tab idea polls',
        type: 'topic',
        desc: 'Using the Community tab to poll subscribers on the next video\'s topic, thumbnail, or take — then shipping what won and crediting the vote.',
        whyItWorks: 'Polls get shown to subscribers who never see uploads, and voters return to watch "their" video, lifting first-24-hour velocity.',
        howToUse: 'Post the poll 3–5 days before filming, keep options genuinely different, and open the video by announcing the result.',
        examplePrompt: 'Write 4 YouTube Community poll posts for [channel niche]: one next-topic vote, one thumbnail face-off, one hot-take agree/disagree, one fill-in-the-blank. Include the exact poll options for each.',
        momentum: 'rising',
        tags: ['community', 'engagement', 'lowlift'],
        formats: ['text-post', 'image']
      },
      {
        id: 'yt-live-cowork',
        name: 'Live working sessions',
        type: 'format',
        desc: 'Streaming real work — audits, builds, planning sessions — with chat shaping decisions in real time, then clipping highlights.',
        whyItWorks: 'Watch-time hours from live are enormous relative to effort, and watching decisions get made live is the deepest trust-builder on the platform.',
        howToUse: 'Pick tasks with visible progress, narrate your reasoning constantly, and schedule the same slot weekly so regulars form a habit.',
        examplePrompt: 'Plan a recurring 60-minute "work with me" YouTube live for [brand]: the task type to work on, a 4-segment run of show, 5 recurring chat rituals, and which 2 moments per stream to clip into Shorts.',
        momentum: 'rising',
        tags: ['live', 'bts', 'community'],
        formats: ['live', 'long-video']
      },
      {
        id: 'yt-corner-docs-series',
        name: 'Build-in-public series arcs',
        type: 'topic',
        desc: 'A numbered episodic series documenting one real project ("Building our agency to $1M — Ep. 7") with real numbers each episode.',
        whyItWorks: 'Series create appointment viewing and binge sessions — viewers who find episode 7 go back to episode 1, multiplying watch time per subscriber.',
        howToUse: 'Commit to a cadence, open each episode with a 30-second "story so far", and end on the next episode\'s open question.',
        examplePrompt: 'Structure a build-in-public YouTube series for [project/goal]: series title, the metric we report each episode, a repeatable episode skeleton (recap → this week → numbers → cliffhanger), and hooks for the first 3 episodes.',
        momentum: 'rising',
        tags: ['buildinpublic', 'series', 'proof'],
        formats: ['long-video']
      }
    ],

    /* ════════ LINKEDIN ════════ */
    linkedin: [
      {
        id: 'li-contrarian-proof',
        name: 'Contrarian POV + proof posts',
        type: 'hook',
        desc: 'A post that opens by disagreeing with accepted industry wisdom, then immediately backs the take with a specific number, story, or screenshot.',
        whyItWorks: 'Disagreement stops the scroll and proof converts the stopped scroller — the combination drives both comments (debate) and follows (authority).',
        howToUse: 'Only take contrarian positions you can actually evidence; structure as claim → proof → nuance → question, and never rage-bait your own buyers.',
        examplePrompt: 'Write a LinkedIn post that pushes back on the common advice "[common industry advice]" using this evidence from our client: [proof point]. Structure: 1-line contrarian hook, the proof, the nuance, and a closing question that invites debate.',
        momentum: 'steady',
        tags: ['contrarian', 'proof', 'authority'],
        formats: ['text-post']
      },
      {
        id: 'li-founder-build-public',
        name: 'Founder build-in-public updates',
        type: 'topic',
        desc: 'Regular first-person posts sharing real revenue, hiring, pipeline or product numbers — including the ugly weeks.',
        whyItWorks: 'Real numbers are rare enough on LinkedIn to be magnetic, and consistency turns a founder profile into a serialized story people follow like a show.',
        howToUse: 'Pick 2–3 metrics you\'re comfortable sharing forever, post on a fixed cadence, and always pair the number with the decision behind it.',
        examplePrompt: 'Draft a monthly build-in-public LinkedIn update for our founder using these numbers: [metrics]. Lead with the most surprising number, explain the decision behind it in 3 short paragraphs, and end with what we\'re testing next month.',
        momentum: 'peaking',
        tags: ['buildinpublic', 'transparency', 'personalbrand'],
        formats: ['text-post', 'image']
      },
      {
        id: 'li-document-mini-guide',
        name: 'Document (PDF carousel) mini-guides',
        type: 'format',
        desc: 'Native PDF carousels — 8–12 clean slides walking through one framework, checklist or teardown, designed for desktop swipe.',
        whyItWorks: 'Dwell time per document post is among the highest of any LinkedIn format, and slides get screenshotted into Slack channels — distribution you can\'t buy.',
        howToUse: 'One idea per slide in big type, brand lightly (logo corner, not a template scream), and put your framework\'s name on slide 1 so people cite it.',
        examplePrompt: 'Create a 10-slide LinkedIn document post: "The [Name] Framework for [outcome]". Write slide-by-slide headlines and supporting lines, a cover slide with a named framework, and a 3-line intro caption that promises the payoff.',
        momentum: 'peaking',
        tags: ['educational', 'saveable', 'framework'],
        formats: ['carousel', 'article']
      },
      {
        id: 'li-story-arc-text',
        name: 'Text-only story arc posts',
        type: 'format',
        desc: 'Pure text posts told as a tight 150–250 word narrative — setup, tension, turn, lesson — with heavy line breaks and no link.',
        whyItWorks: 'The "see more" fold rewards narrative hooks, and text-only posts still get preferential reach over anything with an external link.',
        howToUse: 'Spend half your time on line one, break every 1–2 sentences for mobile rhythm, and make the lesson land in the last line, not a hashtag pile.',
        examplePrompt: 'Turn this anecdote into a 200-word LinkedIn story post: [paste anecdote]. First line must create tension in under 12 words, use 1–2 sentence paragraphs, and end with the lesson as a single standalone line. No hashtags, no link.',
        momentum: 'steady',
        tags: ['storytelling', 'writing', 'organic'],
        formats: ['text-post']
      },
      {
        id: 'li-teardown-posts',
        name: 'Public teardown posts',
        type: 'topic',
        desc: 'Analyzing a well-known brand\'s landing page, ad, pricing or funnel in public — annotated screenshot plus what you\'d change and why.',
        whyItWorks: 'You demonstrate the exact skill clients pay for, on a name everyone recognizes, without giving away client-confidential work.',
        howToUse: 'Punch up (big brands only), be specific about the fix not just the flaw, and end with the transferable principle readers can apply today.',
        examplePrompt: 'Write a LinkedIn teardown of [well-known brand]\'s [asset: homepage/ad/pricing page]: 3 things they do brilliantly, 2 specific changes we\'d test with reasoning, and one transferable principle for readers. Note what to annotate in the screenshot.',
        momentum: 'rising',
        tags: ['authority', 'educational', 'proof'],
        formats: ['image', 'text-post', 'carousel']
      },
      {
        id: 'li-i-was-wrong',
        name: '"I was wrong about X" posts',
        type: 'hook',
        desc: 'A public update of a belief you held professionally — what you used to preach, what changed your mind, and what you do now instead.',
        whyItWorks: 'Admitting error is the highest-credibility move on a platform drowning in certainty, and the before/after belief structure is inherently narrative.',
        howToUse: 'Pick beliefs you genuinely changed (audiences smell fake humility), name the specific evidence that flipped you, and give the replacement practice.',
        examplePrompt: 'Write an "I was wrong about [belief]" LinkedIn post for our founder: what we used to advise clients, the moment/data that changed our mind, and the new approach — ending with a question asking readers what they\'ve changed their mind on.',
        momentum: 'rising',
        tags: ['vulnerability', 'trust', 'storytelling'],
        formats: ['text-post']
      },
      {
        id: 'li-case-study-numbers',
        name: 'Numbers-first case study posts',
        type: 'topic',
        desc: 'Client results told backwards: the outcome number in line one, then the 3–5 decisions that produced it, then the honest caveats.',
        whyItWorks: 'Specific numbers ("31 qualified calls in 60 days") outperform adjectives every time, and caveats paradoxically increase belief in the headline claim.',
        howToUse: 'Get written client permission, anonymize if needed ("a B2B services client"), and always include one thing that didn\'t work.',
        examplePrompt: 'Turn this client result into a numbers-first LinkedIn case study post: [result + context]. Open with the number, list the 4 decisions that drove it as short bolded lines, include one honest thing that failed, and close with a soft CTA to comment for details.',
        momentum: 'steady',
        tags: ['proof', 'leadgen', 'casestudy'],
        formats: ['text-post', 'carousel']
      },
      {
        id: 'li-selfie-video-takes',
        name: 'Vertical selfie-video takes',
        type: 'format',
        desc: 'Sub-90-second front-camera videos giving one sharp opinion or lesson, captioned, shot wherever you happen to be.',
        whyItWorks: 'LinkedIn\'s video feed is still under-supplied relative to its distribution, so competent talking-head video gets outsized reach versus the same idea as text.',
        howToUse: 'One idea per video, burned-in captions always, and open with the take itself — LinkedIn viewers give you about 2 seconds, not 5.',
        examplePrompt: 'Script 5 vertical LinkedIn videos (60–90s each) for our founder on [theme]. Each: an opening line that states the take in under 10 words, 3 supporting beats, and a closing line that invites a specific comment.',
        momentum: 'peaking',
        tags: ['video', 'personalbrand', 'reach'],
        formats: ['short-video']
      },
      {
        id: 'li-comment-strategy',
        name: 'Strategic commenting as content',
        type: 'topic',
        desc: 'Treating 15 minutes of thoughtful comments on larger accounts\' posts as a daily publishing channel of its own.',
        whyItWorks: 'A sharp comment on a 500k-follower post can pull more profile visits than your own post, and it warms up exactly the audience you want before you ever pitch.',
        howToUse: 'Build a list of 10–15 accounts your buyers follow, comment with an added insight (not "great post!"), and do it within the first hour of their posting.',
        examplePrompt: 'Our client serves [audience]. List 12 types of LinkedIn accounts to comment on daily, then write 5 example comments on the theme of [topic] that add a specific insight or mini-story rather than agreement.',
        momentum: 'rising',
        tags: ['engagement', 'leadgen', 'community'],
        formats: ['text-post']
      },
      {
        id: 'li-polls-with-teeth',
        name: 'Polls with a strong opinion attached',
        type: 'format',
        desc: 'Polls where the caption argues one side hard before asking the vote, and where the follow-up post analyzes the results.',
        whyItWorks: 'Cheap-question polls died; opinionated polls generate debate in comments while the results give you a data point for a second post — two assets from one.',
        howToUse: 'Ask questions your buyers argue about internally, make one option deliberately spicy, and always publish the "here\'s what 400 of you said" follow-up.',
        examplePrompt: 'Create a LinkedIn poll about [industry debate]: 4 options where one is deliberately provocative, a caption arguing our position in 4 short lines, and an outline for the follow-up post analyzing the results.',
        momentum: 'rising',
        tags: ['engagement', 'data', 'debate'],
        formats: ['text-post']
      },
      {
        id: 'li-newsletter-anchor',
        name: 'LinkedIn newsletter as anchor asset',
        type: 'format',
        desc: 'A biweekly LinkedIn-native newsletter that goes deep on one topic, with daily posts acting as trailers that feed subscriptions.',
        whyItWorks: 'Newsletter subscribers get an email AND a notification — the closest thing to owned reach inside the platform — and the archive compounds as an authority asset.',
        howToUse: 'Name it after the outcome, not the company; keep issues to one deeply-solved problem; and turn each issue into 3–4 feed posts the following week.',
        examplePrompt: 'Plan a LinkedIn newsletter for [brand]: 3 name options tied to the reader outcome, a repeatable issue structure, the first 6 issue topics, and for issue #1 write the headline plus 3 feed-post trailers that drive subscriptions.',
        momentum: 'rising',
        tags: ['newsletter', 'authority', 'ownedaudience'],
        formats: ['article', 'text-post']
      }
    ],

    /* ════════ X / TWITTER ════════ */
    x: [
      {
        id: 'x-threads-receipts',
        name: 'Threads with receipts',
        type: 'format',
        desc: 'Step-by-step threads where every claim is backed by a screenshot — dashboards, DMs, invoices, code — embedded at the exact moment of the claim.',
        whyItWorks: 'X\'s reply culture is adversarial by default; receipts pre-empt the "source?" pile-on and make the thread safe to retweet as evidence.',
        howToUse: 'Lead with the outcome in tweet 1, one step + one screenshot per tweet, and end by linking back to tweet 1 to loop new readers to the top.',
        examplePrompt: 'Turn this process into an 8-tweet X thread with receipts: [describe process/result]. Tweet 1 states the outcome with a number, each following tweet covers one step and names the screenshot to attach, final tweet asks for a repost and loops back to tweet 1.',
        momentum: 'steady',
        tags: ['proof', 'educational', 'threads'],
        formats: ['text-post', 'image']
      },
      {
        id: 'x-one-tweet-framework',
        name: 'One-tweet frameworks',
        type: 'format',
        desc: 'An entire mental model compressed into a single tweet using line breaks, arrows, or a 3-step list — no thread, no image.',
        whyItWorks: 'Single tweets travel further than threads via quote-posts, and a framework tight enough to screenshot becomes a bookmark magnet.',
        howToUse: 'Draft it as a thread first, then delete everything except the skeleton; if it doesn\'t survive as 280 characters it wasn\'t a framework yet.',
        examplePrompt: 'Compress our approach to [topic] into 5 different single-tweet frameworks (each under 280 characters): one numbered list, one if/then rule, one A→B→C arrow chain, one "X without Y is Z" formula, and one two-line aphorism.',
        momentum: 'peaking',
        tags: ['framework', 'writing', 'bookmarks'],
        formats: ['text-post']
      },
      {
        id: 'x-build-public-metrics',
        name: 'Build-in-public metric drops',
        type: 'topic',
        desc: 'Regular screenshots of real dashboards — MRR, followers, email subs, pipeline — with a 2–3 line honest commentary on what moved and why.',
        whyItWorks: 'X\'s indie and founder scene runs on verifiable numbers; a real chart with a candid note earns more trust per character than any essay.',
        howToUse: 'Post the same metric on a fixed rhythm so followers track the storyline, and never hide the down months — those posts perform best.',
        examplePrompt: 'Write 4 build-in-public X posts around these metrics: [numbers]. One celebrating a win with the lesson, one honest down-month post, one "what we\'re testing" post, one milestone retrospective. Each 2–4 lines plus which screenshot to attach.',
        momentum: 'peaking',
        tags: ['buildinpublic', 'transparency', 'proof'],
        formats: ['text-post', 'image']
      },
      {
        id: 'x-quote-tweet-take',
        name: 'Value-add quote posts',
        type: 'hook',
        desc: 'Quote-posting a big account\'s claim with a sharper reframe, a missing caveat, or data that complicates it — riding their reach with your angle.',
        whyItWorks: 'You inherit the original post\'s momentum while positioning yourself as the person who sees one level deeper; the algorithm treats quotes as fresh conversation.',
        howToUse: 'Add, don\'t just agree or dunk; quote within the first hour of a rising post; and keep your take self-contained so it works even if they delete.',
        examplePrompt: 'Here\'s a viral post in our niche: "[paste post]". Write 3 quote-post responses: one adding a missing nuance, one with a counter-example from our experience, one extending it into a practical next step. Each under 280 characters and self-contained.',
        momentum: 'steady',
        tags: ['engagement', 'contrarian', 'reach'],
        formats: ['text-post']
      },
      {
        id: 'x-longform-articles',
        name: 'Native long-form articles',
        type: 'format',
        desc: 'Publishing full essays directly on X (Articles) instead of linking out to a blog, with a strong tweet as the front door.',
        whyItWorks: 'X suppresses external links but promotes native long-form; the article keeps readers in-app while giving you blog-depth authority.',
        howToUse: 'Write the announcement tweet like a hook (the article\'s best claim), structure with subheads for skimmers, and recycle the best paragraphs as standalone posts later.',
        examplePrompt: 'Outline a 1,200-word native X article: "[working title about topic]". Give me the hook tweet announcing it, 5 subhead sections with key points, and mark the 3 paragraphs most worth reposting as standalone tweets next week.',
        momentum: 'rising',
        tags: ['longform', 'authority', 'writing'],
        formats: ['article', 'text-post']
      },
      {
        id: 'x-live-process',
        name: 'Live-tweeting the work',
        type: 'topic',
        desc: 'Narrating a real work session in real time — "rewriting our pricing page, thread of decisions as I make them" — raw and unedited.',
        whyItWorks: 'The unfolding-now quality creates appointment energy no scheduled post has, and the finished thread becomes a permanent case study.',
        howToUse: 'Announce the session an hour ahead, timestamp each update, include dead-ends honestly, and cap it with a summary post linking the whole ride.',
        examplePrompt: 'Plan a live-tweet session where we [work task] in public on X: the announcement post, 6 example in-progress updates (including one dead-end and recovery), and the wrap-up post that packages the session as a case study.',
        momentum: 'rising',
        tags: ['bts', 'buildinpublic', 'realtime'],
        formats: ['text-post']
      },
      {
        id: 'x-screenshot-essay',
        name: 'Screenshot essays',
        type: 'visual',
        desc: 'Writing 300–500 words in a notes app, screenshotting it, and posting the image with a one-line tweet — long-form smuggled into the image slot.',
        whyItWorks: 'Images get more surface area in the feed than text, and the notes-app aesthetic signals "unfiltered thoughts" which earns a charitable read.',
        howToUse: 'Give the essay an internal title in bold, keep it to one screenshot (never a 4-image essay), and make the tweet caption a hook, not a summary.',
        examplePrompt: 'Write a 350-word screenshot essay for X on [opinion/lesson]: a bold internal title, 4 short punchy paragraphs formatted for a notes-app screenshot, and a one-line tweet caption that teases the essay without summarizing it.',
        momentum: 'peaking',
        tags: ['writing', 'lofi', 'opinion'],
        formats: ['image', 'text-post']
      },
      {
        id: 'x-reply-guy-strategy',
        name: 'High-signal reply strategy',
        type: 'topic',
        desc: 'Systematically replying with genuine insight to 10–20 rising posts per day in your niche, as a primary growth channel rather than an afterthought.',
        whyItWorks: 'Replies surface to the original post\'s entire audience, and X\'s ranking rewards accounts whose replies earn engagement — the fastest cold-start on the platform.',
        howToUse: 'Reply within 30 minutes of a rising post, lead with substance in the first line, and never link or pitch — the profile click is the conversion.',
        examplePrompt: 'Our client is a [role] serving [audience]. Write 8 reply templates for common post types in this niche (win announcements, hot takes, questions, fails) that add a specific insight or micro-story in under 3 lines each.',
        momentum: 'steady',
        tags: ['engagement', 'growth', 'community'],
        formats: ['text-post']
      },
      {
        id: 'x-roundup-curation',
        name: 'Curation & roundup threads',
        type: 'format',
        desc: '"The 9 best [resources/accounts/tools] for [outcome]" threads where each entry gets one tweet with a specific reason it earned its spot.',
        whyItWorks: 'Curation is a bookmark and repost machine — you deliver enormous value without creating anything new, and everyone featured amplifies you.',
        howToUse: 'Only include things you genuinely use, tag the creators so they repost, and put your own resource at a believable position (not #1).',
        examplePrompt: 'Draft a 10-tweet X curation thread: "The 8 best [resource type] for [audience]". For each entry write one tweet with a specific, non-generic reason it\'s included, tag placements, and a closing tweet with a repost CTA.',
        momentum: 'steady',
        tags: ['curation', 'bookmarks', 'community'],
        formats: ['text-post']
      },
      {
        id: 'x-contrarian-data',
        name: 'Data-backed contrarian takes',
        type: 'hook',
        desc: 'A spicy claim in tweet one, immediately followed by the chart or dataset that makes it undeniable — outrage bait with a receipts safety net.',
        whyItWorks: 'The take triggers the quote-tweets; the data flips skeptics into sharers. Posts that survive their own ratio attempt reach escape velocity.',
        howToUse: 'Stress-test the data before posting (X will find the flaw), anticipate the top 3 objections and pre-write replies, and stay in the comments for the first hour.',
        examplePrompt: 'We have this data point: [stat/finding]. Write 3 contrarian X post versions that lead with the spiciest defensible claim, note the chart to attach, and pre-write replies to the 3 most likely objections.',
        momentum: 'rising',
        tags: ['contrarian', 'data', 'debate'],
        formats: ['text-post', 'image']
      }
    ],

    /* ════════ FACEBOOK ════════ */
    facebook: [
      {
        id: 'fb-longform-story-posts',
        name: 'Long-form storytelling posts',
        type: 'format',
        desc: '400–800 word narrative text posts — customer stories, founder origin moments, hard-lesson confessionals — written like a short personal essay.',
        whyItWorks: 'Facebook\'s core demographic still reads, and the algorithm rewards the long comment threads that emotional narrative reliably produces.',
        howToUse: 'Open mid-scene ("The phone rang at 6:47am"), keep paragraphs to 2–3 lines, and end by asking readers for their version of the story.',
        examplePrompt: 'Write a 500-word Facebook storytelling post based on this moment: [describe event]. Open mid-scene, build to an emotional turn, land one lesson, and close with a question that invites readers to share their own similar experience.',
        momentum: 'steady',
        tags: ['storytelling', 'emotional', 'community'],
        formats: ['text-post']
      },
      {
        id: 'fb-groups-first',
        name: 'Groups-first content strategy',
        type: 'topic',
        desc: 'Making a niche Facebook Group the main event — daily prompts, member spotlights, weekly rituals — with the Page demoted to a front door.',
        whyItWorks: 'Group posts reach members at rates Pages can only dream of, and a ritual-driven group compounds into a moat competitors can\'t copy-paste.',
        howToUse: 'Anchor the week with 2–3 recurring threads ("Win Wednesday"), spotlight members more than yourself, and seed every discussion with the first comment.',
        examplePrompt: 'Design a weekly content calendar for a Facebook Group serving [audience]: 3 recurring weekly threads with their exact prompt copy, a monthly member-spotlight format, and 5 discussion starters tied to [niche] pain points.',
        momentum: 'steady',
        tags: ['community', 'engagement', 'retention'],
        formats: ['text-post', 'live']
      },
      {
        id: 'fb-reels-crosspost-native',
        name: 'Facebook-native Reels (not lazy crossposts)',
        type: 'format',
        desc: 'Short vertical video made or re-cut for Facebook\'s older-skewing audience: slower pacing, clearer captions, less slang, more payoff up front.',
        whyItWorks: 'Reels are Facebook\'s biggest organic reach surface right now, but TikTok-paced crossposts underperform — the audience wants clarity over chaos.',
        howToUse: 'Re-edit rather than repost: slow the cuts ~20%, enlarge captions, replace trend audio with clear voiceover, and state the payoff in the first line.',
        examplePrompt: 'Adapt this TikTok script for Facebook Reels and an older audience: [paste script]. Slow the pacing, simplify the language, front-load the practical payoff, and specify caption size/style notes.',
        momentum: 'peaking',
        tags: ['video', 'reach', 'repurposing'],
        formats: ['short-video']
      },
      {
        id: 'fb-nostalgia-content',
        name: 'Nostalgia & throwback angles',
        type: 'topic',
        desc: 'Content anchored in shared memory — "how we did this in 2010", old photos of the shop, first-ever products, era-comparison posts.',
        whyItWorks: 'Nostalgia is the single most shared emotion on Facebook; it converts passive scrollers into commenters swapping their own memories.',
        howToUse: 'Pair one real old photo with one specific memory (dates, prices, names), then bridge to today; ask "who remembers?" to open the floodgates.',
        examplePrompt: 'Create 6 nostalgia post ideas for a [type of business] on Facebook: each with the throwback angle, the photo to dig up, a caption that includes one hyper-specific period detail, and a "who remembers" style question.',
        momentum: 'peaking',
        tags: ['nostalgia', 'emotional', 'engagement'],
        formats: ['image', 'text-post']
      },
      {
        id: 'fb-live-qa-show',
        name: 'Recurring live Q&A shows',
        type: 'format',
        desc: 'A scheduled weekly Facebook Live with a named show format — same day, same time, one topic plus open questions from comments.',
        whyItWorks: 'Live triggers follower notifications and gets ranked above regular video, and the replay keeps collecting comments for days afterward.',
        howToUse: 'Name the show, post the topic 24 hours ahead to gather questions, greet commenters by name on air, and pin a timestamped agenda on the replay.',
        examplePrompt: 'Create a weekly Facebook Live show concept for [brand]: 3 show name options, a 30-minute run of show, the 24-hours-before announcement post, and 5 evergreen audience questions to fall back on when chat is quiet.',
        momentum: 'steady',
        tags: ['live', 'community', 'authority'],
        formats: ['live']
      },
      {
        id: 'fb-share-bait-utility',
        name: 'Save-and-share utility graphics',
        type: 'visual',
        desc: 'Single-image cheat sheets — seasonal checklists, conversion charts, "tag someone who needs this" reference cards — built to be shared to feeds and family group chats.',
        whyItWorks: 'Facebook sharing is habitual and personal (people share TO someone); a genuinely useful reference card rides that behavior for weeks.',
        howToUse: 'One image, one use-case, text readable at thumbnail size; caption asks readers to share it with the specific person who needs it.',
        examplePrompt: 'Design a shareable Facebook utility graphic for [audience]: the checklist/reference content (max 8 items), a title that names who it\'s for, layout notes for thumbnail readability, and a caption that prompts tagging a specific person.',
        momentum: 'steady',
        tags: ['saveable', 'educational', 'shares'],
        formats: ['image']
      },
      {
        id: 'fb-local-community-angle',
        name: 'Hyper-local community anchoring',
        type: 'topic',
        desc: 'Content tied to the local area — neighborhood shout-outs, local event tie-ins, "best of [town]" collaborations with nearby businesses.',
        whyItWorks: 'Facebook is still where local life gets organized; local-tagged content gets shared into town groups where trust and intent are highest.',
        howToUse: 'Name-drop real places and people (with permission), cross-tag partner businesses so both audiences see it, and time posts to local events.',
        examplePrompt: 'Generate 8 hyper-local Facebook post ideas for a business in [town/area]: include 2 partner shout-out formats, 2 local event tie-ins, 2 community question posts, and 2 "local guide" posts, each with a caption starter.',
        momentum: 'rising',
        tags: ['local', 'community', 'partnership'],
        formats: ['image', 'text-post']
      },
      {
        id: 'fb-photo-album-recaps',
        name: 'Event photo-album recaps',
        type: 'format',
        desc: 'Uploading 15–30 photo albums after events, workshops or busy weeks, with people tagged (with consent) and a warm narrative caption.',
        whyItWorks: 'Every tag notifies a person who then shares to their own network — albums are Facebook\'s original growth loop and it still works.',
        howToUse: 'Shoot candids of people (not just the venue), post within 48 hours while energy is high, and invite attendees to tag themselves in the caption.',
        examplePrompt: 'Write the recap caption and shot list for a Facebook photo album covering our [event]: 10 candid photo moments to capture, a 4-line warm narrative caption, and a tag-yourself invitation that doesn\'t feel forced.',
        momentum: 'steady',
        tags: ['community', 'bts', 'event'],
        formats: ['image']
      },
      {
        id: 'fb-messenger-broadcast',
        name: 'Messenger broadcast follow-ups',
        type: 'topic',
        desc: 'Using comment-triggered Messenger automations to deliver guides and event reminders, then nurturing the list with occasional broadcasts.',
        whyItWorks: 'Messenger open rates embarrass email, and a comment-to-DM flow converts post engagement into a re-contactable audience automatically.',
        howToUse: 'Trigger on a keyword comment, deliver real value in message one, and cap broadcasts at 2–4/month so you stay welcome in the inbox.',
        examplePrompt: 'Map a Facebook comment-to-Messenger flow for our lead magnet [name]: the feed post with keyword CTA, the 3-message delivery sequence, and 2 follow-up broadcast messages spaced a week apart that nurture without pitching hard.',
        momentum: 'rising',
        tags: ['leadgen', 'automation', 'retention'],
        formats: ['text-post', 'image']
      },
      {
        id: 'fb-behind-counter-video',
        name: '"Behind the counter" owner videos',
        type: 'visual',
        desc: 'The owner or team talking casually to camera from inside the business — restocking, prepping, closing up — sharing one thought or thank-you.',
        whyItWorks: 'Facebook audiences buy from people they feel they know; a recurring familiar face converts a business Page into a character they root for.',
        howToUse: 'Same person, same setting, weekly; keep it under 90 seconds; alternate between a practical tip, a story, and a gratitude post.',
        examplePrompt: 'Script 4 weekly "behind the counter" Facebook videos for [business owner name/type]: one customer thank-you, one practical seasonal tip, one honest struggle story, one sneak peek — each under 90 seconds with a natural opening line.',
        momentum: 'rising',
        tags: ['authenticity', 'personalbrand', 'bts'],
        formats: ['short-video', 'story']
      }
    ],

    /* ════════ PINTEREST ════════ */
    pinterest: [
      {
        id: 'pin-idea-pin-steps',
        name: 'Multi-page idea pins (step-by-steps)',
        type: 'format',
        desc: 'Multi-page vertical pins walking through a process — a recipe, a room refresh, a content workflow — one clean step per page.',
        whyItWorks: 'Pinterest is planning-mode traffic; step-by-step pins match exactly what savers came to do and keep resurfacing for a year or more.',
        howToUse: 'Cover page states the finished outcome with keyword text, 5–8 step pages each with one image and one instruction line, final page carries the CTA.',
        examplePrompt: 'Plan a 7-page Pinterest idea pin: "How to [outcome]". Write the keyword-rich cover title, one instruction line + image direction per step page, and a final-page CTA. Include a 2-sentence pin description with 4 search keywords.',
        momentum: 'steady',
        tags: ['educational', 'evergreen', 'howto'],
        formats: ['carousel', 'image']
      },
      {
        id: 'pin-aesthetic-moodboards',
        name: 'Aesthetic moodboard pins',
        type: 'visual',
        desc: 'Collaged moodboards around a named aesthetic ("quiet luxury office", "coastal grandma kitchen") that anchor a whole themed board.',
        whyItWorks: 'Pinterest users search by vibe as much as by object; owning a named aesthetic puts your pins at the top of an entire taste category.',
        howToUse: 'Track rising aesthetics in Pinterest Trends, build 4–6 pin variations per aesthetic, and route each to a dedicated keyword-titled board.',
        examplePrompt: 'Create 5 moodboard pin concepts around the aesthetic "[named aesthetic]" for [brand]: the 6–8 collage elements per board, an overlay title, a keyword-loaded pin description, and the board name each should live on.',
        momentum: 'peaking',
        tags: ['aesthetic', 'visual', 'discoverability'],
        formats: ['image']
      },
      {
        id: 'pin-seasonal-keyword-sprints',
        name: 'Seasonal keyword sprints (45 days early)',
        type: 'topic',
        desc: 'Publishing seasonal content 30–60 days before the moment — Christmas pins in late October, summer content in April — matched to rising search terms.',
        whyItWorks: 'Pinterest planners search far ahead of the calendar, and pins published early accumulate the saves that make them rank when search volume peaks.',
        howToUse: 'Work from a rolling 60-day-ahead calendar, refresh last year\'s winners with new images, and front-load keywords in title and description.',
        examplePrompt: 'It\'s [current month]. List the seasonal Pinterest search moments 45–60 days out for a [niche] brand, and draft 6 pin concepts targeting them: title with the seasonal keyword, image direction, and description copy.',
        momentum: 'steady',
        tags: ['seasonal', 'seo', 'planning'],
        formats: ['image', 'carousel']
      },
      {
        id: 'pin-infographic-checklists',
        name: 'Tall infographic checklists',
        type: 'visual',
        desc: '2:3 or taller single-image pins packing a complete checklist or cheat sheet into one scannable, branded graphic.',
        whyItWorks: 'Complete-at-a-glance utility is the most saved pin genre — every save re-distributes the pin, and checklists never expire.',
        howToUse: 'Max 8–10 items in large type, put the keyword title at the top third (visible in feed crop), and keep a consistent template so saves build brand recognition.',
        examplePrompt: 'Write the content for a tall Pinterest infographic: "The [topic] checklist". Give a keyword title, 8 checklist items under 8 words each, a bottom-strip CTA, and a 3-sentence pin description with long-tail keywords.',
        momentum: 'steady',
        tags: ['saveable', 'educational', 'evergreen'],
        formats: ['image']
      },
      {
        id: 'pin-video-text-overlay',
        name: 'Short video pins with text overlay',
        type: 'format',
        desc: '6–15 second video pins — a satisfying process moment or quick transformation — with a big static keyword title overlaid throughout.',
        whyItWorks: 'Video pins auto-play in the feed and out-click static pins, but only when the persistent text tells searchers instantly what they\'ll get.',
        howToUse: 'Repurpose your best short-form clips, trim to one visual moment, and hold a title overlay through the entire runtime — Pinterest viewers browse muted.',
        examplePrompt: 'Select-and-adapt plan: we have these short videos [list clips]. Choose the 4 best for Pinterest video pins, and for each give the 6–15s trim, the persistent overlay title with a search keyword, and the pin description.',
        momentum: 'rising',
        tags: ['video', 'repurposing', 'discoverability'],
        formats: ['short-video']
      },
      {
        id: 'pin-before-after-transformations',
        name: 'Before/after split pins',
        type: 'visual',
        desc: 'Vertical split or top/bottom before-and-after images — spaces, designs, bodies of work, brand glow-ups — with the result stated in the overlay.',
        whyItWorks: 'Transformation is the core Pinterest fantasy ("my life, but upgraded"); split pins deliver the promise in a single glance and get saved as goals.',
        howToUse: 'Match lighting and angle across both shots for credibility, state the timeframe or cost in the overlay, and link to the how-to behind it.',
        examplePrompt: 'Design 5 before/after Pinterest pin concepts for [service/product]: what each before and after shot shows, an overlay line including a timeframe or spec, and a description that targets a "how to [transformation]" search.',
        momentum: 'steady',
        tags: ['proof', 'aspirational', 'visual'],
        formats: ['image']
      },
      {
        id: 'pin-trends-tiein',
        name: 'Pinterest Predicts tie-ins',
        type: 'topic',
        desc: 'Building content pillars around Pinterest\'s own published trend forecasts, naming the trend explicitly in titles and boards.',
        whyItWorks: 'Pinterest editorially boosts content matching its Predicts themes, and the report tells you a year of demand in advance — a public cheat sheet.',
        howToUse: 'Pick the 2–3 Predicts themes closest to your niche, create a board per theme, and publish 5+ pins each while the trend is pre-peak.',
        examplePrompt: 'Our niche is [niche]. Take 3 current Pinterest Predicts-style trend themes relevant to us and draft a mini content plan for each: board name, 4 pin concepts with keyword titles, and how our product/service naturally appears in them.',
        momentum: 'rising',
        tags: ['trends', 'planning', 'discoverability'],
        formats: ['image', 'carousel']
      },
      {
        id: 'pin-fresh-pin-cadence',
        name: 'Fresh-pin cadence on evergreen URLs',
        type: 'topic',
        desc: 'Creating 3–5 brand-new pin designs per month for the same cornerstone blog posts and product pages, instead of new content for new content\'s sake.',
        whyItWorks: 'Pinterest rewards fresh images, not fresh URLs — new creative on a proven destination compounds traffic to the pages that already convert.',
        howToUse: 'List your top-converting URLs, vary each new pin meaningfully (different image, angle, title keyword), and space designs a week apart per URL.',
        examplePrompt: 'Our top page is [URL/topic]. Generate 6 distinct Pinterest pin concepts pointing to it: each with a different visual approach, a different keyword-angle title, and a unique 2-sentence description — no two pins interchangeable.',
        momentum: 'steady',
        tags: ['seo', 'traffic', 'evergreen'],
        formats: ['image']
      },
      {
        id: 'pin-quote-cards-branded',
        name: 'Branded quote & mantra pins',
        type: 'visual',
        desc: 'Typographic pins with resonant one-liners — mindset mantras, niche truths, gentle humor — in a consistent recognizable brand style.',
        whyItWorks: 'Quote pins are saved to identity boards ("words to live by"), embedding your brand into how people see themselves — slow-burn affinity at scale.',
        howToUse: 'Write lines your exact customer would pin to describe their aspiration, keep one signature layout, and link pins to a soft landing page, not a hard sell.',
        examplePrompt: 'Write 12 pinnable one-liners for [audience] in [niche]: 4 mindset mantras, 4 sharp truths about their struggle, 4 aspirational statements. Each under 12 words, plus a note on the consistent visual style to use.',
        momentum: 'steady',
        tags: ['inspiration', 'branding', 'saveable'],
        formats: ['image']
      },
      {
        id: 'pin-gift-guide-collections',
        name: 'Gift-guide & roundup pins',
        type: 'format',
        desc: 'Curated "X ideas for Y" collection pins — gift guides, starter kits, capsule collections — published as tall collages or idea-pin lists.',
        whyItWorks: '"Gift ideas for…" and "essentials for…" are perennial top searches with buying intent baked in; roundups intercept shoppers at decision time.',
        howToUse: 'Target a specific person + occasion in the title ("gifts for new managers"), include your product at position 2 or 3, and refresh the same guides each season.',
        examplePrompt: 'Build a Pinterest gift-guide pin: "9 [category] ideas for [specific person/occasion]". List the 9 items with one-line reasons, where our product slots in naturally, the collage layout order, and a buying-intent keyword description.',
        momentum: 'rising',
        tags: ['shopping', 'seasonal', 'curation'],
        formats: ['image', 'carousel']
      },
      {
        id: 'pin-search-first-boards',
        name: 'Keyword-architected board systems',
        type: 'topic',
        desc: 'Structuring the whole profile as a search directory: boards named for exact queries ("small backyard patio ideas"), each with a keyword description and 30+ pins.',
        whyItWorks: 'Boards rank in Pinterest and Google search independently of pins; a well-architected profile becomes dozens of ranked landing pages.',
        howToUse: 'Keyword-research board names before creating them, seed each new board with 10 pins in week one, and prune vanity boards that dilute the profile\'s topic signal.',
        examplePrompt: 'Architect a Pinterest profile for [brand/niche]: 10 board names based on real search phrasing, a 2-sentence keyword description per board, and which 3 boards to prioritize with weekly pinning first.',
        momentum: 'rising',
        tags: ['seo', 'planning', 'discoverability'],
        formats: ['image']
      }
    ]
  };

  /* ── universal hook formulas ────────────────────────────────────── */
  var hookPatterns = [
    { pattern: 'Nobody talks about ___', example: 'Nobody talks about what happens after you land the client.' },
    { pattern: 'I did ___ for 30 days — here’s what happened', example: 'I posted on LinkedIn every day for 30 days — here’s what happened to my pipeline.' },
    { pattern: 'Stop doing ___ if you want ___', example: 'Stop batching a month of content if you want any of it to feel current.' },
    { pattern: 'The ___ mistake that’s costing you ___', example: 'The pricing-page mistake that’s costing you 30% of your demos.' },
    { pattern: '___ is dead. Here’s what’s replacing it', example: 'Cold outreach is dead. Here’s what’s replacing it in 2026.' },
    { pattern: 'How I ___ without ___', example: 'How I book 15 sales calls a month without posting daily.' },
    { pattern: 'POV: you’re ___ and ___', example: 'POV: you’re a freelancer and the client just said "quick call?" at 4:58pm.' },
    { pattern: 'Things I wish I knew before ___', example: 'Things I wish I knew before hiring my first employee.' },
    { pattern: 'Unpopular opinion: ___', example: 'Unpopular opinion: your niche isn’t too small — your message is too vague.' },
    { pattern: 'We spent $___ on ___ so you don’t have to', example: 'We spent $12,000 on Meta ads so you don’t have to. Steal the 3 winners.' },
    { pattern: 'If I had to start ___ from zero, here’s exactly what I’d do', example: 'If I had to grow an audience from zero in 2026, here’s exactly what I’d do.' },
    { pattern: 'The uncomfortable truth about ___', example: 'The uncomfortable truth about "going viral": it rarely pays the invoice.' },
    { pattern: '___ asked me ___. Here’s what I told them', example: 'A client asked me if organic content still works. Here’s what I told them.' },
    { pattern: 'Watch me ___ in under ___ minutes', example: 'Watch me turn one podcast episode into 10 posts in under 20 minutes.' },
    { pattern: 'You’re not ___ — you’re ___', example: 'You’re not inconsistent — you’re working without a system.' },
    { pattern: 'Read this before you ___', example: 'Read this before you spend another dollar on brand photography.' },
    { pattern: 'Here’s the exact ___ we use to ___', example: 'Here’s the exact 5-question brief we use to write hooks that hold attention.' },
    { pattern: 'Everyone says ___. We tested it — here’s the truth', example: 'Everyone says post at 9am. We tested 400 posts — here’s the truth.' }
  ];

  /* ── build flat index once (each trend belongs to exactly one platform,
   *    so attaching .platform at build time is safe and mutation-free
   *    for callers) ─────────────────────────────────────────────────── */
  var flat = [];
  var byId = {};
  Object.keys(byPlatform).forEach(function (pid) {
    byPlatform[pid].forEach(function (t) {
      t.platform = pid;
      flat.push(t);
      byId[t.id] = t;
    });
  });

  /* ── public API ─────────────────────────────────────────────────── */
  CE.trends = {
    byPlatform: byPlatform,
    hookPatterns: hookPatterns,
    updated: 'July 2026',

    /* all() → flat array of every trend with .platform set */
    all: function () {
      return flat.slice();
    },

    /* get(id) → trend object or null */
    get: function (id) {
      return byId[id] || null;
    },

    /* forClient(client) → trends across the client's platforms;
     * falls back to all() when client is null or has no platforms. */
    forClient: function (client) {
      if (!client || !Array.isArray(client.platforms) || client.platforms.length === 0) {
        return CE.trends.all();
      }
      var out = [];
      client.platforms.forEach(function (pid) {
        var list = byPlatform[pid];
        if (list) out = out.concat(list);
      });
      return out;
    }
  };
})();
