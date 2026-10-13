export const BLOG_CATEGORIES = [
  'From the Vlog',
  'Wanderlost with Dax',
  'Quick Blips',
  'Quick Jumps',
  'Zone Guides',
  'Travel Dispatches',
  'Time-Zone Tips',
  'Anime Files',
  'AniDax Pulse',
  'Character Files',
  'Names of God: The Dictionary Series',
  'Archive Notes',
];

export const BRAND_MAP = {
  'dax-the-traveler': {
    label: 'Dax the Traveler',
    route: '/dax-the-traveler',
    accent: 'text-cyan-400',
    bg: 'bg-cyan-600',
    categories: ['From the Vlog', 'Wanderlost with Dax', 'Quick Blips', 'Quick Jumps'],
  },
  'time-zone-travelers': {
    label: 'Time-Zone Travelers',
    route: '/timezone-travelers',
    accent: 'text-orange-400',
    bg: 'bg-orange-600',
    categories: ['Zone Guides', 'Travel Dispatches', 'Time-Zone Tips'],
  },
  'ani-dax': {
    label: 'Ani-Dax',
    route: '/ani-dax',
    accent: 'text-purple-400',
    bg: 'bg-purple-600',
    categories: ['Anime Files', 'AniDax Pulse', 'Character Files'],
  },
  'gods-vessel': {
    label: "God's Vessel",
    route: '/gods-vessel',
    accent: 'text-yellow-600',
    bg: 'bg-yellow-700',
    categories: ['Names of God: The Dictionary Series', 'Archive Notes'],
  },
};

// ─── Publication control ──────────────────────────────────────────────────────
// Every entry carries two fields that decide whether visitors can see it:
//
//   status    'draft' | 'published'
//   verified  true once Daniel has confirmed the piece — in particular any
//             first-person account, date, price or budget figure in it.
//
// Only entries with status 'published' AND verified true are exported as
// BLOG_POSTS, and only BLOG_POSTS is used by the public blog list, the post
// route and the helpers below.
//
// Unverified writing lives in ./editorial/blogDrafts.js, which the app never
// imports, so drafts are not shipped to browsers at all. To publish a piece,
// review it, move its entry into PUBLISHED_ENTRIES below, and set
// status: 'published' and verified: true.
export const POST_STATUS = { DRAFT: 'draft', PUBLISHED: 'published' };

export const isPublicPost = (post) =>
  Boolean(post) && post.status === POST_STATUS.PUBLISHED && post.verified === true;

// Verified, published entries. Empty until the first piece is approved.
const PUBLISHED_ENTRIES = [];

/** Posts visitors can see. */
export const BLOG_POSTS = PUBLISHED_ENTRIES.filter(isPublicPost);

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}

export function getPostsByBrand(brand) {
  return BLOG_POSTS.filter((p) => p.brand === brand);
}

export function getPostsByCategory(category) {
  return BLOG_POSTS.filter((p) => p.category === category);
}

export function getAllCategories() {
  return [...new Set(BLOG_POSTS.map((p) => p.category))];
}

// ─── Media Asset Helpers ──────────────────────────────────────────────────────
// Blog posts may optionally include a `mediaAssetId` field referencing an
// approved asset from the dax_media_library localStorage store.
// Assets are NEVER auto-selected — they must be manually set to Approved
// AND have privacyStatus === 'Public Safe' before they appear publicly.

const MEDIA_LIBRARY_KEY = 'dax_media_library';
const BLOCKED_PRIVACY = new Set(['Private', 'Sensitive', 'Needs Review']);

export function getApprovedMediaAssets() {
  try {
    const stored = localStorage.getItem(MEDIA_LIBRARY_KEY);
    if (!stored) return [];
    return JSON.parse(stored).filter(
      (a) =>
        a.usageStatus === 'Approved' &&
        !BLOCKED_PRIVACY.has(a.privacyStatus) &&
        a.privacyStatus === 'Public Safe'
    );
  } catch (e) {
    return [];
  }
}

export function getMediaAssetById(id) {
  try {
    const stored = localStorage.getItem(MEDIA_LIBRARY_KEY);
    if (!stored) return null;
    return JSON.parse(stored).find((a) => a.id === id) || null;
  } catch (e) {
    return null;
  }
}

export function getApprovedMediaForBrand(brand) {
  return getApprovedMediaAssets().filter((a) => a.brand === brand);
}

