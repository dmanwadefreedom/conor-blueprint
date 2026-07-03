# Content Engine — Module Spec (builder contract)

Static, no-build vanilla-JS app served from this repo root at content.thedylanewing.com.
Multi-client content command center: **Discover → Research → Create → Plan**, plus a **Coach AI**.

## Hard rules for every module

1. Plain ES5-compatible JavaScript in an IIFE: `(function(){ 'use strict'; var CE = window.CE; ... })();`
   No modules, no imports, no external libraries, no CDN, no build step, no TypeScript syntax.
2. NEVER interpolate user data into `innerHTML` without `CE.ui.esc()`. Prefer `CE.ui.el()` with `text:`.
3. Views are **pure synchronous renders**: `render(container, ctx)` rebuilds the whole view from
   `CE.store` state. After any `CE.store.set(fn)` the shell re-renders the active view automatically.
   For keystroke-level saves inside inputs use `CE.store.set(fn, { rerender: false })`.
4. Handle empty states gracefully (no client, no items) with the `.empty` pattern.
5. Only touch your own file. Use only the shared APIs and CSS classes below (plus minimal inline styles).
6. Register exactly: `CE.views.<id> = { id, title, icon, render }` (icons: grid, compass, book, pen, calendar, chat, users, spark, settings).

## Shared APIs (already implemented — do not redefine)

### CE.store  (assets/js/store.js)
- `CE.store.get()` → state
- `CE.store.set(fn, opts?)` — `fn(state)` mutates; persists to localStorage; re-renders unless `{rerender:false}`
- `CE.store.subscribe(cb)` → unsub
- `CE.store.client()` → active client `{id, name, color, industry, niche, audience, voice, goals, platforms[], demo?}`
- `CE.store.data(clientId?)` → active client data `{ideas[], briefs[], drafts[], schedule[], coachThread[]}`
- `CE.store.addClient(profile)` / `CE.store.removeClient(id)` / `CE.store.exportJSON()` / `CE.store.importJSON(text)` / `CE.store.resetAll()`
- `CE.uid()` → id string

### State shapes
- **idea**: `{id, title, angle, hook, format, platform, status, trendRef, notes, createdAt, updatedAt}`
- **brief**: `{id, ideaId?, topic, summary, keyPoints[], hooks[], keywords[], sources[], competitors[], createdAt}`
- **draft**: `{id, ideaId?, platform, format, hook, body, hashtags[], cta, visualNotes, status, createdAt}`
- **schedule item**: `{id, refType:'draft'|'idea', refId, title, date:'YYYY-MM-DD', time:'HH:MM', platform, status:'scheduled'|'published'}`
- **coachThread msg**: `{role:'user'|'assistant', content, ts}` (content is plain text)
- **settings**: `{apiKey, model, theme}`

### CE.const
- `PLATFORMS` map: `{instagram, tiktok, youtube, linkedin, x, facebook, pinterest}` each
  `{id, label, short, color, bestTimes[], cadence}`
- `STATUSES` (ordered): `['idea','researched','drafted','approved','scheduled','published']`
- `STATUS_COLORS`, `STATUS_LABELS`, `FORMATS`, `MOMENTUM`

### CE.ui  (assets/js/app.js)
- `CE.ui.el(tag, attrs, ...children)` — attrs: `class, text, html, style(obj), dataset(obj), on<event>: fn`, others as attributes. Children: nodes/strings/arrays.
- `CE.ui.esc(s)`, `CE.ui.toast(msg, 'good'|'err'|'')`, `CE.ui.modal({title, body, actions:[{label, class, onClick(close), keepOpen}], wide})` → close()
- `CE.ui.confirm(message, dangerLabel?)` → Promise<bool>
- `CE.ui.fmtDate('YYYY-MM-DD')`, `CE.ui.platformBadge(pid)`, `CE.ui.statusBadge(status)`
- `CE.icon(name)` → svg string; `CE.navigate(viewId, 'query=string')` (params via `ctx.params` URLSearchParams)
- `CE.openCoach(prefillText?)` opens the coach drawer; `CE.openAddClient()`

### CE.trends  (assets/js/data/trends.js — built by the trends agent)
`CE.trends.byPlatform[platformId]` → array of trend objects:
`{id, name, type:'format'|'visual'|'audio'|'topic'|'hook', desc, whyItWorks, howToUse, examplePrompt, momentum:'rising'|'peaking'|'steady', tags[], formats[]}`
Also `CE.trends.all()` → flat array with `.platform` set; `CE.trends.get(id)`;
`CE.trends.forClient(client)` → trends across the client's platforms;
`CE.trends.hookPatterns` → array of `{pattern, example}` universal hook formulas;
`CE.trends.updated` → human-readable dataset date string.

### CE.coach public API (assets/js/views/coach.js — built by the coach agent)
- `CE.coach.renderPanel(container, {prefill})` — full chat UI (used by drawer AND the coach view)
- `CE.coach.connected()` → bool (settings.apiKey present)

## CSS classes available (assets/css/app.css)
Layout: `.view-head` (+h1, `.sub`, `.spacer`), `.grid.cols-2/3/4`, `.row(.wrap)`, `.spread`, `.stack`, `.divider`
Components: `.card(.pad-lg,.click)`, `.card-title`, `.stat-tile/.stat-value/.stat-label/.stat-delta(.up,.flat)`,
`.btn(.btn-primary,.btn-ghost,.btn-danger,.btn-sm)`, `.badge`(+`.swatch`), `.tag`, `.momentum.rising/.peaking/.steady`,
`.field>label + .input/.select/.textarea`, `.checks/.check-pill`, `.hint`, `.table(tr.click)`, `.tabs/.tab(.active)`,
`.empty(.empty-icon)`, `.pipe-bar/.pipe-seg/.pipe-legend`, calendar: `.cal-head/.cal-title/.cal-dow/.cal/.cal-day(.other,.today,.drop-ok)/.cal-num/.cal-evt(.published)`,
chat: `.chat-scroll/.chat-msg(.user,.assistant,.tool-note)/.chat-input-row/.typing`, utils: `.muted,.small,.mt,.mb,.mono,.ellipsis,.kbd`

Design: dark UI. Text always in ink tokens; color chips/swatches carry identity. Momentum uses the
`.momentum` classes. Pipeline stage colors come from `CE.const.STATUS_COLORS` only.

## View standard header pattern
```js
container.appendChild(CE.ui.el('div', {class:'view-head'},
  CE.ui.el('div', {}, CE.ui.el('h1', {text:'Discover'}), CE.ui.el('div', {class:'sub', text:'…'})),
  CE.ui.el('div', {class:'spacer'}),
  /* action buttons */));
```
If `CE.store.client()` is null, render an empty state with an “Add your first client” button calling `CE.openAddClient()`.
