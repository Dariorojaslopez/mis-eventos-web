import { Minus, Plus, Users } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PRESETS = [25, 50, 100, 200, 500] as const

interface CapacityWidgetProps {
  id: string
  label?: string
  value: number
  onChange: (value: number) => void
  error?: string
  min?: number
  max?: number
  step?: number
}

export function CapacityWidget({
  id,
  label = 'Capacidad máxima',
  value,
  onChange,
  error,
  min = 1,
  max = 10000,
  step = 1,
}: CapacityWidgetProps) {
  const safeValue = Number.isFinite(value) ? value : min

  const decrement = () => onChange(Math.max(min, safeValue - step))
  const increment = () => onChange(Math.min(max, safeValue + step))

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>{label}</Label>

      <div
        className={cn(
          'flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-muted/20 p-2',
          error && 'border-destructive/50',
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 rounded-lg text-lg"
          onClick={decrement}
          disabled={safeValue <= min}
          aria-label="Disminuir capacidad"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <div className="flex flex-1 flex-col items-center gap-0.5 py-1">
          <Users className="h-4 w-4 text-primary/70" />
          <span id={id} className="text-3xl font-bold tabular-nums tracking-tight">
            {safeValue}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            asistentes
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 rounded-lg text-lg"
          onClick={increment}
          disabled={safeValue >= max}
          aria-label="Aumentar capacidad"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95',
              safeValue === preset
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {preset}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
