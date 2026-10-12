import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import PortalHub from './PortalHub';
import ProofWorld from './ProofWorld';
import './motionTokens.css';
import './motionProof.css';

// GSAP + ScrollTrigger only load on the Journey route, never on the portal hub.
const JourneyProof = React.lazy(() => import('./JourneyProof'));

// Isolated V3 motion proof (not Phase 1B, not final visuals). Placeholder content only.
export default function MotionProofApp() {
  return (
    <div className="motion-proof">
      <Helmet>
        <title>V3 Motion Proof — Dax Collective</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Routes>
        <Route index element={<PortalHub />} />
        <Route path="world/:id" element={<ProofWorld />} />
        <Route path="journey" element={<React.Suspense fallback={<p role="status">Loading journey proof…</p>}><JourneyProof /></React.Suspense>} />
      </Routes>
    </div>
  );
}
