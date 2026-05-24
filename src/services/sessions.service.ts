import { apiClient } from '@/services/api-client'
import type { SessionRead } from '@/types/api.types'
import {
  toCreateApiPayload,
  toUpdateApiPayload,
  type CreateSessionPayload,
  type UpdateSessionPayload,
} from '@/types/sessions.types'

export const sessionsService = {
  createSession: async (
    eventId: string,
    payload: CreateSessionPayload,
  ): Promise<SessionRead> => {
    const { data } = await apiClient.post<SessionRead>(
      `/api/v1/events/${eventId}/sessions`,
      toCreateApiPayload(payload),
    )
    return data
  },

  getEventSessions: async (eventId: string): Promise<SessionRead[]> => {
    const { data } = await apiClient.get<SessionRead[]>(
      `/api/v1/events/${eventId}/sessions`,
    )
    return data
  },

  getSessionById: async (sessionId: string): Promise<SessionRead> => {
    const { data } = await apiClient.get<SessionRead>(`/api/v1/sessions/${sessionId}`)
    return data
  },

  updateSession: async (
    sessionId: string,
    payload: UpdateSessionPayload,
  ): Promise<SessionRead> => {
    const { data } = await apiClient.put<SessionRead>(
      `/api/v1/sessions/${sessionId}`,
      toUpdateApiPayload(payload),
    )
    return data
  },

  deleteSession: async (sessionId: string): Promise<SessionRead> => {
    const { data } = await apiClient.delete<SessionRead>(`/api/v1/sessions/${sessionId}`)
    return data
  },

  /** @deprecated use getEventSessions */
  listByEvent: async (eventId: string): Promise<SessionRead[]> => {
    return sessionsService.getEventSessions(eventId)
  },
}
