import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { fsmNext, type NpcState } from '@/ai/fsm';
import { utilityChoose } from '@/ai/utility';
import { useAiStore } from '../store/aiStore';
import { playerPosition } from '../world/shared';

// AI Village. One NPC runs its chosen behaviour. Movement is kinematic, so it ignores walls.
const CENTER = { x: 24, z: 22 };
const COLOR: Record<NpcState, string> = { patrol: '#22c55e', chase: '#ef4444', flee: '#a855f7' };

export function AiVillage() {
  const body = useRef<THREE.Group>(null);
  const pos = useRef({ x: CENTER.x + 5, z: CENTER.z });
  const state = useRef<NpcState>('patrol');
  const clock = useRef(0);
  const frame = useRef(0);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    clock.current += d;
    frame.current += 1;
    const ai = useAiStore.getState();

    const dx = playerPosition.x - pos.current.x;
    const dz = playerPosition.z - pos.current.z;
    const distance = Math.hypot(dx, dz);
    const input = { distance, health: ai.npcHealth };

    state.current = ai.mode === 'fsm' ? fsmNext(state.current, input) : utilityChoose(input);

    let tx = CENTER.x;
    let tz = CENTER.z;
    let speed = 2.5;
    if (state.current === 'patrol') {
      tx = CENTER.x + Math.cos(clock.current * 0.4) * 5;
      tz = CENTER.z + Math.sin(clock.current * 0.4) * 5;
    } else if (state.current === 'chase') {
      tx = playerPosition.x;
      tz = playerPosition.z;
      speed = 4;
    } else {
      const len = Math.max(distance, 0.01);
      tx = pos.current.x - (dx / len) * 4;
      tz = pos.current.z - (dz / len) * 4;
      speed = 5;
    }

    const mx = tx - pos.current.x;
    const mz = tz - pos.current.z;
    const ml = Math.hypot(mx, mz);
    if (ml > 0.01) {
      const step = Math.min(ml, speed * d);
      pos.current.x += (mx / ml) * step;
      pos.current.z += (mz / ml) * step;
    }
    if (body.current) body.current.position.set(pos.current.x, 0, pos.current.z);

    if (frame.current % 12 === 0) {
      ai.setNpcState(state.current);
      ai.setDistance(distance);
    }
  });

  return (
    <group ref={body} position={[CENTER.x + 5, 0, CENTER.z]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8, 6, 12]} />
        <NpcColor />
      </mesh>
      <Html position={[0, 2.1, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="rounded bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 whitespace-nowrap">
          <NpcLabel />
        </div>
      </Html>
    </group>
  );
}

function NpcColor() {
  const s = useAiStore((st) => st.npcState);
  return <meshStandardMaterial color={COLOR[s]} />;
}

function NpcLabel() {
  const s = useAiStore((st) => st.npcState);
  return <>NPC: {s}</>;
}
