/**
 * GLSL for the layered Earth mesh — day / topo / night / ocean spec / normal detail.
 * Explorer adds Fresnel rim, softer read, and subtle ocean shimmer (time-driven).
 */

export const earthVertexShader = /* glsl */ `
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

export const earthFragmentShader = /* glsl */ `
uniform sampler2D dayMap;
uniform sampler2D topoMap;
uniform sampler2D normalMap;
uniform sampler2D nightLightsMap;
uniform sampler2D specularMap;
uniform vec3 sunDirection;
uniform float uExplorerBlend;
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 sun = normalize(sunDirection);
  float ndl = dot(n, sun);

  float dayMix = smoothstep(-0.36, 0.4, ndl);
  float twilight = (1.0 - dayMix) * smoothstep(-0.55, -0.1, ndl);

  vec3 dayCol = texture2D(dayMap, vUv).rgb;
  vec3 topo = texture2D(topoMap, vUv).rgb;
  float topoL = dot(topo, vec3(0.299, 0.587, 0.114));
  vec3 land = dayCol * (1.0 + 0.1 * (topoL - 0.5));

  vec3 nm = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
  float ndlFine = ndl + 0.06 * (nm.x + nm.y);
  float shade = smoothstep(-0.32, 0.42, ndlFine);
  land *= 0.9 + 0.1 * shade;

  float specMask = texture2D(specularMap, vUv).r;
  float ocean = smoothstep(0.2, 0.92, specMask);
  vec3 deep = vec3(0.012, 0.038, 0.08);
  vec3 shallow = vec3(0.035, 0.1, 0.16);
  vec3 water = mix(deep, shallow, topoL);
  vec3 albedo = mix(land, water * (0.75 + 0.25 * dayCol), ocean * 0.88);

  vec3 lights = texture2D(nightLightsMap, vUv).rgb;
  vec3 nightAmb = albedo * 0.055 + vec3(0.005, 0.01, 0.028);
  vec3 night = nightAmb + lights * 2.05 * (1.0 - dayMix);

  vec3 color = mix(night, albedo, dayMix);
  color = mix(color, color * vec3(0.9, 0.95, 1.06) + vec3(0.008, 0.015, 0.028), twilight * 0.4);

  vec3 vV = normalize(vViewDir);
  vec3 rv = reflect(-sun, n);
  float specPow = mix(14.0, 56.0, ocean);
  float specAmt = mix(specMask * 0.22, specMask, ocean);
  float spec = pow(max(dot(rv, vV), 0.0), specPow) * specAmt * dayMix;
  color += spec * vec3(0.26, 0.34, 0.42);

  float ex = clamp(uExplorerBlend, 0.0, 1.0);

  /* Softer, more illustrated land/ocean in Explorer — less micro-contrast. */
  color = mix(color, mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), 0.22), ex * 0.35);
  float fresnel = pow(1.0 - max(dot(n, vV), 0.0), 3.1);
  vec3 rimCol = vec3(0.52, 0.42, 0.68);
  color += rimCol * fresnel * ex * 0.42 * (0.35 + 0.65 * dayMix);

  /* Subtle ocean shimmer — magical, not noisy. */
  if (ocean > 0.45) {
    float sh = sin(uTime * 1.15 + vUv.x * 38.0 + vUv.y * 26.0) * 0.5 + 0.5;
    sh += sin(uTime * 0.85 - vUv.x * 22.0) * 0.15;
    color += vec3(0.045, 0.09, 0.14) * sh * dayMix * ocean * ex * 0.2;
  }

  vec3 warmLift = vec3(0.04, 0.03, 0.02);
  color = mix(color, color * vec3(1.04, 1.06, 1.1) + warmLift * 0.25, ex * 0.45);
  color = pow(max(color, vec3(0.001)), mix(vec3(1.0), vec3(0.92), ex * 0.22));

  gl_FragColor = vec4(color, 1.0);
}
`
