/**
 * Post-processing *profiles* for Three.js (targets for future EffectComposer work).
 * Today, Explorer’s vignette is approximated in CSS on `.terris-canvas-layer` (see styles).
 */
export type GlobePostProcessingProfile = {
  /** Multiplicative bloom intensity (0 = off). */
  bloomIntensity: number
  /** Edge darkening 0…1 (screen-space vignette). */
  vignetteStrength: number
  /** Global saturation multiplier. */
  saturation: number
}

export const GLOBE_POST_PROCESSING_ATLAS: GlobePostProcessingProfile = {
  bloomIntensity: 0,
  vignetteStrength: 0.04,
  saturation: 1,
}

export const GLOBE_POST_PROCESSING_EXPLORER: GlobePostProcessingProfile = {
  bloomIntensity: 0.06,
  vignetteStrength: 0.12,
  saturation: 1.02,
}
