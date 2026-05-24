import { Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { AIButton } from '@/components/AIButton'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTypingEffect } from '@/hooks/useTypingEffect'
import { cn } from '@/lib/utils'

interface AIDescriptionFieldProps {
  value: string
  onChange: (value: string) => void
  streamingText: string | null
  onGenerate: () => void
  isGenerating: boolean
  canGenerate: boolean
  error?: string
}

export function AIDescriptionField({
  value,
  onChange,
  streamingText,
  onGenerate,
  isGenerating,
  canGenerate,
  error,
}: AIDescriptionFieldProps) {
  const { displayed, isTyping } = useTypingEffect(streamingText ?? '')

  useEffect(() => {
    if (streamingText && displayed) {
      onChange(displayed)
    }
  }, [displayed, streamingText, onChange])

  const isAnimating = isGenerating || isTyping
  const textareaValue = isTyping ? displayed : value

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor="description">Descripción</Label>
        <AIButton onClick={onGenerate} isLoading={isGenerating} disabled={!canGenerate} />
      </div>

      <div className="relative">
        <Textarea
          id="description"
          placeholder="Describe el evento o genera con IA..."
          rows={6}
          value={textareaValue}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'resize-none transition-all duration-300',
            isAnimating && 'ring-2 ring-primary/40 border-primary/30',
          )}
          readOnly={isAnimating}
        />
        {isAnimating && (
          <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/90 px-2.5 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-3 w-3 animate-pulse" />
            {isGenerating ? 'IA generando...' : 'Autocompletando...'}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
