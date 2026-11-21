# DAX COLLECTIVE — CLAUDE MASTER CONTEXT EXPORT — 2026-11-21

**Author:** Claude (Claude Code cloud session, repo `DaxHack/Dax-Collective`, branch `claude/dax-collective-context-recovery-oustv8`)
**Prepared for:** Daniel (owner), ARIA (system of record), ChatGPT (independent reviewer)
**Verification date for every LIVE_VERIFIED item:** 2026-11-21 (this session), unless another date is given.
**This is File A of 3.** File B = `CROSS_AGENT_RECONCILIATION_TEMPLATE_2026-11-21.md`. File C = `EXECUTION_AND_DELEGATION_PLAN_2026-11-21.md`.

### Status labels used (exactly as assigned)

| Label | Meaning in this document |
|---|---|
| `OWNER_CONFIRMED` | A dated owner decision recorded in Slack, the Product Master Sheet, or ARIA |
| `LIVE_VERIFIED` | Read from the live system in this session (2026-11-21) |
| `DOCUMENTED` | Stated in a repo doc, Drive doc/sheet, or ARIA record; not re-checked live |
| `PRIOR_AGENT_REPORT` | Reported by an earlier Claude/ChatGPT/Superagent session; not re-checked |
| `PROPOSED` | Claude's own recommendation — **not** an owner decision |
| `BLOCKED` | Cannot proceed or be verified without an owner action |
| `UNKNOWN` | No evidence either way |
| `SUPERSEDED` | Replaced by a later, recorded version |

---

## 0. Access actually available to this session (read this first)

Claude does **not** have unrestricted access to past Claude conversations or hidden memory. Everything below came from the systems in this table.

| Source | Access this session | Result |
|---|---|---|
| GitHub `DaxHack/Dax-Collective` (local clone + GitHub MCP) | Read | `LIVE_VERIFIED` — 389 tracked files, `main` @ `150f076e`, 1 open draft PR (#11) |
| Base44 — **ARIA Command Center** app `6abd58709033092bc7a84d02` | Read (entities) | `LIVE_VERIFIED` — 20 entity schemas; Brand, Product, ChannelListing, SystemItem, Project, NeedItem, Worker, ContentItem, ProductApprovalEvent read |
| Base44 app `6ae98277469a63a6e55d0e69` (hosts the GV spec files + GV-001 media) | **Not in this account's app list** | `BLOCKED` — app is not owned by the connected Base44 user |
| GV spec URLs (Rev 7, Rev 8, Claude handoff 2026-11-20) | `base44.app` host refused by this sandbox's network proxy (403) and by WebFetch (DNS) | `BLOCKED` — **Rev 8 and the 2026-11-20 Claude handoff were NOT read.** Rev 3/5/7 content recovered from Slack posts (see §6). |
| Shopify (God's Vessel store) | Read via Shopify MCP | `LIVE_VERIFIED` — shop, products, policies, markets, delivery profiles, orders. Payments state **not readable** (missing `read_shopify_payments` scope). |
| Printify | No connector, no API token | `BLOCKED` |
| Google Drive / Sheets / Docs | Read | `LIVE_VERIFIED` — Product Master Sheet (tabs `YHWH_Launch_Tracker`, `Design_Versions`), file inventory |
| Slack (workspace `dax-collective`) | Read | `LIVE_VERIFIED` — `#content-production`, `#agent-handoffs`, `#systems-blockers`, `#owner-approvals` |
| Canva | Connector present, not read this session | `DOCUMENTED` only (IDs from Sheet) |
| Figma | Connector present; no file key known | `UNKNOWN` — no Figma file for the site or GV located |
| n8n (local Docker on Daniel's PC) | Not reachable from cloud | `BLOCKED` — only repo templates inspected |
| TikTok / Meta / YouTube | Not used this session | `DOCUMENTED` via ARIA SystemItem (2026-11-11) |
| ChatGPT handoff file | Not yet provided | `UNKNOWN` — Phase 8 pending (use File B) |

---

## 1. Executive summary

1. **The fastest real revenue is God's Vessel on the existing Shopify store**, not new infrastructure. Six products exist as DRAFT; zero are on a sales channel; zero real paid orders exist (`LIVE_VERIFIED`: only order is #1001, a $0 owner delivery test, 2026-11-12).
2. **Three hard blockers stand between today and a first paid sale** — all owner actions:
   - **Shopify Payments state unverified** (`BLOCKED`; connector lacks scope; last evidence 2026-11-16 = "Set up Shopify Payments" warning).
   - **Shipping policy is wrong**: the saved Shipping Policy (updated 2026-11-21 02:01 UTC) contains the *refund/returns* text and **no shipping information** (no processing time, rates, carriers, or destinations). `LIVE_VERIFIED`. The Refund Policy (updated 02:52 UTC) is correct and complete.
   - **Printify billing + manual order approval unverified** (`BLOCKED`, no Printify access).
3. **Design governance is ahead of production files.** Rev 7 (2026-11-20) says launch only the YHWH Washed Tee ($42) and conditionally H1/H2 hoodies ($79); hold C2 crew; ELOHIM/ADONAI/EL SHADDAI/YHWH YIREH stay *Master Vision only* until real production files exist. **But ADONAI and ELOHIM Shopify drafts already exist with Printify artwork** — they must stay unpublished under Rev 7.
4. **ARIA is partially stale.** Its approval ledger (`ProductApprovalEvent`) is **empty**, its Shopify SystemItem says "no connector", and the YHWH Product record still says "owner must pick final design" though the owner picked on 2026-11-12. ARIA needs a reconciliation pass before it can be the reliable system of record.
5. **Cost trap:** store is on the **Shopify Advanced** plan (`LIVE_VERIFIED`); ARIA records it as "$1/mo until 2027-02-06 then $399/mo" (`DOCUMENTED`). At ~$18 contribution per tee, $399/mo needs ~22 tee sales/month just to cover the plan. Owner decision needed before 2027-02-06 (see §14).
6. **Website** (React + Firebase, repo `dax-main`) is production-hardened in code (PRs #7–#10 merged) but `daxcollective.com` does not resolve to Firebase and times out (`DOCUMENTED`, ARIA 2026-11-12); backend is not deployed. It is not on the revenue critical path for the first sale.
7. **Content pipeline has one finished asset:** GV-001 "Strength in the Quiet" v2 (46.2 s, 1080×1920) — owner-approved 2026-11-19 (`OWNER_CONFIRMED`) — but **no God's Vessel social account is connected**, so it cannot be published by any agent.

**Shortest reliable path to revenue:** fix Shipping Policy → confirm Payments → confirm Printify billing → owner final-approves YHWH Washed Tee listing → activate on Online Store → post GV-001 with a link. Detail in File C.

---

## 2. Owner vision and working preferences

| Item | Status | Source |
|---|---|---|
| Owner: Daniel ("Dax"). Umbrella: The Dax Collective | `DOCUMENTED` | ARIA Brand records |
| Priorities: speed, monetization, automation, brand growth, SEO, social growth, workflow reliability | `OWNER_CONFIRMED` | User preferences |
| Rule: REUSE → REPAIR → EXTEND → REPLACE; live state overrides docs; never treat existence as proof of function | `OWNER_CONFIRMED` | Dax Collective Operating Rules skill |
| Quality order: ORIGINALITY > QUALITY > VIEWER VALUE > RETENTION > CONSISTENCY > VOLUME | `OWNER_CONFIRMED` | Operating Rules |
| Dax the Traveler = personal face brand → light-touch automation only; other brands may automate more | `OWNER_CONFIRMED` | Operating Rules |
| Hard gates: no spend, orders, publishing (first time), deletion, credential changes, deploys, or artwork modification without explicit owner approval | `OWNER_CONFIRMED` | Operating Rules + this assignment |
| Git push/pull/merge/rebase/reset are RED-light (explicit approval) | `OWNER_CONFIRMED` | User preferences |
| Design rule (2026-11-20): "Build the 100% perfected version first and keep it canonical. Then make cutbacks from it according to what is actually available." | `OWNER_CONFIRMED` | Slack `#content-production`, Rev 5 post |
| Max three active initiatives; don't duplicate ARIA/apps | `OWNER_CONFIRMED` | Slack `#agent-handoffs` 2026-11-19 |
| Report format end of task: files changed, build result, working tree, skipped items, exact next step | `OWNER_CONFIRMED` | User preferences |

---

## 3. Brand bible

> Owner-confirmed facts and Claude proposals are separated in every brand. Missions are from ARIA `Brand` records (created 2026-09-30, `DOCUMENTED`).

### 3.1 The Dax Collective (umbrella)
- **Mission (DOCUMENTED):** "Daniel's parent company — AI, automation, content, commerce, and digital products building toward financial sustainability."
- **Assets (LIVE_VERIFIED):** repo `DaxHack/Dax-Collective`; ARIA app; Slack workspace; Google Drive; geometric lion mark is the official TDC logo (`DOCUMENTED`, commit `6bcceb6c`).
- **Revenue lines in ARIA:** Lead Follow-up Desk (small-business automation service, status BUILDING, demo local only) — `DOCUMENTED`.
- **Also found in repo, not in owner's brand list:** "Dax the Investor" page and assets (`dax-main/src/pages/DaxTheInvestorPage.jsx`) — `UNKNOWN` whether still active.
- **PROPOSED:** keep the Collective as the operating/holding identity only; do not build consumer marketing for it until one sub-brand earns.

### 3.2 God's Vessel (premium Christian-inspired apparel + digital)
- **Mission (DOCUMENTED):** "Faith-based content, apparel, and digital products — commerce built on message."
- **Identity (OWNER_CONFIRMED via specs):** restrained, typographic, luxury; Names of God as the core collection; one-colour Old Gold #A67843 front lockups; a small signature mark (C1) on the lower back; washed/garment-dyed heavyweight blanks; 2–3 intentional colours per product, never the provider's full range (Rev 7).
- **Product families:** YHWH, ELOHIM, ADONAI, EL SHADDAI, YHWH YIREH (all have STANDARD boards in Canva, `DOCUMENTED`). See §6–7.
- **Digital:** "Names of God — Four-Day Scripture Study" printable PDF, $5 (Shopify draft, file attached, delivery tested) — `LIVE_VERIFIED` draft / `DOCUMENTED` test.
- **Content:** GV-001 short (approved v2); Drive content banks: 100 quotes, 100 faith content, 100 Bible stories, 100 discussions (2025-07) — `LIVE_VERIFIED` files exist.
- **Store:** Shopify "God's Vessel" (e23peu-fk.myshopify.com), US market only — `LIVE_VERIFIED`.
- **Target customer (PROPOSED, needs ChatGPT market validation):** 22–45 Christians who buy considered, quieter faith apparel over slogan tees; gift buyers; church small-group leaders (for the study PDF).
- **Pricing (OWNER_CONFIRMED 2026-11-12):** YHWH Washed Tee S–XL $42, 2XL $46, 3XL $49, no compare-at.

### 3.3 Dax the Traveler
- **Mission (DOCUMENTED):** "Travel storytelling, guides, and destination content across Shorts, Reels, and longform — built for affiliate potential."
- **Assets:** YouTube channel UCuN9RFxD1_PUOci_AEa5DMQ is the only verified authorised channel (`DOCUMENTED`, ARIA 2026-11-11); approved media in repo (Cuba, Puerto Rico, Atlanta 2024; Paris 2023, Tokyo 2024) — `LIVE_VERIFIED` files; 100-item content sheet in Drive.
- **Monetization paths (DOCUMENTED):** affiliate, ad revenue, sponsorships, digital travel guides.
- **Rule:** personal face brand → automation is support only (`OWNER_CONFIRMED`).
- **Open task:** DAX-HO-001 travel editing pilot (1 long + 2 shorts from existing footage), UNASSIGNED (`DOCUMENTED`, Slack 2026-11-19). Needs local footage → Daniel's PC.

### 3.4 Time-Zone Travelers
- **Mission (DOCUMENTED):** "Travel discovery and community for people who move across time zones."
- **Monetization (DOCUMENTED):** community, digital products, affiliate.
- **State:** brand page in site, logos and banners exist; no channels verified (`UNKNOWN`); no products; content status UNKNOWN.
- **PROPOSED:** first digital product = a downloadable time-zone/meeting planner or jet-lag guide sold on the *existing* Shopify Digital Downloads route already proven by the $5 study — but only after God's Vessel's first sale. Requires owner decision on whether a second brand may sell from the God's Vessel store (likely **no** → needs its own channel; defer).

### 3.5 Ani-Dax
- **Mission (DOCUMENTED):** "Anime commentary and analysis… minimal-spoiler breakdowns."
- **Assets:** Re:Zero-themed logo concepts (Rem/Emilia/Beatrice/Subaru), research PDF "25 Ani-Dax Re:Zero essay theses" (Drive), 100-series breakdown CSV — `LIVE_VERIFIED` files.
- **Monetization (DOCUMENTED):** ad revenue, sponsorships, channel memberships.
- **Open task:** DAX-HO-002 Re:Zero pilot script/research package, UNASSIGNED (`DOCUMENTED`).
- **Risk (PROPOSED):** logo concepts use copyrighted character likenesses — fine for fan commentary thumbnails under fair-use norms, not for a trademark or merch. Keep brand mark original.

### 3.6 MapMasters / Odyssey Adventure
- **Evidence:** named in Slack `#content-production` channel charter only (`DOCUMENTED`). **No repo code, no ARIA Brand record, no Drive files found.** → `UNKNOWN`.
- **Owner's stated scope (from this assignment):** interactive geography, travel discovery, games, education.
- **PROPOSED:** park until God's Vessel earns. When resumed, the existing `dax-main/src/pages/experiments/DaxJourneyMap.jsx` and Universe V3 work are the reuse candidates — do not start a new app.

### 3.7 ARIA (internal, not a consumer brand)
- Base44 app **"ARIA Command Center"** `6abd58709033092bc7a84d02` — `LIVE_VERIFIED`.
- Entities: ContentItem, Opportunity, LogEntry, SystemItem, Task, Project, InboxItem, ProductApprovalEvent (server-written ledger), ProductEvidence, Brand, Product, OwnerAuthority, Worker, NeedItem, WorkerRun, Lead, RevenueMetric, ChannelListing, OrderEvent, User.
- Design is strong (evidence fields, idempotent OrderEvent, separated executor/data-source/external connection states). **Data is the problem** — see §19.

---

## 4. Existing project inventory

| Project | Brand | State | Label | Source |
|---|---|---|---|---|
| YHWH Washed Tee | GV | Shopify DRAFT, 12 variants, $42–$49, Printify-fulfilled; design chosen by owner 2026-11-12; no channel | `LIVE_VERIFIED` (Shopify) / `OWNER_CONFIRMED` (choice) | Shopify; Sheet row LAUNCH-013 |
| Names of God 4-day study PDF | GV | Shopify DRAFT $5; file attached; $0 test delivered | `LIVE_VERIFIED` draft / `PRIOR_AGENT_REPORT` delivery | Shopify; Sheet NOG-STUDY-001 |
| ADONAI tee | GV | Shopify DRAFT $42, Printify art | `LIVE_VERIFIED` | Shopify |
| ELOHIM tee | GV | Shopify DRAFT $42, Printify art | `LIVE_VERIFIED` | Shopify |
| YHWH Type 3 B2 review draft | GV | Shopify DRAFT, title says "do not publish" | `LIVE_VERIFIED` | Shopify |
| Generic garment-dyed tee | GV | Shopify DRAFT, untitled template — archive candidate | `LIVE_VERIFIED` | Shopify; ChannelListing |
| H1/H2 YHWH Dictionary Hoodies, C2 Chest Crew | GV | Spec only (Rev 3→7), nothing created | `DOCUMENTED` | Slack |
| Premium Raised YHWH tee (CC1717 puff, $59) | GV | Blank + method chosen by owner; no art, not created | `OWNER_CONFIRMED` (2026-11-10) | Sheet Design_Versions |
| GV-001 "Strength in the Quiet" | GV | Creative locked v2; publish blocked (no account) | `OWNER_CONFIRMED` | ARIA ContentItem; Slack |
| PR #11 GV-001 production | GV | Open draft since 2026-11-04 | `LIVE_VERIFIED` | GitHub |
| Website `dax-main` + `dax-backend` | All | Code hardened; domain not on Firebase; backend not deployed | `LIVE_VERIFIED` (code) / `DOCUMENTED` (domain) | Repo; ARIA |
| Dax Universe V3 | All | Blueprint approved 2026-10-11; experiments routes isolated | `DOCUMENTED` | `docs/DAX-UNIVERSE-V3-*.md` |
| Lead Follow-up Desk | TDC | BUILDING; local demo only | `DOCUMENTED` | ARIA |
| n8n workflows | All | 30 templates in repo; live instance local, 1 scheduled workflow (DAX-04) unobserved | `LIVE_VERIFIED` (templates) / `DOCUMENTED` (instance) | Repo; ARIA |
| Claude Production Desk artifact | All | Private Claude artifact; tracking view only | `PRIOR_AGENT_REPORT` | Slack 2026-11-19 |
| AI agents plan doc | GV | Claude artifact; first agent = GV launch content agent | `PRIOR_AGENT_REPORT` | Slack 2026-11-19 |

---

## 5. Creative-direction and design rules

1. **Master Vision is canonical** (Tier 0). Production alternates record only their deviations. (`OWNER_CONFIRMED` 2026-11-20)
2. **C1 never goes on the front.** The 9 in "C1 · GV Emblem Crew" chest emblem is **not C1** and is REJECTED. (`DOCUMENTED` Rev 5; naming conflict still open)
3. **C1-W (sleeve) is an alternate, never a replacement for Tier 0.** (this assignment; Rev 8 not read — see §6)
4. **One-colour Old Gold #A67843** front lockups on Tier 0; cream tonal was intended in places but provider thread sets lack cream/tan/metallic (deviation #2). (`DOCUMENTED` Rev 5)
5. **Colours per product: 2–3 intentional; ≤ ~54 variants at launch.** (`DOCUMENTED` Rev 7)
6. **Simulated renders are labelled "visual concept"** and are never presented as mockups or print files. (`DOCUMENTED` Sheet)
7. **Never delete design history** — superseded art goes to Canva `99 Archive / Superseded` (folder FAHag0Ukafk) with a "SUPERSEDED — historical source" title. (`OWNER_CONFIRMED` 2026-11-10)
8. **Emblem master is raster only** (500×500, includes a "MINISTRY" line) — a vector master is required before any embroidery/production. (`DOCUMENTED`)
9. **Scripture text:** STANDARD YHWH boards use a shortened WEB Exodus 3:14; Washed Tee back uses KJV. Owner must pick wording per product. (`DOCUMENTED`)
10. **Pronunciation /ˈjah.we/ is a scholarly reconstruction**, not certain — keep copy honest. (`DOCUMENTED`)
11. **Font licences unresolved** for all GV typography. (`DOCUMENTED`, NeedItem "Choose the final font")

---

## 6. God's Vessel merchandise Master Vision

### 6.1 Specification hierarchy (as recovered)

| Rev | Date | Scope | Status | How recovered |
|---|---|---|---|---|
| Rev 3 (front/back + C1 placement) | 2026-11-20 18:46–18:51 EST | C1 size/offset; front lockup; design matrix | `SUPERSEDED` by Rev 5 | Slack posts (full summaries) |
| Rev 4 (datum correction) | 2026-11-20 | Folded into Rev 5 | `SUPERSEDED` | Slack |
| Rev 5 (Master Vision rule + tiers) | 2026-11-20 19:09 EST | Tier 0 + Tiers A/B/C + deviation log | `SUPERSEDED` (commercial parts) by Rev 7; Tier 0 unchanged | Slack |
| Rev 6 | — | — | `SUPERSEDED` (per Rev 7 header) | Content **not found** |
| **Rev 7** (commercial launch strategy) | 2026-11-20 19:32 EST | Launch strategy, product disposition, economics; correction on back embroidery | **Current commercial strategy** — `DOCUMENTED` | Slack summary; **full file not read** |
| **Rev 8** (placement addendum) | ≤ 2026-11-21 | Placement adaptation (C1-W per owner's brief) | `BLOCKED` — **file not read** | Not in Slack, Drive, or ARIA |
| Claude handoff 2026-11-20 | 2026-11-20 | Implementation handoff | `BLOCKED` — **file not read** | Not in Slack, Drive, or ARIA |

**Action:** ARIA or Daniel must paste Rev 7, Rev 8 and the 2026-11-20 handoff into the repo (`docs/gods-vessel/specs/`) or a Drive doc so every agent can read them. Until then every Rev 8 fact below is `UNKNOWN` against source and is carried from the owner's brief only.

### 6.2 Tier 0 — Master Vision (no vendor filters)

| Element | Specification | Status | Source |
|---|---|---|---|
| Front — YHWH dictionary lockup | `YHWH` / `/ˈjah.we/` / `[name] the LORD`, **254 × 109 mm** (10 × 4.3 in), large centre chest, Old Gold #A67843, 1 colour, embroidery primary | `DOCUMENTED` (Rev 3, Rev 5) — matches owner brief | Slack |
| Front constraint | Pronunciation line only clears 0.3 in text minimum at 254 mm; shrinking changes the lockup, not just size | `DOCUMENTED` | Rev 3 |
| Back — C1 | **50.8 × 50.8 mm** (2 × 2 in), square 1:1, ±1.5 mm, **centred on the spine, lower back only** | `DOCUMENTED` — matches owner brief | Rev 3/5 |
| C1 offset — tees | 30 mm preferred (30–40 mm range) from artwork's lowest edge to the **finished hem edge** | `DOCUMENTED` — matches brief ("referenced to the finished hem") | Rev 5 |
| C1 offset — hoodies/crews | 30 mm from artwork's lowest edge to **top edge of the rib band** → 75–90 mm above hem edge (50–60 mm rib) | `DOCUMENTED` — matches brief | Rev 5 |
| C1 clearance | Must clear hem stitching, seams, ribbing | `DOCUMENTED` | Rev 3 |
| C2 front | Name alone, 101.6 mm (4 in) wide; **type scale/lettering under review** | `DOCUMENTED`; typography `BLOCKED` on owner | Rev 3/7 |

### 6.3 Production alternates (deviations from Tier 0 only)

| Tier | Route | Deviation from Tier 0 | Status |
|---|---|---|---|
| A | Fleece embroidery via Printify/Printful | Rev 5 assumed none. **Rev 7 corrected:** Gildan 18500/18000 list embroidery at centre/left chest and **wrists only**; Printful 18500 chest + wrist. → lower-back C1 on fleece is **not** assumed manufacturable in standard POD | `DOCUMENTED` (Rev 7 supersedes Rev 5 on this point) |
| B | Tees on Printify DTG | C1 raised to the lowest point the fixed back print zone allows; value **to be measured** on the real blank in Product Creator | `BLOCKED` — measurement pending |
| C | Screen print / local decorator | Delivers Tier 0 exactly; the route the Master Vision exists for, once revenue allows | `PROPOSED` route (owner-endorsed concept) |
| **C1-W** | Embroidered mark **38 × 38 mm, outer left lower sleeve, immediately above the ribbed cuff, on smooth sleeve fabric** | Moves C1 from lower back to sleeve; reduces size 50.8 → 38 mm | From owner brief (Rev 8) — **source not read**. **Consistent with** Rev 7's finding that POD fleece embroidery zones include the wrist. **Claude inference, not verified.** |

**Deviation log (from Rev 5):**
1. Tee C1 raised above 30 mm — Tier B — DTG zone doesn't reach hem — reversible at Tier C — pending measurement.
2. Old Gold instead of cream tonal — Tiers A/B — provider thread set has no cream/tan/metallic — reversible with better vendor.
3. *(Proposed addition)* Fleece C1 → C1-W sleeve 38 mm — Tier A — POD fleece back embroidery not available — reversible at Tier C. **Status: awaiting Rev 8 text + owner confirmation.**

### 6.4 Design families — recovered state

| Family | Canva STANDARD board | Shopify | Rev 7 disposition | Approval |
|---|---|---|---|---|
| YHWH | Cream DAHagoZBSF8, Black DAHagg3XgmI (ACTIVE WORKING, *not* production-approved) | Washed Tee DRAFT (Construction D) + Type 3 B2 DRAFT | Washed Tee = conditional launch | Washed Tee design chosen `OWNER_CONFIRMED` 2026-11-12; **not in ARIA ledger** |
| YHWH Type 3 v3 (3-line dictionary) | DAHafZbmVCw + mockups | none | becomes H1/H2 front lockup basis (Claude inference) | `AWAITING OWNER APPROVAL`; not a print file (white bg, 1536×1024) |
| YHWH Variation C v2 (rib text) | DAHagSipUcU | none | — | `AWAITING OWNER APPROVAL` |
| ELOHIM | DAHagqgg9MY | DRAFT, Printify art | **Master Vision only — no purchasable listing** | UNDER OWNER REVIEW |
| ADONAI | DAHagtnTbDs | DRAFT, Printify art | **Master Vision only** | UNDER OWNER REVIEW |
| EL SHADDAI | DAHagpECjTc | none | Master Vision only | UNDER OWNER REVIEW |
| YHWH YIREH | DAHagsOkh8g | none | Master Vision only | UNDER OWNER REVIEW |
| GV emblem | Raster MAGpd9s7mJI / MAHagHKtofc | — | Needs vector master | OFFICIAL SOURCE (raster) |

No artwork was invented, edited, or approved in this session.

---

## 7. Product specifications and production alternatives (master vs alternate)

| Product | Tier 0 (Master) | Current production alternate | Exact deviations | Mfg constraint | Supplier fit | Unit cost | Retail | Approval |
|---|---|---|---|---|---|---|---|---|
| **YHWH Washed Tee** | Rev 3/5: front = approved artwork; back = C1 lower back (**conflict** with approved editorial back) | Construction D: GV chest front / YHWH editorial back (KJV), American Apparel 1301GD washed heavyweight, Faded Cream + Faded Black, S–3XL, DTG | No C1 at all; editorial back occupies the back — **owner must decide C1 vs editorial back** | DTG back zone may not reach 30 mm from hem | Printify (live) | $22.74 S–XL / $25.91 2XL / $27.72 3XL (`DOCUMENTED` Shopify unit cost synced 2026-11-12) | $42/$46/$49 `LIVE_VERIFIED` | Design choice `OWNER_CONFIRMED`; final publish approval **pending** |
| **H1 YHWH Dictionary Hoodie, Black** | Front lockup 254×109 Old Gold; C1 lower back 30 mm above rib top | Gildan 18500; embroidery front; C1 → **Tier A impossible at back** → C1-W sleeve (Rev 8) or Tier C | Back C1 replaced by sleeve C1-W 38 mm (if Rev 8 confirmed) | 254 mm front exceeds typical POD embroidery max (~4×4 in apparel area cited in Rev 5) → **front likely must be printed, not embroidered** (consistent with owner brief) | Printify/Printful for print; embroidery only for C1-W | `UNKNOWN` (Rev 3 planning: 56% margin S–XL) | $79 `DOCUMENTED` | Awaiting approval |
| **H2 Hoodie, Sand** | Same as H1; Old Gold or White | Same as H1 | Same | Same | Same | `UNKNOWN` | $79 | Awaiting approval |
| **C2 YHWH Chest Crew, Sand** | Name alone 101.6 mm wide | Gildan 18000 | — | Typography unresolved | Printify | `UNKNOWN` (63% planning) | $69 | **HOLD** (Rev 7) |
| **Premium Raised YHWH tee** | Raised tonal YHWH | Comfort Colors 1717, Printify Puff Print (Fulfill Engine, catalog 706) | Puff = text only, min 88 pt, solid area ≤ ~3.94×3.94 in; no image art | No brown/tan colours | Printify | from $22.42 + $4.49 ship (`DOCUMENTED` catalog list price) | $59 "Founder's Launch" | Blank+method `OWNER_CONFIRMED`; no artwork |
| ELOHIM / ADONAI tees | Master Vision boards | Existing Printify drafts | Unknown vs STANDARD boards — **must be compared** | — | Printify | $22.74 | $42 | **Not approved — keep DRAFT** |
| Names of God study PDF | — | Shopify digital download, 233,394 bytes | — | — | Shopify Digital Downloads | $0 | $5 | File hash vs approved v1 (`60322328…`) **unconfirmed by owner** |

**Planning economics (Rev 7, `DOCUMENTED`, to be replaced by real Product Creator quotes):** Tee $42 → contribution ≈ $18.54, break-even ROAS ≈ 2.27; Hoodie $79 → ≈ $37.21 / 2.12; Crew $69 → ≈ $32.09 / 2.15. Meta median ROAS ~1.88, apparel CPA ~$37 → **cold paid ads cannot lead; organic + creator first.**

---

## 8. Shopify / Printify operational status (LIVE_VERIFIED 2026-11-21 unless noted)

| Check | Result | Label |
|---|---|---|
| Store name | "God's Vessel" | `LIVE_VERIFIED` |
| Domain | e23peu-fk.myshopify.com (no custom domain) | `LIVE_VERIFIED` |
| Plan | **Advanced** (not partner dev) | `LIVE_VERIFIED` |
| Plan billing | "$1/mo until 2027-02-06 then $399/mo" | `DOCUMENTED` (ARIA ChannelListing fee_model) |
| Payments (Shopify Payments) | Not readable — connector lacks `read_shopify_payments` | `BLOCKED` |
| Markets | 1 market: **United States, ACTIVE** | `LIVE_VERIFIED` |
| Delivery — General profile (US) | 3 active methods: Standard $8.00, Standard $0.00 (condition unknown), Express $15.00 | `LIVE_VERIFIED` (conditions `UNKNOWN`) |
| Delivery — Printify profile | US Standard $4.95 first item, +$2.40 each; CA $9.69+; AU $12.99+ (CA/AU unreachable: no market) | `LIVE_VERIFIED` |
| **Refund policy** | Updated 2026-11-21 02:52 UTC. Content: print-to-order, no change-of-mind returns; free replacement/refund for damaged/misprint/wrong item; report within 30 days with photos; refunds to original method; cancellations only before production; consumer-rights clause. **Good.** Uses personal Gmail as contact. | `LIVE_VERIFIED` |
| **Shipping policy** | Updated 2026-11-21 02:01 UTC. **Body is the refund text, not shipping.** Missing: processing time (Printify ~2–7 business days), carrier transit, rates, destinations (US only), lost/stolen package handling, address-error rule, digital-product delivery clause. | `LIVE_VERIFIED` — **DEFECT** |
| Privacy policy | Updated 2026-11-05, body says "Last updated: November 12, 2026" | `LIVE_VERIFIED` |
| Terms of service | Updated 2026-11-05 | `LIVE_VERIFIED` |
| Products | 6, **all DRAFT, publishedAt = null** | `LIVE_VERIFIED` |
| Orders | 1: #1001, 2026-11-12, $0.00, PAID, `test:false` (owner delivery test) | `LIVE_VERIFIED` |
| Sales channels installed | Online Store, Shop, POS; apps Printify, Messaging, AI connectors; no TikTok/Google/Meta channel | `DOCUMENTED` (2026-11-10) |
| Printify billing / manual order approval | Unverified | `BLOCKED` |
| Printify store name | Unverified | `BLOCKED` |
| Storefront password | Believed on (study QA note) | `PRIOR_AGENT_REPORT` |
| Theme / navigation / design | Not inspected this session | `UNKNOWN` |

### Product detail

| Shopify ID | Title | Status | Variants | Price | Vendor |
|---|---|---|---|---|---|
| 10396204859478 | YHWH Washed Tee \| Names of God Exodus 3:14 Christian T-Shirt | DRAFT | 12 | 42–49 | Printify |
| 10396368404566 | Names of God: A Four-Day Scripture Study (Printable PDF) | DRAFT | 1 | 5 | God's Vessel |
| 10396204761174 | ADONAI Shirt — Names of God Tee… | DRAFT | 12 | 42 | Printify |
| 10396204826710 | ELOHIM Shirt — Names of God Tee… | DRAFT | 12 | 42 | Printify |
| 10396204662870 | REVIEW DRAFT - YHWH Type 3 B2 … - do not publish | DRAFT | 12 | 44.99–49.99 | Printify |
| 10396204728406 | Unisex Garment-Dyed Heavyweight Cotton Tee | DRAFT | 12 | 42 | Printify |

**Unit economics, YHWH Washed Tee S–XL (Claude calc from verified/documented inputs):** $42.00 − $22.74 production − Shopify Payments 2.5% + $0.30 ($1.35) = **$17.91** before tax, plan fee, refunds, ads. Shipping is passed through to buyer at $4.95 (matches Printify first-item rate). Rev 7 says $18.54 and the `#systems-blockers` post says $19.26 (pre-fee) — see §19.

---

## 9. Website and Figma implementation status

| Item | State | Label |
|---|---|---|
| Canonical site code | `dax-main` (React 18, Tailwind, React Router) in this repo | `LIVE_VERIFIED` |
| Hosting | Firebase Hosting project `dax-collective`, auto-deploy on push to `main` | `LIVE_VERIFIED` (workflow file) |
| Public routes | `/`, `/dax-the-traveler`, `/ani-dax`, `/timezone-travelers`, `/gods-vessel`, `/gods-vessel/merch/:id`, `/blog`, `/about`, `/brands`, `/resources`, `/contact`, `/privacy`, `/disclosure`, `/terms`; `/automation` (internal, gated) | `LIVE_VERIFIED` |
| Experiments | `/experiments/dax-universe`, `/dax-universe-v3`, motion-proof | `LIVE_VERIFIED` |
| Backend | `dax-backend` Express; not deployed; target Cloud Run | `DOCUMENTED` |
| Domain | daxcollective.com → 66.81.203.198 (not Firebase), times out | `DOCUMENTED` (ARIA 2026-11-12) |
| Release gates | PRs #7–#10 merged: unverified blog unpublished, internal routes gated, truthful contact form, waitlist durable, Firestore/Storage deny-by-default | `LIVE_VERIFIED` (git log) |
| README | Stale (describes Vue/Netlify) | `LIVE_VERIFIED` — doc defect |
| Figma | V3 blueprint names Figma as "visual source of truth" but no Figma file key exists in repo, ARIA, Slack or Drive search | `UNKNOWN` |
| Shop ↔ site link | GV merch pages exist in site; Shopify store not linked to site domain | `DOCUMENTED` |

**PROPOSED:** do not start another website. For revenue, point traffic at the Shopify store directly; site work resumes after first sale (domain DNS fix is the only cheap high-value item).

---

## 10. GitHub repositories and architecture

- **Repo:** `DaxHack/Dax-Collective` (only repo in scope). `main` @ `150f076e` (2026-11, Firestore rules hardening). `LIVE_VERIFIED`.
- **Layout:** `dax-main/` (frontend), `dax-backend/` (Express API; routes public/adminSheets/adminUpload; Firestore waitlist; tests), `functions/` (Firebase function: refreshGoogleToken), `n8n/` (30 workflow templates, import script, Python video script), `rules-tests/`, `scripts/` (V3 snapshot/portability), `docs/`.
- **CI:** `backend-ci.yml`, `rules-ci.yml`, Firebase hosting PR + merge workflows.
- **Open PR:** #11 "Add GV-001 'Strength in the Quiet' production (ready for publishing)" — draft, branch `content/gv-001-production`, created 2026-11-04. Merge triggers production deploy → **owner approval required**.
- **Referenced but not in repo:** `dax-private/` (Product Master notes, COMMERCE-STATUS.md, launch-readiness docs) — returns 404 per Slack; `gods-vessel/…` project files referenced by Sheet rows live in a Claude project, not GitHub. `BLOCKED`/`UNKNOWN`.
- **Local only (per ARIA):** n8n Docker instance on Daniel's PC.

---

## 11. Content production systems

| Stage | Capability that exists | Label |
|---|---|---|
| Intake | Slack `#content-production` charter; Claude Production Desk artifact; ARIA ContentItem | `DOCUMENTED` |
| Research/script | Drive 100-item content banks per brand (2025-07); Re:Zero thesis report | `LIVE_VERIFIED` files |
| Assets/voice | Canva library (organised into folders 01/02/05/06/99, 2026-11-10); approved media folders in repo | `DOCUMENTED` / `LIVE_VERIFIED` |
| Edit/render | FFmpeg pipeline + n8n "Multi-Format Video Creator with FFmpeg" template; GV-001 produced | `DOCUMENTED` |
| QC | Superagent technical QC (LUFS, dBTP, black frames, caption timing); Claude desk QC gate 85/100 + 4 hard checks | `PRIOR_AGENT_REPORT` |
| Approval | Owner-only via `#owner-approvals` | `LIVE_VERIFIED` (GV-001 approval message) |
| Publish | **No path verified.** No GV social account connected; TikTok 401; YouTube only Dax the Traveler | `BLOCKED` |
| Analytics | GA4 partially wired; Funnel_Log sheet planned; ARIA RevenueMetric | `DOCUMENTED` |

Content ID format: `GV|AD|TZT|DTT-YYMMDD-NN` (`PRIOR_AGENT_REPORT`). GV-001 uses the older `GV-001` form — reconcile.

---

## 12. AI agents and automation workflows

### Agents (ARIA `Worker`, LIVE_VERIFIED)
| Worker | Executor | Execution status | Notes |
|---|---|---|---|
| Build and Integration Worker | Manual | READY | Systems connect/test/repair |
| Creative QA Worker | Gemini | CONNECTED | QA vs approved references |
| Revenue Execution Worker | Manual | CONNECTED, ACTIVE | YHWH tee to commercially ready |
| Career Execution Worker | Manual | READY | Personal job search — outside Dax Collective scope |

Also active outside ARIA: "daniel-r-superagent" Slack bot (posted Rev 3–7 and GV-001 QC) — `LIVE_VERIFIED` posts; its platform/config `UNKNOWN`.

### n8n (classification)
| Group | Count | Classification | Basis |
|---|---|---|---|
| Live instance (local Docker) | — | **PARTIAL** — DAX-04 schedule registered, no scheduled run observed; no content workflows active; Python task runner missing | `DOCUMENTED` ARIA 2026-11-11 |
| Repo templates (30 files) | 29 parse, 1 parse error (`workflow_12_data_collection_agent.json.json`, empty/invalid) | **UNVERIFIED** — templates, not proof of execution; several filenames contain stray spaces | `LIVE_VERIFIED` |
| Publishing templates (YouTube, TikTok/IG, Blog) | 3 | **BLOCKED** — platform auth not in place; publishing is protected | Derived |
| "Secrets Vault & Rotation Agent" | 1 | **Do not import** without security review (credential handling) | `PROPOSED` |
| Master orchestrator variants (3) | 3 | Likely **OBSOLETE/duplicate** — pick one | `PROPOSED` |

Telegram routing: decided, **not connected** (`DOCUMENTED` 2026-11-19).

---

## 13. Available integrations and permissions (as seen by Claude, 2026-11-21)

| Integration | Read | Write | Notes |
|---|---|---|---|
| GitHub (Dax-Collective) | ✅ | ✅ (branch `claude/…` only; push needs owner OK) | |
| ARIA / Base44 | ✅ | ✅ entities (not used this session) | Approval ledger is server-written only |
| Shopify | ✅ | Products/files yes; **policies no** (`write_legal_policies` missing); **payments read no** | |
| Google Drive/Sheets/Docs | ✅ | ✅ | |
| Slack | ✅ | ✅ (posts as Daniel) | Group DMs unreadable (no `mpim`) |
| Canva | ✅ | ✅ | Cannot delete |
| Figma | connector present | — | No file keys |
| Printify | ❌ | ❌ | Needs token or owner check |
| TikTok for Business | connector present | — | 0 ad accounts (2026-11-10); content API 401 |
| n8n | ❌ | ❌ | Local only |
| base44.app public files | ❌ | — | Sandbox network policy blocks host |

---

## 14. Revenue objectives and financial model

**Verified revenue to date: $0.** (`LIVE_VERIFIED` — no paid orders)

| Lever | Unit contribution | Volume to cover Advanced plan ($399/mo) | Label |
|---|---|---|---|
| YHWH Washed Tee S–XL | $17.91 | ~22.3 tees/mo | Claude calc |
| Study PDF $5 | $4.57 | ~87 PDFs/mo | `DOCUMENTED` |
| Hoodie $79 (planning) | ≈ $37.21 | ~10.7/mo | `DOCUMENTED` Rev 7 |

**PROPOSED (owner decision):** before 2027-02-06, either (a) downgrade to Basic (verify current Basic price and fee in Shopify admin; Basic card fees are higher than Advanced), or (b) keep Advanced only if run-rate > ~$1,500/mo gross. For a pre-revenue store, (a) is the realistic choice.

**Financial model gaps (BLOCKED):** real Shopify Payments fee line (needs one real order), Printify Premium yes/no, 2XL/3XL mix, sales tax setup, refund/misprint rate.

---

## 15. Marketing and audience growth strategy

| Item | Status |
|---|---|
| Rev 7: broad soft launch; 60–70% of marketing on one hero tee + one hero fleece | `DOCUMENTED` |
| Organic + creator first; no cold paid until contribution supports ROAS > ~2.2 | `DOCUMENTED` |
| Channel priority: TikTok → Instagram Reels → YouTube Shorts; Pinterest later | `DOCUMENTED` (Sheet LAUNCH-022) |
| Free Shopify channels (Google & YouTube, Facebook & Instagram) after approval | `DOCUMENTED` (not installed) |
| TikTok Shop: route unresolved (POD fulfilment & 3-business-day tracking rule conflict) | `BLOCKED` |
| GV social accounts: none verified for IG/TikTok/YouTube; FB Pages exist but outside a Business asset | `DOCUMENTED` |
| **PROPOSED:** first-week plan = GV-001 + 2 product-led shorts on whichever GV account Daniel can log into today, each linking to the live YHWH listing with UTM `utm_campaign=GV-YHWH-LAUNCH&utm_content=<ContentID>`; SEO: product title/description already optimised (Sheet LAUNCH-003) — add size chart and FAQ. |

---

## 16. Current blockers and dependencies

| # | Blocker | Owner | Blocks | Label |
|---|---|---|---|---|
| B1 | Shipping policy contains refund text | Daniel (Claude can't write policies) | First sale (customer trust; Shopify/Google channel review) | `LIVE_VERIFIED` |
| B2 | Shopify Payments state unknown | Daniel | Any paid checkout | `BLOCKED` |
| B3 | Printify billing + manual first-order approval | Daniel | Fulfilment | `BLOCKED` |
| B4 | Final publish approval of YHWH Washed Tee (design chosen; listing review pending) | Daniel | Activation | `OWNER_CONFIRMED` choice / approval pending |
| B5 | C1 vs editorial back on Washed Tee | Daniel | Rev 7 open item; **does not block launch of Construction D as-is** if owner accepts it as the launch alternate | `DOCUMENTED` |
| B6 | Rev 8 + 2026-11-20 handoff not readable by agents | Daniel/ARIA | Spec fidelity | `BLOCKED` |
| B7 | No GV social account connected | Daniel | Publishing GV-001 | `BLOCKED` |
| B8 | Study PDF hash + description wording | Daniel | $5 product launch | `BLOCKED` |
| B9 | Font licences | Daniel | All new production files | `BLOCKED` |
| B10 | Vector GV emblem master | Claude can prepare; Daniel approves | Any embroidery | `BLOCKED` |
| B11 | daxcollective.com DNS | Daniel | Website (not revenue-critical) | `DOCUMENTED` |
| B12 | Shopify plan cost after 2027-02-06 | Daniel | Profitability | `DOCUMENTED` |

---

## 17. Known decisions and unresolved questions

**Decided (`OWNER_CONFIRMED`):**
- 2026-11-10: YHWH launch price introductory $42; Type 3 B2 kept separate; Canva cleanup approach; puff print CC1717 for Premium Raised tee.
- 2026-11-12: Launch the main YHWH draft (GV chest / YHWH back) at $42/$46/$49; Type 3 v3 is a later drop.
- 2026-11-19: GV-001 → v2 (end-card dissolve).
- 2026-11-20: Master Vision first, cutbacks second.

**Open (each needs Daniel):**
1. Accept Construction D (no C1) as the YHWH Washed Tee launch alternate, or add C1?
2. C1 naming: retire the 9 in chest-emblem use of "C1"? (recommended in Rev 3)
3. C2 typography and type scale.
4. Tee route: Tier B now vs Tier C later.
5. Confirm C1-W (Rev 8) as the fleece alternate.
6. H1/H2: launch now (Rev 7 "conditional") or after tee sells?
7. ELOHIM/ADONAI drafts: keep DRAFT (Rev 7) — confirm.
8. Study PDF: Shopify or Etsy (ARIA Project says Etsy; Shopify draft exists)?
9. Support email: personal Gmail vs brand address in policies.
10. Shopify plan before 2027-02-06.
11. Which Google identity owns Ani-Dax / GV / TZT YouTube channels.
12. MapMasters/Odyssey: active project or future idea?

---

## 18. Evidence and source register

| ID | Source | Locator | Read on | Used for |
|---|---|---|---|---|
| E1 | Shopify Admin GraphQL | shop, products(50), shopPolicies | 2026-11-21 | §8 |
| E2 | Shopify Admin GraphQL | markets, deliveryProfiles, orders | 2026-11-21 | §8 |
| E3 | ARIA entities | app 6abd58709033092bc7a84d02: Brand, Product, ChannelListing, SystemItem, Project, NeedItem, Worker, ContentItem, ProductApprovalEvent | 2026-11-21 | §3, 4, 12, 19 |
| E4 | Google Sheet | God's Vessel — Product Master Sheet `14kZnyUF_…`, tabs YHWH_Launch_Tracker, Design_Versions | 2026-11-21 | §6, 7, 17 |
| E5 | Slack `#content-production` C0CKCP5SJQN | Rev 3 (18:46, 18:51), Rev 5 (19:09), Rev 7 (19:32) EST 2026-11-20; GV-001 rundown | 2026-11-21 | §6 |
| E6 | Slack `#agent-handoffs` C0CJZB20RT9 | Delegation queue, routing, Claude check-in, agents plan | 2026-11-21 | §12, File C |
| E7 | Slack `#systems-blockers` C0CKGJXP797 | GV blockers 2026-11-19 | 2026-11-21 | §16 |
| E8 | Slack `#owner-approvals` | GV-001 v2 approval 2026-11-19 | 2026-11-21 | §11 |
| E9 | GitHub | repo tree, git log, PR list | 2026-11-21 | §9, 10 |
| E10 | Repo docs | `docs/PRODUCTION-CONFIGURATION.md`, `docs/DAX-UNIVERSE-V3-APPROVED-BLUEPRINT.md`, `firebase.json`, workflows | 2026-11-21 | §9 |
| E11 | Drive search | GV/ARIA/Dax files list | 2026-11-21 | §3, 11 |
| E12 | Owner brief (this assignment) | Rev 8 C1-W facts, spec URLs | 2026-11-21 | §6 (unverified against source) |

Not read (and why): Rev 7/Rev 8/handoff full files (network block); Drive docs "ARIA — Operating Core…", "Multi-Agent QA Contract & Verified Integration Audit — 2026-11-09", "SKU Structure, Rights Log & Copy Framework", "Layout Variant Study" (time-boxed; **recommended next read**); Canva designs; Claude artifacts (Production Desk, AI agents plan, Feasibility Report) — not accessible from this session.

---

## 19. Discrepancies requiring reconciliation

| # | Discrepancy | Side A | Side B | Authoritative resolution |
|---|---|---|---|---|
| D1 | **Shipping policy content** | Owner says refund + shipping policies were updated | Live shipping policy = refund text | Live wins → **fix needed** (owner pastes real shipping policy) |
| D2 | ARIA approval ledger | Owner approvals exist (Sheet 2026-11-12, Slack 2026-11-19) | `ProductApprovalEvent` has **0** records | Record approvals in ARIA via its approval flow (owner action — ledger is server-written) |
| D3 | ARIA Product "YHWH Washed Tee" blocker | "Owner must pick the final design" (2026-11-12 07:01) | Sheet LAUNCH-013: owner chose 2026-11-12 03:22 UTC | Sheet is later-dated evidence of decision → update ARIA Product blocker |
| D4 | ARIA ChannelListing for study PDF | "Digital Downloads app not installed; no file attached" (2026-11-05) | ARIA Product + Sheet: file attached, test delivered (2026-11-12/17) | Update ChannelListing |
| D5 | ARIA SystemItem "Shopify" | "No Shopify connector… UNKNOWN" | Claude reads Shopify live | Update: data-source PARTIAL (read OK; payments/policies scopes missing) |
| D6 | Slack Claude check-in (2026-11-19) | "No access to ARIA… or the dax-main repo" | This session has both | Session-dependent; record per-session access in WorkerRun |
| D7 | Tee contribution | $17.91 (ARIA) | $18.54 (Rev 7) / $19.26 pre-fee (Slack) | Use $17.91 until a real order fee line exists |
| D8 | Study PDF channel | ARIA Project: Etsy listing | Shopify draft exists, tested | Owner choice; recommend Shopify (already built) |
| D9 | Back embroidery on fleece | Rev 5: Printify documents back embroidery | Rev 7: wrists/chest only | Rev 7 supersedes |
| D10 | "C1" meaning | 9 in centre-chest emblem (Nov 18 fleece board) | 2×2 in lower-back mark (spec) | Open — owner |
| D11 | Washed Tee back | Approved editorial YHWH back (Construction D) | Rev 3/5: back = C1 | Open — owner |
| D12 | ADONAI/ELOHIM | Shopify drafts with Printify art exist | Rev 7: Master Vision only, no purchasable listing | Keep DRAFT; add "do not publish" note in ARIA |
| D13 | Markets vs Printify zones | Printify profile has CA/AU rates | Only US market active | Fine for now; shipping policy must say US only |
| D14 | Privacy policy dates | `updatedAt` 2026-11-05 | Body says "Last updated: November 12, 2026" | Cosmetic; regenerate when name/contact final |
| D15 | Repo README | Vue/Netlify/GitHub Pages | Actual: React/Firebase | Update README (low priority) |
| D16 | Content ID formats | `GV-001` | `GV-YYMMDD-NN` | Owner picks; recommend keep GV-001 as legacy alias |
| D17 | Rev 8 / handoff contents | Owner brief lists C1-W, YHWH front, tee/fleece datums | Not readable by Claude | Paste into repo/Drive |

---

## 20. Recommended agent responsibilities

| Role | Primary responsibilities | Must not |
|---|---|---|
| **Owner (Daniel)** | Creative direction; approvals (design, publish, spend, deploy, delete, credentials); account logins/2FA; policy edits Claude can't make | — |
| **ARIA (Base44)** | System of record: Projects, Tasks, NeedItems, approvals ledger, evidence, ChannelListing, OrderEvent, RevenueMetric | Hold secrets; be bypassed by Slack posts |
| **Claude** | Live verification (Shopify, ARIA, GitHub, Drive, Slack, Canva); code; production-file prep (vector/transparent exports); listing QA; ARIA data reconciliation (with approval); evidence collection | Publish, spend, change policies/credentials, modify approved artwork, merge/push without approval |
| **ChatGPT** | Independent research (suppliers, decoration methods, market, competitors), financial model, creative/brand QA, review of Claude's decisions, its own context export | Treat its memory as shared with Claude; claim live state it can't read |
| **Superagent (Slack bot)** | Spec revisions, technical media QC | Be treated as approval authority |
| **Gemini (Creative QA Worker)** | Creative QA against approved references | Final approval |

Detailed protocol in File C.

---

## 21. Immediate execution priorities (next 72 hours)

1. **Daniel:** replace Shipping Policy text (Claude provides ready-to-paste draft on request — PROPOSED wording in File C §4).
2. **Daniel:** Shopify Admin → Settings → Payments: screenshot exact state.
3. **Daniel:** Printify → Payments has a card; Orders → manual approval ON.
4. **Daniel:** final review of YHWH Washed Tee draft → approve activation on Online Store (Construction D as launch alternate).
5. **Daniel/ARIA:** paste Rev 7, Rev 8 and 2026-11-20 handoff text where agents can read them.
6. **Claude (after approval):** reconcile ARIA records D2–D5, D12; post evidence.
7. **Daniel:** choose one GV social account to post GV-001 + link.

## 22. 30/60/90-day operating roadmap

| Window | Goal | Key results |
|---|---|---|
| **Days 0–30** | First paid God's Vessel sales | Policies fixed; Payments active; YHWH tee + $5 PDF live; GV-001 + 6 shorts posted; first real order fee line captured; ARIA reconciled; Shopify plan decision made |
| **Days 31–60** | Hero fleece + repeatable content | H1 or H2 hoodie production files (print front + C1-W sleeve if approved); one-sample QC order (**owner-approved spend**); weekly content cadence on 2 platforms; Google/Meta free channels installed; Dax the Traveler editing pilot (DAX-HO-001) on Daniel's PC |
| **Days 61–90** | Second revenue line + reliability | Ani-Dax Re:Zero pilot published; Time-Zone Travelers digital product decision; one n8n workflow proven end-to-end (order → ARIA OrderEvent); website domain fixed; Tier C local-decorator quote for Master Vision if revenue supports |

## 23. Explicit owner approval requirements

Nothing in this list may be done by any agent without a dated owner "yes" recorded in ARIA or `#owner-approvals`:

- Setting any Shopify product ACTIVE or adding it to a sales channel; removing storefront password
- Editing policies, store settings, shipping rates, markets, payments, plan
- Creating/editing Printify products; ordering samples; any spend
- Publishing any content to any platform; connecting social accounts
- Merging PR #11 or any PR to `main` (auto-deploys); any `git push`
- Deleting/archiving any Shopify product, Canva design, Drive file, or repo file
- Creating, rotating, or revealing credentials; changing Firebase rules
- Modifying approved artwork or moving C1 / substituting C1-W for Tier 0
- Writing to ARIA records that change status to APPROVED/PUBLISHED

---
*End of File A. Claude did not publish, deploy, spend, order, delete, change credentials, or modify artwork in producing this export.*
