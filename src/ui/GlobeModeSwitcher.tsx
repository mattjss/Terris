import { useGlobeVisualModeStore } from '@/state/globeVisualModeStore'
import { useTerrisStore } from '@/state/useTerrisStore'

export function GlobeModeSwitcher() {
  const mode = useGlobeVisualModeStore((s) => s.mode)
  const setMode = useGlobeVisualModeStore((s) => s.setMode)
  const bumpUserInteraction = useTerrisStore((s) => s.bumpUserInteraction)

  return (
    <div className="terris-globe-mode" role="group" aria-label="Globe appearance">
      <div className="terris-globe-mode__header">
        <span className="terris-globe-mode__eyebrow">Globe</span>
        <span className="terris-globe-mode__title">Look</span>
      </div>
      <div
        className="terris-globe-mode__toggle"
        role="radiogroup"
        aria-label="Choose globe look"
        aria-describedby="terris-globe-mode-hint"
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'atlas'}
          className={'terris-globe-mode__btn' + (mode === 'atlas' ? ' terris-globe-mode__btn--active' : '')}
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
            'terris-globe-mode__btn' + (mode === 'explorer' ? ' terris-globe-mode__btn--active' : '')
          }
          onClick={() => {
            bumpUserInteraction()
            setMode('explorer')
          }}
        >
          Explorer
        </button>
      </div>
      <p className="terris-globe-mode__hint" id="terris-globe-mode-hint" role="note">
        {mode === 'atlas'
          ? 'Grounded documentary lighting — best for timelines, sources, and reference.'
          : 'Softer, warmer illustration — inviting for tours, families, and first visits.'}
      </p>
    </div>
  )
}
