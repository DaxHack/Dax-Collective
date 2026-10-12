import React, { useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PROOF_PORTALS } from './PortalHub';
import { mark, prefersReducedMotion } from './motionEnv';

// Destination of the portal transition. The hero's first frame matches the
// overlay's last frame (same tone, same push scale) so there is no visible jump.
export default function ProofWorld() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const h1 = useRef(null);
  const world = PROOF_PORTALS.find(p => p.id === id);
  const push = location.state?.push || 1;
  const fromPortal = Boolean(location.state?.from);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    h1.current?.focus({ preventScroll: true });
    mark('world-mounted', { focused: document.activeElement === h1.current, id });
  }, [id]);

  if (!world) return <main className="mp-world"><h1 ref={h1} tabIndex={-1}>Unknown placeholder world</h1></main>;
  return (
    <main className={`mp-world ${prefersReducedMotion() ? 'is-reduced' : ''}`} style={{ '--tone': world.tone }}>
      <div className="mp-world-hero" aria-hidden="true">
        <div className="mp-world-media" style={{ transform: `scale(${push})` }} />
      </div>
      <div className="mp-world-copy">
        <p className="mp-kicker">PLACEHOLDER WORLD</p>
        <h1 ref={h1} tabIndex={-1} data-testid="world-h1">{world.name}</h1>
        <p>{world.line}</p>
        {fromPortal
          ? <button type="button" className="mp-btn" onClick={() => navigate(-1)}>Back to worlds</button>
          : <Link className="mp-btn" to="../..">Back to worlds</Link>}
      </div>
    </main>
  );
}
