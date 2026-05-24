import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AIDescriptionField } from '@/components/ai/AIDescriptionField'
import { CapacityWidget } from '@/components/forms/CapacityWidget'
import { DateTimeWidget } from '@/components/forms/DateTimeWidget'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGenerateDescription } from '@/hooks/useGenerateDescription'
import { getErrorMessage } from '@/lib/errors'
import { notify } from '@/lib/toast'
import { localDateTimeToIso } from '@/lib/utils'
import {
  createEventSchema,
  type CreateEventFormValues,
} from '@/modules/events/schemas/event.schema'
import { eventsService } from '@/services/events.service'

export function CreateEventPage() {
  const navigate = useNavigate()
  const { generate, isGenerating } = useGenerateDescription()
  const [streamingText, setStreamingText] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      start_date: '',
      end_date: '',
      max_capacity: 50,
    },
  })

  const title = watch('title')
  const location = watch('location')
  const description = watch('description')
  const startDate = watch('start_date')

  const handleDescriptionChange = useCallback(
    (v: string) => setValue('description', v, { shouldValidate: true, shouldDirty: true }),
    [setValue],
  )

  const handleStreamingComplete = useCallback(() => {
    setStreamingText(null)
  }, [])

  const handleGenerateAI = async () => {
    setStreamingText(null)
    const result = await generate({ title, location })
    if (result) setStreamingText(result)
  }

  const onSubmit = async (values: CreateEventFormValues) => {
    try {
      const event = await eventsService.create({
        title: values.title,
        description: values.description,
        location: values.location,
        start_date: localDateTimeToIso(values.start_date),
        end_date: localDateTimeToIso(values.end_date),
        max_capacity: values.max_capacity,
        status: 'published',
      })
      notify.success('Evento publicado', 'Redirigiendo al detalle...')
      void navigate(`/events/${event.id}`)
    } catch (err) {
      notify.error('Error al crear', getErrorMessage(err, 'No se pudo crear el evento'))
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link to="/">
            <ArrowLeft />
          </Link>
        </Button>
        <PageHeader
          className="flex-1"
          title="Crear evento"
          description="Usa IA para una descripción profesional en segundos"
        />
      </div>

      <Card className="border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle>Información del evento</CardTitle>
          <CardDescription>Conectado al backend en tiempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" placeholder="Conferencia Tech 2026" {...register('title')} />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <AIDescriptionField
              value={description}
              onChange={handleDescriptionChange}
              streamingText={streamingText}
              onStreamingComplete={handleStreamingComplete}
              onGenerate={() => void handleGenerateAI()}
              isGenerating={isGenerating}
              canGenerate={!!title && title.length >= 3}
              error={errors.description?.message}
            />

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                placeholder="Bogotá — Centro de Convenciones"
                {...register('location')}
              />
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DateTimeWidget
                    id="start_date"
                    label="Inicio"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.start_date?.message}
                  />
                )}
              />
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <DateTimeWidget
                    id="end_date"
                    label="Fin"
                    value={field.value}
                    onChange={field.onChange}
                    min={startDate || undefined}
                    error={errors.end_date?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="max_capacity"
              control={control}
              render={({ field }) => (
                <CapacityWidget
                  id="max_capacity"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.max_capacity?.message}
                />
              )}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creando...
                </>
              ) : (
                'Publicar evento'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
