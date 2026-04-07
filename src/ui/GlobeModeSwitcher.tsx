import { useGlobeVisualModeStore } from '@/state/globeVisualModeStore'
import type { GlobeVisualMode } from '@/state/globeVisualModeStore'
import { useTerrisStore } from '@/state/useTerrisStore'

const GLOBE_STYLE: Record<
  GlobeVisualMode,
  { label: string; description: string }
> = {
  atlas: {
    label: 'Reference',
    description:
      'Neutral documentary lighting on the globe — best for timelines, sources, and focused reading.',
  },
  explorer: {
    label: 'Illustrated',
    description:
      'Softer, warmer globe lighting and sky — easier browsing and a more inviting first visit.',
  },
}

export type GlobeModeSwitcherProps = {
  /** Compact: toggle only — tooltips carry the full hint on hover/long-press. */
  variant?: 'default' | 'compact'
  className?: string
}

export function GlobeModeSwitcher({
  variant = 'default',
  className,
}: GlobeModeSwitcherProps) {
  const mode = useGlobeVisualModeStore((s) => s.mode)
  const setMode = useGlobeVisualModeStore((s) => s.setMode)
  const bumpUserInteraction = useTerrisStore((s) => s.bumpUserInteraction)

  const rootClass = [
    'terris-globe-mode',
    variant === 'compact' ? 'terris-globe-mode--compact' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass} role="group" aria-label="Globe lighting style">
      {variant === 'default' ? (
        <div className="terris-globe-mode__header">
          <span className="terris-globe-mode__eyebrow">Globe</span>
          <span className="terris-globe-mode__title">Lighting</span>
        </div>
      ) : null}
      <div
        className="terris-globe-mode__toggle"
        role="radiogroup"
        aria-label="Reference or illustrated globe lighting"
        aria-describedby={
          variant === 'default' ? 'terris-globe-mode-hint' : undefined
        }
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'atlas'}
          aria-label={`${GLOBE_STYLE.atlas.label}: ${GLOBE_STYLE.atlas.description}`}
          title={GLOBE_STYLE.atlas.description}
          className={
            'terris-globe-mode__btn' + (mode === 'atlas' ? ' terris-globe-mode__btn--active' : '')
          }
          onClick={() => {
            bumpUserInteraction()
            setMode('atlas')
          }}
        >
          {GLOBE_STYLE.atlas.label}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'explorer'}
          aria-label={`${GLOBE_STYLE.explorer.label}: ${GLOBE_STYLE.explorer.description}`}
          title={GLOBE_STYLE.explorer.description}
          className={
            'terris-globe-mode__btn' +
            (mode === 'explorer' ? ' terris-globe-mode__btn--active' : '')
          }
          onClick={() => {
            bumpUserInteraction()
            setMode('explorer')
          }}
        >
          {GLOBE_STYLE.explorer.label}
        </button>
      </div>
      {variant === 'default' ? (
        <p className="terris-globe-mode__hint" id="terris-globe-mode-hint" role="note">
          {GLOBE_STYLE[mode].description}
        </p>
      ) : null}
    </div>
  )
}
