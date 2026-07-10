# Vercel Account Recon (2026-07-10)

## Account
- Team: **dylan-3538's projects** (`team_AIbm3UmWE0F4AcEptCNnSgFj`), single personal team — Hobby-style account.
- **43 projects** on the team (the list_projects cap is 50, so this is likely all of them).

## Projects (all 43)
logan-alpha, elevated-lp, ai-sales-team, botmo-preview, botmo, funnel-share, elevated-ai-launch-kit, geniusxai-lead-engine, geniusxai-site, portfolio, conor-realtor-optin, vsl-page, onboarding-assistant, ai-growth-scan, sales-page, presentation, client-dashboard, share-page, partner-site, _site, intake-site, cos-pack-install, gx-li-deploy, underground-optins, reel-captions, conor, sangha-warm, sangha-preview, shane-challenge-doc, iridium-deal, iridium-restoration, iridium-dental, akshaya-cost-breakdown, jarvis-os-brief, sam-alberto, joint-install-lp, akshaya, site-growfaster, content-engine, dj, toney, funnel-share-pull, underground-shane

### Sampled project detail (framework / latest deployment)
| Project | Framework | Latest deployment | Notes |
|---|---|---|---|
| conor | (none/static) | READY, production (May 2026) | domains: conor-alpha.vercel.app |
| botmo | (none/static) | READY (preview target) | botmo.vercel.app |
| ai-sales-team | (none/static) | READY, production | custom domain aisalesteam.thedylanewing.com |
| elevated-lp | (none/static) | READY, production (most recent, Jul 2026) | custom domain lp.elevatedaisolutions.com |

All sampled projects report `framework: null` (static/other deploys) and healthy READY deployments. No failed latest deployments observed in the sample.

## Vercel Blob — "maxed out" issue
Blob usage is **not readable** via the available MCP tools; check the dashboard: Vercel → Storage → (blob store) → Usage, or Team Settings → Usage.

### Hobby plan Blob limits (per Vercel docs/pricing)
- Hobby includes a small free Blob allotment (~1 GB storage and ~10 GB data transfer per month; simple operations also capped). Hobby **cannot pay for overages** — once the included allotment is exhausted, uploads are blocked until the cycle resets or you upgrade.
- Pro plan: pay-as-you-go beyond included allotment (~$0.023/GB-month storage, ~$0.050/GB transfer), plus optional Spend Management caps.

### Remediation options
1. **Delete unneeded blobs**
   - Dashboard: Storage → blob store → select files → delete.
   - CLI: `vercel blob list --limit 100` then `vercel blob del <pathname>`.
   - SDK batch delete (from Vercel docs, handles rate limits):
     use `@vercel/blob` `list()` + `del(batchUrls)` in a loop with cursor pagination and exponential backoff on `BlobServiceRateLimited` (see https://vercel.com/docs/vercel-blob/examples "Delete all blobs").
2. **Upgrade to Pro** (~$20/user/mo) — unlocks overage billing so Blob keeps working; set Spend Management limits to avoid surprises.
3. **Move media off Vercel Blob** to cheaper object storage/CDN:
   - **Cloudflare R2** — 10 GB free storage, zero egress fees; S3-compatible API.
   - **Bunny Storage + Bunny CDN** — very cheap storage (~$0.01/GB) and egress (~$0.01/GB); simple HTTP API.
   - Serve via public URLs and reference from the Vercel-hosted sites; keep Vercel Blob only for small dynamic uploads.
4. **Reduce future usage** — set long `cacheControlMaxAge` on blobs (default 1 month) so repeated reads hit the CDN cache instead of counting as blob transfer; avoid storing large videos in Blob.

Note: exact current allotment numbers should be confirmed at https://vercel.com/docs/vercel-blob/usage-and-pricing — the docs search tool did not return the pricing table directly.
