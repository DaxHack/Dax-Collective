# Dax Collective AI Agent System

This folder is the source of truth for Dax Collective agents.

The current system is intentionally manual-review-first:

- agents may plan, script, package, queue, and create local review videos
- agents may not publish to YouTube, TikTok, Instagram, or Facebook without a separate connected-account workflow and explicit review gate
- secrets stay in platform credential stores or local env files, never in agent prompts or workflow JSON

## Agent Groups

Brand video agents:

- Dax Collective Parent Hub Video Agent
- Dax the Traveler Video Agent
- Time-Zone Travelers Video Agent
- Ani-Dax Video Agent
- God's Vessel Video Agent

Output-specific production agents:

- Social Post Agent
- Video Concept Agent
- Itinerary Agent
- Merch Design Agent
- Sticker Design Agent
- Brand Design Agent

Company operations agents:

- Operations Director Agent
- Content Strategy Agent
- Scriptwriting Agent
- Video Production Agent
- Asset Management Agent
- Publishing Scheduler Agent
- Analytics Agent
- Revenue Agent
- Community Agent
- Compliance and QA Agent
- Platform Setup Agent
- Error Handler Agent

## n8n Workflows

Importable workflow scaffolds are stored in:

`n8n/templates`

Primary files:

- `workflow_00_dax_ai_agent_master_router.json`
- `workflow_01_all_brand_video_agents_manual_review.json`
- `workflow_02_company_operations_agents_daily_brief.json`
- `workflow_03_platform_account_setup_blockers.json`
- `workflow_04_company_startup_operator_manual_review.json`

Prompt library:

- `agent-prompt-library.md`

## Operating Rule

Each agent output must include a review status. Anything that creates or modifies public-facing content should end as:

`manual_review_required`

Publishing workflows can be added only after the relevant accounts are connected and tested with read-only actions.

## Covered Output Types

The agent system covers:

- posts
- videos
- itineraries
- merch
- stickers
- logo/design assets
- thumbnails
- banners
- profile images
- platform setup and OAuth readiness
