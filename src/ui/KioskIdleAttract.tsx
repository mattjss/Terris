import { useEffect, useState } from 'react'
import { useTerrisStore } from '@/state/useTerrisStore'

const IDLE_MS = 90_000

/**
 * Exhibit idle state — gentle attract layer; any interaction clears it via store clock.
 */
export function KioskIdleAttract() {
  const contextMode = useTerrisStore((s) => s.contextMode)
  const lastAt = useTerrisStore((s) => s.lastUserInteractionAt)
  const bumpUserInteraction = useTerrisStore((s) => s.bumpUserInteraction)

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (contextMode !== 'kiosk') return
    const id = window.setInterval(() => setNow(Date.now()), 4000)
    return () => window.clearInterval(id)
  }, [contextMode])

  if (contextMode !== 'kiosk') return null

  const idle = now - lastAt > IDLE_MS
  if (!idle) return null

  return (
    <button
      type="button"
      className="terris-kiosk-attract"
      onClick={() => bumpUserInteraction()}
      aria-label="Continue exploring Terris"
    >
      <div className="terris-kiosk-attract__inner">
        <span className="terris-kiosk-attract__title">Terris</span>
        <span className="terris-kiosk-attract__sub">Touch the globe or search to continue</span>
      </div>
    </button>
  )
}
