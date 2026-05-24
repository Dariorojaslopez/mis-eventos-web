import type { EventStatus } from '@/types/api.types'

export const eventStatusLabels: Record<EventStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  cancelled: 'Cancelado',
  finished: 'Finalizado',
}

export const eventStatusVariant: Record<
  EventStatus,
  'default' | 'secondary' | 'success' | 'warning' | 'destructive'
> = {
  draft: 'secondary',
  published: 'success',
  cancelled: 'destructive',
  finished: 'warning',
}
