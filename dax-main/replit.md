# Dax Collective — Project Reference

## Overview
Multi-brand React (CRA) content platform running on port 5000. Four public-facing brands plus private investor routes. Static/seed data only — no live API connections except legacy Firebase on AniDax (pre-existing, broken API key; do not touch).

## Stack
- **Framework:** React (Create React App)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Routing:** react-router-dom v6
- **SEO:** react-helmet-async
- **Icons:** @heroicons/react
- **Port:** 5000

## Brand Design Tokens
| Brand | Accent | Background |
|---|---|---|
| Dax the Traveler | `text-cyan-400`, `bg-cyan-500` | `bg-gray-950` dark |
| Timezone Travelers | orange / pink gradient | dark red-brown |
| Ani-Dax | purple / pink / blue | `bg-gradient purple→blue→indigo` |
| God's Vessel | `#B8956A` gold, `#8B6F3D` dark gold | `#F5F1E8` cream, `#EFEAD9` |

**BANNED terms for Dax the Traveler:** Journey Logs, Roam Notes, Field Notes, Travel Blips, Time Blips, Route Recaps, Vlog Trails, "blips" (standalone)
**BANNED terms for Timezone Travelers:** "blips" for any section name

## Route Map
| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | |
| `/dax-the-traveler` | `DaxTheTravelerPage` | |
| `/ani-dax` | `AniDaxPage` | |
| `/timezone-travelers` | `TimeZoneTravelersPage` | |
| `/gods-vessel` | `GodsVesselPage` | Cream palette — do NOT force dark mode |
| `/blog` | `BlogPage` | Filterable by brand + category |
| `/blog/:slug` | `BlogPostPage` | Dynamic slug routing |
| `/about` | `AboutPage` | |
| `/brands` | `BrandsPage` | |
| `/resources` | `ResourcesPage` | Affiliate disclosure notice included |
| `/contact` | `ContactPage` | |
| `/privacy` | `PrivacyPage` | |
| `/disclosure` | `DisclosurePage` | |
| `/terms` | → `DisclosurePage` | Alias |
| `/automation` | `Dashboard` | |
| `/dax-the-investor` + aliases | `DaxTheInvestorPage` | Private; no Navbar/Footer |

## Content Data
- **Blog seed data:** `src/data/blogData.js` — 12 posts, 4 brands, all categories, full metadata
- **Blog categories:** From the Vlog, Wanderlost with Dax, Quick Blips, Quick Jumps, Zone Guides, Travel Dispatches, Time-Zone Tips, Anime Files, AniDax Pulse, Character Files, Names of God: The Dictionary Series, Archive Notes

## Admin Studio — Automation Dashboard Tabs
All tabs at `/automation`. No auth required except Overview, Photo Search, Upload, Settings.

| Tab | Component | localStorage Key | Notes |
|---|---|---|---|
| Overview | inline | — | Firebase auth required |
| Content Ideas | `ContentIdeas.jsx` | — | |
| Content Packages | `ContentPackages.jsx` | — | |
| AI Departments | `AIDepartmentCenter.jsx` | `dax_ai_departments` | 8 seed departments, CRUD, markdown export |
| Asset Review | `AssetReview.jsx` | `dax_asset_review` | 16 seed records, 4 brands, visual decision field |
| Media Intake | `MediaIntake.jsx` | `dax_media_intake` | 10 seed records (Dax the Traveler), Facebook panel |
| Photo Search | inline | — | Firebase auth required |
| Upload | `ImageUpload.jsx` | — | Firebase auth required |
| Settings | inline | — | Firebase auth required |

### Media Intake — Key Rules
- **No Facebook API connection is active.** All assets are manually entered.
- The Facebook Connection Setup panel is an informational placeholder (collapsible).
- Assets must be set to `usageStatus: "Approved"` before they appear on the public site.
- `DaxTheTravelerPage` has an `ApprovedMediaSection` that reads `dax_media_intake` from localStorage and shows Approved + Dax the Traveler assets. Section is hidden when empty.
- `blogData.js` exports `getApprovedMediaAssets()`, `getMediaAssetById(id)`, `getApprovedMediaForBrand(brand)` — helper functions for future blog post media linking. Blog posts can add an optional `mediaAssetId` field; assets are NEVER auto-selected.

## Key Files
```
src/
  App.jsx                          — all routes, AuthProvider wrapper
  components/
    Navbar.jsx
    Footer.jsx                     — Brands + Explore + legal columns
    BrandGallery.jsx
    CommentsSection.jsx
  contexts/AuthContext.jsx
  data/blogData.js                 — seed posts + helpers incl. getApprovedMediaAssets()
  pages/
    Home.jsx
    DaxTheTravelerPage.jsx         — Quick Blips/Jumps/Side Quests + ApprovedMediaSection
    AniDaxPage.jsx                 — Theory Board, Lore Check, Watch Queue, Power Scale + copyright
    TimeZoneTravelersPage.jsx      — Itinerary Builder added
    GodsVesselPage.jsx             — Scripture Threads + Archive Notes added
    AboutPage.jsx
    BrandsPage.jsx
    BlogPage.jsx
    BlogPostPage.jsx
    ResourcesPage.jsx
    DisclosurePage.jsx
    PrivacyPage.jsx
    ContactPage.jsx
    NotFoundPage.jsx
    Dashboard.jsx
    DaxTheInvestorPage.jsx         — private investor page
  automation/
    AutomationDashboard.jsx        — tab shell for all Admin Studio tabs
    AIDepartmentCenter.jsx         — AI Department Command Center (8 departments)
    AssetReview.jsx                — Asset Review & Brand Materials (16 seed assets)
    MediaIntake.jsx                — Media Intake & Approved Assets (10 seed, FB panel)
    ContentIdeas.jsx
    ContentPackages.jsx
    ImageUpload.jsx
public/
  robots.txt                       — blocks /dax-the-investor + aliases
  sitemap.xml                      — 26 URLs
  assets/canva/{brand}/            — placeholder folders for Canva exports
```

## Important Rules
- **Do NOT redesign God's Vessel.** It uses cream palette (`#F5F1E8`). User has not approved dark mode conversion.
- **Do NOT touch Firebase config or AniDax auth.** The `auth/api-key-not-valid` error is pre-existing.
- **Do NOT delete private investor routes** or change their paths/credentials.
- **Do NOT change `App.jsx` route structure** without explicit user approval.
- God's Vessel font: Cormorant Garamond loaded from Google Fonts in `<Helmet>`.
- All new pages follow `bg-black`/`bg-gray-900`, white text, blue/purple accents design system.

## SEO
- `public/robots.txt` — blocks all private investor paths
- `public/sitemap.xml` — 26 URLs, all public routes + 12 blog posts
- Each page has `<Helmet>` with title + meta description

## Pending / Future Work
- Wire waitlist/newsletter forms to a real provider (currently fake submit)
- Replace all `TODO: replace with real image` placeholders once assets are uploaded to `public/images/`
- Canva asset integration via `public/assets/canva/` — see `canva-manifest.json`
- God's Vessel: decision on dark vs cream palette still open (user stated preference for "moody dark" but no formal approval)
- AniDax Firebase: needs valid API key to re-enable comments and anonymous auth
