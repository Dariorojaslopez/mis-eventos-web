import { z } from 'zod'
import { doTimeRangesOverlap, localDateTimeToIso } from '@/lib/utils'

const sessionFieldsSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(255),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  speaker: z.string().min(2, 'Ponente requerido').max(255),
  room: z.string().min(2, 'Sala requerida').max(255),
  start_time: z.string().min(1, 'Hora de inicio requerida'),
  end_time: z.string().min(1, 'Hora de fin requerida'),
  capacity: z.number().int().positive('Capacidad debe ser mayor a 0'),
})

export interface SessionSchemaContext {
  eventStartDate: string
  eventEndDate: string
  existingSessions?: Array<{ id: string; start_time: string; end_time: string }>
  excludeSessionId?: string
}

export function createSessionFormSchema(context: SessionSchemaContext) {
  const { eventStartDate, eventEndDate, existingSessions = [], excludeSessionId } = context

  return sessionFieldsSchema
    .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
      message: 'La hora de fin debe ser posterior al inicio',
      path: ['end_time'],
    })
    .superRefine((data, ctx) => {
      const startMs = new Date(data.start_time).getTime()
      const endMs = new Date(data.end_time).getTime()
      const eventStartMs = new Date(eventStartDate).getTime()
      const eventEndMs = new Date(eventEndDate).getTime()

      if (Number.isNaN(startMs) || Number.isNaN(endMs)) return

      if (startMs < eventStartMs) {
        ctx.addIssue({
          code: 'custom',
          message: 'El inicio no puede ser anterior al inicio del evento',
          path: ['start_time'],
        })
      }

      if (endMs > eventEndMs) {
        ctx.addIssue({
          code: 'custom',
          message: 'El fin no puede ser posterior al cierre del evento',
          path: ['end_time'],
        })
      }

      if (startMs > eventEndMs) {
        ctx.addIssue({
          code: 'custom',
          message: 'El inicio debe estar dentro del rango del evento',
          path: ['start_time'],
        })
      }

      if (endMs < eventStartMs) {
        ctx.addIssue({
          code: 'custom',
          message: 'El fin debe estar dentro del rango del evento',
          path: ['end_time'],
        })
      }

      const candidateStartIso = localDateTimeToIso(data.start_time)
      const candidateEndIso = localDateTimeToIso(data.end_time)

      for (const other of existingSessions) {
        if (other.id === excludeSessionId) continue

        if (
          doTimeRangesOverlap(
            candidateStartIso,
            candidateEndIso,
            other.start_time,
            other.end_time,
          )
        ) {
          ctx.addIssue({
            code: 'custom',
            message: 'Este horario se solapa con otra sesión del evento',
            path: ['start_time'],
          })
          ctx.addIssue({
            code: 'custom',
            message: 'Ajusta el horario para evitar solapamiento',
            path: ['end_time'],
          })
          break
        }
      }
    })
}

/** Schema base sin contexto de evento (tests / fallback) */
export const sessionFormSchema = sessionFieldsSchema.refine(
  (data) => new Date(data.end_time) > new Date(data.start_time),
  {
    message: 'La hora de fin debe ser posterior al inicio',
    path: ['end_time'],
  },
)

export type SessionFormValues = z.infer<typeof sessionFieldsSchema>
