import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AuthLink, AuthShell } from '@/components/auth/AuthShell'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/errors'
import { notify } from '@/lib/toast'
import {
  registerSchema,
  type RegisterFormValues,
} from '@/modules/auth/schemas/register.schema'
import { authService } from '@/services/auth.service'

export function RegisterPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  const password = watch('password')

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true)
    try {
      await authService.register({
        full_name: values.full_name,
        email: values.email,
        password: values.password,
      })
      notify.success('Cuenta creada', 'Ya puedes iniciar sesión con tus credenciales')
      void navigate('/login', { replace: true })
    } catch (err) {
      notify.error('No se pudo registrar', getErrorMessage(err, 'Intenta de nuevo'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Crear cuenta"
      description="Únete a la plataforma de gestión de eventos"
      footer={
        <>
          ¿Ya tienes cuenta? <AuthLink to="/login">Inicia sesión</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nombre completo</Label>
          <Input
            id="full_name"
            placeholder="Ana García"
            autoComplete="name"
            {...register('full_name')}
          />
          {errors.full_name && (
            <p className="text-xs text-destructive">{errors.full_name.message}</p>
          )}
        </div>

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
            autoComplete="new-password"
            {...register('password')}
          />
          <PasswordStrength password={password} />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirmar contraseña</Label>
          <Input
            id="confirm_password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('confirm_password')}
          />
          {errors.confirm_password && (
            <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="animate-spin" />
              Creando cuenta...
            </>
          ) : (
            'Registrarse'
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
