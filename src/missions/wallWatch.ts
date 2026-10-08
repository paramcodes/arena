// Pure check: which wall-mission steps did this frame prove?
// Lives outside React so it can be unit tested without a 3D scene.

export type WallStepId = 'walk-through' | 'bump-wall' | 'enable-collider';

export interface Rect {
  cx: number;
  cz: number;
  hx: number;
  hz: number;
}

export interface Point2 {
  x: number;
  z: number;
}

export function wallStepSignals(prev: Point2, cur: Point2, wall: Rect, colliderOn: boolean): WallStepId[] {
  const out: WallStepId[] = [];
  const frontZ = wall.cz + wall.hz;
  const backZ = wall.cz - wall.hz;
  const inReach = Math.abs(cur.x - wall.cx) <= wall.hx + 0.3;

  if (colliderOn) {
    out.push('enable-collider');
    // A player capsule stops about 0.4 m in front of the face, so 0.8 m covers standing against it.
    if (inReach && cur.z > frontZ && cur.z <= frontZ + 0.8) out.push('bump-wall');
  } else if (inReach && prev.z > backZ && cur.z <= backZ) {
    // Crossed fully through the back face while the collider was off.
    out.push('walk-through');
  }
  return out;
}
