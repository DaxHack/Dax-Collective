# Legacy Workflow Agent Attachment Map

Date: 2026-06-03

## What changed

Existing n8n workflow templates were extended instead of duplicated.

- Added `DAX Agent Attachment` sticky notes to legacy workflows so the agent role and manual-review requirement are visible inside n8n.
- Added `DAX Publish Guard` code nodes in front of detected public publishing actions.
- Repaired the zero-byte `workflow_12_data_collection_agent.json.json` placeholder as an inactive manual Data Collection Agent workflow.
- Saved the repeatable patch script at `n8n/scripts/attach-agents-to-workflows.ps1`.

The project template JSON files keep a `daxAgentAttachment` metadata block. n8n strips unknown root-level workflow properties during import/export, so the live n8n workflows use sticky notes and guard nodes as the durable attachment markers.

## Live n8n verification

Final export after restart:

- Total workflows: 44
- Workflows with `DAX Agent Attachment` notes: 38
- Workflows with `DAX Publish Guard` nodes: 15
- Publisher workflows remain inactive.

Active workflows after the update:

- `DAX-04 Company Startup Operator - Manual Review`
- `workflow_2_global_error_handler.json`

`MCP Test Workflow` was active before import, but n8n CLI deactivated it during import and approval to reactivate it was blocked because its side effects were not established. Reactivate it manually only if you know what it does.

## Publisher safeguards

Public publishing nodes are now gated by both checks:

- `DAX_ENABLE_PUBLIC_PUBLISHING` must equal `true`.
- Incoming item data must be approved with `reviewStatus`, `review_status`, `approvalStatus`, or `approvedForPublish`.

If those checks are not met, the guard returns no items and the public publishing node does not run.

## Repaired workflow

`workflow_12_data_collection_agent.json.json` was empty. It is now an inactive manual workflow named `Data Collection Agent`.

It prepares brand collection tasks for:

- Dax Collective
- Dax The Traveler
- Time-Zone Travelers
- Ani-Dax
- God's Vessel

It does not collect secrets, call external APIs, or publish content.

## User-only blockers

These still require account-owner action before public automation can be enabled:

- Create or confirm TikTok accounts.
- Create or confirm Instagram accounts.
- Create Facebook Pages under the existing Facebook account.
- Create or confirm YouTube channels and OAuth app access.
- Provide a stable public n8n URL for OAuth callbacks.
- Add secrets only inside n8n credentials or platform consoles, not workflow JSON or repo files.

