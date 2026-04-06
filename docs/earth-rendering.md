# Terris Earth rendering stack

The globe is composed in `GlobeScene.tsx` as a **single hero stack** behind the UI (no UI changes in this layer).

## Scene modules

| Module | File | Role |
|--------|------|------|
| **Lights** | `GlobeLights.tsx` | Ambient + directional + hemisphere + fill; key light direction matches `EARTH_SUN_DIRECTION` in `earthTextureSlots.ts` so terrain shaders and lighting agree. |
| **Earth mesh** | `EarthAtlas.tsx` | Sphere + custom `ShaderMaterial`; loads layered textures (see below). |
| **Cloud shell** | `CloudsLayer.tsx` | Slightly larger sphere, transparency; **Y rotation** updated in `useFrame` independently of camera orbit (`CLOUD_DRIFT_Y`). |
| **Atmosphere** | `Atmosphere.tsx` | Back-side additive shell; limb glow; `uSunDir` for subtle day-side enhancement; opacity from `useExploreScaleStore`. |
| **Starfield** | `StarField.tsx` | Large `points` shell with vertex colors; deterministic placement. |
| **Render / interaction** | `GlobeScene.tsx` | OrbitControls, camera, ray sync, overlays (POIs, coastlines, etc.). |

**Shaders** live in `earthShaders.ts` (vertex + fragment). **Texture URLs and NASA / future asset notes** are in `earthTextureSlots.ts`.

## Texture slots (current vs placeholder)

| Uniform / slot | Maps to | Current source | Notes |
|----------------|---------|----------------|--------|
| `dayMap` | `dayColor` | three.js `earth_atmos_2048.jpg` | Swap for Blue Marble or tiled high-res. |
| `topoMap` | `topography` | **Same file as normal** (placeholder) | Replace with GEBCO bathymetry / DEM grayscale for stronger relief. |
| `normalMap` | `normal` | `earth_normal_2048.jpg` | Micro-relief for lighting. |
| `nightLightsMap` | `nightLights` | `earth_lights_2048.png` | VIIRS / Black Marble in production. |
| `specularMap` | `specularOcean` | `earth_specular_2048.jpg` | Ocean mask + roughness inverse; drives water tint in shader. |
| Clouds (separate mesh) | `clouds` | `earth_clouds_1024.png` | Not a uniform on `EarthAtlas`; own `MeshBasicMaterial`. |

All default URLs are **remote** (three.js examples CDN). For offline or production, mirror files under `public/textures/earth/` and point `EARTH_TEXTURE_URLS` in `earthTextureSlots.ts` at local paths.

## Behaviour tuning

- **Globe spin (camera):** `GLOBE_AUTO_ROTATE_SPEED` in `globeRenderConstants.ts` (used by `OrbitControls` in `GlobeScene.tsx`).
- **Cloud drift:** `CLOUD_SHELL_DRIFT_Y` in `globeRenderConstants.ts` (used by `CloudsLayer.tsx`).
- **Earth tessellation:** `sphereGeometry` segments in `EarthAtlas` (160) — reduce if GPU-bound.

## Fallback

`EarthProcedural` remains the `Suspense` fallback while textures load; it does not use the texture stack.
