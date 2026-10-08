import { SPAWN } from './layout';

// Shared per-frame values, as plain numbers. Plain objects let UI code read the player's
// position without importing three.js, which keeps the home page bundle small.
export const playerPosition = { x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] };
export function setPlayerPosition(x: number, y: number, z: number): void {
  playerPosition.x = x;
  playerPosition.y = y;
  playerPosition.z = z;
}
export const cameraRig = { yaw: 0 };
