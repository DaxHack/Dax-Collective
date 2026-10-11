# Downloading the saved website

The complete `dax-collective-pre-immersive-redesign-2026-09-30.zip` remains available in this workspace. At approximately 149 MB, it exceeds the attachment-card limit.

Two smaller, verified ZIPs contain exactly the same snapshot files:

1. `dax-collective-pre-immersive-redesign-2026-09-30-part-1.zip`: source, configuration, approved assets, checksums, and restore instructions.
2. `dax-collective-pre-immersive-redesign-2026-09-30-part-2.zip`: original local image library.

Download **both**, then extract both into the **same destination directory**. These are ordinary ZIPs, not a binary split archive. Together they create `pre-immersive-redesign-2026-09-30/`.

Verify the extracted snapshot:

```sh
cd pre-immersive-redesign-2026-09-30
sha256sum -c SHA256SUMS
```

Read `RESTORE-INSTRUCTIONS.md` inside that folder for local rollback and frontend reproduction.

The saved backup files are read-only to guard against accidental changes. When copying them back into a working website, make the restored working copies writable with `chmod -R u+w dax-main/src dax-main/public` and `chmod u+w dax-main/package*.json dax-main/tailwind.config.js dax-main/postcss.config.js dax-main/.eslintrc*`. Do not change the saved backup's permissions or contents.

The immutable backup itself has not been modified. The full ZIP and both smaller ZIPs all preserve the same saved version.