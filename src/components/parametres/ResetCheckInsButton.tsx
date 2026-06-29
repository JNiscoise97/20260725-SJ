import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { useResetCheckInsForAll } from "@/hooks/queries/use-guests"
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

export function ResetCheckInsButton() {
  const [open, setOpen] = useState(false)
  const resetAll = useResetCheckInsForAll()

  async function handleConfirm() {
    await resetAll.mutateAsync()
    toast.success("Toutes les présences ont été réinitialisées.")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RotateCcw className="size-4" />
          Réinitialiser les présences
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Réinitialiser les présences ?</DialogTitle>
          <DialogDescription>
            Tous les invités pointés arrivés depuis l&apos;accueil seront remis « pas encore arrivés ». Utile pour
            préparer une répétition ou un nouveau jour J.
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
