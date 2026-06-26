import { useState } from "react"
import { toast } from "sonner"

import type { Guest, MealChoice } from "@/types/domain"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateGuest } from "@/hooks/queries/use-guests"

const NONE = "__none__"

function GuestMealForm({ guest, onClose }: { guest: Guest; onClose: () => void }) {
  const updateGuest = useUpdateGuest()
  const [mealChoice, setMealChoice] = useState(guest.mealChoice ?? NONE)
  const [dietary, setDietary] = useState(guest.dietaryConstraints ?? "")
  const [allergies, setAllergies] = useState(guest.allergies ?? "")

  async function handleSave() {
    try {
      await updateGuest.mutateAsync({
        id: guest.id,
        patch: {
          mealChoice: mealChoice === NONE ? null : (mealChoice as MealChoice),
          dietaryConstraints: dietary || null,
          allergies: allergies || null,
        },
      })
      toast.success("Invité mis à jour.")
      onClose()
    } catch {
      toast.error("Échec de l'enregistrement.")
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading">{guest.fullName}</DialogTitle>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <FieldLabel>Plat choisi</FieldLabel>
          <Select value={mealChoice} onValueChange={setMealChoice}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Non renseigné" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Non renseigné</SelectItem>
              <SelectItem value="poulet">Poulet</SelectItem>
              <SelectItem value="poisson">Poisson</SelectItem>
              <SelectItem value="enfant">Menu enfant</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="dietary">Régime alimentaire</FieldLabel>
          <Input
            id="dietary"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="Ex. pas de porc"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="allergies">Allergies</FieldLabel>
          <Input
            id="allergies"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Ex. crustacés"
          />
        </Field>
      </FieldGroup>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSave} disabled={updateGuest.isPending}>
          Enregistrer
        </Button>
      </DialogFooter>
    </>
  )
}

interface GuestMealDialogProps {
  guest: Guest | null
  onOpenChange: (open: boolean) => void
}

export function GuestMealDialog({ guest, onOpenChange }: GuestMealDialogProps) {
  return (
    <Dialog open={guest !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {guest ? <GuestMealForm key={guest.id} guest={guest} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  )
}
