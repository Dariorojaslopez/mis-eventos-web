import { Clock, Mic2, Users } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { SessionRead } from '@/types/api.types'

interface SessionTimelineProps {
  sessions: SessionRead[]
}

export function SessionTimeline({ sessions }: SessionTimelineProps) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="Sin sesiones"
        description="Este evento aún no tiene sesiones programadas."
      />
    )
  }

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  )

  return (
    <div className="relative space-y-0">
      <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
      {sorted.map((session, index) => (
        <div
          key={session.id}
          className="relative flex gap-4 pb-8 last:pb-0 animate-slide-up"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background shadow-sm ring-4 ring-background">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <div className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card/50 p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-semibold">{session.title}</h3>
              <Badge variant="outline" className="capitalize">
                {session.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {session.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Mic2 className="h-3.5 w-3.5 text-primary/70" />
                {session.speaker_name}
              </span>
              <span>Sala {session.room}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary/70" />
                {formatDate(session.start_time)} — {formatDate(session.end_time)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary/70" />
                {session.available_slots}/{session.capacity} cupos
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
