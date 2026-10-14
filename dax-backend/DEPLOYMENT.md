# dax-backend — Runtime and Deployment Notes

How `dax-backend` starts, what it needs in each mode, and how to enable the
admin-only features safely. This document contains no real secrets. No
credential file is ever committed to git or baked into the Docker image.

Nothing here deploys anything automatically.

## 1. Runtime

- Node 20 (`.replit` uses `nodejs-20`, the Dockerfile uses `node:20-slim`).
  `package.json` allows `>=18 <21`.
- Install with `npm ci` — `package-lock.json` is committed.
- Start with `npm start` (`node server.js`). Tests: `npm test`.

## 2. Modes

### Public baseline (default — no credentials required)

With no Firebase or admin configuration the server starts and serves:

| Route | Behaviour without credentials |
|---|---|
| `GET /api/health` | `200`, reports `"firebase": false` and `"adminUploadsEnabled": false` |
| `POST /api/waitlist` | Development (`WAITLIST_STORE=file`): saved to `data/waitlist.csv`. Production (`WAITLIST_STORE=firestore`, the default there): `503` — a sign-up is never confirmed without durable storage |
| `GET /api/sheets` | `503` for public content spreadsheet IDs (it needs the service account); `403` for every other ID |
| `/api/admin/*` | Not mounted — `404` |

This is the mode used for local development on a machine with no
service-account file. Missing credentials never grant access to anything.

### With Firebase credentials

When a credential source is found (section 4) Firebase Admin is initialized:
the waitlist is written to Firestore and (with a service-account key) the
Sheets proxy works. Admin routes are still not mounted unless the flag below
is set.

### Waitlist storage

`WAITLIST_STORE` selects where sign-ups go (`services/waitlistStore.js`):

- `firestore` — default when `NODE_ENV=production`. The response is
  `{success: true, created: true}` only after Firestore accepted the write;
  a repeat sign-up returns `created: false`. If Firebase Admin is not
  initialized or the write fails the route answers `503`. Nothing is written
  to local disk.
- `file` — default elsewhere. Local CSV for development, plus a best-effort
  Firestore copy when Firebase Admin is available.

Documents are stored in the `waitlist` collection under a SHA-256 of the
normalized email, so the address is not in the document path and duplicates
collapse. There is no route that reads the waitlist back, and
`firestore.rules` has no rule for the collection, so clients have no access:
only the Admin SDK (which bypasses rules) can read or write it.

### Admin routes (opt-in)

Set `ENABLE_ADMIN_UPLOADS=true` to mount `/api/admin/*`. Every route in that
group runs `requireAuth` (valid Firebase ID token, else `401`) and then
`requireAdmin` (custom claim `admin: true` or UID in `ADMIN_UIDS`, else `403`).

With this flag on the server **refuses to start** if Firebase credentials or
`FIREBASE_STORAGE_BUCKET` are missing.

## 3. Environment variables

| Variable | Default | Notes |
|---|---|---|
| `PORT` | `5000` | Replit sets `3001` in `dax-backend/.env`. |
| `NODE_ENV` | `development` | |
| `FRONTEND_URL` | `http://localhost:3000` | The only allowed CORS origin outside production. |
| `PRODUCTION_ORIGINS` | `daxcollective.com`, `www.daxcollective.com`, `dax-collective.web.app` | Comma-separated allowed CORS origins in production. |
| `RATE_LIMIT_WINDOW_MS` | `900000` | 15 minutes. |
| `RATE_LIMIT_MAX` | `100` | Requests per client IP per window, across all routes. |
| `TRUST_PROXY` | unset | Number of proxy hops to trust for the client IP. **Set to `1` behind a single reverse proxy**, otherwise all visitors share one rate-limit bucket. |
| `WAITLIST_STORE` | `firestore` in production, `file` otherwise | See "Waitlist storage". Any other value stops startup. |
| `WAITLIST_FILE_PATH` | `data/waitlist.csv` | Location of the CSV in `file` mode. |
| `FIREBASE_USE_APPLICATION_DEFAULT` | `false` | `true` initializes Firebase Admin from the platform's attached service identity (Application Default Credentials) when no key is configured. No key file is needed. The Sheets proxy still requires a key. |
| `ENABLE_ADMIN_UPLOADS` | `false` | Mounts `/api/admin/*`. |
| `ENABLE_DRIVE_AUTOMATION` | `false` | Enables the Drive routes inside `/api/admin`. Requires `ENABLE_ADMIN_UPLOADS`. |
| `ALLOW_PUBLIC_DRIVE_FILES` | `false` | When `true`, uploaded Drive files are shared with "anyone with the link". |
| `ADMIN_UIDS` | empty | Comma-separated Firebase UIDs allowed through `requireAdmin`. |

Drive automation additionally requires `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` and `GOOGLE_REFRESH_TOKEN`; the
server fails to start with a clear message if any is missing while
`ENABLE_DRIVE_AUTOMATION=true`. Folder routing uses `DRIVE_FOLDER_TRAVEL`,
`DRIVE_FOLDER_FAITH`, `DRIVE_FOLDER_COLLECTIVE` and `DRIVE_FOLDER_TIMEZONE`.

`requireAdmin` also accepts the Firebase custom claim `admin: true`, set once
from a trusted environment with
`admin.auth().setCustomUserClaims(uid, {admin: true})`.

## 4. Google Sheets access

Spreadsheet IDs are split in `services/sheets.js`:

| Set | Env keys | Route |
|---|---|---|
| Public website content | `SHEET_GODS_VESSEL_QUOTES`, `SHEET_DAX_TRAVELER_BLOGS`, `SHEET_TIMEZONE_TRAVELERS_BLOGS_ITINERARIES` | `GET /api/sheets` (anonymous) |
| Protected | `SHEET_BRAND_ANALYTICS_DASHBOARD`, `SHEET_SOCIAL_TRACKING_*`, `SHEET_TSHIRT_DESIGNS_CANVA_BULK`, `SHEET_GODS_VESSEL_DISCUSSIONS`, `SHEET_SATIATED_TASTE_RECIPES` | `GET /api/admin/sheets` only (`requireAuth` + `requireAdmin`) |

A sheet is public only when a public page reads it today. Everything else
defaults to protected; to publish another sheet, move its key to
`PUBLIC_SHEET_KEYS` deliberately. The public route answers `403` for
protected and unknown IDs alike. The admin route serves both sets and, like
the rest of `/api/admin`, exists only when `ENABLE_ADMIN_UPLOADS=true`.

## 5. Batch upload from URLs

`POST /api/admin/drive/batch-from-urls` downloads through
`services/safeDownload.js`:

- at most 10 URLs per request, each at most 2048 characters
- `http`/`https` only, default ports only, no credentials in the URL
- loopback, private, link-local (including `169.254.169.254`), carrier-grade
  NAT, multicast and reserved addresses are refused, for IPv4, IPv6 and IPv4
  embedded in IPv6; the check runs on the address the socket actually
  connects to, and again on every redirect (at most 3)
- 10 second overall timeout and 10 MB maximum size per URL
- failures are reported per URL with a fixed generic message

## 6. How credentials are supplied

`services/firebaseAdmin.js` is the only code that reads the service account.
Sources, in priority order:

1. `FIREBASE_SERVICE_ACCOUNT_JSON` — the full JSON as a single-line string,
   stored as a platform secret. Use this in production: there is no file to
   lose, leak, or accidentally commit.
2. `FIREBASE_SERVICE_ACCOUNT_PATH` — path to a local file.
3. `credentials/firebase-adminsdk.json` — picked up automatically if present.

`credentials/` is gitignored and excluded from the Docker build context by
`.dockerignore`. Credential contents are never logged or returned in a
response.

If a source is configured but unusable (missing file, invalid JSON) the
server logs a warning and continues in the public baseline — unless
`ENABLE_ADMIN_UPLOADS=true`, in which case it exits.

## 7. Docker

```bash
docker build -t dax-backend ./dax-backend
docker run -p 5000:5000 dax-backend
```

The image contains no credentials and defaults every feature flag to `false`.
`.dockerignore` keeps `data/waitlist.csv` (subscriber emails), `credentials/`,
`.env` files and tests out of the build context. The image runs with
`NODE_ENV=production`, so the waitlist uses Firestore and writes no file.
Supply configuration at run time through the platform's environment/secret UI.

## 8. Google Cloud Run (recommended production target)

Cloud Run runs this Dockerfile unchanged, in the same Google Cloud project
as Firebase Hosting and Firestore (`dax-collective`), over HTTPS. It needs a
billing account on the project (Firebase "Blaze"); usage inside the monthly
free allowance is not charged. Nothing in this repository deploys it
automatically — the project owner runs the commands below.

One-time setup:

```bash
gcloud config set project dax-collective
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com firestore.googleapis.com

# A dedicated identity that can only use Firestore.
gcloud iam service-accounts create dax-backend --display-name "Dax backend"
gcloud projects add-iam-policy-binding dax-collective \
  --member "serviceAccount:dax-backend@dax-collective.iam.gserviceaccount.com" \
  --role "roles/datastore.user"
```

Deploy (run from the repository root; repeat for every backend release):

```bash
gcloud run deploy dax-backend \
  --source dax-backend \
  --region us-central1 \
  --service-account dax-backend@dax-collective.iam.gserviceaccount.com \
  --allow-unauthenticated \
  --min-instances 0 --max-instances 1 \
  --memory 512Mi --cpu 1 \
  --set-env-vars NODE_ENV=production,TRUST_PROXY=1,WAITLIST_STORE=firestore,FIREBASE_USE_APPLICATION_DEFAULT=true,FIREBASE_PROJECT_ID=dax-collective
```

Notes:

- `--max-instances 1` keeps the in-memory rate limiter meaningful and caps
  cost. `--min-instances 0` scales to zero; the first request after idle
  takes a few seconds.
- `--allow-unauthenticated` makes the service reachable from browsers. The
  routes it exposes are the public baseline only; `/api/admin/*` is not
  mounted.
- No key file or secret is involved: the service uses its attached identity.
- Cloud Run sets `PORT`; the server already reads it.
- The command prints the service URL (`https://dax-backend-….run.app`).
  Check that `GET <url>/api/health` returns `"waitlistReady": true`, then set
  that URL as the GitHub repository variable `REACT_APP_API_BASE_URL` and
  re-run the Hosting deploy. Until then the site keeps its forms disabled.
- To take the waitlist offline again, delete the repository variable and
  redeploy Hosting. To remove the backend:
  `gcloud run services delete dax-backend --region us-central1`.

## 9. Rollback

Every admin feature is gated by an explicit flag. Setting
`ENABLE_ADMIN_UPLOADS=false` (or unsetting it) and restarting removes
`/api/admin/*` without a code change.

## 10. Known limitations

- The rate limiter is in-memory and per-process. It suits a single instance;
  a multi-instance deployment needs a shared store.
- `POST /api/admin/post/:brand` is still a stub: it validates configuration
  and returns, it does not publish anything.
- The admin dashboard code in `dax-main/src/utils/automationConnector.js`
  reads analytics, social-tracking, recipe and discussion sheets through the
  public `/api/sheets`; those requests now get `403` and must move to
  `/api/admin/sheets` with an ID token.
- The frontend upload services still call the previous paths
  (`/api/drive/...`, `/api/firebase`) and need to be pointed at
  `/api/admin/...` before the admin upload UI can be used.
