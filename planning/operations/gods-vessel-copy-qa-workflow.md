# God's Vessel — Product Copy QA Workflow

**Date:** 2026-06-30
**Applies to:** all rows in `gods-vessel-phase-one-master-sheet.csv`, and any future rows added for later collections.
**Purpose:** define how product/marketing copy gets checked against the master sheet before it's ever treated as ready to design, list, or publish — and exactly where human approval is non-negotiable.

---

## 1. What triggers a product-description update

A row's copy (`Product Title Draft`, `Short Description Draft`, `Long Description Draft`, `Study Card Copy Draft`) should be revisited whenever any of the following happens — this is the literal meaning of the `Copy Update Trigger` column on the sheet:

- A scripture translation is chosen for that theme (changes `Scripture Translation / Source` from "Not yet specified" to an approved version)
- A definition/meaning wording is approved (changes `Biblical Accuracy Review Status` from "Needs confirmation" to approved)
- A physical sample is received and confirms or contradicts a fabric/print/fit assumption (changes `Product Facts Confirmed` from "No" to a real fact)
- The print method, garment blank, or logo placement changes for that row
- A claim previously listed in `Claims Not Yet Confirmed` becomes confirmed (e.g. real pricing or a confirmed ship date exists) and needs to move into the copy itself
- You manually flag a row for re-review for any other reason

If none of these have happened since `Last Reviewed Date`, the existing draft copy stands as-is — copy isn't rewritten just because time has passed.

## 2. How AI compares copy against the Sheet

Before any copy is treated as usable for a Canva asset, a study card, or (later) a Shopify listing, it gets checked against the row's own QA columns, in this order:

1. **Source check:** does `Scripture Translation / Source` show an approved translation, or still "Not yet specified"? If unconfirmed, any scripture-quoting copy stays flagged, not finalized.
2. **Accuracy check:** does `Scripture Accuracy Review Status` and `Biblical Accuracy Review Status` show anything other than "Needs confirmation" / "Needs source/translation confirmation"? If either is still pending, the copy is draft-only.
3. **Fact check:** does the copy state anything from `Claims Not Yet Confirmed` (fabric specs, pricing, shipping dates, sustainability, limited-drop language, durability claims) as if it were true? If yes, that's a QA failure — the copy must be rewritten to remove or soften the claim.
4. **Approval check:** does `Human Approval Required` still read "Yes" with no corresponding sign-off from you? If so, the copy cannot move past draft status regardless of how polished it reads.

This comparison is the literal job of the `Product Copy QA Status` column — it should only move off "Draft - not yet reviewed" once all four checks above are satisfied.

## 3. What AI can revise automatically as draft

Within a single row, AI can freely redraft the following without separate sign-off each time, since these are draft-to-draft changes that don't introduce new unconfirmed claims:

- Rewording `Short Description Draft` / `Long Description Draft` for clarity, tone, or length, as long as no new factual claim is introduced
- Aligning `Product Title Draft` with the rest of the row's data (theme, garment, lane) if it drifts out of sync
- Updating `Study Card Copy Draft` to reflect a newly-chosen `Scripture Translation / Source` once you've told AI which translation to use
- Propagating a confirmed fact (once you've manually marked something confirmed) into the relevant description fields
- Flagging a new claim that's crept into copy by moving it into `Claims Not Yet Confirmed` and reverting that part of the copy to a safer draft phrasing

All of this stays inside the sheet and stays labeled draft — none of it is "publishing" anything.

## 4. What always requires your approval

The following never happen automatically, no matter how confident the draft looks:

- Choosing the scripture translation/source for any theme
- Approving final wording for a definition, devotional context, or study card that quotes or closely paraphrases scripture
- Moving any row's `Approval Status` away from "Draft / Pending Your Review"
- Moving `Product Copy QA Status` to anything other than "Draft - not yet reviewed"
- Treating anything in `Claims Not Yet Confirmed` as confirmed and writing it into public-facing copy (pricing, fabric specs, ship dates, sustainability claims, limited-drop framing)
- Creating Canva designs, Shopify listings, Printify products, store accounts, or any external connection based on this sheet
- Spending money, ordering samples, or publishing anything

## 5. Pass/fail checklist before any listing is published

A row must pass every item below before it can move toward an actual public listing (Phase 3+, not authorized by this document):

- [ ] Scripture translation/source is chosen and recorded in `Scripture Translation / Source`
- [ ] `Scripture Accuracy Review Status` and `Biblical Accuracy Review Status` are both marked approved by you, not "Needs confirmation"
- [ ] All text in `Claims Safe To Use` has been double-checked against the actual final copy — nothing extra has crept in
- [ ] `Claims Not Yet Confirmed` no longer contains anything that appears stated as fact in the live copy — either it's been confirmed and moved out, or the copy avoids it entirely
- [ ] A physical sample has been reviewed (`Sample Status` = Approved) if the row's print method was flagged "Requires specialty printer / Unknown — needs test"
- [ ] `Product Copy QA Status` reads something other than "Draft - not yet reviewed"
- [ ] `Last Reviewed Date` reflects an actual review by you, not just a draft-creation date
- [ ] `Human Approval Required` has an explicit "Approved" from you for this specific row, not just a general go-ahead for the collection

Any unchecked box means the row is not ready — it stays in Canva/design review, not in front of a customer.
