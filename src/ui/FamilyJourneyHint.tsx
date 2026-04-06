import { CONTEXT_MODE_PROFILES } from '@/config/contextModeConfig'
import { useTerrisStore } from '@/state/useTerrisStore'

/** Short suggested journey — family context only. */
export function FamilyJourneyHint() {
  const contextMode = useTerrisStore((s) => s.contextMode)
  if (contextMode !== 'family') return null

  const teaser = CONTEXT_MODE_PROFILES.family.familyJourneyTeaser
  if (!teaser) return null

  return (
    <div className="terris-family-hint" role="note">
      <span className="terris-family-hint__label">Suggested journey</span>
      <p className="terris-family-hint__text">{teaser}</p>
    </div>
  )
}
