# Dax Universe V3 — Motion Proof

Status: **DIRECTION APPROVED** (human motion review, 2026-10-11). Proof only, not production.
Route: `/experiments/dax-universe-v3/motion-proof` (`/journey`, `/world/a|b|c`). Placeholder content only — no brand media, no visual polish intended.
Branch: `proof/v3-motion` (isolated; not merged to main). Final production / Figma implementation not started.

## Approved (keep)

| Behaviour | Controller | Notes |
|---|---|---|
| Portal aperture expansion / world takeover | Framer Motion `animate()` | Desktop `--motion-duration-cinematic: 800ms` (human review; was 880) |
| Desktop 1.06× camera push | Framer Motion | `--motion-scale-push: 1.06` desktop, 1.03 phone |
| Sibling fade | Framer Motion | exit easing |
| Hover depth | CSS | |
| Journey Spine pinning (desktop / tablet) | CSS sticky + GSAP ScrollTrigger | 200vh / 100vh pin per chapter |
| Scroll scrub, media crossfade, route draw, story reveals | GSAP ScrollTrigger `scrub: 0.5` | route uses `pathLength="100"` |
| Reverse portal restoration (Back) | Framer Motion | restores scroll + focus |
| Reduced-motion behaviour | CSS tokens + JS | immediate navigation, no pin, no scrub |
| Mobile / tablet portal | Framer Motion | scene token, ~480 ms, no push |
| Chapter Jump + Previous / Next | `scrollTo({behavior:'instant'})` | instant positioning, focus h2, `replaceState` hash — no smooth-scroll replay |

## PROPOSED / NEEDS TESTING (not approved)

- Ambient glow — dropped from baseline; optional future enhancement.
- `--motion-distance-ui`, `--motion-distance-depth` — PROPOSED, not exercised by the approved behaviours.
- Firefox, Safari / WebKit, real iOS / Android devices, GPU-accelerated hardware — NOT TESTED.
- All browser / device-specific findings below are Chromium-headless only.

## Measured results (headless Chromium 141, software rendering)

| Metric | 800 ms (final) |
|---|---|
| Desktop portal animation (n=15, Enter/Space/click) | min 804.2 · median 806.6 · max 808.6 ms |
| Activation → world mounted | min 812.6 · median 820.2 · max 830.2 ms |
| Tablet / mobile portal | 484.7 / 487.2 ms |
| Reduced motion → world | 17.4 ms, no animation |
| Focus to world H1 / Back restores scroll + focus | 15/15 / 15/15 |
| Reverse portal | 482–499 ms |
| Chapter Jump elapsed | ≈1 ms (instant), 0 history entries added |
| Frames > 50 ms | 19 across 15 runs, worst 83.3 ms (overlay creation, arch→rect swap) |

## Known minor issues (open, not fixed)

1. Desktop / tablet: current-chapter marker flips 3 → 2 → 3 for a frame right after an instant jump; final state correct.
2. Flow mode (mobile, reduced): Next button and reload land 4 px above the chapter top; Chapter Jump lands exactly.
3. Mobile: jump to the last chapter is clamped by the page's maximum scroll (890 vs 969 px) — no content below the last chapter in the proof.
4. Mobile LCP ≈ 2.84 s on 4G / 4× CPU — app main bundle (336 kB), not motion.

## Raw measurements

- `v3-motion-proof/01-initial-proof-results.json` — first proof run (900 ms)
- `v3-motion-proof/02-correction-880ms-results.json` — correction pass (880 ms, instant navigation)
- `v3-motion-proof/03-final-800ms-results.json` — human-review adjustment (800 ms)
- `v3-motion-proof/screens.png` — placeholder screenshots

## Remaining verification before production

- Firefox (portal WAAPI timing, ScrollTrigger pin, `behavior:'instant'`).
- Safari / WebKit desktop + iOS Safari (sticky pin, scrub smoothness, focus with `preventScroll`).
- Real Android and iOS devices (tap activation, 480 ms portal feel, frame pacing on GPU).
- Screen reader pass (VoiceOver, NVDA) on portal focus hand-off and Chapter Jump listbox.
- Figma Motion variables and handoff doc still list cinematic 900 ms → update to 800 ms when production implementation begins.
