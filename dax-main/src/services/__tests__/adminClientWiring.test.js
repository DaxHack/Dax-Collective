/* eslint-env jest */
// Contract tests for the frontend <-> backend wiring after the backend
// security migration:
//   - public content sheets stay on GET /api/sheets (no token)
//   - protected sheets go to GET /api/admin/sheets with a Firebase bearer token
//   - upload/Drive callers use /api/admin/*
//   - nothing protected is ever requested without a token or from a public route
//
// Firebase and the network are mocked; no real request is made.

const mockAuth = { currentUser: null };

jest.mock('../../config/firebase', () => ({ auth: mockAuth }));

const PUBLIC_KEYS = ['GODS_VESSEL_QUOTES', 'DAX_TRAVELER_BLOGS', 'TIMEZONE_TRAVELERS_BLOGS_ITINERARIES'];
const PROTECTED_KEYS = [
  'BRAND_ANALYTICS_DASHBOARD',
  'SOCIAL_TRACKING_YOUTUBE',
  'SOCIAL_TRACKING_INSTAGRAM',
  'SOCIAL_TRACKING_TIKTOK',
  'SOCIAL_TRACKING_TWITTER',
  'SOCIAL_TRACKING_FACEBOOK',
  'TSHIRT_DESIGNS_CANVA_BULK',
  'GODS_VESSEL_DISCUSSIONS',
  'SATIATED_TASTE_RECIPES'
];

// One backend origin for every service, as in a configured deployment.
process.env.REACT_APP_API_BASE_URL = 'http://backend.test';

// Sheet IDs are read from the environment when sheetsApi is first loaded.
[...PUBLIC_KEYS, ...PROTECTED_KEYS].forEach((key) => {
  process.env[`REACT_APP_SHEET_${key}`] = `id-${key}`;
});

const sheets = require('../sheetsApi');
const adminApi = require('../adminApi');
const enhancedDrive = require('../enhanced-driveApi').default;
const driveApi = require('../driveApi').default;
const { uploadApiHelper } = require('../uploadApiHelper');

const TOKEN = 'test-id-token';
const fakeUser = { uid: 'user-1', getIdToken: jest.fn() };

const jsonResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: 'status text',
  json: async () => body
});

const signIn = () => {
  mockAuth.currentUser = fakeUser;
};
const signOut = () => {
  mockAuth.currentUser = null;
};

// [url, init] of the n-th fetch call
const call = (n = 0) => global.fetch.mock.calls[n];
const pathOf = (url) => new URL(url).pathname;
const imageFile = () => new File(['x'], 'photo.jpg', { type: 'image/jpeg' });

beforeEach(() => {
  signOut();
  // CRA resets mock implementations between tests, so set it here.
  fakeUser.getIdToken.mockReset();
  fakeUser.getIdToken.mockImplementation(async () => TOKEN);
  global.fetch = jest.fn(async () => jsonResponse(200, { values: [['header'], ['row']] }));
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('public content sheets', () => {
  test.each(PUBLIC_KEYS)('%s is read from GET /api/sheets without a token', async (key) => {
    const rows = await sheets.fetchBrandSheetData(key);

    expect(rows).toEqual([['header'], ['row']]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = call();
    expect(pathOf(url)).toBe('/api/sheets');
    expect(new URL(url).searchParams.get('spreadsheetId')).toBe(`id-${key}`);
    expect(init).toBeUndefined();
  });

  test('stay public even when an admin is signed in', async () => {
    signIn();
    await sheets.fetchBrandSheetData('GODS_VESSEL_QUOTES');

    expect(pathOf(call()[0])).toBe('/api/sheets');
    expect(fakeUser.getIdToken).not.toHaveBeenCalled();
  });

  test('public page fetchers use the public route', async () => {
    await sheets.fetchGodsVesselQuotes();
    await sheets.fetchDaxTravelerBlogs();
    await sheets.fetchTimezoneItineraries();

    expect(global.fetch.mock.calls.map(([url]) => pathOf(url))).toEqual([
      '/api/sheets',
      '/api/sheets',
      '/api/sheets'
    ]);
  });

  test('a failed public read does not surface backend error text', async () => {
    global.fetch = jest.fn(async () => jsonResponse(502, { error: 'internal detail: upstream key rotation' }));

    await expect(sheets.fetchSheetData('some-id')).rejects.toThrow('Sheets request failed (502)');
  });
});

describe('protected sheets', () => {
  test.each(PROTECTED_KEYS)('%s is read from GET /api/admin/sheets with a bearer token', async (key) => {
    signIn();
    const rows = await sheets.fetchBrandSheetData(key);

    expect(rows).toEqual([['header'], ['row']]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = call();
    expect(pathOf(url)).toBe('/api/admin/sheets');
    expect(new URL(url).searchParams.get('spreadsheetId')).toBe(`id-${key}`);
    expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);
  });

  test('every key that is not explicitly public is treated as protected', () => {
    expect(sheets.PUBLIC_SHEET_KEYS.sort()).toEqual([...PUBLIC_KEYS].sort());
    Object.keys(sheets.SHEET_IDS).forEach((key) => {
      expect(sheets.isProtectedSheetKey(key)).toBe(!PUBLIC_KEYS.includes(key));
    });
    expect(sheets.isProtectedSheetKey('SOME_FUTURE_SHEET')).toBe(true);
  });

  test.each(PROTECTED_KEYS)('%s is not requested at all when signed out', async (key) => {
    await expect(sheets.fetchBrandSheetData(key)).rejects.toMatchObject({
      name: 'AdminApiError',
      reason: 'unauthenticated',
      status: 401
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('a 403 is not retried against the public route', async () => {
    signIn();
    global.fetch = jest.fn(async () => jsonResponse(403, { error: 'Forbidden: Admin access required' }));

    await expect(sheets.fetchBrandSheetData('BRAND_ANALYTICS_DASHBOARD')).rejects.toMatchObject({
      reason: 'forbidden',
      status: 403
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(pathOf(call()[0])).toBe('/api/admin/sheets');
  });

  test('admin-facing fetchers use the admin route', async () => {
    signIn();
    await sheets.fetchBrandAnalytics();
    await sheets.fetchSocialTrackingData('youtube');
    await sheets.fetchSatiatedTasteRecipes();

    const paths = global.fetch.mock.calls.map(([url]) => pathOf(url));
    expect(paths).toEqual(['/api/admin/sheets', '/api/admin/sheets', '/api/admin/sheets']);
    global.fetch.mock.calls.forEach(([, init]) => {
      expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);
    });
  });

  test('admin-facing fetchers make no request when signed out', async () => {
    const analytics = await sheets.fetchBrandAnalytics();
    const social = await sheets.fetchSocialTrackingData('instagram');
    const recipes = await sheets.fetchSatiatedTasteRecipes();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(analytics.error).toBe('Please sign in to continue.');
    expect(social).toEqual([]);
    expect(recipes).toEqual([]);
  });
});

describe('adminFetch', () => {
  test('sends the Firebase ID token of the signed-in user', async () => {
    signIn();
    await adminApi.adminFetch('/access');

    expect(fakeUser.getIdToken).toHaveBeenCalledTimes(1);
    const [url, init] = call();
    expect(pathOf(url)).toBe('/api/admin/access');
    expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);
  });

  test('sends nothing when signed out', async () => {
    await expect(adminApi.adminFetch('/access')).rejects.toMatchObject({ reason: 'unauthenticated' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('sends nothing when the token cannot be obtained', async () => {
    mockAuth.currentUser = { getIdToken: jest.fn(async () => { throw new Error('token refresh failed'); }) };

    await expect(adminApi.adminFetch('/access')).rejects.toMatchObject({ reason: 'unauthenticated' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test.each([
    [401, 'unauthenticated', 'Please sign in to continue.'],
    [403, 'forbidden', 'This account does not have admin access.'],
    [404, 'not_available', 'This admin feature is not enabled on the server.'],
    [429, 'rate_limited', 'Too many requests. Please wait a moment and try again.'],
    [503, 'unavailable', 'This integration is currently unavailable.'],
    [500, 'error', 'The request could not be completed.']
  ])('maps HTTP %i to reason "%s" with a fixed message', async (status, reason, message) => {
    signIn();
    global.fetch = jest.fn(async () => jsonResponse(status, {
      error: 'SECRET internal detail',
      details: 'stack trace at /app/routes/adminUploadApi.js'
    }));

    let thrown;
    try {
      await adminApi.adminFetch('/drive-upload', { method: 'POST' });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toMatchObject({ name: 'AdminApiError', reason, status });
    expect(thrown.message).toBe(message);
    expect(adminApi.describeAdminError(thrown)).toBe(message);
    expect(thrown.message).not.toMatch(/SECRET|stack trace/);
  });

  test('reports a network failure without internal detail', async () => {
    signIn();
    global.fetch = jest.fn(async () => { throw new TypeError('connect ECONNREFUSED 10.0.0.5:3001'); });

    await expect(adminApi.adminFetch('/access')).rejects.toMatchObject({
      reason: 'network',
      message: 'Could not reach the server. Please try again.'
    });
  });

  test('describeAdminError hides the text of unknown errors', () => {
    expect(adminApi.describeAdminError(new Error('ECONNRESET at internal-host'))).toBe(
      'The request could not be completed.'
    );
  });
});

describe('checkAdminAccess', () => {
  test('is authorized only when the backend says so', async () => {
    signIn();
    global.fetch = jest.fn(async () => jsonResponse(200, { authorized: true }));

    expect(await adminApi.checkAdminAccess()).toEqual({ authorized: true, reason: null });
    expect(pathOf(call()[0])).toBe('/api/admin/access');
    expect(call()[1].headers.Authorization).toBe(`Bearer ${TOKEN}`);
  });

  test.each([
    [401, 'unauthenticated'],
    [403, 'forbidden'],
    [404, 'not_available'],
    [429, 'rate_limited'],
    [503, 'unavailable']
  ])('HTTP %i resolves to not authorized (%s)', async (status, reason) => {
    signIn();
    global.fetch = jest.fn(async () => jsonResponse(status, { error: 'x' }));

    expect(await adminApi.checkAdminAccess()).toEqual({ authorized: false, reason });
  });

  test('a signed-out user is not authorized and no request is made', async () => {
    expect(await adminApi.checkAdminAccess()).toEqual({ authorized: false, reason: 'unauthenticated' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('a 200 without authorized:true is not treated as authorized', async () => {
    signIn();
    global.fetch = jest.fn(async () => jsonResponse(200, { ok: true }));

    expect((await adminApi.checkAdminAccess()).authorized).toBe(false);
  });
});

describe('upload and Drive callers use /api/admin/*', () => {
  beforeEach(() => {
    signIn();
    global.fetch = jest.fn(async () => jsonResponse(200, {
      images: [],
      uploads: [{ id: 'f1', fileName: 'photo.jpg', directLink: 'https://drive.example/f1' }],
      url: 'https://storage.example/p.jpg'
    }));
  });

  const expectAdminCall = (path, method) => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = call();
    expect(pathOf(url)).toBe(path);
    expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);
    if (method) expect(init.method).toBe(method);
    return init;
  };

  test('enhanced-driveApi.fetchDriveImages', async () => {
    await enhancedDrive.fetchDriveImages('folder-1', { pageSize: 10 });
    expectAdminCall('/api/admin/drive/images/folder-1');
  });

  test('enhanced-driveApi.uploadToDrive', async () => {
    await enhancedDrive.uploadToDrive([imageFile()], 'travel', { tags: ['a'] });
    const init = expectAdminCall('/api/admin/drive-upload', 'POST');
    expect(init.body.getAll('files')).toHaveLength(1);
    expect(init.body.get('tags')).toBe('["a"]');
  });

  test('enhanced-driveApi.uploadToFirebase', async () => {
    await enhancedDrive.uploadToFirebase(imageFile());
    const init = expectAdminCall('/api/admin/firebase-profile', 'POST');
    expect(init.body.get('file')).toBeTruthy();
  });

  test('enhanced-driveApi.checkDuplicates', async () => {
    await enhancedDrive.checkDuplicates([imageFile()], 'folder-1');
    expectAdminCall('/api/admin/check-duplicates', 'POST');
  });

  test('enhanced-driveApi.getFolderInfo', async () => {
    await enhancedDrive.getFolderInfo('folder-1');
    expectAdminCall('/api/admin/drive/folder/folder-1');
  });

  test('enhanced-driveApi.batchUploadFromUrls', async () => {
    await enhancedDrive.batchUploadFromUrls(['https://example.com/a.jpg'], 'travel');
    const init = expectAdminCall('/api/admin/drive/batch-from-urls', 'POST');
    expect(JSON.parse(init.body)).toMatchObject({ urls: ['https://example.com/a.jpg'], category: 'travel' });
    expect(init.headers['Content-Type']).toBe('application/json');
  });

  test('enhanced-driveApi.checkAdminAccess asks the backend', async () => {
    global.fetch = jest.fn(async () => jsonResponse(200, { authorized: true }));
    expect(await enhancedDrive.checkAdminAccess()).toEqual({ authorized: true, reason: null });
    expect(pathOf(call()[0])).toBe('/api/admin/access');
  });

  test('driveApi.fetchDriveImages', async () => {
    await driveApi.fetchDriveImages('folder-1', fakeUser);
    expectAdminCall('/api/admin/drive/images/folder-1');
  });

  test('driveApi.uploadToDrive', async () => {
    await driveApi.uploadToDrive([imageFile()], 'collective', fakeUser);
    expectAdminCall('/api/admin/drive-upload', 'POST');
  });

  test('driveApi.uploadToFirebase', async () => {
    await driveApi.uploadToFirebase(imageFile(), fakeUser);
    expectAdminCall('/api/admin/firebase-profile', 'POST');
  });

  test('driveApi.getFolderInfo', async () => {
    await driveApi.getFolderInfo('folder-1', fakeUser);
    expectAdminCall('/api/admin/drive/folder/folder-1');
  });

  test('uploadApiHelper.uploadProfilePicture', async () => {
    const result = await uploadApiHelper.uploadProfilePicture(imageFile(), fakeUser);
    const init = expectAdminCall('/api/admin/firebase-profile', 'POST');
    expect(init.body.get('file')).toBeTruthy();
    expect(result.downloadURL).toBe('https://storage.example/p.jpg');
  });

  test('uploadApiHelper.uploadToDrive', async () => {
    const result = await uploadApiHelper.uploadToDrive([imageFile()], 'travel', fakeUser, { tags: 'beach, cuba' });
    const init = expectAdminCall('/api/admin/drive-upload', 'POST');
    expect(init.body.get('tags')).toBe('["beach","cuba"]');
    expect(result.uploads).toHaveLength(1);
  });

  test('uploadApiHelper.uploadFromUrl', async () => {
    const result = await uploadApiHelper.uploadFromUrl('https://example.com/a.jpg', 'beach', fakeUser, {
      category: 'travel'
    });
    const init = expectAdminCall('/api/admin/drive/batch-from-urls', 'POST');
    expect(JSON.parse(init.body)).toMatchObject({ urls: ['https://example.com/a.jpg'], category: 'travel' });
    expect(result.fileId).toBe('f1');
  });

  test('operations the backend does not provide make no request', async () => {
    await expect(uploadApiHelper.checkUploadStatus('u1', fakeUser)).rejects.toMatchObject({ reason: 'not_available' });
    await expect(uploadApiHelper.deleteUploadedFile('f1', fakeUser)).rejects.toMatchObject({ reason: 'not_available' });
    await expect(uploadApiHelper.getUploadHistory(fakeUser)).rejects.toMatchObject({ reason: 'not_available' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('no upload caller sends a request when signed out', async () => {
    signOut();
    const attempts = [
      () => enhancedDrive.fetchDriveImages('folder-1'),
      () => enhancedDrive.uploadToDrive([imageFile()]),
      () => enhancedDrive.uploadToFirebase(imageFile()),
      () => enhancedDrive.checkDuplicates([imageFile()]),
      () => enhancedDrive.getFolderInfo('folder-1'),
      () => enhancedDrive.batchUploadFromUrls(['https://example.com/a.jpg']),
      () => driveApi.uploadToDrive([imageFile()], 'collective', fakeUser),
      () => driveApi.uploadToFirebase(imageFile(), fakeUser),
      () => driveApi.getFolderInfo('folder-1', fakeUser),
      () => uploadApiHelper.uploadProfilePicture(imageFile(), fakeUser),
      () => uploadApiHelper.uploadToDrive([imageFile()], 'travel', fakeUser),
      () => uploadApiHelper.uploadFromUrl('https://example.com/a.jpg', 'beach', fakeUser)
    ];

    for (const attempt of attempts) {
      await expect(attempt()).rejects.toMatchObject({ reason: 'unauthenticated' });
    }
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('no caller still points at a pre-migration backend path', () => {
  const fs = require('fs');
  const path = require('path');
  const SRC = path.join(__dirname, '..', '..');
  const FILES = [
    'services/driveApi.js',
    'services/enhanced-driveApi.js',
    'services/uploadApiHelper.js',
    'services/sheetsApi.js',
    'components/ProfilePictureUploader.jsx',
    'config/apiConfig.js'
  ];
  const OLD_PATHS = /\/api\/(drive|firebase|profile-picture|drive-image|batch-upload|upload-status|upload-from-url|upload-history|check-duplicates|upload\/|file\/)/;

  test.each(FILES)('%s', (file) => {
    const source = fs.readFileSync(path.join(SRC, file), 'utf8');
    const offending = source
      .split('\n')
      .filter((line) => OLD_PATHS.test(line.replace(/\/api\/admin\/[^\s'"`]*/g, '')));
    expect(offending).toEqual([]);
  });
});
