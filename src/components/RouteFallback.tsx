import { LoadingSkeleton } from '@/components/LoadingSkeleton'

export function RouteFallback() {
  return (
    <div className="p-4 lg:p-6 animate-fade-in">
      <div className="mb-6 space-y-2">
        <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded-lg bg-muted animate-pulse" />
      </div>
      <LoadingSkeleton count={6} />
    </div>
  )
}
