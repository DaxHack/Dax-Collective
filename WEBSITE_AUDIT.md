# Dax Collective — Full Import & Launch Readiness Audit
**Date:** May 2026 | **Auditor:** Replit Agent  
**Stack:** React 18 (CRA) · Express.js · Tailwind CSS · Framer Motion · Firebase · Google APIs

---

## Overall Verdict

**NOT launch-ready. The frontend loads and is visually complete. The backend is built but never starts. A real Firebase private key is exposed in the repository. `robots.txt` has an unresolved git merge conflict. Every API integration (YouTube, Drive, Sheets, Firestore, N8N) is broken due to missing env vars or wrong URLs. Five footer routes 404. The investor page is publicly accessible with no auth guard.**

The frontend shell is solid and visually polished. The infrastructure plumbing is all present — Firebase, backend, Google Drive, YouTube — but none of it is connected or configured. This is a well-built car with no engine and the keys left in the ignition.

---

## 1. Project Structure Summary

```
workspace/
├── dax-main/              ← React 18 CRA frontend (PORT 5000)
│   ├── src/
│   │   ├── App.jsx        ← Router — 6 public + 7 private routes
│   │   ├── pages/         ← 7 page components
│   │   ├── components/    ← 14 shared components
│   │   ├── automation/    ← Admin dashboard + content store
│   │   ├── services/      ← Drive, Sheets, YouTube API clients
│   │   ├── config/        ← firebase.js, apiConfig.js (65+ env vars)
│   │   ├── contexts/      ← AuthContext (graceful Firebase fallback)
│   │   └── utils/         ← analytics, automationConnector, imageSourcer
│   ├── public/            ← Static assets, manifest.json, sw.js
│   └── .env               ← PORT=5000, most REACT_APP_* vars empty
│
├── dax-backend/           ← Express.js API server (PORT 3001)
│   ├── server.js          ← Main entry — Firebase Admin init at startup
│   ├── routes/
│   │   └── uploadApi.js   ← Drive upload, Firebase Storage, image routes
│   ├── credentials/
│   │   └── firebase-adminsdk.json  ← ⚠️ REAL PRIVATE KEY IN REPO
│   └── .env               ← PORT=3001, FRONTEND_URL=http://localhost:5000
│
├── functions/             ← Firebase Cloud Functions (not deployed)
├── n8n/                   ← N8N automation templates (not running)
├── firebase.json          ← ⚠️ INVALID JSON (contains JS // comments)
├── .replit                ← Only starts frontend — backend never launched
├── sitemap.xml            ← Exists but contains yourdomain.com placeholder
└── dax-main/public/robots.txt ← ⚠️ GIT MERGE CONFLICT MARKERS INSIDE
```

---

## 2. Frontend Setup

| Item | Value | Status |
|---|---|---|
| Framework | React 18 (Create React App) | ✅ |
| Port | 5000 | ✅ |
| Host | 0.0.0.0 | ✅ Replit-compatible |
| Host check | DANGEROUSLY_DISABLE_HOST_CHECK=true | ✅ Required for Replit proxy |
| Startup command | `cd dax-main && npm start` | ✅ Running |
| Build command | `cd dax-main && npm run build` | ✅ Works |
| Deploy target | Static (dax-main/build) | ✅ Configured |
| Replit port mapping | localPort 5000 → externalPort 80 | ✅ Correct |
| Browser console errors | imageSourcer warnings, SW localhost | ⚠️ Non-fatal |
| Hot reload | Working (CRA dev server) | ✅ |

**Frontend runs reliably in Replit. ✅**

---

## 3. Backend Setup

| Item | Value | Status |
|---|---|---|
| Framework | Express.js | ✅ Built |
| Port | 3001 | ✅ Configured in .env |
| Replit workflow | **NOT DEFINED** | 🔴 Never starts |
| Startup command | `cd dax-backend && npm start` | 🔴 Not in .replit |
| Crash-on-start risk | `process.exit(1)` if Firebase creds missing | ⚠️ Will exit — but creds DO exist |
| CORS origin | FRONTEND_URL=http://localhost:5000 | 🔴 Breaks in Replit/production |
| Firebase Admin init | Requires credentials/firebase-adminsdk.json | ✅ File exists, BUT... |
| Credentials security | Real private key committed to repo | 🔴 CRITICAL SECRET EXPOSURE |
| Backend reachable from frontend | No — localhost:3001 not reachable in Replit | 🔴 |

**Backend is NOT running. Would need a second workflow. Even if started, CORS blocks all calls. ❌**

---

## 4. Port Configuration

| Service | Port | Replit Exposed | Notes |
|---|---|---|---|
| Frontend (CRA) | 5000 | ✅ Port 80 external | Correct |
| Backend (Express) | 3001 | ❌ Not exposed | Would need port mapping added |
| Firebase Emulator Auth | 9099 | ❌ Not exposed | Dev only |
| Firebase Emulator Functions | 5001 | ❌ Not exposed | Dev only |
| Firebase Emulator Firestore | 8080 | ❌ Not exposed | Dev only |
| N8N | 5678 | ❌ Not running | Referenced in code |

---

## 5. API URL Configuration (Frontend → Backend)

### How the frontend tries to reach the backend:

| Service File | Env Var Used | Fallback Value | Problem |
|---|---|---|---|
| `apiConfig.js` | `REACT_APP_API_BASE_URL` | `http://localhost:5001/...` | 🔴 localhost — dead in Replit |
| `enhanced-driveApi.js` | `REACT_APP_API_URL` | `http://localhost:5000` | 🔴 **Wrong port — points to frontend, not backend** |
| `automationConnector.js` | `REACT_APP_N8N_WEBHOOK_URL` | `http://localhost:5678/webhook` | 🔴 N8N not running |
| `apiConfig.js` (N8N) | `REACT_APP_N8N_WEBHOOK_URL` | `http://localhost:5678` | 🔴 Same |
| `apiConfig.js` (Firebase Fn) | `REACT_APP_FIREBASE_FUNCTIONS_URL` | `http://localhost:5001/dax-collective/us-central1` | 🔴 localhost |

**Current frontend `.env`:**
```
REACT_APP_API_BASE_URL=http://localhost:3001   ← 🔴 Breaks in Replit and production
```

**Backend `.env`:**
```
FRONTEND_URL=http://localhost:5000             ← 🔴 CORS will reject Replit/production requests
PORT=3001
FIREBASE_SERVICE_ACCOUNT_PATH=./credentials/firebase-adminsdk.json
```

**Fix needed:** `REACT_APP_API_BASE_URL` must use `$REPLIT_DEV_DOMAIN` in development and a real domain in production. The backend `FRONTEND_URL` must also use the real Replit domain.

---

## 6. Firebase Status

### Client-side Firebase (frontend)

| Feature | File | Status | Reason |
|---|---|---|---|
| Initialization | `config/firebase.js` | ✅ Graceful | Placeholder keys used, no crash |
| Auth | `AuthContext.js` | ✅ Graceful fallback | Returns `user: null` when unconfigured |
| Firestore | `CommentsSection.jsx`, `AniDaxPage.jsx` | 🔴 `db` is null | Calls `collection(null, ...)` → throws |
| Storage | `ProfilePictureUploader.jsx` | 🔴 | `storage` is null |
| Anonymous sign-in | `AniDaxPage.jsx` | 🔴 | Firebase not configured |

### Firebase features that WON'T WORK until real env vars are added:
- **User comments** (AniDax page — Firestore)
- **User authentication** (Google sign-in, dashboard access)
- **Firebase Storage uploads** (profile pictures, image uploads)
- **Automation dashboard photo upload** (backend Firebase Admin)
- **Real-time data** (any Firestore listeners)

### Firebase env vars missing:
```
REACT_APP_FIREBASE_API_KEY=              ← EMPTY
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=  ← EMPTY  
REACT_APP_FIREBASE_APP_ID=               ← EMPTY
```
These three are required for client-side Firebase to work. Auth domain, project ID, and storage bucket have values.

---

## 7. Pages / Routes Found

### Public Routes (Navbar + Footer)

| Route | Component | Loads? | Visual Issues | Functional Issues |
|---|---|---|---|---|
| `/` | Home.jsx | ✅ Yes | Gallery shows mock images | Subscribe button does nothing |
| `/dax-the-traveler` | DaxTheTravelerPage.jsx | ✅ Yes | Profile/hero images missing | Videos never load (no YouTube key) |
| `/ani-dax` | AniDaxPage.jsx | ✅ Yes | Mock anime data only | Comments system crashes (Firestore null) |
| `/timezone-travelers` | TimeZoneTravelersPage.jsx | ✅ Yes | `/api/placeholder/` hero broken | All content is mock data |
| `/gods-vessel` | GodsVesselPage.jsx | ✅ Yes | `/api/placeholder/` hero + products broken | All 4 CTAs do nothing |
| `/automation` | Dashboard.jsx | ✅ Yes | Dark theme | Content Ideas/Packages work (localStorage) |

### Private Routes (No Navbar/Footer, **NO AUTH GUARD**)

| Route | Component | Accessible? |
|---|---|---|
| `/dax-the-investor` | DaxTheInvestorPage | 🔴 Publicly accessible |
| `/investor` | same | 🔴 |
| `/internal/investor` | same | 🔴 |
| `/private/financial` | same | 🔴 |
| `/dax/investor` | same | 🔴 |
| `/rollo-investor` | same | 🔴 |
| `/internal/rollo` | same | 🔴 |

### Missing Routes (Linked from Footer — All 404)

| Route | Linked From |
|---|---|
| `/about` | Footer Resources section |
| `/contact` | Footer Resources section |
| `/privacy` | Footer + bottom bar |
| `/terms` | Footer + bottom bar |
| `/cookies` | Footer bottom bar |

---

## 8. Brand Pages Found

| Brand | Route | Theme | Content Status |
|---|---|---|---|
| Dax the Traveler | `/dax-the-traveler` | Dark gray + blue | Videos: empty without API key. Gallery: mock. Photos: missing. |
| Timezone Travelers | `/timezone-travelers` | Orange-red gradient | All mock data. Video thumbs use `/api/placeholder/`. |
| God's Vessel | `/gods-vessel` | Purple-indigo | Apparel images use `/api/placeholder/`. All CTAs dead. |
| Ani-Dax | `/ani-dax` | Purple-pink | Mock anime data. Comments broken. |
| The Dax Collective | `/` (homepage) | Black + gradient | Hub concept not explained. Stats are hardcoded fiction. |

---

## 9. Components Found

| Component | Purpose | Works? | Notes |
|---|---|---|---|
| Navbar | Navigation + CTA | ✅ | Hamburger mobile menu works |
| Footer | Links + Newsletter | ⚠️ | 5 dead links, newsletter form no-ops |
| BrandCard | Homepage brand tiles | ✅ | Correct routing |
| BrandGallery | Per-brand photo gallery | ⚠️ | Falls back to mock images gracefully |
| StatsSection | Site stats display | ⚠️ | Hardcoded fake numbers |
| FloatingBubbles | Hero background particles | ✅ | Visual only |
| YouTubeIntegration | Real YouTube API data | 🔴 | Fails — no API key |
| CommentsSection | Firestore comments | 🔴 | `db` is null — throws errors |
| BlogSection | Sheets-fed blog posts | 🔴 | Fails — no Google API key |
| GodsVesselQuotes | Scripture quotes | ⚠️ | Needs Sheets key |
| RainbowWhiteEffect | Visual effect | ✅ | |
| ProfilePictureUploader | Drive/Storage upload | 🔴 | No backend, Storage null |
| SignInButton | Firebase Google sign-in | 🔴 | Firebase not configured |
| AdminAuth | Admin gate | 🔴 | Firebase not configured |

---

## 10. Assets / Images Found

### Files that EXIST in `dax-main/public/`:

```
favicon.ico         ✅
logo-main.png       ✅
logo-main(red).png  ✅
logo-main(yellow).png ✅
logo192.png         ✅
logo512.png         ✅
manifest.json       ✅
sw.js               ✅
robots.txt          ⚠️ GIT MERGE CONFLICT INSIDE — see §17
images/
  ani-dax.jpg                    ✅
  dax-the-traveler.jpg           ✅
  gods-vessel.jpg                ✅
  timezone-travelers.jpg         ✅
  dax-cuba-flipped.jpg           ✅
  me smiling cuba.jpg            ✅
  me black shirt.jpg             ✅
  Untitled design (1).png        ✅
  brands/                        ✅ (subdirectories per brand)
    ani-dax/
    dax-collective/
    dax-investor/
    dax-the-traveler/
    gods-vessel/
    timezone-travelers/
```

### Image paths REFERENCED in code but MISSING from `public/`:

| Path Referenced | Component | Result in Browser |
|---|---|---|
| `/images/dax/profile.jpeg` | DaxTheTravelerPage | 404 — broken img |
| `/images/dax/adventures.jpg` | DaxTheTravelerPage | 404 — broken img |
| `/images/dax/logo.png` | DaxTheTravelerPage | 404 — broken img |
| `/images/destinations/puerto-rico.jpg` | DaxTheTravelerPage | 404 — fallback to Unsplash URL |
| `/images/destinations/zipline.jpg` | DaxTheTravelerPage | 404 — fallback to Unsplash URL |
| `/images/destinations/caribbean.jpg` | DaxTheTravelerPage | 404 — fallback to Unsplash URL |
| `/images/shared/og/og-default_1200x630.webp` | index.html OG/Twitter | 404 — broken social preview |

### Placeholder image references (break in production):

| Path | Pages Using It | Problem |
|---|---|---|
| `/api/placeholder/1920/600` | GodsVessel hero, TZ Travelers hero | Returns 404 in production build |
| `/api/placeholder/300/300` | GodsVessel apparel items (3 products) | Returns 404 in production build |
| `/api/placeholder/300/200` | TZ Travelers video thumbnails | Returns 404 in production build |
| `/api/placeholder/400/400` | BrandGallery fallback | Returns 404 in production build |

### Hardcoded absolute server paths (will never work on any other machine):

| Path | Component | Problem |
|---|---|---|
| `/home/ubuntu/upload/1714962873240.jpeg` | DaxTheTravelerPage L31 | Absolute Ubuntu filesystem path |
| `/home/ubuntu/upload/FBAdventures.jpg` | DaxTheTravelerPage L32 | Same |
| `/home/ubuntu/upload/Untitleddesign(1).png` | DaxTheTravelerPage L35 | Same |

### PWA manifest icons:

| Icon | Path | Status |
|---|---|---|
| `logo-main(yellow).png` | `/logo-main(yellow).png` | ✅ Exists |
| `logo-main(red).png` | `/logo-main(red).png` | ✅ Exists |
| `logo-main.png` | `/logo-main.png` | ✅ Exists |
| `favicon.ico` | `/favicon.ico` | ✅ Exists |

---

## 11. Known Issues

### 🔴 Critical (Security / Data Loss Risk)

1. **Firebase Admin private key committed to git**  
   `dax-backend/credentials/firebase-adminsdk.json` contains a real `private_key` (RSA 2048-bit). This file is tracked in the repository. Anyone with repo access has full Firebase Admin SDK access.  
   **File:** `dax-backend/credentials/firebase-adminsdk.json`

2. **Investor page has zero auth protection**  
   `DaxTheInvestorPage` is rendered at 7 public URLs with no auth check, password, or redirect.  
   **File:** `dax-main/src/App.jsx` lines 22–28

3. **`robots.txt` has an unresolved git merge conflict**  
   The file contains `<<<<<<< HEAD`, `=======`, `>>>>>>> 5a8663f` markers. This is served as raw text to crawlers, confuses Googlebot, and is invalid.  
   **File:** `dax-main/public/robots.txt`

4. **`firebase.json` is invalid JSON**  
   Contains JavaScript `//` comments. Node's `JSON.parse` fails on it (`SyntaxError: Unexpected token /`). This will break `firebase deploy` entirely.  
   **File:** `firebase.json`

### 🔴 Deployment Blockers

5. **Backend never starts** — No workflow defined for `dax-backend/`. All upload, image processing, and Drive API features are permanently offline.  
   **File:** `.replit`

6. **Backend CORS rejects Replit/production requests**  
   `FRONTEND_URL=http://localhost:5000` is the allowed CORS origin. The Replit proxy URL is `https://*.picard.replit.dev`. All cross-origin API calls will be blocked with 403.  
   **File:** `dax-backend/.env`

7. **`REACT_APP_API_BASE_URL=http://localhost:3001`** — Frontend hardcoded to localhost. All backend API calls fail in Replit dev and in production.  
   **File:** `dax-main/.env`

8. **`enhanced-driveApi.js` points to wrong port**  
   `REACT_APP_API_URL || 'http://localhost:5000'` — fallback points to the FRONTEND (port 5000), not the backend (port 3001). All Drive API calls from this file self-loop to the React server.  
   **File:** `dax-main/src/services/enhanced-driveApi.js` line 4

9. **All 5 footer routes return 404**  
   `/about`, `/contact`, `/privacy`, `/terms`, `/cookies` are linked in the footer but no routes or page components exist for them.  
   **File:** `dax-main/src/components/Footer.jsx`, `dax-main/src/App.jsx`

10. **OG social preview image missing**  
    `/images/shared/og/og-default_1200x630.webp` is referenced in `index.html` og:image and twitter:image but the directory and file don't exist.  
    **File:** `dax-main/public/index.html` lines 14, 22

11. **`og:url` is placeholder**  
    `https://yourdomain.com` hardcoded in index.html. Every social share links to the wrong domain.  
    **File:** `dax-main/public/index.html` line 16

### 🟡 Functional Failures (Non-crash)

12. **Firestore comments crash silently** — `CommentsSection.jsx` calls `collection(db, 'comments')` when `db` is null. Throws a TypeError on the AniDax page.  
    **File:** `dax-main/src/components/CommentsSection.jsx` line 57

13. **YouTube API data never loads** — `REACT_APP_YOUTUBE_API_KEY` is empty. DaxTheTravelerPage enters loading state indefinitely or shows static fallback data.

14. **Google Sheets/BlogSection never loads** — `REACT_APP_GOOGLE_API_KEY` is empty. All blog and itinerary fetches fail.  
    **File:** `dax-main/src/services/sheetsApi.js`

15. **`/api/placeholder/` images break in production** — CRA dev server happens to intercept these; production build returns 404.  
    **Files:** GodsVesselPage.jsx, TimeZoneTravelersPage.jsx, BrandGallery.jsx

16. **Homepage "Subscribe" button does nothing** — The primary homepage CTA is a `<motion.button>` with no click handler and no linked form.  
    **File:** `dax-main/src/pages/Home.jsx` line 210–222

17. **Footer newsletter form does nothing** — `<input>` + `<button>` with no `onSubmit`/`onClick` handler.  
    **File:** `dax-main/src/components/Footer.jsx` lines 98–105

18. **All 4 GodsVessel CTAs do nothing** — "Read Devotional", "Shop Now", "Join the Movement", "Share Your Testimony" are all `<button>` with no actions.  
    **File:** `dax-main/src/pages/GodsVesselPage.jsx`

19. **Footer social icons are invisible** — Social links render an empty `<div className="w-6 h-6 bg-gray-600 rounded">` — no SVG icons displayed.  
    **File:** `dax-main/src/components/Footer.jsx` line 51

20. **Service worker registers as localhost** — `SW registered: http://localhost:5000/` logged in browser. In Replit the scope becomes `http://localhost:5000/` instead of the real domain, which could cause caching issues.  
    **File:** `dax-main/public/index.html` lines 44–52

---

## 12. Deployment Blockers

Items that MUST be fixed before any public deployment:

| # | Blocker | Severity | File |
|---|---|---|---|
| 1 | Firebase private key committed to git | 🔴 Security | `dax-backend/credentials/firebase-adminsdk.json` |
| 2 | Investor page unguarded at 7 public URLs | 🔴 Security | `dax-main/src/App.jsx` |
| 3 | `robots.txt` has git merge conflict markers | 🔴 Serves invalid content | `dax-main/public/robots.txt` |
| 4 | `firebase.json` is invalid JSON | 🔴 Breaks firebase deploy | `firebase.json` |
| 5 | Backend never starts (no workflow) | 🔴 All uploads/Drive dead | `.replit` |
| 6 | CORS blocks all backend calls | 🔴 Backend unusable | `dax-backend/.env` |
| 7 | `REACT_APP_API_BASE_URL=http://localhost:3001` | 🔴 Backend unreachable | `dax-main/.env` |
| 8 | `enhanced-driveApi.js` wrong port fallback | 🔴 Self-loops to frontend | `enhanced-driveApi.js:4` |
| 9 | 5 footer routes → 404 | 🔴 User-facing broken links | `Footer.jsx`, `App.jsx` |
| 10 | OG image missing (`og-default_1200x630.webp`) | 🔴 Broken social previews | `index.html` |
| 11 | `og:url=https://yourdomain.com` | 🔴 Wrong social link destination | `index.html` |
| 12 | Privacy Policy page missing | 🔴 Legal requirement (GA + email) | New page needed |
| 13 | `/api/placeholder/` images in production | 🔴 Blank hero sections | Multiple pages |
| 14 | `/home/ubuntu/upload/` absolute paths | 🔴 Broken image fallbacks | `DaxTheTravelerPage.jsx` |
| 15 | `FIREBASE_API_KEY`, `APP_ID`, `SENDER_ID` missing | 🔴 Firestore/Auth broken | `dax-main/.env` |

---

## 13. Local vs. Replit Differences

| Behavior | Local Dev | Replit Dev | Fix Needed |
|---|---|---|---|
| Frontend URL | `http://localhost:5000` | `https://[repl].picard.replit.dev` | Already handled via `HOST=0.0.0.0` + port mapping ✅ |
| Backend URL | `http://localhost:3001` | Needs second exposed port OR proxy | Add port 3001 to `.replit` OR use `/api` proxy in CRA |
| CORS origin | `http://localhost:5000` | Replit preview URL | Set `FRONTEND_URL` to `$REPLIT_DEV_DOMAIN` or `*` for dev |
| Firebase Admin credentials | JSON file on disk | JSON file on disk (exists) | Works — but needs to be in secrets, not git |
| Service worker scope | `http://localhost:5000/` | Same (proxy acts as same-origin) | Acceptable in dev, but prod needs real domain |
| `/api/placeholder/` images | CRA intercepts | CRA intercepts | Works in dev only — breaks in production build |
| N8N webhook | `localhost:5678` | Not running anywhere | Replace with cloud N8N or set env var |
| Build output | `dax-main/build/` | Same | ✅ Correct |

---

## 14. Environment Variables Audit

### Currently SET in `dax-main/.env`:
```
PORT=5000                      ✅
HOST=0.0.0.0                   ✅
BROWSER=none                   ✅
DANGEROUSLY_DISABLE_HOST_CHECK=true ✅
REACT_APP_API_BASE_URL=http://localhost:3001  🔴 Wrong — needs Replit URL
REACT_APP_FIREBASE_AUTH_DOMAIN=dax-collective.firebaseapp.com  ✅
REACT_APP_FIREBASE_PROJECT_ID=dax-collective  ✅
REACT_APP_FIREBASE_STORAGE_BUCKET=dax-collective.appspot.com  ✅
REACT_APP_FIREBASE_MEASUREMENT_ID=G-KVXQJ21CZW  ✅ (GA tracking ID)
REACT_APP_DEBUG=true           ✅
NODE_ENV=development           ✅
```

### MISSING in `dax-main/.env` (required for features to work):
```
REACT_APP_FIREBASE_API_KEY=              ← Firebase client auth
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=  ← Firebase client auth
REACT_APP_FIREBASE_APP_ID=               ← Firebase client auth
REACT_APP_GOOGLE_API_KEY=                ← Sheets + Drive client-side
REACT_APP_YOUTUBE_API_KEY=               ← YouTube video data
```

### Currently SET in `dax-backend/.env`:
```
PORT=3001                              ✅
NODE_ENV=development                   ✅
FRONTEND_URL=http://localhost:5000     🔴 CORS will reject Replit/prod
FIREBASE_SERVICE_ACCOUNT_PATH=./credentials/firebase-adminsdk.json  ✅ File exists
FIREBASE_PROJECT_ID=dax-collective     ✅
FIREBASE_STORAGE_BUCKET=dax-collective.appspot.com  ✅
```

### MISSING in `dax-backend/.env` (required for features to work):
```
GOOGLE_CLIENT_ID=          ← Drive OAuth
GOOGLE_CLIENT_SECRET=      ← Drive OAuth
GOOGLE_REFRESH_TOKEN=      ← Drive OAuth
GOOGLE_REDIRECT_URI=       ← Drive OAuth
BACKEND_GOOGLE_API_KEY=    ← Server-side API calls
YOUTUBE_API_KEY=           ← YouTube automation
OPENAI_API_KEY=            ← AI content generation
ELEVENLABS_API_KEY=        ← Voice/TTS
N8N_WEBHOOK_URL=           ← Automation triggers
TIKTOK_ACCESS_TOKEN=       ← Social posting
INSTAGRAM_ACCESS_TOKEN=    ← Social posting
FACEBOOK_ACCESS_TOKEN=     ← Social posting
```

### All 65+ `REACT_APP_*` env vars referenced in frontend source:
```
REACT_APP_DRIVE_* (15 folder ID vars)    — Google Drive folders
REACT_APP_SHEET_* (10 sheet ID vars)     — Google Sheets CMS
REACT_APP_YOUTUBE_CHANNEL_ID_* (4 vars)  — YouTube channel IDs
REACT_APP_VOICE_ID_* (4 vars)            — ElevenLabs voice IDs
REACT_APP_EMAIL_* (4 vars)               — Contact emails
REACT_APP_REDDIT_* (4 vars)              — Reddit API
REACT_APP_UNSPLASH_ACCESS_KEY            — Stock photos
REACT_APP_PEXELS_API_KEY                 — Stock photos
REACT_APP_PIXABAY_API_KEY                — Stock photos
REACT_APP_OPENAI_API_KEY                 — AI generation
REACT_APP_ELEVENLABS_API_KEY             — Voice synthesis
REACT_APP_MIXPANEL_TOKEN                 — Analytics
REACT_APP_HOTJAR_SITE_ID                 — Heatmaps
REACT_APP_INSTAGRAM_ACCESS_TOKEN         — Instagram
REACT_APP_TWITTER_API_KEY                — Twitter/X
REACT_APP_GOOGLE_CLIENT_ID               — OAuth
REACT_APP_N8N_WEBHOOK_URL                — Automation
... (total 65+)
```

---

## 15. Secrets Exposed / Security Risks

### 🔴 CRITICAL: Real Firebase Admin private key in git

**File:** `dax-backend/credentials/firebase-adminsdk.json`

This file contains:
- `"type": "service_account"`
- `"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADA..."` (full RSA 2048-bit key)
- `"client_email": "firebase-adminsdk-fbsvc@dax-collective.iam.gserviceaccount.com"`
- `"private_key_id": "5958c85e150cc34204186a30be1b7427e140c15e"`

**This grants full Firebase Admin SDK access** — including reading/writing all Firestore data, managing all users, accessing Storage, and more. Anyone who has cloned or starred the GitHub repo (github.com/DaxHack/Dax-Collective) has these credentials.

**Immediate actions required:**
1. Revoke this service account key in Google Cloud Console now
2. Generate a new service account key
3. Store the new key as a Replit Secret (not a file in the repo)
4. Add `credentials/` and `*.json` to `.gitignore`
5. Purge from git history (`git filter-branch` or BFG Repo Cleaner)

### Other secret risks:
- `dax-backend/.env` is in `.gitignore` ✅ — not committed
- `dax-main/.env` is in `.gitignore` ✅ — not committed
- No API keys in currently committed `.env` files ✅ — they're all empty

---

## 16. Console Errors (Observed at Runtime)

From live browser console capture:
```
%cDownload the React DevTools...                    ← Info, ignore
Analytics initialize called with ID: G-KVXQJ21CZW  ← Info ✅
gtag loaded: true                                   ← Info ✅
SW registered: http://localhost:5000/               ← ⚠️ localhost scope
imageSourcer not available, using fallback images   ← ⚠️ (×2, on homepage)
imageSourcer.sourceImagesForBrand is not available  ← ⚠️ (×2, expected)
```

**Expected additional errors on brand pages (not captured in screenshot):**
- `TypeError: Cannot read properties of null (reading 'collection')` — AniDax comments
- `Error: Google API key is not configured` — BlogSection
- Network errors to `http://localhost:3001/api/...` — all backend calls
- `Failed to load resource: http://localhost:5000/api/placeholder/...` — placeholder images

---

## 17. Server Logs

**Backend server is not running** — no server logs available.

**Frontend build log (last compilation):**
```
Compiled with warnings.
[eslint]
  AutomationDashboard.jsx:15 — 'ExclamationTriangleIcon' defined but never used
  AutomationDashboard.jsx:73 — useEffect missing dependency 'loadDashboardData'
  AutomationDashboard.jsx:375 — 'index' defined but never used
  ContentIdeas.jsx:496 — Unescaped HTML entities (partially fixed)
```
**No errors. Only lint warnings. Frontend compiles cleanly. ✅**

---

## 18. What Works (Right Now, No Config Changes)

- ✅ Homepage loads — hero, stats, brand cards, animations, floating bubbles
- ✅ All 6 public brand/dashboard pages render (without API data)
- ✅ Navigation between all pages — Navbar + React Router working
- ✅ Mobile hamburger menu (HeadlessUI)
- ✅ "Keep the Lights On" Buy Me a Coffee CTA — opens buymeacoffee.com
- ✅ "Get in Touch" collaborate link — opens `mailto:hello@daxcollective.com`
- ✅ "Subscribe on YouTube" on DaxTheTraveler — links to YouTube channel
- ✅ Google Analytics (gtag G-KVXQJ21CZW) — fires on load
- ✅ Automation dashboard — Content Ideas + Content Packages (localStorage)
- ✅ BrandGallery — falls back to mock images, no white screen
- ✅ All page animations (Framer Motion)
- ✅ `noindex` on dashboard — correct for admin page
- ✅ PWA manifest — icons exist, manifest valid
- ✅ Error boundary around Dashboard — no crash propagation
- ✅ All Helmet meta tags render per page

---

## 19. What Is Broken

- 🔴 Backend (Express) — never starts
- 🔴 Firebase Firestore — `db` is null, comments crash
- 🔴 Firebase Auth — not configured, sign-in fails
- 🔴 YouTube API — no key, video data never loads
- 🔴 Google Sheets/Drive — no key, blog content never loads
- 🔴 All 5 footer links (about, contact, privacy, terms, cookies) → 404
- 🔴 Homepage Subscribe button — no handler
- 🔴 Footer newsletter form — no handler
- 🔴 All 4 GodsVessel CTAs — dead buttons
- 🔴 All GodsVessel apparel images — `/api/placeholder/300/300`
- 🔴 GodsVessel + TZ Travelers hero backgrounds — `/api/placeholder/1920/600`
- 🔴 DaxTheTraveler profile + destination photos — missing files
- 🔴 OG social share image — missing file
- 🔴 `og:url` wrong — `yourdomain.com`
- 🔴 Footer social icons — invisible gray boxes
- 🔴 `robots.txt` — merge conflict markers render as plain text
- 🔴 `firebase.json` — invalid JSON, firebase CLI deploy will fail

---

## 20. What Is Risky

- 🔴 **Real Firebase private key in git** — highest risk item in the project
- 🔴 **Investor page publicly accessible at 7 URLs** — financial targets/strategy exposed
- ⚠️ **Service worker caches on localhost scope** — may cause stale content issues after domain change
- ⚠️ **Hardcoded channel IDs in code** — YouTube channel IDs are in source, fine for public but worth noting
- ⚠️ **`REACT_APP_GOOGLE_API_KEY` would be exposed to browser** — Google API keys used client-side need strict HTTP referrer restrictions set in Google Cloud Console
- ⚠️ **N8N localhost fallback** — if `REACT_APP_N8N_WEBHOOK_URL` is ever set to a real URL, automation triggers will fire from the browser (public)
- ⚠️ **`static` deployment target** — backend Express server CANNOT be deployed via Replit static deploy. If backend features are needed in production, deployment type must change to `autoscale` or backend must move to Firebase Functions

---

## 21. What Connects to Admin Studio Later

| Feature | Current State | Admin Studio Connection |
|---|---|---|
| Content Ideas CRUD | ✅ Full (localStorage) | Content calendar, campaign planning |
| Content Packages CRUD | ✅ Full (localStorage) | Script pipeline, video production tracking |
| ContentManager | ✅ Built | Full media/content CRUD |
| BrandGallery | ⚠️ Mock images | Photo manager — connect Drive API |
| PhotoSearchTab | ✅ Tab exists | Stock photo sourcing (Unsplash/Pexels) |
| UploadTab | ✅ Tab exists | Connect to backend `/api/drive` upload |
| Blog posts (sheetsApi) | ✅ Built, keys missing | Blog CMS via Google Sheets |
| YouTube analytics | ✅ Component built | Channel performance dashboard |
| Social tracking sheets | ✅ Config ready | Cross-platform analytics view |
| CommentsSection | ✅ Built (needs Firebase) | Community moderation |
| GodsVessel shop | UI only, no backend | Product/inventory management |
| Automation connectors | ✅ N8N + Drive wired | Content distribution automation |
| AutomationDashboard | ✅ Running | Central command for all automation |

---

## 22. Recommended First 10 Fixes (Priority Order)

| Priority | Fix | Effort | Prevents |
|---|---|---|---|
| **1** | **Revoke exposed Firebase service account key** — go to Google Cloud Console → IAM → Service Accounts → revoke key `5958c85e15` | 10 min | Active security breach |
| **2** | **Fix `robots.txt` merge conflict** — choose one version, remove git markers | 5 min | Googlebot confusion, invalid file |
| **3** | **Auth-gate the investor page** — add a password modal or Firebase auth check before any investor route renders | 1 hr | Financial data exposure |
| **4** | **Fix `REACT_APP_API_BASE_URL`** — change to use `$REPLIT_DEV_DOMAIN` for dev or a relative `/api` proxy in CRA's `package.json` `proxy` field | 30 min | All backend API calls broken |
| **5** | **Fix backend CORS** — set `FRONTEND_URL` in `dax-backend/.env` to actual Replit dev domain or use `cors({ origin: '*' })` for development | 15 min | Backend unusable from browser |
| **6** | **Add backend workflow to `.replit`** — add a second task that runs `cd dax-backend && npm start` | 15 min | Backend never starts |
| **7** | **Fix `enhanced-driveApi.js` wrong port** — change fallback from `http://localhost:5000` to `http://localhost:3001` | 5 min | Drive calls self-loop to frontend |
| **8** | **Replace all `/api/placeholder/` image src values** with Unsplash fallback URLs or real local images | 1 hr | Hero sections + apparel blank in production |
| **9** | **Create stub pages** for `/about`, `/contact`, `/privacy`, `/terms`, `/cookies` | 2 hrs | Footer 404s, legal compliance |
| **10** | **Fix `og:url` and create OG image** — set `og:url` to real domain in `index.html`, create and upload 1200×630 share image | 1 hr | Broken social previews on every share |

---

## Exact Files Requiring Changes

| File | Issue | Change Type |
|---|---|---|
| `dax-backend/credentials/firebase-adminsdk.json` | Real private key committed | **REVOKE + REMOVE from git history** |
| `dax-main/public/robots.txt` | Git merge conflict markers | **Resolve conflict** |
| `firebase.json` | JS comments in JSON | **Remove all `//` comments** |
| `.replit` | Backend workflow missing | **Add backend task** |
| `dax-backend/.env` | `FRONTEND_URL=http://localhost:5000` | **Set real Replit domain** |
| `dax-main/.env` | `REACT_APP_API_BASE_URL=http://localhost:3001` | **Set real backend URL or use proxy** |
| `dax-main/src/services/enhanced-driveApi.js` | Wrong port fallback (5000 not 3001) | **Change fallback to localhost:3001** |
| `dax-main/src/pages/DaxTheTravelerPage.jsx` | `/home/ubuntu/upload/` paths (3 lines) | **Remove fallback paths** |
| `dax-main/src/App.jsx` | Investor page unguarded (7 routes) | **Add auth guard** |
| `dax-main/public/index.html` | Wrong `og:url`, missing OG image | **Fix URL, add real image** |
| `dax-main/src/pages/GodsVesselPage.jsx` | `/api/placeholder/` images, dead CTAs | **Replace images, connect CTAs** |
| `dax-main/src/pages/TimeZoneTravelersPage.jsx` | `/api/placeholder/` images | **Replace images** |
| `dax-main/src/components/Footer.jsx` | Dead links, no-op newsletter, gray icon boxes | **Add routes, email handler, SVG icons** |
| `dax-main/src/pages/Home.jsx` | Subscribe button no-op | **Wire to email form** |
| `dax-main/src/components/BrandGallery.jsx` | `/api/placeholder/400/400` fallback | **Replace with real Unsplash fallback** |
