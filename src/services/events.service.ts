import { apiClient } from '@/services/api-client'
import type {
  EventCreate,
  EventRead,
  EventsQueryParams,
  PaginatedResponse,
} from '@/types/api.types'

const BASE = '/api/v1/events'

export const eventsService = {
  list: async (params?: EventsQueryParams): Promise<PaginatedResponse<EventRead>> => {
    const { data } = await apiClient.get<PaginatedResponse<EventRead>>(BASE, { params })
    return data
  },

  getById: async (eventId: string): Promise<EventRead> => {
    const { data } = await apiClient.get<EventRead>(`${BASE}/${eventId}`)
    return data
  },

  create: async (payload: EventCreate): Promise<EventRead> => {
    const { data } = await apiClient.post<EventRead>(BASE, payload)
    return data
  },
}
