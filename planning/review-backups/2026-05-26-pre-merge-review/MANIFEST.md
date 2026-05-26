# Review Backup Manifest
**Created:** 2026-05-26  
**Folder:** `planning/review-backups/2026-05-26-pre-merge-review/`  
**Purpose:** Pre-merge/pre-commit safety snapshot of all potentially useful work.  
**Status:** FOR REVIEW ONLY — nothing has been committed, pushed, merged, or restored.

---

## What Was Backed Up

| File | Source | Contains Secrets? | Safe to Restore? |
|------|--------|-------------------|-----------------|
| `00-git-status.txt` | `git status` output | No | n/a — reference only |
| `01-git-log.txt` | `git log --all` output | No | n/a — reference only |
| `02-modified-files-summary.md` | Analysis of all modified files | No | n/a — reference only |
| `03-diff-gitignore.diff` | Summary of .gitignore changes | No | n/a — reference only |
| `04-diff-uploadApi.diff` | Summary of uploadApi.js fix | No | n/a — reference only |
| `05-diff-source-components.diff` | Summary of all component/page diffs | No | n/a — reference only |
| `06-branch-diff-summary.md` | Comparison of all branches vs main | No | n/a — reference only |
| `deleted-firebase-config.SANITIZED.js` | Recovered from git history (f5209aa25^) | **SANITIZED** — real keys replaced | See notes below |
| `deleted-firebase.json` | Recovered from git history (f5209aa25^) | No | See notes below |
| `deleted-EnhancedHome.jsx` | Recovered from git history (c36e0b969) | No | See notes below |
| `deleted-ProjectCard.jsx` | Recovered from git history (c36e0b969) | No | See notes below |

---

## Files Excluded From Backup

| File | Reason |
|------|--------|
| `dax-backend/credentials/firebase-adminsdk.json` | REAL SERVICE ACCOUNT CREDENTIAL — never back up |
| `dax-backend/.env` | Real secrets file — exists on disk only, never commit |
| Old `dax-main/.env.example` (diff) | Old version had partial key-like patterns in comments — excluded for safety |
| `dax-main/build/favicon.ico` | Binary file — not useful in text backup |
| `functions/serviceAccountKey.json` | Service account credential — never back up |
| `dax-backend/node_modules/**` | Generated dependencies — never back up |
| `dax-main/build/**` | Build output — not source, never back up |
| `package-lock.json` | Generated lockfile — not useful to back up |
| `dax-main/src/automation/Dashboard.jsx` | Partial recovery only — file was truncated in git history; incomplete component |

---

## Individual File Notes

---

### `deleted-firebase-config.SANITIZED.js`
- **Original path:** `dax-main/src/firebase/config.js`
- **Deleted in:** commit `f5209aa25`
- **Problem:** Original had hardcoded real Firebase credentials directly in source code
- **What was sanitized:** `apiKey` value replaced with `process.env.REACT_APP_FIREBASE_API_KEY`; all other values converted to `process.env.*` lookups with YOUR_* fallbacks
- **Current replacement:** `dax-main/src/config/firebase.js` (still tracked in main) likely handles the same purpose
- **Action:** DO NOT restore to `src/` directly. Check `src/config/firebase.js` first — it is the current file. If that file also has hardcoded values, migrate it to use `process.env.REACT_APP_FIREBASE_*` vars (already defined in `.env.example`).
- **Verdict:** DO NOT RESTORE — use as reference only for the structure

---

### `deleted-firebase.json`
- **Original path:** `dax-main/firebase.json`
- **Deleted in:** commit `f5209aa25`
- **Contains secrets:** No — only project structure config
- **Problem:** Pointed `"public": "public"` instead of `"build"` — likely outdated for CRA
- **Current state:** A root-level `firebase.json` exists for the project (different file)
- **Action:** Use as reference only if you need to configure dax-main Firebase Hosting separately. Do not restore without updating `"public": "build"` first.
- **Verdict:** REFERENCE ONLY — do not restore as-is

---

### `deleted-EnhancedHome.jsx`
- **Original path:** `dax-main/src/pages/EnhancedHome.jsx`
- **Deleted in:** commit `f5209aa25`
- **Contains secrets:** No
- **Useful for:** Visual inspiration — animated brand card grid layout, hero section with motion.h1, CTA section with RainbowWhiteEffect wrapper
- **Safe to restore directly:** NO — dependencies may no longer exist
- **Dependency check required before reuse:**
  - `EnhancedBrandCard` — check if `src/components/EnhancedBrandCard.jsx` exists
  - `EnhancedStatsSection` — check if `src/components/EnhancedStatsSection.jsx` exists
  - `RainbowWhiteEffect` — check if `src/components/RainbowWhiteEffect.jsx` exists
- **Known issues if rebuilt:**
  - Floating particles at bottom use `Math.random()` inside render — move to module-level constants (see FloatingBubbles.jsx fix for pattern)
  - Public copy: "Building a content empire" — replace with more polished brand voice
  - "Subscribe Now" button has no action wired up — needs real handler
- **Verdict:** REVIEW ONLY — useful as inspiration; needs full rewrite if reused

---

### `deleted-ProjectCard.jsx`
- **Original path:** `dax-main/src/components/ProjectCard.jsx`
- **Deleted in:** commit around `f9ac2da32` or earlier
- **Contains secrets:** No
- **What it does:** Simple reusable card for project/task display — title, description, status badge (completed/in-progress/pending), progress bar, due date
- **Dependencies:** React only
- **Safe to restore:** Yes, with review — it is clean and self-contained
- **Use case:** If you add a project tracker or kanban view, this is a good starting point
- **Verdict:** SAFE TO RESTORE if needed — no rewrites required

---

## Currently Modified Files (Unstaged in main) — Summary

All of these are safe and should be committed. No secrets. No breaking changes.

| File | Type | Verdict |
|------|------|---------|
| `.gitignore` | Cleanup/hardening | Commit — strictly improved |
| `dax-main/.gitignore` | Fix | Commit — removes merge conflict markers |
| `dax-backend/routes/uploadApi.js` | Bug fix | Commit — removes REACT_APP_* misuse on server |
| `dax-main/.env.example` | Template rewrite | Commit — better docs, all placeholders |
| `dax-main/build/manifest.json` | Icon update | Commit — simplified icon list |
| `dax-main/src/components/BrandGallery.css` | Feature | Commit — adds missing base grid styles |
| `dax-main/src/components/FloatingBubbles.jsx` | Perf fix | Commit — stable animation constants |
| `dax-main/src/pages/AniDaxPage.jsx` | UX fix | Commit — clickable tab shortcuts |
| `dax-main/src/pages/DaxTheTravelerPage.jsx` | Bug fix | Commit — removes /home/ubuntu/ paths |
| `dax-main/src/pages/GodsVesselPage.jsx` | Feature | Commit — wires in GodsVesselQuotes |
| `dax-main/src/pages/TimeZoneTravelersPage.jsx` | UX fix | Commit — fixes dead buttons |
| `dax-main/src/services/enhanced-driveApi.js` | Bug fix | Commit — correct env var fallback |
| `dax-main/src/utils/imageSourcer.js` | Feature | Commit — sourceImagesForBrand() method |

---

## Staged Changes (ready to commit)

| File | Change | Verdict |
|------|--------|---------|
| `dax-backend/credentials/firebase-adminsdk.json` | Deleted from git tracking (file stays on disk) | Commit — correct and necessary |

---

## What Was NOT Done (Awaiting Your Approval)

- [ ] No commit created
- [ ] No push to remote
- [ ] No merge of any branches
- [ ] No history rewrite (git filter-repo)
- [ ] No credential rotation (must be done by you at each provider)
- [ ] No restoration of any deleted file to `src/`
- [ ] No deletion of Manus/Replit branches from GitHub

---

## Files That May Be Worth Rebuilding (not restoring)

| Component | Why Rebuild Instead of Restore | Priority |
|-----------|-------------------------------|----------|
| `EnhancedHome.jsx` | Depends on components that may not exist; particle Math.random() bug; outdated copy | Medium — useful brand card grid pattern |
| `firebase/config.js` | Should use env vars, not hardcoded values; replaced by `src/config/firebase.js` | Low — check existing firebase.js first |
| `AutomationDashboard.jsx` | Incomplete recovery; likely outdated | Low — only useful if you're building a dashboard UI |

---

## Files That Should NOT Be Restored

| File | Reason |
|------|--------|
| `dax-backend/credentials/firebase-adminsdk.json` (from tracking) | Service account key — stays on disk only, never committed |
| `functions/serviceAccountKey.json` | Service account key — was deleted correctly, do not restore |
| `deleted-firebase-config.SANITIZED.js` | Even sanitized version should not go to src/ — use src/config/firebase.js with env vars instead |
| Old `dax-main/.env.example` (previous version) | Had partial key-like patterns in comments — current version is clean |

---

## Next Recommended Actions (in order, all require your approval)

1. **Rotate credentials** — Revoke and regenerate all keys exposed in commit `d78cf74a1` (Firebase service account, Google API keys, OpenAI, ElevenLabs, social tokens). Do this first regardless of anything else.
2. **Commit current changes** — Stage and commit all the modified source files above. None are risky.
3. **Decide on history rewrite** — Use `git filter-repo` to remove secrets from commit `d78cf74a1`. Requires force-push. Tell me when you're ready.
4. **Review src/config/firebase.js** — Confirm it uses env vars and not hardcoded values.
5. **Cherry-pick specific Manus work** — If you want AuthContext or n8n templates from `origin/clean-local-main-baseline`, cherry-pick individual files only.
6. **Push to origin/main** — Only after history rewrite (or after accepting the risk of keeping old history).
