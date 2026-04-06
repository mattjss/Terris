import { TIMELINE_YEAR_MAX, TIMELINE_YEAR_MIN } from '@/ui/Timeline'

/** Re-export domain for consumers that only need era math. */
export { TIMELINE_YEAR_MIN, TIMELINE_YEAR_MAX } from '@/ui/Timeline'

export type TimeEraId =
  | 'prehistory'
  | 'ancient'
  | 'classical'
  | 'medieval'
  | 'early_modern'
  | 'modern'

export type TimeEra = {
  id: TimeEraId
  label: string
  /** Inclusive year bounds on the global Terris timeline. */
  start: number
  end: number
}

/**
 * Major eras for the time minimap. Spans partition [-3000 … 2025] with no gaps.
 * Reserved for future “zoom” into sub-ranges without changing ids.
 */
export const TIME_ERAS: TimeEra[] = [
  { id: 'prehistory', label: 'Prehistory', start: -3000, end: -1200 },
  { id: 'ancient', label: 'Ancient', start: -1199, end: -500 },
  { id: 'classical', label: 'Classical', start: -499, end: 500 },
  { id: 'medieval', label: 'Medieval', start: 501, end: 1500 },
  { id: 'early_modern', label: 'Early Modern', start: 1501, end: 1800 },
  { id: 'modern', label: 'Modern', start: 1801, end: TIMELINE_YEAR_MAX },
]

export function clampYearToTimeline(y: number): number {
  return Math.max(TIMELINE_YEAR_MIN, Math.min(TIMELINE_YEAR_MAX, y))
}

export function yearToTimelineFraction(year: number): number {
  const span = TIMELINE_YEAR_MAX - TIMELINE_YEAR_MIN
  return (clampYearToTimeline(year) - TIMELINE_YEAR_MIN) / span
}

export function timelineFractionToYear(t: number): number {
  const span = TIMELINE_YEAR_MAX - TIMELINE_YEAR_MIN
  return clampYearToTimeline(TIMELINE_YEAR_MIN + t * span)
}

/** Era whose range contains `year` (first match if touching boundaries). */
export function getEraForYear(year: number): TimeEra {
  const y = clampYearToTimeline(year)
  for (const era of TIME_ERAS) {
    if (y >= era.start && y <= era.end) return era
  }
  return TIME_ERAS[TIME_ERAS.length - 1]!
}

/** Midpoint year for jumping when an era chip is clicked. */
export function getEraMidYear(era: TimeEra): number {
  return clampYearToTimeline(Math.round((era.start + era.end) / 2))
}

/** Finer sub-ranges inside a macro era (local minimap view). */
export type TimeSubPeriod = {
  id: string
  macroId: TimeEraId
  label: string
  start: number
  end: number
}

/**
 * Sub-periods partition each macro era without gaps (inclusive bounds, same rules as `TIME_ERAS`).
 * Used only for the local minimap — not for data modeling.
 */
export const TIME_SUB_PERIODS: Record<TimeEraId, TimeSubPeriod[]> = {
  prehistory: [
    { id: 'pre_early', macroId: 'prehistory', label: 'Early', start: -3000, end: -2300 },
    { id: 'pre_mid', macroId: 'prehistory', label: 'Mid', start: -2299, end: -1750 },
    { id: 'pre_late', macroId: 'prehistory', label: 'Late', start: -1749, end: -1200 },
  ],
  ancient: [
    { id: 'anc_early', macroId: 'ancient', label: 'Early', start: -1199, end: -850 },
    { id: 'anc_mid', macroId: 'ancient', label: 'Mid', start: -849, end: -650 },
    { id: 'anc_late', macroId: 'ancient', label: 'Late', start: -649, end: -500 },
  ],
  classical: [
    { id: 'cla_early', macroId: 'classical', label: 'Early', start: -499, end: -100 },
    { id: 'cla_mid', macroId: 'classical', label: 'Mid', start: -99, end: 200 },
    { id: 'cla_late', macroId: 'classical', label: 'Late', start: 201, end: 500 },
  ],
  medieval: [
    { id: 'med_early', macroId: 'medieval', label: 'Early', start: 501, end: 900 },
    { id: 'med_high', macroId: 'medieval', label: 'High', start: 901, end: 1200 },
    { id: 'med_late', macroId: 'medieval', label: 'Late', start: 1201, end: 1500 },
  ],
  early_modern: [
    { id: 'em_early', macroId: 'early_modern', label: 'Early', start: 1501, end: 1600 },
    { id: 'em_mid', macroId: 'early_modern', label: 'Mid', start: 1601, end: 1700 },
    { id: 'em_late', macroId: 'early_modern', label: 'Late', start: 1701, end: 1800 },
  ],
  modern: [
    { id: 'mod_19', macroId: 'modern', label: '19th c.', start: 1801, end: 1900 },
    { id: 'mod_20', macroId: 'modern', label: '20th c.', start: 1901, end: 2000 },
    { id: 'mod_21', macroId: 'modern', label: '21st c.', start: 2001, end: TIMELINE_YEAR_MAX },
  ],
}

export function getMacroEraById(id: TimeEraId): TimeEra | undefined {
  return TIME_ERAS.find((e) => e.id === id)
}

export function getSubPeriodsForMacro(macroId: TimeEraId): TimeSubPeriod[] {
  return TIME_SUB_PERIODS[macroId] ?? []
}

export function getSubPeriodForYearInMacro(
  year: number,
  macroId: TimeEraId,
): TimeSubPeriod | undefined {
  const y = clampYearToTimeline(year)
  return getSubPeriodsForMacro(macroId).find((s) => y >= s.start && y <= s.end)
}

function spanYears(start: number, end: number): number {
  return end - start
}

/** Position of `year` within [macro.start, macro.end], 0…1. */
export function yearToMacroLocalFraction(year: number, macro: TimeEra): number {
  const y = clampYearToTimeline(year)
  const lo = macro.start
  const hi = macro.end
  if (hi <= lo) return 0.5
  return clamp01((y - lo) / (hi - lo))
}

export function macroLocalFractionToYear(t: number, macro: TimeEra): number {
  const lo = macro.start
  const hi = macro.end
  return clampYearToTimeline(lo + t * (hi - lo))
}

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t))
}

export function layoutSubPeriodInMacro(
  sub: TimeSubPeriod,
  macro: TimeEra,
): { leftPct: number; widthPct: number } {
  const denom = spanYears(macro.start, macro.end)
  if (denom <= 0) return { leftPct: 0, widthPct: 100 }
  return {
    leftPct: ((sub.start - macro.start) / denom) * 100,
    widthPct: (spanYears(sub.start, sub.end) / denom) * 100,
  }
}
