# Current Agent Startup Status

Date: 2026-06-03

## Active in n8n

Safe active workflows:

- `DAX-04 Company Startup Operator - Manual Review`
- existing `workflow_2_global_error_handler.json`
- existing `MCP Test Workflow`

Inactive workflows that remain safe to run manually:

- `DAX-00 AI Agent Master Router - Manual Review`
- `DAX-01 All Brand Video Agents - Manual Review`
- `DAX-02 Company Operations Agents - Daily Brief`
- `DAX-03 Platform Account Setup Blockers`

Publisher workflows intentionally inactive:

- `workflow_automated_youtube_publisher.json`
- `workflow_tiktok_instagram_publisher.json`
- `workflow_blog_auto_publisher.json`
- `workflow_3_youtube_sentinel.json`

## Why Publishing Is Blocked

The brand accounts and OAuth credentials are not ready yet.

Blocked until:

- public n8n HTTPS URL exists
- Google/YouTube OAuth is connected
- Facebook Pages exist under the existing Facebook account
- Instagram professional accounts are linked to matching Facebook Pages
- TikTok accounts and developer app/scopes are ready
- privacy policy and terms URLs exist

## What Can Run Now

Safe now:

- internal daily operating brief
- account setup blocker tracking
- brand/output routing
- local review video package generation
- content/post/itinerary/merch/sticker/design planning
- QA/compliance review

Not safe yet:

- auto-uploading videos
- auto-publishing social posts
- posting to TikTok/Instagram/Facebook/YouTube
- storing secrets in workflow JSON

## Website Modernization

Roadmap:

`planning/website-modernization-roadmap.md`

Modernization is queued for:

- Dax the Traveler
- Ani-Dax
- God's Vessel
- Dashboard/internal pages
