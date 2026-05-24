import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import { eventsService } from '@/services/events.service'
import type { EventRead, EventsQueryParams } from '@/types/api.types'

export function useEvents(params?: EventsQueryParams) {
  const [events, setEvents] = useState<EventRead[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const search = params?.search
  const status = params?.status

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await eventsService.list({ limit: 50, sort: 'asc', ...params })
      setEvents(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar los eventos'))
    } finally {
      setIsLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    void fetchEvents()
  }, [fetchEvents])

  return { events, total, isLoading, error, refetch: fetchEvents }
}
