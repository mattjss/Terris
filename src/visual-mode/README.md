# Terris visual modes (Atlas & Explorer)

One product shell, one Three.js scene, two **educational lenses**. Modes affect **globe rendering** (materials, lights, atmosphere, clouds, stars, orbit feel) and **UI tokens** (surfaces, borders, focus, floating chips) via `terris-app--globe-visual-*` on the app root.

## File map

| Path | Role |
|------|------|
| `src/state/globeVisualModeStore.ts` | Persisted mode (`atlas` \| `explorer`), `setMode` |
| `src/state/globeVisualBlendRef.ts` | Animated 0…1 blend (no React re-renders per frame) |
| `src/components/globe/globeVisualPresets.ts` | `getGlobeVisualSnapshot(t)` — scene lerp |
| `src/components/globe/GlobeVisualBlendDriver.tsx` | Smooths blend toward store mode |
| `src/components/globe/GlobeBackground.tsx`, `GlobeOrbitVisualTuning.tsx` | Scene + controls follow snapshot |
| `src/ui/GlobeModeSwitcher.tsx` | Mode switcher UI |
| `src/ui/terris-design-tokens.css` | `:root` = Atlas defaults; Explorer overrides under `.terris-app--globe-visual-explorer` |
| `src/visual-mode/postProcessingProfile.ts` | Numeric targets for future GPU post |

## Atlas Mode (documentary)

- **Color**: Deep navy space `#070a10`, cool atmosphere limb, neutral stars.
- **Lighting**: Crisp neutral key, cool fill, restrained hemisphere.
- **Earth**: Baseline satellite shading; shader `uExplorerBlend` → 0.
- **Clouds**: ~42% opacity, base drift.
- **Markers**: Neutral gray / white POIs; historical colors preserved.
- **UI**: Default tokens — warm slate glass, ivory text, teal accents.
- **Camera**: Tighter damping, slightly slower idle spin.
- **Post (target)**: Minimal bloom, very light vignette.

## Explorer Mode (cozy illustration)

- **Color**: Warmer void `#1a1f2e`, lavender-leaning atmosphere edge.
- **Skydome**: Multicolor gradient (`GlobeExplorerSky`) + `scene.background` cleared when blend > ~0.06.
- **Lighting**: Warmer key, stronger rim; additive atmosphere uses `atmosphereGlowMul` + Explorer limb boost.
- **Earth**: Fresnel rim, illustrated desaturation mix, ocean shimmer (`uTime`), warmer lift + gamma in shader.
- **Clouds**: Slightly more opaque, faster drift.
- **Markers**: Warmer dim/bright; selected POI scales up further in Explorer (arrival moment).
- **Travel craft**: `TravelCraft` — minimal cone + emissive ring parented to camera (Earth, Explorer).
- **Camera**: `THREE.MathUtils.damp` toward focus targets (`cameraDampLambda` lower in Explorer = silkier glide).
- **UI**: Plum-tinted glass, peach-leaning borders, softer focus ring.
- **Post (target)**: Subtle bloom + vignette (CSS vignette on canvas today).

## Coherence

- Same routes, panels, search, timeline — **only CSS variables and globe uniforms** change.
- Mode is **not** a second app: no duplicated layout trees.
