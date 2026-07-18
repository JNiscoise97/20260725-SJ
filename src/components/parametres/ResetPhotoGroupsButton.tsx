import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { useResetPhotoGroups } from "@/hooks/queries/use-photo-groups"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ResetPhotoGroupsButton() {
  const [open, setOpen] = useState(false)
  const reset = useResetPhotoGroups()

  async function handleConfirm() {
    await reset.mutateAsync()
    toast.success("Toutes les photos ont été remises en attente.")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RotateCcw className="size-4" />
          Recommencer les photos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Recommencer les photos ?</DialogTitle>
          <DialogDescription>
            Toutes les photos marquées comme prises ou passées seront remises en attente, et les notes effacées. Utile
            pour une répétition ou un nouveau jour J.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={reset.isPending}>
            Recommencer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
