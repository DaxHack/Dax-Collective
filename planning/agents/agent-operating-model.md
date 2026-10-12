# Agent Operating Model

## Input Contract

Every agent should accept:

- `brand`
- `content_type`
- `platform`
- `objective`
- `source_context`
- `review_required`

For company operations agents, `brand` may be `dax-collective`.

## Output Contract

Every agent should return:

- `agent_id`
- `brand`
- `status`
- `summary`
- `recommended_actions`
- `assets_needed`
- `review_required`
- `publish_allowed`

For video agents, also return:

- `title`
- `script`
- `scenes`
- `cta`
- `tags`
- `duration_seconds`
- `thumbnail_prompt`
- `video_package_status`

For post agents, also return:

- `caption`
- `platform_variant`
- `hashtags`
- `cta`
- `image_or_video_needed`

For itinerary agents, also return:

- `destination`
- `duration`
- `budget_tier`
- `day_by_day_plan`
- `current_research_needed`
- `safety_notes`

For merch, sticker, and design agents, also return:

- `design_brief`
- `intended_product`
- `print_specs`
- `safe_margin_notes`
- `source_asset_notes`
- `originality_check`

## Review Gates

Use these statuses:

- `draft_created`
- `assets_needed`
- `video_ready`
- `manual_review_required`
- `approved_for_publish`
- `published`
- `blocked`

Default status for generated output:

`manual_review_required`

## Prohibited Defaults

Agents must not default to:

- public upload
- public post
- monetization claim
- account creation
- credential creation
- secret export
- deleting existing assets

## Required QA Coverage

Compliance and QA Agent must check every post, video, itinerary, merch concept, sticker concept, and design brief before public use.

Minimum checks:

- brand fit
- platform fit
- copyright or derivative-art risk
- unsupported claims
- missing CTA
- missing asset requirements
- manual review status
- publishing disabled until approved

## Escalation Conditions

Ask for user action when an agent needs:

- OAuth login
- two-factor approval
- platform account creation
- API approval
- page/channel ownership verification
- production deployment
