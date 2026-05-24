import { getPasswordStrength } from '@/modules/auth/schemas/register.schema'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null

  const { score, label } = getPasswordStrength(password)
  const bars = 5

  return (
    <div className="space-y-1.5 animate-fade-in">
      <div className="flex gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < score ? 'bg-primary' : 'bg-muted',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Fortaleza: <span className="font-medium text-foreground">{label}</span>
      </p>
    </div>
  )
}
