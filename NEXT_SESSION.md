# Next Session Handoff

## What To Do Next

1. Continue from worktree:
   `C:\Users\Daniel Rollins\AppData\Local\Temp\dax-collective-legal-oauth-20260913`
2. Confirm branch:
   `codex/legal-oauth-pages-20260913`
3. Push the latest local commit(s) to PR #3:
   https://github.com/DaxHack/Dax-Collective/pull/3
4. Wait for Firebase PR workflow to pass after the latest push.
5. Continue Sprint 1 by repairing Ani-Dax generation flow around:
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

## What Has Already Been Verified

- Legal/OAuth pages/routes/footer/homepage disclosure exist on PR branch.
- `og:url` is corrected to `https://daxcollective.com`.
- `npm run anidax:sample` generated a proof package and FFmpeg video.
- `tools/anidax/produce-sample.mjs` accepts custom topic/series/title/angle/out/audio-file arguments.
- `npm run n8n:inventory` parsed templates and flagged one invalid JSON export.
- `npm --prefix dax-main run build` passes with warnings.
- FFmpeg is installed and usable.
- Local Windows TTS is not usable in this environment.

## What Not To Repeat

- Do not redo legal/OAuth implementation from scratch.
- Do not redesign the website.
- Do not assume n8n templates are live working workflows.
- Do not run public publisher workflows.
- Do not create new credentials unless credential repair/reuse is impossible and Daniel approves.
- Do not base Ani-Dax on ripped anime clips.

## What Requires Daniel

- Merge/deploy approval.
- Legal copy approval.
- OAuth/MFA/account-owner consent.
- Voice/narration path approval.
- Any paid service approval.
- Any public publishing approval.

## What Can Be Done Autonomously

- Repair JSON/template structure.
- Add local render/test tooling.
- Add QC/cost/approval gates.
- Add queue schemas and sample data.
- Build deterministic motion-graphic templates.
- Create draft concepts and non-public sample assets.
- Run builds/tests.
- Commit and update PRs.

## Current Sprint

Sprint 1 Ani-Dax is PARTIAL. The local concept/package/render-proof path works, and the script has an `--audio-file` path for approved narration. Next step is to test that path with real approved narration and connect the package to a safe queue/QC workflow without publishing.
