import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
  Plus,
  Ticket,
  Users,
  UserCog,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AttendeesList, AttendeesPlaceholder } from '@/components/events/AttendeesList'
import { EventStatusBadge } from '@/components/events/EventStatusBadge'
import { SessionTimeline } from '@/components/events/SessionTimeline'
import { DeleteSessionDialog } from '@/components/sessions/DeleteSessionDialog'
import { SessionFormDialog } from '@/components/sessions/SessionFormDialog'
import { DetailSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEventDetail } from '@/hooks/useEventDetail'
import { useEventSessions } from '@/hooks/useSessions'
import { getErrorMessage, getRegistrationErrorMessage } from '@/lib/errors'
import { notify } from '@/lib/toast'
import { formatDateRange } from '@/lib/utils'
import { registrationsService } from '@/services/registrations.service'
import { useAuthStore } from '@/store/auth.store'
import type { SessionRead } from '@/types/api.types'

export function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const user = useAuthStore((s) => s.user)
  const {
    event,
    attendees,
    isLoading,
    error,
    isRegistered,
    setIsRegistered,
    refetch,
  } = useEventDetail(eventId)
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    isError: sessionsError,
    error: sessionsQueryError,
  } = useEventSessions(eventId)
  const [actionLoading, setActionLoading] = useState(false)
  const [sessionFormOpen, setSessionFormOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<SessionRead | null>(null)
  const [deletingSession, setDeletingSession] = useState<SessionRead | null>(null)

  const isOrganizer = event && user?.id === event.organizer_id

  const openCreateSession = () => {
    setEditingSession(null)
    setSessionFormOpen(true)
  }

  const openEditSession = (session: SessionRead) => {
    setEditingSession(session)
    setSessionFormOpen(true)
  }

  const openDeleteSession = (session: SessionRead) => {
    setDeletingSession(session)
  }

  const handleRegistration = async () => {
    if (!eventId) return

    setActionLoading(true)
    try {
      if (isRegistered) {
        await registrationsService.cancel(eventId)
        setIsRegistered(false)
        notify.success('Inscripción cancelada')
      } else {
        await registrationsService.register(eventId)
        setIsRegistered(true)
        notify.success('¡Inscripción confirmada!', 'Te esperamos en el evento')
      }
      await refetch()
    } catch (err) {
      notify.error('Inscripción no disponible', getRegistrationErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  if (isLoading) return <DetailSkeleton />

  if (error || !event) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold">No se pudo cargar el evento</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{error ?? 'Evento no encontrado'}</p>
        <Button variant="outline" asChild>
          <Link to="/">Volver a eventos</Link>
        </Button>
      </div>
    )
  }

  const canRegister =
    !isOrganizer && event.status === 'published' && event.available_slots > 0
  const occupancy = Math.round(
    ((event.max_capacity - event.available_slots) / event.max_capacity) * 100,
  )

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="-ml-2">
                <Link to="/">
                  <ArrowLeft />
                </Link>
              </Button>
              <EventStatusBadge status={event.status} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{event.title}</h1>
            <p className="max-w-2xl text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {isOrganizer ? (
            <div className="max-w-xs shrink-0 space-y-1 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              <div className="flex items-center gap-2 font-medium">
                <UserCog className="h-5 w-5 shrink-0" />
                <span>Eres el organizador</span>
              </div>
              <p className="text-xs leading-relaxed text-primary/80">
                No puedes inscribirte en tu propio evento. Para probar inscripciones, entra con
                otra cuenta o explora eventos de otros organizadores.
              </p>
            </div>
          ) : (
            <Button
              size="lg"
              variant={isRegistered ? 'outline' : 'default'}
              className="shrink-0 shadow-md"
              disabled={actionLoading || (!isRegistered && !canRegister)}
              onClick={() => void handleRegistration()}
            >
              {actionLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Ticket />
              )}
              {isRegistered
                ? 'Cancelar inscripción'
                : canRegister
                  ? 'Inscribirme ahora'
                  : 'Sin cupos'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Fechas
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm font-medium">
            {formatDateRange(event.start_date, event.end_date)}
          </CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Ubicación
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm font-medium">{event.location}</CardContent>
        </Card>
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Ocupación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium">
              {event.available_slots} de {event.max_capacity} disponibles
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-500"
                style={{ width: `${occupancy}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">
            Agenda
            {!sessionsLoading && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {sessions.length} {sessions.length === 1 ? 'sesión' : 'sesiones'}
              </span>
            )}
          </h2>
          {isOrganizer && eventId && (
            <Button size="sm" className="gap-1.5 shadow-sm" onClick={openCreateSession}>
              <Plus className="h-4 w-4" />
              Agregar sesión
            </Button>
          )}
        </div>
        <SessionTimeline
          sessions={sessions}
          isLoading={sessionsLoading}
          isError={sessionsError}
          errorMessage={getErrorMessage(sessionsQueryError, 'Error al cargar sesiones')}
          canManage={!!isOrganizer}
          onEdit={openEditSession}
          onDelete={openDeleteSession}
        />
      </section>

      {eventId && (
        <>
          <SessionFormDialog
            eventId={eventId}
            eventStartDate={event.start_date}
            eventEndDate={event.end_date}
            existingSessions={sessions}
            open={sessionFormOpen}
            onOpenChange={setSessionFormOpen}
            session={editingSession}
          />
          <DeleteSessionDialog
            eventId={eventId}
            session={deletingSession}
            open={!!deletingSession}
            onOpenChange={(open) => {
              if (!open) setDeletingSession(null)
            }}
          />
        </>
      )}

      <Separator />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Asistentes</h2>
        {attendees.length > 0 ? (
          <AttendeesList attendees={attendees} isOrganizerView={!!isOrganizer} />
        ) : isOrganizer ? (
          <AttendeesList attendees={[]} isOrganizerView />
        ) : (
          <AttendeesPlaceholder />
        )}
      </section>
    </div>
  )
}
