import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { getGlobeVisualSnapshot } from './globeVisualPresets'

/** Scene background color — follows Atlas / Explorer blend without remounting Canvas. */
export function GlobeBackground() {
  const { scene } = useThree()
  const color = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    const t = globeVisualBlendRef.current
    const bg = getGlobeVisualSnapshot(t).background
    color.set(bg)
    /* Explorer uses skydome mesh — clear color stays dark at gaps / edges. */
    scene.background = t > 0.06 ? null : color
  })

  return null
}
