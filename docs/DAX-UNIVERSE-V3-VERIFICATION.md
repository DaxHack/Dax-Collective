# Phase 1A verification — October 11, 2026

## Delivery

Dedicated branch: `feature/dax-universe-v3` in
`https://github.com/DaxHack/Dax-Collective`.
The latest commit on that branch is the foundation handoff; get its full identifier
with `git rev-parse HEAD` after cloning that branch. It deliberately has no
legacy ancestors. The delivery report supplies the exact pushed identifier.
Main/production is neither replaced nor merged. No deployment or PR is opened.

## Checks performed

- All three prior snapshot checksum manifests passed.
- A separately dated full working-site checkpoint was created before V3 site
  edits under **Dax Site V1 - Current Working Version**.
- A second secret-free checkpoint derives from that immutable pre-edit source.
  Its 339 recorded files passed verification, writable restoration in a disposable
  directory, restored-copy checks, and final snapshot re-verification.
  This full checkpoint remains local. The separate portable checkpoint uses
  only frontend source/public assets and current portable configuration, never
  recursively copying original uploads or intake into Git.
- Preservation baseline covers 935 existing backup, source, original upload,
  intake and public-media files. All stayed byte-identical except App.jsx's
  additive lazy V3 route. New files do not replace earlier experiments.
  The local `V3-PRESERVATION.json` records the unchanged file hashes; the export
  includes only its source/public subset, excluding original-upload metadata.
- Every public runtime asset in the portable tree matches the working site.
- `npm run lint:v3`: passed with zero warnings.
- `CI=true npm run test:v3`: 16 tests passed across two suites after preserving
  the already-completed Gateway and Traveler implementation during project sync.
  Covers four world deep links, approval gates, Gateway Back/Forward, map/year/
  chapter selection, nested photo dialogs, keyboard navigation and focus traps,
  gallery frame retention, related chapters, invalid state and route cleanup.
- Working-site production build passed.
- Fresh portable export installed with root/frontend `npm ci`, then built and
  ran the same tests/lint without application environment variables or secrets.
- Ten preview URLs returned HTTP 200 / CRA entry HTML: canonical home and
  Traveler, earlier Traveler preview, V2 gateway, V3 gateway, all four V3
  children and unknown-world fallback. Unit rendering checks complement HTTP
  fallback responses (HTTP 200 alone does not prove client routing).
- A 390px mobile screenshot confirms visible navigation, truthful engineering
  status and links to prior versions, without clipped controls.
- Preview workflow runs and compiles. No new V3 build/runtime errors observed.
- Secret-bearing history was not included. A targeted private-key/token pattern
  check guards the clean export; this is not a full security audit.
- Export-boundary regression checks exercise a full snapshot containing
  original uploads and intake and prove neither can enter the portable
  checkpoint. The portable manifest accounts for every file.

## Existing warnings / boundaries

CRA reports older canonical/admin code lint warnings, stale Browserslist data,
and npm deprecation notices. Testing Library 13 emits an `act` deprecation
warning on React 18.3. These are reported, not suppressed or repaired through
unrelated refactors. Old service integrations remain outside offline validation.

Fresh-install blockers found during verification were addressed: the CRA lock
uses legacy peer resolution, and three vulnerable transitive releases were
replaced with narrowly scoped allowed releases. Lock download URLs are public,
not private workspace-proxy hostnames.

All seven final visual scenes remain withheld pending their actual Figma
desktop/mobile/state references and media-use reviews. The already-completed
Gateway and Traveler engineering foundation remains available, including its
photo overlays and evidence-aware map/gallery controls. No final composition,
new media mapping, product interaction, theory scene or clock sequence is
claimed as delivered here. Existing V2 features remain in V2, unchanged.
Scene-performance budgets belong to approved scene implementation; this
foundation adds no media/render loop.

## Repeat the safety checks

```sh
python3 scripts/v3-isolation-check.py
python3 scripts/test-v3-portable-checkpoint.py
python3 scripts/v3-portable-checkpoint.py verify backups/dax-site-v1-current-working-version-2026-10-11-portable
python3 scripts/v3-snapshot.py rehearse backups/dax-site-v1-current-working-version-2026-10-11-portable
cd dax-main
npm run lint:v3
CI=true npm run test:v3
npm run build
```

Full run/setup, approval contract, asset boundaries and restoration instructions:
`DAX-UNIVERSE-V3-PORTABILITY.md`.
