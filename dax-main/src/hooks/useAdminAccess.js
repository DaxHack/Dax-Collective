// src/hooks/useAdminAccess.js
//
// Asks the backend whether the signed-in user may use the admin routes
// (GET /api/admin/access, behind requireAuth + requireAdmin).
//
// The backend's answer is the only source of truth. This hook never derives
// authorization from a UID, an email, or any other client-side value; it is
// for deciding what to show, not for protecting anything — the routes stay
// protected on the server regardless of what the UI renders.

import { useEffect, useState } from 'react';
import { checkAdminAccess } from '../services/adminApi';

// What to tell the user for each reason the backend (or the network) gives.
const MESSAGES = {
  unauthenticated: 'Sign in to use the admin tools.',
  forbidden: 'This account does not have admin access.',
  not_available: 'Admin uploads are not enabled on the server.',
  rate_limited: 'Too many requests. Please wait a moment and try again.',
  unavailable: 'The admin service is currently unavailable.',
  network: 'Could not reach the server.',
  error: 'Admin access could not be confirmed.'
};

const SIGNED_OUT = { checked: true, authorized: false, reason: 'unauthenticated', message: MESSAGES.unauthenticated };
const CHECKING = { checked: false, authorized: false, reason: null, message: '' };

/**
 * @param {Object|null} user - Firebase user from AuthContext
 * @returns {{checked: boolean, authorized: boolean, reason: string|null, message: string}}
 */
export function useAdminAccess(user) {
  const [state, setState] = useState(user ? CHECKING : SIGNED_OUT);

  useEffect(() => {
    if (!user) {
      setState(SIGNED_OUT);
      return undefined;
    }

    let cancelled = false;
    setState(CHECKING);

    checkAdminAccess().then((result) => {
      if (cancelled) return;
      setState({
        checked: true,
        authorized: result.authorized,
        reason: result.reason,
        message: result.authorized ? '' : (MESSAGES[result.reason] || MESSAGES.error)
      });
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return state;
}

export default useAdminAccess;
