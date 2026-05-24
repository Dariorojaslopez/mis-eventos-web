import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AuthLink, AuthShell } from '@/components/auth/AuthShell'
import { PasswordField } from '@/components/auth/PasswordField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSecureSubmit } from '@/hooks/useSecureSubmit'
import { AUTH_MESSAGES, getAuthErrorMessage } from '@/lib/security/auth-messages'
import { notify } from '@/lib/toast'
import {
  registerSchema,
  type RegisterFormValues,
} from '@/modules/auth/schemas/register.schema'
import { authService } from '@/services/auth.service'

export function RegisterPage() {
  const navigate = useNavigate()
  const { isPending, run } = useSecureSubmit()

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
    mode: 'onChange',
  })

  const password = watch('password')
  const passwordField = register('password')
  const confirmField = register('confirm_password')

  const onSubmit = async (values: RegisterFormValues) => {
    await run(async () => {
      try {
        await authService.register({
          full_name: values.full_name,
          email: values.email,
          password: values.password,
        })
        notify.success('Cuenta creada', AUTH_MESSAGES.registerSuccess)
        void navigate('/login', { replace: true })
      } catch (err) {
        notify.error('Registro no completado', getAuthErrorMessage(err, 'register'))
      }
    })
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="full_name">Nombre completo</Label>
          <Input
            id="full_name"
            placeholder="Ana García"
            autoComplete="name"
            disabled={isPending}
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
            disabled={isPending}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <PasswordField
          id="password"
          label="Contraseña"
          autoComplete="new-password"
          showRequirements
          error={errors.password?.message}
          registrationProps={{
            ...passwordField,
            value: password,
            disabled: isPending,
          }}
        />

        <PasswordField
          id="confirm_password"
          label="Confirmar contraseña"
          autoComplete="new-password"
          error={errors.confirm_password?.message}
          registrationProps={{
            ...confirmField,
            disabled: isPending,
          }}
        />

        <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
          {isPending ? (
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
