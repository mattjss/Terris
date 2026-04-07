import { useCallback, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { GlobeCanvas } from '@/components/globe/GlobeCanvas'
import { RouterSync } from '@/components/UrlSync'
import { SearchPanel } from '@/ui/SearchPanel'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useAtlasStore } from '@/store/atlas'
import { useTerrisStore } from '@/state/useTerrisStore'
import { useYearKeyboard } from '@/hooks/useYearKeyboard'
import { TIMELINE_YEAR_MAX, TIMELINE_YEAR_MIN } from '@/ui/Timeline'
import { ExploreBottomRail } from '@/ui/ExploreBottomRail'
import { SearchBar } from '@/ui/SearchBar'
import { PlaceSheet } from '@/ui/PlaceSheet'
import { LayerDock } from '@/ui/LayerDock'
import { PlanetaryObjectSheetPlaceholder } from '@/ui/PlanetaryObjectSheetPlaceholder'
import { useExploreUiPhase } from '@/ui/useExploreUiPhase'
import { findTerrisPoiById } from '@/data/terrisPoi'
import { getMockEntityById, hydrateTerrisEntity } from '@/data/services/entityService'
import type { TerrisEntity } from '@/data/types/terrisEntity'
import { resolveTerrisEntityForPoi } from '@/ui/terrisPoiToTerrisEntity'
import { TerrisOptionsMenu } from '@/ui/TerrisOptionsMenu'
import { useEnrichedEntity } from '@/hooks/useEnrichedEntity'
import { createLearningJournalPersistence } from '@/persistence/createLearningJournalPersistence'
import { useLearningJournalStore } from '@/state/useLearningJournalStore'
import { hydrateGlobeVisualBlendRef } from '@/state/globeVisualModeStore'
import { useGlobeVisualModeStore } from '@/state/globeVisualModeStore'
import { LearningJournalSync } from '@/ui/LearningJournalSync'
import './styles.css'

function jumpYearForEntity(entity: TerrisEntity): number {
  const ys = entity.startYear ?? TIMELINE_YEAR_MIN
  const ye = entity.endYear ?? entity.startYear ?? ys
  const mid = Math.round((ys + ye) / 2)
  return Math.max(TIMELINE_YEAR_MIN, Math.min(TIMELINE_YEAR_MAX, mid))
}

function AtlasShell() {
  useYearKeyboard()

  const journalHydratedRef = useRef(false)
  useEffect(() => {
    if (journalHydratedRef.current) return
    journalHydratedRef.current = true
    const { adapter, persistenceAvailable } = createLearningJournalPersistence()
    useLearningJournalStore.getState().hydrate(adapter, persistenceAvailable)
  }, [])

  useEffect(() => {
    hydrateGlobeVisualBlendRef()
  }, [])

  const explorePhase = useExploreUiPhase()
  const exploreMode = useExploreScaleStore((s) => s.mode)

  const year = useTerrisStore((s) => s.year)
  const setYear = useTerrisStore((s) => s.setYear)
  const setSearchOpen = useTerrisStore((s) => s.setSearchOpen)
  const selectedEntity = useTerrisStore((s) => s.selectedEntity)
  const { entity: placeSheetEntity } = useEnrichedEntity(selectedEntity)
  const enterPlaceDetail = useTerrisStore((s) => s.enterPlaceDetail)
  const uiMode = useTerrisStore((s) => s.uiMode)
  const exitPlaceDetail = useTerrisStore((s) => s.exitPlaceDetail)
  const requestGlobeFocus = useTerrisStore((s) => s.requestGlobeFocus)
  const setSearchMode = useTerrisStore((s) => s.setSearchMode)
  const bumpUserInteraction = useTerrisStore((s) => s.bumpUserInteraction)
  const globeVisualMode = useGlobeVisualModeStore((s) => s.mode)

  const setAtlasYear = useAtlasStore((s) => s.setYear)

  const setExploreMode = useExploreScaleStore((s) => s.setMode)

  const onOpenRelatedEntity = useCallback(
    async (entityId: string) => {
      const fromCatalog = getMockEntityById(entityId)
      if (fromCatalog) {
        setExploreMode(fromCatalog.mode)
        enterPlaceDetail(fromCatalog)
        return
      }
      if (entityId.startsWith('Q')) {
        try {
          const live = await hydrateTerrisEntity(entityId)
          setExploreMode(live.mode)
          enterPlaceDetail(live)
          return
        } catch {
          /* Wikidata/Wikipedia unavailable — fall through */
        }
      }
      const poi = findTerrisPoiById(entityId)
      if (poi) {
        const resolved = resolveTerrisEntityForPoi(poi)
        setExploreMode(resolved.mode)
        enterPlaceDetail(resolved)
      }
    },
    [enterPlaceDetail, setExploreMode],
  )

  useEffect(() => {
    setSearchMode(exploreMode)
  }, [exploreMode, setSearchMode])

  useEffect(() => {
    const clamped = Math.max(
      TIMELINE_YEAR_MIN,
      Math.min(TIMELINE_YEAR_MAX, year),
    )
    if (useAtlasStore.getState().currentYear !== clamped) {
      setAtlasYear(clamped)
    }
  }, [year, setAtlasYear])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () =>
      useAtlasStore.setState({ reducedMotion: mq.matches })
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!selectedEntity) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitPlaceDetail()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedEntity, exitPlaceDetail])

  const onClosePlace = useCallback(() => {
    exitPlaceDetail()
  }, [exitPlaceDetail])

  const onFocusGlobe = useCallback(() => {
    const e = placeSheetEntity ?? selectedEntity
    if (!e?.coords) return
    requestGlobeFocus(e.coords.lat, e.coords.lon)
  }, [placeSheetEntity, selectedEntity, requestGlobeFocus])

  const onJumpToEra = useCallback(() => {
    const e = placeSheetEntity ?? selectedEntity
    if (!e) return
    setYear(jumpYearForEntity(e))
  }, [placeSheetEntity, selectedEntity, setYear])

  useEffect(() => {
    if (uiMode !== 'globe') return
    if (!selectedEntity) return
    if (!explorePhase.shouldDismissEarthPlaceSheet) return
    const t = window.setTimeout(() => {
      exitPlaceDetail()
    }, 440)
    return () => window.clearTimeout(t)
  }, [
    explorePhase.shouldDismissEarthPlaceSheet,
    selectedEntity,
    uiMode,
    exitPlaceDetail,
  ])

  const appShellClass = [
    'terris-app',
    uiMode === 'place_detail' ? 'terris-app--place-detail' : '',
    `terris-app--globe-visual-${globeVisualMode}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={appShellClass}
      onPointerDownCapture={() => bumpUserInteraction()}
    >
      <RouterSync />
      <LearningJournalSync />

      <div className="terris-canvas-layer" aria-hidden>
        <GlobeCanvas />
      </div>

      <div className="terris-ui">
        <div className="terris-shell">
          <header className="terris-top-bar">
            <div className="terris-top-bar__left">
              <span className="terris-brand-mark">TERRIS</span>
            </div>
            <div className="terris-top-bar__right">
              <TerrisOptionsMenu />
            </div>
          </header>

          <div className="terris-search-float">
            <div className="terris-search-column">
              <SearchBar
                onOpen={() => setSearchOpen(true)}
                hideShortcut={false}
                barOpacity={explorePhase.searchBarOpacity}
              />
            </div>
          </div>

          <div className="terris-layerdock-slot">
            <LayerDock
              earthLayerOpacity={explorePhase.layerEarthOpacity}
              planetaryLayerOpacity={explorePhase.layerPlanetaryOpacity}
            />
          </div>

          <div className="terris-bottom-rail">
            <ExploreBottomRail />
          </div>

          <div className="terris-placesheet-slot">
            {uiMode === 'place_detail' && selectedEntity ? (
              <div
                key={selectedEntity.id}
                className={
                  'terris-place-sheet-frame' +
                  (explorePhase.shouldDismissEarthPlaceSheet
                    ? ' terris-place-sheet-frame--dismissing'
                    : '')
                }
              >
                <PlaceSheet
                  entity={placeSheetEntity}
                  onClose={onClosePlace}
                  onFocusGlobe={
                    (placeSheetEntity ?? selectedEntity)?.coords
                      ? onFocusGlobe
                      : undefined
                  }
                  onJumpToEra={onJumpToEra}
                  onOpenRelatedEntity={onOpenRelatedEntity}
                />
              </div>
            ) : exploreMode !== 'earth' && uiMode === 'globe' ? (
              <PlanetaryObjectSheetPlaceholder />
            ) : null}
          </div>
        </div>
      </div>

      <SearchPanel />

    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AtlasShell />} />
      <Route path="/year/:year" element={<AtlasShell />} />
      <Route path="/entity/:entityId" element={<AtlasShell />} />
    </Routes>
  )
}
