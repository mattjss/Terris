import { useGlobeVisualModeStore } from '@/state/globeVisualModeStore'
import { useTerrisStore } from '@/state/useTerrisStore'

export type GlobeModeSwitcherProps = {
  /** Compact: toggle only — full hint lives in Options for a calmer main screen. */
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
    <div className={rootClass} role="group" aria-label="Globe appearance">
      {variant === 'default' ? (
        <div className="terris-globe-mode__header">
          <span className="terris-globe-mode__eyebrow">Globe</span>
          <span className="terris-globe-mode__title">Look</span>
        </div>
      ) : null}
      <div
        className="terris-globe-mode__toggle"
        role="radiogroup"
        aria-label="Choose globe look"
        aria-describedby={
          variant === 'default' ? 'terris-globe-mode-hint' : undefined
        }
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'atlas'}
          className={
            'terris-globe-mode__btn' + (mode === 'atlas' ? ' terris-globe-mode__btn--active' : '')
          }
          onClick={() => {
            bumpUserInteraction()
            setMode('atlas')
          }}
        >
          Atlas
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'explorer'}
          className={
            'terris-globe-mode__btn' +
            (mode === 'explorer' ? ' terris-globe-mode__btn--active' : '')
          }
          onClick={() => {
            bumpUserInteraction()
            setMode('explorer')
          }}
        >
          Explorer
        </button>
      </div>
      {variant === 'default' ? (
        <p className="terris-globe-mode__hint" id="terris-globe-mode-hint" role="note">
          {mode === 'atlas'
            ? 'Grounded documentary lighting — best for timelines, sources, and reference.'
            : 'Softer, warmer illustration — inviting for tours, families, and first visits.'}
        </p>
      ) : null}
    </div>
  )
}
