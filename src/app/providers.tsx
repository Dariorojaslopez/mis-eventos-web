import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { queryClient } from '@/lib/query-client'
import { AppRoutes } from '@/routes'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate)
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (token) {
      void hydrate()
    }
  }, [hydrate, token])

  return children
}

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  useEffect(() => {
    setTheme(theme)
  }, [setTheme, theme])

  return children
}

export function AppProviders() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeInitializer>
          <AuthInitializer>
            <AppRoutes />
            <Toaster
              richColors
              closeButton
              position="top-right"
              toastOptions={{
                duration: 4000,
                classNames: {
                  toast: 'border border-border shadow-lg backdrop-blur-sm',
                },
              }}
            />
          </AuthInitializer>
        </ThemeInitializer>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
