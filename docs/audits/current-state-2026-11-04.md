# Current State Audit — 2026-11-04

Read-only audit run under [CLAUDE.md](../../CLAUDE.md). Nothing was deployed, published, merged, sent or changed in any external account. Evidence is what was observed on 2026-11-04; anything not directly tested is marked UNKNOWN.

| # | System | Verdict |
|---|---|---|
| 1 | Gemini / Google AI | PARTIALLY WORKING |
| 2 | n8n runtime | PARTIALLY WORKING |
| 3 | GitHub repo / branches | WORKING |
| 4 | Figma → GitHub → Replit → Firebase | PARTIALLY WORKING |
| 5 | Base44 / ARIA | PARTIALLY WORKING |
| 6 | Printify / storefront | BLOCKED |
| 7 | Content automation | PARTIALLY WORKING |
| 8 | Career automation | PARTIALLY WORKING |
| 9 | Analytics | PARTIALLY WORKING |

## 1. Gemini / Google AI — PARTIALLY WORKING
- n8n holds 2 Google Gemini (`googlePalmApi`) credentials. Only one workflow uses them, `workflow_automated_youtube_publisher.json`, which is inactive and manual-trigger only.
- The repo has no Gemini code path. `dax-backend/.env.example` reserves `MODEL_GEMINI=` and nothing reads it. `docs/ENVIRONMENT_SETUP.md` correctly keeps AI keys backend-only.
- Not tested: whether the keys are valid. A live test means running a workflow or opening the n8n credential screen, and the only workflow that uses them publishes to YouTube.
- Gap: Gemini has no "research and review" role wired anywhere yet.

## 2. n8n runtime — PARTIALLY WORKING
- The Docker container `n8n` (`n8nio/n8n:stable`, v2.7.5) has been up since 2026-11-02 with restart policy `unless-stopped`. `/healthz` and `/healthz/readiness` both return `ok`. Data is persisted on a host volume.
- 46 workflows are stored. 2 are flagged active: `workflow_2_global_error_handler.json` and `DAX-04 Company Startup Operator - Manual Review`.
- **Defect:** only the error handler was registered at the last startup, which the container log shows after a "Last session crashed" restart. DAX-04 is flagged active, with a 24h schedule, but its last execution was 2026-10-26. The daily brief has not run since.
- The execution table holds only 3 records: DAX-04 succeeded on 10-26, and the Time-Zone Travelers Video Pilot (manual) succeeded once and failed once on 10-23.
- Hygiene issues:
  - Python task runner missing (only matters for Python Code nodes).
  - n8n version is more than 6 weeks old.
  - Community-node fetch fails with HTTP 431.
  - Several imported workflow names in n8n keep stray spaces and `.json` suffixes.
- **Fixed in the repo (this branch, uncommitted):** renamed 4 malformed template files: `workflow_4_…generator .json`, `workflow_12_….json.json`, `workflow_15_…automatio  n.json`, `workflow_16_…automati  on.json`. `import-workflows.ps1` globs `*.json` and no file references the old names. Retest: 30 templates, no names with spaces or double extensions, 29 parse as valid JSON.
- **Still open:** `workflow_12_data_collection_agent.json` is a 0-byte file. The live n8n "Data Collection Agent" was not copied in because its export contains a personal email address. That needs a sanitized export.

## 3. GitHub repo / branches — WORKING
- `main` is `2a165823`, Merge PR #9. The last "Deploy to Firebase Hosting on merge" run succeeded on that SHA.
- Open PR #10 (`fix/firestore-rules-hardening`) has every check green: Backend lint/tests, Firestore & Storage rules tests, build_and_preview, Deploy Preview. It is waiting on review and merge.
- PR #3 is closed and was never merged. `feature/dax-universe-v3` is gone from the remote.
- Unmerged work with no PR:
  - `claude/adoring-ramanujan-866z9a` (2026-10-29): God's Vessel merch master spec and YHWH review package r1, 3 files, based on `main`.
  - `docs/claude-operating-rules` (this branch).
- Stale branches: `codex/legal-oauth-pages-20260913`, `legal-pages-oauth-branding-chatgpt`, `release/visual-rebuild-clean`, `feat/production-waitlist-backend` (already merged via #9), `proof/v3-motion`. None of them were deleted.
- A ref literally named `origin` exists on the remote and looks accidental.

## 4. Figma → GitHub → Replit → Firebase — PARTIALLY WORKING
- **Firebase:** `dax-collective.web.app` and `.firebaseapp.com` both return 200 and serve bundle `main.95c20262.js`.
- **Custom domain:** `daxcollective.com` resolves to `66.81.203.198`, which is not Firebase Hosting, and the connection times out. Still unreachable.
- **Backend:** the live bundle has no backend origin baked in, so `REACT_APP_API_BASE_URL` is unset. The waitlist and other backend features correctly show "unavailable" in production.
- **Figma:** the MCP is authenticated on a Pro plan with a Full seat. The repo records no Figma file key. The V3 scene pages are gated ("Final scene withheld") until approved desktop and mobile frames exist, so there is nothing to reconcile yet.
- **Replit:** `.replit` and `replit.md` are present (Node 20, Python 3.12). The Replit workspace itself was not checked because there's no access from this session.

## 5. Base44 / ARIA — PARTIALLY WORKING
- App "ARIA Command Center" is `ready`. **The builder is paused on an unanswered `ask_clarifying_questions` prompt** in the Base44 editor.
- The 16 entities cover workers, products, evidence, the approval ledger, opportunities, the system registry and logs. The schema enforces execution-status honesty (READY ≠ CONNECTED).
- Data:
  - 4 Workers. Revenue Execution is CONNECTED/ACTIVE. The Build & Integration, Creative QA and Career workers are READY/UNKNOWN, and all four are on executor `Manual`.
  - 10 SystemItems. 9 are UNKNOWN and never verified. Google Workspace is PARTIALLY WORKING, last verified 2026-11-03.
  - 0 Opportunities.
- No integration exists between ARIA and n8n, GitHub or Claude. Delegation is manual.

## 6. Printify / storefront — BLOCKED
- ARIA Product "YHWH Washed Tee" is BUILDING at a $42 selling price, with costs unverified and no Printify product ID. Four further God's Vessel designs are at IDEA.
- The YHWH review package r1 (on the unmerged branch) concludes "NOT READY - do not approve". The supplier size chart, current costs and Printify draft state were never verified, and the final print files are missing.
- This session has no Printify API or access, and no storefront exists in the repo.

## 7. Content automation — PARTIALLY WORKING
- 40+ content and video workflows are stored in n8n, all inactive and none with recent executions. The newer "Manual Review" DAX-00/01/02/03 routers exist but are not running.
- The repo has 30+ workflow templates in `n8n/templates/`. Production material (`video-pipeline/`) lives only in the frozen legacy checkout.
- ARIA has a ContentItem pipeline schema. No publishing path is verified end to end.

## 8. Career automation — PARTIALLY WORKING
- The Indeed job-search connector works, and the profile loads with preferences set.
- A live search returned current remote roles. A shortlist was prepared outside the repo, kept private. Nothing was applied to.
- ARIA has the Opportunity schema with a `job/career opportunity` type but 0 records. The Career Execution Worker is READY/Manual. Writing the shortlist into ARIA needs approval.

## 9. Analytics — PARTIALLY WORKING
- The GA4 tag `G-KVXQJ21CZW` is present on the live site. The `generate_lead` event is implemented and unit-tested with no email in the payload.
- Not verified: whether data reaches GA4. There's no GA access from this session.
- `apiConfig.js` reports analytics `enabled` only when `REACT_APP_GA_MEASUREMENT_ID` is set, while `index.html` hard-codes the tag. That's two sources of truth.
- ARIA ContentItem metrics fields exist but have no automated feed.
