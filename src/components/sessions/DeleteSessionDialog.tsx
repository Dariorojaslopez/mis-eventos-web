import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteSession } from '@/hooks/useSessions'
import type { SessionRead } from '@/types/api.types'

interface DeleteSessionDialogProps {
  eventId: string
  session: SessionRead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSessionDialog({
  eventId,
  session,
  open,
  onOpenChange,
}: DeleteSessionDialogProps) {
  const deleteMutation = useDeleteSession(eventId)

  const handleDelete = async () => {
    if (!session) return
    await deleteMutation.mutateAsync(session.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 sm:mx-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle>Eliminar sesión</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar{' '}
            <span className="font-medium text-foreground">{session?.title}</span>? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Loader2 className="animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
