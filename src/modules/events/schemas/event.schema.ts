import { z } from 'zod'

export const createEventSchema = z
  .object({
    title: z.string().min(3, 'Mínimo 3 caracteres').max(255),
    description: z.string().min(10, 'Mínimo 10 caracteres'),
    location: z.string().min(3, 'Mínimo 3 caracteres').max(500),
    start_date: z.string().min(1, 'Fecha de inicio requerida'),
    end_date: z.string().min(1, 'Fecha de fin requerida'),
    max_capacity: z.number().int().positive('Capacidad debe ser mayor a 0'),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: 'La fecha de fin debe ser posterior a la de inicio',
    path: ['end_date'],
  })

export type CreateEventFormValues = z.infer<typeof createEventSchema>
