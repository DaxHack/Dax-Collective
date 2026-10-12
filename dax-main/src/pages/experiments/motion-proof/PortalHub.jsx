import React, { useLayoutEffect, useRef } from 'react';
import { Link, useNavigate, useNavigationType } from 'react-router-dom';
import { animate } from 'framer-motion';
import { mark, prefersReducedMotion, readTokens, sampleFrames, viewportContext } from './motionEnv';

// M05 + M07 portal proof. Placeholder worlds only — no real world names or media.
export const PROOF_PORTALS = [
  { id: 'a', name: 'WORLD A', line: 'Placeholder supporting line', tone: '#3a4a6b' },
  { id: 'b', name: 'WORLD B', line: 'Placeholder supporting line', tone: '#4a3d5e' },
  { id: 'c', name: 'WORLD C', line: 'Placeholder supporting line', tone: '#2f4f4a' },
];
const KEY = 'motionProof:hub';
const bezier = s => (s.match(/[\d.]+/g) || [0.2, 0, 0, 1]).map(Number);

function overlayFor(rect, tone) {
  const ov = document.createElement('div');
  ov.className = 'mp-overlay';
  ov.setAttribute('aria-hidden', 'true');
  ov.style.setProperty('--tone', tone);
  ov.innerHTML = '<div class="mp-ov-arch"><div class="mp-ov-media"></div></div><div class="mp-ov-rect"><div class="mp-ov-media"></div></div>';
  // Radii chosen so the arch is circular at the starting (scaled) size.
  const arch = ov.querySelector('.mp-ov-arch');
  const v = ((rect.width / 2) / rect.height) * 100;
  arch.style.borderTopLeftRadius = `50% ${v}%`;
  arch.style.borderTopRightRadius = `50% ${v}%`;
  document.body.appendChild(ov);
  return ov;
}
const fromRect = r => `translate(${r.left}px, ${r.top}px) scale(${r.width / window.innerWidth}, ${r.height / window.innerHeight})`;
const FULL = 'translate(0px, 0px) scale(1, 1)';

export default function PortalHub() {
  const navigate = useNavigate();
  const navType = useNavigationType();
  const rootRef = useRef(null);
  const busy = useRef(false);

  // Back navigation: restore scroll + focus; play the reverse (M06) only when the saved state matches.
  useLayoutEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { saved = null; }
    const portal = saved && rootRef.current.querySelector(`[data-portal="${saved.portalId}"]`);
    if (navType === 'POP' && saved && portal) {
      window.scrollTo({ top: saved.scrollY, behavior: 'instant' });
      portal.focus({ preventScroll: true });
      mark('hub-restored', { scrollY: window.scrollY, savedY: saved.scrollY, focused: document.activeElement?.dataset?.portal || null });
      if (!prefersReducedMotion()) {
        const T = readTokens(rootRef.current);
        const r = portal.querySelector('.mp-aperture').getBoundingClientRect();
        const ov = overlayFor(r, PROOF_PORTALS.find(p => p.id === saved.portalId)?.tone || '#333');
        ov.style.transform = FULL;
        ov.querySelector('.mp-ov-arch').style.opacity = '0';
        mark('reverse-start');
        Promise.all([
          animate(ov, { transform: [FULL, fromRect(r)] }, { duration: T.scene / 1000, ease: bezier(T.cinematicEase) }),
          animate(ov.querySelector('.mp-ov-rect'), { opacity: [1, 0] }, { delay: T.scene / 2000, duration: T.scene / 2000 }),
          animate(ov.querySelector('.mp-ov-arch'), { opacity: [0, 1] }, { delay: T.scene / 2000, duration: T.scene / 2000 }),
        ]).then(() => { ov.remove(); mark('reverse-end'); });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (navType === 'POP' && saved) mark('hub-pop-no-state');
    }
    sessionStorage.removeItem(KEY);
    return () => { window.history.scrollRestoration = prev; };
  }, [navType]);

  async function enter(event, p) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    const el = event.currentTarget;
    const ctx = viewportContext();
    const reduced = prefersReducedMotion();
    const T = readTokens(rootRef.current);
    const to = `world/${p.id}`;
    sessionStorage.setItem(KEY, JSON.stringify({ scrollY: window.scrollY, portalId: p.id }));
    mark('portal-start', { ctx, reduced, portal: p.id });

    if (reduced) {
      navigate(to, { state: { from: p.id, ctx, reduced } });
      mark('portal-navigate');
      return;
    }
    const desktop = ctx === 'desktop';
    const total = desktop ? T.cinematic : T.scene;
    sampleFrames(`portal-${ctx}`, total + 200);
    el.classList.add('is-entering');

    const r = el.querySelector('.mp-aperture').getBoundingClientRect();
    const ov = overlayFor(r, p.tone);
    ov.style.transform = fromRect(r);
    const seg = desktop
      ? { chrome: [0, 240], siblings: [120, 360], expand: [120, 600], swap: [300, 600], push: [300, total] } // push ends with the cinematic token
      : { chrome: [0, T.ui], siblings: [0, T.ui], expand: [0, T.scene], swap: [T.ui, T.scene], push: null };
    const exit = bezier(T.exit), cine = bezier(T.cinematicEase), std = bezier(T.standard);
    const others = [...rootRef.current.querySelectorAll('.mp-portal')].filter(x => x !== el);
    const chrome = [...rootRef.current.querySelectorAll('.mp-chrome')];
    const run = (targets, kf, [a, b], ease) => (targets.length === 0 ? Promise.resolve()
      : animate(targets, kf, { delay: a / 1000, duration: (b - a) / 1000, ease }));
    const anims = [
      run(chrome, { opacity: 0 }, seg.chrome, exit),
      run(others, { opacity: 0 }, seg.siblings, exit),
      run([ov], { transform: [fromRect(r), FULL] }, seg.expand, cine),
      run([ov.querySelector('.mp-ov-arch')], { opacity: [1, 0] }, seg.swap, std),
      run([ov.querySelector('.mp-ov-rect')], { opacity: [0, 1] }, seg.swap, std),
    ];
    if (seg.push) anims.push(run([...ov.querySelectorAll('.mp-ov-media')], { transform: ['scale(1)', `scale(${T.push})`] }, seg.push, cine));
    // Hand off on the clock, not on animation-promise resolution: promises settle a frame or
    // more after the last keyframe, which pushed end-to-end past the 900 ms criterion.
    // The overlay keeps playing its final frame until the world has mounted.
    await new Promise(resolve => setTimeout(resolve, total));
    mark('portal-anim-end', { ctx });
    navigate(to, { state: { from: p.id, ctx, push: desktop ? T.push : 1 } });
    mark('portal-navigate');
    Promise.all(anims).then(() => requestAnimationFrame(() => requestAnimationFrame(() => { ov.remove(); mark('overlay-removed'); })));
  }

  return (
    <main className="mp-hub" ref={rootRef} aria-labelledby="mp-hub-title">
      <header className="mp-chrome mp-hub-head">
        <p className="mp-kicker">V3 MOTION PROOF · PLACEHOLDER CONTENT</p>
        <h1 id="mp-hub-title">Portal proof (M05 + M07)</h1>
        <p>Activate a portal with click, tap, Enter or Space. Hover and scroll never start the transition.</p>
        <p><Link to="journey">Journey Spine proof (M03 + M04 + M13) →</Link></p>
      </header>
      <div className="mp-chrome mp-spacer" aria-hidden="true" />
      <section className="mp-portals" aria-label="Placeholder worlds">
        {PROOF_PORTALS.map(p => (
          <Link
            key={p.id}
            to={`world/${p.id}`}
            className="mp-portal"
            data-portal={p.id}
            style={{ '--tone': p.tone }}
            onClick={e => enter(e, p)}
            onKeyDown={e => { if (e.key === ' ') enter(e, p); }}
            aria-label={`Enter ${p.name}`}
          >
            <span className="mp-aperture"><span className="mp-media" /></span>
            <span className="mp-lintel" />
            <span className="mp-name">{p.name}</span>
            <span className="mp-line">{p.line}</span>
            <span className="mp-cue">ENTER <b aria-hidden="true">→</b></span>
          </Link>
        ))}
      </section>
      <div className="mp-chrome mp-spacer" aria-hidden="true" />
    </main>
  );
}
