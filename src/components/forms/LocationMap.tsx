import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { DEFAULT_MAP_CENTER } from '@/services/geocoding.service'

const markerIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border:3px solid white;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    box-shadow:0 4px 12px rgba(99,102,241,0.5);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 15), { duration: 0.8 })
  }, [center, map])
  return null
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface LocationMapProps {
  center: [number, number]
  marker: [number, number] | null
  onMapClick: (lat: number, lng: number) => void
}

export function LocationMap({ center, marker, onMapClick }: LocationMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full rounded-xl z-0"
      style={{ minHeight: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapFlyTo center={center} />
      <MapClickHandler onPick={onMapClick} />
      {marker && <Marker position={marker} icon={markerIcon} />}
    </MapContainer>
  )
}

export { DEFAULT_MAP_CENTER }
