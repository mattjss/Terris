import { useId } from 'react'
import type { ContentDepth } from '@/state/educationalContextTypes'
import { useTerrisStore } from '@/state/useTerrisStore'

const DEPTHS: ContentDepth[] = ['quick', 'standard', 'deep']

/**
 * How much detail appears in the place sheet (tabs and overview length).
 */
export function ContentDepthPicker() {
  const uid = useId()
  const contentDepth = useTerrisStore((s) => s.contentDepth)
  const setContentDepth = useTerrisStore((s) => s.setContentDepth)

  return (
    <div className="terris-depth-picker" role="group" aria-label="Detail level">
      <label htmlFor={`${uid}-depth`} className="terris-depth-picker__label">
        Detail
      </label>
      <select
        id={`${uid}-depth`}
        className="terris-depth-picker__select"
        value={contentDepth}
        onChange={(e) => setContentDepth(e.target.value as ContentDepth)}
      >
        {DEPTHS.map((d) => (
          <option key={d} value={d}>
            {d === 'quick' ? 'Quick' : d === 'standard' ? 'Standard' : 'Deep'}
          </option>
        ))}
      </select>
    </div>
  )
}
