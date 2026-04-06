import { useMemo } from 'react'
import * as THREE from 'three'

const COUNT = 2400
const RADIUS = 120

/** Deterministic PRNG for stable star positions (avoids impure Math.random in render). */
function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function StarField() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const v = new THREE.Vector3()
    const rnd = mulberry32(0x9e3779b9)

    for (let i = 0; i < COUNT; i++) {
      v.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1)
        .normalize()
        .multiplyScalar(RADIUS + rnd() * 50)

      positions[i * 3] = v.x
      positions[i * 3 + 1] = v.y
      positions[i * 3 + 2] = v.z
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color={0xffffff}
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  )
}
