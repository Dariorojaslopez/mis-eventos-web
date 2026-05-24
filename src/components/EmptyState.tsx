import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/80 bg-gradient-to-b from-muted/40 to-transparent px-6 py-16 text-center animate-fade-in',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--primary)/8%,transparent_55%)]" />
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="relative text-lg font-semibold">{title}</h3>
      <p className="relative mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button className="relative mt-6 shadow-md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
