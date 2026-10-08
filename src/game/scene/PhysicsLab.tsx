import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { LAB, WALL } from '../world/layout';
import { useWorldStore } from '../store/worldStore';

// The Physics Lab. The wall's visible mesh is always drawn.
// Its collider exists only while wallColliderEnabled is true.
export function PhysicsLab() {
  const colliderOn = useWorldStore((s) => s.wallColliderEnabled);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[LAB.cx, 0.02, LAB.cz]} receiveShadow>
        <planeGeometry args={[LAB.hx * 2, LAB.hz * 2]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      <mesh position={[WALL.cx, WALL.cy, WALL.cz]} castShadow>
        <boxGeometry args={[WALL.hx * 2, WALL.hy * 2, WALL.hz * 2]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={0.85} />
      </mesh>

      <RigidBody type="fixed" colliders={false}>
        {colliderOn ? <CuboidCollider args={[WALL.hx, WALL.hy, WALL.hz]} position={[WALL.cx, WALL.cy, WALL.cz]} /> : null}
      </RigidBody>

      {colliderOn ? (
        <mesh position={[WALL.cx, WALL.cy, WALL.cz]}>
          <boxGeometry args={[WALL.hx * 2, WALL.hy * 2, WALL.hz * 2]} />
          <meshBasicMaterial color="#22d3ee" wireframe />
        </mesh>
      ) : null}
    </>
  );
}
