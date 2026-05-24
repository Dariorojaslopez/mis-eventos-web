import { AlertCircle, Plus, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { EventCard } from '@/components/EventCard'
import { FilterChips } from '@/components/FilterChips'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEvents } from '@/hooks/useEvents'
import type { EventStatus } from '@/types/api.types'

type StatusFilter = 'all' | EventStatus

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'published', label: 'Publicados' },
  { value: 'draft', label: 'Borradores' },
  { value: 'finished', label: 'Finalizados' },
]

export function EventsDashboardPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    [search, statusFilter],
  )

  const { events, total, isLoading, error, refetch } = useEvents(queryParams)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Eventos"
        description={`${total} evento${total !== 1 ? 's' : ''} en la plataforma`}
        actions={
          <Button onClick={() => navigate('/events/new')} className="shadow-md">
            <Plus />
            Crear evento
          </Button>
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 transition-shadow focus:shadow-md"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <FilterChips options={statusFilters} value={statusFilter} onChange={setStatusFilter} />
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-start gap-3 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Error al cargar eventos</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {isLoading && <LoadingSkeleton />}

      {!isLoading && !error && events.length === 0 && (
        <EmptyState
          icon={search || statusFilter !== 'all' ? Search : Sparkles}
          title={search ? 'Sin resultados' : 'Aún no hay eventos'}
          description={
            search
              ? 'Prueba con otros términos o limpia los filtros.'
              : 'Crea tu primer evento y sorprende con descripciones generadas por IA.'
          }
          actionLabel="Crear evento"
          onAction={() => navigate('/events/new')}
        />
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event, i) => (
            <div
              key={event.id}
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
