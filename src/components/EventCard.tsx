import { ArrowUpRight, Calendar, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EventStatusBadge } from '@/components/events/EventStatusBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateRange } from '@/lib/utils'
import type { EventRead } from '@/types/api.types'

interface EventCardProps {
  event: EventRead
}

export function EventCard({ event }: EventCardProps) {
  const occupied = event.max_capacity - event.available_slots
  const fillPercent = Math.round((occupied / event.max_capacity) * 100)

  return (
    <Link to={`/events/${event.id}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 flex-1 text-base font-semibold transition-colors group-hover:text-primary">
              {event.title}
            </CardTitle>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <EventStatusBadge status={event.status} />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
            </div>
          </div>
          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-primary/80" />
            <span className="line-clamp-1">{formatDateRange(event.start_date, event.end_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary/80" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary/80" />
                {occupied}/{event.max_capacity}
              </span>
              <span className="text-xs">{event.available_slots} cupos</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/80 transition-all duration-500"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
