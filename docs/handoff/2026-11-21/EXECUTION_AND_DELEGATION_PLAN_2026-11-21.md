# EXECUTION AND DELEGATION PLAN — 2026-11-21

**File C of 3.** Prioritises revenue, production readiness and finishing existing work. No new apps, dashboards, platforms or integrations.

---

## 1. The critical path to the first paid sale (God's Vessel)

| Step | Action | Who | Type | Evidence of done | Status |
|---|---|---|---|---|---|
| 1 | Replace Shipping Policy text (currently refund text) | Daniel (Claude can't write policies) | Owner action, reversible | Claude re-reads SHIPPING_POLICY body | `BLOCKED — DANIEL` |
| 2 | Report Shopify Payments state (Set up / Under review / Active / test mode) | Daniel | Owner check | Screenshot in `#owner-approvals` | `BLOCKED — DANIEL` |
| 3 | Printify: payment method on file; manual approval ON for first orders; store named God's Vessel | Daniel | Owner check | Screenshot | `BLOCKED — DANIEL` |
| 4 | Final listing review of YHWH Washed Tee draft (images, copy, size chart, $42/$46/$49) | Daniel; Claude prepares checklist | Approval | Owner "approve publish YHWH Washed Tee" message | Pending |
| 5 | Set product ACTIVE + Online Store channel; remove storefront password | Claude or Daniel **after** step 4 approval | Publish (gated) | Shopify read: status ACTIVE, publishedAt set | Not started |
| 6 | Post GV-001 v2 on one GV account Daniel can log into, with UTM link | Daniel (logs in); Claude drafts caption | Publish (gated) | Post URL in ARIA ContentItem | `BLOCKED` (no account connected) |
| 7 | First real order → capture fee line → update unit economics + ARIA OrderEvent | Claude | Verify | Order read + ARIA write | Waiting |

Parallel, non-blocking: $5 study PDF launch (needs owner hash/wording confirmation + steps 1–2).

**Excluded on purpose:** website domain fix, n8n expansion, new brands' products, TikTok Shop, paid ads — none move the first sale.

## 2. Delegation board (assign in ARIA; max 3 active initiatives)

| Task ID | Task | Primary | Reviewer | Inputs | Definition of done | Approval gate |
|---|---|---|---|---|---|---|
| DAX-HO-003 | GV release readiness (steps 1–7) | Claude | ChatGPT | File A §8, Shopify, Sheet | All 7 steps evidenced | Steps 4–6 |
| GV-SPEC-01 | Make Rev 7, Rev 8, 2026-11-20 handoff agent-readable | Daniel / ARIA | Claude | Base44 app 6ae98277… | Text in `docs/gods-vessel/specs/` or Drive | None (copy only) |
| GV-SPEC-02 | Master-vs-alternate sheet per product using Rev 8 | Claude | ChatGPT (QA) | GV-SPEC-01 | Table matches File A §7 format, every deviation sourced | Owner approves alternates |
| ARIA-REC-01 | Apply ARIA update packet (File B §7) | Claude | Daniel | File B | ARIA reads back proposed values | Owner OK per write |
| GV-RES-01 | Supplier/decoration research (Printify, Printful, Apliiq, Fourthwall, local); premium blanks; real decoration zones; faith-apparel competitors | ChatGPT | Claude (verifies citations/dates) | File B §5 | Filled File B §5, every number dated + URL | None (research) |
| GV-FIN-01 | Unit economics + Shopify plan decision model | ChatGPT | Claude (checks vs live data) | File A §14 | Basic vs Advanced break-even table | Owner decides plan |
| GV-ART-01 | Vector GV emblem master (from raster, MINISTRY line kept/removed per owner) | Claude | Gemini QA + Daniel | Canva MAGpd9s7mJI | SVG + PDF in Drive, labelled DRAFT | Owner approves art |
| DAX-HO-001 | Travel editing pilot | Claude Code on Daniel's PC | Daniel | Local footage, FFmpeg | 1 long + 2 shorts + QC report | Publish gated |
| DAX-HO-002 | Ani-Dax Re:Zero research/script | ChatGPT (research) → Claude (QC) | Daniel | Drive thesis report | Sourced script package | Publish gated |

Start now: DAX-HO-003, GV-SPEC-01, GV-RES-01. Queue the rest.

## 3. Shared protocol (10 steps)

| # | Step | Rule |
|---|---|---|
| 1 | Intake & priority | Every task gets an ARIA Task/NeedItem with brand, priority, owner. Revenue-linked first. Max 3 active initiatives. |
| 2 | Existing-state discovery | Before work: read ARIA record + live system. Live wins. Record what was read and when. |
| 3 | Delegation | Assign by **actual access this session**, not by role label. Claimant posts in `#agent-handoffs`: Task ID, operator, access, ETA, first action. ARIA is updated before work starts. |
| 4 | Evidence | Every claim carries a label + source + time. Store in ARIA ProductEvidence / WorkerRun.evidence. |
| 5 | Cross-agent review | Other AI reviews before owner sees it. Reviewer checks sources, not prose. |
| 6 | Conflict reconciliation | Use File B. Operational → live read. Design → owner + spec hierarchy. Else UNRESOLVED. |
| 7 | Owner approval | Owner-only, in `#owner-approvals` with exact artefact/version/link; ARIA ledger entry. |
| 8 | Controlled execution | One operator executes one approved change; reversible-first; no batch publishing. |
| 9 | Verification | Read back from the live system after every change; attach result. |
| 10 | Monitoring | Weekly: RevenueMetric (only verified numbers), content analytics, blockers list. Keep / Change / Stop in ARIA LogEntry. |

**Context sharing between Claude and ChatGPT:** they do **not** share memory. Hand-offs only via dated files (this folder), ARIA records, or Drive docs. Each export names its date, access list and unread sources.

## 4. Proposed Shipping Policy draft (for Daniel to paste — `PROPOSED`, not applied)

> **Shipping Policy** — Last updated: [date]
>
> **Where we ship.** We currently ship to addresses in the United States only.
>
> **Processing time.** Every God's Vessel piece is printed to order. Orders are usually produced within 2–7 business days before shipping.
>
> **Delivery time.** After production, standard delivery typically takes 3–8 business days within the US. Express shipping is available at checkout where offered. Delivery estimates are not guaranteed.
>
> **Shipping costs.** Shipping is calculated at checkout. Orders with multiple items may ship in separate packages.
>
> **Tracking.** You'll receive a tracking link by email once your order ships.
>
> **Address accuracy.** Please check your shipping address before ordering. We are not responsible for orders delivered to an incorrect address provided at checkout; contact us immediately if you spot an error and we'll try to update it before production begins.
>
> **Lost or damaged packages.** If your package is marked delivered but not received, or arrives damaged, email [support email] within 30 days of the delivery date with your order number and photos where relevant, and we'll help resolve it.
>
> **Digital products.** Digital downloads (such as printable studies) are delivered by email immediately after purchase and do not ship physically.
>
> **Questions.** Contact [support email].

Daniel must confirm: processing/delivery day ranges against Printify's current figures, and the support email (personal Gmail vs brand address).

## 5. Approval checklist for Daniel (copy-paste reply format)

```
APPROVALS — <date>
1. Shipping policy pasted: YES/NO
2. Shopify Payments state: <exact text>
3. Printify payment method + manual approval ON: YES/NO
4. YHWH Washed Tee (Construction D, $42/$46/$49) — approve publish to Online Store: YES/NO
5. Remove storefront password: YES/NO
6. GV account for GV-001: <platform/handle>
7. Claude may apply ARIA update packet (File B §7): YES/NO
8. Keep ELOHIM/ADONAI drafts unpublished (Rev 7): YES/NO
9. Study PDF sells on: SHOPIFY / ETSY
10. Support email for policies: <address>
```

## 6. Handoff (Operating Rules format)

**VERIFIED DONE (2026-11-21)**
- Shopify: 6 products all DRAFT; 1 order ($0 test); US-only market; Printify delivery profile US $4.95 first item; Advanced plan; refund policy content correct.
- ARIA: schemas and key records read; approval ledger empty.
- Slack: Rev 3/5/7 summaries recovered.
- Sheet: launch tracker and design versions read.
- Repo: structure, CI, open PR #11, 30 n8n templates (1 invalid file).

**BLOCKED — DANIEL**
- Shipping policy text wrong → paste correct policy.
- Payments state unreadable → screenshot.
- Printify billing/approval → check.
- Rev 8 + handoff unreadable by agents → paste text.
- Publish approval for YHWH Washed Tee.

**NEXT**
- After the five items above: Claude activates the approved listing, verifies live, records in ARIA.

**DO NOT REDO**
- YHWH design choice (decided 2026-11-12), launch pricing, Canva library audit/cleanup, GV-001 v2 creative, Rev 7 commercial disposition, refund policy text.
