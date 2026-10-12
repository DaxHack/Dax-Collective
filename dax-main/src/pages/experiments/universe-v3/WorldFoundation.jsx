import React from 'react';
import SceneGate from './shared/SceneGate';

export default function WorldFoundation({ world, children }) {
  return (
    <>
      <h1>{world.name} · V3 foundation</h1>
      <p>This is an engineering review surface, not an approved visual scene.</p>
      {world.scenes.map(id => <SceneGate id={id} key={id} />)}
      {children}
    </>
  );
}
