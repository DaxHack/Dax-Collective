# Original / AI-Generated Asset Registry

Tracks your own original designs, logos, and AI-generated graphics — anything you created or commissioned rather than photographed or sourced externally.

This covers files placed in `Dax Intake/Original and AI Assets/` as well as existing logo/banner files already in `dax-main/public/images/brands/**`.

---

## Column definitions

| Column | What goes here |
|---|---|
| `id` | Short unique label, e.g. `dc-logo-001` |
| `brand` | Which brand this belongs to |
| `asset_type` | logo / banner / design / ai_generated_graphic / merch_graphic / source_file |
| `creation_method` | `original_hand_made`, `ai_generated`, or `commissioned` |
| `prompt_or_source_record` | The exact AI prompt used (if AI-generated), or a note on the original source file/design tool file location |
| `tool_used` | e.g. Canva, Photoshop, a specific AI image generator |
| `rights_status` | `owned` is the default for your own original work; note if commissioned with specific usage terms |
| `approved_for_public` | yes/no |
| `asset_path` | Path once live, e.g. `dax-main/public/images/brands/dax-collective/logo-v1.png` or future `public/dax-collective/logo/...` Storage path |
| `date_added` | YYYY-MM-DD |
| `notes` | Anything else |

---

## Registry

### Existing assets found during the original repo audit (logged here for visibility — not yet fully reviewed/approved)

| id | brand | asset_type | creation_method | prompt_or_source_record | tool_used | rights_status | approved_for_public | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| dc-logo-existing-1 | Dax Collective | logo | original_hand_made | Unknown — predates this registry | Unknown | owned (assumed) | needs_review | dax-main/public/images/brands/dax-collective/ (3 variants found) | 2026-06-28 | Existing file, not yet formally reviewed against this registry's standards |
| ad-logo-existing-1 | Ani-Dax | logo | original_hand_made | Unknown — predates this registry | Unknown | owned (assumed) | needs_review | dax-main/public/images/brands/ani-dax/ (4 concept variants + avatar + app icon) | 2026-06-28 | Existing file, not yet formally reviewed |
| dt-logo-existing-1 | Dax the Traveler | logo | original_hand_made | Unknown — predates this registry | Unknown | owned (assumed) | needs_review | dax-main/public/images/brands/dax-traveler/ | 2026-06-28 | Existing file, not yet formally reviewed |
| gv-logo-existing-1 | God's Vessel | logo | original_hand_made | Unknown — predates this registry | Unknown | owned (assumed) | needs_review | dax-main/public/images/brands/gods-vessel/ | 2026-06-28 | Existing file, not yet formally reviewed |
| tzt-logo-existing-1 | Time-Zone Travelers | logo | original_hand_made | Unknown — predates this registry | Unknown | owned (assumed) | needs_review | dax-main/public/images/brands/timezone-travelers/ (2 files) | 2026-06-28 | Existing file, not yet formally reviewed |

### New entries (add here going forward)

| id | brand | asset_type | creation_method | prompt_or_source_record | tool_used | rights_status | approved_for_public | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

---

## Reminders

- For AI-generated images, always record the actual prompt — useful both for regenerating variants later and for confirming you have a defensible originality record.
- "Existing assets" rows above are a starting inventory from the earlier repo audit, not a completed review. Treat `approved_for_public = needs_review` as a placeholder until you've actually confirmed each one.
- Commissioned work should note the usage terms agreed with the creator in `notes` (exclusive rights, attribution required, etc.).
