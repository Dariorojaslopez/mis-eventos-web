import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import { eventsService } from '@/services/events.service'
import { registrationsService } from '@/services/registrations.service'
import type { AttendeeRead, EventRead } from '@/types/api.types'

export function useEventDetail(eventId: string | undefined) {
  const [event, setEvent] = useState<EventRead | null>(null)
  const [attendees, setAttendees] = useState<AttendeeRead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)

  const load = useCallback(async () => {
    if (!eventId) return

    setIsLoading(true)
    setError(null)

    try {
      const [eventData, myEvents] = await Promise.all([
        eventsService.getById(eventId),
        registrationsService.listMyEvents().catch(() => []),
      ])

      setEvent(eventData)
      setIsRegistered(
        myEvents.some(
          (r) => r.event_id === eventId && r.registration_status === 'registered',
        ),
      )

      try {
        const attendeesData = await registrationsService.listAttendees(eventId)
        setAttendees(attendeesData)
      } catch {
        setAttendees([])
      }
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el evento'))
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    void load()
  }, [load])

  return {
    event,
    attendees,
    isLoading,
    error,
    isRegistered,
    setIsRegistered,
    refetch: load,
  }
}
