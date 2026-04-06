import { useQuery } from '@tanstack/react-query'
import { entities as staticEntities } from '@/data/historical'
import { fetchEntitiesFromApi } from '@/lib/api'

export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      const fromApi = await fetchEntitiesFromApi()
      if (fromApi && fromApi.length > 0) return fromApi
      return staticEntities
    },
    initialData: staticEntities,
    staleTime: 60_000,
  })
}
