import { toast } from 'sonner'
import { sanitizeForDisplay } from '@/lib/security/sanitize'

export const notify = {
  success: (message: string, description?: string) =>
    toast.success(message, { description: sanitizeForDisplay(description) }),

  error: (message: string, description?: string) =>
    toast.error(message, { description: sanitizeForDisplay(description) }),

  warning: (message: string, description?: string) =>
    toast.warning(message, { description: sanitizeForDisplay(description) }),

  info: (message: string, description?: string) =>
    toast.info(message, { description: sanitizeForDisplay(description) }),

  promise: toast.promise,
}
