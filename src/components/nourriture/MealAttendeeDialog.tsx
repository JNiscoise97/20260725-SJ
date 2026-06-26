import { useState } from "react"
import { toast } from "sonner"

import type { MealChoice } from "@/types/domain"
import type { MealAttendee } from "@/lib/meal-attendees"
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

const NONE = "__none__"

export interface MealAttendeePatch {
  mealChoice: MealChoice | null
  dietaryConstraints: string | null
  allergies: string | null
}

interface MealAttendeeFormProps {
  attendee: MealAttendee
  onSave: (patch: MealAttendeePatch) => Promise<void>
  onClose: () => void
}

function MealAttendeeForm({ attendee, onSave, onClose }: MealAttendeeFormProps) {
  const [mealChoice, setMealChoice] = useState(attendee.mealChoice ?? NONE)
  const [dietary, setDietary] = useState(attendee.dietaryConstraints ?? "")
  const [allergies, setAllergies] = useState(attendee.allergies ?? "")
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    try {
      await onSave({
        mealChoice: mealChoice === NONE ? null : (mealChoice as MealChoice),
        dietaryConstraints: dietary || null,
        allergies: allergies || null,
      })
      toast.success(`${attendee.fullName} mis à jour.`)
      onClose()
    } catch {
      toast.error("Échec de l'enregistrement.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading">{attendee.fullName}</DialogTitle>
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
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          Enregistrer
        </Button>
      </DialogFooter>
    </>
  )
}

interface MealAttendeeDialogProps {
  attendee: MealAttendee | null
  onOpenChange: (open: boolean) => void
  onSave: (attendee: MealAttendee, patch: MealAttendeePatch) => Promise<void>
}

export function MealAttendeeDialog({ attendee, onOpenChange, onSave }: MealAttendeeDialogProps) {
  return (
    <Dialog open={attendee !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {attendee ? (
          <MealAttendeeForm
            key={attendee.id}
            attendee={attendee}
            onSave={(patch) => onSave(attendee, patch)}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
