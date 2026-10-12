# Asset Approval Process

The full workflow for moving any asset — personal photo, stock image, original design, anime reference, or client content — from its source to the live Dax Collective website, with separation by source type and no automation ever touching your private Google Photos library.

Companion files in this folder:
- `ASSET_REGISTRY.md` — personal photos moving toward the website
- `LICENSED_STOCK_REGISTRY.md` — stock/editorial images
- `ORIGINAL_AI_ASSET_REGISTRY.md` — your own designs/AI-generated graphics
- `CLIENT_UGC_REGISTRY.md` — client/other-person content
- `anime-image-registry/ANIME_IMAGE_SOURCE_REGISTRY.md` — Ani-Dax imagery
- `photo-intake-pipeline.md` — detailed personal-photo intake rules
- `review-queue-template.md` — the weekly batch-review format

---

## The rule that matters across every source type

**No asset reaches the live website unless you deliberately approved it.** For personal photos specifically, that means two separate decisions: moving it from Photos into Drive Intake (your choice alone, never automated), and then approving that staged file for actual upload to Firebase Storage `public/`. For anime imagery, it means a source being "official" is never itself permission — you must explicitly approve a specific allowed use per image.

---

## Source-separated architecture

| Layer | Contents | Automation allowed? | Public? |
|---|---|---|---|
| 1. Google Photos | Your full private library | Never scanned, synced, or pulled from automatically | No |
| 2. Google Drive Intake (`Dax Intake/...`) | Only files you manually copied out of Photos | Yes — inspection/sorting only, within these folders | No |
| 3. Firebase Storage `public/` | Batch-approved files only | Upload only after your explicit approval | Yes |
| 4. Licensed/Stock/Editorial registry | Stock images, tracked by URL | Already in use via `brandAssetSources.js`; tracked in `LICENSED_STOCK_REGISTRY.md` | Yes, per license terms |
| 5. Ani-Dax Anime Editorial registry | AniList/official press art, tracked by URL | Draft-suggestion generation safe; approval always manual | Editorial-only by default |
| 6. Original/AI-Generated registry | Your designs, logos, AI graphics | No scanning — you add rows as you create | Yes, once approved |
| 7. Client/UGC registry | Anything from a client/other person | Never automated — permission tracking is manual | Yes, only within granted permission scope |

Website code only ever reads from Layer 3, or directly-referenced URLs from Layer 4/5 (license/policy permitting) — never Layer 1 or 2.

---

## Pipeline A: Personal/travel photos (Layers 1 → 2 → 3)

### Stage 1 → 2: Google Photos to Google Drive Intake (manual only, always)

1. You open Google Photos as normal — nothing here is ever touched by automation.
2. You personally choose photos appropriate for a brand.
3. You manually copy/export those specific files into the matching `Dax Intake/...` subfolder:

   | Folder | Brand(s) |
   |---|---|
   | `Dax Intake/Travel/` | Dax the Traveler, Time-Zone Travelers |
   | `Dax Intake/Faith/` | God's Vessel |
   | `Dax Intake/Dax Collective Services/` | Dax Collective |
   | `Dax Intake/Merch Concepts/` | cross-brand merch graphic candidates |
   | `Dax Intake/Licensed Stock and Editorial/` | holding spot only — main tracking is in `LICENSED_STOCK_REGISTRY.md` |
   | `Dax Intake/Original and AI Assets/` | your designs/AI graphics — tracked in `ORIGINAL_AI_ASSET_REGISTRY.md` |
   | `Dax Intake/Client UGC Assets/` | client content — tracked in `CLIENT_UGC_REGISTRY.md` |

4. See `photo-intake-pipeline.md` for the exact sub-type folders and auto-sort/rejection rules applied once a file is in Drive Intake.
5. Every file gets a row in `ASSET_REGISTRY.md` with `pipeline_stage` reflecting where it stands. Rejected/flagged files are never moved or deleted automatically — they stay exactly where you put them; only the registry changes.

### Stage 2 → 3: Drive Intake to Firebase Storage (manual-trigger only)

1. You review pending rows (see `review-queue-template.md`) and batch-approve specific ones.
2. Approved files are manually uploaded (or uploaded via an explicitly-run, reviewed step — never a silent background sync) to `public/{brand-slug}/{asset_type}/{filename}`.
3. The registry row updates: `pipeline_stage = live`, `asset_path` filled in.

### Stage 3 → 4: Firebase Storage to website pages

Website code references the `public/...` path from the registry. It never reads directly from Drive or Photos links.

---

## Pipeline B: Ani-Dax anime visuals (registry-only, no Drive staging)

1. Seasonal AniList fetch (or manual addition of an official/press source) produces candidate rows logged as `draft_suggestion` in `anime-image-registry/draft-suggestions/[season].md`.
2. You review each candidate. Promotion to the main `ANIME_IMAGE_SOURCE_REGISTRY.md` table requires you to explicitly set `approval_status: approved` AND choose a specific `allowed_use` — it never defaults to anything beyond `editorial_reference_only`.
3. An official/traceable source (AniList, press kit) only qualifies an image to be considered — it is never itself permission for hero/banner/thumbnail/merch/commercial use. Each such use requires its own explicit approval, per image.
4. Merch/product use of anime-derived imagery is never an approvable option under current policy, regardless of source or rights-risk rating.

---

## Pipeline C/D/E: Stock, Original/AI, Client-UGC (registry-tracked, lighter process)

- **Stock/licensed** — add a row to `LICENSED_STOCK_REGISTRY.md` whenever a new stock image is introduced in code; periodically re-check `expiration_or_review_date`.
- **Original/AI** — add a row to `ORIGINAL_AI_ASSET_REGISTRY.md` whenever you create or commission a new design/graphic; record the prompt or source file location.
- **Client/UGC** — add a row to `CLIENT_UGC_REGISTRY.md` only once permission is confirmed (ideally in writing); never publish without `permission_status = granted` and a clear `permission_scope`.

---

## If you change your mind about a live asset

1. Remove/replace the file at its path in Firebase Storage.
2. Update the relevant registry row: clear `asset_path`, set status back to not-live.
3. For personal photos, also decide whether to remove the file from `Dax Intake/...` yourself (automation never does this for you).
