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
| `POST /api/waitlist` | Works. Saved to `data/waitlist.csv`; the Firestore copy is skipped |
| `GET /api/sheets` | `503` for approved spreadsheet IDs (it needs the service account) |
| `/api/admin/*` | Not mounted — `404` |

This is the mode used for local development on a machine with no
service-account file. Missing credentials never grant access to anything.

### With Firebase credentials

When a credential source is found (section 4) Firebase Admin is initialized:
the waitlist is also written to Firestore and the Sheets proxy works. Admin
routes are still not mounted unless the flag below is set.

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

## 4. How credentials are supplied

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

## 5. Docker

```bash
docker build -t dax-backend ./dax-backend
docker run -p 5000:5000 dax-backend
```

The image contains no credentials and defaults every feature flag to `false`.
Supply configuration at run time through the platform's environment/secret UI.

## 6. Rollback

Every admin feature is gated by an explicit flag. Setting
`ENABLE_ADMIN_UPLOADS=false` (or unsetting it) and restarting removes
`/api/admin/*` without a code change.

## 7. Known limitations

- The rate limiter is in-memory and per-process. It suits a single instance;
  a multi-instance deployment needs a shared store.
- `POST /api/admin/post/:brand` is still a stub: it validates configuration
  and returns, it does not publish anything.
- The frontend upload services still call the previous paths
  (`/api/drive/...`, `/api/firebase`) and need to be pointed at
  `/api/admin/...` before the admin upload UI can be used.
