/** Field names that must never appear in user-facing error text */
const SENSITIVE_FIELD_NAMES = [
  'password',
  'confirm_password',
  'access_token',
  'token',
  'secret',
  'authorization',
  'credential',
]

/** Patterns that indicate internal or enumerable auth details */
const BLOCKED_PATTERNS: RegExp[] = [
  /password/i,
  /contraseña/i,
  /credential/i,
  /already registered/i,
  /ya registrad/i,
  /email.*exist/i,
  /correo.*exist/i,
  /user.*not found/i,
  /usuario.*no/i,
  /incorrect/i,
  /incorrecto/i,
  /invalid.*user/i,
  /stack\s*trace/i,
  /traceback/i,
  /sqlalchemy/i,
  /integrityerror/i,
  /internal server/i,
  /500/i,
  /unhandled/i,
  /exception/i,
  /at\s+\/[\w./-]+:\d+/i,
  /jwt/i,
  /bearer/i,
]

const MAX_SAFE_MESSAGE_LENGTH = 180

function containsSensitiveField(text: string): boolean {
  const lower = text.toLowerCase()
  return SENSITIVE_FIELD_NAMES.some((field) => lower.includes(field))
}

/**
 * Strips backend internals and sensitive hints before showing errors in UI.
 * Falls back to a safe generic message when content is unsafe.
 */
export function sanitizeErrorMessage(
  message: string,
  fallback = 'Ocurrió un error inesperado. Inténtalo de nuevo.',
): string {
  if (!message || typeof message !== 'string') return fallback

  const trimmed = message.trim().slice(0, 500)

  if (trimmed.length > MAX_SAFE_MESSAGE_LENGTH) return fallback
  if (containsSensitiveField(trimmed)) return fallback

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) return fallback
  }

  return trimmed
}

/**
 * Sanitizes toast/UI copy — never pass raw form values or credentials.
 */
export function sanitizeForDisplay(value: string | undefined): string | undefined {
  if (!value) return undefined
  return sanitizeErrorMessage(value)
}
