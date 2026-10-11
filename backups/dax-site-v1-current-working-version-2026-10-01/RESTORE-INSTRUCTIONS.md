# Dax Site V1 - Current Working Version

Saved on October 1, 2026, before the real-travel-history iteration.

This is the current local working frontend, including its original pages, shared components, styles, public assets, package/config files, and copies of original uploaded images. The earlier pre-immersive backup remains separate and unchanged.

## Scope

- `dax-main/`: frontend source, public source assets, and dependency/config files.
- `attached_assets/`: byte-for-byte copies of uploaded JPG, PNG, WebP, SVG, and HEIC originals.
- Root package manifests and project notes, when present.
- No credentials, environment files, Git metadata, installed modules, generated builds, cloud data, or external service state.
- `SHA256SUMS`: verifies the saved file bytes.

## Restore

Ask the agent: **Restore Dax Site V1 - Current Working Version.**

Restore by copying this saved frontend over the working frontend, not by editing the backup. Remove only newly added experimental source files after identifying them; do not delete user uploads or unrelated work. Make restored working copies writable (`chmod u+w` as needed), install dependencies only if required, and restart the local preview.

The V1 routes `/` and `/dax-the-traveler` are kept in place during this iteration. The new travel-history experience is under `/experiments/dax-the-traveler-v2`.

## Portable export

The complete ZIP and downloadable ZIP parts are located next to this folder in `backups/`. Extract every part into the same destination folder; each contains different files under this same snapshot folder. Originals in the archive retain their original bytes. Working copies restored from read-only backup files may need writable permissions.