import type { AxiosError } from 'axios'
import { sanitizeErrorMessage } from '@/lib/security/sanitize'

export interface ApiValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiErrorEnvelope {
  code: string
  message: string
}

export interface ApiErrorBody {
  detail?: string | ApiValidationError[]
  error?: ApiErrorEnvelope
}

/** Mensajes UX en español para códigos de error del backend enterprise */
const API_ERROR_MESSAGES_ES: Record<string, string> = {
  organizer_self_registration: 'Como organizador no puedes inscribirte en tu propio evento.',
  already_registered: 'Ya tienes una inscripción activa en este evento.',
  event_full: 'No hay cupos disponibles en este evento.',
  event_not_published: 'Este evento aún no acepta inscripciones.',
  event_cancelled: 'Este evento fue cancelado.',
  registration_closed: 'Las inscripciones están cerradas.',
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
  'cupo',
  'inscrip',
  'evento',
  'organizador',
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

function extractEnvelopeMessage(data: ApiErrorBody | undefined): string | null {
  if (!data?.error?.code) return null

  const mapped = API_ERROR_MESSAGES_ES[data.error.code]
  if (mapped) return mapped

  if (data.error.message) {
    return sanitizeErrorMessage(data.error.message)
  }

  return null
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado. Inténtalo de nuevo.',
): string {
  if (!error) return fallback

  const axiosError = error as AxiosError<ApiErrorBody>
  const data = axiosError.response?.data

  const envelopeMsg = extractEnvelopeMessage(data)
  if (envelopeMsg) return envelopeMsg

  const detail = data?.detail

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

  // Nunca mostrar mensajes técnicos de Axios ("Request failed with status code 409")
  if (error instanceof Error && error.message && !error.message.includes('status code')) {
    return sanitizeErrorMessage(error.message, fallback)
  }

  return fallback
}

export function getRegistrationErrorMessage(error: unknown): string {
  return getErrorMessage(error, 'No se pudo completar la inscripción. Inténtalo de nuevo.')
}
