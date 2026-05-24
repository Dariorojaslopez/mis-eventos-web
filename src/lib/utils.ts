import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} — ${formatDate(end)}`
}

/** Convierte valor de input datetime-local a ISO UTC */
export function localDateTimeToIso(value: string): string {
  return new Date(value).toISOString()
}

/** Valor para input datetime-local desde ISO */
export function isoToLocalDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
