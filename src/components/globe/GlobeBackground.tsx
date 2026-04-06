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
    const bg = getGlobeVisualSnapshot(globeVisualBlendRef.current).background
    color.set(bg)
    scene.background = color
  })

  return null
}
