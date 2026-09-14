# Dax Collective Go-Live Matrix

Last verified: 2026-09-14T12:43:11-04:00

| System | Status | Last Verified | Risk | Blocker | Next Owner |
| --- | --- | --- | --- | --- | --- |
| Website legal/OAuth/Firebase preview | READY WITH MANUAL APPROVAL | 2026-09-14 | PR #3 is open; Firebase Auth/admin still needs real browser-safe Firebase config values in GitHub Secrets or Variables. | Daniel merge/legal approval and Firebase client config values. | Daniel |
| Ani-Dax local production package | READY WITH MANUAL APPROVAL | 2026-09-13 | Proof render is silent/non-public; final voice/style approval missing. | Daniel approval, approved narration, final visual review. | Daniel/Codex |
| God's Vessel Names of God collection | PARTIAL | 2026-09-13 | Draft assets/metadata exist; no live Printify/Shopify checkout and theology/design approval still required. | Daniel theology/design/vendor/pricing approval and commerce account setup. | Daniel/Claude |
| Time-Zone Travelers local sample package | READY WITH MANUAL APPROVAL | 2026-09-13 | Sample is source-backed but uses silent placeholder audio; no live publishing/account mapping. | Daniel approval, final narration, platform/account mapping, approved links. | Daniel/Codex |
| Dax the Traveler support package | READY WITH MANUAL APPROVAL | 2026-09-13 | Personal-brand package uses approved public assets only, but final Daniel approval/narration is required. | Daniel asset/angle/narration approval and platform/account mapping. | Daniel/Codex |
| n8n repository templates | PARTIAL | 2026-09-14 | Templates parse except one broken export; runtime credentials and activation state are not verified. | Live n8n access, credential health verification, repair invalid JSON export. | Daniel/Claude/Codex |
| Public publishing | BLOCKED | 2026-09-14 | Publishing functions/templates are intentionally fail-closed or private; generic YouTube publisher export now creates private drafts and disables cross-posting, but no real public upload path is verified. | Daniel approval, per-brand account mapping, platform credentials, runtime testing. | Daniel/Codex |
| Analytics tracking | PARTIAL | 2026-09-14 | Local records/business state exist; live platform analytics credentials are not verified. | Connect/read live analytics with correct account mapping. | Daniel/Codex |
| Revenue tracking | PARTIAL / READY FOR APPROVAL TRACKING | 2026-09-14 | Sprint 7 revenue-readiness artifacts exist and verified revenue/profit/ad spend are $0; monetization paths are draft/readiness only. | Daniel approval for affiliates, products, sponsors, commerce setup, memberships, or any paid action. | Daniel |
| Business-state CLI | PARTIAL | 2026-09-14 | File-backed state works locally; no live MCP/n8n action surface exists. | Daniel approval before exposing workflow-triggering actions. | Codex |

## Current Decision

The company is not production-ready for automatic public publishing or live revenue claims.

The current safe operating mode is:

Draft package -> QC/review -> Daniel approval -> private/draft upload or manual publish -> analytics/revenue tracking after real data exists.
