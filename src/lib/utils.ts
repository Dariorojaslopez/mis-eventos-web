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

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', { timeStyle: 'short' }).format(new Date(iso))
}

export function formatDateLabel(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function getDateKey(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
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

export function splitDateTimeLocal(value: string): { date: string; time: string } {
  if (!value) return { date: '', time: '' }
  const [date, timePart] = value.split('T')
  return { date: date ?? '', time: timePart?.slice(0, 5) ?? '' }
}

export function combineDateTimeLocal(date: string, time: string): string {
  if (!date) return ''
  return `${date}T${time || '09:00'}`
}

export function formatDateTimeLocalDisplay(value: string): {
  dateLabel: string
  timeLabel: string
} {
  if (!value) {
    return { dateLabel: 'Seleccionar fecha', timeLabel: 'Seleccionar hora' }
  }

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) {
    return { dateLabel: 'Fecha inválida', timeLabel: '--:--' }
  }

  return {
    dateLabel: new Intl.DateTimeFormat('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d),
    timeLabel: new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d),
  }
}

/** Fin debe ser estrictamente posterior al inicio */
export function isEndAfterStart(start: string, end: string): boolean {
  if (!start || !end) return true
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return true
  return endMs > startMs
}

/** Hora mínima para fin cuando es el mismo día que inicio */
export function getMinTimeForEndDate(startDateTime: string, endDate: string): string | undefined {
  if (!startDateTime || !endDate) return undefined
  const start = splitDateTimeLocal(startDateTime)
  if (start.date !== endDate) return undefined
  return start.time
}

