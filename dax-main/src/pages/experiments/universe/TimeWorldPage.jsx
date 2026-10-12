import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Clock3, Globe2, MapPin, MoveLeft } from 'lucide-react';
import './TimeWorldPage.css';

const mediaRoot = '/assets/approved-media/time-zone-travelers';

const scenes = [
  {
    id: 'tokyo',
    city: 'Tokyo',
    place: 'Shibuya',
    zone: 'Asia/Tokyo',
    image: `${mediaRoot}/2024-tokyo-zone-guide-shibuya.png`,
    alt: 'Wide view across Shibuya crossing and Tokyo city lights',
    chapter: 'Night changes the scale',
    title: <>A city that<br /><em>keeps moving.</em></>,
    copy: 'Crossing lights, stacked horizons, the pulse of a place seen from above. Let the city set the pace before you decide where to go.',
    mood: 'City lights · after dark',
    concept: 'Destination concept',
    description: 'Tokyo, as a visual starting point',
  },
  {
    id: 'paris',
    city: 'Paris',
    place: 'Seine riverbank',
    zone: 'Europe/Paris',
    image: `${mediaRoot}/2023-paris-seine-riverbank-dusk.png`,
    alt: 'The Seine riverbank and Paris lights in the last light of dusk',
    chapter: 'The hour turns blue',
    title: <>Stay for<br /><em>the last light.</em></>,
    copy: 'The river holds the evening for a little longer. A slower scene, a softer edge, and a reminder that arrival is also a way of looking.',
    mood: 'Riverbank · dusk',
    concept: 'Destination concept',
    description: 'Paris, as a visual starting point',
  },
  {
    id: 'atlanta',
    city: 'Atlanta',
    place: 'Airport gate',
    zone: 'America/New_York',
    image: `${mediaRoot}/2024-atlanta-airport-gate-morning.png`,
    alt: 'Quiet airport gate in the soft light of morning',
    chapter: 'Before the next departure',
    title: <>The in-between<br /><em>has its own light.</em></>,
    copy: 'An open gate, the quiet before movement. The journey has a texture of its own, somewhere between the place you left and the place still ahead.',
    mood: 'Airport · morning',
    concept: 'Transit scene concept',
    description: 'Atlanta, between departures',
  },
];

const getZoneParts = (zone, date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(date);
  return {
    time: `${parts.find((part) => part.type === 'hour')?.value ?? '--'}:${parts.find((part) => part.type === 'minute')?.value ?? '--'}`,
    offset: parts.find((part) => part.type === 'timeZoneName')?.value?.replace('GMT', 'UTC') ?? 'UTC',
  };
};

const TimeWorldPage = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const chapterRefs = useRef([]);
  const stageWrapRef = useRef(null);
  const touchStart = useRef(null);
  const pendingJump = useRef(null);
  const settleTimer = useRef(null);
  const scrollFrame = useRef(0);
  const reducedMotion = useReducedMotion();
  const selected = scenes[activeScene];

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const getNavHeight = () => {
      const value = window.getComputedStyle(document.documentElement)
        .getPropertyValue('--universe-nav-height');
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : (window.innerWidth <= 700 ? 64 : 72);
    };

    const syncFromViewport = () => {
      const chapters = chapterRefs.current.filter(Boolean);
      if (!chapters.length) return;
      const navHeight = getNavHeight();
      const stageRect = stageWrapRef.current?.getBoundingClientRect();
      const firstChapterRect = chapters[0].getBoundingClientRect();
      const stageOverlapsChaptersHorizontally = Boolean(
        stageRect
        && stageRect.left < firstChapterRect.right
        && stageRect.right > firstChapterRect.left
      );
      const visibleTop = navHeight + 12;
      const visibleBottom = window.innerHeight - 20;
      const obstructedTop = stageOverlapsChaptersHorizontally
        ? Math.max(visibleTop, stageRect.bottom + 16)
        : visibleTop;
      const readingTop = Math.min(obstructedTop, Math.max(visibleTop, visibleBottom - 56));
      const readingLine = readingTop + Math.max(0, visibleBottom - readingTop) * 0.46;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      chapters.forEach((chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const distance = readingLine < rect.top
          ? rect.top - readingLine
          : readingLine > rect.bottom
            ? readingLine - rect.bottom
            : 0;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveScene((current) => current === closestIndex ? current : closestIndex);
    };

    const scheduleViewportSync = () => {
      if (scrollFrame.current) return;
      scrollFrame.current = window.requestAnimationFrame(() => {
        scrollFrame.current = 0;
        if (pendingJump.current !== null) {
          window.clearTimeout(settleTimer.current);
          settleTimer.current = window.setTimeout(() => {
            pendingJump.current = null;
            syncFromViewport();
          }, 180);
          return;
        }
        syncFromViewport();
      });
    };

    window.addEventListener('scroll', scheduleViewportSync, { passive: true });
    window.addEventListener('resize', scheduleViewportSync, { passive: true });
    scheduleViewportSync();
    return () => {
      window.removeEventListener('scroll', scheduleViewportSync);
      window.removeEventListener('resize', scheduleViewportSync);
      window.cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = 0;
      window.clearTimeout(settleTimer.current);
      settleTimer.current = null;
      pendingJump.current = null;
    };
  }, []);

  const chooseScene = (index, shouldScroll = false) => {
    const normalized = (index + scenes.length) % scenes.length;
    setActiveScene(normalized);
    if (shouldScroll) {
      const chapter = chapterRefs.current[normalized];
      if (chapter) {
        const navValue = window.getComputedStyle(document.documentElement)
          .getPropertyValue('--universe-nav-height');
        const parsedNavHeight = Number.parseFloat(navValue);
        const navHeight = Number.isFinite(parsedNavHeight)
          ? parsedNavHeight
          : (window.innerWidth <= 700 ? 64 : 72);
        const chapterRect = chapter.getBoundingClientRect();
        const stageRect = stageWrapRef.current?.getBoundingClientRect();
        const horizontallyObstructed = Boolean(
          stageRect
          && stageRect.left < chapterRect.right
          && stageRect.right > chapterRect.left
        );
        const scrollOffset = horizontallyObstructed && stageRect
          ? Math.max(navHeight + 20, navHeight + stageRect.height + 24)
          : navHeight + 24;
        pendingJump.current = normalized;
        window.clearTimeout(settleTimer.current);
        settleTimer.current = window.setTimeout(() => {
          pendingJump.current = null;
          const event = new Event('scroll');
          window.dispatchEvent(event);
        }, 1200);
        window.scrollTo({
          top: Math.max(0, window.scrollY + chapterRect.top - scrollOffset),
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }
    }
  };

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const handleTouchEnd = (event) => {
    if (!touchStart.current || event.changedTouches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const deltaX = event.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
      chooseScene(activeScene + (deltaX < 0 ? 1 : -1), true);
    }
    touchStart.current = null;
  };

  return (
    <>
      <Helmet>
        <title>Time-Zone Travelers — A world in many hours</title>
        <meta name="description" content="Move through destination concepts and local hours in a visual atlas of places and the moments between." />
      </Helmet>
      <main className="tzv2-page" id="tzv2-top">
        <section className="tzv2-opening" aria-labelledby="tzv2-title">
          <motion.img
            className="tzv2-opening-image"
            src={scenes[0].image}
            alt={scenes[0].alt}
            initial={reducedMotion ? false : { scale: 1.09, opacity: 0.7 }}
            animate={{ scale: 1.025, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.2, 0.7, 0.2, 1] }}
          />
          <div className="tzv2-opening-shade" />
          <div className="tzv2-opening-grain" />
          <div className="tzv2-opening-inner">
            <motion.div
              className="tzv2-eyebrow tzv2-mono"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: reducedMotion ? 0 : 0.18 }}
            >
              Time-Zone Travelers · a visual atlas
            </motion.div>
            <motion.h1
              className="tzv2-title"
              id="tzv2-title"
              initial={reducedMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: reducedMotion ? 0 : 0.26 }}
            >
              A world in
              <em className="tzv2-serif">many hours.</em>
            </motion.h1>
            <motion.p
              className="tzv2-intro"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: reducedMotion ? 0 : 0.45 }}
            >
              Follow the light across a moving atlas. Three real places, each held in a different hour—and a little room to wander.
            </motion.p>
            <div className="tzv2-opening-bottom">
              <div className="tzv2-opening-index tzv2-mono">
                <strong>01 — 03</strong>
                Visual starting points
              </div>
              <a className="tzv2-scroll-cue tzv2-mono" href="#tzv2-worlds" data-testid="link-enter-time-atlas">
                Enter the atlas <ArrowDown size={15} />
              </a>
            </div>
          </div>
        </section>

        <section className="tzv2-clockbar" aria-label="Live local times">
          <div className="tzv2-shell tzv2-clockbar-inner">
            <div className="tzv2-clock-intro tzv2-mono">
              Right now, elsewhere
              <strong>One world, several local hours.</strong>
            </div>
            <div className="tzv2-clocks">
              {scenes.map((scene) => {
                const local = getZoneParts(scene.zone, now);
                return (
                  <div className="tzv2-clock" key={scene.id} data-testid={`clock-${scene.id}`}>
                    <span className="tzv2-mono">{scene.city}</span>
                    <time dateTime={now.toISOString()}>{local.time}</time>
                    <span className="tzv2-clock-offset tzv2-mono">{local.offset}</span>
                  </div>
                );
              })}
            </div>
            <div className="tzv2-data-note tzv2-mono">Live local times<br />IANA time zones</div>
          </div>
        </section>

        <section className="tzv2-atlas tzv2-shell" id="tzv2-worlds" aria-labelledby="tzv2-atlas-title">
          <div className="tzv2-atlas-heading">
            <div>
              <div className="tzv2-eyebrow tzv2-mono">Scroll the longitude</div>
              <h2 id="tzv2-atlas-title">Choose a place.<br /><em>Find its hour.</em></h2>
            </div>
            <p>Three supported scenes, each a doorway rather than a guidebook. Scroll through the moments or move the atlas by hand.</p>
          </div>

          <div className="tzv2-atlas-layout">
            <div className="tzv2-stage-wrap" ref={stageWrapRef}>
              <div
                className="tzv2-stage"
                aria-label={`${selected.city} visual concept`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={() => { touchStart.current = null; }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selected.id}
                    className="tzv2-stage-image"
                    src={selected.image}
                    alt={selected.alt}
                    initial={reducedMotion ? false : { opacity: 0, scale: 1.07 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
                    transition={{ duration: reducedMotion ? 0.12 : 0.65, ease: [0.2, 0.7, 0.2, 1] }}
                    draggable="false"
                  />
                </AnimatePresence>
                <div className="tzv2-stage-shade" />
                <div className="tzv2-stage-lines" aria-hidden="true" />
                <div className="tzv2-stage-coordinate tzv2-mono">
                  <span>Destination / 0{activeScene + 1}</span>
                  <b>{selected.place}</b>
                </div>
                <div className="tzv2-stage-mark tzv2-mono"><Globe2 size={16} /><span>LOCAL<br />HOUR</span></div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`caption-${selected.id}`}
                    className="tzv2-stage-copy"
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: reducedMotion ? 0.12 : 0.35 }}
                  >
                    <div className="tzv2-stage-count tzv2-mono">{selected.mood}</div>
                    <h3>{selected.city}</h3>
                    <p>{selected.description}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="tzv2-stage-controls">
                  <div className="tzv2-stage-dots" role="group" aria-label="Choose destination scene">
                    {scenes.map((scene, index) => (
                      <button
                        className="tzv2-stage-dot tzv2-mono"
                        type="button"
                        key={scene.id}
                        aria-label={`Show ${scene.city} scene`}
                        aria-pressed={activeScene === index}
                        data-testid={`button-scene-${scene.id}`}
                        onClick={() => chooseScene(index, true)}
                      >
                        0{index + 1}
                      </button>
                    ))}
                  </div>
                  <div className="tzv2-stage-controls-note tzv2-mono">Swipe to move</div>
                  <div className="tzv2-stage-location-time tzv2-mono">{getZoneParts(selected.zone, now).time}</div>
                </div>
              </div>
            </div>

            <div className="tzv2-chapters">
              {scenes.map((scene, index) => (
                <article
                  className={`tzv2-chapter${activeScene === index ? ' is-active' : ''}`}
                  key={scene.id}
                  ref={(node) => { chapterRefs.current[index] = node; }}
                  data-scene-index={index}
                  aria-labelledby={`tzv2-chapter-title-${scene.id}`}
                >
                  <div className="tzv2-chapter-top tzv2-mono">
                    <span>{scene.chapter}</span>
                    <span>0{index + 1} / 03</span>
                  </div>
                  <h3 id={`tzv2-chapter-title-${scene.id}`}>{scene.title}</h3>
                  <div className="tzv2-chapter-copy">{scene.copy}</div>
                  <span className="tzv2-concept-pill tzv2-mono">{scene.concept}</span>
                  <div className="tzv2-chapter-meta tzv2-mono">
                    <MapPin size={13} />{scene.place} · {scene.zone}
                  </div>
                  <button
                    className="tzv2-chapter-jump tzv2-mono"
                    type="button"
                    data-testid={`button-focus-${scene.id}`}
                    onClick={() => chooseScene(index)}
                  >
                    Hold this scene <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tzv2-inbetween" aria-labelledby="tzv2-between-title">
          <div className="tzv2-shell tzv2-inbetween-grid">
            <div className="tzv2-inbetween-copy">
              <div className="tzv2-eyebrow tzv2-mono"><Clock3 size={14} /> The in-between</div>
              <h2 className="tzv2-serif" id="tzv2-between-title">A passage is<br />a place <em>too.</em></h2>
              <p>Quiet gates. Window light. A pause before the next horizon. Travel is not only the point on the map—it is the time spent becoming elsewhere.</p>
            </div>
            <div className="tzv2-layover-visual">
              <img
                className="tzv2-layover-airport"
                src={`${mediaRoot}/2024-atlanta-airport-gate-morning.png`}
                alt="Empty Atlanta airport gate at morning"
                loading="lazy"
              />
              <span className="tzv2-layover-label tzv2-mono">Transit scene concept · Atlanta</span>
              <img
                className="tzv2-layover-carryon"
                src={`${mediaRoot}/2024-atlanta-budget-carryon-setup.png`}
                alt="Carry-on travel essentials arranged for a journey"
                loading="lazy"
              />
              <span className="tzv2-layover-stamp">between</span>
            </div>
          </div>
        </section>

        <section className="tzv2-close tzv2-shell" aria-labelledby="tzv2-close-title">
          <div className="tzv2-close-head">
            <div>
              <div className="tzv2-eyebrow tzv2-mono">A small atlas, still unfolding</div>
              <h2 id="tzv2-close-title">Keep your place<br /><em>in motion.</em></h2>
            </div>
            <p className="tzv2-close-intro">These scenes are visual concepts built from the available local image collection. No guides, itineraries, live travel updates, or bookings are presented here.</p>
          </div>
          <div className="tzv2-route" aria-label="Three destination concepts">
            {scenes.map((scene, index) => (
              <div className="tzv2-route-stop" key={scene.id}>
                <span className="tzv2-mono">0{index + 1} · {scene.concept}</span>
                <strong>{scene.city}</strong>
                <p>{scene.place} · {getZoneParts(scene.zone, now).time} local time</p>
              </div>
            ))}
          </div>
          <footer className="tzv2-footer tzv2-mono">
            <span><strong>Time-Zone Travelers</strong> · Dax Collective universe</span>
            <a href="#tzv2-top" data-testid="link-return-to-top">Back to the first hour <MoveLeft size={13} /></a>
          </footer>
        </section>
      </main>
    </>
  );
};

export default TimeWorldPage;