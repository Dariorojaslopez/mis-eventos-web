import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AIButtonProps {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
}

export function AIButton({ onClick, isLoading, disabled, className }: AIButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'group relative overflow-hidden border-primary/40 bg-gradient-to-r from-primary/10 via-violet-500/10 to-fuchsia-500/10',
        'shadow-sm transition-all duration-300 hover:border-primary/60 hover:shadow-md hover:shadow-primary/10',
        isLoading && 'ai-shimmer',
        className,
      )}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Generando...
          </span>
        </>
      ) : (
        <>
          <Sparkles className="text-primary transition-transform group-hover:scale-110" />
          Generar con IA
        </>
      )}
    </Button>
  )
}
