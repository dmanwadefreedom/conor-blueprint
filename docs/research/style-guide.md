# Repo Style Guide — Single Source of Truth for New Pages

This repo contains two distinct, complete design systems. Match the one appropriate to your page type. Everything is a **single self-contained HTML file**: all CSS in one `<style>` block in `<head>`, all JS in one `<script>` at end of `<body>`, universal reset `*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }`, `html { scroll-behavior: smooth; }`, `-webkit-font-smoothing: antialiased`. No frameworks, no build step, no external CSS/JS.

---

## System A — "Blueprint" proposal pages (`/index.html`)

Minimal, editorial, monochrome, one-section-per-screen scroll narrative. Use for client proposal/blueprint decks.

### Colors
```css
background: #ffffff;
text primary: #1a1a1a;      /* headings, strong, big numbers */
body copy:   #555;          /* paragraphs */
secondary:   #666;          /* subtitles, card p */
muted:       #888 / #999 / #aaa;  /* labels, fine print (darker→lighter as less important) */
borders:     #e0e0e0 (hover: #bbb);
faint:       #ccc  (arrows, footer, before-dashes);
highlight:   #ffeb3b44 (pull-quote bg), #ffeb3b22 (result chip bg), #fafafa (inset box);
```
No accent color. Emphasis via weight, size, and yellow-tint highlight only.

### Typography
- Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
- Body: `19px / line-height 2.0` (17px under 480px). Distinctively airy.
- Hero h1: `clamp(2.4rem, 5vw, 3.4rem)`, **font-weight 300**, letter-spacing -0.5px
- Section title: `clamp(2rem, 4vw, 2.6rem)`, weight 300
- Section label (eyebrow): 12px, weight 600, letter-spacing 3px, uppercase, `#999`, margin-bottom 16px
- Big numbers thin: stat-number 2.4rem/300, big-stat 4.5rem/300
- Card/component h3: ~1.05rem weight 600; component body ~0.92rem `#666` line-height 1.7
- Micro-labels (Part 1, Week 1): 0.75rem, weight 600, letter-spacing 2px, uppercase, `#aaa`

### Layout & section structure
```css
.container { max-width: 800px; margin: 0 auto; padding: 0 32px; }
section { min-height: 100vh; display: flex; align-items: center; padding: 80px 32px; }
```
Every section: `.section-label` eyebrow → `.section-title` → optional `.section-subtitle` (1.05rem, #666, max-width 640px, mb 48px) → content. Copy blocks: `.copy-block { max-width: 640px; margin: 0 auto; }` with short paragraphs, `<strong>` in #1a1a1a.

### Component patterns (copy CSS from /index.html)
- **Cards** (`.cards-grid`/`.card`, `.why-grid`/`.why-card`): 2-col grid, gap 20px, white bg, 1px #e0e0e0 border, radius 8px, padding 32px 28px, hover `translateY(-3px)` + border #bbb, transition 0.3s.
- **Stat row**: 3-col grid of bordered centered boxes; thin 2.4rem number over 0.85rem #888 label.
- **Journey flow**: flex row of bordered pill boxes joined by `&rarr;` arrows in #ccc; arrows hidden and stacked vertically on mobile.
- **Big stat**: centered 4.5rem/300 number + small caption.
- **Solution blocks**: full-width bordered blocks, "PART N" micro-label, h3, bullet list (custom 6px #ccc dot bullets via `li::before`), then a `.solution-result` chip: `background:#ffeb3b22; border-radius:6px; font-weight:600; "Result: …"`.
- **Timeline**: `max-width 600px; padding-left 40px`, 1px vertical line via `::before`, 10px #1a1a1a dots with white border + #e0e0e0 ring shadow, per item: WEEK label → title → desc.
- **Before/After**: 2-col `.ba-grid`; both columns bordered; Before list uses em-dash (`\2014`, #ccc) bullets, After uses checkmarks (`\2713`, #1a1a1a bold).
- **Pricing**: `.pricing-note` box (setup fee + minimum term) above a 3-col grid; middle card `.recommended` gets `border: 2px solid #1a1a1a` + `.pricing-badge` black pill floating at top:-12px ("RECOMMENDED"); tier name 1.3rem/500, price 2.2rem/300 with `/mo` in 0.9rem #999 span; feature list checkmarks separated by top border; `.pricing-fine` centered #aaa fine print below.
- **Hormozi offer box** (after pricing grid, inline-styled in source): centered bordered box, max-width 700px, margin-top 80px, padding 48px 40px; uppercase kicker ("Can't Decide?"), 28px/300 headline, 18px/2.0 body paragraphs walking the ROI math, `#fafafa` inset box restating the setup fee, closing one-liner.
- **Next steps**: centered title, numbered `.steps-list` (number in `<span>` weight 500), ends with `.ready`: "Ready? Let's talk."
- **Footer**: centered, top border, #ccc, 0.82rem, just `© 2026`.

### Fade-in animation (identical pattern both systems — copy verbatim)
```css
.fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }
.fade-in.d1 { transition-delay: 0.1s; } /* d2 .2s, d3 .3s, d4 .4s — stagger within a section */
```
```js
document.addEventListener('DOMContentLoaded', function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.fade-in').forEach(function(el) { observer.observe(el); });
});
```
(Realtor pages use threshold 0.08, rootMargin '0px 0px -40px 0px', 0.7s/22px, no delay classes, **plus a 1500ms setTimeout safety net that adds `.visible` to any unrevealed `.fade-in`** — include the safety net on new pages.)

### Responsive
Breakpoints 768px and 480px: all grids collapse to 1 column, pricing grid max-width 360px centered, journey arrows `display:none`, body drops to 17px.

### Blueprint page narrative structure (section order — follow exactly)
1. **Hero** — 100vh centered: thin h1 (offer name), subtitle (transformation: "From X to Y"), sub-desc (concrete promise with timeframe: "How to fill your calendar with CMO calls in 30 days").
2. **Where You Are Now** — stat row of 3 facts about *their* business, then copy-block validating them ("You built X the right way… But the market changed… The old playbook doesn't work anymore… You need something different.").
3. **The Challenge / What Happens If Nothing Changes** — 4 pain cards, then a highlighted pull-quote ("Word of mouth worked for 25 years. But it won't carry you through 2026.").
4. **The Reality** — buyer journey flow (what their prospects do) + one big stat (e.g. 87%) + short copy ending in a bolded consequence ("They move on to someone else.").
5. **The Solution / What We Build For You** — 3–4 numbered solution-blocks, each: PART N → benefit-headline → bullets → "Result: …" chip.
6. **The Timeline / What Happens When** — Week 1 Setup → Week 2 Launch → Weeks 3-4 Results → Weeks 5-8 Optimize → After 60 Days Autopilot.
7. **The Results** — Before / After 60 Days columns.
8. **The Investment** — pricing note (setup fee, minimum), 3 tiers (Starter/Growth/Scale style, each "Everything in [previous]" +), fine print, then **Hormozi offer box**: anchor against their average deal value ("Your average placement fee — $15K? $20K? $25K? One call that converts pays for 6–12 months of this entire system."), name their current spend ("Right now you're spending $0 … and getting $0"), restate setup fee, close "Same system. Same results. Built to pay for itself fast."
9. **Why This Works / What Makes This Different** — 4 differentiator cards.
10. **Next Steps** — imperative title ("Stop Waiting for Referrals"), reassurance line, 3 numbered steps (Pick → We map → Launch Week 1), "Ready? Let's talk."
11. Footer.

---

## System B — Realtor sample funnels (`/realtor-samples/`)

Rich, branded, conversion landing pages. Each page gets its **own palette via CSS variables** but shares structure.

- **Gallery/index** (`realtor-samples/index.html`): dark theme — `--bg:#05080f`, card `#0b0f1a`, borders `#1a2236`/`#2a3a5c`, accent gold `#FFD700→#FFA500` gradient-clipped text in h1 `<em>`, muted `#8a94a8`, Inter 400–900, container 960px, pill eyebrow, flow-step pills with gold arrows, linked sample cards with mini-previews, checkmark "included" grid.
- **Buyer page**: luxury navy/gold — `--navy:#0e1c2f`, `--gold:#c8a45c`, `--ivory:#faf7f0`; headings `'Playfair Display', Georgia, serif`; body Inter 17px/1.7 on ivory.
- **Seller page**: empathetic forest/sage — `--forest:#0f2e24`, `--sage:#4c8a6d`, `--mint:#a9d6be`, `--cream:#f7f5ef`, CTA `--amber:#d9a441`; headings `'Lora', Georgia, serif`.
- Google Fonts via `<link>` with preconnect (serif display + Inter). Serif for h1–h3 only.

### Shared landing-page anatomy (buyer & seller both follow it)
1. Sticky dark `.topbar`: serif brand name (accent-colored surname `<span>`, uppercase-tracked `<small>` role) + CTA `.btn` anchored to `#book`/`#review`.
2. Dark gradient `.hero` with `position:absolute` Unsplash image at opacity 0.16–0.28 and `onerror="this.remove()"`; pill `.eyebrow` (location/confidentiality), serif h1 with accent `<em>` line, `.lead` paragraph, dual CTAs (solid `.btn` + `.btn-outline`/`.btn-ghost`), small `.hero-note` trust line ("You talk to Logan directly, not a call center").
3. `.video-frame` placeholder: 16/9, gradient bg, gold `.play-dot` with CSS triangle, "[ Agent intro video embeds here: 60 to 90 seconds ]".
4. Full-width urgency/confidential strip (accent or dark bg, one sentence of scarcity/reassurance).
5. Sections `padding: 84px 0` (64px mobile), same label→title→sub pattern as System A but `.section-label` in accent color, serif `.section-title` clamp ~1.7–2.4rem, `.section-sub` muted max-width ~640px.
6. Alternating light/dark sections: USP grids (white cards, accent top/left border, hover lift+shadow), a dark accent section (options/includes with translucent `rgba(255,255,255,0.045)` cards), numbered steps or `01`-numbered review list, timeline "clock" grid with one `.hot` highlighted card.
7. `#book` form section on dark bg: 2-col `.form-wrap` (pitch + `.assurance` checkmark list | white `.lead-form` card with box-shadow); fields have labels, qualification selects (timeline, budget/situation, pre-approval); full-width `.btn` submit; `.privacy` micro-copy ("never sold, never shared… opt out anytime"); hidden `.thanks` state revealed by JS on submit (demo: `e.preventDefault()`, swap form for numbered "Here's What Happens Next" + thank-you video placeholder).
8. Dark footer: brand, brokerage/license/compliance lines, Equal Housing Opportunity, and a `.demo-note` "Sample demonstration page… illustrative placeholders."

### Buttons
`.btn`: accent bg, dark text, weight 700, 15px, uppercase (buyer) or plain (seller), padding 17px 32–34px, radius 4–6px, hover `translateY(-2px)` + lighten. Ghost variant: transparent, light border.

---

## Copy voice (both systems)

- **Second person, direct, conversational.** Short sentences. Sentence fragments for punch ("25 years." "Tariffs. AI disruption." "You need something different.").
- **Formula: problem → reality → solution → timeline → before/after → pricing → Hormozi ROI reframe → next steps.** Name their exact situation before selling anything; validate first ("You built it the right way"), then pivot ("But the market changed").
- **Specificity over adjectives**: real numbers, names, timeframes everywhere (60+ posts, 60 seconds, 21 days, 87%, mid $500s, Week 1). Never "world-class" fluff.
- **Every feature gets an outcome**: bullets end in a "Result: …" line or concrete benefit; sections about deliverables framed as "What You Get / Your Free X Includes."
- **Objection pre-emption baked in**: "no pressure and no obligation," "not a call center," "never sold or shared," "whether or not we work together," "even though it means we don't get hired," "costs you nothing, the builder pays it."
- **Urgency stated plainly, not hyped**: "Only 7 Homes Remain," "Every week matters," "Phase Two releases at higher price points."
- Headings are claims or questions, never labels: "What Happens If Nothing Changes," "Behind on Your Mortgage?", "Buying New Construction Without Representation Costs You Money."
- Contrast constructions: "A working session, not a sales pitch," "A Specialist, Not a Generalist," "qualified buyers, not tire kickers," "Predictable instead of hoping."
- CTAs are first-person-benefit or imperative: "Get My Confidential Review," "Book Your Free 1-on-1 Consultation," "Ready? Let's talk."
- Section eyebrows use "The ___" pattern: The Challenge, The Reality, The Solution, The Timeline, The Results, The Investment.
- HTML uses entities (`&rarr;`, `&middot;`, `&mdash;`, `\2713` in CSS content); em-dashes and middots in microcopy; no emojis anywhere.
