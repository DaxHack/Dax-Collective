# Personal Photo Intake Pipeline (Pipeline A detail)

Detailed rules for handling personal/travel photos once they're sitting in `Dax Intake/...` — this is the only part of the system that ever automates inspection of your photos, and only inside these specific folders.

---

## Source boundary (read first)

Google Photos is never scanned, synced, or pulled from by automation, in any form — not via album link, not via share link, not via API. The only way a photo enters this pipeline is you manually copying it into one of the `Dax Intake/...` folders below. This is a hard boundary, not a configurable setting.

---

## Folders to create manually in Google Drive

```
Dax Intake/
├── Travel/
│   ├── hero/
│   ├── gallery/
│   ├── thumbnail/
│   └── mobile_crop/
├── Faith/
│   ├── hero/
│   ├── gallery/
│   ├── banner/
│   └── merch_graphic/
├── Dax Collective Services/
│   ├── hero/
│   ├── gallery/
│   └── logo_banner/
├── Merch Concepts/
│   ├── gods-vessel/
│   ├── dax-traveler/
│   ├── timezone-travelers/
│   └── dax-collective/
├── Licensed Stock and Editorial/
├── Original and AI Assets/
│   ├── logos/
│   ├── ai-generated/
│   └── design-source-files/
└── Client UGC Assets/
    ├── pending-permission/
    └── permission-confirmed/
```

No `Rejected` folder, and no `Ani-Dax` folder — rejected files stay where they are (see below), and anime imagery never enters this structure at all (it's registry-only, see `anime-image-registry/`).

`Needs Human Review` is a registry status, not a folder — a flagged file stays in its normal intake subfolder; only its `ASSET_REGISTRY.md` row changes.

---

## Auto-sort rules (apply only to files already inside `Dax Intake/**`)

| Rule | Behavior |
|---|---|
| Folder as signal | The specific intake subfolder a file is placed in is the primary brand/category signal — not content-guessing |
| Confidence | Files are logged into `ASSET_REGISTRY.md` with `pipeline_stage: incoming_review` by default |
| Duplicate detection | Exact duplicate-hash matches may be flagged automatically — see hard-rejection rules below |
| Nothing skips review | Auto-sort only ever decides which registry row/folder a file is associated with — never whether it's approved |

---

## Hard rejection rules (current policy — narrow on purpose)

Per explicit instruction, **automatic rejection is limited to exactly two cases:**

1. **Clear duplicate-hash match** against an already-registered asset
2. **Clear technical blur/unusable quality** below a basic, obvious threshold

Everything else — even strong suspicion — must route to `needs_human_review`, never auto-rejected or deleted:

- Possible visible ID, passport, driver's license, or boarding pass
- Possible visible receipt, invoice, or payment card
- Possible visible home address or mailing label
- Possible visible ticket with a barcode/QR code
- Anything that looks sensitive/private in nature
- Anything where permission/consent for people in frame is unclear (identifiable strangers, etc.)

This is intentional: automated content-detection for sensitive material is not yet reliable enough to trust with auto-rejection or deletion. A human (you) makes the actual call on anything beyond the two narrow auto-reject cases.

---

## What happens to a rejected or flagged file

- **It is never moved.** It stays exactly where you placed it in `Dax Intake/...`.
- **It is never deleted by automation.** If you want it gone, you delete it yourself.
- **The registry logs the reason** (`rejection_reason` for true auto-rejects, or a note for `needs_human_review` items) and an `original_location_note` confirming where it still sits.
- You can override any automatic classification at any time during your batch review.

---

## What's safe to automate now vs. later

| Capability | Status |
|---|---|
| Reading files already placed in `Dax Intake/**` | Safe now |
| Using intake subfolder as brand/category signal | Safe now |
| Exact duplicate-hash detection | Safe now (flag for review even when auto-rejecting, so you can verify) |
| Clear technical blur detection | Safe now, using a conservative/obvious threshold |
| ID/receipt/ticket/address/sensitive-content detection | **Wait** — flag-for-review only once a method is chosen and tested; never auto-reject/delete based on this |
| Copying approved files to Firebase Storage | Always manual-trigger, even later |
| Any access to Google Photos directly | Never |
