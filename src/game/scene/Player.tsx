import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { PLAYER, SPAWN, WALL, nearestInteractable } from '../world/layout';
import { cameraRig, setPlayerPosition } from '../world/shared';
import { clampUnit, consumePress, isHeld, readGamepad } from '../input/keyboard';
import { useUiStore } from '../store/uiStore';
import { useWorldStore } from '../store/worldStore';
import { useMissionStore } from '@/missions/missionStore';
import { wallStepSignals } from '@/missions/wallWatch';
import { WALL_MISSION_ID } from '@/knowledge/content/missions';

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const { world, rapier } = useRapier();
  const prev = useRef({ x: SPAWN[0], z: SPAWN[2] });
  const frame = useRef(0);
  const resetSignal = useWorldStore((s) => s.resetSignal);

  // Put the player back at spawn whenever the world is reset.
  useEffect(() => {
    const b = body.current;
    if (!b) return;
    b.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
    b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    b.setAngvel({ x: 0, y: 0, z: 0 }, true);
    prev.current = { x: SPAWN[0], z: SPAWN[2] };
    setPlayerPosition(SPAWN[0], SPAWN[1], SPAWN[2]);
  }, [resetSignal]);

  useFrame(() => {
    const b = body.current;
    if (!b) return;
    frame.current += 1;
    const ui = useUiStore.getState();

    // Read one-shot keys every frame, even when paused, so old presses cannot fire later.
    const interactPressed = consumePress('KeyE');
    const jumpPressed = consumePress('Space');

    if (ui.paused) return;

    const t = b.translation();
    const lv = b.linvel();

    // Safe failure: falling out of the world puts you back at the start with a message.
    if (t.y < -8) {
      b.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
      b.setLinvel({ x: 0, y: 0, z: 0 }, true);
      prev.current = { x: SPAWN[0], z: SPAWN[2] };
      ui.notify('You fell out of the world. Try again. Press R to reset the whole world.');
      return;
    }
    setPlayerPosition(t.x, t.y, t.z);

    // Interaction: nearby prompt, and E to open or close.
    const near = nearestInteractable(t.x, t.z);
    if (near?.id !== ui.nearbyId) ui.setNearby(near?.id ?? null);
    if (interactPressed) {
      if (ui.openInteractionId) {
        ui.openInteraction(null);
      } else if (near) {
        ui.openInteraction(near.id);
        if (near.mission) {
          useMissionStore.getState().complete(near.mission.missionId, near.mission.stepId);
        }
      }
    }

    // Movement input is locked while a dialog is open.
    const locked = useUiStore.getState().openInteractionId !== null;
    const pad = readGamepad();
    const keyF = (isHeld('KeyW') || isHeld('ArrowUp') ? 1 : 0) - (isHeld('KeyS') || isHeld('ArrowDown') ? 1 : 0);
    const keyS = (isHeld('KeyD') ? 1 : 0) - (isHeld('KeyA') ? 1 : 0);
    const fwdAxis = locked ? 0 : clampUnit(keyF - pad.y);
    const sideAxis = locked ? 0 : clampUnit(keyS + pad.x);

    // Move relative to the camera's yaw, so "forward" is away from the camera.
    const yaw = cameraRig.yaw;
    forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    move.set(0, 0, 0).addScaledVector(forward, fwdAxis).addScaledVector(right, sideAxis);
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(PLAYER.moveSpeed);

    // Ground check: cast down from the capsule centre and ignore the player's own collider.
    const ray = new rapier.Ray({ x: t.x, y: t.y, z: t.z }, { x: 0, y: -1, z: 0 });
    const hit = world.castRay(ray, PLAYER.halfHeight + PLAYER.radius + 0.15, true, undefined, undefined, b.collider(0));
    const grounded = hit !== null;

    let vy = lv.y; // gravity keeps acting on the vertical speed
    if (grounded && (jumpPressed || pad.jump) && !locked) vy = PLAYER.jumpSpeed;
    b.setLinvel({ x: move.x, y: vy, z: move.z }, true);

    // Phase 4 wall watcher: which mission steps did this frame prove?
    const cur = { x: t.x, z: t.z };
    const colliderOn = useWorldStore.getState().wallColliderEnabled;
    for (const stepId of wallStepSignals(prev.current, cur, WALL, colliderOn)) {
      useMissionStore.getState().complete(WALL_MISSION_ID, stepId);
    }
    prev.current = cur;

    // Publish a snapshot for the inspector, about 10 times per second.
    if (frame.current % 6 === 0) {
      useWorldStore.getState().setPlayerSnapshot({
        position: [t.x, t.y, t.z],
        velocity: [move.x, vy, move.z],
        grounded,
      });
    }
  });

  return (
    <RigidBody ref={body} type="dynamic" position={SPAWN} colliders={false} lockRotations ccd>
      <CapsuleCollider args={[PLAYER.halfHeight, PLAYER.radius]} />
      <mesh>
        <capsuleGeometry args={[PLAYER.radius, PLAYER.halfHeight * 2, 8, 16]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
    </RigidBody>
  );
}
