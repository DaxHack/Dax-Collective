# The Dax Collective — Canva Design Brief
## DC Monogram + Platform Visual Setup
**Status:** Planning Document | **Created:** 2026-05-26 | **Session:** 2
**Source docs:** brand-platform-blueprint.md · account-setup-checklist.md

---

## VERDICT

One master 1000x1000px Canva file is all you need to unblock Phase 1 account creation. Build the DC monogram first — it becomes the profile image for all four platforms. Everything else (banner, cover, highlights) derives from the same visual system. This brief gives you the exact specs, prompts, layer order, and step-by-step instructions to build it in Canva in one session. Do not deviate from the color codes — they are locked to the website.

---

## CANVA DESIGN GOAL

Build a premium, minimal creator brand identity for The Dax Collective that:
- Reads instantly as a bold "DC" monogram at any size — including 20px TikTok thumbnail
- Feels high-end, modern, and intentional — not templated
- Uses the floating bubble / glassmorphism aesthetic from the website
- Is platform-ready: outputs profile images, banner, and Facebook cover from one system
- Does NOT look like a school project, a gaming channel, or a corporate holding company

The tone is: **a premium creative studio that happens to be one person building something real.**

---

## PROFILE IMAGE SPECS

| Property | Value |
|----------|-------|
| Canvas size | 1000 x 1000 px |
| Format | Square master file |
| Color space | RGB |
| Export format | PNG (transparent background NOT needed — use black BG) |
| Resolution | 150 DPI minimum (Canva default is fine) |
| Safe area | Content inside center 700x700px zone (outer 150px all sides = crop risk) |
| Tiny-icon test | Must read clearly as a shape at 32x32px — test before finalizing |

---

## DC MONOGRAM STYLE

**Primary Option (recommended): Large "DC" letterform — centered, gradient-filled**

- "D" and "C" side by side, tightly kerned (small space between them, or touching)
- Letters take up roughly 55–65% of the canvas height
- Gradient flows LEFT → RIGHT: blue → purple → pink across both letters as one continuous gradient
- Letters feel heavy enough to read at small sizes — avoid ultra-thin weights
- No outline/stroke on the letters — the gradient fill IS the identity
- Subtle soft glow behind the letters (same gradient, very low opacity blur layer)
- Optionally: a very thin circular ring in gradient surrounding the "DC" (adds premium feel and helps with circular crop framing)

**Secondary Option: "DC" monogram above "THE DAX COLLECTIVE" wordmark**

- DC large at top (gradient-filled, same as above)
- Thin horizontal rule below it (gradient or white at 40% opacity)
- "THE DAX COLLECTIVE" in small, wide-tracked caps below
- Use only when profile image size is large enough to read the wordmark — at 32px this version fails; primary option is safer

**What NOT to do:**
- No drop shadows (cheap)
- No bevel/emboss (outdated)
- No thick outline strokes on letters (makes it look like a gaming logo)
- No colorful background elements touching the letters (kills readability at small size)
- No clipart or icon mixed into the monogram

---

## COLOR PALETTE

These are locked to the website. Do not substitute.

| Role | Color Name | Hex Code | Use |
|------|-----------|----------|-----|
| Background | Near-black | `#0A0A0F` | Canvas background (slightly cooler than pure black) |
| Gradient start | Blue | `#60A5FA` | Left side of DC letters, orb highlights |
| Gradient mid | Purple | `#A78BFA` | Center of DC letters, orb accents |
| Gradient end | Pink | `#F472B6` | Right side of DC letters, orb subtle tones |
| Text (secondary) | White | `#FFFFFF` | Wordmark subtitle, if used |
| Orb fill 1 | Blue-purple | `#3B82F6` at 8% opacity | Floating bubble — large, left |
| Orb fill 2 | Purple | `#7C3AED` at 6% opacity | Floating bubble — medium, right |
| Orb fill 3 | Pink | `#EC4899` at 5% opacity | Floating bubble — small, lower |
| Glow | Blue → Pink | `#60A5FA` at 15% opacity | Soft blur layer behind DC letters |

**Gradient direction for letters:** Linear, 0° (pure left to right), from `#60A5FA` on the left edge to `#F472B6` on the right edge, `#A78BFA` at the center.

---

## TYPOGRAPHY DIRECTION

**For the "DC" monogram letters:**

Best fonts available in Canva (pick ONE):

| Font | Why it works | Weight to use |
|------|-------------|---------------|
| **Montserrat** | Geometric, modern, extremely readable small | ExtraBold or Black |
| **Space Grotesk** | Slightly quirky geometric — more distinctive | Bold |
| **Bebas Neue** | Tall, condensed, punchy — strong at small sizes | Regular (only weight) |
| **Raleway** | Elegant geometric — more refined feel | ExtraBold |

**Recommended: Montserrat Black** — universally recognized as premium, clean, reads perfectly at 20px.

**For any wordmark subtitle ("THE DAX COLLECTIVE"):**
- Font: Montserrat or Space Grotesk
- Weight: Medium or SemiBold (lighter than the monogram)
- Letter spacing: +200 to +300 tracking (wide-spaced caps look premium)
- Color: White at 70% opacity OR white with the gradient applied subtly

**Typography rules:**
- Never use script/handwriting fonts for The Dax Collective brand
- Never use serif fonts for this brand
- Monogram and any subtitle must use the same font family

---

## BACKGROUND DIRECTION

Build the background in layers (bottom to top):

**Layer 1 — Base fill:**
- Solid color: `#0A0A0F` (near-black, very slightly blue-tinted — warmer than pure black)
- Covers full 1000x1000px canvas

**Layer 2 — Atmospheric orbs (glassmorphism bubbles):**
- Orb A: Large circle (~450px diameter), position: upper-left quadrant, partially off-canvas
  - Fill: `#3B82F6`, opacity: 8%, blur: 80px
- Orb B: Medium circle (~300px diameter), position: lower-right quadrant, partially off-canvas
  - Fill: `#7C3AED`, opacity: 6%, blur: 60px
- Orb C: Small circle (~180px diameter), position: lower-left, partially off-canvas
  - Fill: `#EC4899`, opacity: 5%, blur: 50px
- These orbs should feel like light sources in a dark room — atmospheric, not decorative shapes

**How to add blur in Canva:**
> Select the circle → Click "Edit image" → Effects → Blur — OR — use the blur slider in the element panel. Alternatively, use Canva's "Glow" or "Shadow" effects as workarounds if direct blur is unavailable.

**Layer 3 — Subtle gradient overlay (optional, adds depth):**
- Rectangle covering full canvas
- Fill: radial gradient from `#1E1B4B` (center, 0% opacity) to `#0A0A0F` (edges, 25% opacity)
- This gives a very subtle purple-black vignette that makes the center pop

**Layer 4 — Glow behind letters:**
- Duplicate the "DC" letterform
- Apply Gaussian blur (Canva: Effects → Blur, set to maximum)
- Set this blurred copy to ~15% opacity
- Position it directly behind the real letters
- This creates a soft halo that makes the gradient letters glow against the dark background

**Layer 5 — DC monogram (top layer):**
- Gradient-filled letters as described above
- Centered in canvas
- This is the only crisp, sharp layer — everything else is soft

---

## SAFE AREA / CROPPING RULES

```
+--------------------------------------------------+
|                  FULL CANVAS                     |
|        1000 x 1000 px                            |
|   +------------------------------------------+  |
|   |         CIRCLE CROP ZONE                 |  |
|   |           ~940px circle                  |  |
|   |   +----------------------------------+   |  |
|   |   |                                  |   |  |
|   |   |         SAFE CONTENT ZONE        |   |  |
|   |   |         700 x 700 px             |   |  |
|   |   |    (all text + logo here)        |   |  |
|   |   |                                  |   |  |
|   |   +----------------------------------+   |  |
|   |                                          |  |
|   +------------------------------------------+  |
|                                                  |
+--------------------------------------------------+
```

- **Orbs/backgrounds:** Can extend to canvas edge and beyond (they're atmosphere)
- **DC monogram:** Must fit entirely inside the 700x700px safe content zone
- **Any subtitle text:** Must fit inside the 700x700px safe content zone
- **At 32px test:** Cover the outer 85% of the image — only the center 15% is visible. The DC shape must still read as "DC" at this scale. Test by zooming out Canva to thumbnail size.

---

## CANVA PROMPT TO PASTE

Use this in **Canva's Magic Media (Text to Image)** or in **ChatGPT/DALL-E** to generate a concept reference image. This is a starting point — refine manually in Canva after.

```
Minimal premium logo design for "DC" monogram. Deep black background (#0A0A0F). 
Large bold geometric "DC" letters centered, filled with a smooth left-to-right 
gradient: blue (#60A5FA) to purple (#A78BFA) to pink (#F472B6). 
Font style: geometric sans-serif, heavy weight, clean letterforms. 
Soft glowing halo behind letters in the same gradient colors at low opacity. 
Background has 3 large blurred translucent circles/orbs in dark blue, purple, 
and pink at very low opacity — glassmorphism atmosphere effect. 
No borders. No drop shadows. No gradients on the background (black only). 
Premium creative studio aesthetic. Not gaming. Not corporate. Square format.
```

**For ChatGPT image tool specifically — add this line:**
```
Photorealistic render quality. Flat graphic design style. Vector-clean letterforms.
```

**Note:** AI image tools will give you a visual direction, not a production-ready file. Use the output as a reference and build the real version manually in Canva for full control over hex codes and export quality.

---

## VARIATION PROMPTS

Try these 4 variations. Pick the one that reads best at small size.

**Variation 1 — Clean monogram only (recommended first attempt)**
```
"DC" only. No wordmark. No ring. Black background. Gradient letters. 
Orbs in background. Simple, bold, confident.
```

**Variation 2 — Monogram with gradient ring frame**
```
"DC" centered inside a thin circular ring. Ring is the same gradient 
(blue → purple → pink). Letters and ring are the only design elements. 
No wordmark. Black background. Very minimal.
```

**Variation 3 — Monogram + wordmark stacked**
```
"DC" large at top. Thin horizontal gradient rule below. 
"THE DAX COLLECTIVE" in small wide-tracked white caps below rule. 
All on black background with orb atmosphere.
```

**Variation 4 — Letters only, wordmark as gradient**
```
Same as Variation 1 but the letters are white/light gray and the GRADIENT 
is applied as an underline bar beneath the letters instead. 
Cleaner, more editorial feel.
```

**Which to ship:** Start with Variation 1. Test at 32px. If it reads clearly, that's your profile image. If the D and C are hard to distinguish at small size, switch to Variation 2 (the ring helps the eye find the icon shape).

---

## EXPORT SETTINGS

When your design is final in Canva:

| Setting | Value |
|---------|-------|
| File type | PNG |
| Size | 1000 x 1000 px (default canvas size) |
| Quality | Standard or High |
| Transparent background | OFF — keep the black background |
| File name | `TDC-profile-image-v1.png` |

**Also export:**
- A 400x400px version (`TDC-profile-image-400px.png`) — for Facebook and TikTok uploads
- Do this in Canva by going to File → Download → Custom size → set 400x400

**Do NOT export as:**
- JPG (compression artifacts on dark backgrounds look bad)
- SVG (platforms don't accept SVG for profile images)
- WebP (not universally accepted for uploads)

---

## WHERE TO UPLOAD IT

Once exported, upload to each platform in this order:

| Platform | Profile Image Field | Notes |
|----------|-------------------|-------|
| YouTube | YouTube Studio → Customization → Branding → Profile photo | Upload 1000x1000px PNG |
| Instagram | Profile → Edit Profile → Profile Photo | Use 1000x1000px; Instagram crops to circle |
| TikTok | Profile → Edit Profile → Profile photo | Upload 1000x1000px; TikTok crops to circle |
| Facebook | Page → Edit Profile Picture | Upload 1000x1000px; Facebook shows as circle |

**Important:** The image is the SAME FILE on all four platforms. No resizing needed — all platforms accept 1000x1000px and crop to their preferred shape automatically.

---

## PLATFORM IMAGE REQUIREMENTS

### All Platforms — Profile Image

| Platform | Displays at | Safe to upload | Shape shown | Notes |
|----------|------------|----------------|-------------|-------|
| YouTube | 98 x 98 px | 1000 x 1000 px | Circle | Also appears at 800px in Studio — use high res |
| Instagram | 110 x 110 px | 1000 x 1000 px | Circle | Stories: 64px; Feed tag: 32px |
| TikTok | 64 x 64 px (profile) | 1000 x 1000 px | Circle | 20px in For You feed — monogram must be bold |
| Facebook (Page) | 170 x 170 px desktop | 1000 x 1000 px | Circle | 128px on mobile; shows square in some views |

---

### YouTube — Profile Image

**Canvas: 1000 x 1000 px**
- Content: DC monogram (same master file)
- Platform crops to circle — verify circle preview in YouTube Studio before publishing
- Also used as the icon that appears on all YouTube videos next to your channel name

---

### YouTube — Banner (Channel Art)

**Canvas: 2560 x 1440 px**

```
+--------------------------------------------------------+
|                 FULL BANNER (TV view)                  |
|                  2560 x 1440 px                        |
|                                                        |
|        +------------------------------------------+   |
|        |         DESKTOP CROP ZONE                |   |
|        |           2560 x 423 px                  |   |
|        |   +----------------------------------+   |   |
|        |   |     ** SAFE ZONE (ALL DEVICES) **|   |   |
|        |   |       1546 x 423 px              |   |   |
|        |   |  (All text MUST be in here)      |   |   |
|        |   +----------------------------------+   |   |
|        +------------------------------------------+   |
|                                                        |
+--------------------------------------------------------+
```

**Design direction:**
- Background: same `#0A0A0F` dark base
- Floating orbs (same blue/purple/pink, blurred) — use larger orbs, placed at edges/corners
- Center safe zone: "The Dax Collective" wordmark in gradient, centered
- Below wordmark: "Where Stories Live" tagline in white at 60% opacity, wide-tracked caps
- Optionally: very small sub-brand names listed horizontally at bottom of safe zone (tiny, decorative)

**What NOT to put near the edges:**
- No critical text within 500px of the left/right sides (will be cropped on most views)
- No important visual elements in the top or bottom 300px (will be cropped on desktop/tablet)

**Export:** PNG, 2560x1440px, file name: `TDC-youtube-banner-v1.png`

---

### Instagram — Profile Image

**Canvas: 1000 x 1000 px**
- Same master file as the DC monogram above
- Instagram crops to a perfect circle — the safe zone rule (content inside 700x700px) applies here
- Profile photo appears VERY small in Stories and DMs — the monogram must read at 32px

---

### TikTok — Profile Image

**Canvas: 1000 x 1000 px**
- Same master file as the DC monogram above
- TikTok crops to circle
- **Critical:** TikTok profile photos display at 20px in the main feed (over videos). At 20px, fine detail disappears. Only the gross shape of the "DC" letters will be visible. This means:
  - Letters must have enough weight (bold/black font weight) to cast a clear silhouette
  - The gradient makes the letters read as "bright on dark" which is ideal at small sizes
  - Thin/light font weights will completely disappear at 20px

---

### Facebook — Profile Image (Page)

**Canvas: 1000 x 1000 px**
- Same master file as the DC monogram above
- Facebook Pages show the profile as a circle over the cover photo in most views
- Facebook also shows it as a square thumbnail in some management views — the full 1000x1000px should look clean even when square (not just circle)

---

### Facebook — Cover Photo

**Canvas: 820 x 312 px**

**Design direction:**
- Background: `#0A0A0F` same dark base
- Floating orbs — adapted for horizontal wide format (place orbs at left and right edges)
- Center: "The Dax Collective" wordmark in gradient (larger, bolder than the YouTube banner subtitle)
- Below: "Where Stories Live" tagline, white at 60% opacity
- Optional: sub-brand logos or names as small icons/text arranged horizontally below the tagline

**Key constraint:** Facebook overlaps the cover photo with the profile picture circle (bottom-left on mobile, varies on desktop). Place no important content in the bottom-left 200x200px of the cover image — that area will be obscured by the profile photo.

**Export:** PNG, 820x312px, file name: `TDC-facebook-cover-v1.png`

---

## COMPLETE CANVA SESSION CHECKLIST

Follow this in order. One session, all Phase 1 assets done.

### Part 1 — DC Monogram Profile Image (est. 20–30 min)
- [ ] Open Canva → Create new design → Custom size: 1000 x 1000 px
- [ ] Add rectangle background: full canvas, fill `#0A0A0F`
- [ ] Add Orb A: circle 450px, fill `#3B82F6`, opacity 8%, blur max, position upper-left off-canvas
- [ ] Add Orb B: circle 300px, fill `#7C3AED`, opacity 6%, blur max, position lower-right off-canvas
- [ ] Add Orb C: circle 180px, fill `#EC4899`, opacity 5%, blur max, position lower-left off-canvas
- [ ] Add text element: type "DC", font Montserrat Black, size ~520px, center aligned
- [ ] Apply gradient to text: left-to-right linear, `#60A5FA` → `#A78BFA` → `#F472B6`
- [ ] Duplicate DC text layer → set to blur max → opacity 15% → move below original (glow layer)
- [ ] Verify content is inside 700x700px safe zone
- [ ] Preview at thumbnail size (zoom way out) — confirm "DC" reads clearly
- [ ] Export: PNG, 1000x1000px → save as `TDC-profile-image-v1.png`

### Part 2 — YouTube Banner (est. 20–30 min)
- [ ] New design → Custom size: 2560 x 1440 px
- [ ] Add rectangle background: full canvas, fill `#0A0A0F`
- [ ] Add large orbs at corners (same technique, scale up — 800–1000px diameter)
- [ ] Add guide markers to identify the 1546x423px safe zone (center of canvas)
- [ ] Add text in safe zone: "The Dax Collective" — Montserrat Black, gradient fill
- [ ] Add tagline below: "Where Stories Live" — Montserrat Medium, white 60% opacity, wide tracking
- [ ] Optional: add 5 sub-brand name labels horizontally, very small, beneath tagline
- [ ] Export: PNG, 2560x1440px → save as `TDC-youtube-banner-v1.png`

### Part 3 — Facebook Cover (est. 10 min)
- [ ] New design → Custom size: 820 x 312 px
- [ ] Duplicate the YouTube banner design → resize canvas (or start fresh with same elements, scaled down)
- [ ] Ensure wordmark is centered
- [ ] Leave bottom-left ~200x200px clear of critical content (profile image overlaps here)
- [ ] Export: PNG, 820x312px → save as `TDC-facebook-cover-v1.png`

---

## NEXT EXACT ACTION

**Open Canva. Create a new design at 1000x1000px.**

Start with the background first (Step 1 in Part 1 above). Get the dark base and orbs right before placing any text — the atmosphere layer is what separates a premium result from a flat logo. Once the background feels right, drop in the "DC" text and apply the gradient. The whole profile image should take under 30 minutes.

**When Part 1 is done:** You have everything needed to create The Dax Collective accounts on all four platforms. Accounts first, then return to Part 2 (banner) and Part 3 (Facebook cover).

**Files to produce this session:**
1. `TDC-profile-image-v1.png` — unlocks account creation
2. `TDC-youtube-banner-v1.png` — completes YouTube setup
3. `TDC-facebook-cover-v1.png` — completes Facebook Page setup

---

*This document is for planning and design direction purposes only. No accounts have been created or modified.*
*Ref: brand-platform-blueprint.md · account-setup-checklist.md*
