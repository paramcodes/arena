import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA } from '../world/layout';
import { cameraRig, playerPosition } from '../world/shared';
import { isHeld } from '../input/keyboard';
import { useUiStore } from '../store/uiStore';
import { shakeOffset, FEEL } from '@/feel/feel';
import { feelState } from '@/feel/state';

const target = new THREE.Vector3();
const desired = new THREE.Vector3();
const base = new THREE.Vector3();

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
    desired.set(
      playerPosition.x + Math.sin(cameraRig.yaw) * CAMERA.distance,
      playerPosition.y + CAMERA.height,
      playerPosition.z + Math.cos(cameraRig.yaw) * CAMERA.distance,
    );

    // Reduced motion removes camera lag and snaps to the target position.
    const k = ui.reducedMotion ? 1 : 1 - Math.exp(-dt * 10);
    // Lerp a separate base position so shake never accumulates into the camera's motion.
    base.lerp(desired, k);
    const shake = shakeOffset((performance.now() - feelState.shakeStartMs) / 1000, FEEL.shakeSec, feelState.shakeIntensity);
    camera.position.set(base.x + shake.x, base.y + shake.y, base.z);
    camera.lookAt(target);
  });

  return null;
}
