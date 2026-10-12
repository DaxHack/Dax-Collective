# Production Configuration

What the deployed product needs, sorted by what actually depends on it. No
values live in this repository — names only.

There are two deployables:

- **Frontend** (`dax-main`) — static build published to Firebase Hosting by
  `.github/workflows/firebase-hosting-merge.yml` on every push to `main`.
  `REACT_APP_*` values are read **at build time**; the workflow currently
  passes none.
- **Backend** (`dax-backend`) — Express API. No workflow deploys it. See
  `dax-backend/DEPLOYMENT.md` for run modes.

## 1. Required for public launch

Nothing. With no configuration at all the public site builds, deploys and
renders, and every feature that needs a backend shows a deliberate
unavailable state:

| Feature | Behaviour with nothing configured |
|---|---|
| Brand pages, navigation, legal pages, media | Work |
| God's Vessel waitlist forms (page and merch pages) | Disabled, with "The waitlist isn't open for sign-ups yet." No request is made and no success is shown. |
| Contact form | Opens a draft in the visitor's email app. Nothing is sent from the page. |
| Footer email sign-up | Disabled ("Email updates aren't open yet"). |
| Quotes, blog and itinerary content from Sheets | Empty state. No request is made. |
| Sign-in, comments, admin dashboard tools | Unavailable. |

A production build never falls back to a `localhost` backend
(`dax-main/src/config/publicApi.js`).

## 2. Required to turn on public features

Supply these to the frontend **build** (for example as GitHub Actions
variables passed to the build step) when the matching backend exists:

| Variable | Turns on | Needs |
|---|---|---|
| `REACT_APP_API_BASE_URL` | Waitlist sign-ups; Sheets-backed quotes, blogs and itineraries | A deployed backend reachable over `https`. A `localhost` value is ignored in production. |
| `REACT_APP_SHEET_GODS_VESSEL_QUOTES`, `REACT_APP_SHEET_DAX_TRAVELER_BLOGS`, `REACT_APP_SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES` | The three public content sheets | The same IDs set on the backend as `SHEET_*`, and backend Firebase credentials (the Sheets proxy uses the service account). |
| `REACT_APP_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID` | Firebase sign-in and comments | The Firebase web app config (public identifiers, not secrets). |

Backend settings for the public baseline:

| Variable | Notes |
|---|---|
| `NODE_ENV=production` | |
| `PRODUCTION_ORIGINS` | Only if the site is served from an origin other than `daxcollective.com`, `www.daxcollective.com` or `dax-collective.web.app`. |
| `TRUST_PROXY` | Set to `1` behind a single reverse proxy. Without it all visitors share one rate-limit bucket. |
| Firebase credential (`FIREBASE_SERVICE_ACCOUNT_JSON`) | Needed for the Sheets proxy and the Firestore copy of the waitlist. Without it the waitlist still records to the server's local file only — use durable storage or supply the credential before relying on it. |
| `SHEET_GODS_VESSEL_QUOTES`, `SHEET_DAX_TRAVELER_BLOGS`, `SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES` | Public content sheets. |

## 3. Required only for admin features

Missing values here never affect the public site: the admin routes are
feature-gated and simply do not exist until enabled.

| Variable | Purpose |
|---|---|
| `ENABLE_ADMIN_UPLOADS=true` | Mounts `/api/admin/*`. The backend refuses to start with this on and no Firebase credential or `FIREBASE_STORAGE_BUCKET`. |
| `ADMIN_UIDS` and/or Firebase custom claim `admin: true` | Who is an admin. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` (or `FIREBASE_SERVICE_ACCOUNT_PATH`), `FIREBASE_STORAGE_BUCKET`, `FIREBASE_PROJECT_ID` | Token verification and Storage uploads. |
| `ENABLE_DRIVE_AUTOMATION=true`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_REFRESH_TOKEN`, `DRIVE_FOLDER_*` | Drive routes. |
| `ALLOW_PUBLIC_DRIVE_FILES` | Leave `false` unless uploaded Drive files should be world-readable. |
| `SHEET_BRAND_ANALYTICS_DASHBOARD`, `SHEET_SOCIAL_TRACKING_*`, `SHEET_TSHIRT_DESIGNS_CANVA_BULK`, `SHEET_GODS_VESSEL_DISCUSSIONS`, `SHEET_SATIATED_TASTE_RECIPES` | Protected sheets, served only by `/api/admin/sheets`. |
| Frontend: the `REACT_APP_FIREBASE_*` set and `REACT_APP_API_BASE_URL` | The dashboard needs sign-in and a backend to call. |

## 4. Optional / deferred

| Variable | Notes |
|---|---|
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS` | Defaults: 100 requests per 15 minutes per IP. |
| `REACT_APP_YOUTUBE_API_KEY`, `REACT_APP_YT_*` | YouTube embeds/feeds. |
| `REACT_APP_N8N_WEBHOOK_URL`, `N8N_*` | n8n automation. Not part of this release. |
| `REACT_APP_DRIVE_*`, `REACT_APP_DRIVE_FOLDER_*` | Dashboard folder shortcuts. |
| AI provider keys, social platform tokens (`OPENAI_API_KEY`, `TIKTOK_*`, `FACEBOOK_*`, `INSTAGRAM_*`, `TWITTER_*`, …) | Server-side only, for automation that is not enabled. Never use a `REACT_APP_` name for these. |

## 5. GitHub repository secrets

| Secret | Used by |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_DAX_COLLECTIVE` | Both Firebase Hosting workflows (deploy only). |
| `GITHUB_TOKEN` | Provided by GitHub. |

## 6. Content and internal routes — release switches in code

These are not environment variables; they are deliberate defaults in the
source that keep unapproved material out of production.

| What | Where | Production behaviour |
|---|---|---|
| Blog posts | `dax-main/src/data/blogData.js` (published) and `dax-main/src/data/editorial/blogDrafts.js` (drafts) | Only entries with `status: 'published'` **and** `verified: true` are listed or routable. The 12 existing pieces are unverified drafts kept in the editorial file, which the app does not import, so they are not in the production bundle. `/blog` shows an editorial coming-soon state. |
| Social links | `dax-main/src/config/socialLinks.js` — each link has `verified` | Only verified `https` links render. Placeholders and unconfirmed handles are kept in config and omitted from the UI. |
| Investor concept page | `dax-main/src/App.jsx` | Loaded and routed in development builds only. The seven paths 404 in production and the page is not in the production bundle. |
| `/automation` dashboard | `dax-main/src/pages/Dashboard.jsx` | 404 unless the build has a Firebase web config. Then sign-in is required, and the dashboard renders only after the backend's `GET /api/admin/access` confirms an admin. |
| Waitlist, contact, footer sign-up | see section 1 | Disabled / mailto until a backend exists. |

Backups, portable exports and pre-merge review snapshots are not part of the
product tree (`/backups/` and `/planning/review-backups/` are git-ignored).
They are preserved on `preserve/main-local-2026-10-12` and
`archive/main-pre-v3-2026-10-12`.
