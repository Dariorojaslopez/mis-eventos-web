export type UserRole = 'admin' | 'organizer' | 'attendee'

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished'

export type SessionStatus = 'scheduled' | 'in_progress' | 'finished' | 'cancelled'

export type RegistrationStatus = 'registered' | 'cancelled' | 'waitlist'

export interface UserRead {
  id: string
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserCreate {
  email: string
  full_name: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface EventRead {
  id: string
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  max_capacity: number
  available_slots: number
  status: EventStatus
  organizer_id: string
  created_at: string
  updated_at: string
}

export interface EventCreate {
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  max_capacity: number
  status?: EventStatus
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface SessionRead {
  id: string
  title: string
  description: string
  speaker_name: string
  room: string
  start_time: string
  end_time: string
  capacity: number
  available_slots: number
  status: SessionStatus
  event_id: string
  created_at: string
  updated_at: string
}

export interface RegistrationRead {
  id: string
  user_id: string
  event_id: string
  status: RegistrationStatus
  registered_at: string
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

export interface OrganizerSummary {
  id: string
  full_name: string
  email: string
}

export interface MyRegisteredEventRead {
  registration_id: string
  registration_status: RegistrationStatus
  registered_at: string
  cancelled_at: string | null
  event_id: string
  event_title: string
  event_description: string
  event_location: string
  event_start_date: string
  event_end_date: string
  event_status: EventStatus
  organizer: OrganizerSummary
}

export interface AttendeeRead {
  registration_id: string
  registration_status: RegistrationStatus
  registered_at: string
  cancelled_at: string | null
  user_id: string
  full_name: string
  email: string
}

export interface GenerateEventDescriptionRequest {
  title: string
  location?: string | null
  event_type?: string | null
  audience?: string | null
}

export interface GenerateEventDescriptionResponse {
  title: string
  generated_description: string
}

export interface EventsQueryParams {
  page?: number
  limit?: number
  search?: string | null
  status?: EventStatus | null
  sort?: 'asc' | 'desc'
}
