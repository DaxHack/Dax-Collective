---
name: Git delivery safety
description: Sensitive unpublished ancestry blocks blindly pushing the local project history.
---

Do not push the original Replit ancestry or original baseline tree blindly. The original tracked tree contains a Firebase service-account private key and hardcoded Google OAuth client secret, not just sensitive ancestors. Do not expose credential values in chat, logs, documentation or commits. The sanitized recovery snapshot excludes the credential file and uses environment-based OAuth configuration.

**Why:** A clean Git status does not establish credential safety. Removing ancestry alone would still publish secrets present in the copied tree.

**How to apply:** The user's top priority is "do not rewrite any existing branch." Use an independently verified history-free repository, sanitize the tree, scan supported nested archives, and push only authorized new branch/tag references. Preserve all existing branch tips and verify that the active checkout remains clean at the starting commit.

Git archives may hydrate LFS-tracked backup ZIPs rather than extract pointer
blobs. Preserve their original LFS pointer identities when staging the snapshot.

**Why:** Directly comparing hydrated bytes with a pointer blob creates a false
preservation failure, and committing hydrated ZIPs without LFS can exceed GitHub
blob limits.

**How to apply:** Scan the hydrated contents, verify their SHA-256 and size
against the original pointers, and verify staged pointers against the baseline.
Build the independent repository outside the workspace and retain a Git bundle
for durable recovery.

Verify generic-key scanner hits in preservation manifests against the original
file hashes before classifying them as false positives.

**Why:** Filenames containing "auth", "api" or "token" can cause generic-key
rules to mistake adjacent SHA-256 fingerprints for credentials.

**How to apply:** Preserve the raw redacted scan report, verify flagged values
as actual source-file hashes, and scope any allowlist to hexadecimal
fingerprints in that exact manifest, never the whole file or all hash-like keys.
