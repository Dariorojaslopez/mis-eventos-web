import type { AxiosError } from 'axios'
import { sanitizeErrorMessage } from '@/lib/security/sanitize'

export interface ApiValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiErrorBody {
  detail?: string | ApiValidationError[]
}

/** Safe validation messages allowed in UI (field-level, non-sensitive) */
const SAFE_VALIDATION_HINTS = [
  'email',
  'string',
  'required',
  'caracteres',
  'characters',
  'formato',
  'format',
  'mínimo',
  'minimum',
  'máximo',
  'maximum',
  'fecha',
  'date',
  'capacidad',
  'capacity',
  'título',
  'title',
  'ubicación',
  'location',
  'descripción',
  'description',
]

function isSafeValidationMessage(msg: string): boolean {
  const lower = msg.toLowerCase()
  if (lower.length > 120) return false
  return SAFE_VALIDATION_HINTS.some((hint) => lower.includes(hint))
}

function extractValidationMessages(detail: ApiValidationError[]): string | null {
  const safe = detail
    .map((d) => d.msg)
    .filter((msg) => isSafeValidationMessage(msg))

  if (safe.length === 0) return null
  return safe.join('. ')
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado. Inténtalo de nuevo.',
): string {
  if (!error) return fallback

  const axiosError = error as AxiosError<ApiErrorBody>
  const detail = axiosError.response?.data?.detail

  if (typeof detail === 'string') {
    return sanitizeErrorMessage(detail, fallback)
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const validationMsg = extractValidationMessages(detail)
    if (validationMsg) {
      return sanitizeErrorMessage(validationMsg, fallback)
    }
    return fallback
  }

  if (error instanceof Error && error.message) {
    return sanitizeErrorMessage(error.message, fallback)
  }

  return fallback
}
