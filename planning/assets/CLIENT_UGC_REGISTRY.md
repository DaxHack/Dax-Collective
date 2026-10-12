# Client / UGC Asset Registry

Tracks any image, video still, or graphic provided by a client or another person — explicitly separate from your own brand assets, since these carry permission and ownership obligations your own photos/designs don't.

This is for future use (e.g. The Dax Collective service offering, testimonials, collaborator content) — no entries exist yet as of this writing.

---

## Column definitions

| Column | What goes here |
|---|---|
| `id` | Short unique label, e.g. `ugc-001` |
| `client_or_source_name` | Who provided this asset |
| `related_brand_or_project` | Which brand/project this supports (e.g. "Dax Collective — client testimonial," "Dax the Traveler — collab content") |
| `permission_status` | `granted` / `pending` / `expired` / `denied` |
| `permission_scope` | Exactly what it can be used for — be specific (e.g. "website portfolio page only," "social media + website, no print/merch") |
| `expiration_date` | If permission is time-limited; blank if perpetual and confirmed in writing |
| `ownership_note` | Confirms the asset is NOT Dax Collective IP — who retains ownership/credit |
| `asset_path` | Path once live, if applicable |
| `date_added` | YYYY-MM-DD |
| `notes` | Anything else — how permission was obtained (email, signed release, verbal — verbal should be flagged as weaker and ideally followed up in writing) |

---

## Registry

| id | client_or_source_name | related_brand_or_project | permission_status | permission_scope | expiration_date | ownership_note | asset_path | date_added | notes |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

*(No entries yet — this registry is ready for when client/UGC content is first received.)*

---

## Reminders

- Never publish anything in this registry without `permission_status = granted` and a clear `permission_scope`.
- Verbal-only permission should be treated as provisional — try to get written confirmation (even a simple text/email) before anything goes live, and note the weaker status in `notes` until upgraded.
- If permission expires (`expiration_date` passes) and hasn't been renewed, treat the asset as no longer approved for use even if it's still technically live — flag for takedown/renewal.
