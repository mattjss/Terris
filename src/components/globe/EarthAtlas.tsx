import { useMemo, forwardRef, useLayoutEffect } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/data/historical'
import { EARTH_SUN_DIRECTION, EARTH_TEXTURE_URLS } from './earthTextureConfig'

const vertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  vUv = uv;
  vec4 wn = modelMatrix * vec4(normal, 0.0);
  vWorldNormal = normalize(wn.xyz);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform sampler2D dayMap;
uniform sampler2D nightLightsMap;
uniform sampler2D specularMap;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 sun = normalize(sunDirection);
  float ndl = dot(n, sun);
  float dayMix = smoothstep(-0.24, 0.34, ndl);

  vec3 day = texture2D(dayMap, vUv).rgb;
  vec3 lights = texture2D(nightLightsMap, vUv).rgb;
  vec3 nightAmb = day * 0.08 + vec3(0.008, 0.016, 0.04);
  vec3 night = nightAmb + lights * 2.4 * (1.0 - dayMix);

  vec3 color = mix(night, day, dayMix);

  float specMask = texture2D(specularMap, vUv).r;
  vec3 r = reflect(-sun, n);
  float spec = pow(max(dot(r, normalize(vViewDir)), 0.0), 18.0) * specMask * dayMix;
  color += spec * vec3(0.32, 0.4, 0.48);

  gl_FragColor = vec4(color, 1.0);
}
`

export const EarthAtlas = forwardRef<THREE.Mesh>(function EarthAtlas(_props, ref) {
  const [dayMap, nightLightsMap, specularMap] = useTexture([
    EARTH_TEXTURE_URLS.dayColor,
    EARTH_TEXTURE_URLS.nightLights,
    EARTH_TEXTURE_URLS.specular,
  ])

  useLayoutEffect(() => {
    /* eslint-disable react-hooks/immutability -- Three.js Texture objects are configured in-place after load */
    for (const t of [dayMap, nightLightsMap, specularMap]) {
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
      t.anisotropy = 8
    }
    dayMap.colorSpace = THREE.SRGBColorSpace
    nightLightsMap.colorSpace = THREE.SRGBColorSpace
    specularMap.colorSpace = THREE.LinearSRGBColorSpace
    /* eslint-enable react-hooks/immutability */
  }, [dayMap, nightLightsMap, specularMap])

  const sunDir = useMemo(
    () =>
      new THREE.Vector3(EARTH_SUN_DIRECTION.x, EARTH_SUN_DIRECTION.y, EARTH_SUN_DIRECTION.z).normalize(),
    [],
  )

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        dayMap: { value: dayMap },
        nightLightsMap: { value: nightLightsMap },
        specularMap: { value: specularMap },
        sunDirection: { value: sunDir.clone() },
      },
    })
  }, [dayMap, nightLightsMap, specularMap, sunDir])

  return (
    <mesh ref={ref} material={material}>
      <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
    </mesh>
  )
})
