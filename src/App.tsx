import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterChips } from '@/components/ui/FilterChips'
import { TimelineSlider } from '@/components/ui/TimelineSlider'
import { InfoPanel } from '@/components/ui/InfoPanel'
import { RouterSync } from '@/components/UrlSync'
import { useAtlasStore } from '@/store/atlas'

const GlobeCanvas = lazy(() =>
  import('@/components/globe/GlobeCanvas').then((m) => ({
    default: m.GlobeCanvas,
  })),
)

function LoadingScreen() {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-[#050608]"
      role="status"
      aria-label="Loading globe"
    >
      <div className="flex flex-col items-center gap-3 animate-[fadeIn_0.5s_ease-out]">
        <div
          className="w-6 h-6 rounded-full border border-[rgba(79,209,197,0.25)]"
          style={{
            borderTopColor: 'rgba(79,209,197,0.7)',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span className="text-[10px] tracking-widest uppercase text-[--color-text-muted]">
          Loading
        </span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function AtlasShell() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () =>
      useAtlasStore.setState({ reducedMotion: mq.matches })
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050608]">
      <RouterSync />
      <Suspense fallback={<LoadingScreen />}>
        <GlobeCanvas />
      </Suspense>

      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col">
        <header
          className="
          pointer-events-auto flex items-start gap-4 p-4 pb-0
          max-md:flex-col max-md:gap-2 max-md:p-3
        "
        >
          <div className="flex flex-col gap-px shrink-0 pt-0.5">
            <h1 className="text-[13px] font-semibold tracking-[-0.02em] text-[--color-text-primary]">
              Terris
            </h1>
            <p className="text-[9px] text-[--color-text-muted] max-md:hidden">
              Historical Atlas
            </p>
          </div>

          <div className="flex-1 flex justify-center max-md:w-full">
            <SearchBar />
          </div>

          <div className="w-[52px] shrink-0 max-md:hidden" />
        </header>

        <div className="pointer-events-auto px-4 pt-2 max-md:px-3 max-md:pt-1">
          <FilterChips />
        </div>

        <div className="flex-1 min-h-0" />

        <InfoPanel />

        <div className="pointer-events-none">
          <TimelineSlider />
        </div>
      </div>
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
