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

/** Mensajes UX en español para códigos de error del backend */
const API_ERROR_MESSAGES_ES: Record<string, string> = {
  organizer_self_registration: 'Como organizador no puedes inscribirte en tu propio evento.',
  already_registered: 'Ya tienes una inscripción activa en este evento.',
  event_full: 'No hay cupos disponibles en este evento.',
  event_not_published: 'Este evento aún no acepta inscripciones.',
  event_cancelled: 'Este evento fue cancelado.',
  registration_closed: 'Las inscripciones están cerradas.',
  session_overlap: 'Este horario se solapa con otra sesión del evento.',
  session_outside_event: 'La sesión debe estar dentro del rango del evento.',
  session_outside_event_range: 'La sesión debe estar dentro del rango del evento.',
  unauthorized: 'No autorizado. Inicia sesión nuevamente.',
  forbidden: 'No tienes permiso para realizar esta acción.',
  not_found: 'Recurso no encontrado.',
  validation_error: 'Datos inválidos. Revisa el formulario.',
  conflict: 'La operación no pudo completarse por un conflicto.',
  bad_request: 'Datos inválidos. Revisa el formulario.',
  internal_server_error: 'Error del servidor. Inténtalo más tarde.',
}

/** Traducciones exactas de mensajes frecuentes del backend (inglés → español) */
const BACKEND_MESSAGE_EXACT_ES: Record<string, string> = {
  'not found': 'Recurso no encontrado.',
  'forbidden': 'No tienes permiso para realizar esta acción.',
  'unauthorized': 'No autorizado. Inicia sesión nuevamente.',
  'internal server error': 'Error del servidor. Inténtalo más tarde.',
  'bad request': 'Datos inválidos. Revisa el formulario.',
  'conflict': 'La operación no pudo completarse por un conflicto.',
  'field required': 'Este campo es obligatorio.',
}

/** Patrones comunes de validación FastAPI / Pydantic */
const BACKEND_MESSAGE_PATTERNS_ES: Array<[RegExp, string | ((match: RegExpMatchArray) => string)]> =
  [
    [/session.*overlap|overlapping session|time slot.*overlap/i, 'Este horario se solapa con otra sesión del evento.'],
    [/outside.*event|out of event range|within event/i, 'La sesión debe estar dentro del rango del evento.'],
    [/string should have at least (\d+) character/i, (m) => `Mínimo ${m[1]} caracteres.`],
    [/string should have at most (\d+) character/i, (m) => `Máximo ${m[1]} caracteres.`],
    [/field required|missing required field/i, 'Este campo es obligatorio.'],
    [/input should be a valid (datetime|date|time)/i, 'Fecha u hora no válida.'],
    [/value is not a valid email/i, 'Correo electrónico inválido.'],
    [/ensure this value is greater than (\d+)/i, (m) => `El valor debe ser mayor a ${m[1]}.`],
    [/ensure this value is greater than or equal to (\d+)/i, (m) => `El valor debe ser mayor o igual a ${m[1]}.`],
    [/greater than.*start|end.*must be after/i, 'La hora de fin debe ser posterior al inicio.'],
    [/not enough permissions|permission denied/i, 'No tienes permiso para realizar esta acción.'],
    [/could not validate credentials/i, 'Credenciales inválidas. Verifica tu email y contraseña.'],
    [/network error|failed to fetch/i, 'Error de conexión. Verifica tu internet e inténtalo de nuevo.'],
    [/timeout/i, 'La solicitud tardó demasiado. Inténtalo de nuevo.'],
  ]

const ENGLISH_HINT =
  /\b(the|must|should|field|invalid|not found|error|required|cannot|unable|failed|forbidden|unauthorized|ensure|value|greater|less|least|maximum|minimum|input|missing|overlap|conflict)\b/i

function looksLikeEnglish(text: string): boolean {
  return ENGLISH_HINT.test(text)
}

/**
 * Traduce mensajes del backend al español cuando es posible.
 * Si el mensaje sigue en inglés, devuelve el fallback genérico.
 */
export function translateUserMessage(
  message: string,
  fallback = 'Ocurrió un error inesperado. Inténtalo de nuevo.',
): string {
  const trimmed = message.trim()
  if (!trimmed) return fallback

  const exact = BACKEND_MESSAGE_EXACT_ES[trimmed.toLowerCase()]
  if (exact) return exact

  for (const [pattern, translation] of BACKEND_MESSAGE_PATTERNS_ES) {
    const match = trimmed.match(pattern)
    if (match) {
      return typeof translation === 'function' ? translation(match) : translation
    }
  }

  if (looksLikeEnglish(trimmed)) return fallback

  return trimmed
}

function toUserFacingMessage(
  message: string,
  fallback = 'Ocurrió un error inesperado. Inténtalo de nuevo.',
): string {
  const safe = sanitizeErrorMessage(message, fallback)
  if (safe === fallback && message.trim()) {
    return translateUserMessage(message, fallback)
  }
  return translateUserMessage(safe, fallback)
}

function extractValidationMessages(detail: ApiValidationError[]): string | null {
  const translated = detail
    .map((d) => toUserFacingMessage(d.msg, ''))
    .filter((msg) => msg.length > 0)

  if (translated.length === 0) return null
  return translated.join('. ')
}

function extractEnvelopeMessage(data: ApiErrorBody | undefined): string | null {
  if (!data?.error?.code) return null

  const mapped = API_ERROR_MESSAGES_ES[data.error.code]
  if (mapped) return mapped

  if (data.error.message) {
    return toUserFacingMessage(data.error.message)
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
    return toUserFacingMessage(detail, fallback)
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const validationMsg = extractValidationMessages(detail)
    if (validationMsg) return validationMsg
    return fallback
  }

  if (error instanceof Error && error.message && !error.message.includes('status code')) {
    return toUserFacingMessage(error.message, fallback)
  }

  return fallback
}

export function getRegistrationErrorMessage(error: unknown): string {
  return getErrorMessage(error, 'No se pudo completar la inscripción. Inténtalo de nuevo.')
}
