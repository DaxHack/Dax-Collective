import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './UniverseShell.css';

const BASE = '/experiments/dax-universe';
const worlds = [
  { name: 'The gateway', short: 'Collective', path: BASE },
  { name: 'Dax the Traveler', short: 'Traveler', path: `${BASE}/traveler` },
  { name: "God's Vessel", short: "God's Vessel", path: `${BASE}/gods-vessel` },
  { name: 'Ani-Dax', short: 'Ani-Dax', path: `${BASE}/ani-dax` },
  { name: 'Time-Zone Travelers', short: 'Time-Zone', path: `${BASE}/timezone-travelers` },
];

function UniverseShell({ children }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const menuTriggerRef = useRef(null);
  const firstMenuLinkRef = useRef(null);
  const activeWorld = worlds.find((world) => world.path === pathname) || worlds[0];

  useEffect(() => {
    setMenuOpen(false);
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) firstMenuLinkRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <div className="dax-universe-shell">
      <header className="dax-v2__header">
        <Link className="dax-v2__brand" to={BASE} aria-label="Dax Collective V2 gateway">
          <span className="dax-v2__brand-mark">D<span>.</span></span>
          <span className="dax-v2__brand-name">DAX COLLECTIVE <i>/ LOCAL V2</i></span>
        </Link>
        <nav className="dax-v2__desktop-nav" aria-label="Collective worlds">
          {worlds.slice(1).map((world) => (
            <Link
              className={`dax-v2__nav-link${activeWorld.path === world.path ? ' is-active' : ''}`}
              key={world.path}
              to={world.path}
              aria-current={activeWorld.path === world.path ? 'page' : undefined}
            >
              {world.short}
            </Link>
          ))}
        </nav>
        <div className="dax-v2__header-actions">
          <a className="dax-v2__v1-link" href="/" aria-label="Exit local V2 and return to the current Dax Collective site">
            <span>V1</span><ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <button
            className="dax-v2__menu-toggle"
            ref={menuTriggerRef}
            type="button"
            aria-label={menuOpen ? 'Close world navigation' : 'Open world navigation'}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? 'dax-v2-mobile-menu' : undefined}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="dax-v2-mobile-menu"
            className="dax-v2__mobile-menu"
            aria-label="Mobile collective worlds"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p>CHOOSE A WORLD <span>LOCAL PREVIEW / 02</span></p>
            {worlds.map((world, index) => (
              <Link
                key={world.path}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                to={world.path}
                onClick={() => {
                  setMenuOpen(false);
                  requestAnimationFrame(() => menuTriggerRef.current?.focus());
                }}
                aria-current={activeWorld.path === world.path ? 'page' : undefined}
              >
                <span>0{index + 1}</span>{world.name}<ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
            <a className="dax-v2__mobile-v1" href="/">Return to the current site <ArrowUpRight size={14} /></a>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="dax-v2__page" key={pathname}>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>

      <footer className="dax-v2__footer">
        <Link className="dax-v2__footer-mark" to={BASE}><span>D.</span> THE DAX COLLECTIVE</Link>
        <p>A creative universe by Daniel “Dax” Rollins.</p>
        <nav aria-label="Legal and contact">
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
          <a href="/" className="dax-v2__footer-v1">Current site / V1 <ArrowUpRight size={12} /></a>
        </nav>
        <span className="dax-v2__footer-note">LOCAL PREVIEW · V2 CONCEPT</span>
      </footer>
    </div>
  );
}

export default UniverseShell;