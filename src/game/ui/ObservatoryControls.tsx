'use client';

import { useState } from 'react';
import { featuresFrom, pickRenderer, probeEnvironment } from '@/web/features';
import { ConceptCard } from './ConceptCard';

export function ObservatoryControls() {
  // Probed once, on the client, when the panel opens.
  const [env] = useState(() => probeEnvironment());
  const features = featuresFrom(env);
  const renderer = pickRenderer(env);

  return (
    <>
      <p>
        These checks run in your browser right now. Each feature solves a constraint that the browser has. The game chooses a renderer from what it finds.
      </p>
      <p>
        <strong>Renderer chosen: {renderer === 'none' ? 'none (3D unavailable)' : renderer === 'webgpu' ? 'WebGPU' : 'WebGL 2'}</strong>
      </p>
      <ul className="features">
        {features.map((f) => (
          <li key={f.id}>
            <span aria-hidden="true">{f.available ? '✓' : '✗'}</span>{' '}
            <strong>{f.name}</strong> ({f.available ? 'available' : 'not available'})
            <br />
            {f.constraint}
            <br />
            <em>{f.explanation}</em>
          </li>
        ))}
      </ul>
      <ConceptCard id="webgpu-constraint" />
      <ConceptCard id="web-workers" />
      <ConceptCard id="shared-array-buffer" />
    </>
  );
}
