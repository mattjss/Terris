import { Canvas } from '@react-three/fiber'
import { GlobeScene } from './GlobeScene'

export function GlobeCanvas() {
  return (
    <Canvas
      camera={{ fov: 42, position: [0.5, 0.3, 5.2], near: 0.1, far: 1000 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      dpr={[1, 2]}
      frameloop="always"
      style={{ position: 'absolute', inset: 0 }}
      aria-label="Interactive 3D historical globe"
      role="img"
    >
      <GlobeScene />
    </Canvas>
  )
}
