# Next Session Handoff

## What To Do Next

1. Continue from worktree:
   `C:\Users\Daniel Rollins\AppData\Local\Temp\dax-collective-legal-oauth-20260913`
2. Confirm branch:
   `codex/legal-oauth-pages-20260913`
3. Push the latest local commit(s) to PR #3:
   https://github.com/DaxHack/Dax-Collective/pull/3
4. Wait for Firebase PR workflow to pass after the latest push.
5. Continue Sprint 3 Time-Zone Travelers by inspecting existing workflow/page/runtime state first.
6. Continue Sprint 1 repair work opportunistically around:
   - approval gates
   - QC
   - cost tracking
   - safe original visual generation/composition
   - accepted narration file input
   - render to reviewable final draft

## Where To Find It

- Sprint status: `EXECUTION_STATUS.md`
- n8n inventory summary: `N8N_INVENTORY.md`
- full n8n inventory: `artifacts/n8n-inventory.json`
- blockers: `BLOCKERS.md`
- Ani-Dax sample generator: `tools/anidax/produce-sample.mjs`
- Reusable Ani-Dax invocation:
  `node tools/anidax/produce-sample.mjs --topic "..." --series "..." --audio-file path/to/approved.wav`
- n8n inventory generator: `tools/n8n/inventory.mjs`
- Ani-Dax sample output: `artifacts/anidax/sprint-1-sample/`
- God's Vessel collection generator: `tools/gods-vessel/produce-names-of-god.mjs`
- Reusable God's Vessel invocation:
  `npm run gods-vessel:collection`
- God's Vessel sample output: `artifacts/gods-vessel/names-of-god/`
- God's Vessel public assets: `dax-main/public/assets/gods-vessel/names-of-god/`
- God's Vessel page data: `dax-main/src/data/godsVesselNamesOfGod.js`

## What Has Already Been Verified

- Legal/OAuth pages/routes/footer/homepage disclosure exist on PR branch.
- `og:url` is corrected to `https://daxcollective.com`.
- `npm run anidax:sample` generated a proof package and FFmpeg video.
- `tools/anidax/produce-sample.mjs` accepts custom topic/series/title/angle/out/audio-file arguments.
- `npm run n8n:inventory` parsed templates and flagged one invalid JSON export.
- `npm --prefix dax-main run build` passes with warnings.
- FFmpeg is installed and usable.
- Local Windows TTS is not usable in this environment.
- `npm run gods-vessel:collection` generates five Names of God SVG designs, metadata, theology review, and commerce readiness notes.
- `/gods-vessel` has been repaired to show the real draft state: no live products, no checkout, no fake testimonials, no fake follower/lives-transformed claims.
- God's Vessel interest CTAs use direct gtag custom events when analytics exists.

## What Not To Repeat

- Do not redo legal/OAuth implementation from scratch.
- Do not redesign the website.
- Do not assume n8n templates are live working workflows.
- Do not run public publisher workflows.
- Do not create live God's Vessel products or claim live commerce without Daniel/vendor approval.
- Do not restore the old fake God's Vessel apparel/testimonial/follower claims.
- Do not create new credentials unless credential repair/reuse is impossible and Daniel approves.
- Do not base Ani-Dax on ripped anime clips.

## What Requires Daniel

- Merge/deploy approval.
- Legal copy approval.
- OAuth/MFA/account-owner consent.
- Voice/narration path approval.
- God's Vessel theology/design/vendor/pricing approval.
- Printify/Shopify account-owner login, OAuth, MFA, payment, tax, shipping, and launch approval.
- Any paid service approval.
- Any public publishing approval.

## What Can Be Done Autonomously

- Repair JSON/template structure.
- Add local render/test tooling.
- Add QC/cost/approval gates.
- Add queue schemas and sample data.
- Build deterministic motion-graphic templates.
- Create draft concepts and non-public sample assets.
- Generate/update God's Vessel draft collection assets and metadata.
- Repair Time-Zone Travelers workflows/pages/metadata where the behavior can be tested without publishing or paid enrollment.
- Run builds/tests.
- Commit and update PRs.

## Current Sprint

Sprint 2 God's Vessel is PARTIAL but has a working first collection draft path. Commit/push the current Sprint 2 changes if they are not already pushed, wait for PR checks, then begin Sprint 3 Time-Zone Travelers by inspecting existing workflow inventory and runtime claims before adding anything new.
