import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, MapPin, X } from 'lucide-react';
import { EVIDENCE, chapterTypeLabels, getYearChapters, personalPhotos, travelHistory, travelYears } from '../../data/daxTravelHistory';
import DaxJourneyMap from './DaxJourneyMap';
import './DaxTravelerJourneyPage.css';

const yearRange = Array.from({ length: travelYears[travelYears.length - 1] - travelYears[0] + 1 }, (_, index) => travelYears[0] + index);
const statusLabel = status => status === EVIDENCE.CONFIRMED ? 'CONFIRMED' : status === EVIDENCE.APPROXIMATE ? 'APPROXIMATE' : 'UNKNOWN';
const chapterMeta = chapter => chapter.period && chapter.period !== String(chapter.year) ? chapter.period : `${chapter.year} · dates not verified`;

function ChapterDialog({ chapter, onClose, onOpenPhoto, onSelectChapter, suspended }) {
  const closeRef = useRef(null);
  const touchStart = useRef(null);
  const suspendedRef = useRef(suspended);
  const openerRef = useRef(document.activeElement);
  const reduceMotion = useReducedMotion();
  const photoIndexBySrc = useMemo(() => new Map(personalPhotos.map((photo, index) => [photo.src, index])), []);
  suspendedRef.current = suspended;

  useEffect(() => {
    const returnFocus = openerRef.current;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const keyHandler = event => {
      if (suspendedRef.current) return;
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll('.dax-v2-dialog button, .dax-v2-dialog a')).filter(item => !item.disabled);
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', keyHandler);
      if (returnFocus?.isConnected && typeof returnFocus.focus === 'function') returnFocus.focus();
    };
  }, [onClose]);

  const onTouchStart = event => {
    if (event.touches.length !== 1) { touchStart.current = null; return; }
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = event => {
    if (!touchStart.current || event.touches.length || event.changedTouches.length !== 1) { touchStart.current = null; return; }
    const touch = event.changedTouches[0];
    const delta = Math.abs(touch.clientX - touchStart.current.x);
    const dy = Math.abs(touch.clientY - touchStart.current.y);
    if (delta > 90 && delta > dy * 1.5) onClose();
    touchStart.current = null;
  };
  const facts = chapter.facts || [];
  const isRelatedTransit = chapter.chapterType === 'transit';
  const related = chapter.relatedJourney ? travelHistory.find(item => item.id === chapter.relatedJourney) : null;
  const photos = chapter.photos || [];

  return createPortal(
    <div className="dax-v2-dialog-root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={() => { touchStart.current = null; }}>
      <button type="button" className="dax-v2-dialog-scrim" onClick={onClose} aria-label="Close chapter detail" />
      <motion.section
        className="dax-v2-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dax-v2-dialog-title"
        aria-hidden={suspended ? 'true' : undefined}
        inert={suspended ? '' : undefined}
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: reduceMotion ? .01 : .22 }}
        data-testid={`chapter-dialog-${chapter.id}`}
      >
        <button type="button" ref={closeRef} className="dax-v2-dialog-close" onClick={onClose} aria-label="Close chapter"><X size={18} /></button>
        <div className="dax-v2-dialog-inner">
          <div className="dax-v2-dialog-head">
            <p className="eyebrow">{chapterTypeLabels[chapter.chapterType] || chapterTypeLabels.travel} · {statusLabel(chapter.evidence.visit)}</p>
            <h2 className="dax-v2-dialog-title" id="dax-v2-dialog-title">{chapter.destination}</h2>
            <p className="dax-v2-dialog-meta">{chapterMeta(chapter)}</p>
            {chapter.locationDetail && <p className="dax-v2-dialog-detail">{chapter.locationDetail}</p>}
          </div>
          <p className="dax-v2-facts-label">WHAT THE RECORD SAYS</p>
          {facts.length > 0 ? (
            <ul className="dax-v2-facts">
              {facts.map((fact, index) => <li key={`${chapter.id}-fact-${index}`} className={fact.status === EVIDENCE.APPROXIMATE ? 'approx' : ''}>{fact.text}<small>{statusLabel(fact.status)} · {fact.source}</small></li>)}
            </ul>
          ) : (
            <p className="dax-v2-no-media">The chronology confirms this chapter and its year. Specific dates, duration, and itinerary details have not been verified.</p>
          )}
          <div className="dax-v2-status-key" aria-label="Evidence status">
            {['visit', 'year', 'dates', 'duration', 'itinerary', 'mediaLocation'].filter(key => chapter.evidence[key]).map(key => (
              <span key={key} className={`dax-v2-evidence ${chapter.evidence[key] === EVIDENCE.APPROXIMATE ? 'approx' : chapter.evidence[key] === EVIDENCE.UNKNOWN ? 'unknown' : ''}`}>{key === 'mediaLocation' ? 'PHOTO LOCATION' : key === 'itinerary' ? 'FULL ITINERARY' : key.toUpperCase()} · {statusLabel(chapter.evidence[key])}</span>
            ))}
          </div>
          <div className="dax-v2-media">
            <div className="dax-v2-media-title"><span>From this chapter</span><small>{photos.length ? 'PERSONAL PHOTOGRAPHS' : 'NO LINKED PHOTOGRAPHS'}</small></div>
            {photos.length ? (
              <div className="dax-v2-media-grid">
                {photos.map(photo => <button type="button" key={photo.src} onClick={event => onOpenPhoto(photoIndexBySrc.get(photo.src), event.currentTarget)} aria-label={`Open personal photograph: ${photo.alt}`} data-testid={`chapter-photo-${chapter.id}-${photo.src.split('/').pop()}`}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <span>{photo.caption}</span>
                </button>)}
              </div>
            ) : <p className="dax-v2-no-media">No photographs are linked to this destination in the record. Personal camera-roll images are not assigned to places without location evidence.</p>}
          </div>
          {related && <button type="button" className="dax-v2-related-link" onClick={() => onSelectChapter(related)}>Part of the Kenya journey: view {related.destination} <ArrowUpRight size={14} /></button>}
          {isRelatedTransit && <p className="dax-v2-record-uncertain">London / Heathrow is recorded as transit, not an independent vacation.</p>}
        </div>
      </motion.section>
    </div>,
    document.body
  );
}

function PersonalViewer({ index, onClose, onStep, opener }) {
  const touchStart = useRef(null);
  const photo = personalPhotos[index];
  const closeRef = useRef(null);
  useEffect(() => {
    const returnFocus = opener;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handler = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') { event.preventDefault(); onStep(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); onStep(1); }
      if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll('.dax-v2-viewer button'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', handler);
      if (returnFocus?.isConnected && typeof returnFocus.focus === 'function') returnFocus.focus({ preventScroll: true });
    };
  }, [onClose, onStep, opener]);
  if (!photo) return null;
  return createPortal(
    <div className="dax-v2-viewer" role="dialog" aria-modal="true" aria-label="Personal camera-roll photograph" onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onTouchStart={event => {
        if (event.touches.length !== 1) { touchStart.current = null; return; }
        touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }}
      onTouchEnd={event => {
        if (!touchStart.current || event.touches.length || event.changedTouches.length !== 1) { touchStart.current = null; return; }
        const dx = event.changedTouches[0].clientX - touchStart.current.x;
        const dy = event.changedTouches[0].clientY - touchStart.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) onStep(dx < 0 ? 1 : -1);
        touchStart.current = null;
      }}
      onTouchCancel={() => { touchStart.current = null; }}
    >
      <button type="button" ref={closeRef} className="dax-v2-dialog-close dax-v2-viewer-close" onClick={onClose} aria-label="Close photo"><X size={18} /></button>
      <button type="button" className="dax-v2-viewer-arrow dax-v2-viewer-prev" onClick={event => { event.stopPropagation(); onStep(-1); }} aria-label="Previous photograph"><ArrowLeft /></button>
      <figure onClick={event => event.stopPropagation()}><img src={photo.src} alt={photo.alt} /><figcaption><span>{photo.locationStatus === EVIDENCE.UNKNOWN ? 'LOCATION NOT YET VERIFIED' : photo.location.toUpperCase()}</span>{photo.caption}</figcaption></figure>
      <button type="button" className="dax-v2-viewer-arrow dax-v2-viewer-next" onClick={event => { event.stopPropagation(); onStep(1); }} aria-label="Next photograph"><ArrowRight /></button>
      <p className="dax-v2-viewer-count">{String(index + 1).padStart(2, '0')} / {String(personalPhotos.length).padStart(2, '0')}</p>
    </div>,
    document.body
  );
}

function TimelineYear({ year, chapters, onOpen }) {
  return (
    <section className="dax-v2-chronology" id={`year-${year}`} data-year={year} aria-labelledby={`year-title-${year}`}>
      <div className="dax-v2-chronology-heading"><span className="dax-v2-year-index">0{year - 2018}</span><h3 id={`year-title-${year}`}>{year}</h3><span>{chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}</span></div>
      <div className="dax-v2-records">
        {chapters.map(chapter => (
          <article className="dax-v2-record" id={`chapter-${chapter.id}`} key={chapter.id}>
            <div className="dax-v2-record-heading"><h4 className="dax-v2-record-title">{chapter.destination}</h4><span className="dax-v2-record-type">{chapterTypeLabels[chapter.chapterType]}</span></div>
            <p className="dax-v2-record-meta">{chapterMeta(chapter)}</p>
            {chapter.facts?.[0] ? <p className="dax-v2-record-fact">{chapter.facts[0].text}</p> : <p className="dax-v2-record-fact">Dates and itinerary details are not verified.</p>}
            <button type="button" className="dax-v2-record-open" onClick={() => onOpen(chapter)} data-testid={`open-chapter-${chapter.id}`}>Open chapter <ArrowUpRight size={13} /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function DaxTravelerJourneyPage() {
  const [activeYear, setActiveYear] = useState(2019);
  const [chapter, setChapter] = useState(null);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const reduceMotion = useReducedMotion();
  const yearBarRef = useRef(null);
  const pendingYearRef = useRef(null);
  const pendingYearTimerRef = useRef(null);
  const photoOpenerRef = useRef(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const portraitX = useTransform(pointerX, [-.5, .5], [5, -5]);
  const portraitY = useTransform(pointerY, [-.5, .5], [4, -4]);
  const lightX = useTransform(pointerX, [-.5, .5], [-11, 11]);
  const lightY = useTransform(pointerY, [-.5, .5], [-8, 8]);
  const groupedYears = useMemo(() => yearRange.map(year => ({ year, chapters: getYearChapters(year) })), []);
  const openChapter = useCallback(item => { setSelectedId(item.id); setChapter(item); }, []);
  const closeChapter = useCallback(() => setChapter(null), []);
  const openPhoto = useCallback((index, opener) => {
    if (!Number.isInteger(index)) return;
    photoOpenerRef.current = opener || document.activeElement;
    setViewerIndex(index);
  }, []);
  const closeViewer = useCallback(() => setViewerIndex(null), []);
  const stepViewer = useCallback(direction => setViewerIndex(current => current === null ? null : (current + direction + personalPhotos.length) % personalPhotos.length), []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('.dax-v2-chronology'));
    let frame = null;
    const update = () => {
      frame = null;
      if (pendingYearRef.current !== null) return;
      const stacked = window.matchMedia('(max-width: 900px)').matches;
      const barBottom = yearBarRef.current?.getBoundingClientRect().bottom || 116;
      const mapBottom = document.querySelector('.dax-v2-map-column')?.getBoundingClientRect().bottom || 348;
      const readingLine = Math.min(window.innerHeight - 30,
        Math.max(stacked ? mapBottom + 24 : barBottom + 40,
          window.innerHeight * (stacked ? .55 : .33)));
      let year = yearRange[0];
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= readingLine) year = Number(target.dataset.year);
        else break;
      }
      setActiveYear(year);
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    const releaseJump = () => {
      pendingYearRef.current = null;
      window.clearTimeout(pendingYearTimerRef.current);
      schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', releaseJump);
    window.addEventListener('scrollend', releaseJump);
    window.addEventListener('wheel', releaseJump, { passive: true });
    window.addEventListener('touchstart', releaseJump, { passive: true });
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', releaseJump);
      window.removeEventListener('scrollend', releaseJump);
      window.removeEventListener('wheel', releaseJump);
      window.removeEventListener('touchstart', releaseJump);
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.clearTimeout(pendingYearTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const current = yearBarRef.current?.querySelector(`[data-year-option="${activeYear}"]`);
    if (!current || !yearBarRef.current) return;
    const bar = yearBarRef.current;
    const left = current.offsetLeft - bar.offsetLeft;
    if (left < bar.scrollLeft || left + current.offsetWidth > bar.scrollLeft + bar.clientWidth) {
      bar.scrollTo({ left: Math.max(0, left - (bar.clientWidth - current.offsetWidth) / 2), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [activeYear, reduceMotion]);

  const movePortrait = event => {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - .5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - .5);
  };
  const resetPortrait = () => { pointerX.set(0); pointerY.set(0); };

  const jumpYear = year => {
    pendingYearRef.current = year;
    window.clearTimeout(pendingYearTimerRef.current);
    pendingYearTimerRef.current = window.setTimeout(() => {
      pendingYearRef.current = null;
      window.dispatchEvent(new Event('scroll'));
    }, 1800);
    setActiveYear(year);
    document.getElementById(`year-${year}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };
  const selectedYearChapters = travelHistory.filter(item => item.year === activeYear);

  return (
    <div className="dax-v2">
      <Helmet>
        <title>The World According to Dax — Daniel Rollins</title>
        <meta name="description" content="Daniel “Dax” Rollins’s personal travel record: a map and timeline of the places in his own chronology." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="dax-v2-noise" aria-hidden="true" />
      <header className="dax-v2-header">
        <a className="dax-v2-brand" href="#dax-v2-top" aria-label="The World According to Dax, beginning"><span className="dax-v2-brand-mark">D</span><span>DANIEL “DAX” ROLLINS</span></a>
        <nav className="dax-v2-nav" aria-label="Preview navigation"><a href="/">HOMEPAGE</a><a href="/dax-the-traveler">TRAVELER V1 <ArrowUpRight size={11} /></a><a href="#journey">THE RECORD</a></nav>
      </header>

      <main>
        <section className="dax-v2-hero" id="dax-v2-top" onPointerMove={movePortrait} onPointerLeave={resetPortrait}>
          <motion.div className="dax-v2-pointer-light" aria-hidden="true" style={reduceMotion ? undefined : { x: lightX, y: lightY }} />
          <div className="dax-v2-hero-grid">
            <div className="dax-v2-hero-copy">
              <p className="eyebrow">A PERSONAL ATLAS · 2019—2026</p>
              <motion.h1 className="dax-v2-hero-title" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? .01 : .65, ease: [.22, .61, .36, 1] }}><span>THE WORLD</span><em>ACCORDING</em><span>TO DAX.</span></motion.h1>
              <p className="dax-v2-intro">Not a guide to everywhere. A record of <strong>where Daniel actually went</strong> — and what the history can honestly say about it.</p>
              <div className="dax-v2-hero-actions"><a href="#journey" className="dax-v2-primary-link">Enter the record <ArrowDown size={15} /></a><span className="dax-v2-intro-note">26 recorded chapters</span></div>
            </div>
            <motion.div className="dax-v2-portrait-stage" style={reduceMotion ? undefined : { x: portraitX, y: portraitY }}>
              <div className="dax-v2-portrait-back" aria-hidden="true" />
              <div className="dax-v2-portrait-image">
                <img src="/images/dax-history/daniel-camera-roll-portrait.jpg" alt="Daniel in a black shirt, in a personal camera-roll portrait" />
                <span className="dax-v2-frame-index">PERSONAL FRAME · LOCATION UNVERIFIED</span>
                <div className="dax-v2-portrait-caption"><span>Daniel “Dax”</span><span>FROM HIS<br />CAMERA ROLL</span></div>
              </div>
              <span className="dax-v2-portrait-side">A RECORD, NOT A ROUTE</span>
            </motion.div>
          </div>
          <div className="dax-v2-scroll-cue"><span /> SCROLL THROUGH THE YEARS <span /></div>
        </section>

        <section className="dax-v2-personal-strip" aria-labelledby="dax-v2-frames-heading">
          <div className="dax-v2-shell">
            <div className="dax-v2-personal-head"><div><p className="eyebrow" id="dax-v2-frames-heading">THE PERSON IN THE RECORD</p></div><p>Camera-roll frames. Place only when supported.</p></div>
            <div className="dax-v2-portrait-reel">
              {personalPhotos.map((photo, index) => (
                <button type="button" key={photo.src} className="dax-v2-reel-photo" onClick={event => openPhoto(index, event.currentTarget)} aria-label={`Open personal photo: ${photo.alt}`} data-testid={`open-personal-photo-${index}`}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <span>{photo.caption}<small className="dax-v2-photo-context">{photo.locationStatus === EVIDENCE.UNKNOWN ? 'LOCATION NOT VERIFIED' : photo.location.toUpperCase()}</small></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="dax-v2-journey" id="journey">
          <div className="dax-v2-shell">
            <div className="dax-v2-journey-head">
              <div><p className="eyebrow">THE WORLD, YEAR BY YEAR</p><h2>Follow the <em>record.</em></h2></div>
              <p>As the years pass, the map lights up. Choose a point or a chapter to see what’s known—and what isn’t.</p>
            </div>
            <nav className="dax-v2-years" ref={yearBarRef} aria-label="Choose a year in Daniel’s travel history">
              {yearRange.map(year => <button key={year} type="button" className={year === activeYear ? 'active' : ''} aria-pressed={year === activeYear} onClick={() => jumpYear(year)} data-year-option={year} data-testid={`year-button-${year}`}>{year}</button>)}
            </nav>
            <div className="dax-v2-workspace">
              <div className="dax-v2-map-column">
                <DaxJourneyMap chapters={travelHistory} activeYear={activeYear} onSelect={openChapter} selectedId={selectedId} />
              </div>
              <div className="dax-v2-journey-flow">
                <aside className="dax-v2-chapter-column" aria-label={`${activeYear} chapter list`}>
                  <div className="dax-v2-chapter-list">
                    <div className="dax-v2-list-head"><span>{activeYear} · CHAPTER INDEX</span><small>{selectedYearChapters.length} entries</small></div>
                    {selectedYearChapters.map(item => <button type="button" key={item.id} className={`dax-v2-chapter-button ${selectedId === item.id ? 'active' : ''}`} onClick={() => openChapter(item)} data-testid={`map-list-chapter-${item.id}`}>
                      <span className="dax-v2-chapter-year">{item.year}</span><span className="dax-v2-chapter-main"><b>{item.destination}</b><small>{chapterTypeLabels[item.chapterType]} · {statusLabel(item.evidence.visit)}</small></span><ChevronRight className="dax-v2-chapter-arrow" size={15} />
                    </button>)}
                    <p className="dax-v2-record-note"><MapPin size={13} /> Map markers are schematic public geographic anchors, not GPS stops. Within-year order is not established.</p>
                  </div>
                </aside>
                <div className="dax-v2-chronology-stack" aria-label="Full chronology">
                  {groupedYears.map(({ year, chapters }) => <TimelineYear key={year} year={year} chapters={chapters} onOpen={openChapter} />)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dax-v2-middle" aria-labelledby="dax-v2-human-heading">
          <div className="dax-v2-shell dax-v2-middle-inner">
            <div className="dax-v2-middle-copy"><p className="eyebrow" style={{ color: '#b85f42' }}>A LIFE IS MORE THAN A PIN</p><h2 id="dax-v2-human-heading">Some places are a chapter. <em>Some become a part of life.</em></h2><p>Cleveland sits in this history as temporary living and learning, not a vacation. The distinction matters as much as the destination.</p></div>
            <div className="dax-v2-memory"><img src={personalPhotos[4].src} alt={personalPhotos[4].alt} loading="lazy" /><div className="dax-v2-memory-quote"><span className="dax-v2-memory-label">ABOUT THIS RECORD</span><p>The chronology keeps confirmed visits, approximate details, and unknowns distinct.</p><small>PERSONAL PORTRAIT<br />LOCATION NOT VERIFIED</small></div></div>
          </div>
        </section>

        <section className="dax-v2-evidence-section">
          <div className="dax-v2-shell dax-v2-evidence-grid">
            <div><p className="eyebrow">READING THIS RECORD</p><h2>Honest about<br />what’s known.</h2></div>
            <div>
              <p>Every location uses an approximate public anchor, not Daniel’s GPS trail. Dates, durations, and itineraries are shown only where the supplied chronology supports them. Unknown means not verified—not that a visit did not happen. Country-level markers do not claim an exact city. The listed entries preserve the record; their order within each year is not a travel route.</p>
              <div className="dax-v2-status-key" aria-label="Evidence definitions"><span className="dax-v2-evidence">CONFIRMED · in Daniel’s record</span><span className="dax-v2-evidence approx">APPROXIMATE · recalled / bounded</span><span className="dax-v2-evidence unknown">UNKNOWN · not verified</span></div>
              <p className="dax-v2-source">Source: Daniel’s first-person travel chronology, supplied October 1, 2026. “Confirmed” reflects first-person supplied information or inspected media—not independent flight-record verification.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="dax-v2-shell dax-v2-footer"><a className="dax-v2-brand" href="#dax-v2-top"><span className="dax-v2-brand-mark">D</span><span>THE WORLD ACCORDING TO DAX</span></a><span>Personal history, faithfully placed.</span><div className="dax-v2-footer-links"><a href="/">Homepage <ArrowUpRight size={11} /></a><a href="/dax-the-traveler">Traveler V1 <ArrowUpRight size={11} /></a></div></footer>

      <AnimatePresence>{chapter && <ChapterDialog key="stable-chapter-dialog" chapter={chapter} onClose={closeChapter} onOpenPhoto={openPhoto} onSelectChapter={openChapter} suspended={viewerIndex !== null} />}</AnimatePresence>
      <AnimatePresence>{viewerIndex !== null && <PersonalViewer index={viewerIndex} onClose={closeViewer} onStep={stepViewer} opener={photoOpenerRef.current} />}</AnimatePresence>
    </div>
  );
}