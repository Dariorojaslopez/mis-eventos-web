import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getErrorMessage } from '@/lib/errors'
import { useAuthStore } from '@/store/auth.store'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://mis-eventos-api-3625.onrender.com'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401) {
      const { isAuthenticated, logout } = useAuthStore.getState()
      if (isAuthenticated) {
        logout()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  },
)

export { getErrorMessage }
