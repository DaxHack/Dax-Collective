import React, { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Compass, Cross, Globe2, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './Home.css';

const worlds = [
  {
    tone: 'traveler',
    index: '01',
    name: 'Dax the Traveler',
    short: 'Travel, lived personally.',
    descriptor: 'A personal view from the middle of the journey.',
    route: '/dax-the-traveler',
    image: '/images/dax-personal/havana-balcony.webp',
    alt: 'Dax with Havana’s Capitol in the distance',
    secondaryImage: '/images/dax-personal/cuba-classic-car.webp',
    secondaryAlt: 'Dax beside a blue classic car in Cuba',
    signifier: 'CUBA / IN MOTION',
    icon: Compass,
  },
  {
    tone: 'anime',
    index: '02',
    name: 'Ani-Dax',
    short: 'Stories, opened up.',
    descriptor: 'Anime analysis and lore, with room to follow the thread.',
    route: '/ani-dax',
    image: '/assets/approved-media/anidax/setup-anidax-recording-space.png',
    alt: 'Ani-Dax recording and discussion space',
    signifier: 'STORY / SUBTEXT',
    icon: Sparkles,
  },
  {
    tone: 'vessel',
    index: '03',
    name: "God's Vessel",
    short: 'Faith, held with care.',
    descriptor: 'A thoughtful space for faith, reflection, and expression.',
    route: '/gods-vessel',
    image: '/assets/approved-media/gods-vessel/hoodie-el-shaddai-front.png',
    alt: "God's Vessel El Shaddai hoodie",
    signifier: 'FAITH / REFLECTION',
    icon: Cross,
  },
  {
    tone: 'timezone',
    index: '04',
    name: 'Time-Zone Travelers',
    short: 'The world, at different hours.',
    descriptor: 'A wider view of places and the many hours inside them.',
    route: '/timezone-travelers',
    image: '/assets/approved-media/time-zone-travelers/2024-tokyo-zone-guide-shibuya.png',
    alt: 'Shibuya, Tokyo, in the evening',
    signifier: 'PLACE / TIME',
    icon: Globe2,
  },
];

function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef(null);
  const touchStart = useRef(null);
  const activeWorld = worlds[activeIndex];
  const ActiveIcon = activeWorld.icon;

  const selectWorld = useCallback((index) => setActiveIndex(index), []);

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const resetTouch = () => { touchStart.current = null; };
  const handleTouchEnd = (event) => {
    if (event.touches.length > 0) {
      touchStart.current = null;
      return;
    }
    if (!touchStart.current) return;
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    setActiveIndex((current) => (current + (dx < 0 ? 1 : -1) + worlds.length) % worlds.length);
  };

  const handlePointerMove = (event) => {
    if (prefersReducedMotion || event.pointerType !== 'mouse' || !stageRef.current) return;
    const bounds = stageRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    stageRef.current.style.setProperty('--light-x', `${50 + x * 18}%`);
    stageRef.current.style.setProperty('--light-y', `${36 + y * 16}%`);
    stageRef.current.style.setProperty('--depth-x', `${x * 5}px`);
    stageRef.current.style.setProperty('--depth-y', `${y * 5}px`);
  };
  const resetPointer = () => {
    if (!stageRef.current) return;
    stageRef.current.style.setProperty('--light-x', '50%');
    stageRef.current.style.setProperty('--light-y', '36%');
    stageRef.current.style.setProperty('--depth-x', '0px');
    stageRef.current.style.setProperty('--depth-y', '0px');
  };

  return (
    <main className="collective-home">
      <Helmet>
        <title>The Dax Collective | One collective. Multiple worlds.</title>
        <meta
          name="description"
          content="Step into Daniel “Dax”'s creative worlds: travel, anime, faith, and places across time zones."
        />
      </Helmet>

      <section
        ref={stageRef}
        className={`collective-home__universe collective-home__universe--${activeWorld.tone}`}
        aria-labelledby="collective-title"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div className="collective-home__ambient-grid" aria-hidden="true" />
        <div className="collective-home__identity">
          <Link to="/" className="collective-home__wordmark" data-testid="link-home-brand" aria-label="The Dax Collective home">
            <span className="collective-home__mark">D</span>
            <span>THE DAX COLLECTIVE</span>
          </Link>
          <motion.div
            className="collective-home__identity-copy"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="collective-home__kicker">Daniel “Dax” · A creative universe</p>
            <h1 id="collective-title">One collective.<br /><span>Multiple worlds.</span></h1>
            <p className="collective-home__intro-copy">Different interests. Different energies. Follow the one that pulls you in.</p>
          </motion.div>
          <a className="collective-home__skip" href="#portal-worlds" data-testid="link-explore-worlds">
            Explore the worlds <ArrowDownRight size={15} aria-hidden="true" />
          </a>
        </div>

        <div
          className={`collective-home__portal-stage collective-home__portal-stage--${activeWorld.tone}`}
          id="portal-worlds"
          data-testid={`portal-feature-${activeWorld.tone}`}
          aria-live="polite"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={resetTouch}
        >
          <div className="collective-home__visual" key={activeWorld.tone}>
            <img
              className="collective-home__visual-image"
              src={activeWorld.image}
              alt={activeWorld.alt}
              loading="eager"
              draggable="false"
            />
            {activeWorld.tone === 'traveler' && (
              <div className="collective-home__travel-layer" data-testid="image-traveler-car">
                <img src={activeWorld.secondaryImage} alt={activeWorld.secondaryAlt} loading="lazy" draggable="false" />
                <span>Havana · Cuba</span>
              </div>
            )}
            {activeWorld.tone === 'anime' && <div className="collective-home__anime-mark" aria-hidden="true"><span>ANALYZE</span><span>REWATCH</span><i /></div>}
            {activeWorld.tone === 'vessel' && <div className="collective-home__vessel-halo" aria-hidden="true"><i /><i /><i /></div>}
            {activeWorld.tone === 'timezone' && (
              <svg className="collective-home__orbit" viewBox="0 0 420 420" aria-hidden="true">
                <circle cx="210" cy="210" r="153" />
                <ellipse cx="210" cy="210" rx="153" ry="61" transform="rotate(-32 210 210)" />
                <ellipse cx="210" cy="210" rx="153" ry="61" transform="rotate(32 210 210)" />
                <circle className="collective-home__orbit-node" cx="340" cy="130" r="4" />
                <circle className="collective-home__orbit-node collective-home__orbit-node--two" cx="85" cy="272" r="3" />
              </svg>
            )}
          </div>
          <div className="collective-home__image-shade" aria-hidden="true" />
          <div className="collective-home__portal-coordinates">
            <span className="collective-home__world-index">{activeWorld.index} <i /> 04</span>
            <span className="collective-home__signifier">{activeWorld.signifier}</span>
          </div>
          <div className="collective-home__portal-copy">
            <div className="collective-home__portal-heading">
              <ActiveIcon size={17} strokeWidth={1.5} aria-hidden="true" />
              <span>{activeWorld.name}</span>
            </div>
            <h2 className="collective-home__portal-title">{activeWorld.short}</h2>
            <p>{activeWorld.descriptor}</p>
            <Link
              to={activeWorld.route}
              className="collective-home__enter"
              data-testid={`link-world-${activeWorld.tone}`}
              aria-label={`Enter ${activeWorld.name}`}
            >
              Enter this world <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="collective-home__swipe-hint" aria-hidden="true"><span /> Swipe to shift worlds</div>

          <nav className="collective-home__selector" aria-label="Select a collective world">
            {worlds.map((world, index) => {
              const Icon = world.icon;
              return (
                <button
                  key={world.tone}
                  type="button"
                  className={`collective-home__selector-button collective-home__selector-button--${world.tone}`}
                  aria-pressed={index === activeIndex}
                  data-testid={`portal-option-${world.tone}`}
                  onClick={() => selectWorld(index)}
                >
                  <span className="collective-home__selector-number">{world.index}</span>
                  <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
                  <span className="collective-home__selector-name">{world.name}</span>
                  <span className="collective-home__selector-state">{index === activeIndex ? 'Selected' : 'Open world'}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="collective-home__stage-index" aria-hidden="true">COLLECTIVE / 001</div>
      </section>

      <section className="collective-home__about" aria-labelledby="about-collective-title">
        <div className="collective-home__about-inner">
          <p className="collective-home__about-label">More than one lane</p>
          <div>
            <h2 id="about-collective-title">A shared home for what keeps me curious.</h2>
            <p>
              The Dax Collective brings together Daniel’s distinct creative worlds: travel told personally,
              anime explored in depth, faith approached with care, and a wider view of places around the globe.
              Each has its own voice. Follow the thread that feels right to you.
            </p>
          </div>
        </div>
      </section>

      <footer className="collective-home__footer" id="world-links">
        <Link to="/" className="collective-home__footer-brand" data-testid="link-footer-home">
          <span className="collective-home__mark">D</span> THE DAX COLLECTIVE
        </Link>
        <nav aria-label="All worlds" className="collective-home__footer-worlds">
          {worlds.map((world) => (
            <Link
              to={world.route}
              key={world.tone}
              data-testid={`link-world-route-${world.tone}`}
            >
              {world.name}<ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  );
}

export default Home;