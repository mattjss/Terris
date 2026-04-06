import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { globeVisualBlendRef } from '@/state/globeVisualBlendRef'
import { getGlobeVisualSnapshot } from './globeVisualPresets'

const COUNT = 5200
const INNER_RADIUS = 138
const SHELL_THICKNESS = 88

/**
 * Distant star shell — soft, low-noise; deterministic placement (no flicker).
 */
function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function StarField() {
  const matRef = useRef<THREE.PointsMaterial>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const cols = new Float32Array(COUNT * 3)
    const v = new THREE.Vector3()
    const rnd = mulberry32(0x9e3779b9)
    const c = new THREE.Color()

    for (let i = 0; i < COUNT; i++) {
      v.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1)
        .normalize()
        .multiplyScalar(INNER_RADIUS + rnd() * SHELL_THICKNESS)

      positions[i * 3] = v.x
      positions[i * 3 + 1] = v.y
      positions[i * 3 + 2] = v.z

      c.setHSL(0.58 + rnd() * 0.06, 0.08 + rnd() * 0.12, 0.72 + rnd() * 0.18)
      cols[i * 3] = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
    return geo
  }, [])

  useFrame(() => {
    const m = matRef.current
    if (!m) return
    const s = getGlobeVisualSnapshot(globeVisualBlendRef.current)
    m.opacity = s.starOpacity
    m.size = s.starSize
    m.color.copy(s.starTint)
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={matRef}
        vertexColors
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}
