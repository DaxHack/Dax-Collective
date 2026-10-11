# Dax Collective — immersive V2 local review

## Version boundary

The redesign is a separate local experience, not a replacement for the working site.

- V2 gateway: `/experiments/dax-universe`
- Traveler: `/experiments/dax-universe/traveler`
- God's Vessel: `/experiments/dax-universe/gods-vessel`
- Ani-Dax: `/experiments/dax-universe/ani-dax`
- Time-Zone Travelers: `/experiments/dax-universe/timezone-travelers`
- Earlier accurate Traveler preview: `/experiments/dax-the-traveler-v2`
- V1 homepage and its canonical brand routes remain available.

No publishing, remote syncing, or Git/GitHub work is part of this iteration.

## Preserved versions

The immutable snapshot labeled **Dax Site V1 - Current Working Version** remains in
`backups/dax-site-v1-current-working-version-2026-10-01/`, with a full ZIP and three
downloadable ZIP parts. The earlier pre-immersive snapshot remains untouched.

A second pre-universe workspace snapshot, including the previous Traveler V2,
is in `backups/dax-universe-before-redesign-2026-10-01/`. Its
`RESTORE-INSTRUCTIONS.md` explains restoration. `SHA256SUMS` verifies its contents.
Restore by copying from a snapshot into working files, never by modifying a saved
snapshot. No credentials, dependencies, or build output are included.

## Design and implementation sequence

1. Shared V2 navigation and the Collective gateway.
2. Traveler's personal, photo-led journey and accurate chronology.
3. God's Vessel's warm archival product presentation.
4. Ani-Dax's kinetic theory environment.
5. Time-Zone Travelers' scene- and time-led discovery.

The five worlds share version-aware navigation, responsive behavior, and motion
safeguards, while retaining distinct visual identities.

## Media and truth boundaries

Daniel's seven reviewed personal photographs are the personal media source.
Three have Cuba/Havana location support; the remaining portraits have unverified
locations. Filenames are not proof of capture dates or locations. Original files
are not modified.

The travel chronology is first-person supplied information, not independently
verified flight records. Confirmed facts, approximate details, and unknowns stay
separate. Unknown never means that a visit did not happen.

Time-Zone scenes are destination/brand imagery and conceptual discovery, not
claims about Daniel's own journeys or published guides. Ani-Dax working premises
are unpublished. Its V2 imagery consists of original, no-character SVG concept
diagrams, not source footage or photographs of a research workspace.
Product artwork and mockups are not a multi-angle 3D scan, live
inventory, or proof of checkout availability.

Use the existing asset intake instructions in `DAX-TRAVEL-ASSET-INTAKE.md` for
additional real photography. Replace conceptual media only after its location,
rights, and context are known.

## Real motion versus conceptual content

Scroll-linked transforms, sticky sections, layered reveals, interactive
selectors, and pointer depth are implemented browser effects, not videos of an
interface. Reduced-motion users receive static or restrained alternatives.

Depth effects do not imply a WebGL renderer or true 3D garment model. Ambient
graphics are decorative. Conceptual destinations and unpublished editorial
premises are labeled in the relevant worlds.

Existing product, blog, legal, contact, and signup destinations remain separate
canonical flows. Links that leave the experimental experience should make that
boundary clear. No nonfunctional purchase, guide, or itinerary buttons should be
used as decoration.

## Verification and remaining boundaries

- The preserved snapshot's checksum manifest is intact. Existing frontend files
  and media match it; only the intentional outer routing change affects a
  pre-existing frontend file.
- V2 JSX lint passes. The optimized build completed with pre-existing project
  warnings; the running preview compiles successfully.
- Browser checks covered the gateway's pinned world progression and jumps,
  Traveler's photo sequence and nested-dialog focus/scroll restoration,
  Vessel's four product selections, Ani's reading/method controls, and
  Time-Zone's automatic scene progression, direct selection, and live clocks.
- Responsive checks covered 320, 360, 390, 768, and 1440px layouts. The compact
  320px header fits without hiding overflow. Reduced-motion controls and the
  V1 exit/browser-back comparison path were checked.
- Leftward Time-Zone touch navigation was checked. Reverse-swipe automation
  triggered the browser's history gesture, so that direction was not verified
  by the browser harness.
- The existing scripture feed currently reports an unavailable/error state;
  its connection was not repaired or replaced in this local visual iteration.
- No signup, purchase, authentication, publishing, or cloud-sync operation was
  performed during verification.