import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export const sessionKeys = {
  all: ['sessions'] as const,
  byEvent: (eventId: string) => [...sessionKeys.all, 'event', eventId] as const,
  detail: (sessionId: string) => [...sessionKeys.all, 'detail', sessionId] as const,
}
