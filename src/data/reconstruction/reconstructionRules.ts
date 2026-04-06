/**
 * Product rules for interpretive reconstructions — encoded for UI and future services.
 * These are not documentary sources; they support learning through clearly labeled illustration.
 */

/** Standard on-image / on-card label — never “AI magic” or “real photo”. */
export const INTERPRETIVE_RECONSTRUCTION_LABEL = 'Interpretive reconstruction'

/** Short museum-style disclosure for banners and empty states. */
export const RECONSTRUCTION_TRUST_BANNER_TITLE = 'Interpretive reconstruction'

export const RECONSTRUCTION_TRUST_BANNER_BODY =
  'These visuals are educational illustrations or model-assisted scenes. They are not primary historical evidence. ' +
  'Compare with documentary media and cited sources. Uncertainty and limits are noted for each item.'

/** Rules mirrored in documentation and UI copy. */
export const RECONSTRUCTION_PRODUCT_RULES = {
  /** AI or modeled reconstructions are never presented as documentary truth. */
  neverImplyDocumentaryTruth: true,
  /** Real photographs, archives, and licensed documentary video take priority in hero and default gallery order. */
  prioritizeDocumentaryMedia: true,
  /** Every generated or assisted still/video uses the standard interpretive label. */
  standardLabel: INTERPRETIVE_RECONSTRUCTION_LABEL,
  /** Each item should explain what it is based on (sources, period, method). */
  requireSourceBasisNote: true,
} as const
