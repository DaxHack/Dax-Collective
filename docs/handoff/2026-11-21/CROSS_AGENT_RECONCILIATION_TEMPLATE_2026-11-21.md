# CROSS-AGENT RECONCILIATION TEMPLATE — 2026-11-21

**File B of 3.** Used in Phase 8 to compare the Claude export (File A) with the ChatGPT Deep Research handoff, then hand ARIA one reconciled record.

**Rules**
1. Never edit either original report. Copy claims into this template.
2. Operational facts (store state, product status, prices, policies, orders, repo state, ARIA records) → resolve by **a live read made on the reconciliation date**. The live read wins over both reports.
3. Design facts (Tier 0, placements, families, typography) → resolve by **owner's explicit instruction**, then the approved spec hierarchy (latest Rev that addresses the point; Tier 0 is never overwritten by a production alternate).
4. If neither a live read nor an owner instruction settles it → status `UNRESOLVED`, keep both claims, add to Owner Decision Queue. Never guess.
5. Same labels as File A: `OWNER_CONFIRMED`, `LIVE_VERIFIED`, `DOCUMENTED`, `PRIOR_AGENT_REPORT`, `PROPOSED`, `BLOCKED`, `UNKNOWN`, `SUPERSEDED`.
6. No credentials, tokens, cookies or private customer data in this file.

---

## Section 0 — Inputs

| Field | Value |
|---|---|
| Claude export | `docs/handoff/2026-11-21/DAX_COLLECTIVE_CLAUDE_MASTER_CONTEXT_EXPORT_2026-11-21.md` @ commit `<sha>` |
| ChatGPT export | `<file name / link>` dated `<YYYY-MM-DD>` |
| Reconciler | `<Claude / ChatGPT / Daniel>` |
| Reconciliation date | `<YYYY-MM-DD>` |
| Live systems read during reconciliation | `<Shopify / ARIA / GitHub / Drive / Slack / Printify / …>` with time |
| Systems NOT readable | `<list + reason>` |

## Section 1 — Agreement register (both reports say the same thing)

| ID | Topic | Claim (shared) | Claude label | ChatGPT label | Live check needed? | Final status |
|---|---|---|---|---|---|---|
| A-01 | | | | | Y/N | |

## Section 2 — Gaps (present in one report only)

| ID | Topic | Present in | Claim | Source cited | Verify by | Final status |
|---|---|---|---|---|---|---|
| G-01 | | Claude / ChatGPT | | | live read / owner | |

## Section 3 — Conflicts

| ID | Topic | Type (OPERATIONAL / DESIGN / STRATEGY) | Claude says (+label, date) | ChatGPT says (+label, date) | Resolution source | Resolved value | Status (`RESOLVED` / `UNRESOLVED`) | Evidence ID |
|---|---|---|---|---|---|---|---|---|
| C-01 | | | | | | | | |

### Pre-seeded conflicts/known items to check first (from File A §19)

| ID | Topic | Check |
|---|---|---|
| C-S1 | Shipping policy content | Shopify `shopPolicies` SHIPPING_POLICY body: is it shipping text or refund text? |
| C-S2 | Shopify Payments state | Owner screenshot of Settings → Payments |
| C-S3 | YHWH Washed Tee launch design | Sheet LAUNCH-013 vs ARIA Product blocker vs any ChatGPT claim |
| C-S4 | C1 on Washed Tee vs editorial back | Owner decision |
| C-S5 | C1-W sleeve alternate (Rev 8) | Rev 8 source text + owner |
| C-S6 | Back embroidery availability on fleece | Rev 7 + supplier pages (date read) |
| C-S7 | Tee contribution margin | Real order fee line, else $17.91 rule |
| C-S8 | ELOHIM/ADONAI listings | Rev 7 says Master Vision only |
| C-S9 | Study PDF channel (Shopify vs Etsy) | Owner |
| C-S10 | Shopify plan after 2027-02-06 | Shopify admin billing page (owner) |
| C-S11 | ARIA approval ledger empty | ARIA `ProductApprovalEvent` count |
| C-S12 | MapMasters/Odyssey existence | Owner |

## Section 4 — Outdated information

| ID | Item | Stated in | Stated date | Newer evidence | Action for ARIA |
|---|---|---|---|---|---|
| O-01 | | | | | update / mark SUPERSEDED |

## Section 5 — Supplier and market research comparison (ChatGPT-led)

Separate the three kinds of numbers. Never mix them in one cell.

| Supplier / method | Published info (URL + date read) | Live configured cost (system + date) | Internal assumption (owner/agent + date) | Fit for Tier 0 / Tier A / B / C |
|---|---|---|---|---|
| Printify DTG (AA 1301GD) | | | | |
| Printify embroidery (Gildan 18500/18000) | | | | |
| Printify puff (CC1717) | | | | |
| Printful | | | | |
| Apliiq | | | | |
| Fourthwall | | | | |
| Local screen printer / embroiderer | | | | |

## Section 6 — Owner Decision Queue (for ARIA `NeedItem`, category `choose` / `approve`)

| Rank | Decision | Options | Recommended (who, why) | Blocks | Deadline |
|---|---|---|---|---|---|
| 1 | | | | | |

## Section 7 — ARIA update packet

Each row becomes one proposed ARIA write. **Claude/ChatGPT propose; owner approves; then one operator writes.** Approval/ledger entries are written only through ARIA's own approval flow.

| Entity | Record id | Field | Current value | Proposed value | Evidence ID | Approved by / date |
|---|---|---|---|---|---|---|
| Product | 6abd5baf9c85842c504709d3 | blocker | "Two competing YHWH designs…" | "Design chosen 2026-11-12 (Construction D). Remaining: payments, shipping policy, Printify billing, publish approval." | E4 | |
| ChannelListing | 6aec18e9284cc7157938b756 | fulfillment_route / notes | "app not installed; no file attached" | "Digital Downloads installed; 233,394-byte PDF attached; $0 test #1001 delivered 2026-11-12" | E1, E4 | |
| SystemItem | 6af4f8a373fc4bb688497e78 | data_source_connection | BLOCKED | PARTIAL (read OK via Claude Shopify connector; no payments/policy scopes) | E1 | |
| ChannelListing | 6aebfd8a8e0366ab8607594d / …4c | notes | "Artwork approval not yet recorded" | append "Rev 7: Master Vision only — DO NOT PUBLISH until production files approved" | E5 | |

## Section 8 — Sign-off

| Role | Name | Date | Decision |
|---|---|---|---|
| Reconciler | | | |
| Reviewer (other AI) | | | |
| Owner | Daniel | | APPROVED / CHANGES |
