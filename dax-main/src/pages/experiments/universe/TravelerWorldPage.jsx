import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EVIDENCE, chapterTypeLabels, personalPhotos, travelHistory, travelYears } from '../../../data/daxTravelHistory';
import './TravelerWorldPage.css';

const yearRange = Array.from(
  { length: travelYears[travelYears.length - 1] - travelYears[0] + 1 },
  (_, index) => travelYears[0] + index,
);
const statusName = status => status === EVIDENCE.CONFIRMED ? 'CONFIRMED' : status === EVIDENCE.APPROXIMATE ? 'APPROXIMATE' : 'UNKNOWN';
const chapterPeriod = chapter => chapter.period && chapter.period !== String(chapter.year)
  ? chapter.period
  : `${chapter.year} · exact dates not verified`;

const coastlines = [
  'M77 135 93 121 117 118 135 108 162 112 173 123 167 137 154 142 147 154 134 158 126 171 117 164 113 151 100 149 94 139Z',
  'M145 172 158 176 164 189 160 204 167 216 162 234 155 249 148 239 150 222 144 207 146 192Z',
  'M216 117 228 113 239 119 242 130 233 134 224 128Z',
  'M278 127 294 113 319 110 338 118 361 112 386 118 406 108 431 115 446 127 435 137 416 136 404 145 386 141 373 151 354 146 336 154 316 146 302 149 292 138Z',
  'M286 155 298 151 308 160 304 178 297 194 292 211 283 225 275 217 279 200 276 184 281 170Z',
  'M359 157 372 153 383 160 378 172 369 175 363 168Z',
  'M389 188 407 182 425 189 433 201 426 211 411 210 400 218 388 209Z',
  'M440 215 457 209 473 214 470 222 452 224Z',
  'M489 220 508 214 530 220 538 231 532 239 515 236 501 241 489 232Z',
  'M450 254 465 251 479 258 477 270 465 276 453 268Z',
];

const projectPoint = ([longitude, latitude]) => ({
  x: ((longitude + 180) / 360) * 600,
  y: ((90 - latitude) / 180) * 300,
});

function PhotoFigure({ photo, index, onOpen, className = '' }) {
  const verified = photo.locationStatus !== EVIDENCE.UNKNOWN;
  return (
    <button
      className={`traveler-photo ${className}`}
      type="button"
      onClick={event => onOpen(index, event.currentTarget)}
      aria-label={`Open personal camera-roll photograph: ${photo.alt}`}
      data-testid={`traveler-photo-${index}`}
    >
      <img src={photo.src} alt={photo.alt} loading={index < 3 ? 'eager' : 'lazy'} />
      <span className="traveler-photo-stamp">{verified ? 'PLACE CONFIRMED' : 'PLACE NOT VERIFIED'}</span>
      <span className="traveler-photo-caption">
        <span>{photo.caption}</span>
        <small>{verified ? photo.location : 'PERSONAL FRAME · LOCATION UNKNOWN'}</small>
      </span>
      <span className="traveler-photo-open" aria-hidden="true"><ArrowUpRight size={17} /></span>
    </button>
  );
}

function MemorySequence({ reduceMotion, onOpenPhoto }) {
  const sectionRef = useRef(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', progress => {
    const next = Math.min(personalPhotos.length - 1, Math.floor(progress * personalPhotos.length));
    setActiveFrame(next);
  });

  return (
    <section className="traveler-memory-journey" ref={sectionRef} aria-labelledby="traveler-memory-title">
      <div className="traveler-memory-pin">
        <div className="traveler-memory-heading">
          <p className="traveler-eyebrow"><span>01</span> THE CAMERA ROLL</p>
          <h2 id="traveler-memory-title">Not a postcard.<br /><em>A life in frames.</em></h2>
          <p className="traveler-memory-note">Personal photographs, placed only where Daniel’s record supports them.</p>
          <div className="traveler-memory-progress" aria-label={`Frame ${activeFrame + 1} of ${personalPhotos.length}`}>
            {personalPhotos.map((photo, index) => (
              <span key={photo.src} className={index === activeFrame ? 'is-current' : index < activeFrame ? 'is-past' : ''}>
                {String(index + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
        </div>
        <div className="traveler-memory-stage" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              className="traveler-memory-image-wrap"
              key={activeFrame}
              initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 1.025 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.2, 0.72, 0.2, 1] }}
            >
              <PhotoFigure photo={personalPhotos[activeFrame]} index={activeFrame} onOpen={onOpenPhoto} />
              <span className="traveler-frame-counter">{String(activeFrame + 1).padStart(2, '0')} <i /> {String(personalPhotos.length).padStart(2, '0')}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="traveler-memory-side-note">DANIEL’S CAMERA ROLL <span>·</span> NO RECONSTRUCTED SCENES</p>
      </div>
      <div className="traveler-memory-steps" aria-label="Personal photo sequence">
        {personalPhotos.map((photo, index) => (
          <div className="traveler-memory-step" key={photo.src} aria-hidden="true">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>{photo.locationStatus === EVIDENCE.UNKNOWN ? 'A portrait without a verified place.' : photo.location}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AtlasMap({ activeYear, selectedId, onSelect }) {
  return (
    <div className="traveler-map-stage">
      <div className="traveler-map-meta">
        <span>WORLD INDEX · {activeYear}</span>
        <span>26 CHAPTERS / 25 DESTINATIONS</span>
      </div>
      <svg className="traveler-map" viewBox="0 0 600 300" role="group" aria-label="Schematic world map with approximate chapter anchors">
        <defs>
          <pattern id="traveler-map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" className="traveler-map-gridline" />
          </pattern>
        </defs>
        <rect width="600" height="300" fill="url(#traveler-map-grid)" />
        <g className="traveler-map-coast" aria-hidden="true">{coastlines.map((path, index) => <path key={index} d={path} />)}</g>
        <path className="traveler-map-equator" d="M0 150H600M300 0V300" aria-hidden="true" />
        {travelHistory.map(chapter => {
          const point = projectPoint(chapter.coordinates);
          const same = travelHistory.filter(item => item.coordinates[0] === chapter.coordinates[0] && item.coordinates[1] === chapter.coordinates[1]);
          const offset = same.length > 1 ? (same.findIndex(item => item.id === chapter.id) - (same.length - 1) / 2) * 7 : 0;
          const isCurrent = chapter.year === activeYear;
          return (
            <g
              key={chapter.id}
              className={`traveler-map-point ${chapter.year <= activeYear ? 'is-lit' : ''} ${isCurrent ? 'is-year' : ''} ${selectedId === chapter.id ? 'is-selected' : ''}`}
              transform={`translate(${point.x + offset} ${point.y})`}
              role="button"
              tabIndex="0"
              aria-label={`${chapter.destination}, ${chapter.year}. Open chapter.`}
              aria-pressed={selectedId === chapter.id}
              onClick={event => onSelect(chapter, event.currentTarget)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(chapter);
                }
              }}
              data-testid={`traveler-map-point-${chapter.id}`}
            >
              <circle className="traveler-map-halo" r="8" />
              <circle className="traveler-map-dot" r={chapter.chapterType === 'transit' ? 2.6 : 3.4} />
              <title>{chapter.destination} · {chapter.year}</title>
            </g>
          );
        })}
      </svg>
      <div className="traveler-map-foot"><MapPin size={13} /><span>Approximate public anchors. No GPS trail or route is implied.</span></div>
      <span className="traveler-map-watermark" aria-hidden="true">ATLAS<br />01—26</span>
    </div>
  );
}

function ChapterDialog({ chapter, opener, onClose, onOpenPhoto, suspended, onRelated }) {
  const closeRef = useRef(null);
  const suspendedRef = useRef(suspended);
  const touchStart = useRef(null);
  const reduceMotion = useReducedMotion();
  suspendedRef.current = suspended;
  const related = chapter.relatedJourney ? travelHistory.find(item => item.id === chapter.relatedJourney) : null;
  const chapterPhotos = chapter.photos || [];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const keydown = event => {
      if (suspendedRef.current) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const controls = [...document.querySelectorAll('.traveler-dialog:not([inert]) button, .traveler-dialog:not([inert]) a')]
          .filter(element => !element.disabled);
        if (!controls.length) return;
        if (event.shiftKey && document.activeElement === controls[0]) {
          event.preventDefault();
          controls[controls.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
          event.preventDefault();
          controls[0].focus();
        }
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', keydown);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [onClose, opener]);

  const touchDown = event => {
    if (event.touches.length !== 1) { touchStart.current = null; return; }
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };
  const touchUp = event => {
    if (!touchStart.current || event.touches.length !== 0 || event.changedTouches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    if (Math.abs(dx) > 100 && Math.abs(dx) > Math.abs(dy) * 1.5) onClose();
    touchStart.current = null;
  };
  const photos = chapterPhotos.map(photo => ({ photo, index: personalPhotos.findIndex(item => item.src === photo.src) }));

  return createPortal(
    <div
      className="traveler-dialog-root"
      onTouchStart={touchDown}
      onTouchEnd={touchUp}
      onTouchCancel={() => { touchStart.current = null; }}
    >
      <button type="button" className="traveler-dialog-scrim" onClick={onClose} aria-label="Close chapter detail" />
      <motion.section
        className="traveler-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="traveler-dialog-title"
        aria-hidden={suspended ? 'true' : undefined}
        inert={suspended ? '' : undefined}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
        transition={{ duration: reduceMotion ? 0 : 0.24 }}
        data-testid={`traveler-dialog-${chapter.id}`}
      >
        <button ref={closeRef} className="traveler-dialog-close" type="button" onClick={onClose} aria-label="Close chapter"><X size={19} /></button>
        <div className="traveler-dialog-content">
          <p className="traveler-eyebrow"><span>{String(travelHistory.indexOf(chapter) + 1).padStart(2, '0')}</span> {chapterTypeLabels[chapter.chapterType]} · {statusName(chapter.evidence.visit)}</p>
          <h2 id="traveler-dialog-title">{chapter.destination}</h2>
          <p className="traveler-dialog-period">{chapterPeriod(chapter)}</p>
          {chapter.locationDetail && <p className="traveler-dialog-detail">{chapter.locationDetail}</p>}
          <div className="traveler-facts-heading"><span>WHAT THE RECORD SAYS</span><span>FIRST-PERSON CHRONOLOGY</span></div>
          {chapter.facts?.length ? (
            <ul className="traveler-facts">
              {chapter.facts.map((fact, index) => (
                <li className={fact.status === EVIDENCE.APPROXIMATE ? 'is-approx' : ''} key={`${chapter.id}-${index}`}>
                  <span>{fact.text}</span><small>{statusName(fact.status)} · {fact.source}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="traveler-unverified">The chronology confirms this chapter and its year. Specific dates, duration and itinerary details have not been verified.</p>
          )}
          <div className="traveler-status-list" aria-label="Evidence status">
            {Object.entries(chapter.evidence).map(([key, value]) => (
              <span className={value === EVIDENCE.APPROXIMATE ? 'is-approx' : value === EVIDENCE.UNKNOWN ? 'is-unknown' : ''} key={key}>
                {key === 'mediaLocation' ? 'PHOTO LOCATION' : key === 'itinerary' ? 'ITINERARY' : key.toUpperCase()} · {statusName(value)}
              </span>
            ))}
          </div>
          <div className="traveler-dialog-media">
            <div className="traveler-dialog-media-heading"><span>Photographs linked to this chapter</span><small>{chapterPhotos.length ? 'PERSONAL CAMERA ROLL' : 'NO VERIFIED PLACE-LINKED PHOTOS'}</small></div>
            {chapterPhotos.length ? (
              <div className="traveler-dialog-photos">
                {photos.map(({ photo, index }) => (
                  <button key={photo.src} type="button" onClick={event => onOpenPhoto(index, event.currentTarget)} aria-label={`Open photograph: ${photo.alt}`}>
                    <img src={photo.src} alt={photo.alt} loading="lazy" />
                    <span>{photo.caption}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="traveler-unverified">No photographs are linked to this destination. Location-unknown portraits remain unassigned.</p>
            )}
          </div>
          {related && (
            <button className="traveler-related" type="button" onClick={() => onRelated(related)}>
              Related chapter: {related.destination}<ArrowUpRight size={15} />
            </button>
          )}
          {chapter.chapterType === 'transit' && <p className="traveler-transit-note">London / Heathrow is recorded as transit, not an independent vacation.</p>}
        </div>
      </motion.section>
    </div>,
    document.body,
  );
}

function PhotoViewer({ index, opener, onClose, onStep, suspended }) {
  const photo = personalPhotos[index];
  const closeRef = useRef(null);
  const touchStart = useRef(null);
  const suspendedRef = useRef(suspended);
  suspendedRef.current = suspended;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const keydown = event => {
      if (suspendedRef.current) return;
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); onStep(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); onStep(1); }
      if (event.key === 'Tab') {
        const controls = [...document.querySelectorAll('.traveler-viewer:not([inert]) button')];
        if (event.shiftKey && document.activeElement === controls[0]) {
          event.preventDefault();
          controls[controls.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
          event.preventDefault();
          controls[0].focus();
        }
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', keydown);
      if (!suspendedRef.current && opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [onClose, onStep, opener]);

  if (!photo) return null;
  const touchDown = event => {
    if (event.touches.length !== 1) { touchStart.current = null; return; }
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };
  const touchUp = event => {
    if (!touchStart.current || event.touches.length !== 0 || event.changedTouches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) onStep(dx < 0 ? 1 : -1);
    touchStart.current = null;
  };

  return createPortal(
    <div
      className="traveler-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Personal camera-roll photograph"
      aria-hidden={suspended ? 'true' : undefined}
      inert={suspended ? '' : undefined}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onTouchStart={touchDown}
      onTouchEnd={touchUp}
      onTouchCancel={() => { touchStart.current = null; }}
    >
      <button ref={closeRef} className="traveler-viewer-close" type="button" onClick={onClose} aria-label="Close photograph"><X size={19} /></button>
      <button className="traveler-viewer-arrow is-prev" type="button" onClick={() => onStep(-1)} aria-label="Previous photograph"><ArrowLeft /></button>
      <figure>
        <img src={photo.src} alt={photo.alt} />
        <figcaption>
          <span>{photo.locationStatus === EVIDENCE.UNKNOWN ? 'LOCATION NOT YET VERIFIED' : photo.location.toUpperCase()}</span>
          {photo.caption}
        </figcaption>
      </figure>
      <button className="traveler-viewer-arrow is-next" type="button" onClick={() => onStep(1)} aria-label="Next photograph"><ArrowRight /></button>
      <p className="traveler-viewer-count">{String(index + 1).padStart(2, '0')} / {String(personalPhotos.length).padStart(2, '0')}</p>
    </div>,
    document.body,
  );
}

export default function TravelerWorldPage() {
  const reduceMotion = useReducedMotion();
  const [activeYear, setActiveYear] = useState(2019);
  const [selectedId, setSelectedId] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapterOpener, setChapterOpener] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(null);
  const [photoOpener, setPhotoOpener] = useState(null);
  const yearRail = useRef(null);
  const chaptersForYear = useMemo(() => travelHistory.filter(item => item.year === activeYear), [activeYear]);

  const openChapter = useCallback((item, opener) => {
    setSelectedId(item.id);
    setChapterOpener(opener || document.activeElement);
    setChapter(item);
  }, []);
  const closeChapter = useCallback(() => setChapter(null), []);
  const openPhoto = useCallback((index, opener) => {
    if (!Number.isInteger(index) || index < 0) return;
    setPhotoOpener(opener || document.activeElement);
    setPhotoIndex(index);
  }, []);
  const closePhoto = useCallback(() => setPhotoIndex(null), []);
  const stepPhoto = useCallback(direction => {
    setPhotoIndex(current => current === null ? null : (current + direction + personalPhotos.length) % personalPhotos.length);
  }, []);

  useEffect(() => {
    const active = yearRail.current?.querySelector(`[data-year="${activeYear}"]`);
    if (!active || !yearRail.current) return;
    const rail = yearRail.current;
    const left = active.offsetLeft - rail.offsetLeft;
    if (left < rail.scrollLeft || left + active.offsetWidth > rail.scrollLeft + rail.clientWidth) {
      rail.scrollTo({ left: Math.max(0, left - (rail.clientWidth - active.offsetWidth) / 2), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [activeYear, reduceMotion]);

  const chooseYear = year => {
    setActiveYear(year);
    setSelectedId(null);
  };

  return (
    <main className="traveler-world">
      <section className="traveler-hero" aria-labelledby="traveler-title">
        <div className="traveler-hero-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="traveler-hero-copy">
          <p className="traveler-eyebrow"><span>00</span> THE TRAVELER · DANIEL “DAX” ROLLINS</p>
          <h1 id="traveler-title"><span>A life,</span><em>in places.</em></h1>
          <p className="traveler-hero-deck">Daniel’s camera roll. His first-person chronology. A living record of where he’s been—and what each frame can honestly tell us.</p>
          <a className="traveler-enter" href="#memory-sequence">Enter the record <ArrowDown size={15} /></a>
          <div className="traveler-hero-stats">
            <div><strong>26</strong><span>CHAPTERS</span></div>
            <i />
            <div><strong>2019—26</strong><span>YEARS IN VIEW</span></div>
            <i />
            <div><strong>01</strong><span>PERSONAL CHRONOLOGY</span></div>
          </div>
        </div>
        <div className="traveler-hero-portrait">
          <div className="traveler-hero-image">
            <img src="/images/dax-history/daniel-camera-roll-portrait.jpg" alt="Daniel in a black shirt, in a personal camera-roll portrait" />
            <span className="traveler-image-index">CAMERA ROLL / 07</span>
            <span className="traveler-portrait-caption"><b>Daniel “Dax”</b><small>PERSONAL PORTRAIT<br />LOCATION UNKNOWN</small></span>
          </div>
          <span className="traveler-hero-portrait-label">NOT A STOCK IMAGE · HIS OWN CAMERA ROLL</span>
        </div>
        <div className="traveler-hero-bottom"><span>AN INCOMPLETE ATLAS, BY DESIGN</span><span>SCROLL TO MOVE THROUGH THE YEARS <ArrowDown size={12} /></span></div>
        <span className="traveler-hero-index" aria-hidden="true">TRAVEL<br />WORLD / 01</span>
      </section>

      <div id="memory-sequence">
        <MemorySequence reduceMotion={reduceMotion} onOpenPhoto={openPhoto} />
      </div>

      <section className="traveler-bridge" aria-label="Chronology introduction">
        <span className="traveler-bridge-index">02 / THE JOURNEY</span>
        <p>Some years arrive as a list.<br /><em>Some become a turning point.</em></p>
        <span className="traveler-bridge-mark" aria-hidden="true">D.</span>
      </section>

      <section className="traveler-atlas" id="traveler-atlas" aria-labelledby="traveler-atlas-title">
        <div className="traveler-atlas-intro">
          <div>
            <p className="traveler-eyebrow"><span>02</span> YEARS, NOT A ROUTE</p>
            <h2 id="traveler-atlas-title">The map is a<br /><em>memory aid.</em></h2>
          </div>
          <p className="traveler-atlas-explainer">Pick a year. The map answers with places from Daniel’s chronology—not a traced itinerary. Select any point or chapter to open its full record.</p>
        </div>
        <nav className="traveler-year-rail" ref={yearRail} aria-label="Choose a year in Daniel’s travel history">
          {yearRange.map(year => (
            <button
              type="button"
              className={activeYear === year ? 'is-active' : ''}
              aria-pressed={activeYear === year}
              onClick={() => chooseYear(year)}
              key={year}
              data-year={year}
              data-testid={`traveler-year-${year}`}
            >
              <span>{year}</span><i />
            </button>
          ))}
        </nav>
        <div className="traveler-atlas-layout">
          <AtlasMap activeYear={activeYear} selectedId={selectedId} onSelect={(item, opener) => openChapter(item, opener)} />
          <div className="traveler-chapter-list" aria-live="polite" aria-label={`${activeYear} chapters`}>
            <div className="traveler-chapter-list-head">
              <div><span>CHAPTER INDEX</span><b>{activeYear}</b></div>
              <small>{chaptersForYear.length} {chaptersForYear.length === 1 ? 'ENTRY' : 'ENTRIES'}</small>
            </div>
            {chaptersForYear.map((item, index) => (
              <button
                className={`traveler-chapter-row ${selectedId === item.id ? 'is-selected' : ''}`}
                type="button"
                key={item.id}
                onClick={event => openChapter(item, event.currentTarget)}
                data-testid={`traveler-chapter-${item.id}`}
              >
                <span className="traveler-chapter-no">{String(index + 1).padStart(2, '0')}</span>
                <span className="traveler-chapter-main"><b>{item.destination}</b><small>{chapterTypeLabels[item.chapterType]} <i>·</i> {statusName(item.evidence.visit)}</small></span>
                <ChevronRight size={16} />
              </button>
            ))}
            <p className="traveler-list-caveat"><MapPin size={13} /> Markers are approximate public geographic anchors. Within-year order is not established.</p>
          </div>
        </div>
        <div className="traveler-selected-note">
          <span>YEAR IN VIEW</span><strong>{activeYear}</strong><span>Every listed chapter opens with its details, evidence status and source.</span>
        </div>
      </section>

      <section className="traveler-turning-point" aria-labelledby="traveler-turn-title">
        <div className="traveler-turn-image">
          <img src={personalPhotos[4].src} alt={personalPhotos[4].alt} loading="lazy" />
          <span>PERSONAL PORTRAIT · PLACE NOT VERIFIED</span>
        </div>
        <div className="traveler-turn-copy">
          <p className="traveler-eyebrow"><span>03</span> A CHAPTER CAN CHANGE SHAPE</p>
          <h2 id="traveler-turn-title">Not every<br />place is a <em>trip.</em></h2>
          <p>Cleveland was temporary living and learning—not a vacation. Daniel spent roughly 14 weeks at Tech Elevator’s full-stack Java bootcamp, living in the city around May–August 2024.</p>
          <button className="traveler-text-link" type="button" onClick={event => openChapter(travelHistory.find(item => item.id === 'cleveland-2024'), event.currentTarget)}>
            Open the Cleveland chapter <ArrowUpRight size={15} />
          </button>
          <span className="traveler-turn-footnote">APPROXIMATE PERIOD · FIRST-PERSON CHRONOLOGY</span>
        </div>
        <span className="traveler-turn-ghost" aria-hidden="true">14</span>
      </section>

      <section className="traveler-honesty" aria-labelledby="traveler-honesty-title">
        <p className="traveler-eyebrow"><span>04</span> A NOTE ON THE RECORD</p>
        <div className="traveler-honesty-grid">
          <h2 id="traveler-honesty-title">The detail<br />is the <em>point.</em></h2>
          <div>
            <p>Confirmed means supplied by Daniel or supported by inspected media; it does not claim independent flight-record verification. Approximate marks a recalled or bounded detail. Unknown means not verified—not that a visit did not happen.</p>
            <p>Map anchors are approximate public geography, not GPS. Country-level records stay country-level. Cuba’s three place-known images remain in Cuba; portraits without verified locations remain unassigned. London appears as transit on the Kenya journey, not as an independent UK vacation.</p>
            <div className="traveler-evidence-key" aria-label="Evidence definitions">
              <span><i /> CONFIRMED</span><span><i /> APPROXIMATE</span><span><i /> UNKNOWN</span>
            </div>
            <small>Source: Daniel’s first-person travel chronology, supplied October 1, 2026. Individual visit order within each year is not established.</small>
          </div>
        </div>
      </section>

      <section className="traveler-end" aria-label="Traveler world conclusion">
        <span className="traveler-end-mark">D.</span>
        <div><p className="traveler-eyebrow">END OF THIS WORLD</p><p className="traveler-end-title">The record keeps going.</p></div>
        <Link to="/dax-the-traveler" className="traveler-v1-link">TRAVELER V1 <span>CANONICAL EXPERIENCE</span><ArrowUpRight size={15} /></Link>
      </section>

      <AnimatePresence>
        {chapter && (
          <ChapterDialog
            key="traveler-chapter-dialog"
            chapter={chapter}
            opener={chapterOpener}
            onClose={closeChapter}
            onOpenPhoto={openPhoto}
            suspended={photoIndex !== null}
            onRelated={item => {
              setSelectedId(item.id);
              setChapter(item);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {photoIndex !== null && (
          <PhotoViewer
            key="traveler-photo-viewer"
            index={photoIndex}
            opener={photoOpener}
            onClose={closePhoto}
            onStep={stepPhoto}
            suspended={false}
          />
        )}
      </AnimatePresence>
    </main>
  );
}