---
name: Local preview approval
description: Approval boundaries and authenticity requirements for visual experiments in this project.
---

Keep visual experiments in the local Replit workspace until the user explicitly approves a different scope. Do not use GitHub, git commits, remote sync, publishing, deployments, external services, or credentials merely to finish a preview.

**Why:** The user repeatedly requires a local review before any remote or production activity.

**How to apply:** Carry the same restriction into delegated work and verification. Do not suggest publishing while approval is pending.

Daniel approved the V3 design and interaction direction, not implementation. Do not start another planning cycle unless implementation reveals a genuine blocker. Preserve V1/V2 and keep V3 isolated.

**Why:** Daniel explicitly separated blueprint approval from Build authorization.

**How to apply:** Require the next authorized Build task before implementing. Scene-specific Figma approvals and media-use reviews remain separate gates.

For the next authorized Build task, Phase 1A must produce a durable technical foundation committed and pushed to a dedicated V3 GitHub branch after verification, so work can continue outside Replit with Claude, ChatGPT/Codex, Figma-connected workflows, or another development environment. GitHub operations are not authorized during planning approval; they are part of the Phase 1A Build definition of done.

**Why:** Daniel requested portability and continuity outside Replit.

**How to apply:** Carry this requirement into the next Build assignment without treating it as permission for GitHub activity now. The local-only rule above remains in effect for this planning approval.

Preserve saved pre-experiment snapshots unchanged, separate from the working site. Recovery should copy from the snapshot into working files; never edit the snapshot in place.

**Why:** The user needs a reliable quick rollback and a portable saved version to compare against experimental redesigns.

**How to apply:** Verify integrity before and after the experiment. Ensure restored working copies are writable if the saved files were made read-only.

New major iterations should use separate local comparison routes while leaving the current working pages available.

**Why:** The user explicitly prioritizes redesign safety and comparison before replacing the working version.

**How to apply:** Save and verify the current frontend before editing, then add an experimental route instead of repointing an existing brand route. Cloud media discovery is a separate opt-in, read-only action; connecting Drive is not permission to modify cloud originals.

Use real uploaded photography to make the Traveler brand personal. Do not infer trips, dates, anecdotes, budgets, or achievements from asset filenames or previously written marketing copy.

**Why:** Earlier visual copy contained unsupported personal travel claims; the user explicitly requires verified content or clearly labeled concepts.

**How to apply:** Distinguish photographed/verified locations from unlocated portraits and future destination concepts. Never replace the user's travel photography with generic AI or stock people.

Original photographs must remain byte-for-byte unchanged. A filename containing a date is only a candidate clue, not evidence of where the photo was taken.

**Why:** The user forbids altering originals and requires CONFIRMED / APPROXIMATE / UNKNOWN travel information. Unknown does not mean the visit did not occur.

**How to apply:** Use existing reviewed derivatives or exact copies for the browser; preserve HEIC and other originals in intake. Do not attach an unlocated portrait to a trip merely because its filename falls within the trip’s period.