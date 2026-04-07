import { useQuery } from '@tanstack/react-query'
import {
  entities as staticEntities,
  type HistoricalEntity,
} from '@/data/historical'
import { fetchEntitiesFromApi } from '@/lib/api'

export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: async (): Promise<HistoricalEntity[]> => {
      const fromApi = await fetchEntitiesFromApi()
      if (fromApi && fromApi.length > 0)
        return fromApi as unknown as HistoricalEntity[]
      return staticEntities
    },
    initialData: staticEntities,
    staleTime: 60_000,
  })
}
