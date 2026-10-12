import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Cross, Globe2, Orbit, Play, Sparkles } from 'lucide-react';
import './UniverseHomePage.css';

const BASE = '/experiments/dax-universe';
const worlds = [
  {
    id: 'traveler',
    number: '01',
    eyebrow: 'PERSONAL TRAVEL · PRESENT TENSE',
    name: 'Dax the Traveler',
    line: 'The world, from where I stand.',
    description: 'Travel through a personal lens: the pause before the next place, the small details worth keeping, and the feeling of being there.',
    image: '/images/dax-personal/havana-balcony.webp',
    alt: 'Daniel on a Havana balcony with the Capitol in the distance',
    detail: '/images/dax-personal/cuba-classic-car.webp',
    detailAlt: 'A blue classic car in Cuba with Daniel',
    route: `${BASE}/traveler`,
    color: 'traveler',
    concept: 'CUBA · CAPTURE DATE UNKNOWN',
    icon: Orbit,
  },
  {
    id: 'vessel',
    number: '02',
    eyebrow: 'FAITH · REFLECTION',
    name: "God's Vessel",
    line: 'Belief, made visible.',
    description: 'A considered space for faith, reflection, and expression—held with care rather than noise.',
    image: '/assets/approved-media/gods-vessel/hoodie-el-shaddai-front.png',
    alt: "God's Vessel El Shaddai hoodie, photographed from the front",
    detail: '/images/gods-vessel/merch/001.jpg',
    detailAlt: "God's Vessel product image",
    route: `${BASE}/gods-vessel`,
    color: 'vessel',
    concept: 'CONCEPTUAL PRODUCT IMAGE',
    icon: Cross,
  },
  {
    id: 'ani',
    number: '03',
    eyebrow: 'ANIME · ANALYSIS',
    name: 'Ani-Dax',
    line: 'Stories have another layer.',
    description: 'Follow the subtext, the theories, and the small clues that make a story stay with you.',
    image: '/images/experiments/ani/analysis-chamber.svg',
    alt: 'Original Ani-Dax analysis-chamber concept diagram',
    detail: '/images/experiments/ani/return-memory-model.svg',
    detailAlt: 'Original illustrative model of memory and repeated experience',
    route: `${BASE}/ani-dax`,
    color: 'ani',
    concept: 'ORIGINAL CONCEPT DIAGRAM · NOT SOURCE FOOTAGE',
    icon: Sparkles,
  },
  {
    id: 'timezone',
    number: '04',
    eyebrow: 'PLACES · MANY HOURS',
    name: 'Time-Zone Travelers',
    line: 'A wider world. Different hours.',
    description: 'An ongoing curiosity about place and time: how a city changes its character as the light moves through it.',
    image: '/assets/approved-media/time-zone-travelers/2024-tokyo-zone-guide-shibuya.png',
    alt: 'Conceptual evening view of Shibuya, Tokyo',
    detail: '/assets/approved-media/time-zone-travelers/2023-paris-seine-riverbank-dusk.png',
    detailAlt: 'Conceptual view of the Seine riverbank at dusk in Paris',
    route: `${BASE}/timezone-travelers`,
    color: 'timezone',
    concept: 'CONCEPTUAL ENVIRONMENT · NOT A TRIP CLAIM',
    icon: Globe2,
  },
];

function UniverseHomePage() {
  const [selected, setSelected] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const reducedMotion = useReducedMotion();
  const sceneRefs = useRef([]);
  const pointerStart = useRef(null);
  const current = worlds[selected];
  const CurrentIcon = current.icon;

  useEffect(() => {
    let frame = 0;
    const updateFromScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nodes = sceneRefs.current.filter(Boolean);
        const headerHeight = document.querySelector('.dax-universe-shell > .dax-v2__header')?.getBoundingClientRect().height || 0;
        const focusY = Math.min(window.innerHeight - 1, headerHeight + (window.innerHeight - headerHeight) * 0.54);
        const visible = nodes
          .map((node) => ({ node, rect: node.getBoundingClientRect() }))
          .filter(({ rect }) => rect.bottom > headerHeight && rect.top < window.innerHeight)
          .sort((a, b) => Math.abs((a.rect.top + a.rect.bottom) / 2 - focusY) - Math.abs((b.rect.top + b.rect.bottom) / 2 - focusY))[0];
        if (visible) {
          const index = Number(visible.node.dataset.sceneIndex);
          setActiveScene(index);
          setSelected(index);
        }
      });
    };
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    updateFromScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
    };
  }, []);

  const moveSelection = (delta) => {
    setSelected((index) => {
      const next = (index + delta + worlds.length) % worlds.length;
      setActiveScene(next);
      return next;
    });
  };
  const chooseWorld = (index) => {
    setSelected(index);
    setActiveScene(index);
    const node = sceneRefs.current[index];
    if (!node) return;
    const headerHeight = document.querySelector('.dax-universe-shell > .dax-v2__header')?.getBoundingClientRect().height || 0;
    const top = window.scrollY + node.getBoundingClientRect().top - headerHeight - 8;
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const onTouchStart = (event) => {
    if (event.touches.length !== 1) { pointerStart.current = null; return; }
    pointerStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };
  const onTouchEnd = (event) => {
    if (event.touches.length || !pointerStart.current) { pointerStart.current = null; return; }
    const dx = event.changedTouches[0].clientX - pointerStart.current.x;
    const dy = event.changedTouches[0].clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) moveSelection(dx < 0 ? 1 : -1);
  };

  return (
    <main className="universe-home">
      <section className="universe-hero" aria-labelledby="universe-title">
        <div className="universe-hero__grain" aria-hidden="true" />
        <div className="universe-hero__orbital" aria-hidden="true">
          <span className="universe-hero__orbit universe-hero__orbit--one" />
          <span className="universe-hero__orbit universe-hero__orbit--two" />
          <span className="universe-hero__orbit universe-hero__orbit--three" />
          <span className="universe-hero__orbit-dot" />
        </div>
        <div className="universe-hero__topline">
          <span>FIELD NOTES FROM A CREATIVE LIFE</span>
          <span><i /> INDEPENDENT WORLDS / 04</span>
        </div>
        <div className="universe-hero__copy">
          <motion.p
            className="universe-eyebrow"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7 }}
          >DANIEL “DAX” ROLLINS <span>·</span> CREATOR / OPERATOR / STORYTELLER</motion.p>
          <motion.h1
            id="universe-title"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .9, delay: .08, ease: [0.22, 1, .36, 1] }}
          >One collective.<br /><em>Multiple worlds.</em></motion.h1>
          <motion.p className="universe-hero__lede"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, delay: .23 }}
          >Four distinct creative directions. One person following what holds his attention.</motion.p>
          <a className="universe-hero__explore" href="#world-console">
            <span className="universe-hero__explore-icon"><ArrowDown size={15} /></span>
            <span>Explore the collective</span>
          </a>
        </div>
        <div className="universe-hero__portrait">
          <img src="/images/dax-personal/evening-portrait.webp" alt="Daniel “Dax” Rollins" />
          <div className="universe-hero__portrait-overlay" />
          <div className="universe-hero__portrait-caption">
            <span>THE PERSON BEHIND THE SIGNAL</span>
            <span>DANIEL “DAX” ROLLINS</span>
          </div>
          <div className="universe-hero__portrait-index">D / 001</div>
        </div>
        <div className="universe-hero__bottomline">
          <span>CREATIVE UNIVERSE <b>—</b> LOCAL V2</span>
          <span>SCROLL TO ENTER <span className="universe-hero__scroll-line" /></span>
        </div>
      </section>

      <section className="universe-console" id="world-console" aria-labelledby="console-heading">
        <div className="universe-console__header">
          <div>
            <p className="universe-eyebrow">A WORLD SELECTOR, NOT A STARTING POINT</p>
            <h2 id="console-heading">Choose your<br /><em>frequency.</em></h2>
          </div>
          <p className="universe-console__note">Each world begins with a different question.<br />Pick a signal and follow it through.</p>
        </div>

        <div id="world-preview" className={`universe-console__stage universe-console__stage--${current.color}`}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={() => { pointerStart.current = null; }}>
          <motion.div className="universe-console__image-frame" key={current.id}
            initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>
            <img src={current.image} alt={current.alt} />
            <div className="universe-console__image-shade" />
            <span className="universe-console__image-label">CONCEPT / VISUAL REFERENCE</span>
            {current.id === 'traveler' && (
              <div className="universe-console__portrait-inset">
                <img src={current.detail} alt={current.detailAlt} />
                <span>{current.concept}</span>
              </div>
            )}
            {current.id !== 'traveler' && <span className="universe-console__concept">{current.concept}</span>}
          </motion.div>
          <div className="universe-console__frame-coordinate">0{selected + 1} <span>/ 04</span></div>
          <div className="universe-console__copy" aria-live="polite">
            <div className="universe-console__copy-top"><CurrentIcon size={16} strokeWidth={1.4} /><span>{current.eyebrow}</span></div>
            <motion.div key={`${current.id}-text`} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
              <h3>{current.name}</h3>
              <p className="universe-console__line">{current.line}</p>
              <p className="universe-console__description">{current.description}</p>
            </motion.div>
            <Link to={current.route} className="universe-console__enter" data-testid={`link-enter-${current.id}`}>
              Enter this world <ArrowUpRight size={16} />
            </Link>
            <div className="universe-console__arrows">
              <button type="button" onClick={() => moveSelection(-1)} aria-label="Previous world"><ArrowLeft size={16} /></button>
              <button type="button" onClick={() => moveSelection(1)} aria-label="Next world"><ArrowRight size={16} /></button>
              <span>SWIPE OR SELECT</span>
            </div>
          </div>
          <div className="universe-console__selector" role="tablist" aria-label="Select a world">
            {worlds.map((world, index) => {
              const Icon = world.icon;
              return (
                <button
                  type="button"
                  role="tab"
                  key={world.id}
                  aria-selected={selected === index}
                  aria-controls="world-preview"
                  className={selected === index ? 'is-selected' : ''}
                  onClick={() => {
                    setSelected(index);
                    setActiveScene(index);
                  }}
                  data-testid={`button-select-${world.id}`}
                >
                  <span>{world.number}</span><Icon size={15} strokeWidth={1.5} /><b>{world.name}</b><ArrowUpRight size={13} className="universe-console__selector-arrow" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="universe-map" aria-label="World chapters">
        <div className="universe-map__intro">
          <p className="universe-eyebrow">FOUR THREADS, ONE POINT OF VIEW</p>
          <h2>Worlds in<br /><em>motion.</em></h2>
          <p>Stay with the signal. As you move through the collective, the world changes around you.</p>
        </div>
        <div className={`universe-story universe-story--${current.color}`}>
          <div className="universe-story__pinned" aria-live="polite">
            <motion.div className="universe-story__visual" key={`${current.id}-story`}
              initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : .5, ease: [.22, 1, .36, 1] }}>
              <img src={current.image} alt={current.alt} loading="lazy" />
              <div className="universe-story__image-shade" />
              <span className="universe-story__visual-label">{current.concept}</span>
              <span className="universe-story__visual-number">WORLD / {current.number}</span>
            </motion.div>
            <div className="universe-story__content">
              <div className="universe-story__status"><span className="universe-story__status-dot" />WORLD SELECT / 0{selected + 1} — 04</div>
              <div className="universe-story__identity" key={`${current.id}-identity`}>
                <div className="universe-story__worldline"><CurrentIcon size={16} /><span>{current.eyebrow}</span></div>
                <h3>{current.name}</h3>
                <p className="universe-story__tagline">{current.line}</p>
                <p className="universe-story__description">{current.description}</p>
                <Link to={current.route} className="universe-story__enter">Enter {current.name}<ArrowUpRight size={16} /></Link>
              </div>
              <div className="universe-story__select" role="group" aria-label="Jump to a world">
                {worlds.map((world, index) => (
                  <button type="button" key={world.id} onClick={() => chooseWorld(index)}
                    className={activeScene === index ? 'is-active' : ''} aria-current={activeScene === index ? 'step' : undefined}>
                    <span>{world.number}</span><i /><b>{world.name}</b>
                  </button>
                ))}
              </div>
              <span className="universe-story__scroll-cue">SCROLL TO SHIFT <ArrowDown size={12} /></span>
            </div>
          </div>
          <div className="universe-story__track" aria-hidden="true">
            {worlds.map((world, index) => (
              <section className="universe-story__chapter" key={world.id}
                ref={(node) => { sceneRefs.current[index] = node; }}
                data-scene-index={index} aria-label={world.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="universe-principle">
        <div className="universe-principle__mark" aria-hidden="true"><span>D</span><i /><i /><i /></div>
        <div className="universe-principle__content">
          <p className="universe-eyebrow">THE THROUGH-LINE</p>
          <h2>Curiosity is the<br /><em>common ground.</em></h2>
          <p>Daniel “Dax” Rollins creates, operates, and tells stories across four distinct creative brands. The connective thread is not a category. It is the willingness to look closer.</p>
          <Link to="/dax-the-traveler" className="universe-principle__link">See the current Traveler site <ArrowUpRight size={15} /></Link>
        </div>
        <div className="universe-principle__side-note">A CREATOR<br />BEHIND FOUR<br />OPEN WINDOWS</div>
      </section>

      <section className="universe-outro">
        <span className="universe-outro__orbit" aria-hidden="true" />
        <p className="universe-eyebrow">YOUR NEXT THREAD</p>
        <h2>Where does your<br /><em>attention go?</em></h2>
        <p>Choose a world. The rest can wait.</p>
        <button type="button" className="universe-outro__action" onClick={() => document.getElementById('world-console')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })}>
          <Play size={13} fill="currentColor" /> Return to world selection <ArrowUpRight size={14} />
        </button>
        <div className="universe-outro__foot"><span>DAX COLLECTIVE / WORLD SELECT</span><span>LOCAL PREVIEW — V2 CONCEPT</span></div>
      </section>
    </main>
  );
}

export default UniverseHomePage;