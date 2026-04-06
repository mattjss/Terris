import { useMemo } from 'react'
import * as THREE from 'three'
import {
  type HistoricalEntity,
  latLngToVec3,
  GLOBE_RADIUS,
} from '@/data/historical'
import { useVisibleEntities } from '@/store/atlas'

const vertexShader = /* glsl */ `
varying vec3 vWorldNormal;

void main() {
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
varying vec3 vWorldNormal;

uniform vec3 uCenter;
uniform float uRadius;
uniform vec3 uColor;

void main() {
  vec3 n = normalize(vWorldNormal);
  float d = acos(clamp(dot(n, uCenter), -1.0, 1.0));

  float alpha = 1.0 - smoothstep(0.0, uRadius, d);
  alpha = pow(alpha, 2.0) * 0.1;

  gl_FragColor = vec4(uColor, alpha);
}
`

const _sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.003, 64, 64)

function EmpireZone({ entity }: { entity: HistoricalEntity }) {
  const material = useMemo(() => {
    const [x, y, z] = latLngToVec3(entity.lat, entity.lng, 1)
    const center = new THREE.Vector3(x, y, z).normalize()
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uCenter: { value: center },
        uRadius: { value: entity.radius ?? 0.5 },
        uColor: { value: new THREE.Color(entity.color) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    })
  }, [entity.lat, entity.lng, entity.radius, entity.color])

  return <mesh geometry={_sphereGeo} material={material} />
}

export function EmpireOverlay() {
  const visible = useVisibleEntities()

  const empires = useMemo(
    () => visible.filter((e) => e.type === 'empire'),
    [visible],
  )

  return (
    <group>
      {empires.map((e) => (
        <EmpireZone key={e.id} entity={e} />
      ))}
    </group>
  )
}
