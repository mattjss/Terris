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

  float fresnel = pow(1.0 - max(dot(n, v), 0.0), 4.0);

  vec3 lightDir = normalize(vec3(5.0, 3.0, 4.0));
  float diffuse = dot(n, lightDir) * 0.5 + 0.5;

  vec3 baseColor = vec3(0.008, 0.01, 0.02);
  vec3 gridColor = vec3(0.04, 0.09, 0.12);
  vec3 rimColor  = vec3(0.08, 0.28, 0.26);

  vec3 color = baseColor * (0.7 + diffuse * 0.6);
  color += gridColor * grid * 0.35;
  color += gridColor * dots * 0.06;
  color += rimColor * fresnel * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
`

export function Earth() {
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
    <mesh material={material}>
      <sphereGeometry args={[GLOBE_RADIUS, 72, 72]} />
    </mesh>
  )
}
