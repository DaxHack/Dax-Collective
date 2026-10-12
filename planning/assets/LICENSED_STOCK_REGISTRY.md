# Licensed / Stock / Editorial Asset Registry

Tracks any image used on the website that is **not** a personal photo, not original/AI-generated work, and not anime imagery — primarily licensed stock photography (e.g. Unsplash) currently used as fallback imagery for Time-Zone Travelers per `dax-main/src/services/brandAssetSources.js`.

These assets are typically referenced by URL rather than stored as personal files, but they still need source and license tracking so you always know what's allowed and for how long.

---

## Column definitions

| Column | What goes here |
|---|---|
| `id` | Short unique label, e.g. `tzt-stock-001` |
| `brand` | Which brand uses this asset |
| `asset_type` | hero / banner / gallery / thumbnail / video_still |
| `source_name` | e.g. Unsplash |
| `source_url` | Direct link to the image |
| `license_type` | e.g. "Unsplash free-use license" |
| `attribution_required` | yes/no — and exact required text if yes |
| `usage_limits` | Any restriction: editorial-only, no resale, no merch use, etc. |
| `expiration_or_review_date` | When to re-check this license/source is still valid and the image is still appropriate |
| `currently_in_use_on` | Which page/component references it now (e.g. "TimeZoneTravelersPage.jsx via brandAssetSources.js") |
| `notes` | Anything else |

---

## Registry

| id | brand | asset_type | source_name | source_url | license_type | attribution_required | usage_limits | expiration_or_review_date | currently_in_use_on | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| tzt-stock-001 | Time-Zone Travelers | hero | Unsplash | https://images.unsplash.com/photo-1488646953014-85cb44e25828 | Unsplash free-use license | no | Free for commercial/non-commercial use per Unsplash license; no implied endorsement | 2026-12-31 (annual recheck) | TimeZoneTravelersPage.jsx via brandAssetSources.js (timezoneHero pool) | Existing live fallback image, logged here for visibility |
| tzt-stock-002 | Time-Zone Travelers | video_still | Unsplash | https://images.unsplash.com/photo-1500530855697-b586d89ba3ee | Unsplash free-use license | no | Same as above | 2026-12-31 (annual recheck) | TimeZoneTravelersPage.jsx via brandAssetSources.js (timezoneVideo pool) | Existing live fallback image |
| tzt-stock-003 | Time-Zone Travelers | thumbnail | Unsplash | https://images.unsplash.com/photo-1540959733332-eab4deabeeaf | Unsplash free-use license | no | Same as above | 2026-12-31 (annual recheck) | TimeZoneTravelersPage.jsx via brandAssetSources.js (itinerary pool) | Existing live fallback image |

---

## Reminders

- Even free-use licenses can change terms or be revoked by the source platform — the `expiration_or_review_date` is a reminder to re-verify, not a hard legal expiration.
- If you ever replace one of these stock fallbacks with your own approved personal photo (tracked in `ASSET_REGISTRY.md`), update `currently_in_use_on` here to reflect the stock image is no longer live, rather than deleting the row outright — keeps a clean history.
- Add a new row any time a new stock/licensed image is introduced anywhere in the codebase.
