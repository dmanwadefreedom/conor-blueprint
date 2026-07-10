# Obscura — Headless Browser for AI Agents (Research, 2026-07-10)

## TL;DR
"Obscura" almost certainly refers to **[h4ckf0r0day/obscura](https://github.com/h4ckf0r0day/obscura)** — an open-source **Rust headless browser engine built for AI agents and web scraping**. 18.6k stars in ~3 months, Apache-2.0, very active (updated today). It runs real JavaScript via V8, speaks Chrome DevTools Protocol (drop-in for Puppeteer/Playwright), ships a built-in **MCP server** for Claude/Cursor, and has a stealth/anti-detect mode. Its killer trade-off: **it never actually draws the page** (no layout engine, no real canvas/WebGL), so it is superb for high-volume scraping/monitoring/research and unsuitable for visual verification or logged-in posting on hardened social platforms.

---

## Candidate repos (disambiguation)

| Repo | What it is | Stars | Verdict |
|---|---|---|---|
| **h4ckf0r0day/obscura** | The headless browser for AI agents & web scraping (Rust) | **18,576** (1,288 forks) | **This is the one meant.** Canonical project; obscura.sh is its site |
| epicsagas/obscura-plugin | Community MCP/skill plugin wrapping Obscura for Claude Code, Cursor, Cline (`/obscura-fetch`, `/obscura-scrape`, `/obscura-pipeline`, `/obscura-crawl`; auto-downloads the binary) | small | Useful companion, not the main project |
| Sovereign-Engineering/obscuravpn-client | Obscura VPN (macOS, WireGuard/QUIC) | 375 | Unrelated — privacy VPN, not browser AI |

Other search hits (RussPalms/obscura_dev, Timtech4u/obscura-browser, etc.) are plain forks of h4ckf0r0day/obscura.

## The main repo: h4ckf0r0day/obscura

- **Created:** 2026-04-13 · **Updated:** 2026-07-10 (today) · **Language:** Rust · **License:** Apache-2.0 (no feature gating)
- **Stars/forks/issues:** 18,576 / 1,288 / 12 open issues — topped Hacker News; called "the fastest-growing web automation project in the ecosystem"
- **Releases:** v0.1.2 → **v0.1.9 (latest, ~Jun 24, 2026)** — roughly weekly cadence. Recent releases added: MCP server with 12 browser tools + Docker (v0.1.4), cookie persistence + Playwright compat (v0.1.6), embeddable Rust crate + V8 watchdog (v0.1.7), TLS-fingerprint sync (v0.1.8), request interception + global stealth flag, "creepjs reports 0% detection" (v0.1.9)
- **Topics:** antidetect, browser-automation, cdp, headless, playwright, puppeteer

### What it actually does
- Headless browser **engine written from scratch in Rust** — not a Chrome wrapper. Executes real JS via **V8**, implements **Chrome DevTools Protocol** (Target, Page, Runtime, DOM, Network, Fetch, Storage, Input domains), so existing **Puppeteer** (`puppeteer.connect({browserWSEndpoint: 'ws://127.0.0.1:9222/...'})`) and **Playwright** (`chromium.connectOverCDP`) scripts connect unchanged.
- **Performance claims:** ~30 MB memory per instance (vs 200+ MB Chrome), instant startup / sessions boot <50 ms (vs ~2 s), ~85 ms page load (vs ~500 ms), 70 MB binary. Built for parallel scraping via worker processes.
- **CLI:** `obscura fetch <url>` (dump html/text/**markdown**/links/assets, `--eval` JS), `obscura scrape <urls>` (parallel), `obscura serve --port 9222` (CDP server), `obscura mcp` (MCP server).
- **MCP server for AI agents:** `obscura mcp` (stdio for Claude Desktop/Code) or `--http --port 8080`. Exposes **12 browser tools**: browser_navigate, browser_snapshot, browser_click, browser_fill, browser_type, evaluate JS, wait-for-selector, network-request inspection, console logs, page-state management, etc.
- **Stealth mode** (`--stealth`): per-session fingerprint randomization (GPU/canvas/audio/battery), realistic UA client hints, trusted event dispatching, `navigator.webdriver = undefined`, TLS fingerprint synchronization, blocks 3,520+ tracker domains.
- **Deploy:** single Docker container (`docker run -d -p 127.0.0.1:9222:9222 h4ckf0r0day/obscura`), prebuilt binaries for Linux/macOS/Windows, embeddable as a Rust crate.
- **Obscura Cloud** (in development): hosted version with managed infra + **residential proxies**; open-source engine stays fully featured. Proxy sponsor integrations: SX.org, Swiftproxy, ProxyEmpire, MangoProxy, 9Proxy, NodeMaven, Rapidproxy.

### The critical limitation (know this before betting on it)
Obscura has **no layout engine, no CSS cascade, and no real canvas/WebGL — it never draws the page**:
- `getBoundingClientRect()` returns `{0,0,0,0}` for every element; `getComputedStyle` returns placeholders; `Page.getLayoutMetrics` is stubbed so screenshot calls "don't fail" — but there are **no real pixels**.
- Any anti-bot that **hashes actually-rendered canvas/WebGL pixels will flag it instantly**, regardless of the stealth mode's creepjs score.
- Community consensus on when to use it: *run JavaScript on unprotected/lightly-protected pages at high volume where a real Chrome (~200 MB each) is too heavy.* It is **not** a replacement for real Chrome on hardened, logged-in platforms.

---

## How it plugs into the AI content/ads operation

Think of Obscura as the **cheap, massively-parallel "read" layer**, with real Chrome (Playwright) kept as the "write/authenticated" layer.

**Strong fits (use Obscura):**
1. **Scraping winning ads & creative research at scale.** Crawl competitor landing pages, VSL funnels, ad-spy/library pages, YouTube/TikTok public pages, and dump straight to **markdown** (`--dump markdown`) for LLM ingestion into the content engine. Hundreds of parallel sessions on one small VPS instead of a fleet of Chrome instances. Caveat: Meta Ad Library / TikTok Creative Center run heavier bot defenses — test first; fall back to Playwright+Chrome or an API for those specific targets.
2. **100-video test measurement loop.** After variants are posted, a cron job scrapes public view/engagement counts and comments across all 100+ posts in parallel at trivial cost, feeding the winner-picking sheet. This is exactly the high-volume/low-protection read workload Obscura excels at.
3. **Competitor funnel monitoring.** Nightly `obscura scrape`/crawl of tracked funnels; diff the markdown dumps; alert on new hooks, offers, price changes.
4. **Agent-driven browsing via MCP.** `obscura mcp` gives Claude (Desktop/Code/agents like the jarvis-telegram bot) 12 browser tools for live research — navigate, snapshot, click, extract — without shipping Chrome. The `epicsagas/obscura-plugin` adds turnkey `/obscura-fetch|scrape|pipeline|crawl` slash commands with auto-installed binaries.
5. **Lead-gen / list-building scrapes** (realtor directories, public listings) where pages are JS-rendered but not fingerprint-hardened.

**Poor fits (don't use Obscura — use Playwright + real Chrome, anti-detect browsers, or official APIs):**
- **Posting to social platforms** (TikTok/IG/YouTube/Facebook uploads, logged-in actions). These platforms do pixel-level canvas fingerprinting and behavioral checks; Obscura's fake canvas is a giveaway, and media-upload flows expect a full browser. Account bans are the failure mode — route posting through official APIs or a real-browser automation stack.
- **Visual QA / screenshots** of ads or landing pages (nothing is actually rendered).
- Anything needing pixel-accurate rendering, WebGL, or video playback.

**Suggested architecture:** one Docker container (`obscura serve`) as a shared CDP endpoint for all scraping jobs + `obscura mcp` wired into the agent stack for research; keep a single Playwright/real-Chrome worker (with residential proxies) reserved for authenticated posting. Existing Puppeteer/Playwright code ports over with a one-line endpoint change.

---

## Sources
- https://github.com/h4ckf0r0day/obscura (repo, README, releases, wiki)
- https://obscura.sh/
- https://github.com/epicsagas/obscura-plugin
- https://the-agent-report.com/2026/05/obscura-rust-headless-browser-ai-agents/
- https://scrappey.com/qa/web-scraping-apis/what-is-obscura (limitations analysis)
- https://discovery.niravjoshi.dev/entry/obscura-headless-browser
- https://github.com/Sovereign-Engineering/obscuravpn-client (disambiguation)
