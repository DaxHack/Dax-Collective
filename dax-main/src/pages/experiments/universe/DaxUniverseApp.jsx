import React, { Suspense, lazy } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import UniverseShell from './shared/UniverseShell';

const UniverseHomePage = lazy(() => import('./UniverseHomePage'));
const TravelerWorldPage = lazy(() => import('./TravelerWorldPage'));
const VesselWorldPage = lazy(() => import('./VesselWorldPage'));
const AniWorldPage = lazy(() => import('./AniWorldPage'));
const TimeWorldPage = lazy(() => import('./TimeWorldPage'));

export default function DaxUniverseApp() {
  return (
    <UniverseShell>
      <Suspense fallback={<div className="universe-loading" role="status">Entering the world…</div>}>
        <Routes>
          <Route index element={<UniverseHomePage />} />
          <Route path="traveler" element={<TravelerWorldPage />} />
          <Route path="gods-vessel" element={<VesselWorldPage />} />
          <Route path="ani-dax" element={<AniWorldPage />} />
          <Route path="timezone-travelers" element={<TimeWorldPage />} />
          <Route path="*" element={
            <section className="universe-loading">
              <h1>This world is not here.</h1>
              <Link to="/experiments/dax-universe">Return to Dax Collective</Link>
            </section>
          } />
        </Routes>
      </Suspense>
    </UniverseShell>
  );
}