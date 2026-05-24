/**
 * Axios client — all traffic to Render API uses HTTPS (TLS in transit).
 * @see @/lib/security/transport
 */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getErrorMessage } from '@/lib/errors'
import { AUTH_MESSAGES } from '@/lib/security/auth-messages'
import { useAuthStore } from '@/store/auth.store'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://mis-eventos-api-3625.onrender.com'

const AUTH_ROUTES = ['/login', '/register']
const PUBLIC_AUTH_ENDPOINTS = ['/api/v1/auth/login', '/api/v1/auth/register']

let isHandlingUnauthorized = false

function isAuthPage(): boolean {
  return AUTH_ROUTES.some((route) => window.location.pathname.startsWith(route))
}

function isPublicAuthRequest(url: string | undefined): boolean {
  if (!url) return false
  return PUBLIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint))
}

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
    const requestUrl = error.config?.url

    if (status === 401) {
      if (isPublicAuthRequest(requestUrl) || isAuthPage()) {
        return Promise.reject(error)
      }

      const { isAuthenticated, logout } = useAuthStore.getState()

      if (isAuthenticated && !isHandlingUnauthorized) {
        isHandlingUnauthorized = true
        logout()

        if (!isAuthPage()) {
          window.location.replace('/login')
        }

        window.setTimeout(() => {
          isHandlingUnauthorized = false
        }, 2000)
      }
    }

    return Promise.reject(error)
  },
)

export { getErrorMessage, AUTH_MESSAGES }
