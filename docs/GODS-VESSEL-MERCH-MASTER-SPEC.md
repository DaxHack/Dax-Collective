# God's Vessel — Names of God Merchandise: Recovery Inventory, Master Spec & QA Checklist

Prepared 2026-10-29. Status: **review document only**. Nothing was published, uploaded to
Printify, priced, purchased or deployed. No Canva design was edited.

---

## 1. Recovery inventory (authoritative sources)

| Asset | Authoritative location | Last edited | Evidence of authority | State |
|---|---|---|---|---|
| Back artwork master, all 5 names | Canva `DAHVMRWx09E` "Names of God — BACK ARTWORK MASTER (production, not a mockup)", pages 1–5 = YHWH, ELOHIM, ADONAI, EL SHADDAI, YHWH YIREH | 2026-09-15 | Title says production master; text matches Product Master "KJV verified" rows | Recovered (read) |
| YHWH name font comparison | Canva `DAHVMcNNfBA` (4 options, "geometry frozen") | 2026-09-15 | Product Master status "awaiting font decision" | **Open owner decision** |
| Approved layout D (GV front / name back) | Canva `DAHVJ_5ETgU` "YHWH Placement D" | 2026-09-14 | Product Master: "D - GV chest front / Name editorial back (APPROVED)" | Approved layout, preserve |
| Placement alternatives A/B/C + boards | Canva `DAHVJssQAeU`, `DAHVJkpz5PE`, `DAHVJuaTggk`, `DAHVJx7JXTg`, `DAHVJ1Bx1HQ` | 2026-09-14/15 | Superseded by D | Archive only |
| Per-name V1 boards | Canva `DAHVJusrbOQ` ELOHIM, `DAHVJoOiFkM` ADONAI, `DAHVJiCncWw` EL SHADDAI, `DAHVJolbsv8` YHWH YIREH | 2026-09-15 | Titles "GV front / editorial back" | Reference boards |
| GV chest mark study | Canva `DAHVJU7tZeA` (GV monogram / wordmark / Living Water crown, S/M/L) | 2026-09-14 | Chest-mark scale not recorded as chosen | **Open owner decision (scale)** |
| Exported production PNGs `1..4-<NAME>_back_{dark,light}-ink_transparent.png` + `QC-report.json` | Local `production/` folder on the owner's Windows PC (path from Product Master col R) | 2026-09-15 | Product Master "Artwork QC PASS" | **Not reachable** from cloud session |
| GV monogram dark/light transparent masters | Local (OPS-READINESS 2026-09-16: "verified clean") | 2026-09-16 | Ops doc | **Not reachable** |
| Product Master Sheet | Drive `14kZnyUF_bZAsoosp0SYVs0fRqaOYXZzkRHXgI0iUNFs` | 2026-09-15 | Source of truth for SKU/blank/price | Read |
| Rights / SKU log | Drive `1ZRED7Xnc_oFczI49R3NwVdfYhEnBtXmbuTTpJuoRRZ8` | 2026-09-14 | Font names unresolved | Read |
| Codex SVG shells | `artifacts/gods-vessel/names-of-god/designs/*.svg` (branch `codex/legal-oauth-pages-20260913`) | 2026-09-15 | Product Master: "typographic placeholder shell only" | **Superseded — do not print** |

Missing / unverifiable from this session: the exported PNGs and their hashes, `QC-report.json`,
GV monogram masters, Printify store/drafts, supplier size chart and live base costs.

---

## 2. Verification findings from the Canva master (element-level read)

Text (all five pages) — checked against KJV:

| Page | Name | Definition line | Verse on art | KJV check |
|---|---|---|---|---|
| 1 | YHWH | The covenant name of the LORD | "I AM THAT I AM. I AM hath sent me unto you." — EXODUS 3:14 | Words are KJV but the verse is **elided** (KJV: "I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you."). Omission shown as a full stop, not an ellipsis. **Owner decision.** |
| 2 | ELOHIM | God the mighty Creator | "In the beginning God created the heaven and the earth." — GENESIS 1:1 | Exact |
| 3 | ADONAI | The Lord and Master of all | "O LORD our Lord, how excellent is thy name in all the earth!" — PSALM 8:1 | Exact (first clause) |
| 4 | EL SHADDAI | God Almighty | "I am the Almighty God; walk before me, and be thou perfect." — GENESIS 17:1 | Exact (excerpt) |
| 5 | YHWH YIREH | The LORD who provides | "In the mount of the LORD it shall be seen." — GENESIS 22:14 | Exact (excerpt) |

Spelling: no errors found in any of the five pages.

Layout / print findings:

1. **Canvas is 1536 × 1024 px (3:2 landscape).** Text is vector, so a large export stays sharp, but the
   canvas carries ~300 px empty side margins. Print files must be trimmed to the ink bounds before upload,
   otherwise the provider scales the empty canvas and the artwork prints smaller than intended.
2. **Every page has a full-bleed background photo** (Canva media `MAHGYcJSezg`, 1536 × 1024, a white wall
   with a hanger hook; Canva tags "white, wall, empty, blank"). A "transparent background" export still
   contains it and would print as an off-white rectangle. Delete it on a review copy before export.
3. **Name size is fitted per name**, so cap height varies: YHWH 229 pt, ELOHIM 178, ADONAI 175,
   EL SHADDAI 119, YHWH YIREH 111 (and the name's top offset varies 34 → 175 px). The lower block
   (definition 562 / verse 665 / rule 921 / reference 951) is identical across pages 1–4; page 5 shifts
   rule/reference up because its verse is two lines. Whether names should share one cap height is a
   **typography decision** (flagged, not changed).
4. Fonts: name = Canva ref `YAFdJhX-538`, body = `YAFdJs07v-8`. Human-readable names and commercial
   licence still unresolved (same gap recorded in the rights log). **Open owner decision.**
6. **The GV monogram in Canva is not print-grade.** The study uses asset `MAGpd9s7mJI` ("3.png"):
   500 × 500 px on white (≈1.7 in at 300 DPI) and containing "MINISTRY", hidden by a white rectangle that
   would print as a white bar. Front files must come from the local "verified clean" monogram masters.
7. Opening a read-only element view in Canva updates the design's "last edited" timestamp. Content is
   unchanged (thumbnail hash and version identical), but the 2026-09-15 date is no longer shown in Canva.
5. Ink colour is #000000 only — the dark-ink set. Light-ink (for Faded Black) is a colour swap to the
   approved bone/cream value; that value is not recorded anywhere reachable.

Data contradictions to resolve (owner):

| Item | Sources disagree |
|---|---|
| Adonai definition | Art: "The Lord and Master of all"; June sheet (approved 2026-06-30): "Lord; a title of reverence and authority"; Codex: "Lord and master; the one worthy of surrender" |
| YHWH reference | Art: Exodus 3:14; Product Master: Exodus 3:14-15 |
| Adonai scripture | Art: Psalm 8:1; website: Genesis 15:2 |
| El Shaddai garment | Product Master launch row: 1301GD tee; website 001: hoodie |
| YHWH Yireh | Art page exists; Product Master launch row has no SKU/file/status |
| Translation | Product Master: KJV; June Phase One sheet: WEB |

---

## 3. Master specification (applies to every Names of God product)

**Layout D (approved):** front = GV monogram, wearer's left chest; back = name + definition + KJV verse + rule + reference, centred.

| Spec | Requirement |
|---|---|
| Source of truth | Canva `DAHVMRWx09E` page per name; edits only on a duplicated review copy |
| Brand marks | Only God's Vessel marks (or Dax the Traveler where relevant). Never the "Dax and Lex" / D&L logo (Canva `DAF9l76dZ3s`) |
| Print file | PNG, sRGB, real alpha channel, background removed, trimmed to ink bounds |
| Resolution | ≥ 300 DPI at the provider's printed size for that placement (take dimensions from the provider's product page, not memory) |
| Ink sets | dark ink (#000000) for Faded Cream; light ink (approved value) for Faded Black |
| Minimum detail | No stroke/rule thinner than ~1 pt at print size (the 5 px rule at 1536 canvas must survive scaling) |
| Typography | Name font and body font resolved to human-readable names with commercial licence recorded in the rights log |
| Scripture | KJV only (public domain). Exact wording; any omission marked with an ellipsis |
| Definition | One approved short line per name, identical in art, listing and website |
| Naming | `<n>-<NAME>_<front|back>_<dark|light>-ink_transparent_v<rev>.png`, SHA-256 recorded |
| Blank | American Apparel 1301GD, Faded Black + Faded Cream, unless owner approves otherwise |
| Mockups | Provider-generated from the final files only; no AI-generated garment images |
| Pricing | Contribution = price + shipping charged − (front + back production) − provider shipping − fees − refund reserve, per variant |

---

## 4. QA checklist (gate order — a product may not advance with an open box)

**Gate 1 — Recovery**
- [ ] Authoritative master identified (Canva page or exported file) with date
- [ ] Older drafts marked superseded; SHA-256 of each print file recorded

**Gate 2 — Design QA**
- [ ] Spelling of name, definition, verse, reference
- [ ] Verse matches KJV word-for-word; omissions shown with "…"
- [ ] Definition identical to the approved line in the Product Master
- [ ] Same type system and spacing rules as the YHWH master

**Gate 3 — Print QA**
- [ ] PNG with alpha; corners and background fully transparent (alpha min = 0)
- [ ] Trimmed to ink; ≥ 300 DPI at provider print size
- [ ] Dark and light ink versions both present
- [ ] Font licence recorded

**Gate 4 — Sizing**
- [ ] Size chart copied from the provider's live product page (URL + date recorded)
- [ ] Offered sizes and fit wording match that chart ("relaxed", not "oversized", for 1301GD)

**Gate 5 — Mockups**
- [ ] Provider mockups for each colour, front and back
- [ ] Placement and scale match layout D

**Gate 6 — Commerce**
- [ ] Existing Printify drafts checked first (no duplicates)
- [ ] Live base cost for front + back, shipping and fees recorded per variant
- [ ] Positive contribution on every offered variant

**Gate 7 — Owner approval**
- [ ] Owner approves the exact file versions, listing copy, price and store
- [ ] Any later edit voids the approval for that product
