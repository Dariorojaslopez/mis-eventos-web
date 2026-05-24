import { useCallback, useState } from 'react'
import { getErrorMessage } from '@/lib/errors'
import { notify } from '@/lib/toast'
import { aiService } from '@/services/ai.service'

interface GenerateParams {
  title: string
  location?: string
}

export function useGenerateDescription() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = useCallback(async ({ title, location }: GenerateParams) => {
    if (title.trim().length < 3) {
      notify.warning('Título muy corto', 'Escribe al menos 3 caracteres')
      return null
    }

    setIsGenerating(true)
    try {
      const response = await aiService.generateEventDescription({
        title: title.trim(),
        location: location?.trim() || null,
        event_type: 'Technology Conference',
        audience: 'Profesionales y entusiastas',
      })
      notify.success('IA completada', 'Descripción lista para revisar')
      return response.generated_description
    } catch (err) {
      notify.error('IA no disponible', getErrorMessage(err, 'No se pudo generar'))
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return { generate, isGenerating }
}
