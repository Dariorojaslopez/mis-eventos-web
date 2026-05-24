import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthLink, AuthShell } from '@/components/auth/AuthShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/errors'
import { notify } from '@/lib/toast'
import { loginSchema, type LoginFormValues } from '@/modules/auth/schemas/login.schema'
import { useAuthStore } from '@/store/auth.store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true)
    try {
      await login(values)
      notify.success('Bienvenido de nuevo')
      void navigate(from, { replace: true })
    } catch (err) {
      notify.error('Acceso denegado', getErrorMessage(err, 'Credenciales inválidas'))
    } finally {
      setSubmitting(false)
    }
  }

  const busy = submitting || isLoading

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@empresa.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
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
