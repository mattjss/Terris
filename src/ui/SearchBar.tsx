import { useEffect, useId, useMemo, useRef } from 'react'
import { TERRIS_UNIFIED_SEARCH_PLACEHOLDER } from '@/config/terrisPresentationConfig'

export type SearchBarProps = {
  /** Called when the user activates the bar (click) or the global shortcut (⌘K / Ctrl+K). */
  onOpen: () => void
  /** Overrides unified placeholder copy. */
  placeholder?: string
  /** Hide keyboard shortcut hint. */
  hideShortcut?: boolean
  className?: string
  /** Whole control opacity (e.g. mid-transition dip). */
  barOpacity?: number
  /**
   * @deprecated Single-field search — stacked placeholders removed. Ignored.
   */
  earthHintOverride?: string
  lineOpacityEarth?: number
  lineOpacityPlanetary?: number
  lineOpacityCosmic?: number
}

function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return true
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ||
    navigator.userAgent.includes('Mac')
}

export function SearchBar({
  onOpen,
  placeholder = TERRIS_UNIFIED_SEARCH_PLACEHOLDER,
  hideShortcut = false,
  className,
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
        transition:
          'opacity var(--terris-motion-ms-overlay) var(--terris-motion-ease-out)',
      }}
    >
      <button
        type="button"
        className="terris-search-bar"
        aria-labelledby={labelId}
        onClick={onOpen}
      >
        <span className="terris-search-bar__icon" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span id={labelId} className="terris-search-bar__placeholder">
          {placeholder}
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
