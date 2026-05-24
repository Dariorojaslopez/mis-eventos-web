import type { AxiosError } from 'axios'

export interface ApiValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiErrorBody {
  detail?: string | ApiValidationError[]
}

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (!error) return fallback

  const axiosError = error as AxiosError<ApiErrorBody>
  const detail = axiosError.response?.data?.detail

  if (typeof detail === 'string') return detail

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((d) => d.msg).join('. ')
  }

  if (error instanceof Error && error.message) return error.message

  return fallback
}
