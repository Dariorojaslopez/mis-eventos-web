import { apiClient } from '@/services/api-client'
import type {
  GenerateEventDescriptionRequest,
  GenerateEventDescriptionResponse,
} from '@/types/api.types'

const BASE = '/api/v1/ai'

export const aiService = {
  generateEventDescription: async (
    payload: GenerateEventDescriptionRequest,
  ): Promise<GenerateEventDescriptionResponse> => {
    const { data } = await apiClient.post<GenerateEventDescriptionResponse>(
      `${BASE}/generate-event-description`,
      payload,
    )
    return data
  },
}
