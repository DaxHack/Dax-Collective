// Engineering identifiers only. Final appearance is governed by approved Figma frames.
export const V3_BASE = '/experiments/dax-universe-v3';
export const worlds = [
  { path: 'traveler', name: 'Dax Traveler', scenes: ['traveler-hero', 'traveler-journey'] },
  { path: 'gods-vessel', name: "God’s Vessel", scenes: ['vessel-garment'] },
  { path: 'timezone-travelers', name: 'Time-Zone', scenes: ['timezone-environments'] },
  { path: 'ani-dax', name: 'Ani-Dax', scenes: ['ani-theory', 'ani-key-visual'] },
];
export const sceneApprovals = [
  { id: 'collective-selector', title: 'Collective world selector' },
  { id: 'traveler-hero', title: 'Traveler cinematic hero' },
  { id: 'traveler-journey', title: 'Traveler journey and timeline' },
  { id: 'vessel-garment', title: 'Vessel garment interaction' },
  { id: 'timezone-environments', title: 'Time-Zone environment sequence' },
  { id: 'ani-theory', title: 'Ani-Dax theory chamber' },
  { id: 'ani-key-visual', title: 'Ani-Dax key visual' },
].map(scene => ({
  ...scene,
  desktop: null, mobile: null, states: null, mediaReview: null,
  approvedBy: null, approvedAt: null,
}));

export function canRenderFinalScene(record) {
  return Boolean(record?.desktop && record?.mobile && record?.states &&
    record?.mediaReview === 'approved' && record?.approvedBy && record?.approvedAt);
}
