---
name: Immersive overlay layering
description: Accessibility constraint for full-screen overlays inside visually isolated brand experiences.
---

Render full-screen interactive overlays through a document-level portal, above the shared navigation layer. Preserve focus return and background scroll restoration.

**Why:** Brand pages use visual isolation for cinematic depth. A modal nested inside that stacking context can appear underneath the shared sticky navigation even with a large local z-index, making the phone close control unreachable.

**How to apply:** For future lightboxes, full-screen media, or immersive brand dialogs, check the ancestor stacking contexts rather than increasing a descendant z-index blindly. Test touch closing at the top of the viewport as well as keyboard Escape.

## Nested overlays and inert content

Capture a nested overlay's concrete opener before making its parent dialog inert. Keep the parent dialog's original opener and scroll lock for its entire lifetime; suspend only its keyboard handling while a child overlay is open.

**Why:** In the phone browser check, applying inert moved focus to the body before the photo viewer's mount effect ran. Sampling activeElement in that effect lost the thumbnail opener. Re-running the parent effect on suspension also replaced its original external opener with an internal control.

**How to apply:** Pass the opener from the initiating interaction, retain it while stepping through media, and restore it after the parent becomes active again. Check child close → thumbnail focus, then parent close → original page control, with scroll still locked between those closes.