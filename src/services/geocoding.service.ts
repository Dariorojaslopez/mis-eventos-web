export interface GeocodingResult {
  displayName: string
  lat: number
  lng: number
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

const NOMINATIM_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Accept-Language': 'es',
  'User-Agent': 'MisEventos-Web/1.0 (event-management-app)',
}

/** Bogotá — centro por defecto */
export const DEFAULT_MAP_CENTER: [number, number] = [4.711, -74.0721]

export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  const q = query.trim()
  if (q.length < 3) return []

  const params = new URLSearchParams({
    q,
    format: 'json',
    limit: '6',
    addressdetails: '1',
  })

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: NOMINATIM_HEADERS,
  })

  if (!res.ok) return []

  const data = (await res.json()) as Array<{
    display_name: string
    lat: string
    lon: string
  }>

  return data.map((item) => ({
    displayName: shortenDisplayName(item.display_name),
    lat: Number.parseFloat(item.lat),
    lng: Number.parseFloat(item.lon),
  }))
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
  })

  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: NOMINATIM_HEADERS,
  })

  if (!res.ok) return null

  const data = (await res.json()) as { display_name?: string }
  return data.display_name ? shortenDisplayName(data.display_name) : null
}

function shortenDisplayName(full: string): string {
  const parts = full.split(',').map((p) => p.trim())
  return parts.slice(0, 4).join(', ')
}
