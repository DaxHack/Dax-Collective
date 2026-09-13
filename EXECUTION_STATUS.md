# The Dax Collective Execution Status

## LAST VERIFIED DATE/TIME

2026-09-13T19:00:33-04:00

## VERIFIED DONE

- Sprint 0B legal/OAuth blocker is implemented on branch `codex/legal-oauth-pages-20260913`.
- PR exists: https://github.com/DaxHack/Dax-Collective/pull/3
- Legal routes added: `/privacy`, `/terms`, `/disclosure`.
- `App.jsx` routes legal pages.
- Footer visibly links Privacy, Terms, and Disclosure.
- Homepage visibly links Privacy and Terms and includes Google/YouTube automation explanation.
- Dax the Traveler social URLs corrected to `@daxthetraveler` handles.
- Public legal wording describes actual current runtime behavior only:
  - direct Google gtag analytics
  - Firebase Authentication for admin functionality
  - comments code exists but public comments are not currently rendered
  - footer email field is not connected to subscriber storage
  - Buy Me a Coffee is an external link
  - no active affiliate enrollment claims
  - no blanket human-review guarantee
- `dax-main/public/index.html` `og:url` corrected from placeholder to `https://daxcollective.com`.
- Local frontend build completed successfully with warnings.
- Firebase PR preview workflow for PR #3 passed before the Sprint 1 status/doc additions.
- Ani-Dax local production package generator created and tested:
  - command: `npm run anidax:sample`
  - reusable direct command: `node tools/anidax/produce-sample.mjs --topic "..." --series "..." --audio-file path/to/approved.wav`
  - output: `artifacts/anidax/sprint-1-sample/`
  - proof render: `artifacts/anidax/sprint-1-sample/render/ani-dax-proof-render.mp4`
  - render report: `artifacts/anidax/sprint-1-sample/render/render-report.json`
- n8n workflow inventory script created and tested:
  - command: `npm run n8n:inventory`
  - output: `artifacts/n8n-inventory.json`
- God's Vessel Sprint 2 first collection path created and tested:
  - command: `npm run gods-vessel:collection`
  - output: `artifacts/gods-vessel/names-of-god/`
  - public preview assets: `dax-main/public/assets/gods-vessel/names-of-god/`
  - five Names of God draft apparel designs generated as SVG
  - product metadata includes target price, estimated base cost, and margin
  - theology review notes and commerce readiness notes generated
- God's Vessel page now describes actual current behavior:
  - draft collection, not live products
  - no on-site checkout
  - no fake testimonials/follower/lives-transformed claims
  - no unsupported "Shop Now" flow
  - measurable direct gtag interest CTA when analytics is available
- Sprint 2 commit `415ed5a47fc610e9a47275cda3c303e85fb3984e` was pushed to PR #3.
- Local Git HTTPS push from the sandbox hung, but the repository was not damaged:
  - local worktree was clean before retry
  - `git fsck --connectivity-only` reported no corruption
  - read-only `ls-remote` worked
  - non-force push succeeded from the normal Windows credential context
- Firebase production runtime blocker was verified and repaired in source:
  - missing GitHub Actions `REACT_APP_FIREBASE_*` env values were confirmed in both Hosting workflows
  - empty Firebase client config plus explicit app initialization throws `auth/invalid-api-key`
  - `getAuth()` before any initialized default app reproduces `app/no-app`
  - `AuthContext`, `CommentsSection`, and `SignInButton` no longer call implicit default-app `getAuth()`
  - Firebase initialization now happens only in `dax-main/src/config/firebase.js`
  - public routes render even when Firebase client config is missing
  - both Firebase Hosting workflows now pass the seven Firebase client config values from GitHub Secrets or Variables
- PR #3 Firebase Hosting PR workflow for handoff commit `c59b2ff6f5b573c0a56bec173fecb93de1b2a16b` succeeded in 2m 10s.
- Time-Zone Travelers Sprint 3 sample pipeline created and tested:
  - command: `npm run timezone:sample`
  - output: `artifacts/timezone-travelers/sprint-3-sample/`
  - proof render: `artifacts/timezone-travelers/sprint-3-sample/render/timezone-proof-render.mp4`
  - render report: `artifacts/timezone-travelers/sprint-3-sample/render/render-report.json`
  - content ID: `tzt-2026-09-13-tokyo-seoul-night-owl`
  - source-backed sample: Tokyo vs Seoul for first-time night-owl city explorers
  - official source notes included for GO TOKYO, Seoul Metropolitan Government, and Korea Tourism Organization
  - approval gate, publish payload, analytics record, cost record, and monetization path generated
- Sprint 3 commit `96a6148e85c8ff7f49ae72f84212c34a29ed4548` was pushed to PR #3 and its Firebase Hosting PR workflow succeeded in 2m 4s.

## CURRENTLY WORKING

- Frontend builds with `npm --prefix dax-main run build`.
- Firebase Hosting PR workflow builds and deploys previews for PR branches.
- FFmpeg is installed locally and can create a 30-second Ani-Dax proof render.
- Deterministic Ani-Dax package generation works without external credentials:
  - concept
  - script
  - storyboard
  - captions
  - metadata
  - QC
  - cost estimate
  - non-public proof render
- Ani-Dax producer can accept an approved narration file with `--audio-file`; this path is implemented but not tested with real narration because no approved voice file exists in the session.
- n8n template inventory/parsing works and flags invalid JSON plus credential/publishing blockers.
- God's Vessel Names of God collection generation works without external credentials:
  - SVG draft designs
  - collection JSON
  - product metadata CSV
  - theology review
  - commerce readiness handoff
  - website public asset copy
- `/gods-vessel` renders the generated collection data and assets, with interest CTA links using direct gtag custom events where `window.gtag` exists.
- Public routes `/`, `/privacy`, `/terms`, and `/disclosure` render from the production build with missing Firebase env values and no Firebase `app/no-app` or `auth/invalid-api-key` console errors.
- Firebase-dependent features degrade without crashing the public site when Firebase client config is missing.
- Time-Zone Travelers local sample generation works without external credentials:
  - researched concept
  - source notes
  - original angle
  - script
  - storyboard
  - approved repo asset plan
  - captions
  - thumbnail SVG
  - silent FFmpeg proof render
  - QC
  - approval/publish gate
  - analytics tracking record
  - cost record
  - affiliate-ready, non-enrolled monetization path

## PARTIAL / UNTESTED

- Ani-Dax n8n workflows exist but are not verified as production-safe:
  - `n8n/templates/workflow_ani_dax_video_generator.json` is a partial generation template.
  - `n8n/templates/ani_dax_specific_workflow.json` includes a direct YouTube upload path and needs approval/QC repair before use.
- Google Sheets, DeepSeek/OpenAI, Pexels/Fal, ElevenLabs, Discord, TikTok, Instagram, Facebook, and YouTube credentials are referenced by workflows but not verified in this session.
- Backend `dax-backend/server.js` has a health route and brand post stub, but posting is not implemented.
- Frontend automation connector has placeholder/logging implementations for several automation actions.
- Comments code exists but is not public production functionality.
- Footer email capture is intentionally disabled/unconnected.
- `n8n/docs/README.md` is empty.
- God's Vessel commerce is partial:
  - no Printify product was created
  - no Shopify checkout/storefront was configured
  - no paid order/purchase path exists in this session
  - generated prices and margins are planning estimates, not live sale terms
  - theology and design copy require Daniel's approval before public product listings
- God's Vessel quote feed component still depends on existing Google Sheets/service behavior and was not independently verified against live credentials in this sprint.
- Full Firebase Auth/admin behavior with real production config remains untested in this session because the seven GitHub config values were not available locally.
- Full Firebase Auth/admin behavior on the deployed site still needs real Firebase client config values in GitHub Actions before it can be verified end to end.
- Time-Zone Travelers n8n workflow is partial:
  - `n8n/templates/workflow_timezone_travelers_video_generator.json` reads a sheet, fetches weather, generates script/voice/images/thumbnail/blog, runs FFmpeg, updates sheet, sends Discord, and suggests affiliates
  - it is inactive in the repository export
  - credentials are unverified
  - it lacks an explicit Daniel approval gate
  - it includes unsupported Patreon/affiliate assumptions
  - it should not be run publicly as-is
- Time-Zone Travelers final voice/narration is not ready; local render uses silent placeholder audio.

## BLOCKED - DANIEL

- Approve and merge PR #3 into `main`.
- Approve any public deployment after merge if desired.
- Approve legal/Terms/Privacy/OAuth wording as public-facing business/legal copy.
- Approve first Ani-Dax concept/script before public use.
- Provide or approve final Ani-Dax narration path:
  - Daniel-recorded voice file, or
  - approved narrator, or
  - configured TTS provider.
- Approve final Ani-Dax visual style and any use of AI-generated assets.
- Approve any public publishing to YouTube/TikTok/Instagram.
- Complete any OAuth consent/MFA/account-owner credential repairs required by n8n or platform accounts.
- Approve God's Vessel Names of God theology, visual style, garment choices, pricing, vendor setup, and any public product launch.
- Complete Printify/Shopify account login, OAuth, payment/tax/shipping setup, or MFA if those are needed for commerce activation.
- Approve Time-Zone Travelers sample concept/script and any public publishing.
- Approve final Time-Zone Travelers voice/narration path.
- Approve any travel affiliate enrollment, affiliate links, sponsorships, or paid provider use before public monetized publishing.
- Add these browser-safe Firebase client config values to GitHub Actions as repository Secrets or Variables before relying on live Firebase Auth/admin behavior:
  - `REACT_APP_FIREBASE_API_KEY`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - `REACT_APP_FIREBASE_PROJECT_ID`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `REACT_APP_FIREBASE_APP_ID`
  - `REACT_APP_FIREBASE_MEASUREMENT_ID`

## BLOCKED - EXTERNAL PROVIDER

- Final voice generation requires a working TTS provider or installed/local voice. Local Windows speech synthesis returned no installed voice.
- n8n runtime/credential state is not verified from this repository alone.
- Platform publishing requires verified account credentials and per-brand channel/account mapping.

## NEXT EXACT ACTIONS

1. If this documentation update is pushed as a new PR head, wait for the Firebase PR workflow to pass again.
2. Begin Sprint 4 Dax the Traveler support automation by inventorying existing approved media/content, analytics hooks, and current page behavior. Do not fabricate Daniel travel experiences.
3. If workflow env values are absent in GitHub, Daniel should add the seven `REACT_APP_FIREBASE_*` values listed above. The public site should still render without them, but Firebase Auth/admin behavior will be disabled or degraded.
4. Repair Ani-Dax n8n templates before importing/running:
   - remove direct public upload from generation workflows
   - add approval gate
   - add QC gate
   - remove/replace unsafe generic Pexels anime-character search
   - require per-brand credential mapping
5. Add a safe Ani-Dax queue schema for READY_FOR_APPROVAL packages.
6. Add a local or n8n path that accepts an approved narration WAV/MP3 and renders a final draft video with captions.
7. Test the implemented `--audio-file` render path once Daniel supplies approved narration.

## DO NOT REDO

- Do not repeat the legal/OAuth audit unless `main` changes.
- Do not recreate legal pages from scratch.
- Do not redesign the website.
- Do not treat n8n template presence as working runtime.
- Do not publish Ani-Dax publicly without Daniel approval.
- Do not publish God's Vessel products or activate paid commerce without Daniel approval.
- Do not use ripped/cropped/mirrored/sped-up anime clips as the production base.
- Do not use Pexels results as "anime character" footage for final Ani-Dax content.
- Do not duplicate Firebase initialization in other files; use exports from `dax-main/src/config/firebase.js`.
- Do not redo the Time-Zone Travelers sample package unless the target concept changes.
- Do not run the existing Time-Zone Travelers n8n workflow publicly as-is.

## CURRENT GIT BRANCH / WORKTREE

- Active worktree: `C:\Users\Daniel Rollins\AppData\Local\Temp\dax-collective-legal-oauth-20260913`
- Active branch: `codex/legal-oauth-pages-20260913`
- Primary checkout `C:\Users\Daniel Rollins\.The.Suite\Dax-Collective` is dirty and behind remote; avoid using it for clean implementation commits.

## UNMERGED COMMITS / PRS

- PR #3: https://github.com/DaxHack/Dax-Collective/pull/3
- PR branch before these Sprint 1 additions: `codex/legal-oauth-pages-20260913`
- Existing PR head before these additions: `15c4c889ad78cfb6d18fc6f8948afbb55bb88785`
- Sprint 1 status/sample/inventory updates are pushed.
- Sprint 2 God's Vessel updates are pushed at `415ed5a47fc610e9a47275cda3c303e85fb3984e`.
- Firebase hardening commit `6d050e0885e9f779bf64658439d81354b85aaa69` is pushed.
- Handoff commit `c59b2ff6f5b573c0a56bec173fecb93de1b2a16b` is pushed and its PR workflow passed.
- Sprint 3 Time-Zone Travelers commit `96a6148e85c8ff7f49ae72f84212c34a29ed4548` is pushed and its PR workflow passed.

## DEPLOYMENT STATE

- Hosting provider path: Firebase Hosting.
- PR workflow: `.github/workflows/firebase-hosting-pull-request.yml`
- Merge/live workflow: `.github/workflows/firebase-hosting-merge.yml`
- Previous PR preview for commit `15c4c889ad78cfb6d18fc6f8948afbb55bb88785` passed:
  - https://dax-collective--pr3-codex-legal-oauth-pa-27fd2stk.web.app
- Current additional local status update requires a new PR workflow run after push.
- Latest pushed PR workflow for commit `0f42eb082bac9691a6a40edf255c3d3cd326e1f2` passed before the Sprint 2 local changes.
- Current remote PR head verified by `ls-remote`: `96a6148e85c8ff7f49ae72f84212c34a29ed4548`.
- Firebase workflow files now reference the seven `REACT_APP_FIREBASE_*` values via `${{ secrets.NAME || vars.NAME }}`.
- PR #3 showed 4 commits and the Firebase Hosting PR workflow for commit `6d050e0885e9f779bf64658439d81354b85aaa69` succeeded in 2m 20s.
- Firebase preview comment was updated for commit `6d050e0`.
- PR #3 showed 5 commits and the Firebase Hosting PR workflow for commit `c59b2ff6f5b573c0a56bec173fecb93de1b2a16b` succeeded in 2m 10s.
- PR #3 showed 6 commits and the Firebase Hosting PR workflow for commit `96a6148e85c8ff7f49ae72f84212c34a29ed4548` succeeded in 2m 4s.

## CREDENTIAL HEALTH WITHOUT SECRET VALUES

- Google Analytics direct gtag present in `dax-main/public/index.html`.
- Firebase Authentication exists in frontend/admin context.
- Firebase Hosting service account is configured in GitHub Actions secret name `FIREBASE_SERVICE_ACCOUNT_DAX_COLLECTIVE` and worked for PR preview.
- Firebase browser config values are required for full Firebase Auth/admin behavior in GitHub Actions. They were not present in the Hosting workflow before this fix.
- Ani-Dax workflow credential references exist but are unverified:
  - Google Sheets account/OAuth
  - DeepSeek or OpenAI
  - ElevenLabs
  - Pexels/Fal
  - Discord
  - YouTube OAuth
- God's Vessel commerce credential/runtime references exist but are unverified:
  - Printify
  - Shopify
  - payment/tax/shipping setup
  - Google Sheets/service feed for quotes
- No secret values were printed, copied, or committed by this session.

## N8N WORKFLOW STATE

- Inventory command: `npm run n8n:inventory`
- Full JSON inventory: `artifacts/n8n-inventory.json`
- Summary: `N8N_INVENTORY.md`
- Count: 30 templates found.
- One broken template: `n8n/templates/workflow_12_data_collection_agent.json.json` invalid JSON.
- Publishing workflows are blocked pending credentials and Daniel approval.
- Ani-Dax generation workflows are partial and need approval/QC repair before runtime use.
- Time-Zone Travelers generation workflow exists but is PARTIAL / WORKS WITH REPAIR. It is useful for the rough shape of a travel pipeline but needs source verification, approval gating, credential verification, and removal of unsupported Patreon/affiliate assumptions before runtime use.

## BRAND-BY-BRAND STATE

| Brand | State | Evidence |
| --- | --- | --- |
| Ani-Dax | PARTIAL, local production package works | `npm run anidax:sample`, proof render created |
| God's Vessel | PARTIAL, first collection draft path works | `npm run gods-vessel:collection`, `/gods-vessel` page repaired |
| Time-Zone Travelers | PARTIAL, local source-backed sample package works | `npm run timezone:sample`, proof render created |
| Dax the Traveler | protected; social links corrected in PR | no public publishing attempted |
| Dax Collective parent | legal/OAuth blocker implemented | PR #3 |

## TESTS RUN + RESULTS

| Command | Result |
| --- | --- |
| `npm run anidax:sample` | PASS; sample package and FFmpeg proof render created |
| `node tools/anidax/produce-sample.mjs --audio-file ...` | NOT RUN; no approved narration file available |
| `npm run n8n:inventory` | PASS; 30 templates parsed, one invalid JSON flagged |
| `node --check tools/gods-vessel/produce-names-of-god.mjs` | PASS |
| `npm run gods-vessel:collection` | PASS; five SVG draft designs, metadata, theology review, and commerce readiness generated |
| `rg` unsupported God&apos;s Vessel claims sweep | PASS; removed prior fake store/testimonial/follower phrases from page |
| `npm --prefix dax-main run build` | PASS with warnings |
| Firebase empty-config reproduction | PASS; explicit initialized empty config reaches `auth/invalid-api-key` |
| Firebase no-app reproduction | PASS; `getAuth()` without initialized app reproduces `app/no-app` |
| `rg getAuth/getFirestore/getStorage/initializeApp` sweep | PASS; Firebase initialization calls are centralized in `src/config/firebase.js` |
| Local production route smoke | PASS; `/`, `/privacy`, `/terms`, `/disclosure` rendered with no Firebase console errors |
| `node --check tools/timezone-travelers/produce-sample.mjs` | PASS |
| `npm run timezone:sample` | PASS; source-backed package and FFmpeg proof render created |
| Local Windows SAPI TTS test | BLOCKED; no voice installed or available |

Build warnings are existing lint warnings in unrelated files, plus existing AniDaxPage warnings. They did not block the production build.

## SAMPLE OUTPUTS CREATED

- `artifacts/anidax/sprint-1-sample/approval-package.md`
- `artifacts/anidax/sprint-1-sample/generated/content-package.json`
- `artifacts/anidax/sprint-1-sample/generated/captions.srt`
- `artifacts/anidax/sprint-1-sample/generated/storyboard.svg`
- `artifacts/anidax/sprint-1-sample/render/ani-dax-proof-render.mp4`
- `artifacts/anidax/sprint-1-sample/render/render-report.json`
- `artifacts/n8n-inventory.json`
- `artifacts/gods-vessel/names-of-god/collection.json`
- `artifacts/gods-vessel/names-of-god/product-metadata.csv`
- `artifacts/gods-vessel/names-of-god/theology-review.md`
- `artifacts/gods-vessel/names-of-god/commerce-readiness.md`
- `artifacts/gods-vessel/names-of-god/designs/*.svg`
- `artifacts/gods-vessel/names-of-god/mockups/collection-board.svg`
- `dax-main/public/assets/gods-vessel/names-of-god/*.svg`
- `artifacts/timezone-travelers/sprint-3-sample/approval-package.md`
- `artifacts/timezone-travelers/sprint-3-sample/generated/content-package.json`
- `artifacts/timezone-travelers/sprint-3-sample/generated/captions.srt`
- `artifacts/timezone-travelers/sprint-3-sample/generated/storyboard.svg`
- `artifacts/timezone-travelers/sprint-3-sample/generated/publish-ready-payload.json`
- `artifacts/timezone-travelers/sprint-3-sample/generated/analytics-record.json`
- `artifacts/timezone-travelers/sprint-3-sample/generated/cost-record.json`
- `artifacts/timezone-travelers/sprint-3-sample/generated/monetization-path.json`
- `artifacts/timezone-travelers/sprint-3-sample/thumbnail/thumbnail.svg`
- `artifacts/timezone-travelers/sprint-3-sample/render/timezone-proof-render.mp4`
- `artifacts/timezone-travelers/sprint-3-sample/render/render-report.json`

## KNOWN BUGS

- `workflow_12_data_collection_agent.json.json` is invalid JSON.
- Existing n8n Ani-Dax direct-upload workflow lacks an approval gate and QC gate.
- Existing Ani-Dax workflow uses generic external visual search unsuitable for final anime character production.
- Local TTS unavailable.
- Frontend build warnings remain.
- God's Vessel storefront/product creation is not connected to Printify or Shopify yet.
- God's Vessel generated theology copy is concise draft apparel copy and still needs Daniel review before product publication.
- Full Firebase Auth/admin runtime cannot be verified until GitHub has real browser-safe Firebase client config values.
- Time-Zone Travelers n8n workflow has no approval gate and includes unsupported Patreon/affiliate assumptions.
- Time-Zone Travelers sample render uses silent placeholder audio.

## COST/RISK ISSUES

- Local Sprint 1 proof run cost: $0.00.
- External AI/TTS/image/video costs are not verified and must be tracked before production usage.
- God's Vessel local Sprint 2 generation cost: $0.00.
- Firebase hardening local cost: $0.00.
- Time-Zone Travelers local Sprint 3 proof run cost: $0.00.
- God's Vessel price/margin numbers are estimates until vendor base costs, shipping, fees, taxes, and platform costs are verified.
- Highest immediate risks:
  - accidental public publishing
  - wrong brand credential/channel publishing
  - copyrighted anime footage use
  - generic AI output that looks mass-produced
  - unbounded API cost if workflows are activated without limits
  - public product launch before theology/vendor/price approval

## NEXT SPRINT

Continue Sprint 4 Dax the Traveler support automation. Protect Daniel's face/voice/personal brand; inventory existing approved media and create support automation around his material only.
