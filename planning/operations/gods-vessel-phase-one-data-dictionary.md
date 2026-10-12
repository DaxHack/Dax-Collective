# God's Vessel — Phase One Master Sheet Data Dictionary

**Date:** 2026-06-30
**Companion file:** `planning/operations/gods-vessel-phase-one-master-sheet.csv`
**Status:** Reference document only. Explains every column in the CSV so the sheet stays readable as more rows/columns get added later.

This sheet is the single source of truth for Phase One: Six Entries. Every column below is currently populated with draft-level information only — nothing here represents a confirmed fact, finalized spec, live product, or approved claim.

---

## Production columns (1–20)

| # | Column | Explanation |
|---|---|---|
| 1 | Collection Name | The release batch this row belongs to — currently "Phase One: Six Entries" for all rows. |
| 2 | Theme/Name | The name or attribute the product is built around (Adonai, El Shaddai, Grace, Hope, Faith, Peace). |
| 3 | Garment Type | The base garment (tee, hoodie, etc.) — direction only, not a finalized blank. |
| 4 | Garment Color | The intended colorway (washed black, stone, cream, etc.). |
| 5 | Garment Blank Direction | Fabric/weight notes (heavyweight, garment-dyed, structured fit) — direction only, never a confirmed spec/SKU. |
| 6 | Front Concept | What the front of the garment carries — for GV Premium pieces, this is always the primary concept (name/raised wording); for Living Water pieces, the expressive front statement. |
| 7 | Back Concept | What the back carries — definition/scripture for GV pieces *only where the design calls for it*; back graphic lockups for Living Water pieces. |
| 8 | Design Layout Type | A short label describing the front/back relationship (e.g. "Front Name / Back Definition," "Urban Front Theme / Back Graphic"). Used to keep layout logic consistent across rows. |
| 9 | Scripture Reference | The verse (book, chapter, verse only — e.g. "Psalm 8:1") tied to this theme. Does not imply a specific translation has been chosen. |
| 10 | Definition/Meaning | A draft theological gloss of the name/theme. Always marked "DRAFT — needs confirmation" until you approve the wording and source. |
| 11 | Logo Used | Either "Simplified GV" (Premium/Archive lane) or "Living Water" (Urban lane). |
| 12 | Logo Placement | Where the logo sits on the garment, per the locked placement rules — GV pieces always use the lower-back tail square only, never a default left chest. |
| 13 | Print Method | The intended production technique (high-density print, puff print, embroidery, tonal print) — a direction, not a confirmed provider capability. |
| 14 | Product Copy | A short draft line combining garment, concept, and logo placement — useful as a one-line internal summary, not finished store copy. |
| 15 | Canva Template Status | Not started / In progress / Ready for review / Approved — tracks template-building progress for this specific row. |
| 16 | Mockup Status | Not started / Drafted / Approved — tracks visual mockup progress. |
| 17 | Sample Status | Not ordered / Ordered / Received / Approved / Rejected — tracks the physical sample pipeline (Phase 2, not authorized yet). |
| 18 | Fulfillment Compatibility | Whether the print method looks standard-POD-compatible or likely needs a specialty printer/test — a planning flag, not a confirmed provider capability. |
| 19 | Shopify Readiness | Not ready / Copy ready / Images ready / Fully ready to list — tracks how close a row is to being listing-ready (no listing is created from this alone). |
| 20 | Approval Status | Draft / Pending Your Review / Approved / On Hold — the master gate. Every row currently reads "Draft / Pending Your Review." |

## Copy and AI-QA columns (21–36)

| # | Column | Explanation |
|---|---|---|
| 21 | Brand Lane | "GV Premium/Archive" or "Living Water/Urban" — which of the two locked lanes this product belongs to. |
| 22 | Product Title Draft | A short working product name (e.g. "Adonai Tee"). Draft only — not a confirmed final listing title. |
| 23 | Short Description Draft | A one-sentence draft description, safe for internal review — avoids any unconfirmed claims. |
| 24 | Long Description Draft | A short paragraph draft, written in the brand's voice, that explicitly notes when fabric/fit/print details are still "to be confirmed." Not store-ready copy. |
| 25 | Study Card Copy Draft | Draft text for the matching scripture/study card — always flagged when it touches scripture wording, since exact translation has not been chosen. |
| 26 | Website Collection Copy Status | Tracks whether the "Phase One: Six Entries" collection-page copy referencing this item has been started — currently "Not started" for all rows. |
| 27 | Scripture Translation / Source | Notes which Bible translation (ESV, NIV, KJV, etc.) the row's scripture text is drawn from. Currently "Not yet specified" for every row — this is a decision for you, not assumed by AI. |
| 28 | Scripture Accuracy Review Status | Whether the scripture reference/wording on this row has been checked against a chosen translation. Currently "Needs source/translation confirmation" for all rows. |
| 29 | Biblical Accuracy Review Status | Whether the broader theological framing (definition, devotional context) has been reviewed for accuracy and tone. Currently "Needs confirmation" for all rows. |
| 30 | Product Copy QA Status | Whether the marketing/product copy itself (title, descriptions) has passed a copy-quality and honesty check. Currently "Draft - not yet reviewed." |
| 31 | Product Facts Confirmed | A yes/no-style field stating whether real fabric, fit, blank SKU, pricing, and availability facts exist yet. Currently "No" for every row — nothing has been confirmed. |
| 32 | Claims Safe To Use | The specific facts that are safe to state publicly right now (theme name, general garment type, general scripture reference, brand name) — intentionally narrow. |
| 33 | Claims Not Yet Confirmed | Everything that must NOT be stated as fact yet: fabric weight/GSM, exact fit, blank SKU, pricing, shipping/availability dates, sustainability claims, exact scripture quotation wording, limited-drop framing, and (where relevant) print-technique durability claims. |
| 34 | Copy Update Trigger | What event should cause this row's copy to be revisited (e.g. translation chosen, sample received, garment spec finalized, print method changes). |
| 35 | Last Reviewed Date | The last date a human actually reviewed this row. Currently "Not yet reviewed (draft created 2026-06-30)" for every row — AI-authored drafts do not count as reviewed. |
| 36 | Human Approval Required | Always "Yes" at this stage — restates that no row in this sheet authorizes artwork, listing, or publishing on its own. |

---

## How to read "DRAFT — needs confirmation" language

Any cell containing "DRAFT," "Needs confirmation," or "Needs source/translation confirmation" means: this is AI-generated placeholder content meant to show the *shape* of the final copy, not the final wording. Specifically:

- Scripture references (column 9) name a verse but not a translation — translation choice is yours.
- Definitions (column 10) and study card copy (column 25) are AI-written theological glosses, not pulled from an approved reference — review these like you would review any draft devotional writing.
- Faith's and Peace's back/front copy directly paraphrase their tied verse (Hebrews 11:1, Philippians 4:7) — these need the closest scripture-accuracy review of the six, since paraphrased scripture reads differently depending on translation.

Nothing in columns 31–33 should be treated as a real product fact until you've changed "No"/"Needs confirmation" to an approved status yourself.
