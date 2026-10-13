import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DaxUniverseV3App from './DaxUniverseV3App';
import { canRenderFinalScene, sceneApprovals, worlds, V3_BASE } from './records';

beforeAll(() => { window.scrollTo = jest.fn(); });

function show(path) {
  return render(<HelmetProvider><MemoryRouter initialEntries={[`${V3_BASE}${path === '/' ? '' : path}`]}>
    <Routes><Route path={`${V3_BASE}/*`} element={<DaxUniverseV3App />} /></Routes>
  </MemoryRouter></HelmetProvider>);
}

test('all seven final scenes fail closed while approvals are pending', () => {
  expect(sceneApprovals).toHaveLength(7);
  sceneApprovals.forEach(record => expect(canRenderFinalScene(record)).toBe(false));
  expect(canRenderFinalScene(null)).toBe(false);
  expect(canRenderFinalScene({ desktop: 'frame', mobile: 'frame', states: 'strip',
    mediaReview: 'approved', approvedBy: 'reviewer', approvedAt: '2026-10-11' })).toBe(true);
});

test.each(worlds)('direct $path route renders its engineering surface', async world => {
  show(`/${world.path}`);
  expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(world.path === 'traveler' ? 'A life,' : world.name);
  expect(screen.getAllByText(/Final scene withheld/)).toHaveLength(world.scenes.length);
  expect(screen.getByRole('link', { name: 'Canonical V1' })).toHaveAttribute('href', '/');
});

test('gateway navigation and missing-world recovery stay within V3', () => {
  show('/');
  fireEvent.click(screen.getByRole('link', { name: 'God’s Vessel' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('God’s Vessel');
  expect(screen.getByRole('link', { name: 'Dax Traveler' })).toHaveAttribute('href', `${V3_BASE}/traveler`);
});

test('unknown world has a real return link', () => {
  show('/missing');
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('not built yet');
  expect(screen.getByRole('link', { name: 'Return to the V3 gateway' })).toHaveAttribute('href', V3_BASE);
});
