# Pre-immersive redesign: local recovery

This is the website source and local visual assets saved before the immersive homepage and Traveler iteration. The snapshot is separate from the live website and must not be edited.

## Option A — Quick rollback in this Replit workspace

Tell Replit Agent: **Restore the pre-immersive-redesign version**.

The agent should restore locally from `backups/pre-immersive-redesign-2026-09-30/website/`, not use GitHub or publish anything.

From the workspace root:

1. Save any later changes separately if needed. Restoring replaces the current frontend source and its visual assets.
2. Verify the snapshot: `cd backups/pre-immersive-redesign-2026-09-30 && sha256sum -c SHA256SUMS`.
3. Return to the workspace root. Replace `dax-main/src` and `dax-main/public` with the saved `website/dax-main/src` and `website/dax-main/public` directories. Directory replacement, rather than copying over them, removes new experimental components and images. The omitted `public/static` contains generated build output, not source assets.
4. Copy the saved frontend package manifests, Tailwind, PostCSS, and ESLint configurations back to their original paths. Root package manifests are also included if needed. Do not replace `.env`, secrets, backend files, or credentials.
5. Leave existing `node_modules` in place unless dependencies have changed. If installation is needed, run `npm ci` at the root, then `npm --prefix dax-main ci`. Never run deployment scripts.
6. Restart the existing `Start application` workflow (`cd dax-main && npm start`).
7. Check `/`, `/dax-the-traveler`, `/ani-dax`, `/timezone-travelers`, and `/gods-vessel`.

For example, after explicitly choosing to restore, the two source-directory replacements are:

```sh
rm -rf dax-main/src dax-main/public
cp -a backups/pre-immersive-redesign-2026-09-30/website/dax-main/src dax-main/src
cp -a backups/pre-immersive-redesign-2026-09-30/website/dax-main/public dax-main/public
cp backups/pre-immersive-redesign-2026-09-30/website/dax-main/package*.json dax-main/
cp backups/pre-immersive-redesign-2026-09-30/website/dax-main/tailwind.config.js dax-main/
cp backups/pre-immersive-redesign-2026-09-30/website/dax-main/postcss.config.js dax-main/
cp backups/pre-immersive-redesign-2026-09-30/website/dax-main/.eslintrc* dax-main/
```

These commands are instructions only; no rollback was performed when this backup was made.

## Option B — Portable export

The sibling ZIP is `backups/dax-collective-pre-immersive-redesign-2026-09-30.zip`.

Extract it into a new directory. It contains this snapshot folder, its checksums, and the `website/` subtree retaining original relative paths. Use Node 18 or newer, run `npm ci` in `website/`, then `npm ci` in `website/dax-main/`, then `PORT=5000 npm start` in `website/dax-main/`.

This reproduces the frontend visual source and local imagery. Existing private environment configuration and backend services must be provided separately through the destination's secret tooling if their connected functions are needed. No credentials, `.env` files (including examples), OAuth data, `node_modules`, Git metadata, build caches, or compiled `public/static` bundles are included.

## Integrity and scope

`SHA256SUMS` records every saved website file and these instructions. The backup includes all frontend pages, components, CSS, local source assets, public images, and frontend/root dependency manifests. It does not include the backend because this iteration does not change it.

Keep this snapshot unchanged. The experimental redesign lives in the normal `dax-main/` working directory.