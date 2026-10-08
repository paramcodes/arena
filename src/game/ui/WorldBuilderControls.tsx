'use client';

import { useEffect, useState } from 'react';
import { BIOME_COLOR, biomeFor, heightAt, moistureAt } from '@/world/noise';
import { CELL_SIZE, cellKey, cellOf, visibleCells } from '@/world/cells';
import { usePoiStore } from '@/game/store/worldBuilderStore';
import { playerPosition } from '@/game/world/shared';
import { ConceptCard } from './ConceptCard';

const HALF = 7; // map shows 15 x 15 cells
const PX = 18;

export function WorldBuilderControls() {
  const seed = usePoiStore((s) => s.seed);
  const pois = usePoiStore((s) => s.pois);
  const setSeed = usePoiStore((s) => s.setSeed);
  const addPoi = usePoiStore((s) => s.addPoi);
  const removePoi = usePoiStore((s) => s.removePoi);
  const [name, setName] = useState('Landmark');
  const [, setTick] = useState(0);

  // The map follows the player, so repaint a few times a second.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, []);

  const p = { x: playerPosition.x, z: playerPosition.z };
  const here = cellOf(p.x, p.z);
  const loaded = new Set(visibleCells(p).map(cellKey));
  const origin = { cx: here.cx - HALF, cz: here.cz - HALF };
  const cells: JSX.Element[] = [];
  for (let j = 0; j <= 2 * HALF; j++) {
    for (let i = 0; i <= 2 * HALF; i++) {
      const cx = origin.cx + i;
      const cz = origin.cz + j;
      const wx = cx * CELL_SIZE + CELL_SIZE / 2;
      const wz = cz * CELL_SIZE + CELL_SIZE / 2;
      const biome = biomeFor(heightAt(seed, wx, wz), moistureAt(seed, wx, wz));
      const isLoaded = loaded.has(cellKey({ cx, cz }));
      cells.push(
        <rect
          key={`${cx},${cz}`}
          x={i * PX}
          y={j * PX}
          width={PX}
          height={PX}
          fill={BIOME_COLOR[biome]}
          stroke={isLoaded ? '#fff' : 'none'}
          strokeWidth={isLoaded ? 1 : 0}
          opacity={isLoaded ? 1 : 0.45}
        />,
      );
    }
  }
  const size = (2 * HALF + 1) * PX;
  const playerMark = { x: (here.cx - origin.cx + 0.5) * PX, y: (here.cz - origin.cz + 0.5) * PX };

  return (
    <>
      <p>Build a world from a seed. The same seed always makes the same land. Only the bright cells are loaded around you (streaming).</p>
      <div className="row">
        <label>
          Seed{' '}
          <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value) || 0)} style={{ width: 110 }} />
        </label>
        <button type="button" onClick={() => setSeed(seed + 1)}>Next seed</button>
      </div>

      <svg role="img" aria-label={`Terrain map around you. ${loaded.size} cells loaded.`} viewBox={`0 0 ${size} ${size}`} width="100%" style={{ borderRadius: 8 }}>
        {cells}
        <circle cx={playerMark.x} cy={playerMark.y} r={5} fill="#f97316" stroke="#000" />
      </svg>
      <p>
        Loaded cells: {loaded.size} (radius 3). Cell size {CELL_SIZE} m. Grey-out means not loaded.
      </p>

      <div className="row">
        <label>
          Name{' '}
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 130 }} />
        </label>
        <button type="button" onClick={() => addPoi(name, playerPosition.x, playerPosition.z)}>Add landmark here</button>
      </div>
      <ul>
        {pois.length === 0 ? <li>No landmarks yet.</li> : null}
        {pois.map((poi) => (
          <li key={poi.id}>
            {poi.name} at ({poi.x.toFixed(0)}, {poi.z.toFixed(0)}){' '}
            <button type="button" onClick={() => removePoi(poi.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <ConceptCard id="procedural-generation" />
      <ConceptCard id="seed" />
      <ConceptCard id="world-streaming" />
    </>
  );
}
