// src/services/waitlistApi.js
//
// The one place waitlist sign-ups are sent from (POST /api/waitlist).
//
// Rules this module enforces for every caller:
//   - If no production backend is configured, sign-ups are unavailable and
//     no request is made. Forms must show WAITLIST_UNAVAILABLE_MESSAGE and
//     disable themselves; they must never show a success state.
//   - Success is reported only when the backend confirms it.
//   - Error messages shown to visitors are fixed strings, never backend text.
//   - One `generate_lead` analytics event is sent per sign-up the backend
//     reports as newly created. Failures and repeat sign-ups send nothing,
//     and the email address is never passed to analytics.

import { PUBLIC_API_BASE, isPublicApiConfigured } from '../config/publicApi';
import { trackLead } from '../utils/analytics';

export const isWaitlistAvailable = isPublicApiConfigured;

export const WAITLIST_UNAVAILABLE_MESSAGE =
  'The waitlist isn’t open for sign-ups yet. Please check back soon.';

const MESSAGES = {
  unavailable: WAITLIST_UNAVAILABLE_MESSAGE,
  invalid: 'Please enter a valid email address.',
  rate_limited: 'Too many attempts. Please wait a moment and try again.',
  failed: 'We couldn’t save your sign-up. Please try again.'
};

export class WaitlistError extends Error {
  constructor(reason) {
    super(MESSAGES[reason] || MESSAGES.failed);
    this.name = 'WaitlistError';
    this.reason = MESSAGES[reason] ? reason : 'failed';
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Add an email address to the waitlist.
 * Resolves only when the backend has confirmed the sign-up.
 * @param {string} email
 * @param {string} source - One of the sources the backend accepts
 * @returns {Promise<{alreadySubscribed: boolean, created: boolean}>}
 * @throws {WaitlistError}
 */
export async function joinWaitlist(email, source) {
  if (!isWaitlistAvailable) {
    throw new WaitlistError('unavailable');
  }

  const value = String(email || '').trim();
  if (!EMAIL_PATTERN.test(value)) {
    throw new WaitlistError('invalid');
  }

  let response;
  try {
    response = await fetch(`${PUBLIC_API_BASE}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: value, source })
    });
  } catch (error) {
    throw new WaitlistError('failed');
  }

  if (response.status === 400) throw new WaitlistError('invalid');
  if (response.status === 429) throw new WaitlistError('rate_limited');
  if (!response.ok) throw new WaitlistError('failed');

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new WaitlistError('failed');
  }

  // Only an explicit confirmation counts as success.
  if (!data || data.success !== true) {
    throw new WaitlistError('failed');
  }

  // `created` must be an explicit true from the backend; anything else
  // (a repeat sign-up, an older backend) is not counted as a new lead.
  const created = data.created === true;
  if (created) {
    trackLead(source);
  }

  return { alreadySubscribed: !created, created };
}
