import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthLink, AuthShell } from '@/components/auth/AuthShell'
import { PasswordField } from '@/components/auth/PasswordField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSecureSubmit } from '@/hooks/useSecureSubmit'
import { AUTH_MESSAGES } from '@/lib/security/auth-messages'
import { notify } from '@/lib/toast'
import { loginSchema, type LoginFormValues } from '@/modules/auth/schemas/login.schema'
import { useAuthStore } from '@/store/auth.store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const storeLoading = useAuthStore((s) => s.isLoading)
  const { isPending, run } = useSecureSubmit()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })

  const passwordField = register('password')

  const onSubmit = async (values: LoginFormValues) => {
    await run(async () => {
      try {
        await login(values)
        notify.success('Bienvenido de nuevo')
        void navigate(from, { replace: true })
      } catch {
        notify.error('Acceso denegado', AUTH_MESSAGES.loginFailed)
      }
    })
  }

  const busy = isPending || storeLoading

  return (
    <AuthShell
      title="Iniciar sesión"
      description="Accede a tu panel de eventos"
      footer={
        <>
          ¿No tienes cuenta? <AuthLink to="/register">Regístrate gratis</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@empresa.com"
            autoComplete="email"
            disabled={busy}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <PasswordField
          id="password"
          label="Contraseña"
          autoComplete="current-password"
          error={errors.password?.message}
          registrationProps={{
            ...passwordField,
            disabled: busy,
          }}
        />

        <Button type="submit" className="w-full" disabled={busy} aria-busy={busy}>
          {busy ? (
            <>
              <Loader2 className="animate-spin" />
              Ingresando...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
