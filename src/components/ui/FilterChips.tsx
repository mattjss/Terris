import { ENTITY_TYPE_META, type EntityType } from '@/data/historical'
import { useAtlasStore } from '@/store/atlas'

export function FilterChips() {
  const { activeFilters, toggleFilter } = useAtlasStore()

  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label="Layer filters"
    >
      {ENTITY_TYPE_META.map((meta) => {
        const pressed = activeFilters.includes(meta.id as EntityType)
        const active =
          activeFilters.length === 0 || pressed
        return (
          <button
            key={meta.id}
            onClick={() => toggleFilter(meta.id as EntityType)}
            aria-pressed={pressed}
            className="
              flex items-center gap-1.5
              px-2.5 py-[5px] rounded-none text-[9px] font-medium
              border transition-colors duration-150 cursor-pointer
              font-[family-name:var(--font-terris-mono)] tracking-[0.06em] uppercase
            "
            style={{
              borderColor: active ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)',
              background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
              color: active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)',
            }}
          >
            <span
              className="h-[5px] w-[5px] shrink-0 rounded-none transition-colors duration-150"
              style={{
                background: active ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)',
              }}
            />
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}
