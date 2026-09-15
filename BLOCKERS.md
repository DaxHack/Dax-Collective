# Blockers

## Continuation 2026-09-15

Approval decisions are now persisted in `business-state/approval-decisions.json`; four items await Daniel review. The decision ledger is locally tested and does not authorize public publishing or product launch. Ani-Dax narration is draft review audio, not final-approved. Claude owns God's Vessel design/Canva/Printify/browser commerce work; technical work must not duplicate it. Live provider measurement remains unconnected; sample zero values are not evidence of observed revenue/performance.

## Daniel Required

| Blocker | Exact Human Action |
| --- | --- |
| PR #3 not merged | Review and merge https://github.com/DaxHack/Dax-Collective/pull/3 when ready. |
| Public legal copy | Approve Privacy, Terms, Disclosure, and OAuth wording as public-facing business/legal copy. |
| Public publishing | Approve each content item before YouTube/TikTok/Instagram publishing. |
| Ani-Dax final voice/public use approval | Review the local draft narration package and either approve it for final use, provide replacement narration, or approve a narrator/TTS provider. |
| OAuth/MFA | Complete any account-owner consent, MFA, CAPTCHA, or OAuth repair needed in Google/YouTube/n8n/platform accounts. |
| Paid services | Approve any paid TTS/image/video/API/tool subscription before use. |
| God's Vessel collection/listing approval | Review and approve Names of God theology, final Canva artwork masters, product copy, garment choices, pricing, vendor, and public launch timing. |
| God's Vessel commerce setup | Use the prepared draft listing handoff only after approval, then complete any Printify/Shopify login, OAuth, MFA, payment, tax, shipping, and store settings needed before products can be sold. |
| Firebase client config in GitHub | Add or confirm `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID`, and `REACT_APP_FIREBASE_MEASUREMENT_ID` as repository Secrets or Variables. |
| Time-Zone Travelers sample approval | Review the Tokyo vs Seoul night-owl decision guide sample package, approve/revise the script, and approve any public publishing target. |
| Time-Zone Travelers voice | Provide or approve final narration/TTS before the sample can become a public video. |
| Travel monetization | Approve any travel affiliate program enrollment, affiliate links, sponsorships, or paid provider use before monetized publishing. |
| Dax the Traveler support package approval | Review the Puerto Rico repurposing package, approve/revise the source assets and angle, and approve any public publishing target. |
| Dax the Traveler voice protection | Provide Daniel narration or explicitly approve an alternate narrator/TTS. No AI voice replacement should be used without Daniel approval. |
| Dax the Traveler monetization | Approve any affiliate links, sponsorships, product claims, or monetized CTA before public use. |
| Automatic public publishing | Approve the specific content item, platform, channel/account mapping, and final metadata before any workflow can publish publicly. |
| Live workflow-triggering MCP/business state | Approve permissions and action boundaries before the file-backed shared state is exposed as live workflow-triggering tools. |

## External Provider / Runtime Blockers

| Blocker | Evidence | Next Action |
| --- | --- | --- |
| Local TTS sandbox limitation | Windows SAPI narration generation works outside the sandbox and produced review audio, but it is not approved for public publishing. | Daniel must approve or replace the draft voice before public use. |
| n8n runtime not verified | Repository contains JSON templates but no connected runtime evidence. | Inspect n8n instance/credentials when available. |
| Invalid workflow JSON | `workflow_12_data_collection_agent.json.json` parse failure. | Repair or remove duplicate/broken export. |
| Publishing credentials unverified | Publisher templates reference multiple platform credentials. | Verify non-secret credential health in n8n, do not expose values. |
| Commerce credentials unverified | Repository references ecommerce automation paths, but Printify/Shopify runtime access was not verified. | Verify account connections and non-secret credential health before creating live products. |
| Full Firebase Auth runtime unverified | Code is hardened and public routes render without config, but real auth/admin behavior needs the actual Firebase client config values in GitHub Actions. | Add config values, then verify PR/merge deploy and admin sign-in flow. |
| Time-Zone Travelers n8n workflow not production-safe | Prompts were hardened, but the workflow still lacks an explicit runtime approval gate and credentials are unverified. | Repair and test in draft/private mode before any runtime execution or publishing. |
| Time-Zone Travelers final audio missing | Sprint 3 proof render is silent by design. | Use Daniel-approved narration or approved TTS before public approval. |
| Dax the Traveler n8n workflows not production-safe | Prompts were hardened and uploads are private, but workflows still need Daniel source-material checks, final voice approval, credential verification, and account mapping. | Repair around existing Daniel media inventory, approval gates, and account mapping before runtime use. |
| Live platform publishers not implemented safely | Backend/functions now fail closed instead of returning fake success; real platform upload code is still not verified. | Implement per-platform publishers only after approval, credentials, and account mapping are verified. |
| Dax the Traveler live analytics unavailable | Repository session did not have verified platform analytics. | Connect/read channel analytics only with correct account mapping and without exposing credentials. |
| Dax the Traveler final audio missing | Sprint 4 support proof render is silent by design. | Use Daniel-approved narration or approved TTS before public approval. |
| Live MCP/n8n action surface not implemented | Sprint 5 created a file-backed business-state CLI, not a live MCP server or n8n trigger surface. | Approve design and permissions before exposing workflow-triggering tools. |

## Current Revenue Readiness

- Revenue remains zero until verified provider/store/platform data exists.
- First-dollar paths are prepared but blocked on Daniel approval and provider/store setup, especially God's Vessel commerce launch and approved monetized links for travel brands.
- God's Vessel now has draft storefront listing JSON, Shopify draft CSV, Printify handoff CSV, approval checklist, and zeroed sales ledger; these are not live products and do not enable checkout.
- Financial tracker export is bookkeeping-only and does not authorize tax/payment action.

## Not Blockers

- Frontend build warnings: build succeeds.
- Lack of public publishing: intentional until approval.
- Lack of final Ani-Dax voice approval: local pipeline now generates draft review narration and a 30s render, but public use still waits for Daniel approval or replacement audio.
- God's Vessel having zero live products: intentional until theology, final Canva artwork masters, design, vendor, pricing, and storefront setup are approved.
- Time-Zone Travelers not publishing yet: intentional until Daniel approves the content, account mapping, and any monetized links.
- Dax the Traveler not publishing yet: intentional until Daniel approves the personal-brand draft, narration, account mapping, and any monetized links.
- Business-state CLI not triggering workflows: intentional until approval and hardening for live actions.
- Public publishing fail-closed behavior: intentional until Daniel approves each content item and target account.
