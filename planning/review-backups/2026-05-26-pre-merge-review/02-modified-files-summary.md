# Modified Files Summary — 2026-05-26

## Staged Changes (ready to commit)
| File | Change | Notes |
|------|--------|-------|
| `dax-backend/credentials/firebase-adminsdk.json` | DELETED from tracking | File kept on disk. `git rm --cached` already staged. Do NOT unstage — this is correct. |

## Unstaged Source Code Changes
| File | Change Type | Risk | Summary |
|------|-------------|------|---------|
| `.gitignore` | Refactor | Low | Cleanup: removed duplicate rules, reorganized sections, improved coverage |
| `dax-main/.gitignore` | Fix | Low | Resolved merge conflict markers (<<<<<<< HEAD was left in file) |
| `dax-backend/routes/uploadApi.js` | Fix | Low | Switched REACT_APP_DRIVE_* vars to backend-only DRIVE_FOLDER_* vars |
| `dax-main/build/manifest.json` | Update | Low | Changed icon paths from brand-specific logos to simpler root logos |
| `dax-main/src/components/BrandGallery.css` | Feature | Low | Added base `.brand-gallery` grid styles (was missing, only scroll variant existed) |
| `dax-main/src/components/FloatingBubbles.jsx` | Perf fix | Low | Moved bubble arrays to module-level constants so Framer Motion never restarts animations |
| `dax-main/src/pages/AniDaxPage.jsx` | UX fix | Low | Hero category badges converted to clickable buttons that scroll to tabs |
| `dax-main/src/pages/DaxTheTravelerPage.jsx` | Fix | Low | Updated hardcoded /home/ubuntu/ fallback paths to real project paths; simplified profile image motion |
| `dax-main/src/pages/GodsVesselPage.jsx` | Feature | Low | Wired in GodsVesselQuotesSection component for the quotes tab |
| `dax-main/src/pages/TimeZoneTravelersPage.jsx` | UX fix | Low | Fixed dead "Read Hack"/"Get Itinerary" buttons to actually scroll to content; hooked YouTube button to real channel ID |
| `dax-main/src/services/enhanced-driveApi.js` | Fix | Low | Added REACT_APP_API_BASE_URL fallback (was only checking REACT_APP_API_URL) |
| `dax-main/src/utils/imageSourcer.js` | Feature | Low | Added `sourceImagesForBrand()` method mapping brand keys to local public-folder image paths |

## Unstaged Config/Template Changes
| File | Change Type | Risk | Notes |
|------|-------------|------|-------|
| `dax-main/.env.example` | Rewrite | LOW | Old version had partial/truncated key-like patterns in comments. New version is clean placeholders. |

## Untracked Files (not yet in git)
| File | Action | Notes |
|------|--------|-------|
| `dax-backend/.env.example` | Should be added | Clean template, no real secrets |
| `package-lock.json` | Low priority | Root-level lockfile, fine to add |

## Binary Changes (skipped in backup)
| File | Notes |
|------|-------|
| `dax-main/build/favicon.ico` | Binary — not backed up |
