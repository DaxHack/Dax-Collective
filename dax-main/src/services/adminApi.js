// src/services/adminApi.js
//
// Single client for the backend's protected /api/admin/* routes.
//
// - Every request carries the signed-in user's Firebase ID token, read from
//   the same Firebase Auth instance that AuthContext listens to.
// - With no signed-in user the request is NOT sent and a 401-style error is
//   thrown. There is no anonymous fallback and no public-route fallback.
// - The backend is the authority on who is an admin. Nothing here decides
//   authorization from a UID, email or any other client-side value.
// - Errors are mapped to short, fixed messages; backend error text is never
//   passed through to the UI.

import { API_BASE } from '../config/apiConfig';
import { auth } from '../config/firebase';

export const ADMIN_API_BASE = `${API_BASE}/api/admin`;

// Machine-readable reason + the message that is safe to show a user.
const STATUS_REASONS = {
  401: { reason: 'unauthenticated', message: 'Please sign in to continue.' },
  403: { reason: 'forbidden', message: 'This account does not have admin access.' },
  404: { reason: 'not_available', message: 'This admin feature is not enabled on the server.' },
  429: { reason: 'rate_limited', message: 'Too many requests. Please wait a moment and try again.' },
  503: { reason: 'unavailable', message: 'This integration is currently unavailable.' }
};

const NETWORK_FAILURE = { reason: 'network', message: 'Could not reach the server. Please try again.' };
const GENERIC_FAILURE = { reason: 'error', message: 'The request could not be completed.' };

export class AdminApiError extends Error {
  constructor({ reason, message }, status = 0) {
    super(message);
    this.name = 'AdminApiError';
    this.reason = reason;
    this.status = status;
  }
}

/**
 * The message to show a user for any error thrown by this module.
 * Unknown errors get a generic message rather than their own text.
 */
export function describeAdminError(error) {
  return error instanceof AdminApiError ? error.message : GENERIC_FAILURE.message;
}

/**
 * Firebase ID token for the currently signed-in user, or null when signed
 * out or when Firebase Auth is not configured. Firebase refreshes the token
 * itself when it is close to expiry.
 */
export async function getIdToken() {
  const user = auth && auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch (error) {
    return null;
  }
}

/**
 * Call a protected admin route.
 * @param {string} path - Path below /api/admin, starting with "/"
 * @param {Object} options - fetch options. A plain-object `json` is sent as a
 *   JSON body; FormData bodies are passed through untouched.
 * @returns {Promise<Object>} Parsed JSON response body
 * @throws {AdminApiError}
 */
export async function adminFetch(path, options = {}) {
  const token = await getIdToken();
  if (!token) {
    // Signed out: fail here. Never send the request without a token.
    throw new AdminApiError(STATUS_REASONS[401], 401);
  }

  const { json, headers: extraHeaders, ...rest } = options;
  const headers = { ...extraHeaders, Authorization: `Bearer ${token}` };
  const init = { ...rest, headers };

  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(json);
  }

  let response;
  try {
    response = await fetch(`${ADMIN_API_BASE}${path}`, init);
  } catch (error) {
    throw new AdminApiError(NETWORK_FAILURE);
  }

  if (!response.ok) {
    throw new AdminApiError(STATUS_REASONS[response.status] || GENERIC_FAILURE, response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new AdminApiError(GENERIC_FAILURE, response.status);
  }
}

/**
 * Ask the backend whether the signed-in user is an admin
 * (GET /api/admin/access, behind requireAuth + requireAdmin).
 * Never throws: resolves to { authorized, reason }.
 * reason: 'unauthenticated' | 'forbidden' | 'not_available' | 'rate_limited'
 *         | 'unavailable' | 'network' | 'error' | null
 */
export async function checkAdminAccess() {
  try {
    const result = await adminFetch('/access');
    return { authorized: result.authorized === true, reason: result.authorized === true ? null : 'forbidden' };
  } catch (error) {
    return { authorized: false, reason: error instanceof AdminApiError ? error.reason : 'error' };
  }
}

const adminApi = { adminFetch, checkAdminAccess, getIdToken, describeAdminError, AdminApiError, ADMIN_API_BASE };

export default adminApi;
