import { useEffect, useId, useMemo, useRef } from 'react'
import {
  SEARCH_PLACEHOLDER_COSMIC,
  SEARCH_PLACEHOLDER_EARTH,
  SEARCH_PLACEHOLDER_PLANETARY,
} from '@/data/search/searchPlaceholders'

export type SearchBarProps = {
  /** Called when the user activates the bar (click) or the global shortcut (⌘K / Ctrl+K). */
  onOpen: () => void
  /** Replaces the Earth-scale hint line when set (e.g. family / teacher copy). */
  earthHintOverride?: string
  /** Hide keyboard shortcut hint (e.g. kiosk / locked navigation). */
  hideShortcut?: boolean
  className?: string
  /** Stacked placeholder opacities (sum crossfades; same button, no remount). */
  lineOpacityEarth?: number
  lineOpacityPlanetary?: number
  lineOpacityCosmic?: number
  /** Whole control opacity (e.g. mid-transition dip). */
  barOpacity?: number
}

function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return true
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ||
    navigator.userAgent.includes('Mac')
}

export function SearchBar({
  onOpen,
  earthHintOverride,
  hideShortcut = false,
  className,
  lineOpacityEarth = 1,
  lineOpacityPlanetary = 0,
  lineOpacityCosmic = 0,
  barOpacity = 1,
}: SearchBarProps) {
  const labelId = useId()
  const onOpenRef = useRef(onOpen)
  const shortcutLabel = useMemo(
    () => (isApplePlatform() ? '⌘K' : 'Ctrl+K'),
    [],
  )

  useEffect(() => {
    onOpenRef.current = onOpen
  }, [onOpen])

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target?.closest(
          'input, textarea, select, [contenteditable="true"]',
        )
      ) {
        return
      }
      if (!(e.metaKey || e.ctrlKey)) return
      if (e.key.toLowerCase() !== 'k') return
      e.preventDefault()
      onOpenRef.current()
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <div
      className={['terris-search-bar-wrap', className].filter(Boolean).join(' ')}
      role="search"
      style={{
        opacity: barOpacity,
        transition: 'opacity 2100ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <button
        type="button"
        className="terris-search-bar"
        aria-labelledby={labelId}
        onClick={onOpen}
      >
        <span className="terris-search-bar__icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span id={labelId} className="terris-search-bar__placeholder-stack">
          <span
            className="terris-search-bar__placeholder-line"
            style={{
              opacity: lineOpacityEarth,
              transition: 'opacity 2100ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {earthHintOverride ?? SEARCH_PLACEHOLDER_EARTH}
          </span>
          <span
            className="terris-search-bar__placeholder-line"
            style={{
              opacity: lineOpacityPlanetary,
              transition: 'opacity 2100ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {SEARCH_PLACEHOLDER_PLANETARY}
          </span>
          <span
            className="terris-search-bar__placeholder-line"
            style={{
              opacity: lineOpacityCosmic,
              transition: 'opacity 2100ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {SEARCH_PLACEHOLDER_COSMIC}
          </span>
        </span>
        {hideShortcut ? null : (
          <kbd className="terris-search-bar__kbd" aria-hidden>
            {shortcutLabel}
          </kbd>
        )}
      </button>
    </div>
  )
}
