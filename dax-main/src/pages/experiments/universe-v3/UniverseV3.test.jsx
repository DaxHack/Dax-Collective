import React from 'react';
import { TextEncoder, TextDecoder } from 'util';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HelmetProvider } from 'react-helmet-async';
import { personalPhotos, travelHistory } from '../../../data/daxTravelHistory';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// CRA's Jest 27 resolver does not understand Router 7's package exports.
// Load the real Router implementation, not a behavioral mock.
jest.mock('react-router-dom', () => require('../../../../node_modules/react-router/dist/development/index.js'), { virtual: true });
const { MemoryRouter, Routes, Route, useLocation, useNavigate } = require('react-router-dom');
const DaxUniverseV3App = require('./DaxUniverseV3App').default;
const BASE = '/experiments/dax-universe-v3';
let navigate;

function LocationProbe() {
  const location = useLocation();
  navigate = useNavigate();
  return <output data-testid="test-location">{location.pathname}{location.search}</output>;
}

function mount(path = BASE) {
  return render(
    <React.StrictMode>
      <HelmetProvider>
        <MemoryRouter initialEntries={[path]}>
          <LocationProbe />
          <Routes>
            <Route path={`${BASE}/*`} element={<DaxUniverseV3App />} />
            <Route path="*" element={<h1>Existing route</h1>} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    </React.StrictMode>,
  );
}

const params = () => new URLSearchParams(screen.getByTestId('test-location').textContent.split('?')[1]);
const changeRoute = path => act(() => navigate(path));
const closeChapter = () => fireEvent.click(screen.getByRole('button', { name: 'Close chapter', exact: true }));
const closePhoto = () => fireEvent.click(screen.getByRole('button', { name: 'Close photograph', exact: true }));

afterEach(() => { document.body.style.overflow = ''; });

test('Gateway links truthfully to V2 and world selection survives Back/Forward', async () => {
  mount();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  ['gods-vessel', 'ani-dax', 'timezone-travelers'].forEach((world, index) => {
    expect(screen.getByTestId(`link-v2-0${index + 1}`)).toHaveAttribute('href', `/experiments/dax-universe/${world}`);
  });
  fireEvent.change(screen.getByTestId('v3-world-select'), { target: { value: 'ani-dax' } });
  expect(params().get('world')).toBe('ani-dax');
  fireEvent.click(screen.getByTestId('link-v3-traveler'));
  expect(screen.getByTestId('v3-traveler-foundation')).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  changeRoute(-1);
  await waitFor(() => expect(screen.getByTestId('v3-world-select')).toHaveValue('ani-dax'));
  changeRoute(1);
  await waitFor(() => expect(screen.getByTestId('v3-year-2019')).toHaveAttribute('aria-pressed', 'true'));
});

test('direct Traveler links show every source map anchor without opening a photo by default', () => {
  mount(`${BASE}/traveler/`);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  travelHistory.forEach(chapter => expect(screen.getByTestId(`v3-map-point-${chapter.id}`)).toBeInTheDocument());
  personalPhotos.forEach((photo, index) => {
    expect(screen.getByTestId(`v3-gallery-photo-${index}`).querySelector('img')).toHaveAttribute('src', photo.src);
  });
  expect(params().get('world')).toBe('traveler');
  expect(params().get('scene')).toBe('atlas');
});

test('year, keyboard map selection and chapter state round trip through history', async () => {
  mount(`${BASE}/traveler`);
  fireEvent.click(screen.getByTestId('v3-year-2025'));
  const point = screen.getByTestId('v3-map-point-cuba-2023');
  point.focus();
  fireEvent.keyDown(point, { key: 'Enter' });
  expect(screen.getByRole('dialog')).toHaveTextContent('Cuba');
  expect(params().get('year')).toBe('2023');
  expect(params().get('chapter')).toBe('cuba-2023');
  expect(document.body.style.overflow).toBe('hidden');
  changeRoute(-1);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(params().get('year')).toBe('2025');
  changeRoute(1);
  await waitFor(() => expect(screen.getByRole('dialog')).toHaveTextContent('Cuba'));
  closeChapter();
  expect(params().get('year')).toBe('2023');
  expect(params().get('chapter')).toBeNull();
  expect(screen.getByTestId('v3-app-shell')).not.toHaveAttribute('inert');
  expect(document.body.style.overflow).toBe('');
});

test('nested photo dialog restores thumbnail focus, then original chapter opener', async () => {
  mount(`${BASE}/traveler?year=2023`);
  const opener = screen.getByTestId('v3-chapter-row-cuba-2023');
  opener.focus();
  fireEvent.click(opener);
  const thumbnail = screen.getByTestId('v3-linked-photo-cuba-2023-0');
  thumbnail.focus();
  fireEvent.click(thumbnail);
  expect(screen.getByTestId('v3-chapter-overlay')).toHaveAttribute('inert');
  expect(screen.getByTestId('v3-app-shell')).toHaveAttribute('inert');
  fireEvent.click(screen.getByTestId('v3-photo-next'));
  expect(params().get('photo')).toBe('1');
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(params().get('photo')).toBe('0');
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByTestId('v3-photo-viewer')).not.toBeInTheDocument();
  expect(screen.getByRole('dialog')).toHaveTextContent('Cuba');
  expect(document.body.style.overflow).toBe('hidden');
  await waitFor(() => expect(document.activeElement).toBe(thumbnail));
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
  await waitFor(() => expect(document.activeElement).toBe(opener));
});

test('gallery selection, photo steps and close retain the selected frame', async () => {
  mount(`${BASE}/traveler?scene=gallery&frame=2`);
  expect(screen.getByTestId('v3-gallery-photo-2')).toHaveClass('is-current');
  fireEvent.click(screen.getByTestId('v3-gallery-next'));
  expect(params().get('frame')).toBe('3');
  fireEvent.click(screen.getByTestId('v3-gallery-photo-3'));
  expect(screen.getByRole('dialog')).toHaveTextContent('LOCATION NOT VERIFIED');
  fireEvent.click(screen.getByTestId('v3-photo-next'));
  expect(params().get('photo')).toBe('4');
  closePhoto();
  expect(params().get('photo')).toBeNull();
  expect(params().get('frame')).toBe('4');
  expect(params().get('scene')).toBe('gallery');
  expect(screen.getByTestId('v3-gallery-photo-4')).toHaveClass('is-current');
  expect(document.body.style.overflow).toBe('');
});

test('related chapters use the same source records and retain their year on close', () => {
  mount(`${BASE}/traveler?chapter=kenya-2026`);
  const chapter = travelHistory.find(item => item.id === 'kenya-2026');
  expect(screen.getByRole('dialog')).toHaveTextContent(chapter.destination);
  expect(screen.getByRole('dialog')).toHaveTextContent('APPROXIMATE');
  const related = screen.getByRole('button', { name: /related chapter/i });
  fireEvent.click(related);
  expect(params().get('chapter')).toBe(chapter.relatedJourney);
  expect(screen.getByRole('dialog')).toHaveTextContent('London');
  closeChapter();
  expect(params().get('year')).toBe('2026');
  expect(document.body.style.overflow).toBe('');
});

test('malformed direct state is sanitized; unknown routes are honest', async () => {
  mount(`${BASE}/traveler?year=9999&chapter=not-real&photo=&frame=-1&world=ani-dax`);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(params().get('year')).toBe('2019');
  expect(params().get('photo')).toBeNull();
  expect(params().get('chapter')).toBeNull();
  expect(params().get('frame')).toBeNull();
  changeRoute(`${BASE}/not-built`);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('not built yet');
  expect(screen.getByRole('link', { name: /Return to the V3 gateway/ })).toHaveAttribute('href', BASE);
  await waitFor(() => expect(document.title).toBe('V3 Route Not Built — Dax Collective'));
});

test('leaving the route with two dialogs open restores original body overflow', () => {
  document.body.style.overflow = 'scroll';
  mount(`${BASE}/traveler?chapter=cuba-2023&photo=0`);
  expect(document.body.style.overflow).toBe('hidden');
  changeRoute('/experiments/dax-universe/traveler');
  expect(screen.getByRole('heading')).toHaveTextContent('Existing route');
  expect(screen.queryByTestId('v3-photo-viewer')).not.toBeInTheDocument();
  expect(screen.queryByTestId('v3-chapter-overlay')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('scroll');
});

test('dialog traps keyboard focus at both ends', async () => {
  mount(`${BASE}/traveler?photo=0`);
  const close = screen.getByRole('button', { name: 'Close photograph', exact: true });
  const next = screen.getByRole('button', { name: 'Next photograph', exact: true });
  await waitFor(() => expect(document.activeElement).toBe(close));
  fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(next);
  fireEvent.keyDown(window, { key: 'Tab' });
  expect(document.activeElement).toBe(close);
});
