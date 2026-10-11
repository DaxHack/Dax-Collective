import React, { useCallback, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { travelHistory, travelYears, personalPhotos } from '../../../data/daxTravelHistory';
import UniverseGateway from './UniverseGateway';
import TravelerFoundation from './TravelerFoundation';
import { V3_BASE, worlds } from './records';
import WorldFoundation from './WorldFoundation';
import SceneGate from './shared/SceneGate';
import './UniverseV3.css';
import './foundation.css';

const ROOT_PATH = '/experiments/dax-universe-v3';
const WORLDS = ['collective', 'traveler', 'gods-vessel', 'ani-dax', 'timezone-travelers'];
const chapterIds = new Set(travelHistory.map(chapter => chapter.id));
const photoCount = personalPhotos.length;
const scenes = ['worlds', 'atlas', 'gallery', 'chapter', 'photo'];

function validState(params, isTraveler) {
  const world = params.get('world');
  const year = Number(params.get('year'));
  const chapter = params.get('chapter');
  const photo = /^\d+$/.test(params.get('photo') || '') ? Number(params.get('photo')) : NaN;
  const frame = /^\d+$/.test(params.get('frame') || '') ? Number(params.get('frame')) : NaN;
  const selectedChapter = travelHistory.find(item => item.id === chapter);
  const result = {};
  if (world && WORLDS.includes(world) && (!isTraveler || world === 'traveler')) result.world = world;
  if (isTraveler) result.year = selectedChapter?.year || (travelYears.includes(year) ? year : travelYears[0]);
  if (isTraveler && chapterIds.has(chapter)) result.chapter = chapter;
  if (isTraveler && params.has('photo') && Number.isInteger(photo) && photo >= 0 && photo < photoCount) result.photo = photo;
  if (isTraveler && params.has('frame') && Number.isInteger(frame) && frame >= 0 && frame < photoCount) result.frame = frame;
  const scene = params.get('scene');
  if (scene && scenes.includes(scene) && (!isTraveler || scene !== 'worlds')) result.scene = scene;
  if (isTraveler) {
    result.scene = result.photo !== undefined ? 'photo'
      : result.chapter ? 'chapter'
        : scene === 'gallery' ? 'gallery'
          : 'atlas';
  }
  return result;
}

export default function DaxUniverseV3App() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isTraveler = /^\/experiments\/dax-universe-v3\/traveler\/?$/.test(location.pathname);
  const isGateway = location.pathname === ROOT_PATH || location.pathname === `${ROOT_PATH}/`;
  const foundationWorld = worlds.find(world => world.path !== 'traveler' &&
    location.pathname.replace(/\/$/, '') === `${ROOT_PATH}/${world.path}`);
  const state = useMemo(() => validState(searchParams, isTraveler), [searchParams, isTraveler]);
  const unknownRoute = !isTraveler && !isGateway && !foundationWorld;
  const pageTitle = isTraveler ? 'Traveler Foundation — Dax Collective V3' : foundationWorld ? `${foundationWorld.name} Foundation — Dax Collective V3` : unknownRoute ? 'V3 Route Not Built — Dax Collective' : 'Dax Collective Universe V3';
  const pageDescription = isTraveler
    ? 'Explore the Phase 1A Traveler foundation: Daniel’s source-backed travel chronology and personal camera roll.'
    : unknownRoute
      ? 'This Dax Collective Universe V3 route is not built yet. The gateway and Traveler technical foundation are available.'
      : 'A Phase 1A technical foundation for the worlds of Dax Collective. Final visual designs are pending.';

  const updateState = useCallback((patch, options = {}) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      return next;
    }, { replace: options.replace === true });
  }, [setSearchParams]);

  // Normalize direct links and history entries without adding a second history entry.
  useEffect(() => {
    const canonical = new URLSearchParams();
    if (isTraveler) {
      canonical.set('world', 'traveler');
      canonical.set('year', String(state.year || travelYears[0]));
      canonical.set('scene', state.scene || 'atlas');
      if (state.chapter) canonical.set('chapter', state.chapter);
      if (state.photo !== undefined) canonical.set('photo', String(state.photo));
      if (state.frame !== undefined) canonical.set('frame', String(state.frame));
    } else if (isGateway) {
      canonical.set('world', state.world || 'collective');
      canonical.set('scene', 'worlds');
    }
    const current = new URLSearchParams(location.search);
    if (current.toString() !== canonical.toString()) {
      setSearchParams(canonical, { replace: true });
    }
  }, [location.pathname, location.search, isTraveler, isGateway, state, setSearchParams]);

  const setYear = useCallback(year => updateState({ year, chapter: null, photo: null, frame: null, scene: 'atlas' }), [updateState]);
  const setChapter = useCallback(chapter => updateState({
    chapter: chapter?.id || null,
    year: chapter?.year ?? state.year,
    photo: null,
    frame: null,
    scene: chapter ? 'chapter' : 'atlas',
  }), [state.year, updateState]);
  const setPhoto = useCallback(photo => updateState({
    photo,
    frame: photo === null ? state.photo : photo,
    scene: photo === null ? (state.chapter ? 'chapter' : 'gallery') : 'photo',
  }), [state.chapter, state.photo, updateState]);
  const setFrame = useCallback(frame => updateState({ frame, scene: 'gallery' }), [updateState]);
  const setWorld = useCallback(world => updateState({ world, scene: 'worlds' }), [updateState]);

  return (
    <MotionConfig reducedMotion="user">
    <div
      className="universe-v3"
      data-testid="v3-app-shell"
      data-world={isTraveler ? 'traveler' : foundationWorld?.path || state.world || 'collective'}
      data-scene={state.scene || 'worlds'}
      aria-hidden={isTraveler && (state.chapter || state.photo !== undefined) ? 'true' : undefined}
      inert={isTraveler && (state.chapter || state.photo !== undefined) ? '' : undefined}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="dax-v3-foundation">
        <nav aria-label="V3 worlds">
          <NavLink to={V3_BASE} end>Collective</NavLink>
          {worlds.map(world => <NavLink key={world.path} to={`${V3_BASE}/${world.path}`}>{world.name}</NavLink>)}
        </nav>
      </header>
      {isTraveler ? (
        <TravelerFoundation
          state={state}
          onYearChange={setYear}
          onChapterChange={setChapter}
          onPhotoChange={setPhoto}
          onFrameChange={setFrame}
        />
      ) : isGateway ? (
        <UniverseGateway selectedWorld={state.world || 'collective'} onWorldChange={setWorld} />
      ) : foundationWorld ? (
        <main className="dax-v3-foundation"><WorldFoundation world={foundationWorld} /></main>
      ) : (
        <main className="v3-not-found">
          <p className="v3-kicker">DAX COLLECTIVE · UNIVERSE V3</p>
          <h1>This V3 route is not built yet.</h1>
          <p>Only the collective gateway and Traveler foundation are available in Phase 1A.</p>
          <a href={ROOT_PATH}>Return to the V3 gateway</a>
        </main>
      )}
      {(isGateway || isTraveler) && <section className="dax-v3-foundation" aria-label="Final scene approvals">
        {(isTraveler ? ['traveler-hero', 'traveler-journey'] : ['collective-selector']).map(id => <SceneGate key={id} id={id} />)}
      </section>}
      <footer className="dax-v3-foundation" aria-label="Earlier versions">
        <Link to="/">Canonical V1</Link>
        <Link to="/experiments/dax-the-traveler-v2">Earlier Traveler preview</Link>
        <Link to="/experiments/dax-universe">Universe V2</Link>
      </footer>
    </div>
    </MotionConfig>
  );
}
