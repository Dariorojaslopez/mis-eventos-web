import type { RegistrationStatus, SessionStatus } from '@/types/api.types'

export const sessionStatusLabels: Record<SessionStatus, string> = {
  scheduled: 'Programada',
  in_progress: 'En curso',
  finished: 'Finalizada',
  cancelled: 'Cancelada',
}

export const registrationStatusLabels: Record<RegistrationStatus, string> = {
  registered: 'Inscrito',
  cancelled: 'Cancelada',
  waitlist: 'Lista de espera',
}
