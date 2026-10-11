---
name: Scroll scene tracking
description: Reliable scene selection for responsive pinned layouts and cinematic journeys.
---

Do not use percentage vertical IntersectionObserver margins as viewport-height bands. Those percentages resolve against the root's width, so a seemingly reasonable desktop band can become empty.

**Why:** This caused automatic year/scene progression to stop on wide screens in more than one visual implementation. IntersectionObserver callback entries also contain only changed intersections, not the complete visible set, so choosing from the callback alone can reverse or misidentify the active scene.

**How to apply:** Use height-derived pixel margins and a complete visibility cache, or a passive requestAnimationFrame-throttled reading line based on every chapter's current geometry. Measure actual sticky header/stage obstruction on stacked layouts, refresh on resize, and stabilize any active-scene content that precedes the measured chapters. Guard programmatic jumps until they settle without blocking deliberate user scrolling.

Reset shared pending-work refs when canceling scheduled frames or timers during effect cleanup.

**Why:** React 18 StrictMode preserves refs across its development effect cleanup/remount cycle. A canceled frame's nonzero identifier can otherwise remain as a permanent throttle guard, preventing the remounted scroll listener from scheduling anything.

**How to apply:** Clear the pending frame/timer sentinel together with cancellation, or keep the frame guard local to each effect invocation. Do not assume cleanup cancellation alone clears ref state.