import { useMemo } from 'react'
import * as THREE from 'three'

const COUNT = 2400
const RADIUS = 120

export function StarField() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const v = new THREE.Vector3()

    for (let i = 0; i < COUNT; i++) {
      v.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      )
        .normalize()
        .multiplyScalar(RADIUS + Math.random() * 50)

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
