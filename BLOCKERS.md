# Blockers

## Daniel Required

| Blocker | Exact Human Action |
| --- | --- |
| PR #3 not merged | Review and merge https://github.com/DaxHack/Dax-Collective/pull/3 when ready. |
| Public legal copy | Approve Privacy, Terms, Disclosure, and OAuth wording as public-facing business/legal copy. |
| Public publishing | Approve each content item before YouTube/TikTok/Instagram publishing. |
| Ani-Dax voice | Provide Daniel narration, approve a narrator, or authorize/configure a TTS provider. |
| OAuth/MFA | Complete any account-owner consent, MFA, CAPTCHA, or OAuth repair needed in Google/YouTube/n8n/platform accounts. |
| Paid services | Approve any paid TTS/image/video/API/tool subscription before use. |
| God's Vessel collection approval | Review and approve Names of God theology, design direction, garment choices, pricing, vendor, and public launch timing. |
| God's Vessel commerce setup | Complete any Printify/Shopify login, OAuth, MFA, payment, tax, shipping, and store settings needed before products can be sold. |
| Firebase client config in GitHub | Add or confirm `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID`, and `REACT_APP_FIREBASE_MEASUREMENT_ID` as repository Secrets or Variables. |
| Time-Zone Travelers sample approval | Review the Tokyo vs Seoul night-owl decision guide sample package, approve/revise the script, and approve any public publishing target. |
| Time-Zone Travelers voice | Provide or approve final narration/TTS before the sample can become a public video. |
| Travel monetization | Approve any travel affiliate program enrollment, affiliate links, sponsorships, or paid provider use before monetized publishing. |
| Dax the Traveler support package approval | Review the Puerto Rico repurposing package, approve/revise the source assets and angle, and approve any public publishing target. |
| Dax the Traveler voice protection | Provide Daniel narration or explicitly approve an alternate narrator/TTS. No AI voice replacement should be used without Daniel approval. |
| Dax the Traveler monetization | Approve any affiliate links, sponsorships, product claims, or monetized CTA before public use. |

## External Provider / Runtime Blockers

| Blocker | Evidence | Next Action |
| --- | --- | --- |
| Local TTS unavailable | Windows SAPI test failed: no installed voice available. | Use approved external TTS or human audio file. |
| n8n runtime not verified | Repository contains JSON templates but no connected runtime evidence. | Inspect n8n instance/credentials when available. |
| Invalid workflow JSON | `workflow_12_data_collection_agent.json.json` parse failure. | Repair or remove duplicate/broken export. |
| Publishing credentials unverified | Publisher templates reference multiple platform credentials. | Verify non-secret credential health in n8n, do not expose values. |
| Commerce credentials unverified | Repository references ecommerce automation paths, but Printify/Shopify runtime access was not verified. | Verify account connections and non-secret credential health before creating live products. |
| Full Firebase Auth runtime unverified | Code is hardened and public routes render without config, but real auth/admin behavior needs the actual Firebase client config values in GitHub Actions. | Add config values, then verify PR/merge deploy and admin sign-in flow. |
| Time-Zone Travelers n8n workflow not production-safe | Existing workflow lacks an explicit approval gate, credentials are unverified, and it contains unsupported Patreon/affiliate assumptions. | Repair and test in draft mode before any runtime execution or publishing. |
| Time-Zone Travelers final audio missing | Sprint 3 proof render is silent by design. | Use Daniel-approved narration or approved TTS before public approval. |
| Dax the Traveler n8n workflows not production-safe | Existing workflows are AI-first, credentials are unverified, and they include public upload or monetization assumptions. | Repair around existing Daniel media inventory, approval gates, and account mapping before runtime use. |
| Dax the Traveler live analytics unavailable | Repository session did not have verified platform analytics. | Connect/read channel analytics only with correct account mapping and without exposing credentials. |
| Dax the Traveler final audio missing | Sprint 4 support proof render is silent by design. | Use Daniel-approved narration or approved TTS before public approval. |

## Not Blockers

- Frontend build warnings: build succeeds.
- Lack of public publishing: intentional until approval.
- Lack of final Ani-Dax voice: local pipeline can still generate concept/QC/render proof and wait for approved audio.
- God's Vessel having zero live products: intentional until theology, design, vendor, pricing, and storefront setup are approved.
- Time-Zone Travelers not publishing yet: intentional until Daniel approves the content, account mapping, and any monetized links.
- Dax the Traveler not publishing yet: intentional until Daniel approves the personal-brand draft, narration, account mapping, and any monetized links.
