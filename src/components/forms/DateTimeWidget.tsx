import { Calendar, Clock } from 'lucide-react'
import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import {
  cn,
  combineDateTimeLocal,
  formatDateTimeLocalDisplay,
  splitDateTimeLocal,
} from '@/lib/utils'

interface DateTimeWidgetProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  min?: string
}

export function DateTimeWidget({
  id,
  label,
  value,
  onChange,
  error,
  min,
}: DateTimeWidgetProps) {
  const dateRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)

  const { date, time } = splitDateTimeLocal(value)
  const { dateLabel, timeLabel } = formatDateTimeLocalDisplay(value)
  const minDate = min ? splitDateTimeLocal(min).date : undefined

  const update = (nextDate: string, nextTime: string) => {
    onChange(combineDateTimeLocal(nextDate, nextTime))
  }

  const openDatePicker = () => {
    const el = dateRef.current
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.click()
  }

  const openTimePicker = () => {
    const el = timeRef.current
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.click()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-date`}>{label}</Label>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={openDatePicker}
          className={cn(
            'relative flex min-h-[72px] items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-3',
            'text-left transition-all active:scale-[0.98] hover:border-primary/40 hover:bg-muted/40',
            error && 'border-destructive/50',
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Fecha
            </p>
            <p className="truncate text-sm font-semibold">{dateLabel}</p>
          </div>
          <input
            ref={dateRef}
            id={`${id}-date`}
            type="date"
            value={date}
            min={minDate}
            onChange={(e) => update(e.target.value, time)}
            className="pointer-events-none absolute inset-0 opacity-0"
            tabIndex={-1}
            aria-hidden
          />
        </button>

        <button
          type="button"
          onClick={openTimePicker}
          disabled={!date}
          className={cn(
            'relative flex min-h-[72px] items-center gap-3 rounded-xl border border-border/80 bg-muted/20 p-3',
            'text-left transition-all active:scale-[0.98] hover:border-primary/40 hover:bg-muted/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive/50',
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Hora
            </p>
            <p className="truncate text-sm font-semibold">{timeLabel}</p>
          </div>
          <input
            ref={timeRef}
            id={`${id}-time`}
            type="time"
            value={time}
            onChange={(e) => update(date, e.target.value)}
            className="pointer-events-none absolute inset-0 opacity-0"
            tabIndex={-1}
            aria-hidden
            disabled={!date}
          />
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
