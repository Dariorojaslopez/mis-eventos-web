import {
  AlertCircle,
  Clock,
  MapPin,
  Mic2,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { sessionStatusLabels } from '@/lib/status-labels'
import { formatDateLabel, formatTime, getDateKey } from '@/lib/utils'
import type { SessionRead } from '@/types/api.types'

interface SessionTimelineProps {
  sessions: SessionRead[]
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  canManage?: boolean
  onEdit?: (session: SessionRead) => void
  onDelete?: (session: SessionRead) => void
}

function SessionTimelineSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-40 rounded-full" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <Skeleton className="h-28 flex-1 rounded-xl" />
        </div>
      ))}
    </div>
  )
}

function groupSessionsByDate(sessions: SessionRead[]) {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  )

  const groups = new Map<string, SessionRead[]>()
  for (const session of sorted) {
    const key = getDateKey(session.start_time)
    const list = groups.get(key) ?? []
    list.push(session)
    groups.set(key, list)
  }

  return Array.from(groups.entries()).map(([dateKey, items]) => ({
    dateKey,
    label: formatDateLabel(items[0]!.start_time),
    sessions: items,
  }))
}

function CapacityBadge({ session }: { session: SessionRead }) {
  const occupied = session.capacity - session.available_slots
  const ratio = session.capacity > 0 ? occupied / session.capacity : 0
  const variant =
    ratio >= 0.9 ? 'destructive' : ratio >= 0.7 ? 'secondary' : 'outline'

  return (
    <Badge variant={variant} className="gap-1 tabular-nums">
      <Users className="h-3 w-3" />
      {session.available_slots}/{session.capacity}
    </Badge>
  )
}

export function SessionTimeline({
  sessions,
  isLoading,
  isError,
  errorMessage,
  canManage,
  onEdit,
  onDelete,
}: SessionTimelineProps) {
  if (isLoading) return <SessionTimelineSkeleton />

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium">No se pudieron cargar las sesiones</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          {errorMessage ?? 'Intenta recargar la página.'}
        </p>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="Sin sesiones"
        description={
          canManage
            ? 'Aún no hay sesiones programadas. Agrega la primera para construir la agenda.'
            : 'Este evento aún no tiene sesiones programadas.'
        }
      />
    )
  }

  const groups = groupSessionsByDate(sessions)

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.dateKey} className="space-y-4">
          <div className="sticky top-16 z-[1] flex items-center gap-3 py-1 backdrop-blur-sm">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs font-medium capitalize text-muted-foreground shadow-sm backdrop-blur-md">
              {group.label}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="relative space-y-0">
            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/50 via-violet-500/30 to-transparent" />

            {group.sessions.map((session, index) => (
              <div
                key={session.id}
                className="relative flex gap-4 pb-8 last:pb-0 animate-slide-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background/80 shadow-sm ring-4 ring-background backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-violet-500" />
                </div>

                <div className="group min-w-0 flex-1 rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-primary/30 hover:bg-card/60 hover:shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-medium tabular-nums text-primary">
                        {formatTime(session.start_time)} — {formatTime(session.end_time)}
                      </p>
                      <h3 className="font-semibold tracking-tight">{session.title}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <CapacityBadge session={session} />
                      <Badge variant="outline">
                        {sessionStatusLabels[session.status]}
                      </Badge>
                    </div>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {session.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Mic2 className="h-3.5 w-3.5 text-primary/70" />
                      {session.speaker_name}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary/70" />
                      {session.room}
                    </span>
                  </div>

                  {canManage && (
                    <div className="mt-4 flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5"
                        onClick={() => onEdit?.(session)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete?.(session)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
