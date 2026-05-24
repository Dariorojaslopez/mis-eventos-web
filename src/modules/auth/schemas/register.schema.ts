import { z } from 'zod'

/** Allowed special characters for passwords */
export const PASSWORD_SPECIAL_CHARS = '!@#$%^&*._-'

const SPECIAL_CHAR_REGEX = /[!@#$%^&*._-]/
const ALLOWED_CHARSET_REGEX = /^[A-Za-z0-9!@#$%^&*._-]+$/

export const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .max(128, 'Máximo 128 caracteres')
  .regex(/[A-Z]/, 'Incluye al menos una mayúscula')
  .regex(/[a-z]/, 'Incluye al menos una minúscula')
  .regex(/[0-9]/, 'Incluye al menos un número')
  .regex(
    SPECIAL_CHAR_REGEX,
    `Incluye un carácter especial (${PASSWORD_SPECIAL_CHARS})`,
  )
  .regex(ALLOWED_CHARSET_REGEX, `Solo caracteres permitidos: letras, números y ${PASSWORD_SPECIAL_CHARS}`)

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

export interface PasswordRequirement {
  id: string
  label: string
  met: boolean
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { id: 'length', label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { id: 'upper', label: 'Una letra mayúscula', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'Una letra minúscula', met: /[a-z]/.test(password) },
    { id: 'number', label: 'Un número', met: /[0-9]/.test(password) },
    {
      id: 'special',
      label: `Un carácter especial (${PASSWORD_SPECIAL_CHARS})`,
      met: SPECIAL_CHAR_REGEX.test(password),
    },
  ]
}

export function getPasswordStrength(password: string): {
  score: number
  label: string
} {
  const requirements = getPasswordRequirements(password)
  const score = requirements.filter((r) => r.met).length

  const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Excelente']
  return { score, label: labels[Math.min(score, 4)] ?? 'Muy débil' }
}
