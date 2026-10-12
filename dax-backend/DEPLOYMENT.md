# dax-backend — Deployment Plan

This document describes how to deploy `dax-backend` as a minimal public API,
and (separately) how to enable the admin-only upload features safely. It does
not include any real secrets. No credential file is ever committed to git or
baked into the Docker image — admin credentials are supplied as a platform
secret/environment variable at deploy time.

This is a plan only — nothing here has been deployed automatically.

## 1. Public baseline (recommended first deploy)

Minimum env vars for a public deployment that only serves `GET /api/health`:

| Variable | Example | Notes |
|---|---|---|
| `PORT` | `5000` | Most platforms override this automatically. |
| `NODE_ENV` | `production` | |
| `PRODUCTION_ORIGINS` | `https://dax-collective.web.app` | Comma-separated allowed CORS origins. |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Optional, defaults to 15 min. |
| `RATE_LIMIT_MAX` | `100` | Optional, defaults to 100 req/window. |
| `ENABLE_ADMIN_UPLOADS` | `false` | Leave unset or `false`. |
| `ENABLE_DRIVE_AUTOMATION` | `false` | Leave unset or `false`. |

With only these set, the server starts, Firebase Admin is never initialized,
and `/api/admin/*` does not exist (404). This is the safest configuration to
deploy first.

### Deploy steps (any Node host — Render/Railway/Fly/etc.)

1. Push `dax-backend/` (or build the Dockerfile) to your hosting platform.
2. Set the env vars from the table above in the platform's environment/secret
   UI — not in a committed file.
3. Build command: `npm ci --omit=dev`
4. Start command: `npm start` (i.e. `node server.js`)
5. Verify: `GET https://<your-domain>/api/health` returns `200` with
   `"adminUploadsEnabled": false`.

## 2. Enabling admin uploads (Firebase Storage + Drive) — later, separate step

Only do this once the public baseline is live and verified. Requires the
**deployment secret**, not a JSON file in the repo.

| Variable | Where it comes from | Sensitivity |
|---|---|---|
| `ENABLE_ADMIN_UPLOADS` | set to `true` | flag |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase Console → Project Settings → Service Accounts → Generate new private key → paste the **entire JSON file contents as a single-line string** into your host's secret manager | **secret — never commit, never log** |
| `FIREBASE_PROJECT_ID` | Firebase Console | non-secret |
| `FIREBASE_STORAGE_BUCKET` | Firebase Console | non-secret |
| `FIREBASE_DATABASE_URL` | Firebase Console (if using RTDB) | non-secret |
| `ADMIN_UIDS` | Firebase Console → Authentication → your admin user's UID(s), comma-separated | semi-sensitive, server-only |

`requireAdmin` also accepts a Firebase custom claim (`admin: true`) set on a
user's account as an alternative/addition to `ADMIN_UIDS` — that path needs
no extra env var, just a one-time `admin.auth().setCustomUserClaims(uid, {admin:true})`
call made from a trusted environment (not part of this deploy).

### Optional: Google Drive automation (only with admin uploads enabled)

| Variable | Sensitivity |
|---|---|
| `ENABLE_DRIVE_AUTOMATION=true` | flag |
| `GOOGLE_CLIENT_ID` | non-secret |
| `GOOGLE_CLIENT_SECRET` | **secret** |
| `GOOGLE_REDIRECT_URI` | non-secret |
| `GOOGLE_REFRESH_TOKEN` | **secret** |
| `DRIVE_FOLDER_TRAVEL` / `DRIVE_FOLDER_FAITH` / `DRIVE_FOLDER_COLLECTIVE` / `DRIVE_FOLDER_TIMEZONE` | non-secret folder IDs |
| `ALLOW_PUBLIC_DRIVE_FILES` | flag — leave `false` unless you explicitly want uploaded Drive files to be world-readable |

If any of the four required `GOOGLE_*` Drive vars are missing while
`ENABLE_DRIVE_AUTOMATION=true`, the server fails to start with a clear log
message rather than starting in a half-configured state.

## 3. How credentials are supplied (no JSON file in the repo)

- `services/firebaseAdmin.js` reads `FIREBASE_SERVICE_ACCOUNT_JSON` (a JSON
  string) directly from `process.env` and parses it at startup. It is never
  written to disk, never logged, and never echoed in any API response.
- Local development may still use `FIREBASE_SERVICE_ACCOUNT_PATH` pointing at
  a downloaded JSON file — that path is already covered by `.gitignore`
  (`credentials/`, `*firebase-adminsdk*.json`) and is excluded from the
  Docker build via `.dockerignore`.
- Production/deployment should use `FIREBASE_SERVICE_ACCOUNT_JSON` exclusively
  — there is no file to lose, leak via a misconfigured `.dockerignore`, or
  accidentally commit.

## 4. Rollback

Every admin feature is gated by an explicit env flag. To disable admin
uploads at any time without a code change, set `ENABLE_ADMIN_UPLOADS=false`
(or unset it) and redeploy/restart — `/api/admin/*` stops existing.

## 5. What this document does NOT do

It does not deploy anything automatically, does not generate or rotate any
credentials, and does not change any existing secret. All of the above are
manual steps for you to run when ready.
