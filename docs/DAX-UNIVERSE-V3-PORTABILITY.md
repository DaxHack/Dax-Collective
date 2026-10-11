# V3 Phase 1A: run and continue outside Replit

This is an isolated **engineering foundation**, not completed V3 art direction.
React 18 / Create React App 5, React Router 7, Framer Motion and GSAP are retained.
No production route, backend, database, cloud original, or deployment was changed.

## Clone and run

Use Node **20 or 22**, npm 10+, Python 3 for snapshot tools, and Git.
React Router 7 requires Node 20+, despite the legacy package's broader engine range.

```sh
git clone --branch feature/dax-universe-v3 https://github.com/DaxHack/Dax-Collective.git
cd Dax-Collective
npm ci
cd dax-main
npm ci
PORT=5000 npm start
```

On Windows set `PORT` using your shell, or omit it (CRA defaults to 3000).
The frontend's `file:..` dependency needs the parent package, so do not copy
only `dax-main` without the root package and lockfile.

**No secrets are needed for the V3 foundation.** Do not copy the legacy
`.env.example` wholesale: it includes old private-service variable names.
CRA embeds every `REACT_APP_*` value into browser code. Never place OAuth
secrets, API tokens, service-account keys, or private provider keys there.
Optional public Firebase client configuration may enable legacy functionality,
but live authentication, cloud galleries, automation, waitlists and payments
are outside this foundation's offline guarantee. Missing services may produce
legacy warnings; do not invent success data or hide them.

```sh
npm run lint:v3
CI=true npm run test:v3
npm run build
```

Tests include the small Jest compatibility mapping for Router 7 exports and
encoding globals missing from CRA's older test environment.
The frontend `.npmrc` preserves the legacy peer-dependency resolution used by
this CRA application. Narrow transitive overrides update shell-quote,
websocket-driver and proxy-addr to allowed releases without changing the runtime
or direct application dependencies.
For a static host, serve `dax-main/build` and rewrite non-file requests to
`index.html`, including nested experiment paths. Never publish this work without
separate authorization. Replit workflows and Firebase deploy scripts are
optional legacy configuration, not required to run the frontend.

## Preserved versions and new routes

| Version | Route |
| --- | --- |
| Canonical V1 | `/` and existing public brand paths |
| Earlier Traveler preview | `/experiments/dax-the-traveler-v2` |
| Universe V2 | `/experiments/dax-universe` and its existing children |
| V3 gateway foundation | `/experiments/dax-universe-v3` |
| Traveler foundation | `/experiments/dax-universe-v3/traveler` |
| Vessel foundation | `/experiments/dax-universe-v3/gods-vessel` |
| Time-Zone foundation | `/experiments/dax-universe-v3/timezone-travelers` |
| Ani-Dax foundation | `/experiments/dax-universe-v3/ani-dax` |

Only App's additive lazy route integrates V3. CSS is scoped under
`.dax-v3-foundation`; tokens are explicitly provisional. Worlds load without
the canonical navbar/footer. Unknown V3 paths offer a recovery link.
Navigation uses ordinary router links/history. World changes
remain ordinary history navigation; the preserved Traveler dialogs manage focus
and restore it to their openers. Traveler year/chapter/photo/frame/scene live
in URL search parameters, survive refresh/back/forward, and reject unknown IDs.
Data is imported from the existing evidence records without editing them.
No new image, travel fact, chronology, photo/trip association, or remote media
was introduced. The already-completed Gateway and Traveler foundation is retained,
including its source-backed map, camera-roll gallery, chapter dialogs and photo
viewer. It uses only the existing photo registry and chapter assignments.
No final Figma-directed visual scene is claimed by this foundation.

## Continue with Figma

Engineering truth: this branch. Visual truth:
`DAX-UNIVERSE-V3-APPROVED-BLUEPRINT.md` and subsequently approved Figma frames.
All seven scene records in `universe-v3/records.js` are **pending**.
For each scene supply approved desktop/mobile frame references, entry/active/exit
state references, media-use approval, reviewer and approval date. `SceneGate`
fails closed until every field is present; do not treat populated strings as a
substitute for Daniel's actual approval.

Collective selector, Traveler hero and Traveler journey are the next visual
priority. Vessel, Time-Zone, Ani theory and Ani key visual require their own
approvals. Asset IDs, focal/text-safe boundaries, provenance, credits, spoilers,
and unknown/approximate claims must carry through to the implementation.
Neutral engineering layout is not an accepted Figma composition.

Shared behavior: `MotionConfig` follows reduced motion, CSS removes decoration
for that preference, and `useScopedMotion` provides GSAP context cleanup.
The motion hook and route-focus utility are prepared; the existing Gateway and
Traveler retain their established navigation and dialog-focus behavior.
Assign one owner to every animated property; GSAP and Framer must not share a
target's transform/opacity. Keep native vertical scroll and equivalent list/
button access. No animation library, model, canvas or service was added.

## Snapshot and recovery

The exact checkpoint label is **Dax Site V1 - Current Working Version**.
The **full local** checkpoint remains unchanged at
`backups/dax-site-v1-current-working-version-2026-10-11-verified`, including
owner-controlled original uploads. It is not distributed in the Git branch.
The separate portable checkpoint at
`backups/dax-site-v1-current-working-version-2026-10-11-portable` includes only
pre-V3 frontend source, approved public assets and portable configuration.
It preserves canonical V1, earlier Traveler and V2 source exactly. Its tooling
configuration uses the current verified package locks and peer settings so
restoration does not revive workspace-only package URLs or install blockers.
Its manifest records exactly the exported files.

```sh
python3 scripts/v3-portable-checkpoint.py verify backups/dax-site-v1-current-working-version-2026-10-11-portable
python3 scripts/v3-snapshot.py rehearse backups/dax-site-v1-current-working-version-2026-10-11-portable
```

The rehearsal checks all file hashes, copies the manifest's files into a
temporary writable directory, verifies the copies, removes the temporary
directory, then rechecks the immutable checkpoint.
For real restoration, start in a separate working directory, copy the recorded
files, make only those working copies writable, install from the saved locks,
and run the frontend. Never overwrite/delete newer work or edit the snapshot.
Use the current `scripts/v3-snapshot.py` from the branch for rehearsal, and
`scripts/v3-portable-checkpoint.py` for portable-boundary verification.

Earlier snapshots, ZIP exports and original local uploads remain untouched in
the original workspace. The full local preservation evidence is recorded in
the workspace's `V3-PRESERVATION.json`; the export retains only its source/public
subset, not original-upload metadata.
The clean branch includes the frontend-only checkpoint and all public runtime
images, but does **not** distribute full local backups or unreviewed intake/ZIPs. Obtain those
separately from the owner under the existing review boundary. There is no
Replit storage dependency for the V3 runtime.

## Why this branch has clean history

The original history contains private-key material and an old OAuth helper.
Publishing that ancestry would violate the no-secrets requirement even if
those files were deleted in the latest commit. This dedicated branch therefore
starts with a clean root commit, with credential-bearing files excluded.
No history, credential, cloud original or production branch was modified.
Do not merge old ancestry into this branch. Future promotion should select
reviewed safe changes, not blindly merge the legacy history.

`scripts/v3-portable-export.py DESTINATION` assembles a non-overwriting,
filtered candidate and derives the allowlist-only portable checkpoint. Excluded file
names (never values) are recorded in `V3-EXPORT-EXCLUSIONS.json`. This targeted
guard is not a comprehensive security audit. Credential rotation/history
remediation is separate work requiring owner authorization.
`scripts/test-v3-portable-checkpoint.py` checks that original uploads and intake
inside a full snapshot cannot cross that allowlist. Do not replace this filter
with a recursive copy of an entire backup.

See `DAX-UNIVERSE-V3-VERIFICATION.md` for check results and branch handoff.
