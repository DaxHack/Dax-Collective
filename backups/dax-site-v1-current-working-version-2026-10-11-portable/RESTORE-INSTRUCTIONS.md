# Dax Site V1 - Current Working Version — portable checkpoint

This is a sanitized frontend recovery checkpoint, not the full local archive. It contains pre-V3 canonical/V2 source and approved public assets plus the current portable package locks and settings. Originals and private/local content are excluded.

Verify with sha256sum -c SHA256SUMS or the current scripts/v3-snapshot.py. Rehearse with scripts/v3-snapshot.py rehearse CHECKPOINT. For real recovery, copy the manifest's files into a separate writable directory; npm ci at the root, then npm ci and npm run build in dax-main. Do not overwrite newer work or edit the full immutable local snapshots. No application secrets are required.
