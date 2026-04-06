import { useMemo, useRef, useEffect, useCallback } from 'react'
import { entities, formatYear, getTypeColor } from '@/data/historical'
import { useAtlasStore } from '@/store/atlas'

const MAX_RESULTS = 7

export function SearchBar() {
  const { searchQuery, searchOpen, setSearchQuery, setSearchOpen, setSelected } = useAtlasStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return entities
      .filter((e) => e.name.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS)
  }, [searchQuery])

  const handleSelect = useCallback(
    (id: string) => {
      setSelected(id)
      inputRef.current?.blur()
    },
    [setSelected],
  )

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        setSearchOpen(true)
        inputRef.current?.focus()
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchQuery('')
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [searchOpen, setSearchOpen, setSearchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen, setSearchOpen])

  return (
    <div ref={containerRef} className="relative w-full max-w-[320px] max-md:max-w-none">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors duration-150"
        style={{
          background: searchOpen ? 'rgba(8,10,16,0.8)' : 'rgba(8,10,16,0.5)',
          backdropFilter: 'blur(20px)',
          borderColor: searchOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-25">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (!searchOpen) setSearchOpen(true)
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search places, empires, landmarks..."
          aria-label="Search historical entities"
          className="
            w-full bg-transparent border-none outline-none
            text-[11px] text-[--color-text-primary]
            placeholder:text-[rgba(255,255,255,0.18)]
          "
        />
        {!searchOpen && (
          <kbd className="shrink-0 text-[9px] text-[--color-text-muted] border border-[rgba(255,255,255,0.06)] rounded px-1 py-px">
            /
          </kbd>
        )}
      </div>

      {searchOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50 animate-[fadeSlideUp_0.15s_ease-out]"
          style={{
            background: 'rgba(8,10,16,0.92)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
          role="listbox"
          aria-label="Search results"
        >
          {results.map((entity) => (
            <button
              key={entity.id}
              onClick={() => handleSelect(entity.id)}
              role="option"
              className="
                w-full flex items-center gap-2.5 px-3 py-2
                text-left transition-colors duration-100
                hover:bg-surface-hover cursor-pointer
              "
            >
              <span
                className="shrink-0 w-[6px] h-[6px] rounded-full"
                style={{ background: getTypeColor(entity.type) }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-[--color-text-primary] truncate">
                  {entity.name}
                </p>
                <p className="text-[9px] text-[--color-text-muted] truncate">
                  {entity.type === 'trade-route' ? 'Trade Route' : entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                  {' · '}
                  {entity.yearStart === entity.yearEnd
                    ? formatYear(entity.yearStart)
                    : `${formatYear(entity.yearStart)} – ${formatYear(entity.yearEnd)}`}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {searchOpen && searchQuery.trim() && results.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50"
          style={{
            background: 'rgba(8,10,16,0.92)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="px-3 py-3 text-[10px] text-[--color-text-muted] text-center">
            No results found
          </p>
        </div>
      )}
    </div>
  )
}
