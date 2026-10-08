import type * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { FEEL, burstVelocities, particlePos, recoilOffset, hitStopActive, type Burst } from '@/feel/feel';
import { feelState } from '@/feel/state';

// Game Feel lab. A target cube spins. A juiced hit freezes it briefly (hit stop), pushes it back (recoil),
// and throws particles. Screen shake is applied by the camera rig, reading feelState.
export const FEEL_LAB = { x: 4, y: 1, z: -20 } as const;

export function FeelLab() {
  const cube = useRef<THREE.Mesh>(null);
  const particles = useRef<Array<THREE.Mesh | null>>([]);
  const bursts = useRef<Burst[]>(burstVelocities(FEEL.particleCount, feelState.burstSeed));
  const seenSeed = useRef(feelState.burstSeed);
  const spin = useRef(0);

  useFrame((_, dt) => {
    const now = performance.now();
    if (!hitStopActive(now, feelState.hitStopUntilMs)) spin.current += dt * 0.8;
    if (cube.current) {
      const recoil = recoilOffset((now - feelState.recoilStartMs) / 1000);
      cube.current.position.set(FEEL_LAB.x, FEEL_LAB.y, FEEL_LAB.z + recoil);
      cube.current.rotation.y = spin.current;
    }
    if (seenSeed.current !== feelState.burstSeed) {
      seenSeed.current = feelState.burstSeed;
      bursts.current = burstVelocities(FEEL.particleCount, feelState.burstSeed);
    }
    const t = (now - feelState.burstStartMs) / 1000;
    particles.current.forEach((m, i) => {
      if (!m) return;
      const visible = t >= 0 && t < FEEL.burstSec;
      m.visible = visible;
      if (!visible) return;
      const p = particlePos(bursts.current[i], t);
      m.position.set(FEEL_LAB.x + p.x, FEEL_LAB.y + p.y, FEEL_LAB.z + p.z);
    });
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[FEEL_LAB.x, 0.02, FEEL_LAB.z]} receiveShadow>
        <circleGeometry args={[4, 36]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh ref={cube} position={[FEEL_LAB.x, FEEL_LAB.y, FEEL_LAB.z]} castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>
      {Array.from({ length: FEEL.particleCount }, (_, i) => (
        <mesh key={i} ref={(el) => { particles.current[i] = el; }} visible={false}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color="#fde047" />
        </mesh>
      ))}
    </group>
  );
}
