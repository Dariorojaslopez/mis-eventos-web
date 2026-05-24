/**
 * Auth API layer — credentials travel over HTTPS (TLS).
 * Passwords are sent once in the request body; never stored or logged client-side.
 * @see @/lib/security/transport
 */
import { apiClient } from '@/services/api-client'
import type { TokenResponse, UserCreate, UserLogin, UserRead } from '@/types/api.types'

const BASE = '/api/v1/auth'

export const authService = {
  login: async (payload: UserLogin): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>(`${BASE}/login`, payload)
    return data
  },

  register: async (payload: UserCreate): Promise<UserRead> => {
    const { data } = await apiClient.post<UserRead>(`${BASE}/register`, payload)
    return data
  },

  me: async (): Promise<UserRead> => {
    const { data } = await apiClient.get<UserRead>(`${BASE}/me`)
    return data
  },
}
