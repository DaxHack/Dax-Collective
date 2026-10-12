# Asset Registry (Personal Photos → Public Website)

This file tracks personal/travel-style assets as they move from your private Google Photos library, through manually-curated Google Drive intake folders, to (only if approved) the live website via Firebase Storage.

It covers `source_category: personal_photo` primarily. For other source types, use the companion registries in this same folder:

- `LICENSED_STOCK_REGISTRY.md` — stock/editorial images (Unsplash, etc.)
- `ORIGINAL_AI_ASSET_REGISTRY.md` — your own designs, logos, AI-generated graphics
- `CLIENT_UGC_REGISTRY.md` — anything from a client or other person
- `anime-image-registry/ANIME_IMAGE_SOURCE_REGISTRY.md` — all Ani-Dax anime imagery (separate pipeline entirely)

See `asset-approval-process.md` for the full workflow this registry supports, and `photo-intake-pipeline.md` for the personal-photo intake rules specifically.

---

## The rule that governs this file

**Nothing is public because it has a row here.** A row only goes live once `pipeline_stage = approved_pending_upload` has been manually pushed to `live` and `asset_path` is filled in. Until then, it's just a tracked candidate.

**Google Photos is never scanned, synced, or pulled from automatically — by anything, ever.** You manually choose photos and copy them into a `Dax Intake/...` Drive folder yourself. Automation only ever looks inside those Drive intake folders, never your Photos library.

**Rejected items are never moved or deleted by automation.** They stay exactly where they are (in Drive Intake, or wherever you placed them) and the registry just logs why. See `rejection_reason` below.

---

## Column definitions

| Column | What goes here |
|---|---|
| `id` | Short unique label, e.g. `dt-001` (brand initials + number) |
| `brand` | Dax Collective, Dax the Traveler, Time-Zone Travelers, or God's Vessel (Ani-Dax is tracked separately — see anime registry) |
| `asset_type` | logo / banner / hero / gallery / thumbnail / mobile_crop / merch_graphic / video_still |
| `source_category` | `personal_photo` (default for this file), or note if something else accidentally landed here |
| `intake_folder` | The exact `Dax Intake/...` subfolder this file is sitting in right now — this folder placement is the primary brand/category signal, not AI guessing |
| `pipeline_stage` | `incoming_review` / `needs_human_review` / `rejected` / `approved_pending_upload` / `live` |
| `rejection_reason` | Filled only if `pipeline_stage = rejected`. Per current policy, automatic rejection is limited to: `duplicate_hash_match` or `technical_blur`. Anything else suspicious (ID, receipt, ticket, address, sensitive/private content, unclear permission) must be `needs_human_review`, never auto-rejected. |
| `original_location_note` | Plain note on where the file still physically lives (e.g. "still in Dax Intake/Travel/, not moved or deleted") — important because rejected/flagged files are never relocated automatically |
| `batch_id` | Which approval batch this was reviewed in, e.g. `2026-07-batch-1` |
| `source` | e.g. `Google Photos (personal) — manually exported` |
| `rights_status` | `owned` (default for your own photos), or other if relevant |
| `approved_for_public` | yes/no — have you personally decided this is okay for anyone to ever see publicly? |
| `approved_for_website` | yes/no — have you personally decided this specific file goes live right now? |
| `mobile_crop_available` | yes/no/n/a |
| `asset_path` | Final Firebase Storage path once live, e.g. `public/dax-traveler/hero/cuba-beach-01.jpg`. Blank until actually uploaded. |
| `date_added` | YYYY-MM-DD |
| `notes` | Anything else |

---

## Registry

### Dax Collective

| id | brand | asset_type | source_category | intake_folder | pipeline_stage | rejection_reason | original_location_note | batch_id | source | rights_status | approved_for_public | approved_for_website | mobile_crop_available | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dc-001 | Dax Collective | hero | personal_photo | Dax Intake/Dax Collective Services/hero/ | incoming_review | | Dax Intake/Dax Collective Services/hero/ | | Google Photos (personal) — manually exported | owned | no | no | no | | 2026-06-28 | Example row — replace or delete |

### Dax the Traveler

| id | brand | asset_type | source_category | intake_folder | pipeline_stage | rejection_reason | original_location_note | batch_id | source | rights_status | approved_for_public | approved_for_website | mobile_crop_available | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dt-001 | Dax the Traveler | hero | personal_photo | Dax Intake/Travel/hero/ | incoming_review | | Dax Intake/Travel/hero/ | | Google Photos (personal) — manually exported | owned | no | no | no | | 2026-06-28 | Example row — replace or delete |

#### Travel Intake Batch 001 — existing "Dax Traveler / Dax The Traveler Photos" Drive folder (inventory-only, not yet moved into `Dax Intake/Travel`)

Source note for every row below: `Google Drive — Dax Traveler/Dax The Traveler Photos (existing folder, predates Dax Intake structure)`. None of these are approved for public or website use — `approved_for_public`/`approved_for_website` are `no` for every row until you say otherwise. Selection below is based on filename/file-size/type metadata only — no image was visually opened or viewed, so "strongest candidate" is a metadata-based shortlist for your visual pick, not a quality judgment.

| id | brand | asset_type | source_category | intake_folder | pipeline_stage | rejection_reason | original_location_note | batch_id | source | rights_status | approved_for_public | approved_for_website | mobile_crop_available | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dt-101 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20210402_084708.jpg, 1.9MB, named camera-roll file |
| dt-102 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | IMG_5215.jpg, 1.5MB, named camera-roll file |
| dt-103 | Dax the Traveler | hero | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20210628_230116.jpg, 9.9MB — largest named file in batch, possible night/low-light shot; also flag as possible Time-Zone Travelers reuse pending your visual check for faceless/destination-only framing |
| dt-104 | Dax the Traveler | thumbnail | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | VideoCapture_20220119-200316.jpg, 6.1MB — high-res frame grab from video, treat as a still |
| dt-105 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20220121_183509.heic, 508KB, named camera-roll file |
| dt-106 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20220409_033026.heic, 1.0MB, named camera-roll file — same calendar day as dt-107/dt-123 video |
| dt-107 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20220409_114301.heic, 1.1MB, named camera-roll file — same calendar day as dt-106/dt-123 video |
| dt-108 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20220507_181208.heic, 1.1MB, named camera-roll file |
| dt-109 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20221009_175821.jpg, 1.3MB, named camera-roll file |
| dt-110 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name), 5.0MB — high resolution suggests full original photo, not a screenshot; possible Time-Zone Travelers reuse pending visual check |
| dt-111 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name), 5.7MB — largest generic-name file in batch; possible Time-Zone Travelers reuse pending visual check |
| dt-112 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name), 5.5MB; possible Time-Zone Travelers reuse pending visual check |
| dt-113 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name), 4.0MB |
| dt-114 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name), 4.5MB |
| dt-115 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name), 4.0MB |
| dt-116 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name), 3.4MB |
| dt-117 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name, HEIF), 3.0MB |
| dt-118 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name, HEIF), 2.1MB |
| dt-119 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name, HEIF), 2.6MB |
| dt-120 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "image.jpg" (generic export name, HEIF), 2.1MB |
| dt-121 | Dax the Traveler | video_still | personal_photo | N/A — existing Drive folder | needs_human_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | video.mp4, 308MB — largest video in batch; flag for human review on content + needs trim/compression before any use consideration |
| dt-122 | Dax the Traveler | video_still | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | video.mp4, 111MB — social/video candidate, needs review/trim |
| dt-123 | Dax the Traveler | video_still | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20220409_130747.mp4, 111MB, named file — same calendar day as dt-106/dt-107 photos, possible same-trip clip |
| dt-124 | Dax the Traveler | video_still | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | video.mp4, 53MB — social/video candidate, needs review/trim |
| dt-125 | Dax the Traveler | video_still | personal_photo | N/A — existing Drive folder | incoming_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | video.mp4, 96MB — social/video candidate, needs review/trim |
| dt-126 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | needs_human_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | 20210726_112324.dng — only RAW file found in batch; needs conversion + your visual review before any use decision |
| dt-127 | Dax the Traveler | gallery | personal_photo | N/A — existing Drive folder | needs_human_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | "2023-12-20.jpg" — same filename appears 8 times in this folder at different file sizes (104KB–377KB). Likely burst/near-duplicate or edited variants of the same capture, but sizes differ enough that filename alone is not proof of duplication — needs your visual dedup review, not auto-rejected |
| dt-128 | Dax the Traveler | video_still | personal_photo | N/A — existing Drive folder | needs_human_review | | Still in Dax Traveler/Dax The Traveler Photos | travel-intake-batch-001 | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | video.mp4, 453MB — single largest file in entire batch; flag for review on content and whether a trimmed/compressed export is even needed before considering any use |

### Time-Zone Travelers

| id | brand | asset_type | source_category | intake_folder | pipeline_stage | rejection_reason | original_location_note | batch_id | source | rights_status | approved_for_public | approved_for_website | mobile_crop_available | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| tzt-001 | Time-Zone Travelers | gallery | personal_photo | Dax Intake/Travel/gallery/ | incoming_review | | Dax Intake/Travel/gallery/ | | Google Photos (personal) — manually exported | owned | no | no | no | | 2026-06-28 | Example row — replace or delete. Current live fallback imagery for this brand is tracked in `LICENSED_STOCK_REGISTRY.md`, not here. |

### God's Vessel

| id | brand | asset_type | source_category | intake_folder | pipeline_stage | rejection_reason | original_location_note | batch_id | source | rights_status | approved_for_public | approved_for_website | mobile_crop_available | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| gv-001 | God's Vessel | banner | personal_photo | Dax Intake/Faith/banner/ | incoming_review | | Dax Intake/Faith/banner/ | | Google Photos (personal) — manually exported | owned | no | no | no | | 2026-06-28 | Example row — replace or delete |

---

#### First Public Test Shortlist (5 slots, all unapproved — awaiting your exact filename/ID picks)

Purpose: the smallest possible first batch to prove the Drive → registry → (eventually, manual) Storage flow. Every row stays `pending_selection` until you supply the exact filename or file ID from Drive — nothing here is approved, and nothing moves until you say so.

| id | brand | category | asset_type | source_category | intake_folder | pipeline_stage | original_location_note | batch_id | source | rights_status | approved_for_public | approved_for_website | mobile_crop_available | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dt-pt-01 | Dax the Traveler | destination/landmark photo | gallery | personal_photo | N/A — existing Drive folder | pending_selection | Still in Dax Traveler/Dax The Traveler Photos | first-public-test | Google Drive (existing folder) | owned | no | no | unknown | | 2026-06-28 | Awaiting exact filename/file ID from you |
| dt-pt-02 | Dax the Traveler | personal travel photo | gallery | personal_photo | N/A — existing Drive folder | pending_selection | Still in Dax Traveler/Dax The Traveler Photos | first-public-test | Google Drive (existing folder) | owned | no | no | unknown | | 2026-06-28 | Awaiting exact filename/file ID from you |
| dt-pt-03 | Dax the Traveler | scenery/beach photo | gallery | personal_photo | N/A — existing Drive folder | pending_selection | Still in Dax Traveler/Dax The Traveler Photos | first-public-test | Google Drive (existing folder) | owned | no | no | unknown | | 2026-06-28 | Awaiting exact filename/file ID from you |
| dt-pt-04 | Dax the Traveler | food/culture photo | gallery | personal_photo | N/A — existing Drive folder | pending_selection | Still in Dax Traveler/Dax The Traveler Photos | first-public-test | Google Drive (existing folder) | owned | no | no | unknown | | 2026-06-28 | Awaiting exact filename/file ID from you |
| dt-pt-05 | Dax the Traveler | optional video | video_still | personal_photo | N/A — existing Drive folder | pending_selection | Still in Dax Traveler/Dax The Traveler Photos | first-public-test | Google Drive (existing folder) | owned | no | no | n/a | | 2026-06-28 | Optional — leave blank if you skip the video slot. Awaiting exact filename/file ID from you |

`pending_selection` is a new status reserved for this shortlist — it means "category slot exists, no file chosen yet." It only moves to `incoming_review` once you've named the file, and only moves to `approved_pending_upload` after your explicit approval — same rule as everywhere else in this registry.

---

## Quick status summary (update manually as rows grow)

| Brand | Total logged | Live on website | Pending review | Rejected |
|---|---|---|---|---|
| Dax Collective | 1 | 0 | 1 | 0 |
| Dax the Traveler | 29 | 0 | 25 incoming_review + 4 needs_human_review | 0 |
| Time-Zone Travelers | 1 | 0 | 1 | 0 |
| God's Vessel | 1 | 0 | 1 | 0 |

---

## Reminders

- Replace or delete example rows before logging real assets.
- `approved_for_public = yes` is your decision alone — never inferred from a file simply existing in an intake folder.
- Automatic rejection is limited to exact duplicate-hash matches and clear technical blur. Everything else uncertain (IDs, receipts, tickets, addresses, sensitive content, unclear permission) goes to `needs_human_review` — never silently rejected or deleted.
- Rejected/flagged files are never moved or deleted by automation. They stay in their original intake folder; only the registry row changes.
