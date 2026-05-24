import { Check, Eye, EyeOff, X } from 'lucide-react'
import { useId, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  getPasswordRequirements,
  getPasswordStrength,
} from '@/modules/auth/schemas/register.schema'

interface PasswordFieldProps {
  id?: string
  label: string
  error?: string
  autoComplete?: 'new-password' | 'current-password'
  showRequirements?: boolean
  registrationProps?: React.ComponentProps<'input'>
}

export function PasswordField({
  id: idProp,
  label,
  error,
  autoComplete = 'current-password',
  showRequirements = false,
  registrationProps,
}: PasswordFieldProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const [visible, setVisible] = useState(false)

  const passwordValue =
    typeof registrationProps?.value === 'string' ? registrationProps.value : ''

  const requirements = showRequirements ? getPasswordRequirements(passwordValue) : []
  const { score, label: strengthLabel } = getPasswordStrength(passwordValue)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete={autoComplete}
          className="pr-10"
          {...registrationProps}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showRequirements && passwordValue.length > 0 && (
        <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3 animate-fade-in">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
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
            Fortaleza:{' '}
            <span className="font-medium text-foreground">{strengthLabel}</span>
          </p>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li
                key={req.id}
                className={cn(
                  'flex items-center gap-2 text-xs transition-colors',
                  req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
                )}
              >
                {req.met ? (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <X className="h-3.5 w-3.5 shrink-0 opacity-50" />
                )}
                {req.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
