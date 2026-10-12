# Website Modernization Roadmap

Goal: bring the brand pages up to the current modern Dax Collective visual standard without breaking the existing React app.

## Current Assumption

The current homepage and the updated Time-Zone Travelers page are the reference direction: dark base, strong brand-specific gradients, real brand media, clear CTA sections, and reusable gallery/content sections.

## Pages to Modernize

- `dax-main/src/pages/DaxTheTravelerPage.jsx`
- `dax-main/src/pages/AniDaxPage.jsx`
- `dax-main/src/pages/GodsVesselPage.jsx`
- `dax-main/src/pages/Dashboard.jsx`

Keep `DaxTheInvestorPage.jsx` private/internal unless you explicitly decide to make it public.

## Modernization Requirements

Each public brand page should include:

- first-viewport brand signal with real brand asset
- modern hero with concise value proposition
- platform/content CTA
- video/posts/itinerary/merch/design sections depending on the brand
- BrandGallery using local brand assets
- no placeholder API images
- no dead buttons
- responsive layout
- clear page metadata

## Brand-Specific Sections

Dax the Traveler:

- travel videos
- budget breakdowns
- itineraries
- affiliate gear guides

Time-Zone Travelers:

- travel hacks
- quick itineraries
- packing lists
- challenge/community content

Ani-Dax:

- anime analysis
- seasonal reviews
- character breakdowns
- original/approved art notes

God's Vessel:

- faith videos
- scripture posts
- testimony/community content
- merch/sticker/apparel sections

The Dax Collective:

- parent hub
- cross-brand highlights
- launch updates
- community/founder notes

## Implementation Order

1. Create a reusable modern brand page section pattern.
2. Modernize Dax the Traveler.
3. Modernize God's Vessel.
4. Modernize Ani-Dax.
5. Review Dashboard separately as an internal tool, not a marketing page.

## QA

Before finishing page updates:

- run frontend build or tests if available
- check desktop and mobile viewport
- verify text does not overlap
- verify all buttons either navigate or are clearly disabled
- verify no secrets are exposed
