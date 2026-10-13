# Dax Universe V3 — Phase 1A

This is an isolated engineering foundation, not the final Figma design or a production promotion. V1 and V2 remain available. The completed Gateway and Traveler interactions are preserved; the other three V3 child routes provide approval-gated engineering surfaces.

## Run outside Replit

Use Node.js 20 LTS and npm. No Replit API, account, runtime, or proprietary package is required by the V3 foundation.

```sh
git clone --branch feature/dax-universe-v3 https://github.com/DaxHack/Dax-Collective.git
cd Dax-Collective
npm ci
npm --prefix dax-main ci
PORT=5000 npm --prefix dax-main start
```

On Windows, set `PORT=5000` in your shell or a local ignored `dax-main/.env`. Open `http://localhost:5000/experiments/dax-universe-v3` in your browser. Port 3000 is CRA's default if no port is specified. The root install is necessary for the existing frontend `file:..` dependency.

```sh
CI=true npm --prefix dax-main test -- --watchAll=false --runInBand universe-v3
npm --prefix dax-main run build
```

Serve `dax-main/build` using any static host with SPA history fallback: requests for application routes must return `index.html`; real assets must remain real files. BrowserRouter deep links will fail on a host without that fallback. Do not change production hosting or canonical routes as part of this milestone.

The rest of the application retains its existing integrations. V3 Gateway/Traveler require no backend, login, or private credentials. Real authentication, database, video, automation, and other existing services require the owner's separately supplied configuration described in `ENVIRONMENT_SETUP.md`. Frontend `REACT_APP_*` values are public build-time configuration; never place client secrets or server credentials there. Use your own local environment or hosting secret manager outside Replit. Existing integration warnings do not establish that those services are operational.

## Route inventory

| Route | Milestone behavior |
| --- | --- |
| `/experiments/dax-universe-v3` | Gateway foundation and world selection |
| `/experiments/dax-universe-v3/traveler` | Traveler chronology, map, evidence records, personal photographs |
| Unknown V3 child route | Honest not-found state with Gateway exit |
| `/experiments/dax-universe-v3/gods-vessel`, `/ani-dax`, `/timezone-travelers` under the same V3 prefix | Approval-gated engineering surfaces, not final scenes |
| Gateway's existing God's Vessel, Ani-Dax, Time-Zone cards | Continue linking to working V2 experiences; the shared V3 navigation also exposes the engineering surfaces |

Canonical `/`, `/dax-the-traveler`, `/ani-dax`, `/timezone-travelers`, `/gods-vessel` and all other V1 routes are untouched. `/experiments/dax-the-traveler-v2` and `/experiments/dax-universe/*` remain separate and unchanged. New code lives under `dax-main/src/pages/experiments/universe-v3`; the only existing frontend source change is an additive lazy import and route in `App.jsx`.

## Content and asset ownership

The V3 chronology imports `dax-main/src/data/daxTravelHistory.js` directly. That file remains the single source for chapters, years, related journeys, field-level evidence and personal photo metadata. V3 does not copy, rewrite or enrich the chronology.

Browser photographs remain the existing tracked files in:

- `dax-main/public/images/dax-personal/` (six WebP derivatives)
- `dax-main/public/images/dax-history/daniel-camera-roll-portrait.jpg` (one unchanged portrait)

Their absolute `/images/...` URLs assume the app is served from the host root, as the current application does. They are included in the Git clone and CRA build; no Drive or Replit storage access is needed. Original intake uploads, prior backups and photographs are unchanged. No new media acquisition, conversion, invented destinations or inferred dates are included. UNKNOWN is an evidence qualification, not a denial of travel.

## Isolation and future visual work

The shell, tokens, route metadata, world/scene state, motion preferences and overlay boundaries belong to V3 only. Portal overlays must retain their scoped V3 styling outside the shell and restore focus/background interaction/scroll when they close or unmount. URL-backed selections must respond to browser Back/Forward and direct reloads. Do not move V2's private overlays into shared global code by changing V2.

Major scene composition, hero artwork, cinematic scroll choreography and final visual tokens await approved Figma frames. Phase 1B final scenes, publishing and canonical promotion are explicitly outside this milestone.

## Recovery checkpoint

The portable branch has clean history and does not include legacy Git ancestry.
Its verified pre-V3 source and public-media recovery checkpoint is included at
`backups/dax-site-v1-current-working-version-2026-10-11-portable`, under the exact
label **Dax Site V1 - Current Working Version**. Verify or rehearse recovery
without overwriting the working app:

```sh
python3 scripts/v3-portable-checkpoint.py verify backups/dax-site-v1-current-working-version-2026-10-11-portable
python3 scripts/v3-snapshot.py rehearse backups/dax-site-v1-current-working-version-2026-10-11-portable
```

The separate portable checkpoint contains only pre-V3 frontend source and
approved public assets plus current portable configuration; its file manifest
and disposable restoration are verified independently. The full immutable
local checkpoint's 339 files and three earlier snapshot manifests also passed.
Full archives and original uploads stay untouched in the original workspace
and are excluded from the portable branch, including its recovery checkpoint.
Never edit immutable saved backups in place. Restoring or promoting the working
application is a separate authorized action. Full setup and recovery details
are in `DAX-UNIVERSE-V3-PORTABILITY.md`.

## Verification

The milestone verifies the production build, isolated unit regressions, direct routes/history, responsive Traveler controls, nested overlays, keyboard/focus/scroll restoration and reduced motion. Preservation is checked against pre-edit source/public/backup checksums, with `App.jsx` reviewed only for its additive route. The final delivery report records the dedicated GitHub branch and verified commit.
