import { useId } from 'react'
import type { ContextMode } from '@/state/educationalContextTypes'
import type { ContentDepth } from '@/state/educationalContextTypes'
import { CONTEXT_MODE_PROFILES } from '@/config/contextModeConfig'
import { useTerrisStore } from '@/state/useTerrisStore'

const MODES: ContextMode[] = ['standard', 'teacher', 'family', 'kiosk']
const DEPTHS: ContentDepth[] = ['quick', 'standard', 'deep']

/**
 * Compact controls for product context and reading depth — same shell, reconfigured behavior.
 */
export function ContextModePicker() {
  const uid = useId()
  const contextMode = useTerrisStore((s) => s.contextMode)
  const setContextMode = useTerrisStore((s) => s.setContextMode)
  const contentDepth = useTerrisStore((s) => s.contentDepth)
  const setContentDepth = useTerrisStore((s) => s.setContentDepth)
  const lockedNavigation = useTerrisStore((s) => s.lockedNavigation)

  return (
    <div
      className="terris-context-picker"
      role="group"
      aria-label="Learning context"
    >
      <label htmlFor={`${uid}-mode`} className="terris-context-picker__label">
        Context
      </label>
      <select
        id={`${uid}-mode`}
        className="terris-context-picker__select"
        value={contextMode}
        onChange={(e) => setContextMode(e.target.value as ContextMode)}
      >
        {MODES.map((m) => (
          <option key={m} value={m}>
            {CONTEXT_MODE_PROFILES[m].label}
          </option>
        ))}
      </select>

      <label htmlFor={`${uid}-depth`} className="terris-context-picker__label">
        Depth
      </label>
      <select
        id={`${uid}-depth`}
        className="terris-context-picker__select"
        value={contentDepth}
        onChange={(e) => setContentDepth(e.target.value as ContentDepth)}
      >
        {DEPTHS.map((d) => (
          <option key={d} value={d}>
            {d === 'quick' ? 'Quick' : d === 'standard' ? 'Standard' : 'Deep'}
          </option>
        ))}
      </select>

      {lockedNavigation ? (
        <span className="terris-context-picker__badge" title="Reduced navigation (exhibit mode)">
          Guided
        </span>
      ) : null}
    </div>
  )
}
