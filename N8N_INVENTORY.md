# n8n Inventory

Generated from `npm run n8n:inventory` on 2026-09-14.

The full machine-readable inventory is in `artifacts/n8n-inventory.json`.

## Summary

- Templates found: 30
- Invalid JSON: 1
- Active templates: 0 in repository exports
- Verified working runtime workflows: 0
- Partial Ani-Dax generation templates: 2
- Publisher templates: present, now default to private/review language where repaired, require approved status where repaired, and remain blocked until credentials and Daniel approval are verified
- Time-Zone Travelers generation template: present but partial; prompts were hardened away from unsupported Patreon/affiliate claims, but it is still not safe to run publicly as-is
- Public YouTube privacy status scan: repository templates now use `private`

- Sprint 7 workflow safety assertions passed for modified exports: JSON parses, node counts preserved, intended safety renames/disables only
- Generic YouTube publisher now requires `Approved`, writes `Private Draft Created`, keeps upload privacy `private`, and disables automatic Twitter/Facebook cross-post nodes
- Revenue/analytics/financial templates now use readiness/bookkeeping language and verified provider data only; financial tax/payment alert nodes are disabled in the export


## Sprint 1 Relevant Workflows

| File | Classification | Notes |
| --- | --- | --- |
| `n8n/templates/workflow_ani_dax_video_generator.json` | PARTIAL | Reads Ani-Dax sheet, uses DeepSeek/OpenAI-style node, ElevenLabs, Pexels, FFmpeg, Discord. Needs credentials, QC, safer visual sourcing, approval gate. |
| `n8n/templates/ani_dax_specific_workflow.json` | WORKS WITH REPAIR | Useful skeleton; YouTube upload is now private and approval status is required, but runtime QC, credential verification, and source safety still need repair before use. |
| `n8n/templates/workflow_automated_youtube_publisher.json` | BLOCKED / SAFER PRIVATE-DRAFT TEMPLATE | Multi-brand YouTube publisher export now filters for `Approved`, creates private YouTube drafts, writes `Private Draft Created`, and has Twitter/Facebook cross-post nodes disabled. Requires verified account mapping, credentials, runtime test, and Daniel approval before any public publishing. |
| `n8n/templates/workflow_tiktok_instagram_publisher.json` | BLOCKED | Requires TikTok/Instagram credentials, file hosting/media URLs, platform approval. Do not run publicly. |
| `n8n/templates/fixed_workflow_multi_format_video_creator.json` | UNTESTED | FFmpeg-oriented webhook template. Possible reuse target for render stage after queue/QC repair. |
| `n8n/scripts/video_creation_scripts.py` | PARTIAL / UNTESTED | Has video-creation logic but assumes `/app` paths plus PIL/OpenCV dependencies. Not tested as usable in this Windows worktree. |

## Sprint 3 Relevant Workflows

| File | Classification | Integrations | Notes |
| --- | --- | --- | --- |
| `n8n/templates/workflow_timezone_travelers_video_generator.json` | PARTIAL / WORKS WITH REPAIR | Google Sheets, OpenWeather, AI text generation, ElevenLabs, Pexels, image generation, FFmpeg, Discord | Useful rough skeleton for a travel pipeline. Prompts now require source caveats and approved monetization placeholders, but inactive repo export, unverified credentials, and missing explicit Daniel approval gate remain. Do not run publicly as-is. |
| `n8n/templates/workflow_blog_auto_publisher.json` | BLOCKED / UNTESTED | Blog/social publishing, likely AI text, platform publishing | May be reusable only after brand mapping, approval gates, source checks, and monetization wording are repaired. Do not publish travel content through it yet. |
| `n8n/templates/workflow_tiktok_instagram_publisher.json` | BLOCKED | TikTok, Instagram, media hosting/platform credentials | Cross-platform publisher candidate, but requires verified account mapping, Daniel approval, and a safe review queue before use. |
| `n8n/templates/workflow_8_analytics_dashboard.json` | UNTESTED | Analytics/dashboard nodes | Possible analytics reuse candidate after platform credentials and tracking schema are verified. |

## Sprint 4 Relevant Workflows

| File | Classification | Integrations | Notes |
| --- | --- | --- | --- |
| `n8n/templates/dax_traveler_specific_workflow.json` | PARTIAL / WORKS WITH REPAIR | Google Sheets, OpenAI, Fal, ElevenLabs, YouTube | Reads a content sheet and now uses private upload/review-oriented copy, but credentials, Daniel source-material checks, final voice approval, and runtime approval gates remain unverified. Do not run publicly as-is. |
| `n8n/templates/workflow_15_dax_traveler_video_automatio  n.json` | PARTIAL / WORKS WITH REPAIR | Cron, OpenAI, ElevenLabs, stock images, executeCommand, YouTube, Google Sheets, Slack | Useful high-level skeleton. Prompts now protect Daniel's personal experience and monetized CTAs, but it remains inactive/unverified and needs source inventory + approval enforcement before runtime use. |
| `n8n/templates/dax_collective_multi_brand_workflow.json` | BLOCKED / NEEDS REPAIR | Multi-brand AI generation and YouTube metadata | Includes Dax the Traveler defaults and private YouTube metadata, but still needs account mapping, approval gates, and personal-brand safeguards. |
| `n8n/templates/workflow_8_analytics_dashboard.json` | UNTESTED | Analytics/dashboard nodes | Possible reuse for Dax the Traveler historical performance once platform credentials and channel mapping are verified. |

## Broken

- `n8n/templates/workflow_12_data_collection_agent.json.json`
  - Error: `Unexpected end of JSON input`
  - Status: BROKEN

## Publishing Safety

Publishing templates must remain blocked until all are true:

- Daniel approves the specific content item.
- The target brand account is verified.
- The credential maps to the correct brand/channel.
- The workflow has an approval gate.
- The workflow has QC and copyright checks.
- The workflow writes success/failure state back to a tracking system.

## Recommended Repair Order

1. Repair Ani-Dax generation first, not publisher first.
2. Add queue schema: `Draft`, `Needs Canon Check`, `Needs Voice`, `Ready For Daniel Review`, `Approved`, `Published`.
3. Replace unsafe anime visual sourcing with original motion templates and approved assets.
4. Add cost estimate fields before any external model/TTS call.
5. Add publish gate requiring explicit approved status and brand account mapping.
6. Only then wire YouTube/TikTok/Instagram publishing.
7. Repair Time-Zone Travelers generation by adding source-verification fields, approval gates, honest affiliate state, and a safe publish queue before any runtime import/execution.
8. Repair Dax the Traveler automation around Daniel's existing media inventory first, then add draft queue, Daniel approval, final voice confirmation, and platform account mapping before any publishing.

## Current Classifications

See `artifacts/n8n-inventory.json` for every workflow row, node types, credential names, and generated classification.
