import React from 'react';
import { Link } from 'react-router-dom';

const v2Worlds = [
  { title: 'God’s Vessel', route: '/experiments/dax-universe/gods-vessel', mark: '01' },
  { title: 'Ani-Dax', route: '/experiments/dax-universe/ani-dax', mark: '02' },
  { title: 'Time-Zone Travelers', route: '/experiments/dax-universe/timezone-travelers', mark: '03' },
];

export default function UniverseGateway({ selectedWorld, onWorldChange }) {
  return (
    <main className="v3-gateway">
      <header className="v3-topbar">
        <Link to="/experiments/dax-universe-v3" className="v3-wordmark" aria-label="Dax Collective Universe V3">DAX <span>COLLECTIVE</span></Link>
        <span className="v3-phase-label">PHASE 1A · FOUNDATION</span>
      </header>
      <section className="v3-gateway-intro">
        <p className="v3-kicker">A MULTI-BRAND PROPERTY BY DANIEL ROLLINS</p>
        <h1>One collective.<br /><i>Many worlds.</i></h1>
        <p className="v3-intro-copy">A working technical foundation for the worlds of Dax Collective. Final visual designs are pending; this preview focuses on navigation, data, and interaction structure.</p>
        <div className="v3-foundation-note" role="note">
          <span className="v3-status-dot" />
          <span><strong>V3 FOUNDATION</strong> · VISUAL DESIGN PENDING</span>
        </div>
      </section>
      <section className="v3-worlds" aria-labelledby="v3-worlds-title">
        <div className="v3-section-heading">
          <p className="v3-kicker">THE WORLD INDEX</p>
          <h2 id="v3-worlds-title">Choose a world</h2>
        </div>
        <label className="v3-world-select">WORLD INDEX SELECTION
          <select value={selectedWorld} onChange={event => onWorldChange(event.target.value)} data-testid="v3-world-select">
            <option value="collective">Dax Collective</option>
            <option value="traveler">Dax the Traveler · V3</option>
            <option value="gods-vessel">God’s Vessel · V2</option>
            <option value="ani-dax">Ani-Dax · V2</option>
            <option value="timezone-travelers">Time-Zone Travelers · V2</option>
          </select>
        </label>
        <Link to="/experiments/dax-universe-v3/traveler" className={`v3-world-card v3-world-traveler ${selectedWorld === 'traveler' ? 'is-selected' : ''}`} data-testid="link-v3-traveler">
          <span className="v3-world-number">00 / V3</span>
          <span className="v3-world-card-copy"><strong>Dax the Traveler</strong><small>A first-person chronology, personal photography, and evidence-aware chapter index.</small></span>
          <span className="v3-world-action">OPEN FOUNDATION <b aria-hidden="true">↗</b></span>
        </Link>
        <div className="v3-legacy-list" aria-label="Worlds currently available in V2">
          {v2Worlds.map(world => (
            <Link to={world.route} className={`v3-legacy-row ${selectedWorld === (world.mark === '01' ? 'gods-vessel' : world.mark === '02' ? 'ani-dax' : 'timezone-travelers') ? 'is-selected' : ''}`} key={world.route} data-testid={`link-v2-${world.mark}`}>
              <span className="v3-legacy-number">{world.mark}</span>
              <strong>{world.title}</strong>
              <span className="v3-v2-tag">V2 · WORKING WORLD</span>
              <span className="v3-row-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <footer className="v3-gateway-footer">
        <span>DAX COLLECTIVE / EXPERIMENTAL ROUTE</span>
        <span>V1 AND V2 EXPERIENCES REMAIN UNCHANGED</span>
      </footer>
    </main>
  );
}
