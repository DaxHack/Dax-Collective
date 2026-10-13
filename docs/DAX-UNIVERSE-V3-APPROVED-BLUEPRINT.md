# V3 blueprint approval and Build handoff

## Approval status
Daniel approved the V3 design and interaction direction on October 11, 2026. This approval does not authorize implementation or GitHub operations. Task assignment alone is not Build authorization.

## Next authorized Build task: Phase 1A
Produce a durable technical foundation committed and pushed to a dedicated V3 GitHub branch after verification, so the work can continue outside Replit by Claude, ChatGPT/Codex, Figma-connected workflows, or another development environment. GitHub operations become part of that Build definition of done; none are authorized during this planning approval. Preserve V1/V2 and keep V3 isolated. Do not start another planning cycle unless implementation reveals a genuine blocker.

The dated snapshot, checksum verification, disposable restoration rehearsal, isolated V3 routes, scene-specific Figma approvals, and applicable media-use reviews remain required as described below. No Figma frame or media-use approval is implied by this blueprint approval. No publishing or canonical-route replacement is authorized.

## Approved design and interaction direction
### Confirmed engineering ownership and milestone delivery
GitHub is the engineering source of truth; Figma is the visual source of truth. Replit is one construction tool, not the permanent home of the project. Figma must design against the real routes, components, data, available assets, working interactions, and constraints, without replacing working code.

The next actual Build task is Phase 1A, not another planning task. Its GitHub deliverable includes:
- Preserved V1 and V2.
- Isolated V3 routes and shell.
- V3 design-token architecture.
- Traveler data integration.
- Reusable navigation/state infrastructure.
- Responsive and reduced-motion foundations.
- Any safe extracted functionality.
- Documentation for running the app outside Replit.
- Restore/checkpoint information and asset/configuration documentation.

Phase 1A finishes by verifying V1/V2, testing the V3 foundation, fixing issues, committing to a dedicated V3 branch, pushing to GitHub, reporting branch/commit information, and stopping. A local-only scaffold is not completed Phase 1A delivery.

Keep the current production branch protected. The suggested development branch is `feature/dax-universe-v3`; do not put experiments directly into production. Promotion remains a separate decision.

Figma work can proceed concurrently with Phase 1A architecture. Approved visual states govern Phase 1B implementation; do not wait for the entire website to be complete before putting its working foundation in GitHub.

Checkpoint at meaningful milestones, not every tiny edit:
1. Phase 1A: mandatory verified GitHub push.
2. Gateway and Traveler: commit/push after matching approved Figma direction.
3. Vessel, Time-Zone, and Ani-Dax: commits/pushes or milestone PRs as appropriate to their size.
4. Production candidate: responsive, accessibility, SEO, performance, and analytics work finished and verified.
5. Production release: tag the accepted stable version, with `v3.0.0` as the suggested production V3 tag; GitHub becomes the deployment source.

These requirements define future authorized Build delivery. No code implementation, branch creation, commit, push, publishing, or deployment occurs during this planning clarification.

The following is the retained blueprint. Its PLAN ONLY warning and proposed execution steps remain authorization boundaries, not completed implementation claims. The approval above changes the blueprint decision from pending to approved; it does not approve pending frames or assets.

# Immersive V3 Design Blueprint

**PLAN ONLY — no implementation authorized yet.** This is a visual, motion, and interaction blueprint for review. The execution outline below applies only after explicit blueprint approval, task assignment, and a switch to Build mode.

## What & Why
Define a distinct V3 using immersive cinematic scrollytelling, spatial UI, editorial art direction, motion-led worldbuilding, and selective 3D/WebGL interaction. The user wants a precise blueprint before implementation, not another tasteful editorial redesign or a standard hero/text/cards template.

The October 1 snapshot labeled "Dax Site V1 - Current Working Version" passes its checksum verification. The working site already has a separate immersive V2 preview with world selection, pinned scenes, personal photography, product selection, a theory interface, and live clocks. Preserve those versions and reuse the existing implementation as the starting point for a distinct next iteration, rather than rebuilding from scratch or claiming existing features are new.

## Done looks like
### Safety gate
- Before redesign edits, an additional dated snapshot captures today's full working site under the exact label "Dax Site V1 - Current Working Version", with notes distinguishing canonical V1 pages and included experimental iterations.
- Earlier backups and exports remain unchanged. Source, local content, uploads, public assets, asset intake, and relevant runtime/configuration files remain available for reuse.
- Integrity checks pass and restoration is rehearsed in a disposable directory, never over the live site. Recovery instructions identify exclusions such as credentials, installed dependencies, cloud data, and external service state without exposing secrets.
- The next iteration has a separate comparison route set, preferably `/experiments/dax-universe-v3` and its four child routes. V1, the earlier Traveler preview, and the current universe preview stay accessible and visually unchanged.
- No original photograph is renamed, moved, deleted, recompressed, cropped, or overwritten.

### Shared experience
- Approved Figma frames are the visual source of truth for major V3 scene composition, typography, spacing, image placement, and responsive hierarchy. Final scene implementation waits for the corresponding frame approval; Replit implements motion and behavior around that design rather than redesigning it.
- Premium editorial typography, cinematic media, luxury material cues, and futuristic layered navigation form a coherent parent-brand system; each world has a visibly distinct composition, palette, and motion vocabulary.
- Use architectural spacing, oversized but responsive display type, readable editorial body text, compact wayfinding annotations, material surfaces, and controlled borders rather than repeating the same card grid. Carry a common navigation language across distinct world palettes.
- Scroll position drives storytelling through selective pinning, parallax, masked/layered reveals, progressive scene changes, and varied layouts, not just decorative entrance animations.
- Hover, focus, navigation, and page transitions feel intentional and responsive. Ordinary links, browser history, direct deep links, and keyboard navigation remain understandable.
- Lightweight perspective, interactive depth, and restrained ambient effects provide a 3D-feeling presentation where appropriate; actual WebGL is optional and must earn its performance cost.
- Prefer existing GSAP/ScrollTrigger for complex pinned scene sequences and Framer Motion for component transitions, or use one equivalent controller where sufficient. Assign one owner to each animated property/scene to avoid competing scroll controllers; retain native scrolling, with smooth in-page movement only when appropriate and reduced-motion-safe.

### Dax Collective gateway
- Daniel "Dax" is clearly presented as the creator/operator/storyteller.
- "One collective. Multiple worlds." is a prominent motion-led statement within a powerful hero and architectural world-select interface.
- High-quality brand panels and scroll-led transitions let visitors explore and enter all four worlds; the gateway feels like a creative control center rather than another sub-brand editorial page.

### Dax the Traveler
- A memorable personal hero and large, art-directed approved photographs establish Daniel's presence without putting the same portrait into every section.
- A pinned photographic journey, varied gallery transitions, layered image movement, premium captions, place annotations, and memory cues make the page feel like travel lived personally.
- A map or timeline supports the user-supplied chronology below where useful, preserving approximate and unknown facts. Unlocated portraits are never assigned to trips based on filenames.
- Real notes, guides, or budgets appear only when source content exists; unsupported anecdotes, costs, achievements, and capture dates are not invented.

### God's Vessel
- Sand, tan, warm beige, parchment, stone, muted gold, and warm neutrals meaningfully shape the page, with dark tones providing contrast rather than dominating.
- Reverent luxury-minimalism and archival/lookbook or museum-like material presentation remain intact.
- A tasteful interactive garment/product reveal uses existing product imagery, scroll progression, depth, and selection controls; do not imply that a flat mockup is a true 3D garment model.
- Existing product-detail and signup destinations remain functional, with clear transitions when leaving the experimental world.

### Ani-Dax
- A sophisticated theory chamber and game-menu-inspired analysis lab replaces repetitive card-led presentation as the primary visual structure.
- Authentic anime media follows Daniel's official-source hierarchy and supports commentary; generic desks/notebooks/shelves and AI pseudo-anime do not substitute for anime imagery. Original typography, interface, motion, navigation, diagrams, and transitions remain Ani-Dax's permanent identity.
- A current editorial feature can introduce official key visual/teaser/character/promotional media with independent titles and scroll framing, then transition into Daniel's theory interface before related essays/videos appear.
- Every externally sourced asset carries provenance and intended-use metadata, and unclear use is labeled exactly "REQUIRES RIGHTS/USE REVIEW". Official origin is not automatic permission or clearance.
- Theory selection, reading/detail states, and analysis navigation work on touch and keyboard. Do not imply unpublished theories are published articles. No hotlinked production images, full-episode downloads, large copyrighted video downloads, or automatic copyrighted-video publishing/generation.

### Time-Zone Travelers
- The least-developed world becomes an immersive time-based destination discovery experience rather than a generic travel grid.
- Full-bleed or strongly art-directed environments reveal destinations as scenes, not a repeated grid. A coherent, media-supported progression may move through city lights, ruins, sacred places, jungle, water/beach, airport/layover, sunrise, and dusk; these are atmosphere directions, not asserted itinerary stops.
- Transitions change light, color, spatial depth, labels, and local-hour context so visitors experience global movement and changing atmospheres. Explicit scene selection and clear wayfinding complement scrolling rather than compete with it.
- Destination selection, live local time, time-of-day atmosphere, and progressive scene changes are visibly connected; photography-led discovery works with both scrolling and explicit controls.
- Conceptual destination environments remain labeled and are not presented as Daniel's own trips, photographs, or published guides.

### Content and asset strategy
- Reuse and elevate existing assets, preferring Daniel's approved real images on Traveler and parts of the gateway. Do not over-repeat portraits or substitute stock/AI people for Daniel.
- Use placeholders only where necessary. Keep scene media, captions, destination/time-zone metadata, and evidence/concept labels in clear replaceable records so Daniel can substitute real media later without rewriting animation logic.
- Missing images have deliberate, clearly labeled empty/concept states rather than broken images or silently substituted photographs. Keep media provenance and unknown dates/locations separate from visual art direction.
- The final delivery explains the major visual-system changes actually implemented, not merely proposed, and includes an effects/media inventory: working scroll animation, clocks, interactions, and perspective versus conceptual imagery, placeholder footage, or absent true-3D models.

### Quality
- Layouts work at narrow mobile, tablet, and desktop widths without trapped scrolling, clipped controls, or essential hover-only interactions.
- Reduced-motion users retain all content and controls without aggressive pinning, parallax, flashing, or prolonged transitions; keyboard focus, contrast, modal dismissal, and focus restoration remain sound.
- Effects use existing motion tooling where practical, lazy loading, restrained media sizes, and cleaned-up listeners; no unnecessary heavyweight renderer, forced autoplay audio, or endless rendering for offscreen effects.
- Build and targeted lint checks pass, the preview runs, and one proportionate browser pass verifies changed world navigation, scene progression, photo overlays, product selection, theory reading, clocks, mobile gestures, and reduced motion. Report pre-existing service failures separately rather than hiding them.

## Priority and phase order
1. **Protected flagship:** approve the Collective hero, Traveler hero, and Traveler journey/timeline Figma frames and shared visual tokens before finalizing those scenes. After blueprint approval and Build assignment, verify an additional V1/V2 snapshot before code edits; establish isolated V3 routes and implement the approved flagship designs with motion.
2. **Distinct remaining worlds:** approve the Vessel garment interaction, Time-Zone environment sequence, Ani-Dax theory chamber, and Ani-Dax key-visual scene frames before finalizing those scenes. Evolve each around its approved design and reuse shared behavior without repeating visual compositions.
3. **Integrated finish:** compare implementation to the approved frames and state boards, finish responsive/reduced-motion behavior within that art direction, optimize approved media, verify interactions in one final proportionate browser pass, prove unchanged earlier versions, and deliver restore instructions and a real/conceptual effects inventory.

These are proposed future implementation phases, not authorization to begin. After explicit blueprint approval and Build-mode assignment, complete ordinary implementation steps without repeated permission requests, but never bypass scene-specific Figma approval, snapshot integrity failure, media-use review, or a genuinely destructive scope expansion. Any necessary change to approved art direction returns to Daniel for approval.

## Inspected baseline and reference limits
- The saved V1 frontend and current V2 retain an oversized editorial headline and prominent portrait at the gateway. The running V2 first viewport was inspected at desktop size; the opening remains visually close to a personal editorial portfolio.
- V2 already implements world selection, pinned media, a personal map/timeline and overlays, product selection, theory reading, and live local clocks. V3 must materially change composition and scroll choreography rather than merely recolor or re-advertise these existing features.
- Seven personal frames are currently registered in the journey data; three have Cuba/Havana location support, and the other four are unlocated portraits. Additional local JPG/HEIC uploads are present but require media/context review before being treated as approved destination imagery.
- Local product mockups exist for four God's Vessel products. No GLB/GLTF model or MP4/WebM/MOV source was found under the public assets, and no reference video was found in the attachment root searched.
- Time-Zone currently has Tokyo-night, Paris-river/dusk, and Atlanta-airport/morning scenes. The wider approved local library also has beach, tropical canopy, streets, and transit imagery that can support concept discovery scenes; ruins, sacred architecture, underwater, and a distinct sunrise sequence still need suitable media.
- Recovered references include a personal-photography composition screenshot, a Re:Zero-themed image composition screenshot, and an earlier written Urban Neon Editorial direction. Extract hierarchy, silhouette separation, architectural background layers, lighting contrast, and negative space, not protected character imagery.
- The earlier Ani-Dax direction emphasized blue/violet/cyan with controlled magenta, less visual clutter, and no fabricated community metrics. Preserve those useful principles. Daniel's current authentic-anime-media instruction supersedes the older blanket exclusion of official art and the placeholder-first/generic-workspace approach. Official assets are conditional on provenance and specific-use review, not automatically cleared. Keep Ani-Dax as the name; "Natsuki Daniel" remains a possible future identity, not an approved rename.
- No reference video URL was recovered from the relevant reference notes inspected. Video timing, camera choreography, and transitions have not been analyzed; request the actual file or link before claiming that analysis.

## Precise visual and motion blueprint

### Global visual rules
- **Canvas:** gateway near-black `#0B0D10` with chalk `#F2F0E9`; restrained cool-white light and a single active-world accent. No all-page neon, generic gradient blobs, dashboard statistic boxes, or rounded-card wall.
- **Typography:** gateway uses a clean architectural sans display, not the current oversized italic serif. Traveler may use a contrasting editorial serif for intimate passages; Vessel keeps its refined serif vocabulary; Ani uses a sharper condensed display. Body text remains quiet, readable, and unanimated while being read.
- **Composition:** one dominant scene per viewport, with foreground / subject / background planes and asymmetrical text placement. Limit the active scene's persistent interface to world navigation, progression, and a concise context label; do not decorate with fake telemetry.
- **Motion hierarchy:** primary scene transformation expresses progression; secondary text/media reveals explain the new state; tertiary ambient motion is barely noticeable. Never give all three layers equal intensity or animate every surface continuously.
- **Measured defaults:** scene transitions 600–900 ms when triggered by selection, hover/focus 160–220 ms, navigation 350–550 ms. Scroll-linked transforms follow scroll position rather than introducing delayed easing that loses state alignment.
- **Camera/depth:** suggested background travel 16–32 px, foreground travel 40–80 px, image scale roughly 1.04–1.12, and desktop pointer rotation capped around 3 degrees. These are starting ranges, not a requirement to animate text or every image.
- **Interface:** thin separators and a small number of translucent surfaces support spatial reading. Avoid expensive full-screen blur, tiny HUD text, forced loading theatrics, flashing collisions, and mandatory intros.

### Dax Collective: spatial world-select sequence
Use one persistent scene stage with three story beats, not a portrait hero followed by another selector.

| Beat | Composition and scroll transformation | Interaction |
| --- | --- | --- |
| Establish / first 0–20% | Four brand media surfaces occupy an asymmetric depth arrangement around restrained "ONE COLLECTIVE" typography. Daniel is a small creator annotation or optional inset, not the dominant image. The planes separate as the viewer advances. | Every world is selectable immediately; no waiting for the intro. |
| Explore / 20–80% | "MULTIPLE WORLDS" separates into independent text planes. Each world's surface comes forward in turn, changes scale and lighting, reveals its full name, and briefly fills most of the stage; inactive worlds recede without losing their labels. | Scroll advances the preview. Direct selection jumps to the corresponding scene with a visible active state; selection alone does not navigate away. |
| Enter / 80–100% | The chosen world's framing expands from a floating surface to a destination-ready full-bleed composition. Motion settles around a clear "Enter [world]" link. | Activation navigates to the real child route; an optional short matching transition bridges the two pages without blocking history or deep links. |

Target a desktop pin of roughly 2–3 viewport lengths for the complete sequence, not a separate lengthy pin for every brand. Mobile uses an in-flow media stage with touch selection, shorter scroll transformations, and ordinary vertical page movement; no forced horizontal navigation.

**Optional actual WebGL accent:** a low-contrast refractive or light-distortion layer behind the selector, not the UI itself. Limit it to one visible canvas, disable it for reduced motion and unsupported/low-power environments, and provide an equivalent static surface. It is not necessary for the spatial UI to work.

### Dax the Traveler: "Through Dax's Lens"
The camera begins close to a person and gradually opens into places; it must not reuse the gateway's world-selector composition.

| Beat | Composition and scroll transformation | Content/interaction |
| --- | --- | --- |
| Personal opening | Daniel occupies a lower side region within a photograph-led composition. A separate environment frame fills the remaining space; typography does not cover his face. Initial scroll lets the portrait recede while the wider place image expands. | Use existing approved images. Do not cut out or alter an original portrait to manufacture a silhouette; a supplied approved cutout would be needed for true isolated-subject layering. |
| Memory sequence | A short pinned stage sequences distinct authentic frames with masked edges, different depth rates, and restrained film-frame annotations. The portrait is not repeated behind every scene. | Horizontal photographic progression on desktop is driven by ordinary vertical scrolling; mobile provides a touch gallery with explicit next/previous buttons. Any frame opens the functioning viewer. |
| Journey progression | A geographic overview and year/period rail activate qualified journey chapters. Destination changes shift the scene, annotations, and map emphasis together, not just the text inside a card. | Use confirmed, approximate, and unknown context. Public place anchors must be labeled approximate and never represented as Daniel's precise GPS trail. |
| Reading / landing | Motion subsides for captions and real field-note content; occasional full-bleed place frames provide punctuation. | No invented guides, budgets, exact dates, or personal anecdotes. Unlocated frames remain personal portraits rather than destination proof. |

**Video dependency:** reserve an optional full-bleed travel-clip slot. Scroll-linked video requires an approved seekable clip and testing on mobile; it is not implemented by scaling a still photograph. The baseline uses a genuine interactive still-image sequence and clearly identifies that choice.

### God's Vessel: evolve the luxury archive
The user is most satisfied with this world: preserve its strongest composition, type, archive structure, and working destinations rather than replacing it with the gateway's technology aesthetic.

- Warm parchment `#E9DDC8`, cream `#F4EEE3`, stone `#B6A894`, muted gold `#B19B67`, charcoal `#24211E`; target roughly two-thirds warm/light visual area and one-third dark grounding across the experience, judged as an art-direction balance rather than a strict pixel quota.
- **Product moment 1:** one garment rests in a warm exhibit field. As scrolling advances, its display frame pins briefly; typography and a material/detail panel separate spatially while a restrained light sweep emphasizes the existing mockup. Use small perspective shifts, not an invented 360-degree rotation.
- **Product moment 2, optional:** transition from garment to authentic fabric detail or supplied on-body photography. Without those assets, use existing product imagery with clearly identified design/material annotations; do not fake a macro fabric shot or imply an on-body photograph exists.
- Actual scroll-controlled garment rotation, separated mesh components, or dressing/on-body transformation is asset-dependent on a suitable model, multi-angle sequence, or approved footage. Neither alternate file extensions nor several product mockups establish a real 3D model.
- Keep this world quiet: no particles, orbiting controls, clash effects, or continuously animated product while specifications/scripture are being read.

### Time-Zone Travelers: environmental atlas
Use an environmental scene stage, a restrained geographic locator, and readable local time. This is discovery content, separate from Daniel's personal travel diary.

| Passage | Planned environmental transition | Asset readiness |
| --- | --- | --- |
| City night | Tokyo media with layered signage/light plane, independent foreground annotation, and an accurate local clock. A light wipe changes the spatial atmosphere. | Existing concept media available. |
| Stone / sacred architecture | Architectural framing advances slowly while a thin locator and destination prompt enter. | Suitable approved media needed; no invented destination selection merely to populate the sequence. |
| Jungle / river / water | Environment framing moves independently of annotation/light planes; subdued rain/cloud/water accents may clarify atmosphere. Do not pretend a flattened photograph contains separately captured foreground layers. | Existing tropical-canopy library image supports a labeled still scene. River/underwater footage or true depth-separated photography is not established as available. |
| Beach / sunrise | Light and warmth gradually change; horizon movement replaces a busy interface. | Existing beach library image supports a labeled still scene. Distinct sunrise footage is not established as available. |
| Airport / layover | Existing airport scene introduces a different local hour and geographic context; a glass-plane reveal expresses transit rather than a fake boarding-pass UI. | Existing Atlanta concept media available. |
| Dusk / reflection | Paris river scene settles into blue-hour atmosphere and a clear next-world/scene control. | Existing concept media available. |

Use a selected five-scene baseline from city night, tropical canopy, beach, airport, and river dusk; do not force every proposed passage into production. Library approval is not proof of Daniel's capture or itinerary. Expanded ruins/sacred/underwater/sunrise passages remain explicitly media-dependent.

Separate **depicted scene hour** from **live local time**. Night photography must not pretend to become authentic daytime footage through a tint. Any simulated time-of-day lighting is disclosed as an atmosphere treatment; accurate local clocks remain functional through IANA time zones and daylight-saving changes.

An interactive map locator is viable with public geographic anchors. A true interactive 3D globe is optional and separate from the baseline map; neither has to reproduce a flight itinerary. Atmospheric particles must remain sparse, off the text, and specific to the environment rather than a universal overlay.

### Ani-Dax: authentic key visual to analysis chamber
Use a cinematic editorial feature supported by authentic anime media, not an "A—D" mark followed by cards, a generic desk, or AI pseudo-anime. The original Ani-Dax interface remains the identity; the featured anime is changeable editorial content. An opposing-figure/clash variant is optional only when suitable reviewed official or Daniel-supplied media supports it, never the default excuse to fabricate anime art.

| Beat | Scroll choreography | Interaction and publishing boundary |
| --- | --- | --- |
| Key visual entry / 0–30% | A reviewed official key visual or promotional image occupies a cinematic full-screen composition. Anime title, season/arc/theme, feature status, and Ani-Dax identity occupy independent interface planes. | Visible source/credit access, spoiler scope, and immediate "Read analysis". If a suitable reviewed asset is missing, a neutral media slot reads "REQUIRES RIGHTS/USE REVIEW"; no pseudo-anime fallback. |
| Framing / 30–55% | Scroll subtly changes crop/framing, scale, and independent title emphasis toward an editorial focal point. Depth comes from the interface and image plane unless genuinely separate reviewed source layers exist. | Do not invent hidden backgrounds, extract fake characters, remove required credits, or claim that flat artwork is a real 3D scene. Full-image access remains available. |
| Analysis handoff / 55–75% | The visual recedes into an evidence panel as Daniel's argument, canon reference, and original theory diagram become primary. A topic/arc rail enters only after the opening composition has established the feature. | Actual selection changes substantive analysis. Source, canon facts, and Daniel's interpretation stay distinguishable. |
| Reading / 75–100% | Motion stops behind a readable long-form column, supporting evidence labels, and an optional still/diagram. | No animated background fighting the prose; working hypotheses remain marked as such. |

Use existing original diagrams for theory states, not as substitutes for authentic anime media. No verified official key visual, opposing-character asset, trailer frame, or episode still has been sourced or cleared in this planning phase. Existing Google-image references are composition inspiration only. Keep controls to topic/arc, theory nodes, reading mode, and evidence/source access; no fake levels, counts, currency, or decorative dashboard. See the authentic-media specification below for hierarchy, reusable components, and review gates.

### Real effects, asset-dependent effects, and concepts
- **Working baseline:** real scroll-linked scene progression, masks/transforms, perspective-treated image planes, hover/focus/touch controls, photo sequences/viewer, geographic chapter activation, product selection, theory states, and live local clocks.
- **Optional genuine rendering:** one bounded WebGL/shader accent or an actual globe, only if it adds visible value and has static/reduced-motion fallbacks. These are proposals until implemented and verified.
- **Not available by default:** true 3D garments, 360-degree product rotation, isolated portrait cutouts, scroll-linked video, underwater footage, and licensed opposing anime figures. Do not call any of these complete without its required asset and functioning interaction.
- **Conceptual media:** existing Time-Zone environment concepts, unfinished atlas scene studies, original theory diagrams, and any labeled prototype silhouette. Production and local-prototype labels/rights must remain explicit.

### Interaction, motion, and performance acceptance
- Native vertical scrolling remains the source of progression. No scroll hijacking, mandatory intro, fake loader, auto-navigation when a scene activates, or pointer-only essential control.
- Direct world/scene selection and browser history work independently of scroll position. Pointer depth returns to rest on exit; touch uses deliberate controls rather than device-motion permission.
- Reduced motion exposes all scenes in an ordinary readable flow and uses instant or restrained state changes; mobile keeps strong composition without desktop-length pinning. Prevent browser back-swipe conflicts in galleries and scene navigation.
- Start from existing GSAP/Framer Motion, with one controller per animated property. Prefer transform/opacity and carefully scoped masks; pause offscreen effects and avoid mounting several active renderers.
- No unresolved media requests, blank routes, fixed-header overlaps, lost modal focus, or unreadable text over images at 320, 390, 768, and 1440 px widths. Compare V1 and V2 after integration to prove isolation.
- The next iteration is accepted as structurally distinct only if the gateway's first viewport is a spatial selector rather than the current serif/portrait hero; at least two substantive scroll transformations per priority world are observable; and each brand's primary scene is recognizably different without relying solely on its name/color.

## Reference video analysis pending
The request ends with "REFERENCE VIDEO ANALYSIS" but no reference video or URL is available in the current message or relevant local sources inspected. Do not invent a video review. Once supplied, analyze selected moments for camera/scroll relationship, pin duration, depth planes, mask behavior, typography independence, navigation, and mobile feasibility; translate those principles into the sequences above without copying the reference.

## Complete approval blueprint
This section consolidates the requested twelve deliverables. It supersedes preliminary asset assumptions above where the broader local-media inspection found additional usable material. Nothing here authorizes implementation before Daniel approves.

### 1. Visual thesis
V3 is a navigable cinematic exhibition of Daniel's creative ecosystem, not five editorial pages sharing an animated template. The Collective opens as an architectural world-selection stage, with media surfaces that change depth, scale, and lighting as the visitor progresses. Traveler exchanges that spatial control language for a personal photographic journey, integrating Daniel into the scene instead of repeating a portrait above successive cards. God's Vessel evolves the existing luxury archive through warm material fields and one restrained product sequence, without replacing its strongest structure. Time-Zone connects changing environments to geographic context and real local hours while clearly separating conceptual imagery from personal travel evidence. Ani-Dax introduces a changeable authentic-anime feature that transitions into Daniel's original analysis interface and readable long-form content. The shared motion grammar creates continuity, but each world assigns a different purpose and intensity to movement. Mobile, reduced motion, asset provenance, and real navigation are designed as first-class requirements, not corrections after spectacle.

### 2. First-viewport-to-footer storyboards
| World | Complete visitor sequence |
| --- | --- |
| Collective | Immediate four-world spatial stage and creator annotation → scroll-controlled depth/scale world previews → focused full-bleed selected-world entrance → compact creator/collective context with a real contact or existing About destination → quiet closing with four real world links, V1/V2 comparison exits in the local preview, and existing legal/contact destinations. No second redundant card-grid selector. |
| Traveler | Personal side-anchored image plus photographic environment → expanding place composition → short memory sequence using distinct authentic frames → interactive year/place progression and expandable factual chapters → readable notes only where content exists → a real contact/collaboration pathway without invented clients → closing travel frame and return/world navigation. |
| God's Vessel | Existing luxury archive identity in a warmer exhibit field → one product reveal/selection moment → names/meaning/scripture archive with restrained interactions → optional authentic detail or clearly labeled material study → preserved devotional availability/error state and existing signup/product links → quiet cream/charcoal footer with real collection/Collective destinations. Do not fabricate a repaired scripture feed. |
| Time-Zone | City-night introduction with depicted mood and live local clock → tropical-canopy scene → beach/horizon scene → transit/layover scene → Paris river/dusk scene → geographic overview and explicit scene revisiting → discovery prompt only where there is a real destination/content target → return-to-Collective closing. Missing guides are not advertised as available. |
| Ani-Dax | Authentic official-key-visual feature with independent original Ani-Dax identity and bypass-to-reading action → controlled crop/depth/theme progression → source visual becomes an evidence panel beside Daniel's argument → topic/arc navigation and selectable original theory diagram → static long-form analysis → related existing essays/videos after the cinematic introduction → source/credit access, content/Collective links, and restrained footer. Missing/unclear assets use labeled review slots. No generic desk hero, fake community, or automatic future-name rebrand. |

### 3. Scroll choreography ownership
| Sequence | State tied to progress | Rendering method and boundary |
| --- | --- | --- |
| Collective stage | Active preview, media-plane scale/translation, light accent, independent title masks | One GSAP timeline/ScrollTrigger owns stage transforms. Selection moves to a defined stage state; Framer does not also animate those properties. |
| Traveler opening | Portrait-frame recession, place-frame expansion, caption reveal | GSAP for the linked opening; keep the person readable and uncropped where composition permits. No claimed isolated-subject cutout from an ordinary photo. |
| Traveler memories | Active still, media masks, sequence progress | Short desktop pin with explicit photo controls; mobile in-flow swipe sequence. Treat these as photographs, not video frames or a fabricated continuous trip. |
| Journey/map | Active year/place, approximate map anchor, expanded chapter | SVG and React state coordinate selection; animation explains selection and does not invent a continuous recorded travel route. |
| Vessel product | Framing, exhibit light, selected garment/detail annotation | One short scroll transform sequence; product controls select actual registered products. Perspective is identified as perspective, not mesh rotation. |
| Time-Zone environments | Active scene, independent locator/title reveal, ambient palette | One scene controller updates the stage. Clock updates use real wall time independently; a depicted sunset does not falsify the current local hour. |
| Ani editorial feature | Reviewed image framing/scale, independent title/arc/theme planes, evidence/diagram handoff | One GSAP-controlled sequence; Framer owns subsequent topic panels and dialogs, not the same image transforms. Character emphasis is framing, not fabricated source layers; reading stays static. |

### 4. Meaningful interaction inventory and mobile equivalents
| Interaction | Desktop | Intentional phone behavior |
| --- | --- | --- |
| World preview | Click/focus world label or scroll to its scene | Large tap labels in a visible world rail; optional swipe with matching buttons, never hover-dependent |
| Enter/exit world | Real router links with restrained matching transition | Immediate tap navigation; transition short enough not to feel like a loading screen |
| Creator/About/contact | Existing destination links | Ordinary touch targets; no fabricated lead form or new service |
| Scene progression/revisit | Scroll plus explicit previous/next and indexed labels | Layered vertical scenes; short full-screen moments; tap controls rather than a tiny desktop HUD |
| Pointer depth | Bounded pointer response and reset on exit | Deliberate selected/pressed states; no device-tilt permission |
| Personal gallery | Open, previous/next, Escape/close, keyboard focus return | Swipe and visible previous/next/close; preserve vertical movement and avoid edge back-swipe conflicts |
| Travel timeline/year | Year/place selection and qualified chapter detail | Horizontally scrollable year rail with large targets, then readable stacked detail |
| Geographic locator | Select public place anchor or list item | List is fully equivalent; map gestures do not trap page scrolling |
| Product selector | Choose actual product, inspect available image, follow detail link | Large labeled choices and stable image framing; no false 360-degree swipe |
| Name/meaning archive | Gentle reveal of actual meaning/reference | Tap expands/collapses with the same content |
| Signup/product path | Existing functional destinations | Existing flow preserved; preview boundary identified |
| Destination/clock selection | Select scene and read real local time | Persistent compact locator/time label; don't overload assistive announcements with clock ticks |
| Topic/arc/theory node | Choose actual analysis, inspect diagram, open reading | Large topic controls plus a simple node list equivalent |
| Anime evidence/source | Open source/credit information, full-frame view, scene argument, or two-image comparison | Large labeled source/evidence controls; comparison stacks or toggles with visible labels |
| Spoiler scope | Choose to reveal media/text only after its spoiler boundary is clear | Spoiler concealment applies to the image and caption together; tap to reveal |
| Skip spectacle/read analysis | Immediate link to substantive content | Visible action in the first viewport; no waiting for a scroll sequence |
| Reading/detail overlays | Proper focus, Escape, scroll lock, return to opener | Accessible close, no header blocking overlay, nested focus restoration preserved |
| Optional video | Native play/pause and explicit scrub/progress if actually supplied | Poster-first, playsinline, muted if autoplay is approved, ordinary play fallback if seeking fails |

These are the proposed meaningful controls; decorative lights, sparks, grain, and perspective are not separate fake interactions.

### 5. Global and brand motion rules
| Scope | Rule |
| --- | --- |
| Page transition | Real route navigation first; optional 350–550 ms shared media/color bridge. No black-screen wait, scroll hijacking, or transition-dependent deep link. Honor history and a defined scroll-position policy. |
| Navigation | Selected-world indicator moves over 160–220 ms; preview and navigation are separate. Focus is not automatically moved whenever scrolling changes a scene. |
| Typography | Mask/reveal major display lines independently from media; no word-by-word animated body copy. Primary titles settle before reading. |
| Media | Mask, frame expansion, translation, and limited scale communicate depth; no endless Ken Burns on every image. |
| Easing | Short ease-out for direct controls; slower restrained ease-in-out for cinematic selections; scrubbed transforms track progress without spring lag. Avoid overshoot except a small deliberate Ani menu response. |
| Scroll | Native vertical scrolling. Smooth anchor movement is optional and disabled for reduced motion; no added smooth-scroll dependency by default. |
| Collective | Spatial/architectural: controlled plane translation, scale, light, and selector framing. |
| Traveler | Cinematic/photographic: distinct-frame sequences, slow place expansion, annotation timing, then reading pauses. |
| Vessel | Restrained/tactile: soft exhibit light, short perspective shifts, warm material boundaries; lowest motion density. |
| Time-Zone | Environmental/atmospheric: horizon/framing, local-hour context, scene-specific light; sparse appropriate atmosphere. |
| Ani-Dax | Kinetic/dramatic: authentic key-visual entry, controlled focal emphasis, original diagram handoff, game-menu selection; stable evidence and prose afterward. Opposing-figure/clash sequence is a media-supported optional variant, not a pseudo-anime default. |

### 6. Asset matrix
Inspection used actual dimensions and temporary read-only review contact sheets outside the workspace. All originals remain unchanged. Apparent locations below come from inspected visual context, current approved records, or existing review notes; a filename's year is not a capture-date finding.

**Provenance:** the local registry often labels media "Original" but leaves source URLs blank. No reliable Drive-to-local import manifest was found in the inspected records. Prior Drive metadata discovery is not import or publication approval; do not claim these library PNGs prove Daniel's capture/trip dates. Reuse public-safe local assets only within their existing approval scope and keep concept labels where required.

#### Personal runtime images
Paths are relative to the personal/history media directories; L = landscape, P = portrait, S = square/near-square.

| Filename | Apparent subject/location | Dimensions/orientation | Suitability | Page and recommended role |
| --- | --- | --- | --- | --- |
| havana-balcony.webp | Daniel, balcony, recognizable Havana context | 1439×1440 S | Good asymmetric hero and mobile frame; not a 4K panoramic background | Traveler HERO; small Collective world preview |
| cuba-classic-car.webp | Daniel beside blue classic car; Cuba supported by existing review | 1439×1440 S | Strong subject/place separation; maintain face/car framing | Traveler PINNED PORTRAIT / GALLERY; Collective preview alternative |
| havana-city-portrait.webp | Daniel foreground with Capitol/Havana context | 1399×1400 S | Strong contextual secondary frame, not another simultaneous hero | Traveler GALLERY / story reveal |
| evening-portrait.webp | Daniel indoors, striped shirt; location unknown | 1190×1600 P | Good personal secondary frame; limited environment story | Traveler GALLERY, not destination evidence |
| open-air-portrait.webp | Daniel seated outdoors; location unknown | 900×1600 P | Better on mobile or a narrow inset than full desktop width | Traveler GALLERY, no Peru attribution |
| dax-smiling.webp | Close smiling portrait; location unknown | 665×1400 P | Narrow source; poor full-desktop hero choice | Traveler small GALLERY / creator inset, not background |
| daniel-camera-roll-portrait.jpg | Daniel in black shirt; location unknown | 1440×2560 P | Strong tall personal frame, source camera-roll screenshot noted | Traveler secondary PINNED PORTRAIT / GALLERY |

#### Local environment library
These are still images, even when named broll. Use as labeled brand/discovery media, not as Daniel's verified first-person trip photography.

| Filename | Apparent subject/location | Dimensions/orientation | Suitability | Recommended page/role |
| --- | --- | --- | --- | --- |
| 2024-cuba-havana-classic-car.png | Turquoise car/waterfront; library label Havana | 1280×896 L | Medium-resolution scene; avoid competing with authentic Daniel/car image | Time-Zone alternate DESTINATION SCENE; UNUSED in Traveler baseline |
| 2024-puerto-rico-old-san-juan-street.png | Colorful cobbled street; library label Old San Juan | 1280×896 L | Useful atmospheric frame, not high-DPI panoramic source | Time-Zone optional DESTINATION SCENE |
| 2024-atlanta-camera-bag-gear.png | Camera equipment flatlay | 1024×1024 S | Doesn't support global movement or verified personal gear claims | UNUSED baseline; possible concept BACKGROUND for a future sourced gear section |
| 2024-atlanta-packing-flatlay.png | Packing objects flatlay | 1024×1024 S | Auxiliary editorial imagery, not a cinematic priority | UNUSED |
| 2024-cuba-havana-vieja-facade.png | Weathered architectural facade; library label Havana | 896×1280 P | Useful narrow architectural accent; not ancient ruins evidence | Time-Zone optional BACKGROUND/inset |
| 2024-cuba-jose-marti-airport.png | Airport exterior; library label José Martí | 1408×768 L | Wide still, optional transit alternative; avoid conflicting signage claims | Time-Zone alternate DESTINATION SCENE |
| 2024-cuba-street-food-mofongo.png | Food plate on a street; library location/cuisine unverified independently | 1280×896 L | Does not advance core atlas or support a personal food anecdote | UNUSED |
| 2024-cuba-street-walk-broll.png | Warm street perspective | 1408×768 L | Good transition environment; still, not footage | Time-Zone alternate FULL-BLEED / DESTINATION SCENE |
| 2024-puerto-rico-condado-beach-morning.png | Beach/water horizon; library label Condado | 1408×768 L | Strong scene framing; acceptable viewport still, not retina/4K source | Time-Zone FULL-BLEED / DESTINATION SCENE, concept label |
| 2024-puerto-rico-el-morro-kite.png | Coastal lawn/fort silhouette | 1408×768 L | Optional architectural/coastal scene; no independently verified kite/ruins claim | Time-Zone alternate DESTINATION SCENE |
| 2024-puerto-rico-filming-setup.png | Camera/tripod amid vegetation | 1280×896 L | Attractive atmosphere, but not proof of Daniel's equipment or fieldwork | UNUSED baseline |
| 2024-puerto-rico-la-placita-night-market.png | Neon/busy night street; library label La Placita | 1280×896 L | Alternative night mood, redundant with selected Tokyo opening | UNUSED baseline; reserve alternate scene |
| 2024-puerto-rico-sju-airport-gate.png | Airport gate/signage | 1408×768 L | Wide transit alternative; needs label/signage consistency | Time-Zone reserve DESTINATION SCENE |
| 2024-puerto-rico-toro-verde-zipline.png | Tropical canopy and platform/rope structure | 1280×896 L | Supports conceptual jungle/canopy scene, not actual jungle footage | Time-Zone DESTINATION SCENE |
| 2024-tokyo-zone-guide-shibuya.png | City crossing/lights; library label Shibuya | 1280×896 L | Strong first night scene; moderate source resolution | Time-Zone HERO / DESTINATION SCENE; Collective preview |
| 2023-paris-seine-riverbank-dusk.png | River/city skyline at dusk; library label Paris | 1408×768 L | Strong wide closing atmosphere, not live weather/time imagery | Time-Zone FULL-BLEED / DESTINATION SCENE |
| 2024-atlanta-airport-gate-morning.png | Quiet gate/warm window light; library label Atlanta | 1408×768 L | Best selected transit still; does not establish airport travel by Daniel | Time-Zone FULL-BLEED / DESTINATION SCENE |
| 2024-atlanta-budget-carryon-setup.png | Carry-on/packing objects | 1024×1024 S | No motion-story benefit and no sourced budget claim | UNUSED |

#### Product and analysis library
| Filename | Apparent subject | Dimensions/orientation | Suitability and approval caveat | Recommended page/role |
| --- | --- | --- | --- | --- |
| 001.jpg / 001.png | Cream hoodie flat product mockup | 1280×896 L each | JPEG about 243 KB versus PNG about 1.6 MB; review garment lettering/current authorized branding; not multi-angle assets | Vessel product reveal/GALLERY; conditional hero candidate |
| 002.jpg / 002.png | Charcoal Adonai tee flat mockup | 1280×896 L each | JPEG about 284 KB versus PNG about 1.9 MB; one image, not a model | Vessel HERO/product reveal candidate / GALLERY |
| 010.jpg / 010.png | Printed study-card arrangement | 1280×896 L each | JPEG about 361 KB versus PNG about 1.9 MB; verify actual collection/content before treating as manufactured product | Vessel GALLERY / archive concept |
| 011.jpg / 011.png | Typographic sticker arrangement | 1280×896 L each | JPEG about 182 KB versus PNG about 1.3 MB; lettering fidelity/authorized design needs review before close-up presentation | UNUSED V3 baseline until verified; preserve file |
| hoodie-el-shaddai-front.png | Folded dark hoodie mockup | 1280×896 L | About 744 KB; actual printed label must be reconciled with filename/product caption | Vessel reserve GALLERY / Collective preview after branding check |
| adonai-tee-typography-closeup.png | Adonai print detail | 1024×1024 S | About 841 KB; available print detail, not proof of fabric specification | Vessel product detail / OVERLAY inset |
| archive-process-design-sketches.png | Moodboard/sketch desk | 1280×896 L | About 1.7 MB; label design study, not proof of Daniel's actual workshop/process | Vessel optional BACKGROUND/inset |
| study-cards-phase-one-layout.png | Six typographic study-card concepts | 1280×896 L | About 1.8 MB; match captions to actual visible words | Vessel optional GALLERY / archive concept |
| setup-anidax-recording-space.png | Blue-lit recording desk/microphone | 1280×896 L | About 1.3 MB; generic environment, not documented Daniel studio or authentic anime media | UNUSED Ani-Dax V3 baseline and Collective preview; preserve file |
| anime-collection-shelf-display.png | Shelf with anime publications/figures | 896×1280 P | About 2.1 MB; embedded franchise artwork rights not established | UNUSED baseline pending rights review |
| character-files-editorial-workspace.png | Analysis desk with character imagery | 1280×896 L | About 1.4 MB; embedded character artwork rights not established | UNUSED baseline pending rights review |
| rezero-theory-research-notes.png | Theory board/notes with character material | 1280×896 L | About 1.9 MB; embedded artwork and factual note authenticity unverified | UNUSED baseline pending rights review |
| shared-setup-creator-workspace.png | Equipment/workspace flatlay | 1280×896 L | About 1.4 MB; not verified as Daniel's workspace and not the required spatial opening | UNUSED baseline |
| analysis-chamber.svg | Original abstract chamber diagram | viewBox 1400×960; scalable L | Supports original interface/analysis identity, not anime footage or a replacement key visual | Ani-Dax analysis BACKGROUND / original Collective identity plane |
| return-memory-model.svg | Original repeat/memory theory diagram | viewBox 1100×760; scalable L | Reuse as functional theory state with readable labels | Ani-Dax OVERLAY / theory scene |
| silence-dialogue-model.svg | Original dialogue/silence theory diagram | viewBox 1100×760; scalable L | As above; avoid entire complex diagram at phone-hero size | Ani-Dax OVERLAY / theory scene |
| lived-time-model.svg | Original layered worldbuilding diagram | viewBox 1100×760; scalable L | As above | Ani-Dax OVERLAY / theory scene |

#### Source uploads and exclusions
These remain intake/reference material unless already represented by an approved runtime derivative. "Potential" does not grant permission to convert, publish, assign a destination, or add to V3.

| Filename | Apparent subject | Dimensions/orientation | Suitability | Recommendation |
| --- | --- | --- | --- | --- |
| 20200108_091627_1790797741134.jpg | Smiling personal portrait, sideways composition | 3216×1528 L encoded | Preserve original; existing approved smiling derivative is simpler for runtime | UNUSED source; Traveler already has derivative |
| 1744119124929_1790797741138.jpg | Stylized avatar, not authentic travel photograph | 1280×2304 P | Wrong evidence/identity treatment for travel film | UNUSED |
| 20250726_171727(11)_1790797741131.jpg and _1790850985492.jpg | Seated outdoor personal portrait; location unknown | 1080×1920 P each | Matching file hashes confirm duplicate copies; existing open-air runtime frame covers this role | UNUSED sources; preserve both copies |
| Screenshot_20250805_215900_Fet_1790797741124.jpg and _1790850985344.jpg | Existing personal Havana/Cuba frame | 1439×1440 S each | Hash-confirmed duplicate copies; prefer approved WebP | UNUSED sources, existing personal GALLERY derivative |
| Screenshot_20250805_215850_Fet_1790797741119.jpg and _1790850985352.jpg | Personal frame in the existing Cuba/Havana set | 1439×1440 S each | Preserve originals; prefer reviewed runtime frames | UNUSED sources |
| Screenshot_20250805_215834_Fet_1790797741115.jpg and _1790850985348.jpg | Personal frame in the existing Cuba/Havana set | 1439×1440 S each | Preserve originals; prefer reviewed runtime frames | UNUSED sources |
| Screenshot_20250805_215931_Fet_1790797741127.jpg | Personal portrait source in existing reviewed set | 1439×1934 P | Source retained; no extra new hero needed | UNUSED source |
| Screenshot_20250805_215825_Fet_1790850985403.jpg | Additional near-square personal source | 1439×1440 S | Not individually visually established in this inspection; review before any new role | UNUSED pending review |
| Screenshot_20250914_081144_Gallery_1790850985300.jpg | Black-shirt personal portrait | 1440×2560 P | Already copied unchanged to camera-roll runtime frame | UNUSED source; use approved runtime GALLERY frame |
| 20250925_091739_1790797741016.heic | Daniel in cap/green shirt; place unknown | 2544×3392 P | Good portrait source, but review permission/context and separate browser derivative first | Potential Traveler GALLERY; UNUSED now |
| 20250925_174913_1790797740903.heic and _1790850985095.heic | Close personal portrait in open dining setting; place unknown | 2544×3392 P each | Duplicate hashes match; redundant close portrait, not wide destination evidence | Potential Traveler GALLERY; UNUSED now |
| 20250924_232925_1790797741040.heic | Personal indoor portrait; place unknown | 2544×3392 P | Good source resolution; not automatically a Ghana chapter image | Potential Traveler GALLERY; UNUSED now |
| 20250925_091656_1790797740932.heic | Subject not visually established here | 9184×16320 P metadata | Approximately 150 MP; disproportionate decode cost; do not put original into browser | UNUSED pending controlled review |
| 20250928_173059_1790797740883.jpg | Personal portrait near neon lettering, sideways content | 3392×2544 L encoded | High-resolution source, but orientation/context need approved review | Potential Traveler GALLERY; UNUSED now |
| 20250928_173147_1790850985591.jpg | Full-length indoor/mirror portrait, sideways content | 4000×2252 L encoded | Good nominal pixels, but not a location scene | Potential Traveler GALLERY; UNUSED now |
| Screenshot_20250524_150124_Instagram_1790850985495.jpg | Personal/travel image inside social interface chrome | 1440×3120 P | Screenshot UI and image provenance make it a poor production source; locate approved original instead | UNUSED |
| Screenshot_20261001_063734_ChatGPT_1790851071835.jpg and _1790851873171.jpg | Conversation/photo collage, duplicate hashes match | 1440×3120 P each | Reference only; never extract a London image and present it as the original | UNUSED runtime / composition REFERENCE |
| Screenshot_20260908_233206_Google_1790851900848.jpg | Franchise character artwork within search UI | 3120×1440 L | Composition reference only; screenshot is not rights-cleared site art | UNUSED runtime / composition REFERENCE |

**Resolution and art-direction rule:** 1280–1408 px environment images are suitable for bounded media surfaces and many phone views, but not genuinely high-resolution retina/4K full-screen imagery. Use intentional framing rather than claiming high resolution by upscaling. For later approved web derivatives, generate separate responsive AVIF/WebP/JPEG files from valid sources; never overwrite originals. JPG/PNG product pairs depict the same flat image and are not extra camera angles. Choose about five environment scenes and four to six personal frames for purposeful progression rather than displaying the entire inventory.

### 7. Reference-to-technique matrix
| Accessible reference | Technique actually observable | Dax application | Feasible translation / limits |
| --- | --- | --- | --- |
| Google/Re:Zero composition screenshot | Foreground figure/bright blade, dark background figures, layered architectural framing, strong focal lighting and silhouette separation | Ani-Dax focal framing and optional media-supported confrontation | Composition inspiration only, not a sourcing route. Actual media follows official-source hierarchy/review. CSS/GSAP camera-like emphasis is proposed, NOT motion observed in this still. |
| ChatGPT personal-photo collage | Several distinct portraits and place-rich moments; different crops and context strengths | Traveler distinct-frame sequence and selective Collective previews | Real approved images, masked sequencing, portrait/place alternation; no scroll, pinning, or transition behavior can be established from a collage |
| Earlier Urban Neon Editorial written reference | Explicit blue/violet/cyan palette, controlled magenta, layered panels, hero focus, restrained density | Ani-Dax art direction and menu hierarchy | CSS/SVG materials plus readable Framer-controlled selection; written brief, not analyzed video footage |
| Earlier visual-experience-standard written reference | Intentional layered travel hero, SVG route, warm tactile archive, varied reveals and restraint | Shared motion hierarchy, Traveler map, Vessel material language | CSS/Framer/GSAP according to property ownership; older card/orb instructions are superseded by current V3 scene direction |
| Existing V2 gateway / source inspection | Static first viewport is editorial serif plus portrait; source supports scene state and pinning | Baseline to depart from, not a benchmark to copy | Reuse routing/state techniques but replace opening with architectural spatial selection |
| Existing product mockup composition | Flatlay garment, warm directional shadow, material-colored background, isolated typographic focal areas | Vessel exhibit lighting and perspective framing | CSS light/perspective and image reveal; no observed rotation, exploded view, or 3D mesh |
| Supplied reference videos / external video examples | Unavailable: no video file or usable reference-video URL recovered in searched attachments/notes | Pending camera, scroll, pin, sequencing, transition analysis | Do not claim temporal observations. Analyze actual source only if later supplied; no invented frame timings |

Subject matter alone is not the technique finding. For still references, depth/composition can be observed; scroll behavior, camera movement, pin duration, transition logic, and game-menu timing remain unobserved. Web/product examples not supplied as accessible sources are design analogies, not analyzed references.

### 8. Technical effect map
| Method | Owned responsibilities | Explicit boundary |
| --- | --- | --- |
| CSS | Responsive composition, surfaces, borders, light gradients, perspective, focus/pressed states, optional selective gallery scroll snap | No mandatory full-page scroll snap; no full-screen animated blur on phones |
| GSAP / ScrollTrigger | Primary pinned/scroll-linked stages, spatial transforms, masks, scene handoff | One timeline owns each target property; clean up on navigation/resizing |
| Framer Motion | Route/panel presence, small UI feedback, selected-content transitions, accessible dialog visibility | Do not also drive the same transform/opacity controlled by GSAP |
| React / browser APIs | Meaningful selected state, links/history, gallery controls, responsive/reduced-motion state | Keep all content/controls available without expensive rendering |
| SVG | Approximate public map anchors, route/chapter emphasis, original theory nodes and diagrams | Not a fabricated exact route or flight record |
| Intl.DateTimeFormat | Accurate IANA local clocks and daylight-saving offsets | Independent of depicted photography/weather/hour |
| Native video | Future supplied video, posters, play controls, optional tested seek-based progression | No video asset is established as available; static baseline is not called video |
| Canvas/WebGL | Optional bounded shader accent, only with tested visible payoff and static fallback | Never place essential navigation/content only inside a canvas |
| Three.js / React Three Fiber | Only a future actual model/globe needing 3D scene interaction | Not a baseline dependency; no model in inspected assets, and CSS perspective is not 3D mesh manipulation |

Keep React/CRA and existing tooling. No runtime migration, backend replacement, new database, or new external-service dependency is needed for the baseline.

### 9. Performance risks and alternatives
| Risk | Lower-cost plan |
| --- | --- |
| Loading many 1–2.4 MB PNG library scenes at entry | Prioritize one hero; lazy-load scene images; prefetch only the next scene. Create separate approved responsive browser derivatives later; preserve originals. |
| 150 MP HEIC decode in browser | Keep original in intake; controlled review and separately approved modest web derivative, never a direct public source |
| Full-screen shader, continuous 3D rendering | Static/CSS material field first; at most one visible optional canvas, paused offscreen and disabled when unsupported |
| Complex pinned sections on phones | Short, bounded scenes with in-flow layered progression and explicit selection; reserve long pins for wider screens |
| Multiple controllers and route leaks | Explicit property ownership, scoped styles, listener/timeline cleanup, lazy-loaded world code |
| Heavy glass blur/particles | Small translucent panels, static grain, sparse SVG/CSS accents; remove decorative motion before reducing usability |
| Video seek stalls/data cost | Poster-first responsive clip sources and native play fallback; no scroll-video requirement for baseline |
| Soft imagery enlarged to desktop retina size | Bounded frames or mixed typographic/photographic composition; request a suitable source only for an essential missing hero |
| Continuous clock-driven whole-page rerenders | Update only clock labels at a suitable cadence; no screen-reader announcement for every tick |

Set performance budgets during Build verification against the actual preview/device; don't promise a score or frame rate before measuring. Optimize the coherent iteration once rather than conducting repeated full browser passes after each cosmetic edit.

### 10. Mobile choreography
- Collective: layered vertical media stage plus large world selection targets; no orbiting tiny click zones or pointer simulation. Short transitions retain spatial hierarchy.
- Traveler: full-height photographic moments interleaved with captions; swipeable memory sequence with visible buttons; year rail then vertical details; map has a usable list equivalent.
- Vessel: vertically framed product, tap-based selection, restrained light/reveal; meaningful material annotations stay outside the image rather than microscopic overlays.
- Time-Zone: in-flow full-screen-ish scene passages and an unobtrusive destination/time strip; tap/optional swipe selection plus normal page scroll. Selective snap only inside an optional gallery, never across the entire site.
- Ani-Dax: use a portrait-aware official visual with a short bounded title/theme reveal; show "Read analysis" immediately. Offer full-frame access rather than force a landscape crop. Topic rail/list avoids tiny diagram-node tapping; evidence/source panels and comparison stack vertically; reading stays static.
- Global: comfortable touch targets, readable text, no hover-only content, no trapped scrolling, browser-safe gallery gestures, properly layered dialogs, reduced-motion readable sequence, and equivalent content with expensive effects disabled.

### 11. Real versus conceptual
| Category | Contents |
| --- | --- |
| Implementable now after blueprint approval | Spatial CSS/GSAP world selector, genuine scroll transforms/masks, approved personal still sequence, qualified travel chapters/SVG map, warm flat-product reveal, five selected concept environment scenes, accurate clocks, original theory-diagram interaction, readable content, responsive navigation |
| Requires new asset or review | Authentic official Ani-Dax key/character/promotional visuals or narrowly selected commentary stills, each reviewed for its intended use; authentic destination originals for unverified trips; true garment/fabric/on-body footage or imagery; appropriate 3D model; any travel video; underwater/ruins/sacred/sunrise scenes; branding/lettering check for suspect product mockups |
| Labeled local-prototype placeholder | Neutral Ani-Dax media slots marked "REQUIRES RIGHTS/USE REVIEW", missing-environment scene studies, future video poster/frame outline, optional globe/model composition study. Never replace missing anime media with AI pseudo-anime or describe placeholders as footage/models. |
| Future higher-cost enhancement | Real garment rotation/mesh separation, interactive model/globe, tightly encoded seekable video sequence, shader-enhanced transitions. Each needs an explicit payoff, performance evaluation, and its actual source asset. |

Baseline must feel complete without a wall of "coming soon" placeholders. Existing conceptual imagery can be honest finished brand-discovery content when labeled; authentic travel diary claims cannot be conceptualized into truth.

### 12. Fewest practical phases and approval gate
Use the three phases defined above: protected flagship; remaining distinct worlds; integrated finish. Reuse shared motion/scene/navigation primitives but not one repeated composition. Keep verification proportional: cheap checks during development and one coherent final user-journey pass. Preserve V1 and existing V2 unchanged, give V3 its own route set and dated restore snapshot, and never push, publish, deploy, modify GitHub, or import additional Drive media during planning.

Await Daniel's explicit approval of this blueprint before any implementation. Task state changes alone are not implementation permission; Build-mode assignment is also required.

## Figma-first art direction and approval contract
V3 must support Daniel's Figma-first workflow. Approved frames govern composition, typography, spacing, image placement, and responsive hierarchy. The narrative/motion blueprint describes intended behavior, but its unapproved composition suggestions do not override approved Figma art direction. No Figma files or frames have been reviewed or approved as part of this planning update; their status remains pending.

### Priority frame matrix
All seven major immersive scenes benefit from approved desktop and mobile composition frames before final implementation.

| Priority scene | Figma composition to approve | Key states to specify | Behavior Replit implements around it |
| --- | --- | --- | --- |
| Dax Collective world-selector hero | Original parent-brand typography, four-world spatial arrangement, creator annotation, navigation, depth order, selected-world framing | Opening, active selected world, entrance/handoff | Scroll-linked depth and scale, independent typography, focus/tap selection, real route entrance; no rearranging the approved surfaces |
| Dax Traveler cinematic hero | Approved personal photo and environment, exact placement/framing, face-safe text, title/caption hierarchy | Opening, portrait recession/place expansion, next-scene handoff | Layered photographic progression and media reveal with native scroll; no new portrait choice or inferred trip context |
| Dax Traveler journey/timeline | Geographic overview, period rail, factual chapter hierarchy, photo/detail placement, unknown/approximate labels | Default overview, selected year/place, expanded detail/gallery | Linked timeline/map state, gallery opening, accessible selection/list equivalent; no new chronology or invented route |
| God's Vessel garment interaction | Warm luxury exhibit field, existing archive identity, exact product image, typography, detail annotations and selected-product presentation | Resting garment, reveal/detail, alternate product | Restrained light/perspective and actual product selection; flat mockup stays flat, not an invented 3D model |
| Time-Zone environmental sequence | Selected environment frames, locator/time placement, atmosphere palette, text-safe areas, scene order and transition boundary | Opening environment, representative contrasting environment, scene handoff/closing | Environment framing/light transitions, source/concept labels and independent real clocks; no fabricated missing scenery |
| Ani-Dax theory chamber | Original interface/diagram system, topic/arc controls, node labels, argument/evidence hierarchy and reading layout | Default theory, selected node/analysis, reading/evidence view | Game-menu-style selection, substantive diagram states, source/spoiler controls and readable overlays; not a generic desk composition |
| Ani-Dax cinematic key-visual scene | Actual reviewed official visual or labeled review slot, independent Ani-Dax identity, title/arc/theme, credits and framing/focal boundaries | Visual entry, focal emphasis, transition into theory/evidence | Crop/scale/depth with a single controller and approved boundaries; no pseudo-anime substitute or permanent brand identity built from the featured anime |

Collective and Traveler frames are approved first; the other four scene frames follow before their implementation is finalized. Keep approvals inside the existing three phases rather than adding a separate design/build phase for every scene.

### Minimal practical Figma package
- Begin with one desktop and one mobile composition per priority scene: suggested reference widths are 1440 px desktop and 390 px mobile. These are reference canvases, not hard-coded website dimensions.
- Add a concise state strip or annotations covering entry, key active/mid-scroll state, and exit/handoff. A state strip is not a demand for a full page frame at every scroll percentage.
- Define intermediate layout behavior, including stacking/reflow at tablet widths and usability at 320 px. Add a separate tablet frame only where the composition materially changes.
- Include typography hierarchy and available font references, spacing/layout tokens, colors/materials, navigation geometry, layer order, media asset IDs, image fitting/focal hints, overlay text-safe regions, and required attribution/evidence labels.
- Specify important interaction states: selected, hover/focus/pressed equivalents, expanded/detail, spoiler reveal, source/credit access, missing/review-required media, and reduced-motion/static hierarchy.
- If only a static frame is supplied, unspecified states remain pending design clarification; Replit must not invent a different composition and call it approved.

### Source-of-truth handoff
For each approved scene, record: Figma file/frame link or exported source, node/frame identifier where available, the approved revision/date, Daniel's explicit approval, desktop/mobile/state references, referenced asset IDs, and unresolved items.

Use accessible Figma frames or supplied exports. If live file access is unavailable, request suitable exports plus type/spacing/asset specifications instead of guessing. Do not claim to have inspected an inaccessible file. Figma access, external uploads, exports, or integrations are not activated by this planning update.

Visual design and behavior have distinct responsibilities:
- **Figma governs:** composition, typography, spacing, image placement/framing, responsive hierarchy, visual materials, and important visual states.
- **Replit implements:** route/state logic, scroll choreography, timing/easing between approved states, keyboard/touch behavior, focus management, responsive interpolation, reduced-motion alternatives, lazy loading, and technical fallbacks.
- **Joint review required:** timing that makes approved text unreadable, transformations that obscure faces/credits, missing-asset replacement, changed layouts, font/image substitution, simplified effects that materially change art direction, or a new breakpoint hierarchy.

Where an approved Figma prototype defines timing or transition behavior, follow it unless a documented usability/performance constraint needs approval. Where timing is unspecified, apply the agreed motion system without altering approved geometry.

### Approval and fidelity safeguards
- Use clear scene states: PENDING FRAMES, READY FOR REVIEW, APPROVED REVISION, IMPLEMENTING APPROVED REVISION, and VERIFIED AGAINST APPROVED REVISION. Do not mark nonexistent frames approved.
- Initial blueprint approval is not approval of later Figma revisions; changes need an explicit revision decision. Preserve the last approved reference rather than silently following a moving file.
- Figma composition approval does not grant media rights, clear anime imagery, approve photo alterations, or establish travel dates. Keep asset-use approval and visual approval separate.
- Unapproved scenes stay pending for final implementation. An isolated technical spike is permissible only after implementation authorization and explicit scope agreement; it remains a labeled behavior study, never the accepted design.
- Compare static key states at matching desktop/mobile widths against the approved frames, then verify motion between those states. Check typography, spacing, framing, layer order, selected states, navigation, and responsive hierarchy.
- Preserve accessibility and performance requirements. If an approved design conflicts with readability, required credits, reduced motion, or mobile usability, explain the specific conflict and propose the smallest design adjustment for Daniel's approval rather than freely redesigning it.
- Keep a short discrepancy list of accepted differences and their reasons. Do not use static-frame fidelity as justification for unusable pinning or broken interaction.

The approval sequence is: **blueprint approval → scene Figma approval plus applicable media-use review → implementation of that approved scene → fidelity/behavior verification.** Backup verification and Build assignment remain required before any site edits. V1, V2, original photos/content, no-publishing restrictions, and separate/restorable V3 routes remain unchanged.

## Ani-Dax authentic anime media specification
This is Daniel's current media direction and supersedes older official-art bans, generic workspace imagery, and pseudo-anime placeholder recommendations. It is a planning specification, not authorization to source/download/publish media now.

### Source hierarchy and verification
Prefer the original/high-resolution official version in this exact order:
1. Official anime key visuals.
2. Official teaser/character visuals.
3. Official promotional stills.
4. Selected stills from official trailers/PVs.
5. Limited episode frames directly connected to criticism, review, commentary, or analysis.
6. Daniel-supplied media, retaining known provenance and use limitations rather than automatically marking it rights-cleared.

Find authoritative sources at the anime's official site, publisher, distributor, studio, or official social/press source. Verify the relationship to the publisher/production through first-party references; a repost label or social verification badge alone is not proof. Prefer the original asset over a compressed social copy when legitimately available.

Do not automatically source from random Google Images, Pinterest copies, fan art, wallpaper collections, repost sites, unclear-provenance artwork, or watermarked third-party graphics. The existing Google screenshot remains a composition reference, not a production-media source. Generic desks, notebooks, manga shelves, and AI-generated pseudo-anime are not replacements for real anime imagery.

Official provenance and specific-use approval are different findings. An official public image, an attribution, a Daniel upload, or a criticism/commentary label does not automatically establish permission, fair use, or clearance. Uncertain cases remain exactly "REQUIRES RIGHTS/USE REVIEW", with human review of the proposed use and appropriate rights/legal input where needed.

### Permanent original identity
Keep Ani-Dax's typography, interface, motion language, effects, navigation, theory diagrams, data visualization, and transitions original. Anime imagery is changeable editorial evidence/feature material, not Ani-Dax's permanent wordmark, logo, background wallpaper, mascot system, or entire visual identity. Replacing the featured anime must not require changing the brand design. Preserve original diagrams, but don't mislabel them as authentic source media.

### Provenance record stored with every external asset
Plan one stable asset record and accompanying source metadata/sidecar, with references to immutable originals and any separately approved browser derivatives. Use the existing curated-library conventions as a starting point; do not introduce a new storage provider or imply browser-only edits are durable.

Required fields:
| Field | Meaning and validation |
| --- | --- |
| animeTitle | Actual anime title; do not infer or invent it from a filename |
| assetType | Key visual, teaser/character visual, promotional still, trailer/PV frame, episode still, or Daniel-supplied type |
| sourceURL | Exact originating page/post/video; preserve the original download URL separately when useful. A search-results URL is not provenance. |
| officialSource | Verified source organization/account/domain and official status; distinguish verified official, unverified, and Daniel-supplied/unknown |
| copyrightOwner/publisher | Known credited rightsholder/publisher; explicitly unknown when not established, never invented |
| retrievalDate | Actual retrieval date/time; leave pending for unsourced candidates rather than entering a fictional date |
| intendedUse | Specific placement and purpose: featured analysis hero, cited scene evidence, comparison, or proposed video use; not simply "website" |

Additional fields: stable asset ID; local original/derivative paths; width/height/aspect ratio; source language/edition where material; anime/season/arc/character/episode/scene IDs; source-video timecode for a trailer frame; canon reference; spoiler scope; full-frame focal/framing hints; alt text/caption; associated essay/video/project IDs; required attribution; rights/use status; review notes/evidence; reviewer/date and approval scope; version/checksum and replaced/withdrawn status where appropriate.

Metadata remains attached to the asset, not only embedded in an essay caption. Each derivative points back to its source record. Comparison components retain separate provenance for both inputs. Unknown fields are explicit; do not substitute generic "Original" or blank source records for externally sourced media.

### Review and publishing boundary
1. Record a candidate URL and intended analysis use without importing files.
2. Verify official provenance, resolution, attribution requirements, access restrictions, and spoiler scope.
3. Review whether the specific proposed use is appropriate. Obtain the needed sourcing/download authorization before retrieving selected material.
4. Acquire only selected images or narrowly scoped lawful frames when authorized; never download full episodes, large copyrighted video files, bypass access restrictions, or bulk-capture an episode.
5. Preserve the source separately and create only authorized local browser derivatives. No production hotlinking; source links remain attribution links, not remote image/video sources.
6. Approve each use/placement separately as "APPROVED FOR STATED USE"; otherwise retain "REQUIRES RIGHTS/USE REVIEW", "REJECTED", or "WITHDRAWN".
7. Public/V3 delivery includes only approved local assets for their approved context. Unreviewed originals stay outside public-served folders; the prototype exposes a neutral labeled media slot rather than silently shipping the file.

Existing "Approved"/"Public Safe" flags cannot bypass this provenance/intended-use gate. Reusing an approved web still in a Short, thumbnail, long-form video, or another placement requires reviewing that use, not inheriting blanket approval. Reject or withdraw an asset without destroying its source/audit history; remove it from active delivery and show a clear fallback.

### Key visual editorial experience
- Daniel manually chooses a currently relevant anime and a real feature/argument. No fabricated trending scores, automatic scraping, or auto-published editorial features.
- First viewport: reviewed key visual in a cinematic full-screen composition, with independent Ani-Dax identity, anime/title/arc/theme information, primary analysis action, source/credit access, and spoiler boundary.
- Early scroll: controlled focal framing and depth between image and original interface layers. Preserve required credits; don't fake isolated-character layers or generate missing art/backgrounds from a flat source.
- Middle scroll: official visual recedes into an evidence panel while Daniel's argument, caption, canon reference, and interpretation become primary.
- End of opening: original theory diagram and actual analysis navigation take over; related existing essays/videos appear only afterward.
- No suitable reviewed media: use the neutral slot labeled "REQUIRES RIGHTS/USE REVIEW", not a desk photo or pseudo-anime substitute.
- Phone: portrait-aware fitting, full-frame viewing option, large reading/source controls, short in-flow choreography, and no forced desktop landscape crop. Reduced motion shows the same editorial hierarchy without camera-like movement.

### Reusable commentary components
All components receive asset IDs and provenance/review records; they do not accept an arbitrary remote URL as public media. Shared behavior includes local responsive image delivery, attribution/source access, full-frame view, alt text, spoiler handling, and review-gated rendering.

| Component | Required editorial content and behavior |
| --- | --- |
| KEY VISUAL | Reviewed feature image, anime/title/arc/theme, independent Ani-Dax overlays, analysis link, source/credit, focal hints and full-frame option |
| EPISODE STILL | Selected limited frame, season/episode/scene reference, factual caption, directly connected argument, spoiler scope, and specific-use review |
| TRAILER FRAME | Official PV/trailer source, exact frame timecode where known, promotional/source label, caption and analysis; do not imply a trailer frame proves an aired canon event |
| CHARACTER VISUAL | Official character/teaser source, character identity, relevant discussion, spoiler scope; not repurposed into Ani-Dax's permanent mascot |
| SCENE ANALYSIS | Still/image plus Daniel's own argument, caption, canon reference, interpretation, and spoiler scope. Label confirmed canon/source facts separately from inference; multiple evidence assets preserve their own records. |
| COMPARISON | Two reviewed images/stills with their own sources/canon references, Daniel's comparison and interpretation, labeled sides, and combined spoiler boundary. Desktop side-by-side; phone stack/toggle with equivalent readable content. A slider is optional, not the only access path. |

Spoiler protection applies to media, captions, and revealing alt text together before display. Avoid a first-paint spoiler flash; reveal only deliberately. Source information and component fallbacks remain readable. A missing image does not erase Daniel's available argument, and unavailable analyses/videos are not represented by working-looking dead buttons.

### Media library for site, Shorts, and long-form preparation
Organize through indexed metadata/facets:
**Anime → Season/Arc → Character → Episode/Scene → asset type.**

Use stable IDs and tags rather than moving/renaming originals into a rigid single folder tree. One image may cover several characters/scenes; do not duplicate it to fit every branch. Allow clearly unknown/not-applicable episode or character values for key visuals. Keep episode numbering, season/arc labels, and trailer timecodes source-backed.

Suggested library views: anime/arc/character/episode/type filters; source organization; review status; spoiler scope; selected web feature/evidence placements; planned Short/long-form usage. Review records and required source credits remain accessible when assets are selected for a project.

Future project records reference assets, Daniel's original script/argument, canon citations, proposed limited still/clip ranges where lawful, credit requirements, and destination-specific use review. They do not contain an automatic copyrighted-footage downloader, full episode mirror, generated video, upload, or publish job. A site approval does not authorize YouTube/Shorts usage. No automatic video generation or publication from copyrighted footage.

Initial implementation can use a manually curated manifest and per-asset provenance sidecars with the existing library patterns. Durable metadata is required; a new admin CRUD/persistence system or external integration is not silently added to this redesign. Any later editor must save to the chosen durable store rather than merely localStorage.

### Technical/performance and acceptance additions
- Use CSS and the already planned single-owner GSAP scene for the key-visual framing; Framer handles original menus/evidence panels. No Three.js requirement for a flat key visual.
- Store approved derivatives locally; use responsive sources, reserve aspect ratios, prioritize one hero, lazy-load evidence, and don't prefetch many anime titles.
- A key visual is still imagery; source PVs remain source references unless a specifically authorized small clip is later supplied. Native video is optional and never replaced by downloading large source files.
- Verify all six component states: approved media, review-required neutral slot, missing file, source/credit panel, spoiler conceal/reveal, phone/reduced-motion layout.
- Acceptance requires that a featured title can be changed through records without changing Ani-Dax's permanent identity; every external asset has the seven required provenance fields; incomplete or unreviewed assets cannot enter public delivery; scene analysis includes all five requested editorial fields; comparisons preserve both source records; and neither sourcing nor video output occurs automatically.
- Fold this into the existing remaining-worlds and integrated-finish phases. No additional implementation phase, duplicate Ani-Dax task, app edits, downloads, or media publication is authorized by this planning update.

## Travel accuracy
Use this current user-supplied context where helpful, with loose dates when uncertain:
- Mexico: 2019.
- Bahamas: 2020.
- Puerto Rico and Dubai: 2021.
- Spain, Los Angeles, Las Vegas, Chicago, Guatemala, El Salvador, Germany, Turkey, Colombia: 2022.
- Dominican Republic, Bahamas, Turks & Caicos, Cuba, Panama, Honduras: 2023.
- Cleveland, Ohio: approximately 3–4 months during Tech Elevator in 2024; Toronto, Canada: 2024.
- Peru: approximately six days around Daniel's birthday in July 2025.
- Ghana: approximately three weeks around September–October 2025.
- Texas / DreamCon: June 2026.
- Kenya and London / UK: August 2026.

Retain previously verified finer context when consistent, but do not add new precise dates, itinerary stops, or durations. GPS-tagged Drive files found during the separate read-only search are candidates, not approved imports or independently verified trip dates.

## Out of scope
- Promotion of the redesign to canonical routes before explicit approval, or restoration over the working site during verification.
- Git commits, branches requiring Git activity, GitHub operations, publishing, remote synchronization, or changes to connected Google Drive files.
- Automatically downloading/importing or publishing Drive images; obtain separate approval for selected media before using it.
- Cloud database exports, external service backups, credential exports, new checkout/payment systems, fabricated content, or changes to backend business behavior.
- Replacing the existing React runtime or database, redesigning unrelated admin/investor/legal pages, and implementing the separate canonical Traveler/Ani-Dax upgrade drafts.

## Steps
1. Complete the safety gate: inspect current restore requirements, create the separately dated snapshot, verify its integrity, rehearse restoration, and provide recovery instructions before any redesign edits.
2. Review the existing immersive preview/media and obtain Daniel's scene-specific Figma approvals for the seven priority scenes, with desktop/mobile/state references and media-use review. After implementation authorization, establish the isolated comparison route set; do not finalize an unapproved scene or freely redesign approved art direction.
3. Build the architectural Dax Collective gateway and shared transitions, navigation, depth system, and responsive/reduced-motion behavior without leaking styles or navigation into earlier versions.
4. Develop the cinematic Traveler experience around actual approved photography, personal presence, an immersive gallery, and accurate, qualified travel chronology.
5. Develop God's Vessel into a warm material-rich luxury archive with tasteful interactive product presentation and working links to existing product/signup flows.
6. Develop Time-Zone Travelers into a time-led immersive atlas with full-bleed environments, local clocks, day/night atmosphere, cinematic scene progression, and accessible explicit selection.
7. Develop Ani-Dax's authentic-key-visual-to-analysis sequence, original interface/diagrams, reusable evidence components, provenance metadata, and specific-use review gates rather than a generic desk or repetitive article-card grid. No automatic copyrighted-video generation or publishing.
8. Verify the coherent iteration against approved Figma revisions and key states, then check build health, media availability, interaction behavior, mobile performance, accessibility, and unchanged earlier versions. Deliver local comparison links, accepted visual differences, and any remaining media/access/service limits.

Architectural constraints: build on the existing React/CRA implementation and motion libraries; scope new styles and shared-component changes to the new iteration. Read the frontend design guidance before implementation and use the required design specialist for substantial frontend work; do not activate unrelated project drafts or use remote services merely to finish the preview.

## Relevant files
- `backups/dax-site-v1-current-working-version-2026-10-01/RESTORE-INSTRUCTIONS.md`
- `backups/dax-site-v1-current-working-version-2026-10-01/SHA256SUMS`
- `backups/dax-universe-before-redesign-2026-10-01/RESTORE-INSTRUCTIONS.md`
- `docs/DAX-UNIVERSE-V2-REVIEW.md`
- `docs/DAX-TRAVEL-ASSET-INTAKE.md`
- `dax-main/src/App.jsx`
- `dax-main/package.json`
- `dax-main/src/data/daxTravelHistory.js`
- `dax-main/src/pages/experiments/universe/DaxUniverseApp.jsx`
- `dax-main/src/pages/experiments/universe/UniverseHomePage.jsx`
- `dax-main/src/pages/experiments/universe/UniverseHomePage.css`
- `dax-main/src/pages/experiments/universe/TravelerWorldPage.jsx`
- `dax-main/src/pages/experiments/universe/TravelerWorldPage.css`
- `dax-main/src/pages/experiments/universe/VesselWorldPage.jsx`
- `dax-main/src/pages/experiments/universe/VesselWorldPage.css`
- `dax-main/src/pages/experiments/universe/AniWorldPage.jsx`
- `dax-main/src/pages/experiments/universe/AniWorldPage.css`
- `dax-main/src/pages/experiments/universe/TimeWorldPage.jsx`
- `dax-main/src/pages/experiments/universe/TimeWorldPage.css`
- `dax-main/src/pages/experiments/universe/shared/UniverseShell.jsx`
- `dax-main/src/pages/experiments/universe/shared/UniverseShell.css`
- `.agents/memory/local-preview-approval.md`
