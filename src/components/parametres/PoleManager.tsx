import { useState } from "react"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"

import { useCreatePole, useUpdatePole } from "@/hooks/queries/use-poles"
import type { Pole } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

export function PoleDialog({ pole }: { pole?: Pole }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(pole?.name ?? "")
  const createPole = useCreatePole()
  const updatePole = useUpdatePole()

  async function handleSubmit() {
    if (!name.trim()) return
    if (pole) {
      await updatePole.mutateAsync({ id: pole.id, patch: { name } })
      toast.success("Pôle mis à jour.")
    } else {
      await createPole.mutateAsync({ name, sortOrder: 99 })
      toast.success("Pôle créé.")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {pole ? (
          <Button variant="ghost" size="icon-xs" aria-label="Modifier">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nouveau pôle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">{pole ? "Modifier le pôle" : "Nouveau pôle"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="pole-name">Nom</FieldLabel>
            <Input
              id="pole-name"
              placeholder="Ex. Logistique"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>{pole ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
