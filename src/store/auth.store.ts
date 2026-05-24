import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/auth.service'
import type { UserLogin, UserRead } from '@/types/api.types'

/**
 * JWT persistence — token stored in localStorage (XSS surface).
 * Passwords are NEVER stored here; only access_token after successful login.
 * @see @/lib/security/transport
 */
const AUTH_STORAGE_KEY = 'mis-eventos-auth'

interface AuthState {
  token: string | null
  user: UserRead | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: UserLogin) => Promise<void>
  fetchUser: () => Promise<void>
  logout: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const tokenResponse = await authService.login(credentials)
          set({
            token: tokenResponse.access_token,
            isAuthenticated: true,
          })
          await get().fetchUser()
        } finally {
          set({ isLoading: false })
        }
      },

      fetchUser: async () => {
        const user = await authService.me()
        set({ user, isAuthenticated: true })
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
        try {
          localStorage.removeItem(AUTH_STORAGE_KEY)
        } catch {
          // ignore — private browsing
        }
      },

      hydrate: async () => {
        const { token } = get()
        if (!token) return

        set({ isLoading: true })
        try {
          await get().fetchUser()
        } catch {
          get().logout()
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.isAuthenticated = true
        }
      },
    },
  ),
)

/** Clears persisted session from localStorage */
export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // Storage may be unavailable in private mode
  }
}
