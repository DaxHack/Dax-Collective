import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CameraIcon,
  MapPinIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { daxTravelerSocialLinks } from '../config/socialLinks';

const BASE = '/assets/approved-media/dax-the-traveler';

const HERO_DATA = {
  bgPhoto: `${BASE}/2024-cuba-havana-vieja-facade.png`,
  fgPhoto: `${BASE}/2024-puerto-rico-old-san-juan-street.png`,
  detailPhoto: `${BASE}/2024-cuba-havana-classic-car.png`,
  title: 'Dax the Traveler',
  tagline: 'Real trips. Honest stories. No influencer fluff.',
  metadata: { route: 'ATL → HAV → SJU', coordinates: '18.4655° N, 66.1057° W', year: '2024' },
};

const CHAPTERS = [
  {
    id: 'cuba-2024',
    index: '01',
    title: 'Havana, Cuba',
    year: '2024',
    coords: '23.1330° N, 82.3830° W',
    description: 'No tourist traps, no resorts. Just casas, classic cars, and the best mojito of my life.',
    photos: [
      `${BASE}/2024-cuba-havana-classic-car.png`,
      `${BASE}/2024-cuba-street-food-mofongo.png`,
      `${BASE}/2024-cuba-street-walk-broll.png`,
    ],
    accent: 'CUBA / WINTER',
  },
  {
    id: 'puertorico-2024',
    index: '02',
    title: 'Puerto Rico',
    year: '2024',
    coords: '18.2208° N, 66.5901° W',
    description: 'Old San Juan, El Morro, and a zipline I almost said no to. Learning to slow down.',
    photos: [
      `${BASE}/2024-puerto-rico-old-san-juan-street.png`,
      `${BASE}/2024-puerto-rico-condado-beach-morning.png`,
      `${BASE}/2024-puerto-rico-toro-verde-zipline.png`,
    ],
    accent: 'PUERTO RICO / SPRING',
  },
  {
    id: 'atlanta-2024',
    index: '03',
    title: 'Atlanta, GA',
    year: '2024',
    coords: '33.7490° N, 84.3880° W',
    description: 'Home base. Gear packed. Always ready for the next departure.',
    photos: [
      `${BASE}/2024-atlanta-camera-bag-gear.png`,
      `${BASE}/2024-atlanta-packing-flatlay.png`,
    ],
    accent: 'HOME BASE / ATL',
  },
];

const PASSPORT_NOTES = [
  {
    location: 'El Morro, San Juan',
    coords: '18.4710° N, 66.1235° W',
    date: 'Spring 2024',
    note: 'The wind off the Atlantic hits different here. Spent two hours just watching the kites.',
  },
  {
    location: 'Havana Vieja',
    coords: '23.1368° N, 82.3533° W',
    date: 'Winter 2024',
    note: 'Met a guy named Carlos who fixed his 1957 Chevy with spare refrigerator parts.',
  },
  {
    location: 'Toro Verde',
    coords: '18.2546° N, 66.3916° W',
    date: 'Spring 2024',
    note: 'Terrified of heights. Went anyway. The silence when you are airborne is absolute.',
  },
];

const MEMORIES = [
  { id: 'san-juan', title: 'Old San Juan', image: `${BASE}/2024-puerto-rico-old-san-juan-street.png`, hook: 'A solo walk through cobblestone streets.' },
  { id: 'canopy', title: 'Above the Canopy', image: `${BASE}/2024-puerto-rico-toro-verde-zipline.png`, hook: 'The 90 seconds I was airborne.' },
  { id: 'cuba-budget', title: 'Cuba on a Budget', image: `${BASE}/2024-cuba-havana-classic-car.png`, hook: '$40 a Day, Real Talk.' },
  { id: 'condado', title: 'Condado Morning', image: `${BASE}/2024-puerto-rico-condado-beach-morning.png`, hook: 'Sunrise before the city wakes.' },
];

const ROUTE_STOPS = [
  { code: 'ATL', x: 8, y: 50 },
  { code: 'MIA', x: 37, y: 72 },
  { code: 'HAV', x: 62, y: 82 },
  { code: 'SJU', x: 92, y: 35 },
];

const socialLinks = daxTravelerSocialLinks.filter((link) => link.href && link.href !== '#facebook-page-url-needed');

function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</p>;
}

function SiteNavigation() {
  return (
    <header className="journal-nav">
      <a className="wordmark" href="#top" aria-label="Dax the Traveler, back to top" data-testid="link-home">
        <span className="wordmark-mark">D<span>.</span></span>
        <span className="wordmark-copy">DAX THE TRAVELER<small>PERSONAL FIELD JOURNAL</small></span>
      </a>
      <nav aria-label="Story navigation" className="story-nav">
        <a href="#route">The route</a>
        <a href="#chapters">Chapters</a>
        <a href="#fragments">Fragments</a>
        <a href="#field-notes">Field notes</a>
      </nav>
      <a className="nav-watch" href="https://www.youtube.com/@DaxTheTraveler" target="_blank" rel="noopener noreferrer" data-testid="link-watch-films">
        Watch films <ArrowUpRightIcon aria-hidden="true" />
      </a>
    </header>
  );
}

function LayeredHero() {
  const reduceMotion = useReducedMotion();
  const rise = reduceMotion ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };
  return (
    <section id="top" className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <motion.div {...rise} transition={{ duration: 0.65, delay: 0.05 }}>
            <Eyebrow>ATLANTA BASED · OUT THERE OFTEN</Eyebrow>
          </motion.div>
          <motion.h1 {...rise} transition={{ duration: 0.75, delay: 0.13 }}>
            The world,<br /><em>as I found it.</em>
          </motion.h1>
          <motion.p className="hero-deck" {...rise} transition={{ duration: 0.75, delay: 0.22 }}>
            {HERO_DATA.tagline} A personal journal of places, people, and the moments that stay with you.
          </motion.p>
          <motion.div className="hero-actions" {...rise} transition={{ duration: 0.75, delay: 0.3 }}>
            <a className="button-primary" href="#chapters" data-testid="link-read-stories">
              Read the stories <ArrowDownIcon aria-hidden="true" />
            </a>
            <span className="hero-edition">FIRST EDITION <b>—</b> {HERO_DATA.metadata.year}</span>
          </motion.div>
          <div className="hero-route-stamp" aria-label={`Route ${HERO_DATA.metadata.route}`}>
            <span>RECENT ROUTE</span><strong>{HERO_DATA.metadata.route}</strong><i>{HERO_DATA.metadata.coordinates}</i>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-main-image">
            <img src={HERO_DATA.bgPhoto} alt="A sunlit Havana Vieja facade" data-testid="img-hero-havana" />
            <span className="image-caption">01 — HAVANA VIEJA, CUBA</span>
          </div>
          <div className="hero-overlap-image">
            <img src={HERO_DATA.fgPhoto} alt="A narrow, colorful street in Old San Juan" data-testid="img-hero-san-juan" />
          </div>
          <div className="hero-sunmark" aria-hidden="true">D</div>
          <span className="hero-side-note">SOMEWHERE BETWEEN<br />THE PLAN AND THE DETOUR</span>
        </div>
      </div>
      <div className="hero-bottomline"><span>TRAVEL WITH YOUR EYES OPEN</span><span>ATLANTA · CUBA · PUERTO RICO</span></div>
    </section>
  );
}

function StartHere() {
  return (
    <section className="start-here" aria-label="Choose how to explore">
      <div className="start-intro"><Eyebrow>COME ON IN</Eyebrow><h2>Take the long way.</h2></div>
      <a href="#chapters" className="start-link" data-testid="link-start-chapters">
        <span className="start-number">01</span><span><b>Read</b><small>Trip chapters</small></span><ArrowRightIcon aria-hidden="true" />
      </a>
      <a href="#field-notes" className="start-link" data-testid="link-start-notes">
        <span className="start-number">02</span><span><b>Browse</b><small>Notes from the road</small></span><ArrowRightIcon aria-hidden="true" />
      </a>
      <a href="https://www.youtube.com/@DaxTheTraveler" target="_blank" rel="noopener noreferrer" className="start-link" data-testid="link-start-watch">
        <span className="start-number">03</span><span><b>Watch</b><small>Travel films on YouTube</small></span><ArrowUpRightIcon aria-hidden="true" />
      </a>
    </section>
  );
}

function AnimatedRoute() {
  return (
    <section id="route" className="route-section">
      <div className="route-heading">
        <Eyebrow light>THE 2024 NOTEBOOK</Eyebrow>
        <h2>One trip. <em>Three stops.</em></h2>
        <p>From home base to Havana, then on to San Juan. The route is only the beginning.</p>
      </div>
      <div className="route-map">
        <svg viewBox="0 0 100 100" role="img" aria-label="Travel route from Atlanta through Miami and Havana to San Juan">
          <path className="route-dash" d="M 8 50 Q 25 35 37 72 T 62 82 Q 77 85 92 35" />
          <path className="route-path" d="M 8 50 Q 25 35 37 72 T 62 82 Q 77 85 92 35" />
          {ROUTE_STOPS.map((stop, index) => (
            <g key={stop.code} transform={`translate(${stop.x} ${stop.y})`}>
              <circle r="2.1" className="route-dot" />
              <circle r="4.2" className="route-halo" />
              <text y="-7" textAnchor="middle">{stop.code}</text>
              <text y="10" textAnchor="middle" className="route-stop-number">0{index + 1}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="route-foot"><span>ATLANTA, GA</span><span>MIAMI, FL</span><span>HAVANA, CUBA</span><span>SAN JUAN, PR</span></div>
    </section>
  );
}

function DestinationChapters() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="chapters" className="chapters-section">
      <div className="section-heading">
        <div><Eyebrow>THE STORY SO FAR</Eyebrow><h2>Places that <em>left a mark.</em></h2></div>
        <span className="section-count">03 CHAPTERS / 2024</span>
      </div>
      <div className="chapter-list">
        {CHAPTERS.map((chapter, index) => (
          <motion.article
            key={chapter.id}
            id={chapter.id}
            className={`chapter chapter-${index + 1}`}
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            data-testid={`chapter-${chapter.id}`}
          >
            <div className="chapter-lead-image">
              <img src={chapter.photos[0]} alt={`${chapter.title} travel photograph`} loading="lazy" data-testid={`img-chapter-${chapter.id}`} />
              <span className="chapter-image-index">{chapter.index} / 03</span>
            </div>
            <div className="chapter-copy">
              <Eyebrow>{chapter.accent}</Eyebrow>
              <h3>{chapter.title}<sup>{chapter.year}</sup></h3>
              <p>{chapter.description}</p>
              <div className="chapter-coords"><MapPinIcon aria-hidden="true" />{chapter.coords}</div>
              <div className="chapter-gallery">
                {chapter.photos.slice(1).map((photo, photoIndex) => (
                  <figure key={photo}>
                    <img src={photo} alt={`${chapter.title}, memory ${photoIndex + 2}`} loading="lazy" data-testid={`img-${chapter.id}-${photoIndex + 2}`} />
                    <figcaption>{String(photoIndex + 2).padStart(2, '0')} / FIELD FRAME</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function TravelMemoryRail() {
  return (
    <section id="fragments" className="memory-section">
      <div className="memory-heading">
        <div><Eyebrow>SMALL SCENES, BIG FEELING</Eyebrow><h2>Fragments <em>of elsewhere.</em></h2></div>
        <p>Four frames from the camera roll. The kind of moments that don&apos;t need a plan.</p>
      </div>
      <div className="memory-rail" aria-label="Travel memories">
        {MEMORIES.map((memory, index) => (
          <article className="memory-card" key={memory.id} data-testid={`card-memory-${memory.id}`}>
            <img src={memory.image} alt={memory.title} loading="lazy" data-testid={`img-memory-${memory.id}`} />
            <div className="memory-overlay">
              <span className="memory-index">FRAME {String(index + 1).padStart(2, '0')}</span>
              <h3>{memory.title}</h3><p>{memory.hook}</p>
            </div>
            <CameraIcon className="memory-camera" aria-hidden="true" />
          </article>
        ))}
      </div>
      <p className="rail-hint">SCROLL TO WANDER <span>→</span></p>
    </section>
  );
}

function PassportPieces() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="field-notes" className="notes-section">
      <div className="notes-layout">
        <div className="notes-aside">
          <Eyebrow>KEPT IN THE MARGINS</Eyebrow>
          <h2>Field<br /><em>notes.</em></h2>
          <p>Loose observations from the road. Not a guidebook—just things I didn&apos;t want to forget.</p>
          <MapPinIcon className="notes-map-icon" aria-hidden="true" />
        </div>
        <div className="notes-list">
          {PASSPORT_NOTES.map((note, index) => (
            <motion.article
              className="note-entry"
              key={note.location}
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              data-testid={`note-${index + 1}`}
            >
              <div className="note-meta"><span>0{index + 1}</span><span>{note.date}</span></div>
              <h3>{note.location}</h3>
              <p className="note-coords">{note.coords}</p>
              <blockquote>“{note.note}”</blockquote>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FollowAlong() {
  return (
    <footer className="closing-section">
      <div className="closing-top">
        <Eyebrow light>UNTIL THE NEXT DEPARTURE</Eyebrow>
        <h2>Stay curious.<br /><em>See you out there.</em></h2>
        <a className="closing-watch" href="https://www.youtube.com/@DaxTheTraveler" target="_blank" rel="noopener noreferrer" data-testid="link-closing-youtube">
          <span className="play-disc"><PlayIcon aria-hidden="true" /></span>
          <span><b>Watch the films</b><small>On the Dax the Traveler YouTube channel</small></span>
          <ArrowUpRightIcon className="closing-arrow" aria-hidden="true" />
        </a>
      </div>
      <div className="closing-bottom">
        <a href="#top" className="footer-mark" data-testid="link-footer-home">D<span>.</span></a>
        <p>Personal stories from a life in motion.</p>
        <nav aria-label="Social links" className="social-links">
          {socialLinks.map((link) => (
            <a href={link.href} key={link.label} target="_blank" rel="noopener noreferrer" data-testid={`link-social-${link.label.toLowerCase()}`}>
              {link.label}<ArrowUpRightIcon aria-hidden="true" />
            </a>
          ))}
        </nav>
        <span className="copyright">© {new Date().getFullYear()} DAX THE TRAVELER</span>
      </div>
    </footer>
  );
}

export default function DaxTheTravelerPage() {
  return (
    <div className="dax-journal">
      <Helmet>
        <title>Dax the Traveler — Personal Field Journal</title>
        <meta name="description" content="Personal travel stories, photographs, and field notes from Dax the Traveler." />
      </Helmet>
      <SiteNavigation />
      <main>
        <LayeredHero />
        <StartHere />
        <AnimatedRoute />
        <DestinationChapters />
        <TravelMemoryRail />
        <PassportPieces />
      </main>
      <FollowAlong />
      <style>{`
        .dax-journal {
          --paper: #f3efdf;
          --paper-deep: #e8e2ce;
          --ink: #153b38;
          --ink-soft: #47615a;
          --orange: #e85232;
          --sun: #f2bc45;
          --line: rgba(21, 59, 56, .2);
          background: var(--paper);
          color: var(--ink);
          min-height: 100dvh;
          overflow: clip;
          font-family: "Avenir Next", Avenir, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .dax-journal *, .dax-journal *::before, .dax-journal *::after { box-sizing: border-box; }
        .dax-journal a { color: inherit; text-decoration: none; }
        .dax-journal img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .dax-journal a:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }
        .journal-nav {
          position: sticky; top: 0; z-index: 50; min-height: 74px; padding: 0 clamp(20px, 5.2vw, 84px);
          display: flex; align-items: center; justify-content: space-between; gap: 26px;
          background: rgba(243, 239, 223, .94); border-bottom: 1px solid var(--line); backdrop-filter: blur(14px);
        }
        .wordmark { display: flex; align-items: center; gap: 11px; flex: 0 0 auto; }
        .wordmark-mark, .footer-mark { font: 700 34px/.8 Georgia, "Times New Roman", serif; letter-spacing: -5px; }
        .wordmark-mark span, .footer-mark span { color: var(--orange); }
        .wordmark-copy { display: grid; gap: 3px; font-size: 10px; line-height: 1; font-weight: 800; letter-spacing: .14em; }
        .wordmark-copy small { color: var(--ink-soft); font-size: 8px; letter-spacing: .16em; font-weight: 600; }
        .story-nav { display: flex; align-items: center; gap: clamp(17px, 3vw, 44px); }
        .story-nav a, .nav-watch { font-size: 11px; font-weight: 700; letter-spacing: .04em; transition: color .2s ease; }
        .story-nav a:hover, .nav-watch:hover { color: var(--orange); }
        .nav-watch { display: flex; align-items: center; gap: 7px; flex: 0 0 auto; }
        .nav-watch svg { width: 14px; height: 14px; }
        .hero { padding: 45px clamp(22px, 7.1vw, 112px) 0; background: var(--paper); position: relative; }
        .hero-grid { max-width: 1320px; min-height: min(720px, calc(100svh - 112px)); margin: auto; display: grid; grid-template-columns: .91fr 1.09fr; align-items: center; gap: 3vw; }
        .hero-copy { position: relative; z-index: 3; padding: 30px 0 58px; }
        .eyebrow { margin: 0; color: var(--orange); font-size: 9px; line-height: 1.5; font-weight: 800; letter-spacing: .21em; text-transform: uppercase; }
        .eyebrow-light { color: var(--sun); }
        .hero h1, .route-heading h2, .section-heading h2, .memory-heading h2, .notes-aside h2, .closing-top h2 {
          font: 500 clamp(58px, 7.3vw, 112px)/.91 Georgia, "Times New Roman", serif; letter-spacing: -.065em;
        }
        .hero h1 { margin: 25px 0 25px; max-width: 690px; }
        .hero h1 em, .route-heading h2 em, .section-heading h2 em, .memory-heading h2 em, .notes-aside h2 em, .closing-top h2 em {
          color: var(--orange); font-weight: 400;
        }
        .hero-deck { max-width: 380px; margin: 0; color: var(--ink-soft); font-size: clamp(15px, 1.35vw, 18px); line-height: 1.7; }
        .hero-actions { display: flex; align-items: center; gap: 22px; margin-top: 32px; flex-wrap: wrap; }
        .button-primary { display: inline-flex; align-items: center; gap: 18px; background: var(--orange); color: #fff8e9 !important; padding: 15px 18px 15px 21px; font-weight: 700; font-size: 12px; transition: transform .22s ease, background .22s ease; }
        .button-primary:hover { background: #cc4126; transform: translateY(-2px); }
        .button-primary svg { width: 15px; height: 15px; }
        .hero-edition { color: var(--ink-soft); font-size: 8px; letter-spacing: .15em; font-weight: 700; }
        .hero-edition b { color: var(--orange); margin: 0 4px; }
        .hero-route-stamp { display: grid; gap: 6px; margin-top: 51px; padding-left: 13px; border-left: 2px solid var(--sun); }
        .hero-route-stamp span, .hero-route-stamp i { color: var(--ink-soft); font-size: 8px; letter-spacing: .14em; font-style: normal; }
        .hero-route-stamp strong { font: 600 17px Georgia, serif; letter-spacing: .04em; }
        .hero-art { position: relative; min-height: clamp(435px, 52vw, 690px); }
        .hero-main-image { position: absolute; top: 0; right: 2%; width: 79%; height: 86%; overflow: hidden; background: var(--paper-deep); }
        .hero-main-image img { object-position: 51% center; transition: transform .9s cubic-bezier(.2,.7,.2,1); }
        .hero-main-image:hover img { transform: scale(1.025); }
        .image-caption { position: absolute; right: 0; bottom: 0; padding: 11px 14px; background: var(--ink); color: var(--paper); font-size: 8px; letter-spacing: .13em; }
        .hero-overlap-image { position: absolute; left: 0; bottom: 0; width: 38%; height: 41%; padding: 7px; background: var(--paper); box-shadow: 0 15px 45px rgba(21, 59, 56, .18); transform: rotate(-3deg); }
        .hero-overlap-image img { object-position: 48% center; }
        .hero-sunmark { position: absolute; left: 10%; top: 7%; z-index: 2; display: grid; place-items: center; width: clamp(62px, 8vw, 105px); aspect-ratio: 1; border-radius: 50%; background: var(--sun); color: var(--ink); font: italic 500 clamp(34px, 4vw, 53px)/1 Georgia, serif; }
        .hero-side-note { position: absolute; bottom: 8%; right: -2%; color: var(--ink-soft); font-size: 8px; line-height: 1.6; letter-spacing: .17em; writing-mode: vertical-rl; }
        .hero-bottomline { min-height: 49px; border-top: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 14px; color: var(--ink-soft); font-size: 8px; letter-spacing: .17em; }
        .start-here { display: grid; grid-template-columns: 1.05fr repeat(3, 1fr); align-items: stretch; padding: 0 clamp(22px, 7.1vw, 112px); background: var(--paper-deep); border-block: 1px solid var(--line); }
        .start-intro, .start-link { min-height: 130px; display: flex; flex-direction: column; justify-content: center; }
        .start-intro { padding-right: 16px; }
        .start-intro h2 { margin: 9px 0 0; font: 500 27px Georgia, serif; letter-spacing: -.04em; }
        .start-link { padding: 17px clamp(14px, 2vw, 32px); border-left: 1px solid var(--line); position: relative; display: grid; grid-template-columns: 25px 1fr 17px; align-items: center; gap: 12px; transition: background .2s ease; }
        .start-link:hover { background: rgba(242, 188, 69, .18); }
        .start-number { align-self: start; color: var(--orange); font: 500 12px Georgia, serif; }
        .start-link b, .start-link small { display: block; }
        .start-link b { font: 500 22px Georgia, serif; }
        .start-link small { color: var(--ink-soft); font-size: 10px; margin-top: 5px; }
        .start-link > svg { width: 16px; }
        .route-section { background: var(--ink); color: var(--paper); padding: 100px clamp(22px, 9vw, 145px) 72px; }
        .route-heading { max-width: 690px; margin: auto; text-align: center; }
        .route-heading h2 { margin: 20px 0 17px; font-size: clamp(45px, 6vw, 76px); }
        .route-heading h2 em { color: var(--sun); }
        .route-heading p { max-width: 435px; margin: 0 auto; color: rgba(243,239,223,.68); font-size: 14px; line-height: 1.75; }
        .route-map { width: 100%; max-width: 980px; height: clamp(135px, 20vw, 230px); margin: 45px auto 0; }
        .route-map svg { width: 100%; height: 100%; overflow: visible; }
        .route-map path { fill: none; vector-effect: non-scaling-stroke; }
        .route-dash { stroke: rgba(243,239,223,.22); stroke-width: 1; stroke-dasharray: 3 7; }
        .route-path { stroke: var(--sun); stroke-width: 1.5; stroke-dasharray: 2 4; }
        .route-dot { fill: var(--sun); }
        .route-halo { fill: none; stroke: rgba(242,188,69,.24); stroke-width: .6; }
        .route-map text { fill: var(--paper); font: 700 3.1px "Avenir Next", sans-serif; letter-spacing: .1em; }
        .route-map .route-stop-number { fill: rgba(243,239,223,.48); font-size: 2px; }
        .route-foot { max-width: 980px; margin: auto; padding-top: 16px; display: flex; justify-content: space-between; color: rgba(243,239,223,.52); font-size: 8px; letter-spacing: .14em; }
        .chapters-section { padding: 112px clamp(22px, 8.5vw, 136px) 120px; }
        .section-heading, .memory-heading { max-width: 1180px; margin: auto; display: flex; justify-content: space-between; align-items: end; gap: 28px; }
        .section-heading h2, .memory-heading h2 { font-size: clamp(44px, 6vw, 76px); margin: 18px 0 0; }
        .section-count { padding-bottom: 8px; color: var(--ink-soft); font-size: 8px; letter-spacing: .16em; white-space: nowrap; }
        .chapter-list { max-width: 1180px; margin: 62px auto 0; }
        .chapter { display: grid; grid-template-columns: 1.08fr .92fr; align-items: center; gap: clamp(36px, 8vw, 120px); padding: 44px 0 72px; border-top: 1px solid var(--line); }
        .chapter:nth-child(even) { grid-template-columns: .92fr 1.08fr; }
        .chapter:nth-child(even) .chapter-lead-image { order: 2; }
        .chapter:nth-child(even) .chapter-copy { order: 1; }
        .chapter-lead-image { position: relative; aspect-ratio: 1.08 / 1; overflow: hidden; background: var(--paper-deep); }
        .chapter-lead-image img { transition: transform .8s cubic-bezier(.2,.7,.2,1); }
        .chapter-lead-image:hover img { transform: scale(1.025); }
        .chapter-image-index { position: absolute; left: 0; bottom: 0; padding: 11px 14px; background: var(--sun); color: var(--ink); font-size: 8px; font-weight: 800; letter-spacing: .13em; }
        .chapter-copy h3 { margin: 17px 0 15px; font: 500 clamp(37px, 4.6vw, 62px)/.98 Georgia, serif; letter-spacing: -.055em; }
        .chapter-copy h3 sup { margin-left: 10px; vertical-align: top; color: var(--orange); font: 700 9px "Avenir Next", sans-serif; letter-spacing: .1em; }
        .chapter-copy > p { max-width: 430px; margin: 0; color: var(--ink-soft); font: 17px/1.65 Georgia, serif; }
        .chapter-coords { display: flex; align-items: center; gap: 7px; margin-top: 19px; color: var(--orange); font: 700 8px "Avenir Next", sans-serif; letter-spacing: .09em; }
        .chapter-coords svg { width: 13px; height: 13px; }
        .chapter-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 29px; }
        .chapter-gallery figure { margin: 0; }
        .chapter-gallery figure img { aspect-ratio: 1.22; background: var(--paper-deep); }
        .chapter-gallery figcaption { padding-top: 7px; color: var(--ink-soft); font-size: 7px; letter-spacing: .13em; }
        .chapter-3 .chapter-lead-image { aspect-ratio: .97; }
        .memory-section { padding: 100px 0 92px; background: #e8e2ce; overflow: hidden; }
        .memory-heading { padding: 0 clamp(22px, 8.5vw, 136px); align-items: end; }
        .memory-heading h2 { font-size: clamp(43px, 5.5vw, 72px); }
        .memory-heading > p { max-width: 275px; margin: 0 0 7px; color: var(--ink-soft); font-size: 12px; line-height: 1.7; }
        .memory-rail { display: flex; gap: 18px; overflow-x: auto; padding: 53px clamp(22px, 8.5vw, 136px) 18px; scroll-snap-type: x mandatory; scrollbar-width: thin; scrollbar-color: var(--orange) transparent; }
        .memory-card { position: relative; flex: 0 0 clamp(240px, 26vw, 355px); aspect-ratio: .79; overflow: hidden; scroll-snap-align: start; background: var(--ink); color: var(--paper); }
        .memory-card img { opacity: .86; transition: transform .7s cubic-bezier(.2,.7,.2,1), opacity .3s ease; }
        .memory-card:hover img { transform: scale(1.035); opacity: 1; }
        .memory-overlay { position: absolute; inset: 32% 0 0; display: flex; flex-direction: column; justify-content: end; padding: 23px; background: linear-gradient(0deg, rgba(12,36,33,.9), transparent); }
        .memory-index { color: var(--sun); font-size: 8px; font-weight: 700; letter-spacing: .17em; }
        .memory-overlay h3 { margin: 9px 0 5px; font: 500 28px Georgia, serif; }
        .memory-overlay p { margin: 0; color: rgba(243,239,223,.74); font-size: 11px; }
        .memory-camera { position: absolute; top: 17px; right: 17px; width: 19px; color: var(--paper); }
        .rail-hint { margin: 13px clamp(22px, 8.5vw, 136px) 0; color: var(--ink-soft); font-size: 8px; letter-spacing: .15em; text-align: right; }
        .rail-hint span { color: var(--orange); padding-left: 8px; font-size: 14px; }
        .notes-section { padding: 115px clamp(22px, 8.5vw, 136px) 130px; }
        .notes-layout { max-width: 1180px; margin: auto; display: grid; grid-template-columns: .76fr 1.24fr; gap: clamp(48px, 10vw, 150px); }
        .notes-aside { position: relative; align-self: start; padding-top: 12px; }
        .notes-aside h2 { margin: 25px 0 22px; font-size: clamp(63px, 8vw, 104px); }
        .notes-aside h2 em { color: var(--orange); }
        .notes-aside > p { max-width: 260px; color: var(--ink-soft); font: 16px/1.7 Georgia, serif; }
        .notes-map-icon { width: 34px; height: 34px; margin-top: 28px; color: var(--orange); stroke-width: 1; }
        .notes-list { border-top: 1px solid var(--line); }
        .note-entry { padding: 26px 0 33px; border-bottom: 1px solid var(--line); }
        .note-meta { display: flex; align-items: center; justify-content: space-between; color: var(--orange); font-size: 8px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; }
        .note-meta span:first-child { color: var(--ink-soft); }
        .note-entry h3 { margin: 18px 0 5px; font: 500 29px Georgia, serif; letter-spacing: -.03em; }
        .note-coords { margin: 0; color: var(--ink-soft); font-size: 8px; letter-spacing: .1em; }
        .note-entry blockquote { max-width: 620px; margin: 21px 0 0; color: var(--ink); font: italic 19px/1.65 Georgia, serif; }
        .closing-section { padding: 0 clamp(22px, 8.5vw, 136px); background: var(--ink); color: var(--paper); }
        .closing-top { max-width: 1180px; margin: auto; padding: 97px 0 89px; display: grid; grid-template-columns: 1fr .82fr; align-items: center; column-gap: 8vw; }
        .closing-top > .eyebrow { grid-column: 1 / -1; }
        .closing-top h2 { grid-column: 1; margin: 20px 0 0; font-size: clamp(49px, 6.5vw, 84px); }
        .closing-top h2 em { color: var(--sun); }
        .closing-watch { grid-column: 2; grid-row: 2; min-height: 93px; display: flex; align-items: center; gap: 17px; padding: 15px 0; border-bottom: 1px solid rgba(243,239,223,.28); transition: border-color .2s ease; }
        .closing-watch:hover { border-color: var(--sun); }
        .play-disc { width: 42px; height: 42px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%; background: var(--sun); color: var(--ink); }
        .play-disc svg { width: 16px; height: 16px; }
        .closing-watch b, .closing-watch small { display: block; }
        .closing-watch b { font: 500 19px Georgia, serif; }
        .closing-watch small { margin-top: 6px; color: rgba(243,239,223,.64); font-size: 9px; }
        .closing-arrow { width: 18px; margin-left: auto; color: var(--sun); }
        .closing-bottom { max-width: 1180px; min-height: 88px; margin: auto; border-top: 1px solid rgba(243,239,223,.22); display: flex; align-items: center; gap: 19px; }
        .footer-mark { color: var(--paper); font-size: 30px; }
        .closing-bottom > p { color: rgba(243,239,223,.65); font: italic 12px Georgia, serif; }
        .social-links { display: flex; gap: 17px; margin-left: auto; }
        .social-links a { display: inline-flex; align-items: center; gap: 4px; color: rgba(243,239,223,.74); font-size: 9px; transition: color .2s ease; }
        .social-links a:hover { color: var(--sun); }
        .social-links svg { width: 11px; height: 11px; }
        .copyright { color: rgba(243,239,223,.45); font-size: 7px; letter-spacing: .12em; white-space: nowrap; }
        @media (max-width: 900px) {
          .journal-nav { min-height: 65px; padding-inline: 22px; gap: 18px; }
          .story-nav { gap: 17px; }
          .story-nav a { font-size: 10px; }
          .hero { padding-inline: 34px; }
          .hero-grid { min-height: 620px; }
          .hero h1 { font-size: clamp(58px, 8vw, 80px); }
          .hero-art { min-height: 490px; }
          .start-here { padding-inline: 30px; grid-template-columns: repeat(3, 1fr); }
          .start-intro { grid-column: 1 / -1; min-height: 87px; }
          .start-link { min-height: 96px; border-top: 1px solid var(--line); }
          .chapter { gap: 35px; }
          .chapter-copy h3 { font-size: 42px; }
          .closing-bottom { flex-wrap: wrap; padding-block: 16px; }
          .closing-bottom > p { margin-right: auto; }
        }
        @media (max-width: 640px) {
          .journal-nav { min-height: 61px; padding: 0 17px; gap: 12px; }
          .wordmark { gap: 8px; }
          .wordmark-mark { font-size: 31px; }
          .wordmark-copy { font-size: 8px; }
          .wordmark-copy small { font-size: 7px; }
          .story-nav { order: 3; position: absolute; top: 60px; left: 0; right: 0; padding: 0 17px; height: 43px; overflow-x: auto; justify-content: flex-start; gap: 23px; background: rgba(243,239,223,.96); border-bottom: 1px solid var(--line); scrollbar-width: none; }
          .story-nav::-webkit-scrollbar { display: none; }
          .story-nav a { white-space: nowrap; font-size: 9px; }
          .nav-watch { margin-left: auto; font-size: 9px; }
          .hero { padding: 77px 20px 0; }
          .hero-grid { display: flex; flex-direction: column; align-items: stretch; gap: 31px; min-height: unset; }
          .hero-copy { padding: 17px 0 0; }
          .eyebrow { font-size: 8px; letter-spacing: .18em; }
          .hero h1 { margin: 18px 0 16px; font-size: clamp(53px, 14vw, 76px); line-height: .9; }
          .hero-deck { max-width: 360px; font-size: 14px; line-height: 1.6; }
          .hero-actions { gap: 14px; margin-top: 22px; }
          .button-primary { padding: 13px 15px 13px 17px; font-size: 11px; }
          .hero-edition { font-size: 7px; }
          .hero-route-stamp { display: none; }
          .hero-art { min-height: 0; height: clamp(275px, 83vw, 430px); margin: 0 -3px 8px; }
          .hero-main-image { right: 0; width: 82%; height: 89%; }
          .hero-overlap-image { left: 0; bottom: 0; width: 36%; height: 38%; padding: 5px; }
          .hero-sunmark { width: 56px; left: 4%; top: 5%; font-size: 30px; }
          .hero-side-note { right: -3px; bottom: 9%; font-size: 6px; }
          .image-caption { padding: 8px 9px; font-size: 7px; }
          .hero-bottomline { min-height: 44px; font-size: 6px; letter-spacing: .1em; }
          .hero-bottomline span:last-child { text-align: right; }
          .start-here { grid-template-columns: 1fr; padding: 0 20px 14px; }
          .start-intro { min-height: 91px; }
          .start-intro h2 { font-size: 24px; }
          .start-link { min-height: 74px; padding: 12px 5px; border-left: 0; grid-template-columns: 29px 1fr 20px; }
          .start-link b { font-size: 19px; }
          .route-section { padding: 76px 22px 47px; }
          .route-heading h2 { font-size: 46px; line-height: .98; }
          .route-heading p { font-size: 12px; }
          .route-map { height: 135px; margin: 38px -2px 0; width: calc(100% + 4px); }
          .route-foot { flex-wrap: wrap; justify-content: space-between; gap: 12px 6px; padding-top: 8px; font-size: 6px; letter-spacing: .09em; }
          .chapters-section { padding: 76px 20px 77px; }
          .section-heading, .memory-heading { display: block; }
          .section-heading h2, .memory-heading h2 { font-size: 47px; line-height: .98; }
          .section-count { display: block; margin-top: 17px; font-size: 7px; }
          .chapter-list { margin-top: 33px; }
          .chapter, .chapter:nth-child(even) { display: flex; flex-direction: column; align-items: stretch; gap: 25px; padding: 26px 0 39px; }
          .chapter:nth-child(even) .chapter-lead-image, .chapter:nth-child(even) .chapter-copy { order: initial; }
          .chapter-lead-image { aspect-ratio: 1.03; }
          .chapter-copy h3 { margin: 12px 0; font-size: 42px; }
          .chapter-copy > p { font-size: 16px; }
          .chapter-gallery { gap: 9px; margin-top: 21px; }
          .chapter-gallery figure img { aspect-ratio: 1.12; }
          .memory-section { padding: 74px 0 62px; }
          .memory-heading { padding-inline: 20px; }
          .memory-heading h2 { font-size: 44px; }
          .memory-heading > p { max-width: 300px; margin-top: 15px; font-size: 11px; }
          .memory-rail { gap: 13px; padding: 31px 20px 16px; }
          .memory-card { flex-basis: 76vw; max-width: 315px; }
          .memory-overlay { padding: 18px; }
          .memory-overlay h3 { font-size: 25px; }
          .rail-hint { margin: 10px 20px 0; font-size: 7px; }
          .notes-section { padding: 78px 21px 83px; }
          .notes-layout { display: block; }
          .notes-aside h2 { margin: 17px 0 14px; font-size: 66px; }
          .notes-aside h2 br { display: none; }
          .notes-aside > p { max-width: 335px; margin-bottom: 34px; font-size: 14px; }
          .notes-map-icon { display: none; }
          .note-entry { padding: 22px 0 25px; }
          .note-entry h3 { font-size: 26px; }
          .note-entry blockquote { font-size: 17px; }
          .closing-section { padding: 0 21px; }
          .closing-top { display: block; padding: 71px 0 55px; }
          .closing-top h2 { margin: 17px 0 31px; font-size: 52px; }
          .closing-watch { min-height: 78px; }
          .closing-watch b { font-size: 17px; }
          .closing-watch small { font-size: 8px; }
          .closing-bottom { gap: 11px 14px; padding: 17px 0 20px; }
          .footer-mark { font-size: 28px; }
          .closing-bottom > p { flex: 1; font-size: 10px; }
          .social-links { order: 3; width: 100%; margin: 5px 0 0; justify-content: flex-start; flex-wrap: wrap; gap: 16px; }
          .social-links a { font-size: 9px; }
          .copyright { margin-left: auto; font-size: 6px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dax-journal *, .dax-journal *::before, .dax-journal *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
    </div>
  );
}