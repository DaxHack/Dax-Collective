import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, X } from 'lucide-react';
import { EVIDENCE, chapterTypeLabels, personalPhotos, travelHistory, travelYears } from '../../../data/daxTravelHistory';
import useModalBoundary from './useModalBoundary';

const statusText = value => value === EVIDENCE.CONFIRMED ? 'CONFIRMED' : value === EVIDENCE.APPROXIMATE ? 'APPROXIMATE' : 'UNKNOWN';
const chapterPeriod = chapter => chapter.period && chapter.period !== String(chapter.year) ? chapter.period : `${chapter.year} · exact dates not verified`;
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
const project = ([longitude, latitude]) => ({ x: ((longitude + 180) / 360) * 600, y: ((90 - latitude) / 180) * 300 });

function ChapterDialog({ chapter, opener, onClose, onOpenPhoto, suspended, onRelated }) {
  useModalBoundary(suspended, opener, onClose, '.v3-chapter-dialog');
  const attachedPhotos = chapter.photos || [];
  return createPortal(
    <div className="v3-overlay-root" data-testid="v3-chapter-overlay" aria-hidden={suspended || undefined} inert={suspended ? '' : undefined}>
      <button className="v3-overlay-scrim" type="button" onClick={onClose} aria-label="Close chapter detail" tabIndex={-1} />
      <section className="v3-chapter-dialog" role="dialog" aria-modal="true" aria-labelledby="v3-chapter-title" aria-hidden={suspended || undefined} inert={suspended ? '' : undefined} data-testid={`v3-chapter-${chapter.id}`}>
        <button className="v3-dialog-close" type="button" onClick={onClose} aria-label="Close chapter"><X size={18} /></button>
        <p className="v3-kicker">{chapterTypeLabels[chapter.chapterType]} · {statusText(chapter.evidence.visit)}</p>
        <h2 id="v3-chapter-title">{chapter.destination}</h2>
        <p className="v3-chapter-period">{chapterPeriod(chapter)}</p>
        {chapter.locationDetail && <p className="v3-chapter-detail">{chapter.locationDetail}</p>}
        <div className="v3-evidence-labels" aria-label="Evidence status">
          {Object.entries(chapter.evidence).map(([key, value]) => <span key={key} className={`is-${value.toLowerCase()}`}>{key === 'mediaLocation' ? 'PHOTO LOCATION' : key.toUpperCase()} · {statusText(value)}</span>)}
        </div>
        <h3>What the record says</h3>
        {chapter.facts?.length ? <ul className="v3-facts">{chapter.facts.map((fact, index) => <li key={`${chapter.id}-${index}`}><span>{fact.text}</span><small>{statusText(fact.status)} · {fact.source}</small></li>)}</ul> : <p className="v3-caveat">The chronology confirms this chapter and its year. Specific dates, duration, and itinerary details have not been verified.</p>}
        <h3>Photographs linked to this chapter</h3>
        {attachedPhotos.length ? <div className="v3-linked-photos">{attachedPhotos.map(photo => {
          const index = personalPhotos.findIndex(item => item.src === photo.src);
          return <button type="button" key={photo.src} onClick={event => onOpenPhoto(index, event.currentTarget)} aria-label={`Open photograph: ${photo.alt}`} data-testid={`v3-linked-photo-${chapter.id}-${index}`}><img src={photo.src} alt={photo.alt} loading="lazy" /><span>{photo.caption}</span></button>;
        })}</div> : <p className="v3-caveat">No photographs are linked to this destination. Location-unknown portraits remain unassigned.</p>}
        {chapter.relatedJourney && travelHistory.find(item => item.id === chapter.relatedJourney) && <button type="button" className="v3-related-link" onClick={() => onRelated(travelHistory.find(item => item.id === chapter.relatedJourney))}>Related chapter: {travelHistory.find(item => item.id === chapter.relatedJourney).destination} <ArrowRight size={15} /></button>}
        {chapter.chapterType === 'transit' && <p className="v3-caveat">London / Heathrow is recorded as transit, not an independent vacation.</p>}
      </section>
    </div>,
    document.body,
  );
}

function PhotoViewer({ index, opener, onClose, onStep, suspended }) {
  const photo = personalPhotos[index];
  useModalBoundary(suspended, opener, onClose, '.v3-photo-viewer');
  useEffect(() => {
    const keydown = event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); onStep(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); onStep(1); }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [onStep]);
  if (!photo) return null;
  return createPortal(
    <div className="v3-photo-viewer" role="dialog" aria-modal="true" aria-label="Personal camera-roll photograph" onClick={event => { if (event.target === event.currentTarget) onClose(); }} data-testid="v3-photo-viewer">
      <button className="v3-dialog-close" type="button" onClick={onClose} aria-label="Close photograph"><X size={18} /></button>
      <button className="v3-photo-step is-previous" type="button" onClick={() => onStep(-1)} aria-label="Previous photograph" data-testid="v3-photo-previous"><ArrowLeft /></button>
      <figure><img src={photo.src} alt={photo.alt} /><figcaption><span>{photo.locationStatus === EVIDENCE.UNKNOWN ? 'LOCATION NOT VERIFIED' : photo.location.toUpperCase()}</span>{photo.caption}</figcaption></figure>
      <button className="v3-photo-step is-next" type="button" onClick={() => onStep(1)} aria-label="Next photograph" data-testid="v3-photo-next"><ArrowRight /></button>
      <p className="v3-photo-count">{String(index + 1).padStart(2, '0')} / {String(personalPhotos.length).padStart(2, '0')}</p>
    </div>,
    document.body,
  );
}

export default function TravelerFoundation({ state, onYearChange, onChapterChange, onPhotoChange, onFrameChange }) {
  const chapters = useMemo(() => travelHistory.filter(chapter => chapter.year === state.year), [state.year]);
  const selectedChapter = travelHistory.find(chapter => chapter.id === state.chapter) || null;
  const [chapterOpener, setChapterOpener] = useState(null);
  const [photoOpener, setPhotoOpener] = useState(null);
  const galleryIndex = state.frame ?? 0;
  const galleryRef = useRef(null);
  const year = state.year || travelYears[0];

  useEffect(() => {
    if (!galleryRef.current) return;
    const strip = galleryRef.current;
    const item = strip.querySelector(`[data-gallery-index="${galleryIndex}"]`);
    if (item) strip.scrollLeft += item.getBoundingClientRect().left - strip.getBoundingClientRect().left;
  }, [galleryIndex]);

  const openChapter = useCallback((chapter, opener) => {
    setChapterOpener(opener || document.activeElement);
    onChapterChange(chapter);
  }, [onChapterChange]);
  const closeChapter = useCallback(() => onChapterChange(null), [onChapterChange]);
  const openPhoto = useCallback((index, opener) => {
    if (!Number.isInteger(index) || index < 0) return;
    setPhotoOpener(opener || document.activeElement);
    onPhotoChange(index);
  }, [onPhotoChange]);
  const closePhoto = useCallback(() => onPhotoChange(null), [onPhotoChange]);
  const stepPhoto = useCallback(direction => onPhotoChange((state.photo + direction + personalPhotos.length) % personalPhotos.length), [onPhotoChange, state.photo]);

  return (
    <main className="v3-traveler" data-testid="v3-traveler-foundation">
      <header className="v3-traveler-header">
        <Link to="/experiments/dax-universe-v3" className="v3-wordmark">DAX <span>COLLECTIVE</span></Link>
        <div><span className="v3-phase-label">PHASE 1A · VISUAL DESIGN PENDING</span><Link to="/experiments/dax-universe-v3" className="v3-back-link">ALL WORLDS</Link></div>
      </header>
      <section className="v3-traveler-intro">
        <p className="v3-kicker">TRAVELER FOUNDATION / 01</p>
        <h1>A life, <i>in places.</i></h1>
        <p>Daniel’s first-person chronology and personal camera roll. This technical preview prioritizes evidence, navigation, and accessible controls; final Figma-directed visual scenes are not implemented yet.</p>
        <div className="v3-data-counts"><span><b>{travelHistory.length}</b> CHAPTERS</span><span><b>{personalPhotos.length}</b> PERSONAL PHOTOS</span><span><b>{travelYears[0]}–{travelYears[travelYears.length - 1]}</b> YEARS IN VIEW</span></div>
      </section>
      <section className="v3-atlas" aria-labelledby="v3-atlas-title">
        <div className="v3-atlas-heading"><div><p className="v3-kicker">THE CHRONOLOGY</p><h2 id="v3-atlas-title">Years, not a route.</h2></div><p>Markers are approximate public geographic anchors. They do not imply GPS, exact itinerary stops, or visit order within a year.</p></div>
        <nav className="v3-year-rail" aria-label="Choose a year in Daniel’s travel history">
          {travelYears.map(item => <button key={item} type="button" className={year === item ? 'is-current' : ''} aria-pressed={year === item} onClick={() => onYearChange(item)} data-testid={`v3-year-${item}`}>{item}</button>)}
        </nav>
        <div className="v3-atlas-content">
          <div className="v3-map-panel">
            <div className="v3-map-heading"><span>SCHEMATIC WORLD INDEX · {year}</span><span>{chapters.length} ENTRIES</span></div>
            <svg className="v3-map" viewBox="0 0 600 300" role="group" aria-label={`Schematic world map with chapter markers for ${year}`}>
              <defs><pattern id="v3-map-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" className="v3-map-gridline" /></pattern></defs>
              <rect width="600" height="300" fill="url(#v3-map-grid)" />
              <g className="v3-map-land" aria-hidden="true">{coastlines.map((path, index) => <path key={index} d={path} />)}</g>
              <path className="v3-map-axis" d="M0 150H600M300 0V300" aria-hidden="true" />
              {travelHistory.map(chapter => {
                const point = project(chapter.coordinates);
                const duplicates = travelHistory.filter(item => item.coordinates[0] === chapter.coordinates[0] && item.coordinates[1] === chapter.coordinates[1]);
                const offset = duplicates.length > 1 ? (duplicates.findIndex(item => item.id === chapter.id) - (duplicates.length - 1) / 2) * 7 : 0;
                return <g key={chapter.id} transform={`translate(${point.x + offset} ${point.y})`} className={`v3-map-marker ${chapter.year === year ? 'is-year' : ''} ${chapter.year < year ? 'is-past' : ''}`} role="button" tabIndex="0" aria-label={`${chapter.destination}, ${chapter.year}. Open chapter.`} aria-pressed={selectedChapter?.id === chapter.id} onClick={event => openChapter(chapter, event.currentTarget)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openChapter(chapter, event.currentTarget); } }} data-testid={`v3-map-point-${chapter.id}`}><circle className="v3-marker-hit" r="11" /><circle className="v3-marker-dot" r="3.5" /><title>{chapter.destination} · {chapter.year}</title></g>;
              })}
            </svg>
            <p className="v3-map-note"><MapPin size={14} /> Anchors indicate broad location only, not an exact stop.</p>
          </div>
          <div className="v3-chapter-index" aria-live="polite" aria-label={`${year} chapters`}>
            <div className="v3-index-heading"><span>CHAPTER INDEX</span><strong>{year}</strong></div>
            {chapters.map((chapter, index) => <button type="button" className={`v3-chapter-row ${selectedChapter?.id === chapter.id ? 'is-selected' : ''}`} key={chapter.id} onClick={event => openChapter(chapter, event.currentTarget)} data-testid={`v3-chapter-row-${chapter.id}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{chapter.destination}<small>{chapterTypeLabels[chapter.chapterType]} · {statusText(chapter.evidence.visit)}</small></strong><span aria-hidden="true">↗</span></button>)}
            <p className="v3-caveat">Within-year visit order is not established.</p>
          </div>
        </div>
      </section>
      <section className="v3-gallery" aria-labelledby="v3-gallery-title">
        <div className="v3-gallery-heading"><div><p className="v3-kicker">PERSONAL CAMERA ROLL</p><h2 id="v3-gallery-title">{personalPhotos.length} personal frames.<br />No invented places.</h2></div><p>Photographs are assigned to a chapter only when the record supports that connection. Unverified portraits remain unassigned.</p></div>
        <div className="v3-gallery-controls"><button type="button" onClick={() => onFrameChange((galleryIndex - 1 + personalPhotos.length) % personalPhotos.length)} aria-label="Previous gallery photo" data-testid="v3-gallery-previous"><ArrowLeft /></button><span>{String(galleryIndex + 1).padStart(2, '0')} / {String(personalPhotos.length).padStart(2, '0')}</span><button type="button" onClick={() => onFrameChange((galleryIndex + 1) % personalPhotos.length)} aria-label="Next gallery photo" data-testid="v3-gallery-next"><ArrowRight /></button></div>
        <div className="v3-gallery-strip" ref={galleryRef} aria-label="Daniel’s personal photographs">
          {personalPhotos.map((photo, index) => <button type="button" className={`v3-gallery-item ${galleryIndex === index ? 'is-current' : ''}`} key={photo.src} data-gallery-index={index} onClick={event => openPhoto(index, event.currentTarget)} aria-label={`Open photograph: ${photo.alt}`} data-testid={`v3-gallery-photo-${index}`}><img src={photo.src} alt={photo.alt} loading={index < 2 ? 'eager' : 'lazy'} /><span>{photo.locationStatus === EVIDENCE.UNKNOWN ? 'PLACE NOT VERIFIED' : photo.location.toUpperCase()}</span><strong>{photo.caption}</strong></button>)}
        </div>
      </section>
      <section className="v3-evidence-note">
        <p className="v3-kicker">A NOTE ON THE RECORD</p>
        <h2>Uncertainty stays visible.</h2>
        <p>Confirmed means supplied by Daniel or supported by inspected media; it does not claim independent flight-record verification. Approximate marks a recalled or bounded detail. Unknown means not verified—not that a visit did not happen.</p>
        <small>Source: Daniel’s first-person travel chronology, supplied October 1, 2026.</small>
      </section>
      <footer className="v3-traveler-footer"><span>DAX COLLECTIVE · V3 FOUNDATION</span><span>PHASE 1A / NO CINEMATIC SCENES</span></footer>
      {selectedChapter && <ChapterDialog chapter={selectedChapter} opener={chapterOpener} onClose={closeChapter} onOpenPhoto={openPhoto} suspended={state.photo !== undefined} onRelated={chapter => openChapter(chapter, chapterOpener)} />}
      {state.photo !== undefined && <PhotoViewer index={state.photo} opener={photoOpener} onClose={closePhoto} onStep={stepPhoto} suspended={false} />}
    </main>
  );
}
