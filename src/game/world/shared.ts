import * as THREE from 'three';
import { SPAWN } from './layout';

// Shared per-frame values. Written by Player and CameraRig; never React state.
export const playerPosition = new THREE.Vector3(SPAWN[0], SPAWN[1], SPAWN[2]);
export const cameraRig = { yaw: 0 };
