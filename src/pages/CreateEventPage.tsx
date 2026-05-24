import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AIDescriptionField } from '@/components/ai/AIDescriptionField'
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
              onChange={(v) => setValue('description', v, { shouldValidate: true, shouldDirty: true })}
              streamingText={streamingText}
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
              <div className="space-y-2">
                <Label htmlFor="start_date">Inicio</Label>
                <Input id="start_date" type="datetime-local" {...register('start_date')} />
                {errors.start_date && (
                  <p className="text-xs text-destructive">{errors.start_date.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Fin</Label>
                <Input id="end_date" type="datetime-local" {...register('end_date')} />
                {errors.end_date && (
                  <p className="text-xs text-destructive">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_capacity">Capacidad máxima</Label>
              <Input
                id="max_capacity"
                type="number"
                min={1}
                {...register('max_capacity', { valueAsNumber: true })}
              />
              {errors.max_capacity && (
                <p className="text-xs text-destructive">{errors.max_capacity.message}</p>
              )}
            </div>

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
