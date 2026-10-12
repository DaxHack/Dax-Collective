# How to Open `gods-vessel-phase-one-master-sheet.csv` in Google Sheets

**Date:** 2026-06-30
**For:** `planning/operations/gods-vessel-phase-one-master-sheet.csv` (36 columns, 6 rows)
**No Excel required** — these steps use Google Sheets only.

## Option A — Import into a new or existing Google Sheet (recommended)

1. Go to [sheets.google.com](https://sheets.google.com) and either open a blank sheet or open the Google Sheet you want this data to live in.
2. In the menu bar, click **File → Import**.
3. Click the **Upload** tab, then **Browse**, and select `gods-vessel-phase-one-master-sheet.csv` from wherever you saved/synced the `planning/operations/` folder on your computer.
4. In the import dialog:
   - **Import location:** choose "Insert new sheet" (safest — keeps this data on its own tab) or "Replace current sheet" if you're starting fresh.
   - **Separator type:** leave on "Detect automatically" (it's a standard comma-separated file).
   - **Convert text to numbers, dates, and formulas:** leave unchecked, since most fields here are intentionally text/status labels, not numbers.
5. Click **Import data**.
6. You should see one tab with 36 columns and 6 rows (Adonai, El Shaddai, Grace, Hope, Faith, Peace), all marked "Draft / Pending Your Review" in the Approval Status column.

## Option B — Just open the file directly

1. Go to [sheets.google.com](https://sheets.google.com).
2. Click **File → Open → Upload**, then select the CSV file.
3. Google Sheets will open it as a new spreadsheet automatically — you can rename the file from "gods-vessel-phase-one-master-sheet" to whatever title you prefer once it's open.

## After importing — recommended first cleanup steps

- **Freeze the header row:** select row 1, then **View → Freeze → 1 row**, so column headers stay visible as you scroll.
- **Widen long-text columns:** columns like "Long Description Draft," "Study Card Copy Draft," and "Claims Not Yet Confirmed" have long text — select those columns and use **Format → Wrap → Wrap text** so they're readable without truncation.
- **Color-code Approval Status (optional):** since every row currently reads "Draft / Pending Your Review," you may want conditional formatting later so approved rows visually stand out once you start reviewing.
- **Don't reorder columns yet:** the column order matches `gods-vessel-phase-one-data-dictionary.md` exactly — if you reorder columns, update that file too so the two stay in sync.

## What this file is not

This CSV is a planning artifact only. Importing it into Google Sheets does not connect to Shopify, Printify, or any other service, and does not create, publish, or order anything. It's the working sheet you'll review and edit before any of that happens.
