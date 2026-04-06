import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { useGlobeVisualModeStore } from '@/state/globeVisualModeStore'

/**
 * Smoothly lerps `globeVisualBlendRef` toward the current mode target (no React re-renders).
 */
export function GlobeVisualBlendDriver() {
  useFrame((_, delta) => {
    const target = useGlobeVisualModeStore.getState().mode === 'explorer' ? 1 : 0
    const b = globeVisualBlendRef.current
    const next = THREE.MathUtils.lerp(b, target, 1 - Math.exp(-4.8 * delta))
    globeVisualBlendRef.current = Math.abs(next - target) < 0.0008 ? target : next
  })
  return null
}
