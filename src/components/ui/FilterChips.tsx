import { ENTITY_TYPE_META, type EntityType } from '@/data/historical'
import { useAtlasStore } from '@/store/atlas'

export function FilterChips() {
  const { activeFilters, toggleFilter } = useAtlasStore()

  return (
    <div
      className="flex flex-wrap gap-1"
      role="group"
      aria-label="Layer filters"
    >
      {ENTITY_TYPE_META.map((meta) => {
        const active =
          activeFilters.length === 0 || activeFilters.includes(meta.id as EntityType)
        return (
          <button
            key={meta.id}
            onClick={() => toggleFilter(meta.id as EntityType)}
            aria-pressed={activeFilters.includes(meta.id as EntityType)}
            className="
              flex items-center gap-1.5
              px-2 py-[3px] rounded-full text-[9px] font-medium
              border transition-colors duration-150 cursor-pointer
            "
            style={{
              borderColor: active
                ? `${meta.color}28`
                : 'rgba(255,255,255,0.04)',
              background: active
                ? `${meta.color}0a`
                : 'transparent',
              color: active
                ? meta.color
                : 'rgba(255,255,255,0.18)',
            }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full transition-colors duration-150"
              style={{
                background: active ? meta.color : 'rgba(255,255,255,0.1)',
              }}
            />
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}
