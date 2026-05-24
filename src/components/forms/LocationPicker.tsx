import { Loader2, MapPin, Search, X } from 'lucide-react'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { cn } from '@/lib/utils'
import {
  DEFAULT_MAP_CENTER,
  reverseGeocode,
  searchPlaces,
  type GeocodingResult,
} from '@/services/geocoding.service'

const LocationMap = lazy(() =>
  import('@/components/forms/LocationMap').then((m) => ({ default: m.LocationMap })),
)

interface LocationPickerProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export function LocationPicker({
  id = 'location',
  label = 'Ubicación',
  value,
  onChange,
  error,
}: LocationPickerProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER)
  const [marker, setMarker] = useState<[number, number] | null>(null)

  const debouncedQuery = useDebouncedValue(query, 450)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setResults([])
      return
    }

    let cancelled = false
    setIsSearching(true)

    void searchPlaces(debouncedQuery).then((places) => {
      if (cancelled) return
      setResults(places)
      setShowResults(places.length > 0)
      setIsSearching(false)
    })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  const handleSelectPlace = useCallback(
    (place: GeocodingResult) => {
      const pos: [number, number] = [place.lat, place.lng]
      setMapCenter(pos)
      setMarker(pos)
      setQuery(place.displayName)
      onChange(place.displayName)
      setShowResults(false)
      setResults([])
    },
    [onChange],
  )

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      const pos: [number, number] = [lat, lng]
      setMarker(pos)
      setMapCenter(pos)
      setIsReverseGeocoding(true)
      try {
        const address = await reverseGeocode(lat, lng)
        if (address) {
          setQuery(address)
          onChange(address)
        }
      } finally {
        setIsReverseGeocoding(false)
      }
    },
    [onChange],
  )

  const handleQueryChange = (next: string) => {
    setQuery(next)
    onChange(next)
    if (next.length < 3) {
      setResults([])
      setShowResults(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    onChange('')
    setMarker(null)
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>{label}</Label>

      {/* Buscador estilo Google Maps */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Buscar dirección, lugar o ciudad..."
          className="h-12 pl-9 pr-10 text-base"
          autoComplete="off"
        />
        {(isSearching || isReverseGeocoding) && (
          <Loader2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
        )}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {showResults && results.length > 0 && (
          <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-popover shadow-xl">
            {results.map((place, i) => (
              <li key={`${place.lat}-${place.lng}-${i}`}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-3 py-3 text-left text-sm transition-colors hover:bg-accent active:bg-accent/80"
                  onClick={() => handleSelectPlace(place)}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="line-clamp-2">{place.displayName}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa interactivo — touch friendly en móvil */}
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-border/80',
          'h-[220px] sm:h-[280px]',
          error && 'border-destructive/50',
        )}
      >
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center bg-muted/30">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
        >
          <LocationMap center={mapCenter} marker={marker} onMapClick={handleMapClick} />
        </Suspense>

        <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg bg-background/90 px-3 py-2 text-center text-[11px] text-muted-foreground backdrop-blur sm:text-xs">
          Toca el mapa para fijar la ubicación · Busca arriba como en Google Maps
        </div>
      </div>

      {value && (
        <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm leading-snug">{value}</p>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
