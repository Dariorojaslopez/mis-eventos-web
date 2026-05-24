import { apiClient } from '@/services/api-client'
import type {
  AttendeeRead,
  MyRegisteredEventRead,
  RegistrationRead,
} from '@/types/api.types'

export const registrationsService = {
  listMyEvents: async (): Promise<MyRegisteredEventRead[]> => {
    const { data } = await apiClient.get<MyRegisteredEventRead[]>('/api/v1/me/events')
    return data
  },

  register: async (eventId: string): Promise<RegistrationRead> => {
    const { data } = await apiClient.post<RegistrationRead>(
      `/api/v1/events/${eventId}/register`,
    )
    return data
  },

  cancel: async (eventId: string): Promise<RegistrationRead> => {
    const { data } = await apiClient.delete<RegistrationRead>(
      `/api/v1/events/${eventId}/register`,
    )
    return data
  },

  listAttendees: async (eventId: string): Promise<AttendeeRead[]> => {
    const { data } = await apiClient.get<AttendeeRead[]>(
      `/api/v1/events/${eventId}/attendees`,
    )
    return data
  },
}
