import React from 'react';
import { canRenderFinalScene, sceneApprovals } from '../records';

export default function SceneGate({ id, children }) {
  const record = sceneApprovals.find(scene => scene.id === id);
  if (canRenderFinalScene(record)) return children;
  return (
    <section className="v3-gate" aria-label={record?.title || 'Unknown scene'}>
      <h2>{record?.title || 'Unknown scene'}</h2>
      <p>Final scene withheld: approved desktop/mobile Figma frames, state references, and media-use review are required.</p>
    </section>
  );
}
