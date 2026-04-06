import { useEffect } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { useTerrisStore } from '@/state/useTerrisStore'

/** Centers the search field when opened from the shell button. */
export function SearchOverlay() {
  const searchOpen = useTerrisStore((s) => s.searchOpen)
  const setSearchOpen = useTerrisStore((s) => s.setSearchOpen)

  useEffect(() => {
    if (!searchOpen) return
    const id = requestAnimationFrame(() => {
      document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, setSearchOpen])

  if (!searchOpen) return null

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[40] flex justify-center px-4 pt-20"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
      />
      <div className="relative z-[1] w-full max-w-md">
        <SearchBar />
      </div>
    </div>
  )
}
