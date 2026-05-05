// src/hooks/useApprovedMedia.js
// Phase 1: filters the static seed array. Phase 2: swap seedData for a Firestore query.
// Safety filters (status, privacyStatus, brand-specific rules) are enforced here, not in callers.

import { useMemo } from 'react';
import { approvedMedia } from '../data/approvedMedia';

export function useApprovedMedia({ brand, isHero, isGallery, isFeatured, series, limit = 20 } = {}) {
  const media = useMemo(() => {
    let results = approvedMedia.filter(item => {
      if (item.status !== 'approved') return false;
      if (item.privacyStatus !== 'public') return false;
      if (brand && item.brand !== brand) return false;

      // AniDax hard rule: ipSafetyCleared must be explicitly true
      if (item.brand === 'ani-dax' && item.ipSafetyCleared !== true) return false;

      // Time-Zone Travelers hard rule: no people in photos
      if (item.brand === 'time-zone-travelers' && item.peopleShown.length > 0) return false;

      if (isHero !== undefined && item.websiteUsage.isHero !== isHero) return false;
      if (isGallery !== undefined && item.websiteUsage.isGallery !== isGallery) return false;
      if (isFeatured !== undefined && item.websiteUsage.isFeatured !== isFeatured) return false;
      if (series && item.series !== series) return false;

      return true;
    });

    return results.slice(0, limit);
  }, [brand, isHero, isGallery, isFeatured, series, limit]);

  return { media, loading: false, error: null };
}
