import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/lib/errors'
import { sessionKeys } from '@/lib/query-client'
import { notify } from '@/lib/toast'
import { localDateTimeToIso } from '@/lib/utils'
import type { SessionFormValues } from '@/modules/sessions/session.schema'
import { sessionsService } from '@/services/sessions.service'
import type { CreateSessionPayload, Session, UpdateSessionPayload } from '@/types/sessions.types'

function formToPayload(values: SessionFormValues): CreateSessionPayload {
  return {
    title: values.title,
    description: values.description,
    speaker: values.speaker,
    room: values.room,
    start_time: localDateTimeToIso(values.start_time),
    end_time: localDateTimeToIso(values.end_time),
    capacity: values.capacity,
  }
}

export function useEventSessions(eventId: string | undefined) {
  return useQuery({
    queryKey: sessionKeys.byEvent(eventId ?? ''),
    queryFn: () => sessionsService.getEventSessions(eventId!),
    enabled: !!eventId,
  })
}

export function useCreateSession(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: SessionFormValues) =>
      sessionsService.createSession(eventId, formToPayload(values)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.byEvent(eventId) })
      notify.success('Sesión creada', 'Agregada a la agenda del evento')
    },
    onError: (err) => {
      notify.error('No se pudo crear', getErrorMessage(err, 'Error al crear sesión'))
    },
  })
}

export function useUpdateSession(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      sessionId,
      values,
    }: {
      sessionId: string
      values: SessionFormValues
    }) => {
      const payload: UpdateSessionPayload = formToPayload(values)
      return sessionsService.updateSession(sessionId, payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.byEvent(eventId) })
      notify.success('Sesión actualizada')
    },
    onError: (err) => {
      notify.error('No se pudo actualizar', getErrorMessage(err, 'Error al actualizar sesión'))
    },
  })
}

export function useDeleteSession(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => sessionsService.deleteSession(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.byEvent(eventId) })
      notify.success('Sesión eliminada')
    },
    onError: (err) => {
      notify.error('No se pudo eliminar', getErrorMessage(err, 'Error al eliminar sesión'))
    },
  })
}

export type { Session }
