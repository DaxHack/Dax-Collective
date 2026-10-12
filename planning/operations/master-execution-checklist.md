# Dax Collective Master Execution Checklist

Date started: 2026-06-03

## Operating Rules

- Build on existing workflows, files, pages, and plans first.
- Create new files only when they add auditability, repair an empty placeholder, or fill a missing system role.
- Do not read, print, copy, or store secrets.
- Do not activate public publishing until accounts, OAuth, callbacks, and manual review are confirmed.
- Keep publisher workflows guarded by approval fields and explicit publish enablement.
- Run audits after each major change.

## Current Known Baseline

- n8n runs locally at `http://localhost:5678`.
- DAX startup/manual-review workflows exist.
- Legacy n8n workflows have agent attachment notes and publish guards.
- Public publisher workflows are intentionally inactive.
- Codex-only sleep prevention is enabled with `prevent_idle_sleep = true`.

## Phase 1 - Foundation Audit

- [x] Confirm n8n health endpoint is OK.
- [x] Confirm Docker n8n container is running.
- [x] Export live n8n workflows for audit.
- [x] Confirm active workflows are expected only.
- [x] Confirm publisher workflows remain inactive.
- [x] Confirm guarded publishing nodes exist in legacy workflows.
- [x] Confirm repaired Data Collection Agent exists and is inactive.
- [x] Confirm project template JSON files parse successfully.
- [x] Confirm no `.env` or credential contents were read.

## Phase 2 - Callback and Credential Readiness

- [x] Inventory webhook/callback URLs used by existing n8n workflows.
- [x] Identify which callbacks require a public HTTPS n8n base URL.
- [x] Identify which platform OAuth credentials still need user setup.
- [x] Confirm no credentials are embedded in workflow JSON.
- [x] Prepare one user checklist for OAuth callback entries.

User-only blockers:

- [ ] Stable public n8n URL.
- [ ] Google/YouTube OAuth credentials.
- [ ] TikTok developer/app credentials if publishing is approved.
- [ ] Meta/Facebook/Instagram app credentials and pages.
- [ ] User-owned account creation or page/channel confirmation.

## Phase 3 - Brand Agent Coverage

- [x] Dax Collective parent hub agent exists.
- [x] Dax The Traveler video/post agent coverage exists.
- [x] Time-Zone Travelers video/itinerary/post agent coverage exists.
- [x] Ani-Dax video/post/merch/sticker agent coverage exists.
- [x] God's Vessel video/post/merch/sticker agent coverage exists.
- [x] Cross-brand strategy and scheduling agents exist.
- [x] Revenue/ecommerce/analytics/finance agents exist.
- [x] Data collection and asset management agents exist.
- [x] Gaps are documented by brand and output type.

Output types to verify:

- [x] Starter videos.
- [x] Short-form posts.
- [x] YouTube metadata.
- [x] Instagram/TikTok captions.
- [x] Facebook page content.
- [x] Blog drafts.
- [x] Itineraries and travel tools.
- [x] Merch concepts.
- [x] Sticker/design briefs.
- [x] Manual review summaries.

## Phase 4 - Frontend and Firebase Readiness

- [x] Confirm frontend `.env` file exists without printing contents.
- [x] Confirm `.env.example` contains only safe placeholders.
- [x] Confirm `.gitignore` ignores frontend `.env` variants.
- [x] Confirm Firebase frontend config reads `REACT_APP_FIREBASE_*` variables.
- [x] Confirm Firebase project files exist where expected.
- [x] Confirm app can build or identify blocking build errors.
- [x] Confirm public pages needing modernization are inventoried.

User-only blockers:

- [ ] Paste Firebase console values into frontend `.env`.
- [ ] Confirm Firebase hosting target and deployed domain.
- [ ] Provide public privacy policy and terms URLs for OAuth consent.

## Phase 5 - Website Modernization

- [ ] Inventory current brand pages.
- [ ] Identify the current modern page to use as design reference.
- [x] Add self-populating image sources for Time-Zone Travelers, Dax The Traveler, and Ani-Dax.
- [x] Verify current brand routes respond from the local frontend server.
- [x] Run frontend lint/build after the first asset-population page group.
- [ ] Modernize remaining pages one by one.
- [ ] Run frontend build after each page group.
- [ ] Verify pages in browser where possible.
- [ ] Keep brand pages functional before visual polish.

Brand page order:

- [ ] Dax Collective home/command center.
- [ ] Time-Zone Travelers.
- [ ] Dax The Traveler.
- [ ] Ani-Dax.
- [ ] God's Vessel.
- [ ] Shared dashboards/tools.

## Phase 6 - Content Pipeline

- [ ] Confirm local/manual video generation workflow path.
- [ ] Confirm starter video prompts per brand.
- [ ] Confirm manual review output path.
- [ ] Confirm no public upload happens during pilot.
- [ ] Generate or prepare first pilot outputs where services are available.
- [ ] Record missing service/API blockers.

Starter order:

- [ ] Time-Zone Travelers.
- [ ] Dax The Traveler.
- [ ] God's Vessel.
- [ ] Ani-Dax.
- [ ] Dax Collective parent overview.

## Phase 7 - Platform Connection

- [ ] Add n8n credentials through n8n UI only.
- [ ] Attach credentials to existing guarded workflows.
- [ ] Test OAuth callback flow with one platform at a time.
- [ ] Run dry-run/manual-review execution first.
- [ ] Enable public publishing only after approval.

Platform order:

- [ ] YouTube.
- [ ] Facebook Pages.
- [ ] Instagram.
- [ ] TikTok.
- [ ] Blog/CMS.

## Phase 8 - Final Launch Controls

- [ ] One brand pilot passes manual review.
- [ ] One public publishing path tested with a low-risk approved item.
- [ ] Analytics or logging confirms success/failure clearly.
- [ ] Error handler is active.
- [ ] Rollback/disable path is documented.
- [ ] Repeatable weekly review workflow exists.

## Running Audit Log

Add entries here as checks are completed.

### 2026-06-03 - Phase 1 Foundation Audit

- n8n health endpoint returned OK.
- Docker reports the `n8n` container is running on port `5678`.
- Live n8n export completed with 44 workflows.
- Active workflows are limited to `workflow_2_global_error_handler.json` and `DAX-04 Company Startup Operator - Manual Review`.
- Public publisher workflows remain inactive: YouTube publisher, TikTok/Instagram publisher, Blog publisher, and YouTube sentinel.
- Repaired guard coverage after audit found some older upload/publish nodes were not directly behind guard nodes.
- Final guard audit detected 40 public upload/publish-style nodes and 0 unguarded nodes.
- Project n8n template JSON files all parse successfully.
- No `.env` or credential contents were read or printed.

### 2026-06-03 - Phase 2 Callback and Credential Audit

- Live workflow callback inventory found two webhook-style callbacks, both inactive:
  - `Christian Urban Wear Design Generator`: `GET /webhook/69a8674a-a9d4-4817-8293-edd4ba343ad5`
  - `workflow_4_multiformat_content_generator .json`: `GET /webhook/content-generation`
- Live n8n export had 137 nodes with n8n credential references across 27 workflows. Credential names, IDs, and values were not printed.
- Audit found 4 high-confidence raw key-like strings in live workflow JSON.
- Replaced those raw strings with n8n env references:
  - DeepSeek-style header values now use `{{$env.DEEPSEEK_API_KEY}}`.
  - Gemini-style query values now use `{{$env.GEMINI_API_KEY}}`.
- Re-imported sanitized workflows into n8n and reactivated only the expected two active workflows.
- Final live export shows 0 high-confidence raw secret-like strings.
- Removed temporary workflow JSON export/import files from the n8n container `/tmp` directory.

### 2026-06-03 - Phase 3 Brand Agent Coverage Audit

- Agent registry validates as JSON.
- Registry contains 5 brands, 5 brand video agents, 6 output-type agents, and 12 company operations agents.
- Every brand now explicitly has video, post, merch, sticker, and design coverage.
- Dax The Traveler and Time-Zone Travelers have itinerary/travel-tool coverage.
- Workflow templates cover video generation, publishing, travel, ecommerce/revenue, asset/design work, analytics/finance, and operations/error handling.

### 2026-06-03 - Phase 4 Frontend/Firebase Audit

- `dax-main/.env` exists, but contents were not read or printed.
- `dax-main/.env.example` exists and has 0 banned backend/secret variable names.
- `dax-main/.gitignore` ignores `.env`, `.env.local`, `.env.development.local`, and `.env.production.local`.
- Git confirms `dax-main/.env` is ignored.
- `dax-main/src/config/firebase.js` reads all required `process.env.REACT_APP_FIREBASE_*` values.
- `firebase.json` was invalid JSON due comments/garbled characters and an empty functions predeploy fragment; repaired to valid JSON.
- Frontend route inventory found public routes for Home, Dax The Traveler, Ani-Dax, Time-Zone Travelers, God's Vessel, and Automation dashboard, plus private investor routes.
- `npm.cmd --prefix dax-main run lint:check` now exits with 0 errors after fixing duplicate keys in `src/ArchivedIcons.js`.
- Lint still reports warnings, mostly unused imports/state and hook dependency warnings.
- Production build was not run because write-producing command approval was blocked by the session usage/approval limit.

### 2026-06-05 - Brand Page Asset Population Audit

- Added a frontend asset source service for brand page image population.
- Time-Zone Travelers now uses sourced travel imagery for hero, itinerary, and video thumbnail content.
- Dax The Traveler keeps existing local/personal photo paths first and uses sourced travel fallback imagery for destination cards.
- Ani-Dax now requests current-season anime cover references from AniList in the browser and falls back to curated AniList references if the request fails.
- Existing cached Time-Zone Travelers and Ani-Dax browser data is normalized through the new source service so old placeholder thumbnails do not persist.
- The new asset layer does not require private Unsplash, Pexels, Pixabay, n8n, or model API keys.
- Local frontend routes returned HTTP 200 for `/dax-the-traveler`, `/timezone-travelers`, and `/ani-dax` with browser-style HTML headers.
- `npm.cmd --prefix dax-main run lint:check` exits with 0 errors and existing warnings.
- `npm.cmd --prefix dax-main run build` completed successfully with existing warnings and produced a deployable build folder.
