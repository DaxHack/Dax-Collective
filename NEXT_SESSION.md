# Next Session Handoff

## What To Do Next

1. Continue from worktree:
   `C:\Users\Daniel Rollins\AppData\Local\Temp\dax-collective-legal-oauth-20260913`
2. Confirm branch:
   `codex/legal-oauth-pages-20260913`
3. If a documentation-only handoff commit is present locally, push it:
   https://github.com/DaxHack/Dax-Collective/pull/3
4. Wait for Firebase PR workflow to pass after the latest push.
5. Continue Sprint 3 Time-Zone Travelers by inspecting existing workflow/page/runtime state first.
6. Continue Sprint 1 repair work opportunistically around:
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

## What Requires Daniel

- Merge/deploy approval.
- Legal copy approval.
- OAuth/MFA/account-owner consent.
- Voice/narration path approval.
- God's Vessel theology/design/vendor/pricing approval.
- Printify/Shopify account-owner login, OAuth, MFA, payment, tax, shipping, and launch approval.
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
- Run builds/tests.
- Commit and update PRs.

## Current Sprint

Sprint 2 God's Vessel is PARTIAL but has a working first collection draft path, and its commit is pushed. Firebase hardening is implemented and its code commit passed PR checks. If this handoff update is the latest local commit, push it and wait for the PR workflow once more, then begin Sprint 3 Time-Zone Travelers by inspecting existing workflow inventory and runtime claims before adding anything new.
