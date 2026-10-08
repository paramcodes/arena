import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Hub } from './Hub';
import { PhysicsLab } from './PhysicsLab';
import { Player } from './Player';
import { CameraRig } from './CameraRig';
import { GraphicsLab } from './GraphicsLab';
import { PerformanceLab, PerfProbe } from './PerformanceLab';
import { useUiStore } from '../store/uiStore';

export default function Scene() {
  const paused = useUiStore((s) => s.paused);
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 5, 10], fov: 60 }}>
      <color attach="background" args={['#a5d8ff']} />
      <fog attach="fog" args={['#a5d8ff', 70, 150]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[15, 25, 10]} intensity={0.9} />
      <Physics gravity={[0, -9.81, 0]} paused={paused}>
        <Hub />
        <PhysicsLab />
        <GraphicsLab />
        <PerformanceLab />
        <Player />
      </Physics>
      <CameraRig />
      <PerfProbe />
    </Canvas>
  );
}
