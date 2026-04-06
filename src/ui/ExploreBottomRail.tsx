import { formatYear } from '@/data/historical'
import { useAtlasStore } from '@/store/atlas'
import { useTerrisStore } from '@/state/useTerrisStore'
import { TimeMinimap } from '@/ui/TimeMinimap'
import {
  EXPLORE_UI_MS_SHORT,
  exploreUiTransition,
} from '@/ui/exploreUiMotion'
import { PlanetaryContextShell } from '@/ui/PlanetaryContextShell'
import { useExploreUiPhase } from '@/ui/useExploreUiPhase'

/**
 * Bottom rail: Earth timeline minimap crossfades into a compact planetary context shell.
 * Weights come from `useExploreUiPhase` — no duplicate timeline screens.
 */
export function ExploreBottomRail() {
  const phase = useExploreUiPhase()
  const year = useTerrisStore((s) => s.year)
  const reducedMotion = useAtlasStore((s) => s.reducedMotion)

  const wEarth = phase.earthTimeRailWeight
  const wShell = phase.planetaryBottomShellWeight
  const wChip = phase.bottomChipPlanetaryLabelWeight
  const mode = phase.mode

  const shellVariant: 'planetary' | 'cosmic' =
    mode === 'cosmic' ? 'cosmic' : 'planetary'

  const ease = reducedMotion ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)'
  const dur = reducedMotion ? 120 : 2100
  const tf = `opacity ${dur}ms ${ease}, transform ${dur}ms ${ease}, filter ${dur}ms ${ease}`

  const showEarthMinimap = wEarth > 0.02
  const earthToPlanetary =
    phase.transitionState === 'zooming-out' && mode === 'earth'
  const showChip =
    wChip > 0.02 &&
    (earthToPlanetary || (wEarth > 0.03 && wEarth < 0.96))

  return (
    <div
      className={
        'terris-explore-bottom-rail' +
        (phase.transitionState !== 'idle'
          ? ' terris-explore-bottom-rail--active'
          : '')
      }
    >
      {showEarthMinimap ? (
        <div
          className={
            'terris-explore-bottom-rail__earth' +
            (wChip > 0.2 ? ' terris-explore-bottom-rail__earth--readout-off' : '')
          }
          style={{
            opacity: wEarth,
            transform: `scale(${0.86 + 0.14 * wEarth}) translateY(${(1 - wEarth) * 10}px)`,
            filter: reducedMotion
              ? undefined
              : `blur(${Math.max(0, (1 - wEarth) * 2.5)}px)`,
            transition: tf,
            pointerEvents: wEarth < 0.35 ? 'none' : 'auto',
          }}
          aria-hidden={wEarth < 0.2}
        >
          <TimeMinimap />
        </div>
      ) : null}

      {showChip ? (
        <div
          className="terris-explore-bottom-chip"
          style={{
            opacity: Math.min(1, wChip * 1.15),
            transition: exploreUiTransition('opacity', EXPLORE_UI_MS_SHORT),
          }}
        >
          <span
            className="terris-explore-bottom-chip__line terris-explore-bottom-chip__line--a"
            style={{
              opacity: 1 - wChip,
              transition: exploreUiTransition('opacity'),
            }}
          >
            {formatYear(year)}
          </span>
          <span
            className="terris-explore-bottom-chip__line terris-explore-bottom-chip__line--b"
            style={{
              opacity: wChip,
              transition: exploreUiTransition('opacity'),
            }}
          >
            Planetary view
          </span>
        </div>
      ) : null}

      {wShell > 0.02 ? (
        <div
          className="terris-explore-bottom-rail__shell"
          style={{
            opacity: wShell,
            transform: `translate(-50%, ${(1 - wShell) * 8}px)`,
            transition: tf,
            pointerEvents: wShell < 0.4 ? 'none' : 'auto',
          }}
        >
          <PlanetaryContextShell variant={shellVariant} />
        </div>
      ) : null}
    </div>
  )
}
