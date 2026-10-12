# Dax Collective — Master Launch Execution Board (Corrected)

**Date:** 2026-06-29
**Confirmed operating standard:** All 5 brands become publicly operational in the *same* launch window. No parent-first/sub-brands-later sequencing. Posting frequency and revenue focus can differ after launch — public-shell completeness cannot.
**Status:** Presentation only. No accounts, files, credentials, or workflows have been changed.

**Corrections applied this pass (your review caught these):**
1. The Dax Collective is a direct service-revenue brand, not aggregation-only.
2. Ani-Dax banner/channel art must never use official anime key art, screenshots, or character renders — original art/typography only.
3. Cross-linking rule sharpened: claim all accounts now, but no brand gets publicly linked from the parent hub until it has profile art + bio + CTA + working contact route + **at least 3 ready-to-post drafts**.
4. God's Vessel "Shop Now" gets replaced with an honest waitlist/email-capture CTA, not a placeholder pretending a shop exists.
5. Contact model simplified and confirmed: one shared Gmail inbox + one routed dropdown form. No fake-domain email, no aliases yet.

Corrections carried over from the prior pass:
- **GA4 is already live** — real measurement ID `G-KVXQJ21CZW` wired in `dax-main/public/index.html:25-30`. Not a blocker.
- **Three dead CTAs confirmed:** Home.jsx "Subscribe" button (no `onClick`), Dax the Traveler newsletter `<form>` (no `onSubmit`), God's Vessel "Shop Now" button (no `onClick`/`href` at all).

Owner key: **Me** = Daniel (manual/human-only) · **Cowork** = code work with my approval · **Codex** = other coding agent already used on this repo · **n8n** = workflow layer · **Manual platform** = signing up/configuring directly on YouTube, Meta, TikTok.

Planned platform map (from `brand-platform-blueprint.md`, not re-litigated): every brand gets YouTube + TikTok + Instagram + Facebook Page, all eventually linking to The Dax Collective parent hub — but per your instruction, **accounts can be created without being publicly cross-linked until each brand is fully branded and complete.**

---

## Phase 1 — Shared Public Backbone

Everything here is cross-brand infrastructure. Build once, every brand depends on it.

| # | Task | Affected | Owner | Dependency | Approval Needed | Critical? | Definition of Done |
|---|------|----------|-------|------------|-------------------|-----------|----------------------|
| 1.1 | Contact model — **confirmed:** one shared Gmail inbox `therollodaxcollective@gmail.com` (display name "The Dax Collective") + one website form with an inquiry-type dropdown (General / Dax Collective Services / Dax the Traveler-UGC / Time-Zone Travelers / God's Vessel / Ani-Dax), all routing to that one inbox | Decision — done | Me | None | N/A | Critical | Decided. No aliases, no fake-domain email, no domain purchase yet. |
| 1.2 | Build the shared contact form + backend route per 1.1 | New `ContactForm` component + `dax-backend/server.js` (new `/api/contact` route) | Cowork | 1.1 (done) | Yes | Critical | Submitting the real form sends an email/notification that lands in `therollodaxcollective@gmail.com` |
| 1.3 | Fix Home.jsx dead "Subscribe" button | `Home.jsx:211-222` | Cowork | 1.2 | Yes | Critical | Button opens/links to the same contact form (General inquiry) instead of doing nothing |
| 1.4 | Fix Dax the Traveler newsletter form | `DaxTheTravelerPage.jsx:411-425` | Cowork | 1.2 | Yes | Critical | Submitting sends to the same route, pre-filled to "Dax the Traveler / UGC" |
| 1.5 | Replace Dax the Traveler `mailto:hello@daxcollective.com` | `DaxTheTravelerPage.jsx:1001` | Cowork | 1.2 | Yes | Critical | Button opens the contact form pre-filled to "Dax the Traveler / UGC," not a mailto on a domain you don't own |
| 1.6 | Rewrite README.md to match real stack | `README.md` | Cowork | None | Yes | Post-launch | Accurately states React + Firebase Hosting + Express, real repo URL |
| 1.7 | Label or hide fake RevenueTracker numbers | `RevenueTracker.jsx:48-72` | Cowork | None | Yes | Critical if route is public-facing | Page says "demo data" or is pulled from public routes |
| 1.8 | Re-confirm n8n publish guards still hold | `n8n/templates/*.json` | n8n/Me | None | No — read-only | Critical (gate, not build) | 0 unguarded publish nodes, same as 2026-06-03 audit |
| 1.9 | Cross-link rule, sharpened | This board | — | Phase 2 completion per brand | No | Critical | No brand is publicly linked from/to the parent hub until it has: profile art + bio + CTA + working contact route + **at least 3 ready-to-post drafts**. All accounts can still be *claimed* immediately — this only gates the public linking. |

---

## Backend Hosting & Firebase Plan Decision (2026-06-29)

**Decision, confirmed:**
- Firebase stays on the **Spark plan** for the duration of the public-shell build (Phase 1-5 of this board). Confirmed via Firebase Console: Spark plan, zero Functions deployed.
- **Cloud Functions migration is deferred** until the website/contact system is built and ready for a deliberate, single Blaze deployment — not done incrementally or by accident.
- No Gmail App Password, no Firebase secrets, no billing plan change, no backend deploy happens before that deliberate migration step.

**Narrow public API boundary, locked in now for whenever migration happens:**

| Allowed in first Functions deployment | Explicitly excluded from first deployment |
|---|---|
| `/api/health` | All Drive upload/profile routes (`uploadApi.js`) |
| `/api/contact` | `/api/post/:brand` |
| `/api/subscribe` | YouTube, Meta, TikTok, OAuth, publisher, or legacy routes |
| | Any route that touches Google Drive or social-platform credentials |

**Why this exists:** the Backend Source-of-Truth audit (2026-06-29) found `dax-backend/server.js` mixes a real, credential-bearing Drive-upload feature with a dead `/api/post/:brand` stub and ~30 unused/dead env vars, and found two separate dormant Functions codebases (`functions/`, `dax-main/functions/`) already sitting in the repo unconnected to anything live. The first real Functions deployment must not casually drag all of that along — see the read-only design note `planning/operations/backend-route-separation-design-note.md` for the proposed split.

**Still untouched, pending that future migration:** `dax-backend/server.js`, `dax-backend/routes/uploadApi.js`, `functions/`, `dax-main/functions/`, `firebase.json`, `.firebaserc`, `firestore.rules`.

---

## Phase 2 — All-Brand Public Shell Sprint (all 5 brands, same window)

Every brand below is worked in parallel — not sequenced. Each needs the same 11 elements: handle, avatar/logo, banner/channel art (where the platform supports it), bio, CTA, correct links, contact route tie-in, landing page/website presence, starter content bank (sized in Phase 3), monetization-path statement (Phase 4), asset source + analytics location.

### 2.A — The Dax Collective (parent hub)
| Element | Source/Spec | Owner | Approval | Status needed before linking publicly |
|---|---|---|---|---|
| Handles | @TheDaxCollective (YT/IG/TikTok), /TheDaxCollective (FB) — blueprint p.27-34 | Me (manual platform) | No | Reserved on all 4 |
| Avatar/logo | DC monogram, 1000×1000, blue→purple→pink gradient | Me/Canva | No | File exists |
| Banner | 2560×1440 YouTube + 820×312 FB cover | Me/Canva | No | Files exist |
| Bio | Pre-written, blueprint p.40-72 | Me (paste) | No | Pasted on all 4 |
| CTA | "Explore all brands" / link-in-bio | Me | No | Set |
| Correct links | Links to all 4 sub-brands (added only once each sub-brand is complete, per 1.9) | Me | No | Deferred per 1.9 |
| Landing page | `Home.jsx` (exists, functional) | — | — | Already live |
| Contact route | Routes through 1.2, "Dax Collective Services" as default dropdown value on this brand's page | Cowork | Yes | Tied in |
| Analytics location | GA4 `G-KVXQJ21CZW`, `trackPageView`/`trackBrandVisit` in `analytics.js` | Cowork (verify) | No | Confirmed firing |
| **Monetization (corrected)** | **Direct service-revenue brand, not aggregation-only:** AI-assisted content systems, brand/account setup, simple websites, creator operations, and workflow automation for creators and small businesses | Me | None | No | This is the parent hub's own revenue lane, in addition to its cross-promotion role |

### 2.B — Dax the Traveler
| Element | Source/Spec | Owner | Approval | Status needed before linking publicly |
|---|---|---|---|---|
| Handles | @DaxTheTraveler (YT), @daxthetraveler (IG/TikTok), /DaxTheTraveler (FB) | Me | No | Reserved |
| Avatar/logo | Existing Cuba smiling photo (site assets folder) | Me | No | Confirmed usable |
| Banner | Existing FB Adventures.jpg | Me | No | Confirmed usable |
| Bio | Pre-written, blueprint p.177-208 | Me | No | Pasted |
| CTA | "Subscribe and come with me" | Cowork (page CTA fix, 1.4) | Yes | Functional |
| Correct links | YouTube link in IG/FB; site link in YouTube About | Me | No | Set |
| Landing page | `DaxTheTravelerPage.jsx` (exists, functional) | — | — | Already live |
| Contact route | `mailto` fix (1.5) | Cowork | Yes | Fixed |
| Analytics location | Same GA4 property, brand-tagged events | Cowork (verify) | No | Confirmed |

### 2.C — Time-Zone Travelers
| Element | Source/Spec | Owner | Approval | Status needed before linking publicly |
|---|---|---|---|---|
| Handles | @TimeZoneTravelers (YT), @timezonetravelers (IG/TikTok), /TimeZoneTravelers (FB) | Me | No | Reserved now, in this sprint — not deferred |
| Avatar/logo | Clock/globe icon, orange-red gradient — does not exist yet | Me/Canva | No | File must be created in this phase |
| Banner | World map w/ timezone lines, 2560×1440 | Me/Canva | No | File must be created |
| Bio | Pre-written, blueprint p.305-336 | Me | No | Pasted |
| CTA | "Travel smarter, not harder" + challenge link | Cowork | Yes | Functional |
| Correct links | Site + IG/YT cross-links | Me | No | Set |
| Landing page | `TimeZoneTravelersPage.jsx` (exists, functional) | — | — | Already live |
| Contact route | Routes through 1.2 | Cowork | Yes | Tied in |
| Analytics location | Same GA4 property | Cowork (verify) | No | Confirmed |

### 2.D — Ani-Dax
| Element | Source/Spec | Owner | Approval | Status needed before linking publicly |
|---|---|---|---|---|
| Handles | @AniDax (YT/IG/TikTok), /AniDax (FB) | Me | No | Reserved |
| Avatar/logo | Original Ani-Dax mascot/avatar — does not exist yet, flagged as "biggest differentiator" | Me/ChatGPT image or Sora | No | File must be created in this phase |
| Banner | **Corrected:** original graphic design only — your own mascot/avatar art, original typography, abstract anime-inspired shapes, original blue/purple visual effects. **No official key art, no screenshots, no character renders, no unlicensed art of any kind** — being easy to find doesn't mean you have commercial display rights | Me/Canva | No | File must be created from 100% original art |
| Bio | Pre-written, blueprint p.431-463 | Me | No | Pasted |
| CTA | "Subscribe and argue with me" | Cowork | Yes | Functional |
| Correct links | Site + cross-links | Me | No | Set |
| Landing page | `AniDaxPage.jsx` (exists, functional) | — | — | Already live |
| Contact route | Routes through 1.2 | Cowork | Yes | Tied in |
| Analytics location | Same GA4 property | Cowork (verify) | No | Confirmed |

### 2.E — God's Vessel
| Element | Source/Spec | Owner | Approval | Status needed before linking publicly |
|---|---|---|---|---|
| Handles | @GodsVessel (YT), @godsvesselofficial (IG/TikTok), /GodsVessel (FB) | Me | No | Reserved |
| Avatar/logo | Cross/vessel/light "GV" icon — does not exist yet | Me/Canva | No | File must be created in this phase |
| Banner | Purple/indigo, light-ray motif | Me/Canva | No | File must be created |
| Bio | Pre-written, blueprint p.560-593 | Me | No | Pasted |
| CTA | **Corrected:** replace dead "Shop Now" with an honest waitlist/email-capture CTA — e.g. "Get Encouragement," "Join the Early List," or "Free Reflection Guide Coming Soon" (see Phase 4.4) | Cowork | Yes | Functional, routes to the contact form's God's Vessel dropdown value, captures interest instead of pretending a shop exists |
| Correct links | Site + cross-links | Me | No | Set |
| Landing page | `GodsVesselPage.jsx` (exists, functional) | — | — | Already live |
| Contact route | Routes through 1.2 | Cowork | Yes | Tied in |
| Analytics location | Same GA4 property | Cowork (verify) | No | Confirmed |

**Key change from the prior version of this board:** Time-Zone Travelers and God's Vessel account *reservation*, branding, and bio work happen in this same sprint, alongside the other three — not in a deferred "Phase 3." The only thing actually deferred is the *public cross-linking* between brands, which waits until each brand's row above is fully green (per 1.9).

---

## Minimum Public-Ready Launch Standard (2026-06-29)

Applies to every brand before it is publicly linked, cross-promoted, or actively promoted. Prevents five beautiful unfinished websites — a brand can be simple and still pass; it cannot be dishonest or broken and pass.

**Required before public promotion:**
- Approved avatar/profile visual and banner/channel art
- Accurate brand name, one-line positioning, bio, and primary CTA
- One real, working destination for the CTA — or a clearly labeled "coming soon" state
- No dead buttons, broken links, fake stats, fake testimonials, fabricated follower counts, or placeholders presented as real
- Minimum 3 ready-to-post drafts or approved content pieces per brand
- Documented asset/rights rule for that brand
- Mobile usability check
- Documented manual approval owner before anything posts or changes publicly

**Not required before first public launch:**
- Advanced custom motion
- Full automation
- Complex email funnel
- Large content library
- Paid ads
- Custom backend migration
- Complete monetization setup
- Every possible social platform or secondary landing page

**Rule:** A public shell must look intentional and usable, not agency-perfect.

---

## Website Modernization Workstream (2026-06-29)

**Status: Planning only.** No code edited, no assets created, no Firebase touched. Based on a full read of all five page files: `Home.jsx` (230 lines), `DaxTheTravelerPage.jsx` (1017 lines), `TimeZoneTravelersPage.jsx` (531 lines), `GodsVesselPage.jsx` (347 lines, quality benchmark), `AniDaxPage.jsx` (724 lines).

**Design rule carried through every recommendation below:** shared Dax Collective quality bar — modern, polished, mobile-first, clear CTA, strong visuals, not cluttered — applied with each brand's own layout, colors, imagery, motion, and content style. God's Vessel is the benchmark for *quality and motion polish*, not a template to copy.

### A. Shared design-system recommendation

One shared layer underneath all five brand-specific designs, so nothing has to be redone brand-by-brand later:

| Shared element | Recommendation |
|---|---|
| Motion vocabulary | Keep the existing Framer Motion grammar already used everywhere (`initial`/`animate`/`whileInView` fade-up entrances, `whileHover`/`whileTap` button micro-interactions). Standardize timing: `duration: 0.6-0.8` for section entrances, `viewport={{ once: true }}` on every `whileInView` so animations don't re-trigger on scroll-back. Don't introduce a new animation library. |
| Card system | One shared card primitive: `bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50`, hover border color is the only thing that changes per brand (blue for Dax Collective/Traveler, orange for Time-Zone Travelers, purple/pink for Ani-Dax, purple/indigo for God's Vessel). |
| Typography scale | Standardize hero H1 at `text-5xl md:text-7xl font-bold`, section H2 at `text-4xl md:text-5xl font-bold`, body at `text-lg`/`text-xl text-gray-300`. Currently inconsistent (Ani-Dax hero is `text-6xl md:text-8xl`, others vary). |
| CTA pattern | Every primary CTA is a real action with an `onClick`/`onSubmit`/`href` — no exceptions. Primary CTA = brand-gradient pill button; secondary CTA = `bg-white/10 backdrop-blur-sm border` outline button. This single rule fixes the dead-CTA problem found on 3 of 5 pages. |
| Section rhythm | Hero → proof/stats → primary content (tabs or grid) → gallery → CTA/connect. All 5 pages already roughly follow this; the fix is filling gaps, not restructuring. |
| Mobile spacing | Audit every `grid md:grid-cols-2 lg:grid-cols-3` for stacked single-column behavior below `md`; confirm hero text doesn't overflow on 375px width (God's Vessel and Ani-Dax heroes need this check — large type sizes). |
| Real-data discipline | Any stat, testimonial, or count shown to a visitor must either be real (GA4/YouTube API-driven, as `DaxTheTravelerPage.jsx` and `TimeZoneTravelersPage.jsx` already do well) or explicitly labeled as illustrative. No more hardcoded fake "10K+ Faithful Followers"-style numbers presented as real. |
| Image fallback pattern | Standardize the `onError` fallback pattern already used in `DaxTheTravelerPage.jsx` (`onError={(e) => e.target.src = 'https://via.placeholder.com/...'}`) across all pages — currently only Dax the Traveler has it; God's Vessel and Time-Zone Travelers still use raw `/api/placeholder/...` URLs that 404 with nothing to fall back to. |

### B. Per-brand modernization plan

#### B.1 — The Dax Collective (`Home.jsx`)
**Feel target:** clean agency / systems studio / premium tech operator.

| Area | Finding / Direction |
|---|---|
| Current weaknesses | Dead "Subscribe" `motion.button` (lines 211-222, no `onClick`) — already tracked as 1.3. Flat black hero with no visual anchor beyond ambient blurred blobs; no concrete proof of service work. `BrandCard` description for Ani-Dax is stale ("Anime bios, voiceovers, AI vids") and should be refreshed to match the live page's actual content (reviews/commentary, not voiceover/AI-vid generation). |
| Recommended structure | Hero → trust/proof row (the 4 brands as a live "ecosystem" proof, not just a nav grid) → services section (new — what The Dax Collective actually sells per 4.5: content systems, brand setup, websites, automation) → brand grid (existing `BrandCard`s) → CTA. |
| Hero direction | Keep the black/ambient-gradient base — it already reads "tech operator." Add one concrete visual: a simple animated diagram or screenshot-style mockup implying "systems," not a stock photo. |
| Color/typography | Keep blue→purple→pink gradient text accents; this is already distinct from God's Vessel's purple/indigo and reads more "tech." |
| Image/video needs | One hero-adjacent graphic conveying "systems/automation" (diagram-style, not photographic) — see Asset list (D). |
| CTA placement/wording | Replace dead "Subscribe to get Updates" with the Path B `SubscribeForm` per the already-approved Phase 1 plan (item 3) — this item is already tracked, just flagging it belongs to this workstream too. Add a second CTA in the new services section: "See what we build" → contact form, Dax Collective Services dropdown value. |
| Content-preview/portfolio | New: a lightweight 3-card "what we build" preview (content systems / brand setup / automation), each linking to the contact form pre-filled to that inquiry type. |
| Motion/interactions | Keep ambient blob motion; it's already a good "premium tech" signature distinct from the other brands' more literal card-hover motion. |
| Mobile-first fixes | Verify the two looping ambient blobs don't cause horizontal scroll/jank on narrow viewports (`overflow-hidden` check on hero section). |
| Placeholder/dead content | Dead Subscribe CTA (tracked at 1.3). Stale Ani-Dax card description. `StatsSection` component (not yet read — flag for a follow-up read to confirm its numbers are real, given the fake-stat pattern found on God's Vessel). |
| Files | `dax-main/src/pages/Home.jsx`; possibly `dax-main/src/components/StatsSection.jsx` (unread, flag only) |
| Visual assets needed | 1 hero/systems diagram graphic; refreshed Ani-Dax card thumbnail/description |
| Owner | Cowork (code) + ChatGPT-image/Canva (diagram graphic) + Me (copy approval) |
| Dependencies | Phase 1 contact/subscribe backbone (for working CTAs) |
| Effort | Medium — mostly content/CTA wiring, one new visual |
| Required before launch? | Yes — dead CTA and stale copy are launch blockers per existing board rules |

#### B.2 — Dax the Traveler (`DaxTheTravelerPage.jsx`)
**Feel target:** personal, cinematic, worldly, adventurous, creator-led.

| Area | Finding / Direction |
|---|---|
| Current weaknesses | Already the most production-ready page (parallax hero, real photo assets, working YouTube integration, proper `onError` fallbacks). Two confirmed dead/wrong items: newsletter modal `<form>` has no `onSubmit` (lines 411-425, tracked at 1.4); "Get in Touch" button uses `mailto:hello@daxcollective.com`, a domain not owned (line 1001, tracked at 1.5). Stats fall back to hardcoded numbers ("15+", "100+", "1000+", "50+") when YouTube data hasn't loaded — acceptable as a loading-state fallback, but confirm it's never shown as final once real data is available. |
| Recommended structure | Already correct: parallax hero → featured video → shorts carousel → longform grid → about → gallery → connect. No restructuring needed — only the two CTA fixes plus polish. |
| Hero direction | Keep parallax destination backgrounds (Puerto Rico/zipline/Caribbean) — this is the most "cinematic" hero of the five and matches the brand. |
| Color/typography | Keep blue→purple gradient accents; already distinct from Dax Collective's flatter black base via the photo-driven parallax. |
| Image/video needs | None new required — real photo assets already exist (`me smiling cuba.jpg`, `FB Adventures.jpg`) and the destination/asset-source system (`brandAssetSources.js`) is already wired with attribution links for fallback images. |
| CTA placement/wording | Fix newsletter modal to actually submit (Path B `SubscribeForm`, `source: "dax-the-traveler"`, per already-approved item 4). Fix "Get in Touch" to open the Path A contact form pre-filled to "Dax the Traveler / UGC" instead of a broken mailto (per already-approved item 4). |
| Content-preview/portfolio | Once the Phase 3.4 UGC portfolio (10-15 curated photos) is approved, feed it into the existing `BrandGallery` — no new component needed. |
| Motion/interactions | Keep existing parallax/spring/mouse-tracking effects — these are genuinely above the shared quality bar already. |
| Mobile-first fixes | Confirm the mouse-tracking `requestAnimationFrame` profile-photo tilt effect degrades gracefully on touch devices (no `mousemove` event on mobile — verify it doesn't error, just doesn't animate). Confirm hero `grid-cols-1 lg:grid-cols-2` collapses cleanly with the profile image + adventures collage stacked sanely on narrow screens. |
| Placeholder/dead content | Dead newsletter form, wrong-domain mailto (both already tracked, items 1.4/1.5 and Phase 1 build item 4). |
| Files | `dax-main/src/pages/DaxTheTravelerPage.jsx:411-425` (form), `:1001` (mailto) |
| Visual assets needed | None — existing real photos suffice |
| Owner | Cowork (code only — already-approved Phase 1 build item 4) |
| Dependencies | Phase 1 contact/subscribe backbone |
| Effort | Low — two CTA wiring fixes, no new visuals |
| Required before launch? | Yes |

#### B.3 — Time-Zone Travelers (`TimeZoneTravelersPage.jsx`)
**Feel target:** travel media, global discovery, smart planning, maps/routes.

| Area | Finding / Direction |
|---|---|
| Current weaknesses | Hero and itinerary images partly real (`getTravelImage`/`brandAssetSources.js`-sourced), but the video carousel thumbnails are still raw `/api/placeholder/300/200` URLs that will 404 with no fallback. "Travel Hacks" and "Quick Itineraries" cards are mock data (`getMockTravelData`) presented as real content with save-counts and budgets — needs either a real data source or an explicit "preview/example" label before launch. Page currently reads more like a generic content hub than a "maps/routes/time zones" brand — the time-zone concept from the brand name isn't visually present anywhere. |
| Recommended structure | Keep hero → video carousel → tabbed content (hacks/itineraries/matchmaker/inspiration) → gallery. Add one new section: a lightweight visual "time zone / map" motif somewhere near the hero or as a divider, to make the brand concept visible, not just implied by the name. |
| Hero direction | Keep the orange/red/pink gradient hero — distinct from every other brand and reads "global/sunset/travel." |
| Color/typography | Keep orange→pink gradient; it's already the most visually distinct of the five from God's Vessel's purple. |
| Image/video needs | Replace `/api/placeholder/300/200` video thumbnails with either real YouTube thumbnails (if `TimeZoneTravelersPage` gets the same `YouTubeIntegration` wiring `DaxTheTravelerPage` already uses) or styled placeholder cards with an `onError` fallback, not raw 404-prone URLs. One small map/timezone graphic for the "concept visibility" gap above. |
| CTA placement/wording | "Start Your Journey Today" CTA (inspiration tab) already correctly opens a real YouTube channel link — keep. Add a CTA on the hacks/itineraries tabs that routes to the Phase 1 contact form (general inquiry or collab), since currently those tabs have no path to contact at all. |
| Content-preview/portfolio | Once Phase 3.6 (destination-content template set) exists, swap the 3 mock travel hacks / 3 mock itineraries for real drafts from that template, or explicitly label current ones "Example format" until real content lands. |
| Motion/interactions | Existing tab-switch fade/slide and video-carousel transitions are solid — keep, just extend the same pattern to any new section. |
| Mobile-first fixes | Confirm the 3-video vertical stack + main video `lg:grid-cols-3` layout collapses to a sane single column below `lg`; confirm the pill-tab row (4 tabs) wraps or scrolls horizontally on narrow screens rather than overflowing. |
| Placeholder/dead content | Mock travel hacks/itineraries presented as real (saves counts, budgets); raw placeholder video thumbnails with no fallback. |
| Files | `dax-main/src/pages/TimeZoneTravelersPage.jsx` |
| Visual assets needed | 1 map/timezone motif graphic; real or styled-fallback video thumbnails |
| Owner | Cowork (code/labeling) + ChatGPT-image/Canva (map graphic) + Me (decide real-data vs. labeled-example for hacks/itineraries) |
| Dependencies | Phase 3.6 content template (for real-data swap) or a labeling decision from Me as an interim step |
| Effort | Medium |
| Required before launch? | Partially — the placeholder-thumbnail 404 risk and "fake data presented as real" issue should be fixed before launch; the map-motif graphic can follow shortly after |

#### B.4 — God's Vessel (`GodsVesselPage.jsx`) — benchmark page, improve only where weaker
**Feel target:** modern faith, calm strength, depth, purpose, light.

| Area | Finding / Direction |
|---|---|
| Current weaknesses | Highest-polish motion/tab structure of the five, but the most placeholder/fake-content-heavy: hero background is `/api/placeholder/1920/600` (no real image at all); apparel images are `/api/placeholder/300/300`; 3 "Read Devotional," 1 "Shop Now," 1 "Share Your Testimony," and 1 "Join the Movement" button all have no `onClick`/`href`; testimonies are fully fabricated names/quotes/locations; final-CTA stats ("10K+ Faithful Followers," "500+ Lives Transformed") are fabricated. This is exactly the gap the user flagged: motion/structure quality is the benchmark, but content honesty is currently the weakest of the five pages. |
| Recommended structure | Keep the existing hero → tabbed content (faith/apparel/testimonies) → gallery → CTA structure — it's the right shape. Fix is entirely about replacing fake content and dead buttons with real or honestly-labeled equivalents. |
| Hero direction | Replace the `/api/placeholder/1920/600` background with a real photo/graphic (light-ray, open-Bible, or abstract faith-themed image) — currently the only one of the five brand pages with zero real visual in its hero. |
| Color/typography | Keep purple/indigo/blue gradient — already distinct and appropriately "modern faith." No change needed here; this is the visual-language benchmark, not the problem area. |
| Image/video needs | 1 real hero background image/graphic; product photography or graphic mockups for the apparel tab (or remove apparel tab entirely until real products/printer exist, replacing with a "Coming Soon" state — ties to 4.4's already-approved CTA correction). |
| CTA placement/wording | "Read Devotional" buttons need a real destination (expand-in-place or link to full devotional content) or removal if no full content exists yet. "Shop Now" → already corrected to "Join the Early List" per 4.4/Phase 1 build item 5 — flagging it belongs here too. "Share Your Testimony" should open the Path A contact form (pre-filled "God's Vessel"), turning a dead button into a real testimony-submission path. "Join the Movement" → same Path B subscribe CTA as item 5, not a second separate dead button. |
| Content-preview/portfolio | Testimonies tab: replace fabricated names/quotes with either real testimonies (once any exist) or an honest "Be the first to share your story" empty-state tied to the new working "Share Your Testimony" CTA — never fabricated quotes presented as real people. |
| Motion/interactions | Keep all existing tab/card motion — this is the actual benchmark quality the other 4 pages should match. |
| Mobile-first fixes | Confirm the 3-stat final-CTA row and 3-card grids collapse cleanly below `md` — structurally likely fine given Tailwind classes used, just needs a visual check once real content replaces fake content. |
| Placeholder/dead content | This page has the most: fake hero image, fake apparel images/prices, 5 dead buttons, fabricated testimonies, fabricated stats. All listed above. |
| Files | `dax-main/src/pages/GodsVesselPage.jsx` |
| Visual assets needed | Real hero image/graphic; real or "coming soon" apparel visuals |
| Owner | Cowork (CTA wiring, code) + ChatGPT-image/Canva (hero + apparel visuals) + Me (decide apparel tab: keep as "coming soon" or hide until real products exist; approve real vs. placeholder testimony copy) |
| Dependencies | Phase 1 contact/subscribe backbone; Phase 4.4 (already approved) |
| Effort | Medium-high — most content replacement of the five, but no structural rebuild |
| Required before launch? | Yes — fabricated stats/testimonies presented as real and 5 dead buttons are launch blockers |

#### B.5 — Ani-Dax (`AniDaxPage.jsx`)
**Feel target:** bold anime commentary, high energy, opinion-led, original graphics.

| Area | Finding / Direction |
|---|---|
| Current weaknesses | **Flag for your review before anything else:** `hottestThisSeason` and `animeReviews` cards render `anime.sourceUrl`/`anime.sourceName` attribution links ("Cover reference via {source}") alongside `/api/placeholder/300/400` and `/api/placeholder/300/200` images — meaning the intended image source (via `fetchCurrentAnimeReferences()`/`getFallbackAnimeReferences()` in `brandAssetSources.js`) is pulling real anime cover/key art from an external source. **This directly intersects the standing Ani-Dax rule: no official key art, screenshots, character renders, or unlicensed art, regardless of attribution.** This needs a direct check of `brandAssetSources.js` before any other Ani-Dax visual work — attribution does not equal a display license. Separately: the "hottest this season"/review/trending content is hardcoded opinion copy (acceptable as the creator's actual opinions, not "fake data" in the God's Vessel sense) but reads as static rather than tied to a real publishing cadence. |
| Recommended structure | Keep hero → quick-nav pills → video carousel → tabbed content (Re:Zero glaze / hottest season / reviews / trending) → comments (already wired to Firestore + anonymous auth — genuinely solid) → gallery. Structure is sound; the issue is entirely image sourcing and visual identity. |
| Hero direction | Keep bold pink/purple/blue gradient wordmark — already high-energy and on-brand. The hero itself has no image at all (text + gradient only), which is fine for "bold/opinion-led," but means the *entire visual identity* of the page currently rests on placeholder-or-questionable cover images further down — making the original-mascot work the single highest-priority asset gap of all five brands. |
| Color/typography | Keep purple/pink/blue; distinct enough from God's Vessel's purple/indigo via the added pink and bolder type scale. |
| Image/video needs | **Top priority across all 5 brands:** original Ani-Dax mascot/avatar (already flagged in the launch tracker as "not created" and "biggest differentiator"). Once it exists, it should replace the cover-art images in the "hottest this season" and "reviews" cards — title-card-style original graphics per anime discussed, not the anime's actual official art. |
| CTA placement/wording | Existing tab-jump buttons (Anime Analysis/Reviews/Seasonal Picks) all have working `onClick` — no dead CTAs found on this page, a genuine strength. Add one new CTA: a Path A contact form entry point for collab/business inquiries (currently this page has zero path to contact at all). |
| Content-preview/portfolio | Trending Now / Hottest This Season already function as content previews — keep, just swap imagery per above. |
| Motion/interactions | `AnimatePresence mode="wait"` tab transitions and per-card stagger delays are already strong — keep as-is. |
| Mobile-first fixes | Confirm the wrapped pill-button row (3 quick-nav buttons + 4 tabs) doesn't crowd on narrow screens; confirm the review cards' `md:flex` image+text split stacks cleanly on mobile. |
| Placeholder/dead content | Cover-art sourcing question (above, highest priority); `/api/placeholder` fallback images with no `onError` handler. |
| Files | `dax-main/src/pages/AniDaxPage.jsx`; `dax-main/src/services/brandAssetSources.js` (needs a direct read to confirm what `fetchCurrentAnimeReferences`/`getFallbackAnimeReferences` actually return before deciding next steps) |
| Visual assets needed | Original Ani-Dax mascot/avatar (top priority, all-brand); original title-card-style graphics per anime/review, once mascot exists |
| Owner | Me (review `brandAssetSources.js` sourcing question first) → ChatGPT-image/Sora or Canva (mascot + title cards) → Cowork (swap images in, add contact CTA, add `onError` fallbacks) |
| Dependencies | Resolution of the cover-art sourcing question is a hard blocker on the image-swap work, independent of everything else in this workstream |
| Effort | High — depends on mascot creation, which is unstarted |
| Required before launch? | The sourcing question: yes, must be resolved before public launch given the standing copyright rule. The full mascot/title-card rollout: ideally before launch, but could ship with placeholder-labeled-as-placeholder cards as an interim if the mascot isn't ready in time. |

### C. Recommended build order (all 5 pages improve in the same launch window)

| Step | Work | Why this order |
|---|---|---|
| 1 | **Resolve the Ani-Dax cover-art sourcing question** — read `brandAssetSources.js`, confirm what `fetchCurrentAnimeReferences`/`getFallbackAnimeReferences` actually pull and from where | Hard blocker, copyright-adjacent, cheapest to resolve first (a read, not a build) and everything else can proceed in parallel once it's answered |
| 2 | **Land the Phase 1 contact/subscribe backbone** (already separately planned, items 1.1-1.5 and the Path A/B build) | Every brand's CTA fixes in this workstream depend on this existing first |
| 3 | **Fix dead CTAs across all 5 pages using the backbone from step 2** — Home.jsx Subscribe, Dax Traveler newsletter + mailto, God's Vessel's 5 dead buttons, Ani-Dax's new contact entry point | Same underlying components (`ContactForm`/`SubscribeForm`), so doing all 5 brands' wiring together is more efficient than one at a time |
| 4 | **Replace fabricated content** — God's Vessel testimonies/stats, Time-Zone Travelers' mock-data labeling decision | Content-honesty fixes, no new visual assets required, can run in parallel with asset creation below |
| 5 | **Create and drop in priority visual assets** (see list D) — Ani-Dax mascot first, then God's Vessel hero/apparel, then Dax Collective services diagram, then Time-Zone Travelers map motif | Ordered by how launch-blocking each gap is, per the per-brand tables above |
| 6 | **Shared design-system pass** — typography scale, card hover-color consistency, `onError` fallback pattern everywhere | Lowest risk, purely additive polish; do last so it doesn't get redone if content/CTA decisions above change anything structural |

### D. Visual assets to create first

| Priority | Asset | Brand | Why first |
|---|---|---|---|
| 1 | Original Ani-Dax mascot/avatar | Ani-Dax | Already flagged as the brand's single biggest differentiator and currently the page's only real visual-identity gap; also unblocks the cover-art replacement work |
| 2 | God's Vessel real hero background image/graphic | God's Vessel | Currently the only brand page with zero real hero visual (raw placeholder URL) |
| 3 | God's Vessel apparel visuals or "coming soon" graphic | God's Vessel | Tied to the already-approved Shop Now → waitlist CTA correction; needs *something* real or honestly-labeled in that tab |
| 4 | The Dax Collective "systems/automation" hero-adjacent graphic | The Dax Collective | Supports the new services-preview section; lowest complexity of the four (one diagram-style graphic) |
| 5 | Time-Zone Travelers map/timezone motif graphic | Time-Zone Travelers | Makes the brand concept ("time zones") visible for the first time; lower urgency than 1-3 |

---

## Phase 3 — Asset & Content-Bank Readiness

| # | Task | Brand | Owner | Dependency | Approval Needed | Critical? | Definition of Done |
|---|------|-------|-------|------------|-------------------|-----------|----------------------|
| 3.1 | Pick the 5 files for the "First Public Test Shortlist" | Dax the Traveler | Me | None | No | Critical | 5 filenames/Drive IDs sent to me |
| 3.2 | Update registry rows `pending_selection` → `approved_for_public/website` | `ASSET_REGISTRY.md` | Cowork | 3.1 | Yes | Critical | Rows updated for exactly the 5 chosen files |
| 3.3 | Confirm `rights_status` is filled for every asset slated for public use | `ASSET_REGISTRY.md` | Me/Cowork | None | No — read-only | Critical | No blank `rights_status` on any public-use row |
| 3.4 | **Dax the Traveler UGC portfolio** — curate a real "best-of" set from the 29 logged Drive rows (not just the 5-slot test shortlist) | `ASSET_REGISTRY.md` Travel Intake Batch 001 | Me (pick) + Cowork (register) | 3.1 | Yes — registry edit | Critical | 10-15 photos/videos marked `approved_for_public`, organized as a "portfolio" set distinct from the 5-slot test shortlist |
| 3.5 | **Starter content-bank minimum, all brands: 3-5 ready-to-post pieces each** | All 5 | Me + Cowork/n8n assist | 2.A-2.E branding done | Yes — first real content drafts | Critical | Each brand has 3-5 drafts sitting in manual review (scripts, captions, or finished short-form pieces) |
| 3.6 | **Time-Zone Travelers destination-content template set** | Time-Zone Travelers | Me + Cowork | 2.C | Yes | Critical | A reusable template (format + structure) for "24 hours in ___" / hack-style posts, so content isn't built from scratch each time |
| 3.7 | **Ani-Dax safe original-content template** | Ani-Dax | Me + Cowork | 2.D | Yes | Critical | A commentary/analysis format built entirely on original assets — talking-head reaction, original-graphic title cards, your own mascot/avatar as the recurring visual anchor. No screen-grabbed footage, no official key art, no character renders, anywhere in the template |
| 3.8 | Document approved asset source per brand | `ASSET_REGISTRY.md` brand sections | Cowork | 3.4 | Yes | Post-launch | Each brand section states where its approved assets come from |

---

## Phase 4 — Monetization-Path Readiness (every brand, even if inactive)

| # | Task | Brand | Owner | Dependency | Approval Needed | Critical? | Definition of Done |
|---|------|-------|-------|------------|-------------------|-----------|----------------------|
| 4.1 | Define monetization lane | Dax the Traveler | Me | None | No — decision only | Critical | One line, e.g. "affiliate links + YouTube ad revenue, Stripe later" |
| 4.2 | Define monetization lane | Time-Zone Travelers | Me | None | No | Critical | One line, e.g. "affiliate + sponsorship" |
| 4.3 | Define monetization lane | Ani-Dax | Me | None | No | Critical | One line, e.g. "YouTube ads now, merch later" |
| 4.4 | **Make visible a future monetization path for God's Vessel** | God's Vessel | Me + Cowork | Dead "Shop Now" replacement | Yes — code edit | Critical | "Shop Now" is replaced with "Get Encouragement" / "Join the Early List" / "Free Reflection Guide Coming Soon," routed to the Phase 1 contact form (God's Vessel dropdown value). Future lane is apparel drops once a product/printer is chosen — captured as interest now, sold later. Not blank, not silently broken, not pretending a shop exists today. |
| 4.5 | **Corrected:** Define monetization lane — The Dax Collective is a direct service-revenue brand | The Dax Collective (parent) | Me | None | No | Critical | One line confirmed: AI-assisted content systems, brand/account setup, simple websites, creator operations, and workflow automation for creators and small businesses. This is in addition to, not instead of, its cross-promotion role. |
| 4.6 | Confirm none of these need to be *active* at launch, only *defined* | This board | — | 4.1-4.5 | No | — | Satisfied once all 5 lines are written |

---

## Phase 5 — Manual Publishing Proof

| # | Task | Affected | Owner | Dependency | Approval Needed | Critical? | Definition of Done |
|---|------|----------|-------|------------|-------------------|-----------|----------------------|
| 5.1 | Confirm manual-review default is enforced | `agent-operating-model.md` review-gate statuses | Me/Cowork | None | No — already documented | Critical | `manual_review_required` confirmed as default (already true) |
| 5.2 | Produce one pilot post/video per brand, simultaneously, not sequenced | All 5, via Phase 3.5 content bank | Me + n8n (assist) | Phase 2 + 3 complete per brand | Yes — first real content generation | Critical | One draft per brand sitting in manual review |
| 5.3 | Confirm zero public uploads occur during the pilot | n8n active-workflow list | n8n/Me | None | No — re-verify, already true | Critical | Active workflow list still shows only the 2 known-safe workflows |
| 5.4 | Manually post one approved piece per brand, on the actual platform, by hand | All 5 | Me (manual platform) | 5.2 approved | Yes — first public content, your call | Critical | One real post live per brand, posted by you, not automated |

---

## Phase 6 — OAuth/n8n Automation (after the manual system works)

| # | Task | Affected | Owner | Dependency | Approval Needed | Critical? | Definition of Done |
|---|------|----------|-------|------------|-------------------|-----------|----------------------|
| 6.1 | Collect OAuth credentials per platform | YouTube/TikTok/Meta dev accounts | Me (manual platform) | Phase 5 proven manually first | No — your own account work | Post-launch | Credentials exist (not read/printed by me) |
| 6.2 | Implement real `/api/post/:brand` (replace stub) | `dax-backend/server.js:189-203` | Cowork | 6.1 | Yes — backend code | Post-launch | Endpoint actually calls a platform API, tested in dry-run |
| 6.3 | Activate first n8n publisher workflow, one platform, one brand, manual-review-gated | `n8n/templates/*.json` | n8n + Me | 6.2, repeated manual proof | Yes — workflow activation | Post-launch | One publisher live, guarded, reviewed before each post |
| 6.4 | Expand automation brand-by-brand only after each prior one is stable | Same | n8n + Me | 6.3 | Yes, each time | Post-launch | No new automation turned on without a stability check on the last one |

---

## Launch Tracker

One row per concrete deliverable. This is the at-a-glance board — update statuses here as work lands, don't recreate it.

| Brand | Item | Type | Status | Owner |
|---|---|---|---|---|
| Dax Collective | YouTube/IG/TikTok/FB handles | Account | Not reserved | Me |
| Dax Collective | DC monogram logo | Asset | Not created | Me |
| Dax Collective | YouTube banner + FB cover | Asset | Not created | Me |
| Dax Collective | Bio (all platforms) | Copy | Written, not posted | Me |
| Dax Collective | CTA (Home.jsx Subscribe) | CTA | Dead — no onClick | Cowork |
| Dax Collective | Landing page | Page | Live | — |
| Dax Collective | Contact route | Backbone | Missing | Cowork |
| Dax Collective | Monetization statement | Monetization | **Confirmed:** direct service-revenue brand (content systems, brand setup, websites, automation) | Me |
| Dax Collective | Analytics | Tracking | Live (GA4 confirmed) | — |
| Dax the Traveler | YouTube/IG/TikTok/FB handles | Account | Not reserved | Me |
| Dax the Traveler | Avatar (Cuba photo) | Asset | Exists, not uploaded | Me |
| Dax the Traveler | Banner (FB Adventures.jpg) | Asset | Exists, not uploaded | Me |
| Dax the Traveler | Bio (all platforms) | Copy | Written, not posted | Me |
| Dax the Traveler | Newsletter form CTA | CTA | Dead — no onSubmit | Cowork |
| Dax the Traveler | Contact link (mailto) | Contact | Wrong domain | Cowork |
| Dax the Traveler | Landing page | Page | Live | — |
| Dax the Traveler | UGC portfolio (10-15 photos) | Content bank | Not curated (29 rows logged, 0 approved) | Me + Cowork |
| Dax the Traveler | First Public Test Shortlist (5 files) | Asset | Awaiting your picks | Me |
| Dax the Traveler | Monetization statement | Monetization | Not written | Me |
| Dax the Traveler | Analytics | Tracking | Live | — |
| Time-Zone Travelers | YouTube/IG/TikTok/FB handles | Account | Not reserved | Me |
| Time-Zone Travelers | Clock/globe logo | Asset | Not created | Me |
| Time-Zone Travelers | World map banner | Asset | Not created | Me |
| Time-Zone Travelers | Bio (all platforms) | Copy | Written, not posted | Me |
| Time-Zone Travelers | CTA | CTA | Unconfirmed, needs check | Cowork |
| Time-Zone Travelers | Landing page | Page | Live | — |
| Time-Zone Travelers | Destination-content template | Content bank | Not built | Me + Cowork |
| Time-Zone Travelers | Monetization statement | Monetization | Not written | Me |
| Time-Zone Travelers | Analytics | Tracking | Live | — |
| Ani-Dax | YouTube/IG/TikTok/FB handles | Account | Not reserved | Me |
| Ani-Dax | Anime avatar/mascot | Asset | Not created | Me |
| Ani-Dax | Banner | Asset | Not created | Me |
| Ani-Dax | Bio (all platforms) | Copy | Written, not posted | Me |
| Ani-Dax | CTA | CTA | Unconfirmed, needs check | Cowork |
| Ani-Dax | Landing page | Page | Live | — |
| Ani-Dax | Safe original-content template | Content bank | Not built | Me + Cowork |
| Ani-Dax | Monetization statement | Monetization | Not written | Me |
| Ani-Dax | Analytics | Tracking | Live | — |
| God's Vessel | YouTube/IG/TikTok/FB handles | Account | Not reserved | Me |
| God's Vessel | Cross/vessel "GV" logo | Asset | Not created | Me |
| God's Vessel | Banner | Asset | Not created | Me |
| God's Vessel | Bio (all platforms) | Copy | Written, not posted | Me |
| God's Vessel | "Shop Now" CTA | CTA | To replace with waitlist/email-capture CTA | Cowork |
| God's Vessel | Landing page | Page | Live | — |
| God's Vessel | Visible future monetization path | Monetization | Apparel drops later; waitlist CTA captures interest now | Me + Cowork |
| God's Vessel | Scripture post template | Content bank | Not built | Me + Cowork |
| God's Vessel | Analytics | Tracking | Live | — |
| Shared | Contact model decision | Backbone | **Confirmed:** `therollodaxcollective@gmail.com` + dropdown-routed form | Me |
| Shared | README accuracy | Backbone | Outdated | Cowork |
| Shared | RevenueTracker fake-data label | Backbone | Unaddressed | Cowork |
| Shared | n8n publish guards | Backbone | Confirmed safe (2026-06-03 audit) | n8n |
| Shared | Backend hosting plan | Backbone | **Confirmed:** Spark plan retained during public-shell build; Cloud Functions migration deferred until contact/signup system is ready for a deliberate Blaze deployment; first deployment scoped to `/api/health`, `/api/contact`, `/api/subscribe` only | Me |

---

---

## Phase 1 — Final Implementation Plan (approved scope, code not yet written)

**Inbox confirmed live:** `therollodaxcollective@gmail.com`, display name "The Dax Collective," 2-Step Verification on, recovery info confirmed, signature set. Gmail App Password generation is the one remaining manual step before code lands (see item 1 below).

Two distinct paths, never merged:
- **Path A (inquiry):** transient, emailed to the inbox, never stored.
- **Path B (signup):** persisted to Firestore, never emailed, no claim of an immediate newsletter/guide.

### 1. Shared inquiry contact form (Path A)
| | |
|---|---|
| **Files** | New `dax-main/src/components/ContactForm.jsx`. New `dax-backend/routes/contactApi.js`. Edited `dax-backend/server.js` (mount `app.use('/api/contact', contactRoutes)`) |
| **Fields** | name, reply email, inquiry-type dropdown (General / Dax Collective Services / Dax the Traveler-UGC / Time-Zone Travelers / God's Vessel / Ani-Dax), message |
| **Storage** | None — validated, emailed via Nodemailer, discarded |
| **Delivery** | Nodemailer transport using `GMAIL_USER` + `GMAIL_APP_PASSWORD` from `dax-backend/.env` |
| **Local test** | `npm run dev` in `dax-backend`; submit form with a real email; confirm message arrives in `therollodaxcollective@gmail.com` within ~1 min; submit with missing/malformed fields, confirm rejection with no email sent |
| **Deployed test** | After approved deploy, repeat one successful submission against the live URL; confirm inbox receipt; confirm no error in Cloud Functions/hosting logs |
| **Manual config from you** | Generate the Gmail App Password now that 2-Step Verification is on; place it in `dax-backend/.env` yourself (not pasted into chat) |

### 2. Email-list signup storage (Path B) — Dax the Traveler & God's Vessel
| | |
|---|---|
| **Files** | New `dax-main/src/components/SubscribeForm.jsx` (shared by both brands, parameterized by `source`). New `dax-backend/routes/subscribeApi.js`. Edited `dax-backend/server.js` (mount `/api/subscribe`). Edited `firestore.rules` (lock the collection) |
| **Storage choice** | Firestore collection `subscribers`, written via the existing `firebase-admin` SDK already initialized in `server.js` — no new database/service needed |
| **Document ID / dedupe** | Document ID = lowercased, trimmed email address. Repeat signup does `set(..., {merge:true})`: updates `updatedAt`, appends new brand to a `sources` array if not already present. Never creates a second record, never errors on a repeat |
| **Fields recorded** | `email`, `firstName` (optional), `consentGiven: true` (form blocks submit if unchecked), `consentTimestamp` (server-set `admin.firestore.Timestamp.now()`, not client-trusted), `source` (`"dax-the-traveler"` or `"gods-vessel"`, hardcoded per page, not user-editable), `sources` (array, for repeat signups across brands), `createdAt`, `updatedAt` |
| **Security** | `firestore.rules` gets `match /subscribers/{doc} { allow read, write: if false; }` — blocks all direct client access; the only write path is the backend Admin SDK, which bypasses rules by design. This is defense-in-depth |
| **Confirmation message** | Generic, privacy-safe: "Thanks — you're on the list. We'll only reach out about [brand] updates." No claim of an immediate newsletter or guide |
| **Local test** | Submit once → confirm one Firestore doc with correct `source`/`consentTimestamp`; submit the same email again with a different brand's form → confirm same doc, `sources` array now has both, `updatedAt` changed, still exactly one document; submit with consent unchecked → confirm blocked client- and server-side |
| **Deployed test** | After `firebase deploy --only firestore:rules` (separately approved) and backend deploy, repeat the duplicate-email test once against live; open the Firestore console directly and confirm the `subscribers` collection exists with the lock rule active |
| **Manual config from you** | Approve the `firestore.rules` change before it's deployed; no account creation needed — uses the existing Firebase project |

### 3. Home.jsx "Subscribe" CTA — **corrected to Path B**
| | |
|---|---|
| **File** | `dax-main/src/pages/Home.jsx:211-222` |
| **Change** | Dead `motion.button` → opens **Path B** `SubscribeForm` (email-list signup, not the inquiry form), `source: "dax-collective"` |
| **Fields captured** | email, optional first name, consent (server-blocks submit if unchecked), `source: "dax-collective"`, server-set `consentTimestamp`/`createdAt` |
| **Storage** | Same `subscribers` Firestore collection as item 2 — same dedupe-by-email, `sources` array logic. A person who already joined via Dax the Traveler or God's Vessel and then clicks this button gets `"dax-collective"` appended to their existing `sources` array, not a second document |
| **Local test** | Click button, submit email, confirm Firestore doc with `source: "dax-collective"` (or `sources` array updated if the email already exists); confirm consent-unchecked submissions are blocked |
| **Deployed test** | Same, once, against the live URL |
| **Manual config** | None |

### 4. Dax the Traveler newsletter form + old mailto replacement
| | |
|---|---|
| **Files** | `dax-main/src/pages/DaxTheTravelerPage.jsx:411-425` (newsletter form) and `:1001` (mailto button) |
| **Change** | Newsletter form gets `onSubmit` → **Path B** `SubscribeForm` logic, `source: "dax-the-traveler"`. Old `mailto:hello@daxcollective.com` button → opens **Path A** form, pre-set to "Dax the Traveler / UGC" (a direct contact click is an inquiry, not a list signup) |
| **Local test** | Newsletter: submit email, confirm Firestore doc with `source: "dax-the-traveler"`. Mailto button: click, confirm ContactForm opens instead of attempting to launch a mail client |
| **Deployed test** | One of each, against the live URL |
| **Manual config** | None |

### 5. God's Vessel "Join the Early List" CTA
| | |
|---|---|
| **File** | `dax-main/src/pages/GodsVesselPage.jsx:228-230` |
| **Change** | "Shop Now" → **"Join the Early List"** text, opens **Path B** `SubscribeForm`, `source: "gods-vessel"` |
| **Local test** | Click, submit email, confirm Firestore doc with `source: "gods-vessel"`; confirm button text and confirmation message make no claim of an existing store or guide |
| **Deployed test** | Same, once, against the live URL |
| **Manual config** | None |

### Build order
1 (contact form + backend route) → 2 (subscribe form + Firestore route + rules) → 3, 4, 5 in any order, since they only consume the two paths built in 1 and 2.

### Still open before code is written
- ~~Confirm Home.jsx's CTA path~~ — **resolved: Path B, `source: "dax-collective"`.**
- Generate and locally store the Gmail App Password — **deferred until the controlled-test step, per your instruction. Not requested during code-diff review.**
- Approve the `firestore.rules` addition shown above before any deploy.

Nothing has been built. The code-diff plan for these five items (env-var placeholders only, no real credentials) is presented in chat for review before any file is written.

---

## Asset Folder Governance Rule (new — applies before any future asset/registry work, not part of Phase 1 code)

**Confirmed standing rule, not yet implemented as folders:**

- Existing raw brand source folders (e.g., the Google Drive "Dax Traveler / Dax The Traveler Photos" archive) are **read-only/source-only for agents.** Agents may inspect approved files when explicitly allowed, but may never move, rename, delete, publish, or add generated assets into that archive.
- For Dax the Traveler specifically: **only Daniel adds personal travel photos** to the existing archive. No exceptions.
- A separate staging model will be created later (not yet built, no folders created today) with four stages per brand:
  - `10_Pending_Review`
  - `20_AI_Generated_Pending`
  - `30_Licensed_or_Stock_Pending`
  - `40_Approved_Public`
- This staging model is where Cowork/agent-generated or sourced assets land for review — never the original source archive.
- `ASSET_REGISTRY.md`'s existing `pipeline_stage` values (`incoming_review`, `needs_human_review`, `pending_selection`) will eventually map onto this folder model, but that mapping is future work, not part of this Phase 1 contact/signup build.

No folders have been created. This section documents the rule so future asset work (the 5-file shortlist pick, the UGC portfolio curation) follows it from the start.
