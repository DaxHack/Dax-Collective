# Production Approval Package — 2026-11-04

Nothing in this package has been executed. Each item names the exact candidate, the evidence, the risk and the step Daniel runs or approves.

## 1. PR #10: Firestore and Storage rules hardening

| | |
|---|---|
| Candidate | `fix/firestore-rules-hardening` @ `1c32755e` → `main` @ `2a165823` (1 commit) |
| Files | `firestore.rules`, `storage.rules`, `rules-tests/` (emulator tests and lockfile), `.github/workflows/rules-ci.yml`, `docs/PRODUCTION-CONFIGURATION.md`, `.gitignore` |
| Checks | All green: Backend lint and tests; Firestore and Storage rules tests; build_and_preview; Deploy Preview |
| Review | **PASS.** Everything is denied by default. Admin data needs the `admin: true` claim, since an anonymous sign-in is no longer enough. The waitlist is reachable only through the Admin SDK. Comments and user profiles are closed. The placeholder admin email has been removed. No client code depends on the closed paths: `ContentManager` reads are commented out and `CommentsSection` isn't mounted. |

**What merging does.** The Hosting workflow rebuilds and redeploys the site. The PR doesn't change `dax-main`, so the live site's content stays the same.

**What merging does not do.** The new rules don't reach production when you merge. No workflow deploys rules, so the live project keeps its old, permissive rules until someone runs:

```bash
firebase login --reauth
firebase deploy --only firestore:rules,storage --project dax-collective
```

The local Firebase CLI token has expired (HTTP 401), so the re-auth step is required first. Don't use `npm run deploy`, because it also deploys Hosting and Functions.

**Risk and rollback.**
- Risk: any admin who signs in without the `admin` claim loses direct client access to admin data. The backend isn't affected.
- Rollback: revert the merge commit, then redeploy the previous rules.

**Approval needed:** (a) merge PR #10; (b) run the rules deploy above.

## 2. Backend for the live waitlist

**Current state.** The live bundle `main.95c20262.js` has no backend origin. `REACT_APP_API_BASE_URL` is unset, so the forms correctly show "unavailable".

**Required deploy.** Cloud Run, following `dax-backend/DEPLOYMENT.md` §8, unchanged:

1. **Billing.** The `dax-collective` project needs the Blaze plan. Usage inside the free tier isn't charged, but this is a billing change and Daniel must approve it.
2. **Tooling.** Install the Google Cloud CLI (`gcloud`), which isn't on this machine, then run `gcloud auth login`.
3. **One-time setup.** Enable the APIs and create the `dax-backend` service account with `roles/datastore.user` only (commands in §8).
4. **Deploy.** Run `gcloud run deploy dax-backend --source dax-backend --region us-central1 … --max-instances 1` with the env vars in §8. No key file is needed; it uses Application Default Credentials.
5. **Verify.** `GET <run.app URL>/api/health` should return `"waitlistReady": true`.
6. **Connect the site.** Set the GitHub repository variable `REACT_APP_API_BASE_URL` to that URL, then re-run "Deploy to Firebase Hosting on merge" (re-run, or merge any PR).
7. **Test.** Make one real sign-up and confirm the response is `created: true`. Make the same sign-up again and confirm `created: false`.

**Order.** Deploy the PR #10 rules before the waitlist goes live, so the `waitlist` collection is locked at the moment it starts receiving emails.

## 3. DNS for daxcollective.com

| | |
|---|---|
| DNS host | Bluehost (`ns1/ns2.bluehost.com`) |
| Current | `@ A 66.81.203.198` and `www A 66.81.203.198`. That's not Firebase, and ports 80 and 443 don't answer. |
| TXT / MX | none |

**Exact change.**
1. **Add the domain in Firebase.** Firebase console → Hosting → site `dax-collective` → **Add custom domain** → `daxcollective.com`, then repeat for `www.daxcollective.com`, set to redirect to the apex. Firebase then shows the records for this project.
2. **Replace the records at Bluehost.** Bluehost → Domains → DNS for `daxcollective.com`:
   - Delete `@ A 66.81.203.198` and `www A 66.81.203.198`.
   - Add the A record Firebase shows. For current Hosting this is normally `@ A 199.36.158.100`.
   - Add the TXT record Firebase shows, normally `@ TXT hosting-site=dax-collective`.
   - For `www`, use the record Firebase gives for the redirect.
   - Use the console's values if they differ from the normal ones above.
3. **Wait.** Firebase provisions the SSL certificate automatically, usually within 1–24 hours.
4. **Check.** `https://dns.google/resolve?name=daxcollective.com&type=A` should return Firebase's IP, and `https://daxcollective.com` should return 200. The backend CORS defaults already allow `daxcollective.com` and `www.daxcollective.com`.

## 4. GA4 production traffic: verified (collection side)

A real browser loaded `https://dax-collective.web.app` on 2026-11-04:
- `gtag` is defined.
- `dataLayer` has 4 entries.
- The `_ga` and `_ga_KVXQJ21CZW` cookies are set.
- A request went out to `https://www.google-analytics.com/g/collect?v=2&tid=G-KVXQJ21CZW…`, which is a page view.

**Still unverified:** whether the hit shows up in the GA4 property, because there's no GA access from this session. Daniel can confirm in GA4 → Reports → Realtime while loading the site. Repeat this check after the DNS cutover, on `daxcollective.com`.
