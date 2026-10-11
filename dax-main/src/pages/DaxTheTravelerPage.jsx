import React, { useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Camera, MapPin } from 'lucide-react';
import { daxTravelerSocialLinks } from '../config/socialLinks';
import ApprovedMediaGallery from '../components/ApprovedMediaGallery';
import TravelerPhotoViewer from './TravelerPhotoViewer';
import './TravelerPage.css';

const photos = [
  { src: '/images/dax-personal/havana-balcony.webp', alt: 'Dax looking out across Havana from a balcony', caption: 'A view across Havana', location: 'HAVANA, CUBA' },
  { src: '/images/dax-personal/cuba-classic-car.webp', alt: 'Dax beside a blue classic car in Cuba', caption: 'Beside a blue classic car', location: 'CUBA' },
  { src: '/images/dax-personal/havana-city-portrait.webp', alt: 'Dax with Havana behind him', caption: 'The city in the background', location: 'HAVANA, CUBA' },
  { src: '/images/dax-personal/evening-portrait.webp', alt: 'Dax smiling in a striped shirt', caption: 'A portrait from the camera roll', location: 'UNPLACED FRAME' },
  { src: '/images/dax-personal/open-air-portrait.webp', alt: 'Dax seated outdoors on a terrace', caption: 'An open-air portrait', location: 'UNPLACED FRAME' },
  { src: '/images/dax-personal/dax-smiling.webp', alt: 'Dax smiling for a selfie', caption: 'A moment between frames', location: 'UNPLACED FRAME' },
];
const socialLinks = daxTravelerSocialLinks.filter(link => link.href && link.href.startsWith('http'));

function Hero({ reduceMotion, onOpenPhoto }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollDrift = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : 55]);
  const pointerLayerX = useTransform(pointerX, [-0.5, 0.5], [-8, 8]);
  const pointerLayerY = useTransform(pointerY, [-0.5, 0.5], [-6, 6]);
  const pointerMove = event => {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };
  const resetPointer = () => { pointerX.set(0); pointerY.set(0); };
  return (
    <section className="traveler-hero" id="traveler-top">
      <motion.div className="hero-backdrop" style={reduceMotion ? undefined : { y: scrollDrift }} aria-hidden="true">
        <img src={photos[1].src} alt="" loading="eager" />
      </motion.div>
      <div className="hero-shade" aria-hidden="true" />
      <motion.div className="hero-depth" aria-hidden="true" style={reduceMotion ? undefined : { x: pointerLayerX, y: pointerLayerY }} />
      <div className="hero-content" onPointerMove={pointerMove} onPointerLeave={resetPointer}>
        <a href="#traveler-top" className="traveler-wordmark" aria-label="Dax the Traveler, home">DAX<span>•</span>TRAVELER</a>
        <div className="hero-copy">
          <p className="traveler-kicker"><span />PERSONAL TRAVEL PHOTOGRAPHS</p>
          <h1>DAX THE<br /><em>TRAVELER</em></h1>
          <p className="hero-subtitle">The world through my lens.</p>
          <a className="hero-cta" href="#where">Explore the photographs <ArrowDown size={16} /></a>
        </div>
        <button className="hero-frame" onClick={() => onOpenPhoto(2)} aria-label="Open photograph of Dax with Havana behind him" data-testid="hero-photo-open">
          <img src={photos[2].src} alt="" />
          <span><Camera size={14} /> OPEN FRAME</span>
        </button>
        <div className="hero-location"><MapPin size={14} /><span>CUBA</span><i>PERSONAL PHOTO</i></div>
        <div className="hero-edge"><span>PLACES. PEOPLE. PERSPECTIVE.</span><span>SCROLL TO EXPLORE ↓</span></div>
      </div>
    </section>
  );
}

function HavanaMap({ onSelect }) {
  return (
    <div className="atlas-map" aria-label="Illustrative map of the Caribbean, with Havana marked">
      <div className="atlas-grid" />
      <svg viewBox="0 0 600 330" role="img" aria-label="Illustrative Caribbean map, not to scale">
        <path className="land land-america" d="M71 35 149 22 200 62 191 110 162 137 175 190 148 230 119 211 110 159 83 130 65 88Z" />
        <path className="land land-cuba" d="m288 126 50-13 65 7 39 18-39 9-56-5-47 4-27-8Z" />
        <path className="land land-island" d="m427 162 68 10-8 8-67-10Z" />
        <circle className="map-pin-halo" cx="334" cy="140" r="16" />
        <text className="map-label-small" x="308" y="174">CUBA</text>
        <text className="map-muted" x="73" y="275">CARIBBEAN SEA</text>
        <text className="map-muted" x="419" y="215">ISLANDS</text>
      </svg>
      <button className="map-hotspot" type="button" onClick={onSelect} aria-label="Select Havana, Cuba photographs" data-testid="destination-havana-map"><MapPin size={17} /><span>HAVANA</span></button>
      <div className="map-disclaimer">ILLUSTRATIVE · NOT TO SCALE</div>
    </div>
  );
}

function WhereSection({ activePlace, setActivePlace, visiblePhotos, onOpenPhoto }) {
  const panelRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const selectHavana = useCallback(() => {
    setActivePlace('havana');
    if (window.matchMedia('(max-width: 760px)').matches) panelRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }, [reduceMotion, setActivePlace]);
  return (
    <section className="where-section" id="where">
      <div className="where-heading"><div><p className="traveler-kicker">A PLACE IN THE FRAME</p><h2>Where I’ve <em>been.</em></h2></div><p>Choose the marked place to explore its photographs.</p></div>
      <div className="atlas-layout">
        <HavanaMap onSelect={selectHavana} />
        <div className="place-panel" ref={panelRef}>
          <div className="place-tabs" role="group" aria-label="Choose photo collection">
            <button aria-pressed={activePlace === 'havana'} className={activePlace === 'havana' ? 'selected' : ''} onClick={selectHavana} data-testid="destination-havana">Havana, Cuba</button>
            <button aria-pressed={activePlace === 'unplaced'} className={activePlace === 'unplaced' ? 'selected' : ''} onClick={() => setActivePlace('unplaced')} data-testid="destination-unplaced">Portraits</button>
          </div>
          <motion.div className="place-content" key={activePlace} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? .01 : .24 }} aria-live="polite">
            <div className="place-title"><div><span className="place-marker"><MapPin size={15} /></span><div><p>{activePlace === 'havana' ? 'PHOTOGRAPHED IN' : 'LOCATION UNSPECIFIED'}</p><h3>{activePlace === 'havana' ? 'Havana, Cuba' : 'The portrait frames'}</h3></div></div></div>
            <p className="place-caption">{activePlace === 'havana' ? 'A city view, a classic car, and portraits with Havana behind me.' : 'Personal portraits from the camera roll. Locations are not identified.'}</p>
            <div className="place-thumbs">{visiblePhotos.map((photoIndex, idx) => <button key={photoIndex} onClick={() => onOpenPhoto(photoIndex)} className={`place-thumb place-thumb-${idx + 1}`} aria-label={`Open photo: ${photos[photoIndex].caption}`} data-testid={`photo-${activePlace}-${photoIndex}`}><img src={photos[photoIndex].src} alt={photos[photoIndex].alt} /><span>{String(idx + 1).padStart(2, '0')} <ArrowUpRight size={13} /></span></button>)}</div>
            <button className="place-open" onClick={() => onOpenPhoto(visiblePhotos[0])}>Open photo <ArrowRight size={15} /></button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PhotoReel({ onOpenPhoto }) {
  const reelRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const scrollReel = direction => reelRef.current?.scrollBy({ left: direction * Math.min(420, reelRef.current.clientWidth * .78), behavior: reduceMotion ? 'auto' : 'smooth' });
  return (
    <section className="frames-section" id="frames">
      <div className="frames-head"><div><p className="traveler-kicker">A SELECTION FROM THE CAMERA ROLL</p><h2>Through Dax’s <em>Lens.</em></h2></div><div className="reel-controls"><p>Swipe or use the arrows to move through the frames.</p><button onClick={() => scrollReel(-1)} aria-label="Scroll photo frames left" data-testid="reel-prev"><ArrowLeft /></button><button onClick={() => scrollReel(1)} aria-label="Scroll photo frames right" data-testid="reel-next"><ArrowRight /></button></div></div>
      <div className="frame-reel" ref={reelRef} aria-label="Swipeable personal photo collection">{photos.map((photo, index) => <button className={`reel-card ${index > 2 ? 'reel-unplaced' : ''}`} key={photo.src} onClick={() => onOpenPhoto(index)} aria-label={`View: ${photo.caption}`} data-testid={`reel-photo-${index}`}><img loading={index < 2 ? 'eager' : 'lazy'} src={photo.src} alt={photo.alt} /><span className="reel-caption"><small>{String(index + 1).padStart(2, '0')} / {photo.location}</small><b>{photo.caption}</b></span><span className="reel-open"><ArrowUpRight size={17} /></span></button>)}</div>
      <div className="reel-foot"><span>PERSONAL PHOTOGRAPHS</span><span>← MOVE THROUGH THE FRAMES →</span></div>
    </section>
  );
}

export default function DaxTheTravelerPage() {
  const [viewer, setViewer] = useState(null);
  const [activePlace, setActivePlace] = useState('havana');
  const viewerTrigger = useRef(null);
  const reduceMotion = useReducedMotion();
  const showPhoto = useCallback(index => {
    viewerTrigger.current = document.activeElement;
    setViewer(index);
  }, []);
  const closePhoto = useCallback(() => setViewer(null), []);
  const stepPhoto = useCallback(direction => setViewer(current => current === null ? null : (current + direction + photos.length) % photos.length), []);
  const visiblePhotos = activePlace === 'havana' ? [0, 1, 2] : [3, 4, 5];
  return (
    <div className="traveler-page">
      <Helmet><title>Dax the Traveler — The world through my lens</title><meta name="description" content="Personal travel photographs by Dax the Traveler, including frames from Havana, Cuba." /></Helmet>
      <Hero reduceMotion={reduceMotion} onOpenPhoto={showPhoto} />
      <main>
        <section className="manifesto"><span className="manifesto-mark">01 —</span><p>A life in motion.<br /><em>One frame at a time.</em></p><span className="manifesto-side">DAX THE TRAVELER</span></section>
        <WhereSection activePlace={activePlace} setActivePlace={setActivePlace} visiblePhotos={visiblePhotos} onOpenPhoto={showPhoto} />
        <div className="photo-interlude" aria-label="Dax looking out across Havana"><img src={photos[0].src} alt={photos[0].alt} loading="lazy" /><div><span>HAVANA, CUBA</span><p>The city, seen from above.</p></div></div>
        <PhotoReel onOpenPhoto={showPhoto} />
        <section className="future-notes"><div className="future-title"><p className="traveler-kicker">FUTURE CHAPTERS · IN DEVELOPMENT</p><h2>More ways to<br /><em>see the world.</em></h2><p>Stories, guides, photography, and useful travel notes are all part of the road ahead. These are planned directions, not published guides.</p></div><div className="idea-stack"><div><span>01</span><b>Stories</b><small>Personal moments from places along the way.</small></div><div><span>02</span><b>Travel guides</b><small>Useful notes for planning a day out.</small></div><div><span>03</span><b>Photography</b><small>Frames and the view behind the lens.</small></div><div><span>04</span><b>Budget ideas</b><small>Practical ways to make a trip go further.</small></div></div></section>
        <section className="approved-section"><div className="approved-heading"><p className="traveler-kicker">THE BRAND ARCHIVE</p><h2>More from <em>the collection.</em></h2><p>Approved Dax the Traveler media.</p></div><ApprovedMediaGallery brand="Dax the Traveler" /></section>
        <section className="films-section" id="films"><div><p className="traveler-kicker">WHEN A FRAME STARTS MOVING</p><h2>Travel, in <em>motion.</em></h2><p>Watch films on the Dax the Traveler YouTube channel.</p></div><a href="https://www.youtube.com/@DaxTheTraveler" target="_blank" rel="noopener noreferrer" data-testid="link-traveler-youtube">Visit the channel <ArrowUpRight /></a></section>
      </main>
      <footer className="traveler-footer"><a href="#traveler-top" className="footer-wordmark">DAX<span>•</span>TRAVELER</a><p>The world through my lens.</p><div>{socialLinks.map(link => <a href={link.href} key={link.label} target="_blank" rel="noopener noreferrer" data-testid={`social-${link.label.toLowerCase()}`}>{link.label}<ArrowUpRight size={13} /></a>)}</div></footer>
      <AnimatePresence>{viewer !== null && <TravelerPhotoViewer photos={photos} index={viewer} onClose={closePhoto} onStep={stepPhoto} triggerRef={viewerTrigger} />}</AnimatePresence>
    </div>
  );
}
