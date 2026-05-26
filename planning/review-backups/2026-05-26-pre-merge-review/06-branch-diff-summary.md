# Branch Difference Summary — 2026-05-26

## Situation

Local `main` and `origin/clean-local-main-baseline` have **NO COMMON ANCESTOR**.
They are two completely separate git histories that evolved in parallel:

| Branch | Origin | State |
|--------|--------|-------|
| `main` (local + origin/main) | Local development | Most current app code |
| `origin/clean-local-main-baseline` | Manus/Replit AI work | Reconciled foundation |
| `origin/master` | Early Replit bootstrap | Obsolete skeleton |

---

## origin/clean-local-main-baseline — What's in it

**Commits unique to this branch (not in main):**
```
d4bdd9b80  Merge pull request #1 from DaxHack/reconcile/foundation-from-local
0add392f0  Delete logo_subaru_concept.png
948b9dccf  Add AuthContext for app-wide authentication state
9e09f4cd3  Add brand-specific n8n workflow templates
b7099b798  Add n8n docs and workflow import script
cbbb80a38  Add Ani-Dax brand image assets
c305ba563  Add BrandGallery component and styles
696caaaec  Add analytics utility for navigation tracking
7ebe4ca83  Add Dax the Traveler branded content assets
054305f45  Add Dax Investor brand assets
18c887afc  Add safe brand assets and docs
1cdab4499  Harden Firebase credential handling
7f6497551  Fix approved media hero layout
834ebf859  Add approved media library foundation
```

**151 files differ between main and this branch.**

### Files of interest in clean-local-main-baseline NOT in main:
- `dax-main/src/config/AuthContext` — Authentication context provider (app-wide auth state)
- `n8n/templates/` — Brand-specific n8n workflow templates
- Brand image assets for ani-dax, dax-the-traveler (may already exist in main via other path)
- `dax-main/env.production` — tracked file, **check for real secrets before review**

### Files in clean-local-main-baseline that are RISKY:
- `dax-backend/credentials/firebase-adminsdk.json` — STILL TRACKED in that branch ⚠️
  Do not do a full merge or git checkout of this branch — that file would re-enter working tree.

### What main has that clean-local-main-baseline does NOT:
- TikTok/Instagram publishing workflows (845431cef)
- Time-Zone Travelers video generation workflow
- Updated page components (AniDaxPage, GodsVesselPage, TimeZoneTravelersPage, DaxTheTravelerPage)
- BrandGallery.css base styles
- FloatingBubbles performance fix
- imageSourcer.sourceImagesForBrand()
- uploadApi.js env var fix
- Cleaned .gitignore structure

---

## origin/master — What's in it

One orphan commit: "Initial commit of Dax Collective website with Next.js framework"

- This is the earliest Replit bootstrap, likely a Next.js skeleton
- Current app is React (CRA), not Next.js
- **Not useful. Do not merge.**

---

## Local backup branches

| Branch | Status | Action |
|--------|--------|--------|
| `backup-before-secret-cleanup` | Identical to current main (6d042fc0c) | Safe to keep as tag; no action needed |
| `backup-before-full-manus` | Ancestor of current main (d5a81d6d0) | Pre-Manus state; fully superseded; safe to leave or delete |

---

## Safe cherry-pick candidates from clean-local-main-baseline

If you want specific content from the Manus branch without a full merge:

```bash
# Preview a file before taking it:
git show origin/clean-local-main-baseline:dax-main/src/config/AuthContext.js

# Take only that file into a local change (not yet committed):
git checkout origin/clean-local-main-baseline -- dax-main/src/config/AuthContext.js
```

**DO NOT run:** `git merge origin/clean-local-main-baseline`
This will trigger unrelated-histories conflicts across 151 files.

---

## Recommendation

1. Keep `main` as the authoritative branch (it has more current work)
2. Use the cherry-pick approach above for any specific files you want from Manus work
3. Eventually delete the Manus/Replit branches from GitHub after confirming they're not needed:
   - `origin/clean-local-main-baseline`
   - `origin/master`
   - `origin/reconcile/foundation-from-local`
