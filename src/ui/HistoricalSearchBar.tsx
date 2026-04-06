import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  filterHistorySuggestions,
  type HistorySearchCategory,
  type HistorySearchSuggestion,
} from '@/data/historySearchMock'
import { useTerrisStore } from '@/state/useTerrisStore'

const CATEGORY_LABEL: Record<HistorySearchCategory, string> = {
  place: 'Place',
  empire: 'Empire',
  event: 'Event',
  architecture: 'Architecture',
  person: 'Person',
  era: 'Era',
}

/**
 * Top-of-shell historical reference search with mocked autocomplete.
 * Wired to `historySearchQuery` in Terris store; selecting a suggestion jumps the timeline.
 */
export function HistoricalSearchBar() {
  const query = useTerrisStore((s) => s.historySearchQuery)
  const setQuery = useTerrisStore((s) => s.setHistorySearchQuery)
  const setYear = useTerrisStore((s) => s.setYear)

  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const uid = useId()
  const inputId = `${uid}-input`
  const listId = `${uid}-list`
  const suggestions = useMemo(() => filterHistorySuggestions(query), [query])

  const showList = open

  const selectSuggestion = useCallback(
    (s: HistorySearchSuggestion) => {
      setYear(s.year)
      setQuery(s.label)
      setOpen(false)
      inputRef.current?.blur()
    },
    [setYear, setQuery],
  )

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => setActiveIndex(0))
    return () => cancelAnimationFrame(id)
  }, [query, open])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showList && e.key === 'ArrowDown') {
        setOpen(true)
        return
      }
      if (!showList) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && suggestions[activeIndex]) {
        e.preventDefault()
        selectSuggestion(suggestions[activeIndex]!)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    },
    [showList, suggestions, activeIndex, selectSuggestion],
  )

  return (
    <div className="terris-hsearch">
      <label htmlFor={inputId} className="terris-label terris-hsearch__label">
        Reference
      </label>
      <div className="terris-hsearch__wrap">
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          placeholder="Places, empires, events, people, architecture, eras…"
          className="terris-hsearch__input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120)
          }}
          onKeyDown={onKeyDown}
        />
        {showList && (
          <ul
            id={listId}
            role="listbox"
            className="terris-hsearch__list"
          >
            {suggestions.length === 0 && query.trim().length > 0 ? (
              <li className="terris-hsearch__empty" role="presentation">
                <span>No references match.</span>
                <span className="terris-hsearch__empty-hint">Try another term or era.</span>
              </li>
            ) : (
              suggestions.map((s, i) => (
                <li key={s.id} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    className={
                      'terris-hsearch__option' +
                      (i === activeIndex ? ' terris-hsearch__option--active' : '')
                    }
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSuggestion(s)}
                  >
                    <span className="terris-hsearch__opt-title">{s.label}</span>
                    <span className="terris-hsearch__opt-meta">
                      <span className="terris-hsearch__opt-cat">{CATEGORY_LABEL[s.category]}</span>
                      <span className="terris-hsearch__opt-sub">{s.subtitle}</span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
