import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CapacityWidget } from '@/components/forms/CapacityWidget'
import { DateTimeWidget } from '@/components/forms/DateTimeWidget'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateSession, useUpdateSession } from '@/hooks/useSessions'
import {
  sessionFormSchema,
  type SessionFormValues,
} from '@/modules/sessions/session.schema'
import type { SessionRead } from '@/types/api.types'
import { sessionToFormValues } from '@/types/sessions.types'

interface SessionFormDialogProps {
  eventId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  session?: SessionRead | null
}

const emptyDefaults: SessionFormValues = {
  title: '',
  description: '',
  speaker: '',
  room: '',
  start_time: '',
  end_time: '',
  capacity: 50,
}

export function SessionFormDialog({
  eventId,
  open,
  onOpenChange,
  session,
}: SessionFormDialogProps) {
  const isEdit = !!session
  const createMutation = useCreateSession(eventId)
  const updateMutation = useUpdateSession(eventId)
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    mode: 'onChange',
    defaultValues: emptyDefaults,
  })

  const startTime = watch('start_time')

  useEffect(() => {
    if (!open) return
    reset(session ? sessionToFormValues(session) : emptyDefaults)
  }, [open, session, reset])

  const onSubmit = async (values: SessionFormValues) => {
    if (isEdit && session) {
      await updateMutation.mutateAsync({ sessionId: session.id, values })
    } else {
      await createMutation.mutateAsync(values)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar sesión' : 'Agregar sesión'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza los detalles de esta sesión en la agenda.'
              : 'Programa una nueva sesión para el evento.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-title">Título</Label>
            <Input
              id="session-title"
              placeholder="Keynote de apertura"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-description">Descripción</Label>
            <Textarea
              id="session-description"
              rows={3}
              placeholder="Describe el contenido de la sesión..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="session-speaker">Speaker</Label>
              <Input
                id="session-speaker"
                placeholder="Nombre del ponente"
                {...register('speaker')}
              />
              {errors.speaker && (
                <p className="text-xs text-destructive">{errors.speaker.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-room">Sala</Label>
              <Input id="session-room" placeholder="Auditorio A" {...register('room')} />
              {errors.room && (
                <p className="text-xs text-destructive">{errors.room.message}</p>
              )}
            </div>
          </div>

          <Controller
            name="start_time"
            control={control}
            render={({ field }) => (
              <DateTimeWidget
                id="session-start"
                label="Inicio"
                value={field.value}
                onChange={field.onChange}
                error={errors.start_time?.message}
              />
            )}
          />

          <Controller
            name="end_time"
            control={control}
            render={({ field }) => (
              <DateTimeWidget
                id="session-end"
                label="Fin"
                value={field.value}
                onChange={field.onChange}
                minDateTime={startTime}
                error={errors.end_time?.message}
              />
            )}
          />

          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <CapacityWidget
                id="session-capacity"
                label="Capacidad"
                value={field.value}
                onChange={field.onChange}
                error={errors.capacity?.message}
              />
            )}
          />

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {isEdit ? 'Guardar cambios' : 'Crear sesión'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
