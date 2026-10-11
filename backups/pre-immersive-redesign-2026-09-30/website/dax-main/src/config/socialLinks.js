// src/config/socialLinks.js
// Central social link config for all Dax Collective brands.
// Update facebookPageUrl once the real URL is confirmed.
// DO NOT connect to any Facebook API or OAuth flow here.

export const facebookPageUrl = "#facebook-page-url-needed";

// Dax the Traveler — brand-specific page links
export const daxTravelerSocialLinks = [
  { label: 'YouTube', href: 'https://www.youtube.com/@DaxTheTraveler' },
  { label: 'Instagram', href: 'https://www.instagram.com/daxthetraveler' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@daxthetraveler' },
  { label: 'Facebook', href: facebookPageUrl },
];

// Dax Collective — brand-wide links used in the footer
export const daxCollectiveSocialLinks = [
  { name: 'YouTube', url: 'https://youtube.com/@daxcollective' },
  { name: 'Instagram', url: 'https://instagram.com/daxcollective' },
  { name: 'TikTok', url: 'https://tiktok.com/@daxcollective' },
  { name: 'Twitter', url: 'https://twitter.com/daxcollective' },
  { name: 'Facebook', url: facebookPageUrl },
];
