/**
 * Safe, user-facing auth error messages.
 * Never reveal whether email exists, password is wrong, or account state.
 */
export const AUTH_MESSAGES = {
  loginFailed: 'Credenciales inválidas. Verifica tu email y contraseña.',
  registerFailed:
    'No se pudo crear la cuenta. Verifica tus datos e inténtalo de nuevo.',
  registerSuccess: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
  sessionExpired: 'Tu sesión expiró. Inicia sesión nuevamente.',
  genericError: 'Ocurrió un error. Inténtalo más tarde.',
} as const

export type AuthErrorContext = 'login' | 'register'

/**
 * Returns a generic auth error regardless of backend response body.
 * Prevents user enumeration and credential detail leakage.
 */
export function getAuthErrorMessage(_error: unknown, context: AuthErrorContext): string {
  return context === 'login' ? AUTH_MESSAGES.loginFailed : AUTH_MESSAGES.registerFailed
}
