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

## External Provider / Runtime Blockers

| Blocker | Evidence | Next Action |
| --- | --- | --- |
| Local TTS unavailable | Windows SAPI test failed: no installed voice available. | Use approved external TTS or human audio file. |
| n8n runtime not verified | Repository contains JSON templates but no connected runtime evidence. | Inspect n8n instance/credentials when available. |
| Invalid workflow JSON | `workflow_12_data_collection_agent.json.json` parse failure. | Repair or remove duplicate/broken export. |
| Publishing credentials unverified | Publisher templates reference multiple platform credentials. | Verify non-secret credential health in n8n, do not expose values. |
| Commerce credentials unverified | Repository references ecommerce automation paths, but Printify/Shopify runtime access was not verified. | Verify account connections and non-secret credential health before creating live products. |

## Not Blockers

- Frontend build warnings: build succeeds.
- Lack of public publishing: intentional until approval.
- Lack of final Ani-Dax voice: local pipeline can still generate concept/QC/render proof and wait for approved audio.
- God's Vessel having zero live products: intentional until theology, design, vendor, pricing, and storefront setup are approved.
