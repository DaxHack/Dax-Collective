# Approved Media — Shared

This folder stores approved assets that are shared across multiple brands or belong to the broader **Dax Collective** umbrella.

## What belongs here

- Dax Collective brand assets (logos, wordmarks, brand photography)
- Behind-the-scenes content that spans multiple brands
- Creator/host photos used across brands (headshots, lifestyle shots)
- Equipment and studio setup photography used on multiple channels

## Naming convention

```
[brand-context]-[asset-type]-[short-description].[ext]
```

Examples:
- `dax-collective-headshot-studio-2024.jpg`
- `shared-gear-camera-bag-open.jpg`
- `shared-setup-recording-desk.jpg`

## Privacy rules

- Assets must be set to `usageStatus: "Approved"` and `privacyStatus: "Public Safe"` in `approvedMedia.js`
- When referencing a shared asset in brand-specific data records, set `brand: "shared"` in the data file
- Creator photos require explicit self-approval — no third-party shots without consent on file

## Notes

Shared assets can be referenced from any brand's `ApprovedMediaGallery` component by tagging the record with `brand: "shared"` and including the appropriate `relatedSeries` tag.
