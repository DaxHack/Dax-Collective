import { approvedMedia } from './approvedMedia';

const BLOCKED = new Set(['Private', 'Sensitive', 'Needs Review']);

function isPublicApproved(asset) {
  return asset.usageStatus === 'Approved' && !BLOCKED.has(asset.privacyStatus) && asset.privacyStatus === 'Public Safe';
}

export function countBrandPhotos(brand) {
  return approvedMedia.filter(a => a.brand === brand && isPublicApproved(a)).length;
}

export function countSectionPhotos(brand, section) {
  return approvedMedia.filter(
    a => a.brand === brand && a.relatedSeries === section && isPublicApproved(a)
  ).length;
}
