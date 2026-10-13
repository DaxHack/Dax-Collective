// Shared helpers for the V3 motion proof: context detection, token reading,
// and lightweight measurement hooks exposed on window.__motionProof.

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function viewportContext() {
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

const ms = v => (v.trim().endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);

export function readTokens(el) {
  const cs = getComputedStyle(el || document.documentElement);
  const get = name => cs.getPropertyValue(name).trim();
  return {
    micro: ms(get('--motion-duration-micro')),
    ui: ms(get('--motion-duration-ui')),
    scene: ms(get('--motion-duration-scene')),
    cinematic: ms(get('--motion-duration-cinematic')),
    standard: get('--motion-easing-standard'),
    enter: get('--motion-easing-enter'),
    exit: get('--motion-easing-exit'),
    cinematicEase: get('--motion-easing-cinematic'),
    distanceUi: parseFloat(get('--motion-distance-ui')),
    distanceReveal: parseFloat(get('--motion-distance-reveal')),
    distanceDepth: parseFloat(get('--motion-distance-depth')),
    push: parseFloat(get('--motion-scale-push')),
  };
}

export function metrics() {
  if (!window.__motionProof) window.__motionProof = { events: [], frames: [] };
  return window.__motionProof;
}

export function mark(name, data = {}) {
  metrics().events.push({ name, t: performance.now(), ...data });
}

// Samples rAF frame intervals for `duration` ms; results appended to metrics().frames.
export function sampleFrames(label, duration) {
  const out = { label, deltas: [] };
  metrics().frames.push(out);
  let last = performance.now();
  const start = last;
  const tick = now => {
    out.deltas.push(now - last);
    last = now;
    if (now - start < duration) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return out;
}
