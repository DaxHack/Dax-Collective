# Weekly Batch Review Template

A copy-paste template for your weekly review pass over pending assets across all registries. Matches your existing weekly-batch-review cadence — no new review habit required.

---

## How to use this

1. Copy the template below into a new dated section (or just review in place — your choice).
2. Pull rows from each registry where status is pending review.
3. For each line, make one decision: approve, reject, or defer to next batch.
4. Update the corresponding registry row immediately after deciding — don't batch the registry updates for later.

---

## Template

```
## Batch Review — [DATE]

### Personal Photos — Incoming Review (from ASSET_REGISTRY.md)

#### Dax the Traveler
- [ ] dt-### — [description] — intake folder: [folder] — [ ] approve  [ ] reject  [ ] defer

#### Time-Zone Travelers
- [ ] tzt-### — [description] — intake folder: [folder] — [ ] approve  [ ] reject  [ ] defer

#### God's Vessel
- [ ] gv-### — [description] — intake folder: [folder] — [ ] approve  [ ] reject  [ ] defer

#### Dax Collective
- [ ] dc-### — [description] — intake folder: [folder] — [ ] approve  [ ] reject  [ ] defer

### Needs Human Review (flagged, any brand)
- [ ] [id] — [description] — flagged reason: [e.g. "possible address visible"] — [ ] approve  [ ] reject  [ ] defer

### Ani-Dax — Draft Suggestions (from anime-image-registry/draft-suggestions/[season].md)
- [ ] ad-### — [title] — source: [AniList/press] — rights_risk: [low/medium/high] — proposed allowed_use: editorial_reference_only (default) — [ ] approve as editorial-only  [ ] approve with different specific use: ____  [ ] reject  [ ] defer

### Client / UGC Pending Permission (from CLIENT_UGC_REGISTRY.md)
- [ ] ugc-### — [client name] — permission_status: [pending/granted] — [ ] confirm granted  [ ] still pending  [ ] reject

### Original / AI Assets — Needs Review (from ORIGINAL_AI_ASSET_REGISTRY.md)
- [ ] [id] — [description] — [ ] approve for public  [ ] needs more work  [ ] reject

---

### Batch summary
- Total reviewed: ___
- Approved (moving to Storage upload): ___
- Rejected: ___
- Deferred to next batch: ___
- Batch ID for approved items: [e.g. 2026-07-batch-1]
```

---

## Reminders

- Approving here does not upload anything by itself — it sets `pipeline_stage`/`approval_status` to the approved state in the registry. The actual Firebase Storage upload is a separate, deliberate step you (or I, with your direct go-ahead) perform afterward.
- For Ani-Dax specifically: approving a draft suggestion as "editorial-only" is the routine default. Approving any other specific use (hero, banner, thumbnail) is a separate, deliberate decision you should make consciously, not as a default checkbox.
- If a batch produces zero approvals, that's a completely fine outcome — there's no requirement to approve something every cycle.
