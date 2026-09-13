# n8n Inventory

Generated from `npm run n8n:inventory` on 2026-09-13.

The full machine-readable inventory is in `artifacts/n8n-inventory.json`.

## Summary

- Templates found: 30
- Invalid JSON: 1
- Active templates: 0 in repository exports
- Verified working runtime workflows: 0
- Partial Ani-Dax generation templates: 2
- Publisher templates: present but blocked until credentials and Daniel approval are verified

## Sprint 1 Relevant Workflows

| File | Classification | Notes |
| --- | --- | --- |
| `n8n/templates/workflow_ani_dax_video_generator.json` | PARTIAL | Reads Ani-Dax sheet, uses DeepSeek/OpenAI-style node, ElevenLabs, Pexels, FFmpeg, Discord. Needs credentials, QC, safer visual sourcing, approval gate. |
| `n8n/templates/ani_dax_specific_workflow.json` | WORKS WITH REPAIR | Useful skeleton but includes direct YouTube public upload and no render/QC/approval gate. Do not run as-is. |
| `n8n/templates/workflow_automated_youtube_publisher.json` | BLOCKED | Multi-brand YouTube publisher. Requires verified account mapping and Daniel approval before any public publishing. |
| `n8n/templates/workflow_tiktok_instagram_publisher.json` | BLOCKED | Requires TikTok/Instagram credentials, file hosting/media URLs, platform approval. Do not run publicly. |
| `n8n/templates/fixed_workflow_multi_format_video_creator.json` | UNTESTED | FFmpeg-oriented webhook template. Possible reuse target for render stage after queue/QC repair. |
| `n8n/scripts/video_creation_scripts.py` | PARTIAL / UNTESTED | Has video-creation logic but assumes `/app` paths plus PIL/OpenCV dependencies. Not tested as usable in this Windows worktree. |

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

## Current Classifications

See `artifacts/n8n-inventory.json` for every workflow row, node types, credential names, and generated classification.
