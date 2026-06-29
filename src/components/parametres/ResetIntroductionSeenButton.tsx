import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { useResetIntroductionSeenForAll } from "@/hooks/queries/use-guests"
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

export function ResetIntroductionSeenButton() {
  const [open, setOpen] = useState(false)
  const resetAll = useResetIntroductionSeenForAll()

  async function handleConfirm() {
    await resetAll.mutateAsync()
    toast.success("La page d'introduction sera réaffichée à la prochaine connexion de chaque invité.")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RotateCcw className="size-4" />
          Réinitialiser l'introduction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Réinitialiser l'introduction pour tout le monde ?</DialogTitle>
          <DialogDescription>
            Tous les invités (référents et invités simples) reverront la page d'introduction dès leur prochaine
            connexion, comme s'ils ne l'avaient jamais vue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>Réinitialiser</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
