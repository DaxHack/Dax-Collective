import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { metrics, mark, prefersReducedMotion, readTokens, viewportContext } from './motionEnv';

gsap.registerPlugin(ScrollTrigger);

// M03 + M04 + M13 Journey Spine proof. Placeholders only: YEAR · LOCATION · CHAPTER · MEDIA.
const CHAPTERS = [1, 2, 3].map(n => ({ id: `chapter-${n}`, n }));
const PIN_VH = { desktop: 200, tablet: 100 }; // pin distance per chapter, in viewport heights x100
const SWAP_AT = 0.8;

function status(i, current) {
  if (i < current) return 'completed';
  if (i === current) return 'current';
  return 'upcoming';
}

function ChapterJump({ current, onJump }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(current);
  const trigger = useRef(null);
  const list = useRef(null);
  useEffect(() => { if (open) { setActive(current); requestAnimationFrame(() => list.current?.querySelector(`[data-i="${current}"]`)?.focus()); } }, [open, current]);
  const close = (refocus = true) => { setOpen(false); if (refocus) trigger.current?.focus(); };
  const onKey = e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.max(0, Math.min(CHAPTERS.length - 1, active + (e.key === 'ArrowDown' ? 1 : -1)));
      setActive(next); list.current?.querySelector(`[data-i="${next}"]`)?.focus();
    }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(false); onJump(active); }
  };
  return (
    <div className="mp-jump">
      <button ref={trigger} type="button" className="mp-jump-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(o => !o)} data-testid="jump-trigger">
        <span className="mp-meta">YEAR ·</span> CHAPTER {CHAPTERS[current].n} <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <ul ref={list} role="listbox" aria-label="Chapters" className="mp-jump-list" onKeyDown={onKey}>
          {CHAPTERS.map((c, i) => (
            <li key={c.id} role="option" data-i={i} tabIndex={-1} aria-selected={i === current} aria-current={i === current ? 'step' : undefined}
              className={`mp-jump-option is-${status(i, current)}`} onClick={() => { close(false); onJump(i); }}>
              <span className="mp-dot" /> YEAR · CHAPTER {c.n}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function JourneyProof() {
  const root = useRef(null);
  const sections = useRef([]);
  const [ctx, setCtx] = useState(() => viewportContext());
  const [reduced, setReduced] = useState(() => prefersReducedMotion());
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const setCur = useCallback(i => { if (currentRef.current !== i) { currentRef.current = i; setCurrent(i); mark('chapter-current', { i, y: window.scrollY }); } }, []);
  const pinned = !reduced && ctx !== 'mobile';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => setReduced(mq.matches);
    const onResize = () => setCtx(viewportContext());
    mq.addEventListener('change', onMq);
    window.addEventListener('resize', onResize);
    return () => { mq.removeEventListener('change', onMq); window.removeEventListener('resize', onResize); };
  }, []);

  // Desktop / tablet: CSS sticky pin + one ScrollTrigger timeline per chapter (scroll is the only controller).
  useLayoutEffect(() => {
    if (!pinned) return undefined;
    const T = readTokens(root.current);
    const m = metrics(); m.journey = { ctx, progress: {}, scrub: 0.5, pinVh: PIN_VH[ctx] };
    const g = gsap.context(() => {
      sections.current.forEach((sec, i) => {
        if (!sec) return;
        const path = sec.querySelector('.mp-route-path');
        const len = 100; // pathLength="100": dash values are percent of the route (GSAP rounds px, so avoid fractions)
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.5,
            onUpdate: self => {
              m.journey.progress[i] = self.progress;
              if (self.progress >= SWAP_AT && i < CHAPTERS.length - 1) setCur(i + 1);
              else if (self.progress < SWAP_AT && self.progress > 0 && currentRef.current === i + 1) setCur(i);
            },
          },
        });
        tl.fromTo(sec.querySelector('.mp-l1'), { opacity: 0, y: T.distanceReveal }, { opacity: 1, y: 0, duration: 0.1 }, 0)
          .fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.7 }, 0.1)
          .fromTo(sec.querySelector('.mp-media-b'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.4)
          .fromTo(sec.querySelector('.mp-l2'), { opacity: 0, y: T.distanceReveal }, { opacity: 1, y: 0, duration: 0.2 }, 0.6)
          .to({}, { duration: 0.2 }, 0.8);
      });
    }, root);
    mark('journey-pinned-setup', { ctx });
    return () => g.revert();
  }, [pinned, ctx, setCur]);

  // Mobile and reduced motion: no pin, no scrub; current chapter follows what is on screen.
  useEffect(() => {
    if (pinned) return undefined;
    // A thin band 40% down the viewport decides the current chapter (short mobile
    // chapters can share the screen, so "most visible" would pick the wrong one).
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const i = Number(e.target.dataset.i);
        if (e.isIntersecting) { e.target.classList.add('is-active'); setCur(i); }
      });
    }, { rootMargin: '-40% 0px -59% 0px', threshold: 0 });
    sections.current.forEach(s => s && io.observe(s));
    return () => io.disconnect();
  }, [pinned, setCur]);

  const goTo = useCallback(i => {
    const sec = sections.current[i];
    if (!sec) return;
    const headerH = root.current.classList.contains('is-flow') ? root.current.querySelector('.mp-j-head').offsetHeight : 0;
    const top = Math.round(sec.getBoundingClientRect().top + window.scrollY - headerH);
    const heading = sec.querySelector('h2');
    // Programmatic chapter navigation is always instant: smooth scrolling would replay the
    // scrub (route draw, crossfades) through every chapter it passes.
    mark('jump-start', { to: i, smooth: false });
    window.scrollTo({ top, behavior: 'instant' });
    heading.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, '', `#${CHAPTERS[i].id}`);
    setCur(i);
    mark('jump-end', { to: i, y: window.scrollY, top, focused: document.activeElement === heading });
  }, [setCur]);

  // Deep link / reload: restore to the hashed chapter.
  useLayoutEffect(() => {
    const idx = CHAPTERS.findIndex(c => `#${c.id}` === window.location.hash);
    if (idx > 0) {
      const sec = sections.current[idx];
      const headerH = root.current.classList.contains('is-flow') ? root.current.querySelector('.mp-j-head').offsetHeight : 0;
      window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'instant' });
      setCur(idx);
      mark('hash-restored', { idx, y: window.scrollY });
    }
  }, [setCur]);

  return (
    <div ref={root} className={`mp-journey ${pinned ? 'is-pinned' : 'is-flow'} ${reduced ? 'is-reduced' : ''}`} data-ctx={ctx}>
      <a className="mp-skip" href="#mp-journey-end">Skip past the chapters</a>
      <header className="mp-j-head">
        <span className="mp-kicker">JOURNEY SPINE PROOF · PLACEHOLDERS</span>
        <ChapterJump current={current} onJump={goTo} />
      </header>
      {CHAPTERS.map((c, i) => (
        <section
          key={c.id} id={c.id} data-i={i} ref={el => { sections.current[i] = el; }}
          className="mp-chapter" aria-labelledby={`${c.id}-h`}
          style={pinned ? { height: `calc(100vh + ${PIN_VH[ctx]}vh)` } : undefined}
        >
          <div className="mp-stage">
            <div className="mp-spine" aria-hidden="true">
              <span className={`mp-marker is-${status(i, current)}`} />
              <svg className="mp-route" viewBox="0 0 4 200" preserveAspectRatio="none">
                <line className="mp-route-base" x1="2" y1="0" x2="2" y2="200" />
                <path className={`mp-route-path is-${status(i, current)}`} d="M2 0 L2 200" pathLength="100" />
              </svg>
              <span className={`mp-marker is-${status(i + 1, current)}`} />
            </div>
            <div className="mp-media" aria-hidden="true">
              <div className="mp-media-a">MEDIA A</div>
              <div className="mp-media-b">MEDIA B</div>
            </div>
            <div className="mp-copy">
              <p className="mp-meta" aria-current={i === current ? 'step' : undefined} data-testid={`marker-${i}`}>YEAR · LOCATION {i === current ? '· CURRENT' : ''}</p>
              <h2 id={`${c.id}-h`} tabIndex={-1}>CHAPTER {c.n}</h2>
              <p className="mp-l1">Story line 1 — placeholder text.</p>
              <p className="mp-l2">Story line 2 — placeholder text.</p>
              <nav className="mp-steps" aria-label={`Chapter ${c.n} navigation`}>
                <button type="button" className="mp-step" disabled={i === 0} aria-label={`Previous chapter${i > 0 ? `: chapter ${i}` : ''}`} onClick={() => goTo(i - 1)}>←</button>
                <button type="button" className="mp-step" disabled={i === CHAPTERS.length - 1} aria-label={`Next chapter${i < CHAPTERS.length - 1 ? `: chapter ${i + 2}` : ''}`} onClick={() => goTo(i + 1)}>→</button>
              </nav>
            </div>
          </div>
        </section>
      ))}
      <footer id="mp-journey-end" className="mp-j-end" tabIndex={-1}><p>End of proof chapters.</p></footer>
    </div>
  );
}
