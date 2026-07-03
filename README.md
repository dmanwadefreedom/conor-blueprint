# Content Engine — content.thedylanewing.com

A multi-client content command center. Static site — no build step, no server, no database
required. Every workspace, idea, brief, draft, schedule item, and coach conversation is
stored automatically in the browser (localStorage) and can be exported/imported as JSON.

## The workflow

**Discover → Research → Create → Plan**, with **Coach AI** across the whole loop.

| View | What it does |
|---|---|
| **Dashboard** | Per-client pipeline overview: stat tiles, stacked pipeline bar, next 7 days, trending picks |
| **Discover** | Browse trending formats, visuals, audio and topic trends per platform; save any trend as an idea; universal hook patterns |
| **Research** | Idea pipeline + one-click research briefs (angles, key points, hooks, keywords, sources) |
| **Create** | Platform-native draft generator (LinkedIn posts, IG carousels, TikTok scripts, YT outlines, X threads…) with character limits, hashtags, CTAs |
| **Plan** | Monthly calendar with drag-and-drop scheduling, auto-slotting, best posting times per platform |
| **Coach** | AI assistant with full client context. Connected to the Anthropic API it can *do the work*: add ideas, write briefs and drafts, and schedule posts via tools. Works offline in heuristic mode too |
| **Clients** | Multi-client workspaces (profile, voice, audience, goals, platforms), API settings, export/import/reset |

## Multi-client

Each client is an isolated workspace with its own profile (industry, niche, audience, voice,
goals, platforms), pipeline, calendar, and coach thread. Switch clients from the sidebar.

## Coach AI setup

Clients & Settings → paste an Anthropic API key (from console.anthropic.com) → pick a model
(Sonnet 5 recommended). The key is stored **only in the browser** — it never touches a server.
Without a key, Coach runs in offline mode using the built-in trend dataset and hook patterns.

## Data & backups

All data lives in `localStorage` under `ce.v1`, saved on every change — nothing is lost between
sessions on the same browser/device. Use **Clients & Settings → Export data** for JSON backups
or to move between devices/browsers, and **Import data** to restore.

## Deploying to content.thedylanewing.com

The repo root is the site. For GitHub Pages:

1. Deploy the repo root to any static host (Vercel, Netlify, GitHub Pages) — no build step needed.
2. Point whatever subdomain you choose at it (note: content.thedylanewing.com currently serves the Glowup app).
   `content` → `<github-username>.github.io`

Any static host (Netlify, Vercel, Cloudflare Pages) works the same — point it at the repo root.

The original Conor lead-gen blueprint page is preserved at `/conor/`.
