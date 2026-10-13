/* eslint-env jest */
// Public-site trust checks for the production release:
//   - a production build with no backend URL never talks to localhost
//   - the waitlist reports success only when the backend confirms it, and is
//     cleanly unavailable when no backend is configured
//   - public sheet reads make no request when no backend is configured

import { resolvePublicApi } from '../../config/publicApi';

const jsonResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body
});

beforeEach(() => {
  global.fetch = jest.fn(async () => jsonResponse(200, { success: true, message: 'Subscribed successfully.' }));
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.resetModules();
});

// Loads a module with config/publicApi replaced, as in a given build.
const loadWith = (publicApi, modulePath) => {
  let loaded;
  jest.isolateModules(() => {
    jest.doMock('../../config/publicApi', () => publicApi);
    jest.doMock('../../config/firebase', () => ({ auth: { currentUser: null } }));
    loaded = require(modulePath);
  });
  return loaded;
};

const CONFIGURED = { PUBLIC_API_BASE: 'https://api.example.test', isPublicApiConfigured: true };
const NOT_CONFIGURED = { PUBLIC_API_BASE: '', isPublicApiConfigured: false };

describe('resolvePublicApi', () => {
  test.each([
    [undefined],
    [''],
    ['   '],
    ['http://localhost:3001'],
    ['http://localhost'],
    ['https://localhost:8443/'],
    ['http://127.0.0.1:3001'],
    ['http://0.0.0.0:3001'],
    ['http://[::1]:3001'],
    ['api.example.com'],
    ['ftp://api.example.com']
  ])('production build with %p is not configured', (value) => {
    expect(resolvePublicApi(value, 'production')).toEqual({ baseUrl: '', configured: false });
  });

  test('production build with a real URL is configured', () => {
    expect(resolvePublicApi('https://api.example.com/', 'production')).toEqual({
      baseUrl: 'https://api.example.com',
      configured: true
    });
  });

  test('development and test builds default to the local backend', () => {
    expect(resolvePublicApi(undefined, 'development')).toEqual({ baseUrl: 'http://localhost:3001', configured: true });
    expect(resolvePublicApi('', 'test')).toEqual({ baseUrl: 'http://localhost:3001', configured: true });
    expect(resolvePublicApi('http://localhost:4000', 'development').baseUrl).toBe('http://localhost:4000');
  });
});

describe('waitlist with a configured backend', () => {
  const load = () => loadWith(CONFIGURED, '../waitlistApi');

  test('posts to /api/waitlist and resolves when the backend confirms', async () => {
    const waitlist = load();
    const result = await waitlist.joinWaitlist('  person@example.com ', 'gods-vessel-hero');

    expect(result).toEqual({ alreadySubscribed: false });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = global.fetch.mock.calls[0];
    expect(url).toBe('https://api.example.test/api/waitlist');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ email: 'person@example.com', source: 'gods-vessel-hero' });
  });

  test('reports an existing sign-up', async () => {
    global.fetch = jest.fn(async () => jsonResponse(200, { success: true, message: 'Already subscribed.' }));
    expect(await load().joinWaitlist('person@example.com', 'gods-vessel-cta')).toEqual({ alreadySubscribed: true });
  });

  test.each([
    ['a 200 without success:true', jsonResponse(200, { ok: true }), 'failed'],
    ['a 200 with success:false', jsonResponse(200, { success: false }), 'failed'],
    ['HTTP 400', jsonResponse(400, { error: 'A valid email address is required.' }), 'invalid'],
    ['HTTP 429', jsonResponse(429, { error: 'Too many requests' }), 'rate_limited'],
    ['HTTP 500', jsonResponse(500, { error: 'ENOENT: /app/data/waitlist.csv' }), 'failed'],
    ['HTTP 503', jsonResponse(503, { error: 'unavailable' }), 'failed']
  ])('does not report success for %s', async (label, response, reason) => {
    global.fetch = jest.fn(async () => response);

    let thrown;
    try {
      await load().joinWaitlist('person@example.com', 'gods-vessel-hero');
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeDefined();
    expect(thrown.name).toBe('WaitlistError');
    expect(thrown.reason).toBe(reason);
    expect(thrown.message).not.toMatch(/ENOENT|\/app\/|Too many requests$/);
  });

  test('does not report success when the response is not JSON', async () => {
    global.fetch = jest.fn(async () => ({ ok: true, status: 200, json: async () => { throw new Error('bad json'); } }));
    await expect(load().joinWaitlist('person@example.com', 'x')).rejects.toMatchObject({ reason: 'failed' });
  });

  test('does not report success on a network failure, and hides the detail', async () => {
    global.fetch = jest.fn(async () => { throw new TypeError('connect ECONNREFUSED 10.0.0.5:3001'); });
    await expect(load().joinWaitlist('person@example.com', 'x')).rejects.toMatchObject({
      reason: 'failed',
      message: 'We couldn’t save your sign-up. Please try again.'
    });
  });

  test.each(['', 'not-an-email', 'a@b', 'two words@example.com'])('rejects %p without a request', async (email) => {
    await expect(load().joinWaitlist(email, 'x')).rejects.toMatchObject({ reason: 'invalid' });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('waitlist with no backend configured (production build without a URL)', () => {
  test('is unavailable and makes no request', async () => {
    const waitlist = loadWith(NOT_CONFIGURED, '../waitlistApi');

    expect(waitlist.isWaitlistAvailable).toBe(false);
    await expect(waitlist.joinWaitlist('person@example.com', 'gods-vessel-hero')).rejects.toMatchObject({
      name: 'WaitlistError',
      reason: 'unavailable',
      message: waitlist.WAITLIST_UNAVAILABLE_MESSAGE
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('public sheets with no backend configured', () => {
  test('make no request and the page fetchers fall back to empty', async () => {
    process.env.REACT_APP_SHEET_GODS_VESSEL_QUOTES = 'id-quotes';
    const sheets = loadWith(NOT_CONFIGURED, '../sheetsApi');

    await expect(sheets.fetchSheetData('id-quotes')).rejects.toThrow('Content service is not configured');
    expect(await sheets.fetchGodsVesselQuotes()).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('no public page hardcodes a localhost backend', () => {
  const fs = require('fs');
  const path = require('path');
  const SRC = path.join(__dirname, '..', '..');

  test.each([
    'pages/GodsVesselPage.jsx',
    'pages/GodsVesselMerchPage.jsx',
    'pages/ContactPage.jsx',
    'services/sheetsApi.js',
    'services/waitlistApi.js'
  ])('%s', (file) => {
    expect(fs.readFileSync(path.join(SRC, file), 'utf8')).not.toMatch(/localhost|127\.0\.0\.1/);
  });
});
