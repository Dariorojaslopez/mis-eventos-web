import { cn } from '@/lib/utils'

export interface FilterOption<T extends string> {
  value: T
  label: string
}

interface FilterChipsProps<T extends string> {
  options: FilterOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: FilterChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
            value === opt.value
              ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
