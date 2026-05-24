import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Incluye al menos una mayúscula')
  .regex(/[a-z]/, 'Incluye al menos una minúscula')
  .regex(/[0-9]/, 'Incluye al menos un número')

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'Mínimo 2 caracteres')
      .max(255, 'Máximo 255 caracteres'),
    email: z.email('Email inválido'),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export function getPasswordStrength(password: string): {
  score: number
  label: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Excelente']
  return { score, label: labels[Math.min(score, 4)] ?? 'Muy débil' }
}
