import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useAnimStore } from '../store/animationStore';
import { stepMachine, poseFor, blendPoses, type AnimMachine, type Pose } from '@/animation/stateMachine';

// Animation Studio. A block figure driven by the state machine in src/animation.
// The pose is blended toward each new target every frame, which is a simple crossfade.
const ORIGIN: [number, number, number] = [39, 0, -2];
const GRAVITY = 9.81;
const JUMP_SPEED = 5.5;

export function AnimationStudio() {
  const root = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const machine = useRef<AnimMachine>({ state: 'idle', timeInState: 0 });
  const shown = useRef<Pose>(poseFor('idle', 0, 0));
  const clock = useRef(0);
  const y = useRef(0);
  const vy = useRef(0);
  const seenJump = useRef(0);
  const seenAttack = useRef(0);
  const attackPending = useRef(false);
  const frame = useRef(0);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    clock.current += d;
    frame.current += 1;
    const store = useAnimStore.getState();

    if (store.jumpPulse !== seenJump.current) {
      seenJump.current = store.jumpPulse;
      if (y.current <= 0.001) vy.current = JUMP_SPEED;
    }
    if (store.attackPulse !== seenAttack.current) {
      seenAttack.current = store.attackPulse;
      attackPending.current = true;
    }

    // Vertical motion only, so the figure hops in place.
    vy.current -= GRAVITY * d;
    y.current = Math.max(0, y.current + vy.current * d);
    if (y.current === 0 && vy.current < 0) vy.current = 0;
    const grounded = y.current <= 0.001;

    machine.current = stepMachine(
      machine.current,
      { speed: store.speed, grounded, verticalVelocity: vy.current, attackRequested: attackPending.current },
      d,
    );
    attackPending.current = false;

    const target = poseFor(machine.current.state, clock.current, machine.current.timeInState);
    shown.current = blendPoses(shown.current, target, 1 - Math.exp(-d * 12));

    if (root.current) root.current.position.y = y.current;
    if (armL.current) armL.current.rotation.x = shown.current.armL;
    if (armR.current) armR.current.rotation.x = shown.current.armR;
    if (legL.current) legL.current.rotation.x = shown.current.legL;
    if (legR.current) legR.current.rotation.x = shown.current.legR;

    if (frame.current % 10 === 0) store.setCurrent(machine.current.state);
  });

  return (
    <group position={ORIGIN}>
      <group ref={root}>
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[0.6, 0.9, 0.35]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 2.0, 0]} castShadow>
          <sphereGeometry args={[0.25, 20, 14]} />
          <meshStandardMaterial color="#fde68a" />
        </mesh>
        <group ref={armL} position={[-0.4, 1.7, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#0ea5e9" />
          </mesh>
        </group>
        <group ref={armR} position={[0.4, 1.7, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#0ea5e9" />
          </mesh>
        </group>
        <group ref={legL} position={[-0.15, 0.9, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.8, 0.25]} />
            <meshStandardMaterial color="#1e3a8a" />
          </mesh>
        </group>
        <group ref={legR} position={[0.15, 0.9, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.8, 0.25]} />
            <meshStandardMaterial color="#1e3a8a" />
          </mesh>
        </group>
      </group>
      <Html position={[0, 2.8, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="rounded bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 whitespace-nowrap">
          <AnimLabel />
        </div>
      </Html>
    </group>
  );
}

function AnimLabel() {
  const current = useAnimStore((s) => s.current);
  return <>state: {current}</>;
}
