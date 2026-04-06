import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button } from '@base-ui/react/button'
import { Dialog } from '@base-ui/react/dialog'
import { groupSearchResultsByType, searchTerrisEntities } from '@/data/search/searchTerris'
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
  const searchMode = useTerrisStore((s) => s.searchMode)
  const searchPlaceholder = useTerrisStore((s) => s.searchPlaceholder)
  const searchQuery = useTerrisStore((s) => s.searchQuery)
  const setSearchQuery = useTerrisStore((s) => s.setSearchQuery)
  const enterPlaceDetail = useTerrisStore((s) => s.enterPlaceDetail)
  const setSearchResults = useTerrisStore((s) => s.setSearchResults)
  const setSelectedSearchResultId = useTerrisStore((s) => s.setSelectedSearchResultId)
  const bumpUserInteraction = useTerrisStore((s) => s.bumpUserInteraction)

  const inputRef = useRef<HTMLInputElement>(null)
  const modHint = useModKeyLabel()

  const grouped = useMemo(
    () => groupSearchResultsByType(searchTerrisEntities(searchMode, searchQuery)),
    [searchMode, searchQuery],
  )

  useEffect(() => {
    const flat = grouped.flatMap((g) => g.items)
    setSearchResults(flat)
  }, [grouped, setSearchResults])

  const onPickEntity = useCallback(
    (entity: TerrisEntity) => {
      setSelectedSearchResultId(entity.id)
      enterPlaceDetail(entity)
      setSearchOpen(false)
      setSearchQuery('')
    },
    [enterPlaceDetail, setSearchOpen, setSearchQuery, setSelectedSearchResultId],
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

  return (
    <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="terris-search-dialog-backdrop" />
        <Dialog.Viewport className="terris-search-dialog-viewport">
          <Dialog.Popup className="terris-search-panel" initialFocus={inputRef}>
            <Dialog.Title className="sr-only">Terris search</Dialog.Title>
            <div className="terris-search-panel__head">
              <span className="terris-search-panel__hint">{modHint}</span>
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
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />

            <div className="terris-search-panel__body">
              {!hasAny ? (
                queryTrimmed ? (
                  <div
                    className="terris-search-panel__empty-state terris-empty-state"
                    role="status"
                  >
                    <p className="terris-search-panel__empty-title">
                      No matches for “{queryTrimmed}”
                    </p>
                    <p className="terris-search-panel__empty-hint">
                      Try a shorter phrase, check spelling, or change explore mode if the place lives
                      on another world or scale.
                    </p>
                    <p className="terris-search-panel__empty-kicker">Examples</p>
                    <p className="terris-search-panel__empty-examples">
                      Rome · Mars · Great Pyramid · Apollo 11
                    </p>
                  </div>
                ) : (
                  <div
                    className="terris-search-panel__empty-state terris-empty-state"
                    role="status"
                  >
                    <p className="terris-search-panel__empty-title">Nothing to list in this mode</p>
                    <p className="terris-search-panel__empty-hint">
                      The catalog is empty for where you are exploring. Switch mode or try again
                      after data loads.
                    </p>
                  </div>
                )
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
