import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BallCollider, CuboidCollider, RigidBody, useRapier } from '@react-three/rapier';
import { usePhysicsStore } from '../store/physicsStore';

// Physics experiments in the Physics Lab. Ball restitution and ramp friction are set from the panel.
// The turret's yellow line is a real raycast into the physics world; its length is measured.
const TURRET = { x: -26, y: 1.1, z: -20 };
const RAY_MAX = 40;

export function PhysicsDistrict() {
  const restitution = usePhysicsStore((s) => s.restitution);
  const friction = usePhysicsStore((s) => s.friction);
  const dropKey = usePhysicsStore((s) => s.dropKey);
  // Remounting the bodies on any change restarts the experiment with the new values.
  const key = `${dropKey}-${restitution}-${friction}`;

  return (
    <>
      <RigidBody key={`ramp-${key}`} type="fixed" position={[-15, 0.8, -19]} rotation={[0, 0, 0.25]} colliders={false}>
        <CuboidCollider args={[2, 0.2, 1.5]} friction={friction} />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 0.4, 3]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </RigidBody>

      <RigidBody key={`ball-${key}`} type="dynamic" position={[-15, 6, -19]} colliders={false} ccd>
        <BallCollider args={[0.5]} restitution={restitution} friction={friction} />
        <mesh castShadow>
          <sphereGeometry args={[0.5, 24, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </RigidBody>

      <mesh position={[TURRET.x, 0.6, TURRET.z]} castShadow>
        <boxGeometry args={[1, 1.2, 1]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <TurretRay />
    </>
  );
}

function TurretRay() {
  const { world, rapier } = useRapier();
  const setRayDistance = usePhysicsStore((s) => s.setRayDistance);
  const frame = useRef(0);

  const line = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: '#fde047' }));
  }, []);

  useFrame(() => {
    frame.current += 1;
    const ox = TURRET.x + 0.5;
    const hit = world.castRay(new rapier.Ray({ x: ox, y: TURRET.y, z: TURRET.z }, { x: 1, y: 0, z: 0 }), RAY_MAX, true);
    const dist = hit ? hit.timeOfImpact : RAY_MAX;
    const attr = line.geometry.getAttribute('position') as THREE.BufferAttribute;
    attr.setXYZ(0, ox, TURRET.y, TURRET.z);
    attr.setXYZ(1, ox + dist, TURRET.y, TURRET.z);
    attr.needsUpdate = true;
    if (frame.current % 10 === 0) setRayDistance(dist);
  });

  return <primitive object={line} />;
}

