import { useCallback, useId, useState, type ReactNode } from 'react'

export type LayerId =
  | 'people'
  | 'places'
  | 'events'
  | 'empires'
  | 'nature'
  | 'art'
  | 'war'

type LayerDef = {
  id: LayerId
  label: string
  icon: ReactNode
}

function IconPeople() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="24" cy="16" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M14 34c0-5 4-8 10-8s10 3 10 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconPlaces() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M24 8c-4 8-8 14-8 22a8 8 0 0 0 16 0c0-8-4-14-8-22Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="26" r="3" fill="currentColor" opacity="0.35" />
    </svg>
  )
}

function IconEvents() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="12" y="14" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 20h24" stroke="currentColor" strokeWidth="1.2" />
      <path d="M18 10v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M30 10v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="24" cy="28" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

function IconEmpires() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M24 10l-3 6h-6l5 4-2 7 6-4 6 4-2-7 5-4h-6l-3-6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 32h16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

function IconNature() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M24 8C14 18 12 26 12 34c0 4 4 6 12 8 8-2 12-4 12-8 0-8-2-16-12-26Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M24 28v12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  )
}

function IconArt() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="12" y="14" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="20" cy="22" r="2" fill="currentColor" opacity="0.35" />
      <path
        d="M14 32c4-4 8-6 20-6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

function IconWar() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M16 32l16-16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M18 18l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 26l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const LAYERS: LayerDef[] = [
  { id: 'people', label: 'People', icon: <IconPeople /> },
  { id: 'places', label: 'Places', icon: <IconPlaces /> },
  { id: 'events', label: 'Events', icon: <IconEvents /> },
  { id: 'empires', label: 'Empires', icon: <IconEmpires /> },
  { id: 'nature', label: 'Nature', icon: <IconNature /> },
  { id: 'art', label: 'Art', icon: <IconArt /> },
  { id: 'war', label: 'War', icon: <IconWar /> },
]

export type PlanetaryLayerId = 'surface' | 'atmosphere' | 'missions' | 'moons'

type PlanetaryLayerDef = {
  id: PlanetaryLayerId
  label: string
  icon: ReactNode
}

function IconSurface() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M14 28c4-6 8-8 20-6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  )
}

function IconAtmosphere() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ellipse cx="24" cy="24" rx="18" ry="10" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <ellipse cx="24" cy="22" rx="16" ry="8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function IconMissions() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M24 10v22"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M18 14l6-4 6 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 38h8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconMoons() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="22" cy="24" r="10" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="34" cy="20" r="4" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <circle cx="30" cy="32" r="3" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
    </svg>
  )
}

const PLANETARY_LAYERS: PlanetaryLayerDef[] = [
  { id: 'surface', label: 'Surface', icon: <IconSurface /> },
  { id: 'atmosphere', label: 'Atmosphere', icon: <IconAtmosphere /> },
  { id: 'missions', label: 'Missions', icon: <IconMissions /> },
  { id: 'moons', label: 'Moons', icon: <IconMoons /> },
]

const MOCK_PLANETARY_ACTIVE: PlanetaryLayerId[] = ['surface', 'moons']

/** Mock default: a few layers on to show the UI in isolation. */
const MOCK_INITIAL_ACTIVE: LayerId[] = ['places', 'nature', 'art']

export type LayerDockProps = {
  /** Optional controlled set. When omitted, internal mock state is used. */
  activeLayers?: ReadonlySet<LayerId>
  /** Initial selection when uncontrolled. */
  initialActiveLayers?: LayerId[]
  onLayersChange?: (layers: LayerId[]) => void
  className?: string
  /** Earth stack label visibility (0–1). */
  earthLayerOpacity?: number
  /** Planetary stack label visibility (0–1). */
  planetaryLayerOpacity?: number
}

export function LayerDock({
  activeLayers: activeProp,
  initialActiveLayers = MOCK_INITIAL_ACTIVE,
  onLayersChange,
  className,
  earthLayerOpacity = 1,
  planetaryLayerOpacity = 0,
}: LayerDockProps) {
  const controlled = activeProp !== undefined
  const [internal, setInternal] = useState<Set<LayerId>>(
    () => new Set(initialActiveLayers),
  )
  const [planetaryInternal, setPlanetaryInternal] = useState<Set<PlanetaryLayerId>>(
    () => new Set(MOCK_PLANETARY_ACTIVE),
  )

  const active = controlled ? activeProp! : internal

  const toggle = useCallback(
    (id: LayerId) => {
      const next = new Set(active)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      if (!controlled) setInternal(next)
      onLayersChange?.([...next])
    },
    [active, controlled, onLayersChange],
  )

  const togglePlanetary = useCallback((id: PlanetaryLayerId) => {
    setPlanetaryInternal((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const uid = useId()
  const labelId = `${uid}-label`

  const tf = 'opacity 2100ms cubic-bezier(0.22, 1, 0.36, 1)'
  const earthPointer = earthLayerOpacity < 0.08 ? 'none' : 'auto'
  const planetPointer = planetaryLayerOpacity < 0.08 ? 'none' : 'auto'

  return (
    <nav
      className={['terris-layerdock', className ?? ''].filter(Boolean).join(' ')}
      aria-labelledby={labelId}
    >
      <div className="terris-layerdock__panel">
        <p id={labelId} className="terris-layerdock__title">
          Layers
        </p>
        <div className="terris-layerdock__stacks">
          <ul
            className="terris-layerdock__list terris-layerdock__list--earth"
            role="list"
            style={{
              opacity: earthLayerOpacity,
              transition: tf,
              pointerEvents: earthPointer,
            }}
          >
            {LAYERS.map((layer) => {
              const isOn = active.has(layer.id)
              return (
                <li key={layer.id}>
                  <button
                    type="button"
                    className={
                      'terris-layerdock__btn' +
                      (isOn ? ' terris-layerdock__btn--active' : '')
                    }
                    aria-pressed={isOn}
                    onClick={() => toggle(layer.id)}
                  >
                    <span className="terris-layerdock__icon">{layer.icon}</span>
                    <span className="terris-layerdock__label">{layer.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <ul
            className="terris-layerdock__list terris-layerdock__list--planetary"
            role="list"
            style={{
              opacity: planetaryLayerOpacity,
              transition: tf,
              pointerEvents: planetPointer,
            }}
          >
            {PLANETARY_LAYERS.map((layer) => {
              const isOn = planetaryInternal.has(layer.id)
              return (
                <li key={layer.id}>
                  <button
                    type="button"
                    className={
                      'terris-layerdock__btn' +
                      (isOn ? ' terris-layerdock__btn--active' : '')
                    }
                    aria-pressed={isOn}
                    onClick={() => togglePlanetary(layer.id)}
                  >
                    <span className="terris-layerdock__icon">{layer.icon}</span>
                    <span className="terris-layerdock__label">{layer.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}
