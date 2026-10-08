import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA } from '../world/layout';
import { cameraRig, playerPosition } from '../world/shared';
import { isHeld } from '../input/keyboard';
import { useUiStore } from '../store/uiStore';

const target = new THREE.Vector3();
const desired = new THREE.Vector3();

// Third-person follow camera. Left/Right arrows turn it around the player.
export function CameraRig() {
  const camera = useThree((s) => s.camera);

  useFrame((_, dt) => {
    const ui = useUiStore.getState();
    const locked = ui.paused || ui.openInteractionId !== null;
    if (!locked) {
      const turn = (isHeld('ArrowLeft') ? 1 : 0) - (isHeld('ArrowRight') ? 1 : 0);
      cameraRig.yaw += turn * 2.2 * dt;
    }

    target.set(playerPosition.x, playerPosition.y + 1, playerPosition.z);
    desired
      .set(Math.sin(cameraRig.yaw) * CAMERA.distance, CAMERA.height, Math.cos(cameraRig.yaw) * CAMERA.distance)
      .add(playerPosition);

    // Reduced motion removes camera lag and snaps to the target position.
    const k = ui.reducedMotion ? 1 : 1 - Math.exp(-dt * 10);
    camera.position.lerp(desired, k);
    camera.lookAt(target);
  });

  return null;
}
