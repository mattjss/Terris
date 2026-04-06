import { useFrame } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { RefObject } from 'react'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { getGlobeVisualSnapshot } from './globeVisualPresets'

type Props = {
  controlsRef: RefObject<OrbitControlsImpl | null>
}

/** Keeps OrbitControls damping / speed aligned with Atlas vs Explorer motion feel. */
export function GlobeOrbitVisualTuning({ controlsRef }: Props) {
  useFrame(() => {
    const c = controlsRef.current
    if (!c) return
    const s = getGlobeVisualSnapshot(globeVisualBlendRef.current)
    c.dampingFactor = s.orbitDamping
    c.rotateSpeed = s.orbitRotate
    c.autoRotateSpeed = s.autoRotateSpeed
  })
  return null
}
