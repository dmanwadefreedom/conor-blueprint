# Conor Funnel Fix Sheet

Funnel: Meta ads > VSL > booking page (logan-alpha-vert.vercel.app) > GHL calendar > sales call. One-call-close + same-call onboarding. Compiled 7/10/26 from team chat + research below.

---

## 1) TL;DR Fixes

1. **Standardize every surface to "30 minute call."** 30 min is validated by 2025-26 benchmarks (Section 2). Today the funnel says 15 (landing page), 20 (pre-call email), 60 (1-hr SMS), 30 (calendar). Kill the mismatch with the checklist in Section 3.
2. **Set GHL calendar: 30 min duration + 30 min post-buffer + 60 min slot interval.** One prospect per hour: 30 to close, 30 to onboard/reset (Section 6).
3. **Build the 8-stage GHL opportunity pipeline** with automations wired to appointment status changes (Section 4).
4. **Meta verification: make the Business Manager legal name match the documents exactly, verify with a real carrier phone line, and move the landing page to a custom domain** so domain verification is available as a fallback (Section 5).
5. **Clear the API block before re-running ads:** remove the dead integration app in Business Integrations, check Account Quality + Business Support Home for the restriction, Request Review, then reconnect GHL (LeadConnector) fresh (Section 5c).

---

## 2) Call Length: 30 Minutes. Confirmed.

**Recommendation: 30 minutes, everywhere.** Logan's instinct is right. The research validates it rather than beating it.

Evidence:

- **30 min is the 2026 benchmark for this deal size.** Prospeo's 2026 benchmarks put mid-market discovery/sales calls at 30 minutes and warn that under 30 min there is not enough time to surface pain and impact. Prospect engagement measurably drops at the ~47 minute mark, so 60 min slots overshoot. ([Prospeo](https://prospeo.io/s/how-long-should-a-sales-call-be))
- **Call length scales with deal size, and $2k is small.** Focus Digital's 2025 data: a $25K deal averages 48-minute calls across 7+ calls. A $2k pay-per-appointment offer closed in one call does not justify a 60 min slot. Same dataset: calls of 30+ minutes succeed at ~5.8x the rate of sub-5-minute conversations, so 15 min is too short to close. ([Focus Digital](https://focus-digital.co/average-sales-call-time/))
- **One-call-close favors pricing early inside a tight window.** Gong's research on first-call length and closing behavior shows win rates run ~10% higher when pricing is discussed on the first call; a 30 min frame forces the pitch and the ask into one sitting instead of drifting into a second call. ([Gong](https://www.gong.io/blog/how-long-your-first-sales-call-should-be), [Gong sales stats](https://www.gong.io/blog/sales-stats))
- **VSL funnel benchmarks assume a 30-45 min close call.** High-ticket VSL appointment funnels benchmark call-to-close at 10-25% with 30-60 min calls as standard; at the $2k end of "high ticket," the short end of that range is correct. ([Coachmatic](https://www.coachmatic.app/post/what-is-a-high-ticket-vsl-video-sales-letter-appointment-funnel))

Why not 15 or 60:

- **15 min** (current landing page) attracts bookings but cannot hold discovery + pitch + close for $2k. Calls will run long and cascade into the next slot.
- **60 min** (current SMS) halves calendar capacity, raises perceived commitment (worse show rates), and runs past the 47 min disengagement cliff.
- **30 + 30 buffer** gives Logan a de facto 60 min block per prospect: 30 to close, 30 for onboarding overflow, notes, and reset. Best of both.

---

## 3) Consistency Checklist: Every Surface, Exact Copy

Update all of these in one sitting. Standard phrase: **"quick 30 minute call"**. No em dashes in any client-facing copy.

| # | Surface | Where to change it | Currently says | Paste this copy |
|---|---------|-------------------|----------------|-----------------|
| 1 | Landing page hero + CTA | logan-alpha-vert.vercel.app repo, redeploy on Vercel | 15 min | "Book your quick 30 minute call with Logan" |
| 2 | Landing page sub-copy | Same page, under CTA | 15 min | "Pick a time below. It is a quick 30 minute call, no pressure, and you will leave with a clear plan either way." |
| 3 | GHL calendar slot + buffer | GHL > Calendars > Calendar Settings > [sales calendar] > Availability | 30 min slot, no buffer | Duration 30 min, Post-buffer 30 min, Slot interval 60 min (Section 6) |
| 4 | GHL booking page description | Same calendar > Meeting Details > Description | (verify) | "This is a quick 30 minute call to walk through your goals and see if we are a fit. Please be at a computer with your calendar handy." |
| 5 | Confirmation email | GHL > Automation > booking confirmation workflow > email step | (verify) | Subject: "You are confirmed: your 30 minute call with Logan" Body lead: "You are booked for a quick 30 minute call on {{appointment.start_date}} at {{appointment.start_time}}. Join here: {{appointment.meeting_location}}" |
| 6 | Pre-call email (currently the "20 min" one) | GHL > Automation > reminder workflow > 24-hr email step | 20 min | "Your quick 30 minute call with Logan is tomorrow at {{appointment.start_time}}. Block the full 30 minutes so we can build your plan in one sitting. Need to move it? Reschedule here: {{appointment.reschedule_link}}" |
| 7 | 1-hour reminder SMS | GHL > Automation > reminder workflow > SMS step | 60 min | "Hi {{contact.first_name}}, your 30 minute call with Logan starts in 1 hour. Join here: {{appointment.meeting_location}} Reply R if you need to reschedule." |
| 8 | 10-min reminder SMS (add if missing) | Same workflow, new SMS step | n/a | "Starting in 10 minutes. Grab a quiet spot, here is your link: {{appointment.meeting_location}}" |
| 9 | VSL script / on-screen text (if it states a length) | VSL video + captions | (verify) | "...book a quick 30 minute call using the calendar below..." |
| 10 | Thank-you / post-booking page | Funnel step after calendar | (verify) | "You are all set. Your quick 30 minute call is booked. Watch your email and texts for the details." |

Sweep rule: search the GHL account (workflows, email templates, SMS templates, funnel pages) for "15 min", "20 min", "60 min", "hour long", "1 hour" and replace with the copy above. Then book a live test appointment and read every message that fires.

---

## 4) GHL Opportunity Pipeline: 8 Stages

Create in GHL > Opportunities > Pipelines > + Add Pipeline ("Realtor Sales Pipeline"). Stages in pipeline order:

| Order | Stage | Definition (1 line) | Automation trigger suggestions |
|-------|-------|--------------------|-------------------------------|
| 1 | **Lead Form** | Submitted the form / opted in from the VSL page but has not booked | Trigger: form submitted > create opportunity here + speed-to-lead SMS with booking link within 5 min; 4-touch no-book nudge over 3 days |
| 2 | **Booked Call** | Appointment on the calendar, confirmed | Trigger: appointment status = confirmed > move here; start confirmation email + reminder sequence (24-hr email, 1-hr SMS, 10-min SMS from Section 3) |
| 3 | **Needs to Reschedule** | Prospect asked to move the call (reply "R", cancel-with-reschedule intent) | Trigger: inbound SMS contains "R"/"reschedule" or appointment cancelled by contact > send reschedule link immediately, then 3-touch over 5 days; on rebook > back to Booked Call |
| 4 | **No Show** | Call time passed, prospect never joined | Trigger: appointment status = no-show > SMS within 10 min ("we missed you, grab a new time: {{link}}"), email same day, call task for Logan next morning; no response in 7 days > move to Lost |
| 5 | **Cancellation** | Prospect cancelled and did not rebook | Trigger: appointment cancelled without rebook > 2-touch win-back (day 1 SMS, day 3 email with booking link); no rebook in 14 days > Lost |
| 6 | **Follow Up** | Took the call, did not close on the call, still live | Trigger: manual move by Logan post-call > send recap email template + task with next-touch date; 5-touch sequence over 14 days; stalled 21 days > Lost |
| 7 | **Closed** | Paid / signed, now a client | Trigger: payment received or manual move > stop all sales automations, fire onboarding email + intake form, notify fulfillment channel |
| 8 | **Lost** | Dead: not a fit, ghosted out of sequences, or said no | Trigger: manual move or auto-move from stages 4-6 > stop sequences, tag "lost-{reason}", drop into long-term monthly nurture + Meta retargeting audience |

Notes:
- Wire stage moves off **appointment status changes** (Workflow trigger: "Appointment Status") so the pipeline maintains itself; only Follow Up / Closed / Lost need human moves.
- Track conversion between stage 1 > 2 (booking rate) and 2 > 7 (close rate) weekly; those are the two numbers that price the $2k pay-per-appointment offer.

---

## 5) Meta: Verification Failures + API Block

### 5a) Likely causes, ranked for a solo realtor

1. **Business name mismatch (most common).** The Business Manager name is a brand/display name ("Conor X Realty") while documents show his legal personal name or a differently punctuated LLC. Meta matches exactly, including "LLC"/"Inc", punctuation, and spacing. ([Meta: Troubleshoot verification](https://www.facebook.com/business/help/2342133782492969), [Whizz Experts](https://whizz-experts.com/support/account-access-help/facebook-business-manager-verification-rejected/))
2. **No single document carries all required fields.** Meta wants legal name + address (or phone) visible together. Tax letters often omit address; utility bills omit the entity name. Solo realtors frequently have nothing but a personal utility bill. ([Meta: Verify your business](https://www.facebook.com/business/help/2058515294227817))
3. **Phone verification failing on a VoIP/unlisted number.** Google Voice and app-based numbers get rejected; the number must be a real carrier line, ideally one that appears on a document or public listing. ([Meta docs via Vonage](https://api.support.vonage.com/hc/en-us/articles/4404796719764-How-to-Resolve-Issues-with-Meta-Business-Verification))
4. **No verifiable web presence / domain.** The landing page lives on a Vercel subdomain (logan-alpha-vert.vercel.app). Conor cannot domain-verify a subdomain he does not own, and Meta cross-checks the business against its website. This also blocks the email-at-verified-domain method.
5. **Address mismatch.** Home address in Business Settings vs brokerage address on documents (or vice versa).
6. **Existing flags on the account.** The unresolved API block / prior integration issue can keep automated verification checks failing regardless of documents.

### 5b) Fix path, in order

1. **Open Security Center:** business.facebook.com > Settings > Security Center > Business verification > Start/Continue. This shows current status and exactly what Meta rejected. ([Meta](https://www.facebook.com/business/help/2058515294227817))
2. **Fix the name first.** Business Settings > Business Info: set the legal name character-for-character to what the strongest document says. If Conor is a sole proprietor with no entity, use his legal personal name and sole-prop documents rather than the brand name.
3. **Pick two strong documents.** Best pairs for a solo realtor: (a) business license or LLC formation doc / IRS EIN letter CP 575 for legal name, plus (b) a utility bill, bank statement, or phone bill showing the same name + address. If one doc covers name + address + phone, use it alone. Documents must be current (issued within ~12 months where dated). ([Whizz Experts](https://whizz-experts.com/support/account-access-help/facebook-business-manager-verification-rejected/))
4. **Phone verification, both lines.** Add both business numbers in Business Info. Attempt verification (SMS or call) on the primary carrier line; if the code fails or the line is rejected, rerun verification and select the second line. Do not use VoIP numbers. At least one line should appear on a submitted document or a public listing (Google Business Profile, brokerage page).
5. **Domain verification fallback.** If email/phone both fail, Meta offers domain verification (upload an HTML file or add a DNS TXT record). **Action: buy a real domain now** (e.g. loganrealty.com), point the Vercel project at it, and verify it in Business Settings > Brand Safety > Domains. This fixes verification, ad-account trust, and landing-page credibility in one move.
6. **Resubmit and wait; do not spam.** Reviews typically complete within ~48 hours. If rejected again, follow the specific rejection reason in Security Center and resubmit corrected docs; repeated back-to-back attempts can lock the flow, and re-appeals of the same decision generally require ~30 days. Documents must be submitted within 180 days of a restriction. ([Meta: Request a review](https://www.facebook.com/business/help/530209463124901), [Chakra: request review walkthrough](https://chakrahq.com/article/how-to-request-a-review-in-meta-business-support/))

### 5c) API block: diagnose and clear

The prior API integration attempt most likely left either (a) a stale app authorization with broken tokens, or (b) an actual restriction flag on the ad account. Work through in order:

1. **See what Meta thinks is wrong.** Check facebook.com/accountquality and business.facebook.com/business-support-home with Conor's profile. Any restriction on the ad account or Business Manager shows here with a "Request review" option under "What you can do". ([Meta: Troubleshoot disabled/restricted account](https://www.facebook.com/business/help/422289316306981))
2. **Remove the dead integration.** Personal profile: Settings & Privacy > Settings > Apps and Websites, and Business Integrations: remove the old integration app entirely. In Business Manager: Settings > Integrations / Connected apps > remove the stale app there too.
3. **Decode the error if one is still thrown.** Error 190 = expired/invalid token (reconnect fixes it). Error 200/294 = missing ads_management / ads_read permission (re-auth with all toggles on). Error 368 = temporary policy/rate block, wait it out then Request review. ([Meta error handling docs](https://developers.facebook.com/docs/graph-api/guides/error-handling/))
4. **If Conor owns a developer app** (from the DIY API attempt): developers.facebook.com > the app > check for policy violation banners and App Review status. If the app is restricted, either fix and appeal or delete the app; a restricted app tied to the ad account can keep tripping blocks.
5. **Request review on the ad account.** Business Support Home > select the ad account > Request review > complete on-screen steps. Typical turnaround ~48 hours. One clean appeal, not repeated ones. ([Meta](https://www.facebook.com/business/help/530209463124901))
6. **Reconnect GHL cleanly.** After the block clears: GHL sub-account > Settings > Integrations > disconnect Facebook, reconnect via LeadConnector granting ALL permission toggles, then run Integrations > Facebook card > Troubleshoot > Missing permissions to confirm zero gaps. ([GHL FB troubleshooting](https://help.gohighlevel.com/support/solutions/articles/48000981698-facebook-troubleshooting-integration-issues))
7. **Sequence matters:** finish business verification (5b) before the review request if possible; a verified business dramatically improves both restriction reviews and API access tiers.

---

## 6) GHL Calendar: 30-Min Slots + 30-Min Buffer

GHL > Calendars > Calendar Settings > [sales calendar] > **Availability** tab:

| Setting | Value | Why |
|---------|-------|-----|
| Meeting duration | 30 min | The standard (Section 2) |
| Post-buffer (Buffer Duration After Appointment) | 30 min | One-call-close overflow: onboarding, payment, notes |
| Pre-buffer | 0 min (or 5 if Logan wants prep) | Keep hourly rhythm clean |
| Slot interval | 60 min | Slots at 9:00, 10:00, 11:00; prevents 9:30 bookings that ignore the buffer |
| Max bookings per day | Set to Logan's real ceiling (e.g. 6) | Protects energy for one-call-closes |
| Minimum scheduling notice | 2-4 hours | Stops bookings Logan cannot confirm |

Result: a 10:00 booking blocks 10:00-11:00; next available slot is 11:00. If the close runs long, onboarding happens inside the buffer instead of eating the next call.

Notes:
- Buffer settings apply to the whole calendar. If Logan later adds a short "reschedule" or "follow up" call type, make it a **separate calendar** with its own duration/buffer. ([GHL: Calendar availability settings](https://help.gohighlevel.com/support/solutions/articles/48001155718-adjusting-availability-settings-for-individual-calendars))
- After saving, load the public booking page and confirm slots render hourly and the page description says "quick 30 minute call" (Section 3, row 4).
- Re-run one end-to-end test booking after every settings change; GHL caches availability and copy in odd places.

---

## Sources

- Prospeo, How Long Should a Sales Call Be? 2026 Benchmarks: https://prospeo.io/s/how-long-should-a-sales-call-be
- Focus Digital, Average Sales Call Time: 2025 Benchmarks: https://focus-digital.co/average-sales-call-time/
- Gong Labs, The Optimal Length for Your First Sales Call: https://www.gong.io/blog/how-long-your-first-sales-call-should-be
- Gong, 30 Mind-Blowing Sales Stats: https://www.gong.io/blog/sales-stats
- Coachmatic, High-Ticket VSL Appointment Funnels: https://www.coachmatic.app/post/what-is-a-high-ticket-vsl-video-sales-letter-appointment-funnel
- Meta, Verify Your Business in Meta Business Suite: https://www.facebook.com/business/help/2058515294227817
- Meta, Troubleshoot why your business can't be verified: https://www.facebook.com/business/help/2342133782492969
- Meta, Request a review if you are restricted: https://www.facebook.com/business/help/530209463124901
- Meta, Troubleshoot a Disabled or Restricted Account: https://www.facebook.com/business/help/422289316306981
- Meta for Developers, Graph API Error Handling: https://developers.facebook.com/docs/graph-api/guides/error-handling/
- HighLevel, How to Verify Your Business on Meta: https://help.gohighlevel.com/support/solutions/articles/155000004823-how-to-verify-your-business-on-meta
- HighLevel, Facebook Troubleshooting, Integration Issues: https://help.gohighlevel.com/support/solutions/articles/48000981698-facebook-troubleshooting-integration-issues
- HighLevel, Calendar Availability Settings: https://help.gohighlevel.com/support/solutions/articles/48001155718-adjusting-availability-settings-for-individual-calendars
- Whizz Experts, FB Business Verification Rejected: https://whizz-experts.com/support/account-access-help/facebook-business-manager-verification-rejected/
- Vonage, Resolving Meta Business Verification Issues: https://api.support.vonage.com/hc/en-us/articles/4404796719764-How-to-Resolve-Issues-with-Meta-Business-Verification
