# Next Session Handoff

## What To Do Next

1. Continue from worktree:
   `C:\Users\Daniel Rollins\AppData\Local\Temp\dax-collective-legal-oauth-20260913`
2. Confirm branch:
   `codex/legal-oauth-pages-20260913`
3. Continue from the latest PR #3 head; the contact-email correction is pushed and its Firebase PR workflow passed.
4. If the Sprint 6 hardening commit has not yet been pushed, push it to PR #3 and verify the Firebase PR workflow.
5. Continue Sprint 7 revenue readiness after Sprint 6 is pushed/verified.
6. Protect Daniel's personal brand: do not fabricate travel experiences, replace his face/voice, bulk-edit history, or publish without approval.
7. Continue Sprint 1 repair work opportunistically around:
   - approval gates
   - QC
   - cost tracking
   - safe original visual generation/composition
   - accepted narration file input
   - render to reviewable final draft

## Where To Find It

- Sprint status: `EXECUTION_STATUS.md`
- n8n inventory summary: `N8N_INVENTORY.md`
- full n8n inventory: `artifacts/n8n-inventory.json`
- blockers: `BLOCKERS.md`
- Ani-Dax sample generator: `tools/anidax/produce-sample.mjs`
- Reusable Ani-Dax invocation:
  `node tools/anidax/produce-sample.mjs --topic "..." --series "..." --audio-file path/to/approved.wav`
- n8n inventory generator: `tools/n8n/inventory.mjs`
- Ani-Dax sample output: `artifacts/anidax/sprint-1-sample/`
- God's Vessel collection generator: `tools/gods-vessel/produce-names-of-god.mjs`
- Reusable God's Vessel invocation:
  `npm run gods-vessel:collection`
- God's Vessel sample output: `artifacts/gods-vessel/names-of-god/`
- God's Vessel public assets: `dax-main/public/assets/gods-vessel/names-of-god/`
- God's Vessel page data: `dax-main/src/data/godsVesselNamesOfGod.js`
- Time-Zone Travelers sample generator: `tools/timezone-travelers/produce-sample.mjs`
- Reusable Time-Zone Travelers invocation:
  `npm run timezone:sample`
- Time-Zone Travelers sample output: `artifacts/timezone-travelers/sprint-3-sample/`
- Time-Zone Travelers proof render: `artifacts/timezone-travelers/sprint-3-sample/render/timezone-proof-render.mp4`
- Dax the Traveler support generator: `tools/dax-traveler/produce-support-package.mjs`
- Reusable Dax the Traveler invocation:
  `npm run dax-traveler:support`
- Dax the Traveler support output: `artifacts/dax-the-traveler/sprint-4-support/`
- Dax the Traveler proof render: `artifacts/dax-the-traveler/sprint-4-support/render/dax-traveler-proof-render.mp4`
- Business state rules: `business-state/brand-rules.json`
- Business state permissions: `business-state/permissions.json`
- Business state builder: `tools/business-state/build-state.mjs`
- Business state query CLI: `tools/business-state/query-state.mjs`
- Business state output: `artifacts/business-state/current-state.json`
- Business state summary: `BUSINESS_STATE.md`
- Reusable business state commands:
  `npm run business-state:build`
  `npm run business-state:query -- summary`
  `npm run business-state:query -- content-queue`
- Contact/legal email correction files:
  - `dax-main/src/pages/LegalPages.jsx`
  - `dax-main/src/config/socialLinks.js`
  - `dax-main/src/pages/DaxTheTravelerPage.jsx`
  - `dax-main/src/data/godsVesselNamesOfGod.js`
- Firebase config module: `dax-main/src/config/firebase.js`
- Firebase auth context: `dax-main/src/contexts/AuthContext.js`
- Firebase Hosting workflows:
  - `.github/workflows/firebase-hosting-pull-request.yml`
  - `.github/workflows/firebase-hosting-merge.yml`

## What Has Already Been Verified

- Legal/OAuth pages/routes/footer/homepage disclosure exist on PR branch.
- `og:url` is corrected to `https://daxcollective.com`.
- `npm run anidax:sample` generated a proof package and FFmpeg video.
- `tools/anidax/produce-sample.mjs` accepts custom topic/series/title/angle/out/audio-file arguments.
- `npm run n8n:inventory` parsed templates and flagged one invalid JSON export.
- `npm --prefix dax-main run build` passes with warnings.
- FFmpeg is installed and usable.
- Local Windows TTS is not usable in this environment.
- `npm run gods-vessel:collection` generates five Names of God SVG designs, metadata, theology review, and commerce readiness notes.
- `/gods-vessel` has been repaired to show the real draft state: no live products, no checkout, no fake testimonials, no fake follower/lives-transformed claims.
- God's Vessel interest CTAs use direct gtag custom events when analytics exists.
- Sprint 2 commit `415ed5a47fc610e9a47275cda3c303e85fb3984e` reached the remote PR branch.
- Firebase root cause was verified as both missing build-time Firebase config risk and implicit default-app auth usage:
  - empty initialized config can throw `auth/invalid-api-key`
  - calling `getAuth()` before default app init reproduces `app/no-app`
- Firebase initialization is centralized in `dax-main/src/config/firebase.js`.
- Public routes `/`, `/privacy`, `/terms`, and `/disclosure` rendered from the production build with no Firebase console errors while Firebase env was missing.
- Firebase hardening commit `6d050e0885e9f779bf64658439d81354b85aaa69` reached PR #3 and its Firebase Hosting PR workflow succeeded in 2m 20s.
- Firebase handoff commit `c59b2ff6f5b573c0a56bec173fecb93de1b2a16b` reached PR #3 and its Firebase Hosting PR workflow succeeded in 2m 10s.
- `npm run timezone:sample` generated a Time-Zone Travelers approval package and silent FFmpeg proof render.
- Sprint 3 sample content ID: `tzt-2026-09-13-tokyo-seoul-night-owl`.
- Time-Zone Travelers sample uses official source notes and approved repository assets only.
- Time-Zone Travelers sample has `publishAllowed: false` and is blocked pending Daniel approval.
- Existing `n8n/templates/workflow_timezone_travelers_video_generator.json` is partial and not safe to run publicly as-is.
- Sprint 3 Time-Zone Travelers commit `96a6148e85c8ff7f49ae72f84212c34a29ed4548` reached PR #3 and its Firebase Hosting PR workflow succeeded in 2m 4s.
- Handoff commit `e9dfa34ad3cb4bc2d9bf8ae7e6c03356e82b0fdb` reached PR #3 and its Firebase Hosting PR workflow succeeded in 2m 12s.
- `npm run dax-traveler:support` inventoried 14 approved public-safe Dax the Traveler assets and generated a support package.
- Sprint 4 Dax the Traveler content ID: `dtt-2026-09-13-puerto-rico-repurpose`.
- Dax the Traveler proof render uses four approved Dax media assets and silent placeholder audio.
- Dax the Traveler package has `publishAllowed: false` and is blocked pending Daniel approval.
- Dax the Traveler page copy was repaired to avoid unverified specific first-person anecdote claims.
- Sprint 4 Dax the Traveler commit `5b686e062abfe2c050903b0ddf93526b70a93656` reached PR #3 and its Firebase Hosting PR workflow succeeded in 2m 5s.
- `npm run business-state:build` generated a 4-brand, 4-queue-item state file.
- Business-state query commands worked for summary, list-brands, content-queue, and credential-health.
- Business-state credential health includes names/integration references only; no secret values are included.
- Sprint 5 shared business-state commit `fa5263e12a73fc649c86f17d3ced9a7193466cec` reached PR #3 and its Firebase Hosting PR workflow passed in 1m 41s.
- Functional/legal contact email correction commit `8ae2dc62312669d4ecb5cc0e867d5982f6b36367` reached PR #3 and its Firebase Hosting PR workflow passed on 2026-09-14.
- Sprint 6 local hardening work:
  - backend/functions publishing paths fail closed unless explicit approval is present
  - frontend automation dashboards no longer display fake published/revenue metrics
  - browser-side n8n webhook execution is disabled by default and no frontend n8n API key is sent
  - YouTube upload templates default to `private`
  - high-risk n8n template copy was repaired away from unsupported public publishing/revenue/affiliate claims
  - `npm --prefix dax-main run build` passes with existing warnings
  - `node --check` passes for backend/functions/business-state/n8n tooling

## What Not To Repeat

- Do not redo legal/OAuth implementation from scratch.
- Do not redesign the website.
- Do not assume n8n templates are live working workflows.
- Do not run public publisher workflows.
- Do not create live God's Vessel products or claim live commerce without Daniel/vendor approval.
- Do not restore the old fake God's Vessel apparel/testimonial/follower claims.
- Do not create new credentials unless credential repair/reuse is impossible and Daniel approves.
- Do not base Ani-Dax on ripped anime clips.
- Do not add a second Firebase `initializeApp()` call. Import `auth`, `db`, `storage`, or `firebaseApp` from `src/config/firebase.js`.
- Do not redo the Sprint 2 God's Vessel collection unless the design/theology requirements change.
- Do not redo the Sprint 3 Time-Zone Travelers sample unless the target concept changes.
- Do not run the existing Time-Zone Travelers n8n workflow publicly as-is.
- Do not fabricate Daniel travel experiences for Dax the Traveler.
- Do not redo the Sprint 4 Dax the Traveler support package unless the target assets or angle changes.
- Do not run Dax the Traveler n8n workflows publicly as-is.
- Do not use AI to replace Daniel's face or voice without Daniel approval.
- Do not rebuild the shared business-state layer from scratch; extend `business-state/*` and `tools/business-state/*`.
- Do not treat the business-state CLI as approval to publish, purchase, delete, spend, or change credentials.

## What Requires Daniel

- Merge/deploy approval.
- Legal copy approval.
- OAuth/MFA/account-owner consent.
- Voice/narration path approval.
- God's Vessel theology/design/vendor/pricing approval.
- Printify/Shopify account-owner login, OAuth, MFA, payment, tax, shipping, and launch approval.
- Time-Zone Travelers sample concept/script/public publishing approval.
- Time-Zone Travelers final narration/TTS approval.
- Travel affiliate enrollment, affiliate links, sponsorships, or paid provider approval.
- Dax the Traveler support package source asset/angle/public publishing approval.
- Dax the Traveler final narration or alternate voice approval.
- Dax the Traveler affiliate, sponsorship, product claim, or monetized CTA approval.
- Approval is required before turning the file-backed business state into any live MCP/n8n workflow-triggering action surface.
- Add or confirm these browser-safe GitHub repository Secrets or Variables for Firebase client config:
  - `REACT_APP_FIREBASE_API_KEY`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - `REACT_APP_FIREBASE_PROJECT_ID`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `REACT_APP_FIREBASE_APP_ID`
  - `REACT_APP_FIREBASE_MEASUREMENT_ID`
- Any paid service approval.
- Any public publishing approval.

## What Can Be Done Autonomously

- Repair JSON/template structure.
- Add local render/test tooling.
- Add QC/cost/approval gates.
- Add queue schemas and sample data.
- Build deterministic motion-graphic templates.
- Create draft concepts and non-public sample assets.
- Generate/update God's Vessel draft collection assets and metadata.
- Repair Time-Zone Travelers workflows/pages/metadata where the behavior can be tested without publishing or paid enrollment.
- Build Dax the Traveler support automation around existing approved material and analytics without altering public channels.
- Build shared business-state files/tools that read current repo status and non-secret workflow health.
- Harden company-wide production risks and produce/update a go-live matrix.
- Run builds/tests.
- Commit and update PRs.

## Current Sprint

Sprint 6 company hardening is the current atomic task captured by this handoff. If the PR branch already contains the Sprint 6 hardening commit, verify PR checks and continue Sprint 7 revenue readiness from `GO_LIVE_MATRIX.md`, `BUSINESS_STATE.md`, and `BLOCKERS.md`.
