import { UserCircle2, Users } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Badge } from '@/components/ui/badge'
import type { AttendeeRead } from '@/types/api.types'

interface AttendeesListProps {
  attendees: AttendeeRead[]
  isOrganizerView?: boolean
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function AttendeesList({ attendees, isOrganizerView }: AttendeesListProps) {
  if (attendees.length === 0) {
    if (!isOrganizerView) return null

    return (
      <EmptyState
        icon={Users}
        title="Sin asistentes visibles"
        description="Solo el organizador puede ver la lista de asistentes de este evento."
      />
    )
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {attendees.map((attendee, i) => (
        <div
          key={attendee.registration_id}
          className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/50 p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-sm animate-slide-up"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 text-sm font-semibold text-primary">
            {getInitials(attendee.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm">{attendee.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">{attendee.email}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 capitalize">
            {attendee.registration_status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export function AttendeesPlaceholder() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
      <UserCircle2 className="h-5 w-5 shrink-0" />
      <p>La lista de asistentes es visible solo para el organizador del evento.</p>
    </div>
  )
}
