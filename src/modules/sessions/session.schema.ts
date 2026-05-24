import { z } from 'zod'

export const sessionFormSchema = z
  .object({
    title: z.string().min(5, 'Mínimo 5 caracteres').max(255),
    description: z.string().min(10, 'Mínimo 10 caracteres'),
    speaker: z.string().min(2, 'Speaker requerido').max(255),
    room: z.string().min(2, 'Sala requerida').max(255),
    start_time: z.string().min(1, 'Hora de inicio requerida'),
    end_time: z.string().min(1, 'Hora de fin requerida'),
    capacity: z.number().int().positive('Capacidad debe ser mayor a 0'),
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: 'La hora de fin debe ser posterior al inicio',
    path: ['end_time'],
  })

export type SessionFormValues = z.infer<typeof sessionFormSchema>
