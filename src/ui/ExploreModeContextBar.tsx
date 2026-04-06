import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useTerrisStore } from '@/state/useTerrisStore'

const COPY = {
  earth: { title: 'Earth', subtitle: 'Surface & timeline' },
  planetary: { title: 'Planetary', subtitle: 'Solar neighborhood' },
  cosmic: { title: 'Cosmic', subtitle: 'Galactic context' },
} as const

export function ExploreModeContextBar() {
  const uiMode = useTerrisStore((s) => s.uiMode)
  const mode = useExploreScaleStore((s) => s.mode)
  const transitionState = useExploreScaleStore((s) => s.transitionState)
  const transitionProgress = useExploreScaleStore((s) => s.transitionProgress)

  if (uiMode !== 'globe') return null

  const c = COPY[mode]
  const transitioning = transitionState !== 'idle'
  const calmOpacity = transitioning
    ? 0.88 + 0.12 * transitionProgress
    : 1

  return (
    <div
      className={
        'terris-explore-mode' +
        (transitioning ? ' terris-explore-mode--transitioning' : '')
      }
      style={{
        opacity: calmOpacity,
        transition: 'opacity 2100ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div className="terris-explore-mode__eyebrow">Scale</div>
      <div className="terris-explore-mode__title">{c.title}</div>
      <div className="terris-explore-mode__subtitle">{c.subtitle}</div>
      {transitioning ? (
        <div className="terris-explore-mode__hint" aria-live="polite">
          {transitionState === 'zooming-out' ? 'Pulling back' : 'Moving in'}
        </div>
      ) : null}
    </div>
  )
}
