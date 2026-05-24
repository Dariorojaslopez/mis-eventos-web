import { Calendar, Clock } from 'lucide-react'
import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import {
  cn,
  combineDateTimeLocal,
  formatDateTimeLocalDisplay,
  getMinTimeForEndDate,
  isEndAfterStart,
  splitDateTimeLocal,
} from '@/lib/utils'

interface DateTimeWidgetProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  /** datetime-local mínimo — usado en campo Fin (inicio del evento) */
  minDateTime?: string
}

export function DateTimeWidget({
  id,
  label,
  value,
  onChange,
  error,
  minDateTime,
}: DateTimeWidgetProps) {
  const dateRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)

  const { date, time } = splitDateTimeLocal(value)
  const { dateLabel, timeLabel } = formatDateTimeLocalDisplay(value)
  const minDate = minDateTime ? splitDateTimeLocal(minDateTime).date : undefined
  const minTime = minDateTime ? getMinTimeForEndDate(minDateTime, date) : undefined

  const rangeError =
    minDateTime && value && !isEndAfterStart(minDateTime, value)
      ? 'Debe ser posterior al inicio'
      : undefined
  const displayError = error ?? rangeError

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

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={openDatePicker}
          className={cn(
            'relative flex min-h-[72px] flex-col justify-center gap-1 rounded-xl border border-border/80 bg-muted/20 p-2.5 sm:flex-row sm:items-center sm:gap-3 sm:p-3',
            'text-left transition-all active:scale-[0.98] hover:border-primary/40 hover:bg-muted/40',
            displayError && 'border-destructive/50',
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Fecha
            </p>
            <p className="truncate text-xs font-semibold sm:text-sm">{dateLabel}</p>
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
            'relative flex min-h-[72px] flex-col justify-center gap-1 rounded-xl border border-border/80 bg-muted/20 p-2.5 sm:flex-row sm:items-center sm:gap-3 sm:p-3',
            'text-left transition-all active:scale-[0.98] hover:border-primary/40 hover:bg-muted/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
            displayError && 'border-destructive/50',
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Hora
            </p>
            <p className="truncate text-xs font-semibold sm:text-sm">{timeLabel}</p>
          </div>
          <input
            ref={timeRef}
            id={`${id}-time`}
            type="time"
            value={time}
            min={minTime}
            onChange={(e) => update(date, e.target.value)}
            className="pointer-events-none absolute inset-0 opacity-0"
            tabIndex={-1}
            aria-hidden
            disabled={!date}
          />
        </button>
      </div>

      {displayError && <p className="text-xs text-destructive">{displayError}</p>}
    </div>
  )
}
