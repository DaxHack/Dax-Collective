# The Dax Collective — Logo Asset System
**Status:** Planning Document | **Created:** 2026-05-26 | **Session:** 2
**Source docs:** brand-platform-blueprint.md · account-setup-checklist.md
**Supersedes:** canva-dc-monogram-brief.md (monogram direction — see note below)

---

## VERDICT

The official Dax Collective parent logo is the existing geometric lion/guardian-style crest mark in Canva — **not** a DC text monogram. The monogram was a planning placeholder. The lion mark carries far more brand authority: it reads as a creative label or collective, not just a creator channel. This document defines how to finalize, version, and deploy that mark across all platforms, plus the logo system for all four sub-brands.

> **Note on canva-dc-monogram-brief.md:** That file remains in the repo for reference on the dark-background color system, orb/glassmorphism technique, and export specs — all of which still apply. Only the "DC text monogram" direction is rejected. The background treatment, color codes, and platform image specs in that file are valid and should be used when building banner layouts.

---

## OFFICIAL DAX COLLECTIVE LOGO DIRECTION

**Mark style:** Angular geometric lion/guardian crest — heraldic-inspired, built from straight geometric facets (not rounded or painterly). Feels like a premium label, creative house, or collective. Not a mascot. Not a gaming logo.

**Wordmark:** "DAX COLLECTIVE" set in clean, wide-tracked caps beneath the crest mark. One or two-line layout depending on context.

**Primary version:** Dark background (`#0A0A0F`) with the crest mark rendered in blue-to-gold OR blue-to-purple gradient. This is the default for all platforms.

**The mark communicates:** Authority, craft, collective identity. This is the mark of a brand house — something that has multiple arms under it. A lion/guardian is appropriate because The Dax Collective contains and protects five distinct brands.

---

## WHY THE DC MONOGRAM WAS REJECTED

| Reason | Detail |
|--------|--------|
| Existing asset supersedes it | The geometric lion mark already exists in Canva and has a stronger identity |
| Monograms lack distinctiveness | "DC" initials are used by hundreds of creators and brands — no differentiation |
| Wrong brand tier feel | A simple text monogram reads as personal brand; the lion reads as a label/collective |
| Less memorable at scale | The geometric mark has a shape that can be recognized even at small sizes once it's familiar |
| Missed the brand voice | "Bold, visionary, community-first, curator not just creator" — the lion earns that; initials don't |

The DC monogram could still serve as a fallback handle identifier or watermark in future, but it is **not** the primary brand mark.

---

## LOGO COLORWAY SYSTEM

The geometric lion/guardian crest mark is fixed. The mark shape, proportions, and structure never change between versions. What changes is the **colorway** — the gradient applied to the mark, the background, and the wordmark treatment. This separation of mark from colorway means the brand stays consistent while adapting to different contexts and surfaces.

**The rule:** One mark. Many colorways. Never mix colorways in a single export (e.g., no blue mark on an orange background). Never alter the mark shape to match a colorway.

| # | Colorway | Mark Gradient | Background | Wordmark | Primary Use |
|---|----------|--------------|------------|---------|-------------|
| 1 | **Blue/Purple Digital** | `#60A5FA` → `#A78BFA` → `#F472B6` | `#0A0A0F` | White | **Default — all digital platforms, website, social banners** |
| 2 | **Blue/Gold Premium** | Deep blue `#1D4ED8` → gold `#F59E0B` → amber `#D97706` | `#0A0A0F` | White or gold | Merch, apparel tags, print, premium drops |
| 3 | **Red/Orange Energy** | Deep red `#DC2626` → orange `#F97316` → amber `#D97706` | `#0A0A0F` | White | Stories, launch announcements, hype content |
| 4 | **Black/White Minimal** | Flat white `#F8FAFC` (no gradient) | `#0A0A0F` or transparent | White | Embroidery, 1-color print, watermarks, overlays |
| 5 | **White/Light Background** | Dark charcoal `#1A1A2E` or deep blue `#1E3A5F` | White `#F8F8FF` | Dark `#1A1A2E` | Press kits, email headers, collab decks, light-mode contexts |

**Export priority order:** Blue/Purple Digital textless icon first (unblocks account setup) → Blue/Purple full logo → Blue/Gold → Red/Orange → Black/White → Light Background.

---

## MINOR EDITS TO MAKE

Before exporting any version, address these refinements in Canva:

### 1. Center/bottom symbol (plus cross mark)
- **Issue:** There appears to be a small symbol at the center/bottom of the crest — likely looks accidental if not intentional
- **Decision needed:** Either make it a deliberate, clearly-designed element OR remove it entirely
- **Recommendation:** If it reads as a cross for decorative purposes, give it clean, intentional geometry and consistent stroke weight. If it's a construction artifact, delete it.
- **Action:** Zoom to 400% in Canva and assess the symbol. If edges look unclean or misaligned with the rest of the mark, remove it.

### 2. Spacing between mark and wordmark
- **Issue:** The gap between the bottom of the crest mark and the top of "DAX COLLECTIVE" text should feel balanced — not too tight (crowded) or too loose (disconnected)
- **Target:** Spacing between mark baseline and wordmark cap-height should be approximately equal to the cap-height of the wordmark text
- **Action:** Select both elements → check vertical gap → adjust to ~1× the text height

### 3. Wordmark tracking/font weight
- **Issue:** "DAX COLLECTIVE" should feel premium — wide letter spacing, medium or semibold weight
- **Target:** Letter tracking of +150 to +250, font in the Montserrat or Space Grotesk family
- **Action:** Select text → Spacing → Letter spacing → increase to 150–250

### 4. Circular crop safety check
- **Issue:** The crest mark has a tall vertical shape — when cropped to circle (Instagram, TikTok, YouTube), the top and sides may get cut
- **Action:** In Canva, overlay a circle shape on your 1000x1000px canvas and verify the mark sits fully inside it. If not, scale down the mark until it's within the circle's inner 75%.

### 5. Gradient consistency
- **Issue:** Confirm the gradient on the lion mark uses the locked brand hex codes, not Canva's auto-generated approximations
- **Target hex codes:** `#60A5FA` (blue) → `#A78BFA` (purple) → `#F472B6` (pink) for digital version
- **Action:** Click the mark element → Fill → Gradient → manually type in the hex codes

---

## EXPORT FILE LIST

Export all files as PNG from Canva. Name them exactly as listed below for easy organization.

### The Dax Collective — Parent Logo Files

| File Name | Canvas Size | Colorway | Priority |
|-----------|------------|---------|----------|
| `TDC-icon-blue-purple-1000px.png` | 1000 x 1000 px | Blue/Purple Digital — textless icon | **FIRST** |
| `TDC-logo-blue-purple.png` | 1000 x 500 px | Blue/Purple Digital — full logo | High |
| `TDC-logo-blue-gold.png` | 1000 x 500 px | Blue/Gold Premium — full logo | High |
| `TDC-logo-red-orange.png` | 1000 x 500 px | Red/Orange Energy — full logo | Medium |
| `TDC-logo-black-white.png` | 1000 x 500 px | Black/White Minimal — full logo | Medium |
| `TDC-logo-light-bg.png` | 1000 x 500 px | White/Light Background — full logo | Medium |
| `TDC-youtube-banner.png` | 2560 x 1440 px | Blue/Purple Digital — banner | High |
| `TDC-facebook-cover.png` | 820 x 312 px | Blue/Purple Digital — cover | High |

### Transparent PNG versions (for overlays and future use)

| File Name | Notes |
|-----------|-------|
| `TDC-icon-transparent.png` | Mark only, NO background |
| `TDC-logo-transparent.png` | Mark + wordmark, NO background |

> To export transparent in Canva: File → Download → PNG → check "Transparent background" → ensure background rectangle is deleted or hidden before export.

---

## PLATFORM USAGE RULES

| Platform | Version to use | File |
|----------|---------------|------|
| YouTube profile image | Blue/Purple Digital — textless icon | `TDC-icon-blue-purple-1000px.png` |
| YouTube banner | Blue/Purple Digital — full logo + tagline | `TDC-youtube-banner.png` |
| Instagram profile | Blue/Purple Digital — textless icon | `TDC-icon-blue-purple-1000px.png` |
| TikTok profile | Blue/Purple Digital — textless icon | `TDC-icon-blue-purple-1000px.png` |
| Facebook profile (Page) | Blue/Purple Digital — textless icon | `TDC-icon-blue-purple-1000px.png` |
| Facebook cover | Blue/Purple Digital — full logo + tagline | `TDC-facebook-cover.png` |
| Website (if updated) | Blue/Purple Digital — transparent | `TDC-logo-transparent.png` |
| Merch, apparel, print | Blue/Gold Premium | `TDC-logo-blue-gold.png` |
| Stories, launch posts, hype content | Red/Orange Energy | `TDC-logo-red-orange.png` |
| Embroidery, 1-color print, overlays | Black/White Minimal | `TDC-logo-black-white.png` |
| Press kits, email headers, collab decks | White/Light Background | `TDC-logo-light-bg.png` |

**Universal rule:** Never use the full wordmark logo (mark + text) as a profile image. The text becomes unreadable at 32–64px. Always use the textless icon version for profile images.

---

## SUB-BRAND LOGO SYSTEM

Each sub-brand logo must:
- Have a **distinct silhouette** from the parent lion mark — cover the wordmark and the mark alone should tell you which brand it is
- Use its own locked color palette; never borrow the parent's gradient directly
- Have a textless icon version AND a full logo version (mark + wordmark)
- Read clearly at 64px — if it loses meaning at that size, it needs to be simplified
- Be created after the parent brand is finalized

### Sub-brand logo directions

**1. Dax the Traveler**
- Mark concept: A stylized coordinate crosshair or meridian intersection — the mark represents a specific point on the map, not "travel" in general. Not a globe. Not a plane. Not a generic compass rose.
- Style: Angular faceted quality like the parent, but warmer and more personal — this is one person's perspective, not a tourism board
- Colors: Deep navy `#1E3A5F` → slate blue `#3B82F6` → off-white
- Wordmark: "DAX THE TRAVELER" in wide-tracked caps
- Priority: HIGH — Phase 1 account setup; evaluate `dax_the_traveler_logo.png` against this direction first
- Status: Existing logo file may need refinement to match the system

**2. Natsuki-Dax / Natsuki-Daniel**
- Mark concept: An abstract geometric mask or visor form — angular facets, asymmetric but balanced. Reads as a guardian or observer. Not a character, not fan art, not a katana or cherry blossom.
- Style: Angular like the parent system but with sharper, more dynamic angles and more compressed proportions — high energy, not regal
- Colors: Deep purple `#6D28D9` → electric violet `#8B5CF6` → pink `#EC4899`
- Wordmark: "NATSUKI-DAX" or "NATSUKI DANIEL" — final brand name to be confirmed
- Priority: HIGH — create before Phase 2 account setup
- Status: Needs to be created; the mask/visor form is the biggest differentiator in the anime content space

**3. God's Vessel — Two Style Lanes**

This brand operates in two distinct visual contexts that require separate logo treatments. Both use the same brand name but communicate to different audiences.

**Lane 1 — Official Label / Tag Style:**
- Intent: The "brand house" version — used on the YouTube channel, official bios, press, and label-level collabs
- Mark concept: A single refined vessel or amphora silhouette OR a cross reduced to its most essential geometry — ultra-minimal, symmetric, deliberate
- Style: Premium sacred creative house. Think: Off-White meets devotional. Highsnobiety meets faith. Clean negative space, nothing accidental.
- Colors: Deep indigo `#312E81` → purple `#7C3AED` → soft white/gold accent highlight
- Wordmark: "GOD'S VESSEL" in elegant wide-tracked caps — optionally a hybrid serif/sans that reads luxurious
- Background: Dark or transparent only
- Feel: Something you'd see in a creative agency's brand book for a faith label

**Lane 2 — Urban Faith Streetwear / Merch Style:**
- Intent: The wearable version — goes on hoodies, tees, embroidery patches, hang tags, and sticker drops
- Mark concept: Typography-driven rather than icon-driven. "GOD'S" stacked above "VESSEL" in heavy condensed caps. Optional: thin cross element between words, or a small deliberate accent mark.
- Style: Archive urban faith. Corteiz, Rhude, Eric Emanuel energy applied to faith messaging. Bold, stencil-quality, no gradients, no glow.
- Colors: Black background + white text — or all-black with texture — or black ink on cream
- Wordmark IS the mark: The type treatment itself is the brand expression here
- Feel: Screen-printed on a heavyweight 400gsm hoodie, sold for $80. The hang tag you want to keep.
- Priority: HIGH — merch direction needs both lanes before any apparel drops

**4. Time-Zone Travelers**
- Mark concept: Two intersecting arcs representing timezone lines — rendered as clean angular vectors, not a cartographic illustration. The intersection point is the focal element. Not a clock with hands. Not a globe with latitude lines.
- Style: Bolder and more accessible than the parent system — this is a community/challenge brand, energy should feel active and open
- Colors: Deep orange `#EA580C` → red `#DC2626`
- Wordmark: "TIME-ZONE TRAVELERS" — can be abbreviated to "TZT" in icon and merch contexts
- Priority: MEDIUM — create before Phase 3 account setup
- Status: Needs to be created from scratch — most original design work of all sub-brands

---

## AVOID AI SLOP RULES

These rules apply any time you generate mark concepts using AI tools (ChatGPT image, DALL-E, Canva Magic Design, Midjourney) or build manually in Canva. A result that breaks any of these rules should be discarded and regenerated.

1. **No generic globe icons.** A globe means nothing as a brand mark. If travel is the concept, the mark must be more specific — a route, a coordinate point, a horizon. Something with a point of view.
2. **No random clipart.** If it looks like something from a stock icon pack, it's wrong. The mark must feel designed for this specific brand, not pulled from a library.
3. **No overused neon cyberpunk aesthetics.** Purple + neon + glow does not equal premium. Neon is a texture, not an identity. Use it intentionally or not at all.
4. **No fake 3D plastic logo effects** unless specifically requested for a specific surface. No bevel, no emboss, no specular highlight on letterforms.
5. **No cluttered mark detail.** If an element disappears at 64px, it doesn't belong in the mark. Complexity lives in pattern or texture layers — not the core icon.
6. **No copying the parent lion mark silhouette.** Sub-brand marks must have their own shape. If you cover the wordmark and can't identify which brand the mark belongs to, it failed.
7. **No gradient circle with text.** A circle filled with gradient is not a logo. Every shape in the mark must mean something.
8. **No overloaded lockups.** One mark. One wordmark. No taglines, no sub-text, no badges, no decorative borders squeezed into the logo file. Those elements belong in layout — not in the logo asset itself.
9. **No AI-rendered wordmarks inside generated images.** Image AI tools hallucinate text. Generate the mark shape only — set all wordmarks manually in Canva afterward.
10. **No derivative brand copies.** If the output looks like it belongs to a known existing brand, start over. The Dax Collective mark system must be original and ownable.

---

## CANVA REFINEMENT PROMPTS

Use these prompts in **ChatGPT image tool** (DALL-E) to generate mark concept references, then bring results into Canva to refine, apply exact hex codes, and set wordmarks. Do not attempt to generate production-ready logos directly from AI — use AI for concept direction only.

### Parent Brand — Lion Mark Gradient (Canva Magic Edit or ChatGPT image)

```
Geometric angular lion/guardian crest mark — same faceted structure as existing file.
Apply a smooth linear gradient left to right: deep royal blue (#1D4ED8) 
transitioning through gold (#F59E0B) to amber (#D97706).
Dark near-black background (#0A0A0F). No glow. No outer stroke. No drop shadow.
Every facet reads as a deliberate geometric plane — not a painting, not a photo.
The mark should feel like the official seal of a premium creative label.
Flat vector quality. Nothing soft or rounded.
```

### Dax the Traveler (ChatGPT image → refine in Canva)

```
Minimal geometric logo mark for a solo travel brand.
Not a globe. Not a plane silhouette. Not a compass rose clipart.
Concept: a stylized coordinate crosshair or meridian intersection — 
two precise lines meeting at a point, rendered as angular geometric vectors.
The mark represents a specific location, not "travel" in general.
Colors: deep navy (#1E3A5F) fading to slate blue (#3B82F6) to off-white at the center point.
Dark background. Single focal element — no border, no badge shape, no decorative ring.
The mark communicates: I have been somewhere specific. I know exactly what I saw.
Clean silhouette that reads at 64px.
```

### Time-Zone Travelers (ChatGPT image → refine in Canva)

```
Geometric logo mark for an interactive travel community brand.
Concept: two intersecting arcs representing timezone meridians — 
rendered as clean angular vectors, not a cartographic illustration.
The intersection point is bold and centered — that is the focal element.
Not a clock with hands. Not a globe with grid lines.
Colors: deep orange (#EA580C) transitioning to dark red (#DC2626). Dark background.
The mark communicates: we move across time and place together —
this is a collective, not a solo channel.
Bold enough to read as a distinct shape at 64px.
No text rendered in the image — wordmark will be set in Canva separately.
```

### Natsuki-Dax / Natsuki-Daniel (ChatGPT image → refine in Canva)

```
Geometric logo mark for an anime review and analysis brand.
Not fan art. Not a character illustration. Not a katana, cherry blossom, or torii gate.
Concept: an abstract geometric mask or visor form —
angular facets, asymmetric in structure but visually balanced overall.
Reads as a guardian or observer. Not a mascot — a presence.
Colors: deep purple (#6D28D9) to electric violet (#8B5CF6) fading to pink (#EC4899).
Dark background. Flat cel-shaded geometry — no painted or illustrated quality.
The silhouette must be distinctive and ownable: readable as a unique shape at 32px.
The mark communicates: I watch closely. I have opinions. I will defend every ranking.
No text rendered in the image.
```

### God's Vessel — Official Label / Tag Style (ChatGPT image → refine in Canva)

```
Minimal luxury logo mark for a premium faith lifestyle brand.
Concept: a single vessel or amphora silhouette — geometric, symmetric, refined.
Or alternatively: a cross reduced to its most essential geometry —
not a decorative cross, not a church cross — the absolute minimum form.
Think: the logo of a sacred creative house. Between a record label and a luxury apparel brand.
Colors: deep indigo (#312E81) to purple (#7C3AED) with a single white or pale gold accent highlight.
Dark background. Ultra-clean negative space — every empty area is intentional.
The mark communicates: this is serious, built with intention, and made to last.
No text in the image. Wordmark "GOD'S VESSEL" will be set in Canva separately.
```

### God's Vessel — Urban Faith Streetwear / Merch Style (Canva only — manual build)

This version is typography-driven. Do not use an AI image tool for this — build it entirely in Canva.

```
Layout: "GOD'S" stacked directly above "VESSEL" in heavy condensed caps.
Font: Montserrat Black Italic OR Bebas Neue Condensed — maximum weight, maximum compression.
Optional element: a thin horizontal cross mark between the two words, 
or a small deliberate bullet/star accent — one element only, nothing more.
Colors: white text on black background — or black ink on cream for hang tag print version.
No gradients. No glow. No effects. No shadows.
Letter spacing: tight (−50 to −100 tracking) — the words should almost touch.
The type weight and spacing IS the design. Nothing else is needed.
This version goes on hoodies, embroidery patches, hang tags, and sticker drops.
```

---

## NEXT EXACT ACTION

**Step 1 (immediate):** Open the Dax Collective lion mark in Canva.
- Zoom to 400% and assess the center/bottom symbol — decide: refine it or remove it
- Check gradient hex codes — confirm they match `#60A5FA` → `#A78BFA` → `#F472B6`
- Adjust spacing between mark and wordmark if needed

**Step 2:** Create the textless icon version.
- Duplicate the design → delete the "DAX COLLECTIVE" wordmark layer
- Resize canvas or adjust layout so the mark is centered in a 1000x1000px square
- Confirm it fits within the circular crop safe zone (inner 75% of the canvas)
- Export: `TDC-icon-dark-1000px.png`

**Step 3:** Export full primary dark logo.
- Make sure all refinements are applied
- Export: `TDC-logo-dark-primary.png`

**Once you have those two files:** You can create The Dax Collective accounts on all four platforms with the correct, official logo. Platform setup is unblocked.

**After Phase 1 accounts are live:** Return to sub-brand logos — Dax the Traveler first (evaluate existing logo file), then Ani-Dax and God's Vessel before Phase 2 account creation.

---

*This document is for planning purposes only. No accounts have been created or modified.*
*Ref: brand-platform-blueprint.md · account-setup-checklist.md · canva-dc-monogram-brief.md*
