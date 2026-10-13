// src/config/publicApi.js
//
// Where the public (unauthenticated) backend lives, and whether the site may
// use it.
//
// The backend URL comes from REACT_APP_API_BASE_URL at build time. A
// production build that was not given one must never fall back to a
// developer's localhost: visitors would be sending their email address to a
// machine that does not exist. In that case the public API is reported as
// "not configured" and every feature that needs it shows a deliberate
// unavailable state instead of attempting the request.

const LOCAL_HOST_PATTERN = /^https?:\/\/(localhost|127(\.\d{1,3}){3}|0\.0\.0\.0|\[::1\])(:\d+)?(\/|$)/i;

const DEV_DEFAULT = 'http://localhost:3001';

/**
 * Pure resolver, exported for tests.
 * @param {string|undefined} configuredUrl - REACT_APP_API_BASE_URL
 * @param {string|undefined} nodeEnv - NODE_ENV of the build
 * @returns {{ baseUrl: string, configured: boolean }}
 */
export function resolvePublicApi(configuredUrl, nodeEnv) {
  const url = String(configuredUrl || '').trim().replace(/\/+$/, '');
  const isProduction = nodeEnv === 'production';

  if (!isProduction) {
    // Local development and tests: default to the local backend.
    return { baseUrl: url || DEV_DEFAULT, configured: true };
  }

  if (!url || LOCAL_HOST_PATTERN.test(url) || !/^https?:\/\//i.test(url)) {
    return { baseUrl: '', configured: false };
  }

  return { baseUrl: url, configured: true };
}

const resolved = resolvePublicApi(process.env.REACT_APP_API_BASE_URL, process.env.NODE_ENV);

/** Base URL of the public backend, or '' when none is configured. */
export const PUBLIC_API_BASE = resolved.baseUrl;

/** False in a production build that has no real backend URL. */
export const isPublicApiConfigured = resolved.configured;
