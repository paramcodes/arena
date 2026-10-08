import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useGraphicsStore } from '../store/graphicsStore';

// Graphics Forest. One sphere shows PBR: roughness and metalness set how light bounces off it.
// The environment map is a generated room, so it works offline. Metals look dark without one.
export function GraphicsLab() {
  const gl = useThree((s) => s.gl);
  const roughness = useGraphicsStore((s) => s.roughness);
  const metalness = useGraphicsStore((s) => s.metalness);
  const environmentOn = useGraphicsStore((s) => s.environmentOn);

  const envMap = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);

  return (
    <group position={[22, 0, -24]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[7, 48]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[0, 2, 4]} castShadow>
        <sphereGeometry args={[1.4, 48, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={roughness}
          metalness={metalness}
          envMap={environmentOn ? envMap : null}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
}
