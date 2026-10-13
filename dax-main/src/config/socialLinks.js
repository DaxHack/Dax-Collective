// src/config/socialLinks.js
// Central social link config for all Dax Collective brands.
//
// Public UI must render links through publicSocialLinks(), which fails
// closed: a link is shown only when it is explicitly marked `verified: true`
// AND is a real https URL. Placeholders and unconfirmed handles stay here as
// a record but are never rendered.
//
// To publish a link: confirm the account exists and belongs to the brand,
// then set `verified: true`. Do not add handles that have not been created.
// DO NOT connect to any Facebook API or OAuth flow here.

// Not confirmed yet — replace with the real page URL, then mark it verified.
export const facebookPageUrl = '#facebook-page-url-needed';

// Dax the Traveler — brand-specific page links
export const daxTravelerSocialLinks = [
  // Checked 2026-10-12: resolves to the "Dax the Traveler" channel.
  { label: 'YouTube', href: 'https://www.youtube.com/@DaxTheTraveler', verified: true },
  { label: 'Instagram', href: 'https://www.instagram.com/daxthetraveler', verified: false },
  { label: 'TikTok', href: 'https://www.tiktok.com/@daxthetraveler', verified: false },
  { label: 'Facebook', href: facebookPageUrl, verified: false },
];

// Dax Collective — brand-wide links used in the footer
export const daxCollectiveSocialLinks = [
  // Checked 2026-10-12: this YouTube handle returned "404 Not Found".
  { name: 'YouTube', url: 'https://youtube.com/@daxcollective', verified: false },
  { name: 'Instagram', url: 'https://instagram.com/daxcollective', verified: false },
  { name: 'TikTok', url: 'https://tiktok.com/@daxcollective', verified: false },
  { name: 'Twitter', url: 'https://twitter.com/daxcollective', verified: false },
  { name: 'Facebook', url: facebookPageUrl, verified: false },
];

const linkUrl = (link) => (link && (link.href || link.url)) || '';

/**
 * True only for a link that is explicitly verified and points at an https URL.
 */
export const isPublicSocialLink = (link) =>
  Boolean(link) && link.verified === true && /^https:\/\/[^\s#]+$/i.test(linkUrl(link));

/**
 * The subset of a social link list that may be shown to visitors.
 * @param {Array} links
 * @returns {Array}
 */
export const publicSocialLinks = (links) => (Array.isArray(links) ? links.filter(isPublicSocialLink) : []);
