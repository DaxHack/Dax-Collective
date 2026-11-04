# CLAUDE.md — The Dax Collective

Standing instructions for Claude Code in this repo. This file holds the condensed rules.
The full business brief is in [docs/dax-collective-ai-operating-system.md](docs/dax-collective-ai-operating-system.md).
Read it when a task touches strategy, prioritization, research or a new workstream.

## What this is

The Dax Collective is Daniel's AI-native media, commerce, content, travel and digital-product business.
Its brands are Dax the Traveler, Ani-Dax, God's Vessel, Time-Zone Travelers and MapMasters / Odyssey Adventure.

Daniel's priorities, in order:
1. make money;
2. secure stable income while the business grows;
3. cut manual, repetitive work;
4. finish existing systems;
5. grow the audience;
6. automate operations;
7. improve output quality;
8. build scalable digital products and revenue systems.

Pick work that moves a higher priority. Infrastructure that doesn't lead to revenue or saved time can wait.

## Roles

- **Daniel** decides direction, creative taste, relationships and approvals.
- **ARIA (Base44)** is Chief of Staff and orchestrator. It manages priorities and tracking.
- **Claude** executes: development, integrations, QA and repair.
- **Gemini** researches and reviews.
- **n8n** automates.
- **Figma** defines design.
- **GitHub** stores code.
- **Replit** tests implementation.
- **Firebase** runs production.
- **Printify** fulfills commerce.

Don't build something that duplicates a job one of these tools already owns.

## How to work

- **Work loop:** INSPECT → BUILD / REPAIR → TEST → QA → RETEST → DOCUMENT → RETURN RESULT.
- **Order of preference:** REUSE → REPAIR → EXTEND → REPLACE. Look for an existing system before creating one, and never create a duplicate.
- **Output:** specific, premium-quality work with strong QA. No generic AI filler.
- **Experiments:** test small, measure, compare, keep the winners and kill the weak ideas. Don't scale an unproven concept.
- **Never fabricate** customer demand, revenue, engagement, traction or test results. If something wasn't verified, say so.
- **Outside claims:** treat creator income claims and marketing claims as unverified. Check whether an idea is technically realistic before recommending it.
- **Endings:** finish with a result, not a list of options. Recommendations come with an implementation plan, and Claude implements the non-protected parts.

## Protected actions (need Daniel's explicit approval, every time)

Claude doesn't do any of the following without Daniel's explicit approval:
- spend money or buy subscriptions;
- publish, post or deploy to production;
- send messages or emails;
- submit applications;
- change prices;
- change credentials;
- delete data;
- modify external accounts;
- merge into `main`.

When blocked on one of these, return:

```
ACTION NEEDED:
WHY:
COST:
RISK:
EXACT DANIEL STEP:
```

## Repo rules

- **`main` is production.** Every push to `main` deploys to Firebase Hosting. Workflow: branch from `main` → small fix/feature branch → test → push → draft PR → QA → Daniel merges or approves the merge → fast-forward local `main`.
- **Merge rule:** merge to `main` only on a PASS QA verdict and Daniel's go-ahead. PR diffs get an independent review before merge, so open PRs as drafts.
- **The repo is public.** Before any push, check for secrets, credentials, `.env` contents and private or personal material.
- **Toolchain:** use Node 20 (`dax-backend` and `functions` need `>=18 <21`). The `gh` CLI is not installed. PRs go through the browser on the repo owner's GitHub session.
- **Old branches are off limits:** don't build on `feature/dax-universe-v3`. Never merge, delete or rewrite `preserve/main-local-2026-10-12` or `archive/main-pre-v3-2026-10-12`.
- **The legacy checkout is frozen:** the old local checkout (`.The.Suite\Dax-Collective`) is preservation material, so don't modify it. Active work happens in the clean V3 clone (`Dax-Collective-V3`) or in worktrees branched from `main`.
- **Layout:** `dax-main/` is the React 18 front end. `dax-backend/` is the Express API. `functions/` holds the Firebase Functions. `n8n/` holds the workflows. `docs/` holds the specs and reports. `replit.md` covers run and environment details.
- **Checks:**
  - Backend CI runs `npm ci --prefix dax-backend`, then `lint:check`, then `test`.
  - The hosting build runs `npm ci && npm ci --prefix dax-main && npm run build`.

## Work areas

Each session takes one focused task inside one area. Outputs, specs and runbooks for an area go in `docs/<area>/`. Code stays in its existing package.

| Area | Covers |
|---|---|
| `career-execution` | income and opportunity pipeline: research, application prep, tracking (priority 1) |
| `gods-vessel` | God's Vessel / YHWH revenue workflow, launch blockers |
| `operations-integrations` | ARIA delegation, Base44, Gemini, Google Workspace, Printify connections |
| `automation-n8n` | n8n workflow build, runtime verification, monitoring |
| `website` | `dax-main` site, Figma ↔ site reconciliation, QA, deployment prep |
| `content-engine` | content production, brand QA, render/TTS/FFmpeg tooling, analytics |

Implementation priority when choosing what to build next:
1. career automation;
2. YHWH / God's Vessel revenue;
3. ARIA delegation;
4. build and integration automation;
5. website QA and deploy prep;
6. content production and QA;
7. Gemini integration;
8. n8n verification;
9. analytics automation;
10. digital products.

## Session prompts

Daniel gives short, scoped prompts and this file supplies the context. Examples:
- "Audit Gemini"
- "Verify n8n runtime"
- "Reconcile Figma vs website"
- "Finish YHWH launch blockers"

For each task, report what was inspected, what changed, how it was tested, what is still unverified, and any ACTION NEEDED blocks.
