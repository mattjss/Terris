import { useMemo } from 'react'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/data/historical'

const vertexShader = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  float f = 1.0 - abs(dot(normalize(vWorldNormal), normalize(vViewDir)));
  float inner = pow(f, 2.5) * 0.22;
  float outer = pow(f, 5.0) * 0.35;

  vec3 color = mix(vec3(0.10, 0.32, 0.30), vec3(0.20, 0.50, 0.48), outer);
  float alpha = inner + outer;

  gl_FragColor = vec4(color, alpha);
}
`

export function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {},
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  return (
    <mesh material={material}>
      <sphereGeometry args={[GLOBE_RADIUS * 1.08, 64, 64]} />
    </mesh>
  )
}
