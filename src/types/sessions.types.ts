import type { SessionRead, SessionStatus } from '@/types/api.types'

/** Modelo de sesión para la capa UI */
export type Session = SessionRead

export interface CreateSessionPayload {
  title: string
  description: string
  speaker: string
  room: string
  start_time: string
  end_time: string
  capacity: number
  status?: SessionStatus
}

export interface UpdateSessionPayload {
  title?: string
  description?: string
  speaker?: string
  room?: string
  start_time?: string
  end_time?: string
  capacity?: number
  status?: SessionStatus
}

/** Payload enviado al backend FastAPI */
export interface SessionCreateApiPayload {
  title: string
  description: string
  speaker_name: string
  room: string
  start_time: string
  end_time: string
  capacity: number
  status?: SessionStatus
}

export interface SessionUpdateApiPayload {
  title?: string
  description?: string
  speaker_name?: string
  room?: string
  start_time?: string
  end_time?: string
  capacity?: number
  status?: SessionStatus
}

export function toCreateApiPayload(payload: CreateSessionPayload): SessionCreateApiPayload {
  return {
    title: payload.title,
    description: payload.description,
    speaker_name: payload.speaker,
    room: payload.room,
    start_time: payload.start_time,
    end_time: payload.end_time,
    capacity: payload.capacity,
    status: payload.status ?? 'scheduled',
  }
}

export function toUpdateApiPayload(payload: UpdateSessionPayload): SessionUpdateApiPayload {
  return {
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.speaker !== undefined && { speaker_name: payload.speaker }),
    ...(payload.room !== undefined && { room: payload.room }),
    ...(payload.start_time !== undefined && { start_time: payload.start_time }),
    ...(payload.end_time !== undefined && { end_time: payload.end_time }),
    ...(payload.capacity !== undefined && { capacity: payload.capacity }),
    ...(payload.status !== undefined && { status: payload.status }),
  }
}

export function sessionToFormValues(session: Session) {
  return {
    title: session.title,
    description: session.description,
    speaker: session.speaker_name,
    room: session.room,
    start_time: toLocalInput(session.start_time),
    end_time: toLocalInput(session.end_time),
    capacity: session.capacity,
  }
}

function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
