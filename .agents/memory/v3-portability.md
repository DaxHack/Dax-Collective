---
name: Safe portable branch
description: Why V3 portability must not inherit legacy repository history or depend on workspace-only package URLs.
---

The legacy local Git history contains credential-bearing files. Authorized V3 portability uses a separate clean-history branch, not a descendant of that history. Preserve the owner's originals locally, exclude private credentials and unreviewed uploads from export, and keep actual credential rotation/history remediation separately authorized.

**Why:** Deleting secrets in a new commit still publishes them through its ancestors. The user requires portability without secrets in the repository and unchanged original backups.

**How to apply:** Do not blindly merge legacy ancestry into the portable branch. Carry reviewed safe changes forward without transmitting credentials or older unreviewed ZIP archives.

Daniel states the Firebase service-account key is a known legacy credential from before July 2026: already leaked, rotated, disabled/abandoned, no longer used, and unrelated to the current project. Do not investigate, rotate, recover, or repeatedly report it. Only a new exposure or an active credential created/exposed after July 2026 can be a new credential blocker.

**Why:** Daniel explicitly authorized continued Phase 1A delivery under this legacy-key exception.

**How to apply:** Use clean-history export as a portability step only; retain the completed foundation, deliver the dedicated branch, and do not start Phase 1B or final Figma scenes.

Do not rely on a nested `.git` directory inside ignored generated output surviving a resumed workspace. Preserve an unpublished clean-history milestone as a Git bundle instead.

**Why:** An export directory is not proof of a separate Git boundary; without its own repository metadata, Git resolves the parent repository.

**How to apply:** Before pushing, verify the Git top-level and root commit explicitly. Build the clean repository outside the workspace and save a bundle in ignored generated output if delivery is blocked.

Check fresh locked installs, not only existing node_modules. Workspace package proxies can appear in generated lockfile download URLs; public portable locks must point to the corresponding public package archive with unchanged integrity.

**Why:** Existing installed dependencies can conceal a non-reproducible saved dependency tree.

**How to apply:** Verify locked installs, builds and interaction tests in a clean checkout without application secrets; do not assume a successful development build proves portability.

Apply upload exclusions to every export path, including nested recovery snapshots. A full immutable local backup and a reviewed portable checkpoint have different distribution boundaries.

**Why:** Copying a full backup can bypass exclusions applied to the live working tree and transmit originals that must stay local.

**How to apply:** Derive portable checkpoints from a source/public/configuration allowlist, record exactly those files, and check all reachable branch trees—not only the current checkout.
