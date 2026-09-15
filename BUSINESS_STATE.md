# Dax Business State

Generated: 2026-09-15T17:36:36.715Z

This is a non-secret shared operating state for Codex, Claude, ChatGPT, and future agents. It is generated from repository files and local artifacts, not from private credential values.

## Permissions

- Read: allowed
- Draft: allowed
- Workflow edit: allowed_logged
- Public publish: approval_required
- Purchase/ad spend/credential changes: Daniel approval required

## Brands

| Brand | Queue Items | Ready For Review | Public Publishing Allowed |
| --- | ---: | ---: | --- |
| Ani-Dax | 1 | 1 | no |
| God's Vessel | 1 | 1 | no |
| Time-Zone Travelers | 1 | 1 | no |
| Dax the Traveler | 1 | 1 | no |

## Content Queue

| Brand | Content ID | Status | Publish Allowed | Next Action |
| --- | --- | --- | --- | --- |
| Ani-Dax | anidax-2026-09-14-why-subaru-s-return-by-death-is-not-a-power-fantasy | READY_FOR_APPROVAL_PACKAGE | no | Approve concept/script and final voice/visual style before publishing. |
| God's Vessel | gods-vessel-names-of-god | READY_FOR_DANIEL_REVIEW_AND_VENDOR_SETUP | no | Review prepared storefront/Printify/Shopify draft listing package, then approve theology, product copy, final Canva masters, vendor setup, and storefront path. |
| Time-Zone Travelers | tzt-2026-09-13-tokyo-seoul-night-owl | READY_FOR_DANIEL_REVIEW | no | Approve concept/script, final source check, narration, account mapping, and links. |
| Dax the Traveler | dtt-2026-09-13-puerto-rico-repurpose | READY_FOR_DANIEL_REVIEW | no | Approve/revise selected assets and record final narration. |

## Workflow Health

- Templates inventoried: 30
- Active templates in repo export: 0
- n8n runtime credentials: UNVERIFIED_FROM_REPOSITORY_ONLY
- Firebase PR preview service account: WORKING_FOR_PR_PREVIEW
- Firebase browser config: NEEDS_DANIEL_GITHUB_SECRET_OR_VARIABLE_VALUES_FOR_FULL_AUTH_RUNTIME

## Revenue Readiness

- Status: REVENUE_READY_FOR_APPROVAL_NOT_EARNING
- Verified revenue: $0
- Verified profit: $0
- Public publishing allowed: no
- Purchase/enrollment allowed: no

## Tool Access

- Build state: `npm run business-state:build`
- Build revenue readiness: `npm run revenue:readiness`
- Query brands: `npm run business-state:query -- list-brands`
- Query queue: `npm run business-state:query -- content-queue`
- Query workflow health: `npm run business-state:query -- workflow-health`
- Query credential health: `npm run business-state:query -- credential-health`

## Hard Rule

This state layer does not grant permission to publish, purchase, delete, spend, or change credentials. Those actions still require Daniel approval.
