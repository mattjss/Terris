import { useMemo, forwardRef } from 'react'
import * as THREE from 'three'
import { GLOBE_RADIUS } from '@/data/historical'

/** Fallback when satellite textures are still loading — minimal grid globe. */
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

#define PI 3.14159265359

void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 v = normalize(vViewDir);

  float lat = asin(clamp(n.y, -1.0, 1.0));
  float lon = atan(n.z, n.x);

  float latSpacing = PI / 12.0;
  float lonSpacing = PI / 12.0;
  float latFrac = abs(fract(lat / latSpacing + 0.5) - 0.5) * 2.0;
  float lonFrac = abs(fract(lon / lonSpacing + 0.5) - 0.5) * 2.0;
  float grid = max(
    1.0 - smoothstep(0.0, 0.025, latFrac),
    1.0 - smoothstep(0.0, 0.025, lonFrac)
  );

  float fineSpacing = PI / 36.0;
  float dLat = fract(lat / fineSpacing + 0.5) - 0.5;
  float dLon = fract(lon / fineSpacing + 0.5) - 0.5;
  float dots = 1.0 - smoothstep(0.10, 0.16, length(vec2(dLat, dLon)));

  float fresnel = pow(1.0 - max(dot(n, v), 0.0), 4.2);

  vec3 lightDir = normalize(vec3(5.2, 2.4, 3.6));
  float ndl = dot(n, lightDir);
  float shade = smoothstep(-0.35, 0.92, ndl);

  vec3 baseColor = vec3(0.012, 0.018, 0.038);
  vec3 gridColor = vec3(0.035, 0.048, 0.068);
  vec3 rimColor  = vec3(0.1, 0.16, 0.24);

  vec3 color = baseColor * mix(0.22, 1.05, shade);
  color += gridColor * grid * 0.22;
  color += gridColor * dots * 0.04;
  color += rimColor * fresnel * 0.36;

  gl_FragColor = vec4(color, 1.0);
}
`

export const EarthProcedural = forwardRef<THREE.Mesh>(function EarthProcedural(_props, ref) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {},
      }),
    [],
  )

  return (
    <mesh ref={ref} material={material}>
      <sphereGeometry args={[GLOBE_RADIUS, 72, 72]} />
    </mesh>
  )
})
