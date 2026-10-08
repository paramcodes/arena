// The world is split into square cells. Only cells near the player are "loaded".
export interface CellCoord {
  cx: number;
  cz: number;
}

export const CELL_SIZE = 4;
export const STREAM_RADIUS = 3; // in cells

export function cellOf(x: number, z: number, size = CELL_SIZE): CellCoord {
  return { cx: Math.floor(x / size), cz: Math.floor(z / size) };
}

export function cellKey(c: CellCoord): string {
  return `${c.cx},${c.cz}`;
}

// Every cell within radius of the cell containing (x, z), including the cell itself.
export function visibleCells(p: { x: number; z: number }, radius = STREAM_RADIUS, size = CELL_SIZE): CellCoord[] {
  const c = cellOf(p.x, p.z, size);
  const out: CellCoord[] = [];
  for (let dz = -radius; dz <= radius; dz++) {
    for (let dx = -radius; dx <= radius; dx++) {
      out.push({ cx: c.cx + dx, cz: c.cz + dz });
    }
  }
  return out;
}
