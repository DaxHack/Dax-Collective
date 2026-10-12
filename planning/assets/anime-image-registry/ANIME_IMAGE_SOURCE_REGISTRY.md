# Ani-Dax Anime Image Source Registry

A controlled, registry-driven pipeline for all Ani-Dax anime imagery. Completely separate from the personal-photo pipeline (`ASSET_REGISTRY.md`) — anime visuals never touch `Dax Intake/`, Google Photos, or Google Drive at all.

---

## The rule that governs this file (read before adding anything)

**An official, AniList, or press source is not automatic permission for every use.** Sourcing an image from a legitimate, traceable source only confirms it's not a random scrape or fan-art screenshot — it does **not** by itself grant rights for hero images, banners, thumbnails, merch, digital products, or any commercial use.

**Every row defaults to `editorial_reference_only` and stays there unless you explicitly approve a different specific allowed use.** "I found it on AniList" is never, by itself, a reason to mark something approved for hero/banner/thumbnail/merch use. You must make and record that decision yourself, per asset, per use.

**Never:** screenshots/frame-grabs, untracked fan art, random web image search results, or anime imagery used for merch/products under any circumstance (merch use is a hard policy no for anime-derived imagery regardless of source or approval — see `output-compliance-matrix.md`).

---

## Column definitions

| Column | What goes here |
|---|---|
| `id` | Short unique label, e.g. `ad-2026-001` |
| `title` | Anime title |
| `season` | e.g. "Summer 2026" |
| `image_url_or_source` | Direct URL — AniList CDN, official press kit, or licensor's own site. Never a locally-saved screenshot. |
| `image_type` | cover / banner / key_visual / promotional_still |
| `rights_risk_status` | `low` (official press/API cover art from a clearly licensed distributor feed), `medium` (officially sourced but ambiguous redistribution terms), `high` (anything resembling a frame-grab, fan edit, or unverifiable source — should default toward rejection) |
| `allowed_use` | Defaults to `editorial_reference_only`. Only changes to `hero_use_ok`, `thumbnail_use_ok`, etc. after you explicitly approve that specific use for that specific image. Never `merch_use` — not an available option under current policy. |
| `approval_status` | `draft_suggestion` / `approved` / `rejected` |
| `last_checked_date` | When you (or a review pass) last confirmed the source and rights status are still accurate |
| `notes` | Licensor name, season relevance, anything else |

---

## Registry

| id | title | season | image_url_or_source | image_type | rights_risk_status | allowed_use | approval_status | last_checked_date | notes |
|---|---|---|---|---|---|---|---|---|---|
| ad-fallback-001 | Re:Zero - Starting Life in Another World | Editorial reference (evergreen) | https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21355-wFZ0l7Qz0S5g.jpg | cover | low | editorial_reference_only | approved | 2026-06-28 | Existing fallback used in brandAssetSources.js. Editorial-only by current default; no hero/thumbnail use approved beyond what's already coded. |
| ad-fallback-002 | Frieren: Beyond Journey's End | Editorial reference (evergreen) | https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-gHSraOSa0nBG.jpg | cover | low | editorial_reference_only | approved | 2026-06-28 | Existing fallback used in brandAssetSources.js |
| ad-fallback-003 | Solo Leveling | Editorial reference (evergreen) | https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-12QdwxFK1fBH.jpg | cover | low | editorial_reference_only | approved | 2026-06-28 | Existing fallback used in brandAssetSources.js |
| ad-fallback-004 | Demon Slayer: Hashira Training Arc | Editorial reference (evergreen) | https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166240-k0d6OytVcVav.jpg | cover | low | editorial_reference_only | approved | 2026-06-28 | Existing fallback used in brandAssetSources.js (review pool) |
| ad-fallback-005 | Jujutsu Kaisen Season 2 | Editorial reference (evergreen) | https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx145064-mE01F4LuPN8d.jpg | cover | low | editorial_reference_only | approved | 2026-06-28 | Existing fallback used in brandAssetSources.js (review pool) |

*(The 5 rows above are the images already live in code via `fetchCurrentAnimeReferences`/`editorialAnimeFallback` in `brandAssetSources.js` — logged here for visibility. They're already editorial-only by how the code currently uses them, which matches default policy.)*

---

## Draft suggestions (new seasonal candidates — never auto-approved)

Each new season's AniList fetch should log candidates here first, in `draft-suggestions/[season].md`, before any row in the main table above moves past `draft_suggestion`. See `draft-suggestions/` folder for the running log.

---

## Reminders

- Changing `allowed_use` away from `editorial_reference_only` is always a deliberate, per-image, per-use decision by you — never inferred from `rights_risk_status` being `low`, and never bulk-applied across a season's worth of images at once.
- `merch_use` is not an available value for `allowed_use` under current policy — if you want to revisit that, it needs an explicit policy change, not a registry edit.
- Re-verify `rights_risk_status` periodically (`last_checked_date`) — a source that was fine last season may change distribution terms.
