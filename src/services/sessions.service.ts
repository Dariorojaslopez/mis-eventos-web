import { apiClient } from '@/services/api-client'
import type { SessionRead } from '@/types/api.types'

export const sessionsService = {
  listByEvent: async (eventId: string): Promise<SessionRead[]> => {
    const { data } = await apiClient.get<SessionRead[]>(
      `/api/v1/events/${eventId}/sessions`,
    )
    return data
  },
}
