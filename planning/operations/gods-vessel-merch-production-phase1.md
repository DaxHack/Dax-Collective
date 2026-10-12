# God's Vessel — Phase One: Six Entries Merch Production System

**Date:** 2026-06-30
**Status:** Planning and asset-production workflow design only. No store accounts created, no Shopify/Printify connected, no products published or ordered, no money spent, no website code changed, no final public listings created.
**Brand lane:** Modern Devotional Archive + Premium Faithwear Studio (locked in `visual-approval-sprint.md`, Section 4).
**Supervision model:** Claude = product planner, Canva batch-builder, copywriter, spreadsheet organizer. Canva = design/template production. Shopify = storefront (later). Printify/Printful/fulfillment partner = production and shipping (later). You = final design approval, sample approval, pricing, and publish approval — every step.

---

## A. Proposed master Google Sheet — column structure

One row per product concept/entry. Recommended columns, in order:

| # | Column | Purpose |
|---|---|---|
| 1 | Collection Name | e.g. "Phase One: Six Entries" — groups rows into a release batch |
| 2 | Theme/Name | the name or attribute (Adonai, El Shaddai, Grace, Hope, Faith, Peace) |
| 3 | Garment Type | tee, hoodie, crewneck, cap, etc. |
| 4 | Garment Color | the specific colorway (washed black, stone, cream, etc.) |
| 5 | Garment Blank Direction | weight/fabric notes (heavyweight, garment-dyed, washed cotton) — direction only, not a final blank SKU yet |
| 6 | Front Concept | what's on the front (name/word treatment, raised lettering note, etc.) |
| 7 | Back Concept | what's on the back (definition, scripture, archive text) |
| 8 | Scripture Reference | the verse tied to this theme |
| 9 | Definition/Meaning | short devotional definition of the name/theme |
| 10 | Logo Used | Living Water or Simplified GV |
| 11 | Logo Placement | per the locked placement rules (front chest/back lockup/neck for Living Water; lower-back tail square for GV) |
| 12 | Print Method | high-density print, puff/raised print, embroidery, woven label, tonal print, etc. |
| 13 | Product Copy | draft title + short description (Claude-generated, human-approved) |
| 14 | Canva Template Status | Not started / In progress / Ready for review / Approved |
| 15 | Mockup Status | Not started / Drafted / Approved |
| 16 | Sample Status | Not ordered / Ordered / Received / Approved / Rejected |
| 17 | Fulfillment Compatibility | Standard POD-compatible / Requires specialty printer / Unknown — needs test |
| 18 | Shopify Readiness | Not ready / Copy ready / Images ready / Fully ready to list |
| 19 | Approval Status | Draft / Pending Your Review / Approved / On Hold |

This sheet becomes the single source of truth Claude works from for every downstream asset — Canva files, copy, mockup instructions, and eventually listing data.

---

## B. Six-entry product concept matrix (Phase One: Six Entries)

All rows are **Draft / Pending Your Review** — nothing here is final or produced.

| Theme | Garment | Color | Front Concept | Back Concept | Scripture | Logo | Logo Placement | Print Method |
|---|---|---|---|---|---|---|---|---|
| **Adonai** | Heavyweight tee | Washed black | "ADONAI" minimal wordmark | Definition + scripture in archive-label type | Psalm 8:1 | Simplified GV | Lower-back tail square | High-density print |
| **El Shaddai** | Hoodie | Stone | Raised "EL SHADDAI" lettering | Minimal archive text (definition only) | Genesis 17:1 | Simplified GV | Lower-back tail square | Puff/high-density print |
| **Grace** | Washed tee | Washed cream | "GRACE" wordmark | "Ephesians 2:8" + short meaning line | Ephesians 2:8 | Living Water | Neck mark or small back-neck hit | Tonal print |
| **Hope** | Garment-dyed oversized tee | Washed black or sage | "HOPE" wordmark, expressive type treatment | Verse + short phrase, streetwear-style back graphic | Romans 15:13 | Living Water | Front chest statement + back graphic lockup | Tonal/high-density print |
| **Faith** | Heavyweight tee | Cream or stone | "FAITH" minimal wordmark | Definition + scripture, archive-label layout | Hebrews 11:1 | Simplified GV | Lower-back tail square | High-density print |
| **Peace** | Structured hoodie | Black or washed black | "PEACE" wordmark, quiet/minimal | Definition + scripture | Philippians 4:7 | Simplified GV | Lower-back tail square | Embroidery or high-density print |

Lane split for this batch: **3 entries lean Premium/GV** (Adonai, El Shaddai, Faith, Peace — 4 actually), **2 lean Urban/Living Water** (Grace, Hope) — a realistic first-batch mix weighted toward the premium archive lane, consistent with the locked 30% premium-faithwear / 40% devotional-archive emphasis.

---

## C. Canva bulk-production template list

| Template | Purpose | Bulk-creatable? |
|---|---|---|
| Apparel Front Design | wordmark/name treatment per garment | Yes — one template, swap text/color per entry |
| Apparel Back — Definition/Scripture | archive-label layout (definition + verse) | Yes — one template, swap copy per entry |
| Scripture/Study Card | the collectible card system (theme, verse, meaning, devotional context) | Yes — one template, swap content per theme |
| Product Mockup | garment + design composited for preview (not a real photo) | Partially — template structure is bulk-creatable, but believable mockup quality needs manual review per garment/color |
| Shopify Product Image | clean, consistent listing-image framing | Yes, once mockups are approved |
| Instagram/Pinterest Launch Graphic | social promo tied to each theme | Yes — one template, swap theme/copy |
| Email Launch Graphic | matches the Phase One announcement | Yes — one template |

---

## D. Assets that can be bulk-created (low manual burden)

- Scripture/study card content and layout for all 6 themes (text-driven, template-based)
- Apparel back "definition/scripture" panels for all 6 entries (text-driven, template-based)
- Product copy drafts (titles, descriptions, tags, collection blurb) for all 6 entries
- Social promo template set (Instagram/Pinterest/email) once one approved template exists per format
- The master Google Sheet itself, fully populated with the matrix above as a starting draft

## E. Assets that require manual design review (cannot be fully automated)

- Final raised/puff-print lettering treatment (e.g. "EL SHADDAI") — needs a human eye to confirm it reads premium, not cheap
- Product mockup realism per garment/color combination — template structure can be bulk-built, but believability needs a manual pass per item
- Logo placement accuracy in mockups, especially the GV lower-back tail square (centered, correctly sized, correct contrast colorway for light vs. dark garments)
- Any garment-dyed/washed-fabric texture representation — generic mockup tools often render this poorly and may need a manual override or a real sample photo later
- Final approval of which print method each entry actually uses once sample feel is tested

## F. Later steps that can connect to Shopify/Printify (not now)

These remain explicitly out of scope for this phase and require your separate, explicit go-ahead:

1. Uploading approved print-ready files to Printify/Printful/another print partner
2. Selecting exact blanks, colors, print providers, size ranges, shipping regions, and pricing
3. Generating provider-side product mockups
4. Connecting/publishing approved products to a live Shopify store
5. Setting up the "Phase One: Six Entries" Shopify collection page, waitlist/notify flow, and required shipping/refund/privacy/terms pages
6. Any analytics, email (Klaviyo), Meta pixel, or later n8n marketing-automation connections

## G. Strict approval gate

No step below this line happens without your explicit, separate approval — this document authorizes planning and template-building only:

- No store accounts are created or connected (Shopify, Printify, Printful, Fourthwall, Gelato, or otherwise)
- No products are published, listed publicly, or made purchasable
- No samples or inventory are ordered and no money is spent
- No website code is changed
- No final, production-ready artwork is generated until you've reviewed and approved the relevant Canva drafts/mockups row by row in the sheet
- Sample ordering (Phase 2) requires your explicit sign-off on a specific, named first-batch list before anything is purchased

---

## Recommended first sample batch (no more than 4 garments)

Per the "don't launch before checking physical quality" principle:

1. **Adonai** — heavyweight black tee (tests high-density print + GV tail-square placement)
2. **El Shaddai** — stone hoodie (tests raised/puff lettering quality — the highest-risk print method in this batch)
3. **Faith** — cream heavyweight tee (tests a second GV premium colorway + contrast tail-square accuracy)
4. **Hope** — garment-dyed oversized tee (tests the Living Water/urban lane — front chest + back graphic lockup)

This covers both lanes (3 GV/premium, 1 Living Water/urban), both signature print methods (high-density and puff/raised), and both logo placement systems, while staying small enough to evaluate honestly before committing to a 6-entry public collection.

---

## Phased path (for reference, unchanged from your framing)

1. **Phase 1 — Design system** (this document's scope): Sheet + Canva templates + product copy + mockup direction + asset registry
2. **Phase 2 — Samples:** order the 4 garments above from Printify/Printful/a local printer; physically check print feel, wash durability, fabric weight, color accuracy, sizing, and whether the raised effect looks premium — before anything launches
3. **Phase 3 — Shopify:** collection page, "Phase One: Six Entries" framing, product listings, waitlist/notify flow, required policy pages — live publishing only after sample approval
4. **Phase 4 — Marketing:** email signup, launch graphics, short-form content templates, Shopify analytics, later Klaviyo/Meta/n8n workflows

---

## Next action

Once you review and adjust the matrix in Section B (themes, garments, colors, print methods) and the sheet columns in Section A, the next concrete step is to actually build the Google Sheet (or a CSV you can import into one) with these rows populated, plus draft the first Canva template (recommend starting with the Scripture/Study Card template, since it's the most bulk-creatable and lowest-risk asset). Say the word and I'll build the sheet/CSV first — still no store, account, or publishing action.
