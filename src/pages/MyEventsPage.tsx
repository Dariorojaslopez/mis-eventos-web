import { AlertCircle, Calendar, Ticket } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { EventStatusBadge } from '@/components/events/EventStatusBadge'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/errors'
import { notify } from '@/lib/toast'
import { formatDateRange } from '@/lib/utils'
import { registrationsService } from '@/services/registrations.service'
import type { MyRegisteredEventRead } from '@/types/api.types'

export function MyEventsPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<MyRegisteredEventRead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await registrationsService.listMyEvents()
      setEvents(data.filter((e) => e.registration_status === 'registered'))
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar tus inscripciones'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleCancel = async (eventId: string) => {
    setCancellingId(eventId)
    try {
      await registrationsService.cancel(eventId)
      notify.success('Inscripción cancelada')
      await load()
    } catch (err) {
      notify.error('No se pudo cancelar', getErrorMessage(err))
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Mis inscripciones"
        description="Eventos en los que estás registrado activamente"
      />

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <p>{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void load()}>
            Reintentar
          </Button>
        </div>
      )}

      {isLoading && <LoadingSkeleton count={3} />}

      {!isLoading && !error && events.length === 0 && (
        <EmptyState
          icon={Ticket}
          title="Sin inscripciones"
          description="Explora eventos publicados e inscríbete en segundos."
          actionLabel="Explorar eventos"
          onAction={() => navigate('/')}
        />
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid gap-4">
          {events.map((item, i) => (
            <Card
              key={item.registration_id}
              className="transition-all duration-200 hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-lg">
                    <Link
                      to={`/events/${item.event_id}`}
                      className="transition-colors hover:text-primary"
                    >
                      {item.event_title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {item.event_description}
                  </CardDescription>
                </div>
                <EventStatusBadge status={item.event_status} />
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/80" />
                    {formatDateRange(item.event_start_date, item.event_end_date)}
                  </p>
                  <p>{item.event_location}</p>
                  <p>Organizador: {item.organizer.full_name}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cancellingId === item.event_id}
                  onClick={() => void handleCancel(item.event_id)}
                >
                  Cancelar inscripción
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
