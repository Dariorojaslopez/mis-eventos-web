import { Badge } from '@/components/ui/badge'
import { eventStatusLabels, eventStatusVariant } from '@/lib/event-status'
import type { EventStatus } from '@/types/api.types'

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return <Badge variant={eventStatusVariant[status]}>{eventStatusLabels[status]}</Badge>
}
