import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { effectiveCount, usePerfStore } from '../store/perfStore';
import { scatterTrees } from '../perf/scatter';

// Performance Mine. Trees are placed in one of two ways:
//   instanced: one InstancedMesh, so one draw call for all trees
//   separate:  one mesh per tree, so one draw call per tree
export const PERF_LAB = { center: { x: -6, z: 50 }, half: 9 } as const;
const TREE_HEIGHT = 2.2;

export function PerformanceLab() {
  const count = usePerfStore((s) => s.count);
  const instanced = usePerfStore((s) => s.instanced);
  const n = effectiveCount(count, instanced);

  const placements = useMemo(() => scatterTrees(n, PERF_LAB.center, PERF_LAB.half), [n]);
  const geometry = useMemo(() => new THREE.ConeGeometry(0.6, TREE_HEIGHT, 6), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#15803d', flatShading: true }), []);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!instanced || !mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    placements.forEach((t, i) => {
      q.setFromAxisAngle(up, t.rotY);
      p.set(t.x, (TREE_HEIGHT / 2) * t.scale, t.z);
      s.setScalar(t.scale);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [placements, instanced]);

  if (instanced) {
    return (
      <instancedMesh ref={meshRef} args={[geometry, material, n]} frustumCulled={false} castShadow />
    );
  }

  return (
    <>
      {placements.map((t, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={material}
          position={[t.x, (TREE_HEIGHT / 2) * t.scale, t.z]}
          rotation={[0, t.rotY, 0]}
          scale={t.scale}
        />
      ))}
    </>
  );
}

// Measures real numbers from the renderer. Writes to a store about twice a second.
export function PerfProbe() {
  const gl = useThree((s) => s.gl);
  const acc = useRef({ t: 0, frames: 0, dtSum: 0 });

  useFrame((_, dt) => {
    const a = acc.current;
    a.t += dt;
    a.frames += 1;
    a.dtSum += dt;
    if (a.t >= 0.5) {
      const info = gl.info.render;
      usePerfStore.getState().setMetrics({
        fps: a.frames / a.t,
        frameMs: (a.dtSum / a.frames) * 1000,
        drawCalls: info.calls,
        triangles: info.triangles,
      });
      acc.current = { t: 0, frames: 0, dtSum: 0 };
    }
  });

  return null;
}
