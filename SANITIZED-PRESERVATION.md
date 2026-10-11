# History-free sanitized V3 preservation

Source: clean local V3 commit `0892c722592bd2ca6a845b8c547af180cc3129a4`.
This snapshot is a new root commit with no source-repository ancestors.

Branch: `archive/v3-sanitized-baseline-2026-10-11`

Annotated recovery tag: `replit-v3-sanitized-baseline-2026-10-11`

## Credential-only differences

- Exclude `dax-backend/credentials/firebase-adminsdk.json`.
- OAuth helper configuration comes from `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET` and `GOOGLE_REDIRECT_URI`. Set these in the helper's
  server-side/local environment, never in frontend `REACT_APP_*` variables.
- Configure backend Firebase with `FIREBASE_SERVICE_ACCOUNT_PATH`, pointing at
  a separately provisioned, ignored credential file. Sheet token refresh now
  uses the same configured credential path as server initialization.

The OAuth authorization flow, scopes and token exchange are preserved. No
actual authorization exchange or token printing is performed during snapshot
verification. Frontend application source, routing, data, photographs and all
other application files are unchanged from the source baseline.

Safety metadata is updated to distinguish credentials in the original tracked
tree from credentials in its ancestors.

## Verification and recovery

Before pushing, scan all snapshot files and supported nested archives with
Gitleaks and independently check for the specific removed credentials. Publish
only after both checks show zero credential matches.

Gitleaks can mistake source-file SHA-256 fingerprints in
`docs/V3-PRESERVATION.json` for generic API keys when filenames contain words
like "auth" or "token". Verify each flagged fingerprint against its original
tracked file, then allow only 64-character hexadecimal fingerprint values in
that specific manifest. Do not exclude the file or weaken credential detection
for other paths.

Existing branch tips remain unchanged. The original source hash is recorded
here only as provenance; it is not available as ancestry in this snapshot.
Clone the archive branch or check out the annotated tag in a separate directory
for recovery or an isolated motion-proof branch.

Install Git LFS and run `git lfs pull` to retrieve the preserved LFS backup ZIPs.
The ordinary tracked files and LFS pointer identities are preserved. The local
recovery bundle contains Git objects, not LFS object payloads.

This snapshot does not deploy the app, promote V3 to main or implement final
Figma scenes. Credential scans establish absence of detected patterns, not
credential revocation status.
