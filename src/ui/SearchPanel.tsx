import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button } from '@base-ui/react/button'
import { Dialog } from '@base-ui/react/dialog'
import { SEARCH_STARTER_PROMPTS, TERRIS_UNIFIED_SEARCH_PLACEHOLDER } from '@/config/terrisPresentationConfig'
import {
  groupSearchResultsByType,
  searchTerrisEntitiesUnified,
} from '@/data/search/searchTerris'
import { useExploreScaleStore } from '@/state/exploreScaleStore'
import { useTerrisStore } from '@/state/useTerrisStore'
import type { TerrisEntity } from '@/data/types/terrisEntity'

function useModKeyLabel(): string {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return '⌘K'
    return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K'
  }, [])
}

export function SearchPanel() {
  const searchOpen = useTerrisStore((s) => s.searchOpen)
  const setSearchOpen = useTerrisStore((s) => s.setSearchOpen)
  const searchQuery = useTerrisStore((s) => s.searchQuery)
  const setSearchQuery = useTerrisStore((s) => s.setSearchQuery)
  const beginJourneyToEntity = useTerrisStore((s) => s.beginJourneyToEntity)
  const setSearchResults = useTerrisStore((s) => s.setSearchResults)
  const setSelectedSearchResultId = useTerrisStore((s) => s.setSelectedSearchResultId)
  const bumpUserInteraction = useTerrisStore((s) => s.bumpUserInteraction)
  const setExploreMode = useExploreScaleStore((s) => s.setMode)

  const inputRef = useRef<HTMLInputElement>(null)
  const modHint = useModKeyLabel()

  const grouped = useMemo(
    () => groupSearchResultsByType(searchTerrisEntitiesUnified(searchQuery)),
    [searchQuery],
  )

  useEffect(() => {
    const flat = grouped.flatMap((g) => g.items)
    setSearchResults(flat)
  }, [grouped, setSearchResults])

  const onPickEntity = useCallback(
    (entity: TerrisEntity) => {
      setSelectedSearchResultId(entity.id)
      setExploreMode(entity.mode)
      beginJourneyToEntity(entity)
      setSearchOpen(false)
      setSearchQuery('')
    },
    [
      beginJourneyToEntity,
      setExploreMode,
      setSearchOpen,
      setSearchQuery,
      setSelectedSearchResultId,
    ],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const s = useTerrisStore.getState()
        s.setSearchOpen(!s.searchOpen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    bumpUserInteraction()
    const id = requestAnimationFrame(() => {
      setSearchQuery('')
      inputRef.current?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [searchOpen, setSearchQuery, bumpUserInteraction])

  const hasAny = grouped.some((g) => g.items.length > 0)
  const queryTrimmed = searchQuery.trim()
  const showStarters = !queryTrimmed

  const applyStarter = useCallback(
    (q: string) => {
      setSearchQuery(q)
      inputRef.current?.focus()
    },
    [setSearchQuery],
  )

  return (
    <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="terris-search-dialog-backdrop" />
        <Dialog.Viewport className="terris-search-dialog-viewport">
          <Dialog.Popup className="terris-search-panel" initialFocus={inputRef}>
            <Dialog.Title className="sr-only">Terris search</Dialog.Title>
            <div className="terris-search-panel__head">
              <span className="terris-search-panel__hint" aria-hidden>
                {modHint}
              </span>
              <Button
                type="button"
                className="terris-search-panel__close"
                onClick={() => setSearchOpen(false)}
              >
                Close
              </Button>
            </div>

            <input
              ref={inputRef}
              type="search"
              className="terris-search-panel__input"
              placeholder={TERRIS_UNIFIED_SEARCH_PLACEHOLDER}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />

            <div className="terris-search-panel__body">
              {showStarters ? (
                <div className="terris-search-panel__starters" role="region" aria-label="Suggestions">
                  <p className="terris-search-panel__starters-lede">Start with a topic or place</p>
                  <ul className="terris-search-panel__chips">
                    {SEARCH_STARTER_PROMPTS.map((p) => (
                      <li key={p.label}>
                        <button
                          type="button"
                          className="terris-search-chip"
                          onClick={() => applyStarter(p.query)}
                        >
                          {p.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : !hasAny ? (
                <div
                  className="terris-search-panel__empty-state terris-empty-state"
                  role="status"
                >
                  <p className="terris-search-panel__empty-title">
                    No matches for “{queryTrimmed}”
                  </p>
                  <p className="terris-search-panel__empty-hint">
                    Try a shorter phrase or another spelling. Search looks across places, people, and
                    worlds in the catalog.
                  </p>
                </div>
              ) : (
                <>
                  {grouped.map(
                    (group) =>
                      group.items.length > 0 ? (
                        <section key={group.type} className="terris-search-panel__section">
                          <h3 className="terris-search-panel__section-title">{group.label}</h3>
                          <ul className="terris-search-panel__list">
                            {group.items.map((item) => (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  className="terris-search-panel__row"
                                  onClick={() => onPickEntity(item)}
                                >
                                  <span className="terris-search-panel__title">{item.name}</span>
                                  <span className="terris-search-panel__detail">{item.summary}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ) : null,
                  )}
                </>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
