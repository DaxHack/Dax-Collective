# Backend Route Separation — Design Note (Read-Only)

**Date:** 2026-06-29
**Status:** Design note only. No routes moved, no files created, `dax-backend/server.js` not modified, no duplicate Functions folders deleted, `firebase.json` not altered.
**Purpose:** Show the cleanest way to split today's single `dax-backend/server.js` into (1) a minimal public app safe for an early Cloud Functions deployment, and (2) a private, authenticated app deployed later — without pretending the split has already happened.

---

## Why split at all

The Backend Source-of-Truth audit (2026-06-29) found one Express app, `dax-backend/server.js`, carrying three different risk profiles at once:

1. A real, working, credential-bearing feature (`uploadApi.js`'s `verifyAuth`-gated Google Drive routes) that the asset pipeline genuinely needs.
2. A dead stub (`/api/post/:brand`) that looks like a publisher endpoint but does nothing.
3. Roughly 30 destructured environment variables (TikTok, Facebook, Instagram, YouTube, OpenAI, n8n, etc.) that nothing in this file currently reads.

Deploying all of this to Cloud Functions in one step the day Blaze gets turned on means the first deployment's blast radius includes Drive OAuth credentials and a pile of unused secrets, for a launch that only actually needs a health check and two forms. The split below exists to make the *first* deployment small on purpose.

---

## Proposed split (design only — not built)

### App 1 — Public minimal app
**Hypothetical file:** `dax-backend/publicApi.js` (does not exist yet)

Would contain only:
- `GET /api/health`
- `POST /api/contact` (once built, per the earlier-approved Path A plan)
- `POST /api/subscribe` (once built, per the earlier-approved Path B plan)
- The same CORS middleware already in `server.js:158-168` (origin-locked to `https://dax-collective.web.app` in production)
- Its own `admin.initializeApp()` call, using only the env vars these three routes actually need: `NODE_ENV`, `FIREBASE_SERVICE_ACCOUNT_PATH`/equivalent, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, plus (once built) `GMAIL_USER`/`GMAIL_APP_PASSWORD`

This is the only app that would be exported as a Cloud Function and deployed in the first migration pass: `exports.api = functions.https.onRequest(publicApp)`.

### App 2 — Private authenticated app
**Hypothetical file:** `dax-backend/privateApi.js` (does not exist yet)

Would contain everything currently in `uploadApi.js` (Drive upload/profile routes, all already `verifyAuth`-gated) plus the `/api/post/:brand` stub — either left as a stub returning `501 Not Implemented`, or removed outright once OAuth/publisher work is actually built in Phase 6.

This app stays un-deployed (or deployed separately, later, behind its own narrower Functions export) until there's an actual reason for it to be internet-reachable beyond local dev.

### What doesn't change in this design
- `uploadApi.js` itself doesn't need rewriting — its routes are already cleanly separated by file from the contact/health logic; the split is about which file `server.js` mounts where, not about restructuring `uploadApi.js`'s internals.
- Local development can still run both apps together (e.g., a `server.js` that mounts both `publicApi` and `privateApi` under `/api`) for convenience — the separation matters at deploy time, not at dev time.

---

## How this maps to the deploy boundary

| Today | After the future migration (not done yet) |
|---|---|
| One `server.js`, `app.listen(PORT)`, mounts everything | `publicApi.js` exported as the one Cloud Function deployed first |
| All ~30 env vars loaded regardless of use | `privateApi.js` (Drive/OAuth) stays undeployed, or deployed later as its own separately-scoped function |
| `/api/post/:brand` reachable wherever `server.js` happens to run | Excluded from the first deployment entirely per the narrow boundary already locked into the launch board |

---

## What this note does not do

- Does not create `publicApi.js` or `privateApi.js`.
- Does not change `dax-backend/server.js`, `dax-backend/routes/uploadApi.js`, `firebase.json`, or `.firebaserc`.
- Does not delete or retire `functions/` or `dax-main/functions/` — those stay untouched until the Console deployment inventory is re-checked at migration time.
- Does not generate a Gmail App Password, touch Secret Manager, or change the Firebase plan.

This is a reference for the day the migration actually gets built — so that build starts from "two small apps, one deployed" instead of "one big app, all deployed at once."
