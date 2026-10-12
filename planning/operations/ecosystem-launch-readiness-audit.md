# Dax Collective — Ecosystem Launch-Readiness Audit

**Date:** 2026-06-29
**Type:** Read-only audit. No code, account, credential, deployment, asset, or registry changes were made while producing this document.
**Scope:** Shared infrastructure + all 5 brands (Dax Collective parent, Dax the Traveler, Time-Zone Travelers, Ani-Dax, God's Vessel), against the 9-criteria "operational" bar.

Owner key: **Me** = Daniel (manual/human-only action) · **Cowork** = code/file work I can do with approval · **Codex** = other coding agent already used on this repo · **n8n** = workflow/automation layer · **Manual platform** = signing up / clicking buttons on YouTube, Meta, TikTok, etc.

---

## 1. Shared Ecosystem Blockers (affect multiple brands at once)

| # | Item | File/Account Affected | Current State | Owner | Depends On | Risk | Smallest Next Action |
|---|------|------------------------|----------------|-------|------------|------|------------------------|
| S1 | **Zero social accounts exist yet** | `account-setup-checklist.md` — every checkbox is unchecked for all 5 brands × 4 platforms | Planning-only. Blueprint, bios, taglines, handle priority list are fully written, but no account has been created. | Me (manual platform creation) | Tier-1 visual assets (DC monogram, banner) per the checklist's own verdict | High — handles can be taken by someone else the longer this waits | Create The Dax Collective YouTube/IG/TikTok/FB using the existing copy in the blueprint; assets can follow |
| S2 | **No real backend contact/lead route** | `dax-backend/server.js` | Grepped for `contact\|inquiry\|lead\|mailto\|form` — zero real routes. Only route mounted is `/api` (upload routes) and a stub `/api/post/:brand` that returns `TODO` | Cowork (build), Me (approve) | Decision on contact model (single email vs. brand aliases vs. routed form) — explicitly deferred by you | Medium — visitors have no way to reach you except one hardcoded mailto link on one page | Decide the contact model; then I scaffold one route, not five |
| S3 | **`/api/post/:brand` is a stub, not a real publisher** | `dax-backend/server.js:189-203` | Returns `{success:true, used:ids}` without calling any actual YouTube/TikTok/FB/IG API. Pure placeholder. | Cowork/Codex | OAuth credentials per platform (S5) | Low *right now* (nothing depends on it yet) but blocks any future "publish from site" feature | No action needed before launch — just don't assume this button works |
| S4 | **Revenue dashboard is hardcoded fake data** | `dax-main/src/automation/RevenueTracker.jsx:48-72` | `useEffect` fires a `setTimeout` that *simulates* loading, then sets `total: 2847`, per-brand and per-source numbers — all static, not pulled from Stripe/YouTube/affiliate APIs | Cowork (eventually) | A real revenue source to read from (none exist yet — see S6) | Medium — if shown publicly or to a partner, this looks like real revenue and isn't | Add a visible "demo data" label, or hide this route until wired to something real |
| S5 | **No platform OAuth credentials configured** | `dax-backend/server.js` env block (`YOUTUBE_CLIENT_ID`, `TIKTOK_ACCESS_TOKEN`, `FACEBOOK_APP_ID`, `INSTAGRAM_APP_ID`, etc.) | Variables are *referenced* in code but `.env` contents were not read (correctly — by rule). `master-execution-checklist.md` Phase 2 lists these as open user-only blockers. | Me (manual signup), Cowork (wiring after) | S1 (accounts must exist first) | High for any automation/publishing later, zero risk today since nothing public depends on them yet | Nothing to do until S1 is done |
| S6 | **No payment/monetization integration anywhere** | Grep across `dax-main/src` for `stripe\|payment\|invoice\|checkout\|pricing` → only 3 hits, all UI copy in `GodsVesselPage.jsx`, `GrowthAccelerator.jsx`, `AggressiveAccelerator.jsx` | No Stripe, PayPal, or any checkout SDK is wired in. "Shop Now" button on God's Vessel was found but not yet confirmed to link to a real store. | Cowork + Me (Stripe/payment account) | A decision on what's actually for sale first (merch via print-on-demand? donations? affiliate only?) | Medium — can't take money yet under any brand | Confirm what God's Vessel's "Shop Now" button currently points to (quick check, no changes) |
| S7 | **Analytics exists in code but live status is unconfirmed** | `dax-main/src/utils/analytics.js` | Clean gtag-only wrapper (`initialize`, `trackPageView`, `trackDonation`, etc.) — but it's *useless* unless a real GA4 measurement ID and the gtag script tag are actually loaded somewhere (e.g. `index.html` or `_document`). Not yet confirmed. | Cowork (verify), Me (provide GA4 ID if missing) | Whether you already have a GA4 property | Low risk, high value — this is cheap to confirm | Grep `index.html` for `gtag(` script tag and a real `G-XXXXXXX` ID |
| S8 | **README.md describes a different app than what exists** | `README.md` | Still says: Vue.js stack, GitHub Pages/Netlify/Vercel hosting, built-in blog CMS at `/admin`, GitHub Actions CI/CD, and a fake clone URL `github.com/daxhack/dax-travel-site` — none of this matches the actual React + Firebase Hosting + Express backend repo | Cowork (rewrite), Me (approve) | None | Low risk publicly (README isn't customer-facing) but actively misleading for any collaborator, including future-you | Rewrite README to describe the real stack — small, safe, high-clarity win |
| S9 | **n8n automation layer is template-only / mostly inactive (by design, confirmed safe)** | `n8n/templates/*.json` (~35 files), audited already in `master-execution-checklist.md` 2026-06-03 entries | Only 2 workflows active: global error handler + a manual-review startup operator. All 40 public-upload/publish-style nodes are confirmed guarded; 0 unguarded. Public publishers (YouTube/TikTok-IG/Blog) intentionally inactive. | n8n (already correctly configured) | S1, S5 before anything here can go live | Low — this is a *good* state, not a blocker, just not yet usable for real publishing | None needed pre-launch; re-confirm guard audit before ever flipping a publisher workflow active |
| S10 | **No single source-of-truth "brand rules" doc is linked from code** | `planning/platform-setup/brand-platform-blueprint.md`, `agent-operating-model.md` | These exist and are good (bios, taglines, agent input/output contracts, review-gate statuses, "Prohibited Defaults" list), but they live only in `/planning`, disconnected from the live site | Me (no action needed yet) | — | Low | None — just keep using these as the audit's basis, which this document already does |

---

## 2. Per-Brand Blockers

### The Dax Collective (parent hub)
| Item | File | State | Owner | Risk | Next Action |
|------|------|-------|-------|------|--------------|
| Home page CTA does nothing | `Home.jsx:211-222` | "Subscribe to get Updates" button has no `onClick` — pure decoration, captures nothing | Cowork | Medium — visitors who want to follow have no path | Wire it to a real destination (Linktree, an email capture, or remove the button) once contact model (S2) is decided |
| No parent-hub social accounts | `account-setup-checklist.md` Step 1 | Not created | Me | High (see S1) | Claim @TheDaxCollective handles first per the existing priority order |
| Visual identity assets missing | `account-setup-checklist.md` Tier 1 | DC monogram + YouTube banner + FB cover not yet created — explicitly named as the only thing blocking Step 1 | Me/Canva | Medium | Create the 1000×1000 DC monogram first — unblocks everything else in Phase 1 |

### Dax the Traveler
| Item | File | State | Owner | Risk | Next Action |
|------|------|-------|-------|------|--------------|
| Most launch-ready brand page in the repo | `DaxTheTravelerPage.jsx` | Has working nav, working external YouTube links (`openExternalLink`), a newsletter modal (`showNewsletter`), and a Connect section | — | Low | Confirm the newsletter modal (`showNewsletter`) actually submits an email somewhere — not yet confirmed, may be UI-only like Home.jsx's button |
| Contact link points to unowned domain | `DaxTheTravelerPage.jsx:1001` | `mailto:hello@daxcollective.com` — flagged previously, deliberately not touched pending contact-model decision | Cowork (1-line fix once decided) | Medium — broken/wrong contact path on your most personal brand | Decide contact model (tied to S2) |
| Personal photo asset pipeline | `ASSET_REGISTRY.md` | 29 rows logged from your Drive folder, all `incoming_review`/`needs_human_review`/`pending_selection` — none approved for public/web yet | Me (pick files) + Cowork (registry update, held per your "no further registry changes" instruction) | Low | Send me the 5 filenames/IDs for the "First Public Test Shortlist" whenever you're ready — this is the one open item from before the audit started |
| Tier-2 visual assets already exist | `account-setup-checklist.md` | Profile photo, YouTube banner, logo file all listed as already in the site assets folder | Me | Low | Just upload them once the account exists (S1) |

### Time-Zone Travelers
| Item | File | State | Owner | Risk | Next Action |
|------|------|-------|-------|------|--------------|
| Page exists and pulls live data | `TimeZoneTravelersPage.jsx` | Has working video carousel controls, an external `window.open(...)` action, tab switching — functional shell | — | Low | None blocking |
| No accounts created | `account-setup-checklist.md` Step 5 | Deliberately last in sequence — needs the most original assets first | Me | Medium (lowest urgency of the 5, by design) | Leave for Phase 3 per existing plan |
| Needs the most original visual assets of any brand | `account-setup-checklist.md` Tier 4 | Clock/globe logo, banner, thumbnail templates all unbuilt | Me/Canva | Medium | Defer until Phase 1 & 2 brands are live, per existing plan — no change recommended |

### Ani-Dax
| Item | File | State | Owner | Risk | Next Action |
|------|------|-------|-------|------|--------------|
| Page exists, functional tabs/carousel | `AniDaxPage.jsx` | Working `onClick` handlers throughout, anime data loader | — | Low | None blocking |
| No mascot/avatar asset yet | `account-setup-checklist.md` Tier 3 | Called out as "biggest differentiator for the brand — invest time here," not yet created | Me/ChatGPT image or Sora | Medium | Create after Phase 1 accounts are live, per existing plan |
| No accounts created | Step 3 in sequence | Not created | Me | Medium | Second priority after Dax the Traveler, per existing plan |

### God's Vessel
| Item | File | State | Owner | Risk | Next Action |
|------|------|-------|-------|------|--------------|
| "Shop Now" button destination unconfirmed | `GodsVesselPage.jsx:229` | Button exists, found via grep, but its actual `href`/`onClick` target was not yet read this session | Cowork (verify, read-only) | Medium — this is your only brand with an explicit commerce CTA, worth confirming before any traffic arrives | Quick read of the surrounding code to confirm whether it links to a real store, a placeholder, or nothing |
| No payment processor wired (see S6) | repo-wide | Confirmed — no Stripe/checkout SDK anywhere | Me + Cowork | Medium | Decide print-on-demand vs. direct Stripe vs. simple affiliate link before promoting this CTA |
| Logo/banner assets unbuilt | `account-setup-checklist.md` Tier 3 | Cross/vessel logo, banner, scripture-template not yet created | Me/Canva | Medium | Defer to Phase 2, per existing plan |
| No accounts created | Step 4 in sequence | Not created | Me | Medium | Third priority, per existing plan |

---

## 3. Required Before the Entire Ecosystem Can Be Called "Public-Ready"

These are the items that block calling the *system* (not any one brand) operational:

1. **S1** — at minimum The Dax Collective + Dax the Traveler accounts exist (Phase 1 of the existing account-setup plan).
2. **S2** — a decided, working contact path (even one inbox is enough to start).
3. Fix the dead "Subscribe" button on `Home.jsx` (decoration with no function is worse than no button).
4. **S8** — rewrite `README.md` so it accurately describes the real stack (low effort, removes confusion for any future collaborator or AI agent working in this repo).
5. Confirm `GodsVesselPage.jsx`'s "Shop Now" button isn't pointing visitors at a dead link.
6. Confirm GA4/gtag is actually loaded (S7) — five-minute check, makes every later growth decision data-backed instead of guesswork.

## 4. Can Be Completed After Public Launch

- Real payment/checkout integration (S6) — launch can start on content/audience-building before money changes hands.
- OAuth-based auto-publishing (S3, S5) — manual posting works fine at launch volume.
- Revenue dashboard wired to real data (S4) — fine as a labeled mockup until there's real revenue to show.
- Time-Zone Travelers and God's Vessel social accounts and asset builds — already correctly sequenced for later phases.
- Ani-Dax mascot/avatar creation.

## 5. Later Improvements

- n8n publisher workflows flipped active, one platform at a time, only after manual posting proves the content cadence works.
- Brand-specific contact aliases (vs. one shared inbox) once volume justifies it.
- Cross-brand analytics rollup dashboard backed by real GA4 + revenue data.
- CI/CD pipeline that matches what `README.md` currently (incorrectly) claims already exists.

---

## Master Launch Queue (ordered)

| Order | Task | Why it's here | Owner |
|-------|------|----------------|-------|
| 1 | Decide the contact model (single email / brand aliases / routed form) | Unblocks S2, the Home.jsx fix, and the Dax the Traveler mailto fix all at once | Me (decision), Cowork (build after) |
| 2 | Create DC monogram + YouTube banner for The Dax Collective | Explicitly the only blocker named in `account-setup-checklist.md` before any account creation | Me/Canva |
| 3 | Claim The Dax Collective accounts (YouTube → Instagram → TikTok → Facebook) | Parent hub must exist before sub-brand bios can link to it | Me |
| 4 | Claim Dax the Traveler accounts | Most launch-ready brand, existing assets, highest personal equity | Me |
| 5 | Fix Home.jsx "Subscribe" button + Dax the Traveler mailto link | Both depend on item 1's decision; both are visible, embarrassing gaps once traffic shows up | Cowork |
| 6 | Rewrite README.md to match the real stack | Cheap, safe, removes ongoing confusion | Cowork |
| 7 | Confirm GA4/gtag is actually live | Five-minute check; everything after this point should be measured | Cowork (verify) |
| 8 | Confirm God's Vessel "Shop Now" destination | Only live commerce CTA in the ecosystem — must not be silently broken | Cowork (verify) |
| 9 | Send the 5 file picks for the Dax the Traveler "First Public Test Shortlist" | Last open item from the asset-pipeline work, independent of everything else, can happen anytime | Me |
| 10 | Ani-Dax + God's Vessel account creation and asset builds (Phases 2 of existing plan) | Already correctly sequenced after Phase 1 | Me/Canva |
| 11 | Time-Zone Travelers accounts + assets (Phase 3 of existing plan) | Needs the most original assets — correctly last | Me/Canva |
| 12 | Decide monetization path for God's Vessel (Stripe vs. POD vs. affiliate) | Only after there's an audience to sell to | Me |
| 13 | Wire RevenueTracker.jsx to a real data source, or label it clearly as a demo | Avoid presenting fake numbers as real once anyone outside you sees the dashboard | Cowork |
| 14 | OAuth credentials + real `/api/post/:brand` implementation | Only worth doing once manual posting cadence is proven | Me + Cowork |
| 15 | Activate first n8n publisher workflow, one platform, one brand, manual-review-gated | Last step — automation after the manual system works, per your own framing | n8n + Me approval |

---

*No files, accounts, credentials, workflows, or registry entries were changed in the course of producing this audit.*
