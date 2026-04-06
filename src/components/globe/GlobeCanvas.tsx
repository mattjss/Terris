import { Canvas } from '@react-three/fiber'
import { useTerrisStore } from '@/state/useTerrisStore'
import { GlobeScene } from './GlobeScene'

export function GlobeCanvas() {
  return (
    <Canvas
      onPointerLeave={() => useTerrisStore.getState().setHoveredCoords(null)}
      camera={{ fov: 42, position: [0.5, 0.3, 5.2], near: 0.08, far: 8000 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      dpr={[1, 2]}
      frameloop="always"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        touchAction: 'none',
      }}
      aria-label="Interactive 3D historical globe"
      role="img"
    >
      <GlobeScene />
    </Canvas>
  )
}
