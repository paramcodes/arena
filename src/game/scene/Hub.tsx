import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { BUILDINGS, GROUND_HALF, INTERACTABLES, ZONES, type Interactable, type Zone } from '../world/layout';
import { useUiStore } from '../store/uiStore';

export function Hub() {
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[GROUND_HALF, 0.5, GROUND_HALF]} position={[0, -0.5, 0]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[GROUND_HALF * 2, GROUND_HALF * 2]} />
        <meshStandardMaterial color="#86c46b" />
      </mesh>

      {BUILDINGS.map((b) => (
        <RigidBody key={b.id} type="fixed" colliders={false} position={b.position}>
          <CuboidCollider args={b.half} />
          <mesh>
            <boxGeometry args={[b.half[0] * 2, b.half[1] * 2, b.half[2] * 2]} />
            <meshStandardMaterial color={b.color} />
          </mesh>
        </RigidBody>
      ))}

      {ZONES.map((z) => (
        <ZoneMarker key={z.id} zone={z} />
      ))}
      {INTERACTABLES.map((it) => (
        <InteractableObject key={it.id} item={it} />
      ))}
    </>
  );
}

function ZoneMarker({ zone }: { zone: Zone }) {
  const open = zone.status === 'open';
  return (
    <group position={zone.position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 4, 16]} />
        <meshStandardMaterial color={open ? '#f59e0b' : '#94a3b8'} />
      </mesh>
      <Html position={[0, 4.6, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="rounded bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 whitespace-nowrap">
          {zone.name}
          {open ? '' : ' (coming soon)'}
        </div>
      </Html>
    </group>
  );
}

function InteractableObject({ item }: { item: Interactable }) {
  const nearby = useUiStore((s) => s.nearbyId === item.id);
  return (
    <group position={item.position}>
      {item.kind === 'sign' ? (
        <>
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.12, 1.8, 0.12]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <boxGeometry args={[1.4, 0.6, 0.1]} />
            <meshStandardMaterial color="#fde68a" />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1, 1.2, 0.5]} />
          <meshStandardMaterial color="#334155" emissive={nearby ? '#22d3ee' : '#000000'} emissiveIntensity={nearby ? 0.6 : 0} />
        </mesh>
      )}
      <Html position={[0, 2.5, 0]} center style={{ pointerEvents: 'none' }}>
        {nearby ? (
          <div className="rounded bg-slate-900/85 px-2 py-1 text-xs text-white whitespace-nowrap">
            Press E: {item.label}
          </div>
        ) : null}
      </Html>
    </group>
  );
}
