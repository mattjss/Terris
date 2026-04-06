import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/data/historical'
import { useExploreScaleStore } from '@/state/exploreScaleStore'

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
uniform float uOpacity;
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  float f = 1.0 - abs(dot(normalize(vWorldNormal), normalize(vViewDir)));
  float inner = pow(f, 2.9) * 0.1;
  float outer = pow(f, 5.8) * 0.14;

  vec3 deep = vec3(0.04, 0.08, 0.16);
  vec3 edge = vec3(0.12, 0.2, 0.32);
  vec3 color = mix(deep, edge, clamp(outer * 2.0, 0.0, 1.0));
  float alpha = (inner + outer) * uOpacity;

  gl_FragColor = vec4(color, alpha);
}
`

export function Atmosphere() {
  const opacity = useExploreScaleStore((s) => s.earthAtmosphereOpacity)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uOpacity: { value: 1 },
        },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame(() => {
    material.uniforms.uOpacity.value = opacity
  })

  return (
    <mesh material={material}>
      <sphereGeometry args={[GLOBE_RADIUS * 1.072, 80, 80]} />
    </mesh>
  )
}
