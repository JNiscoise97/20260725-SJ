import { useState } from "react"
import { toast } from "sonner"

import { useCreatePrestataire, useDeletePrestataire, useUpdatePrestataire } from "@/hooks/queries/use-prestataires"
import type { MealChoice, Prestataire } from "@/types/domain"
import { MEAL_CHOICE_LABELS } from "@/lib/meal-choice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const NONE = "__none__"

function formFromPrestataire(prestataire?: Prestataire | null) {
  return prestataire
    ? {
        name: prestataire.name,
        company: prestataire.company ?? "",
        role: prestataire.role ?? "",
        needsMeal: prestataire.needsMeal,
        mealChoice: prestataire.mealChoice ?? NONE,
        dietary: prestataire.dietaryConstraints ?? "",
        allergies: prestataire.allergies ?? "",
        notes: prestataire.notes ?? "",
      }
    : {
        name: "",
        company: "",
        role: "",
        needsMeal: false,
        mealChoice: NONE,
        dietary: "",
        allergies: "",
        notes: "",
      }
}

interface PrestataireFormProps {
  prestataire?: Prestataire | null
  onClose: () => void
}

function PrestataireForm({ prestataire, onClose }: PrestataireFormProps) {
  const [form, setForm] = useState(() => formFromPrestataire(prestataire))
  const createPrestataire = useCreatePrestataire()
  const updatePrestataire = useUpdatePrestataire()
  const deletePrestataire = useDeletePrestataire()

  async function handleSubmit() {
    if (!form.name.trim()) return
    const payload = {
      name: form.name,
      company: form.company.trim() || null,
      role: form.role.trim() || null,
      needsMeal: form.needsMeal,
      mealChoice: form.needsMeal && form.mealChoice !== NONE ? (form.mealChoice as MealChoice) : null,
      dietaryConstraints: form.dietary.trim() || null,
      allergies: form.allergies.trim() || null,
      notes: form.notes.trim() || null,
    }
    if (prestataire) {
      await updatePrestataire.mutateAsync({ id: prestataire.id, patch: payload })
      toast.success("Prestataire mis à jour.")
    } else {
      await createPrestataire.mutateAsync(payload)
      toast.success("Prestataire ajouté.")
    }
    onClose()
  }

  async function handleDelete() {
    if (!prestataire) return
    await deletePrestataire.mutateAsync(prestataire.id)
    toast.success("Prestataire supprimé.")
    onClose()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading">
          {prestataire ? "Modifier le prestataire" : "Nouveau prestataire"}
        </DialogTitle>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="prestataire-name">Nom</FieldLabel>
          <Input
            id="prestataire-name"
            placeholder="Ex. Camille"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="prestataire-role">Rôle</FieldLabel>
          <Input
            id="prestataire-role"
            placeholder="Ex. Photographe"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="prestataire-company">Société / devis</FieldLabel>
          <Input
            id="prestataire-company"
            placeholder="Ex. Studio Lumière"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          />
        </Field>
        <Field className="flex-row items-center justify-between">
          <FieldLabel htmlFor="prestataire-needs-meal">Mange avec nous</FieldLabel>
          <Switch
            id="prestataire-needs-meal"
            checked={form.needsMeal}
            onCheckedChange={(needsMeal) => setForm((f) => ({ ...f, needsMeal }))}
          />
        </Field>
        {form.needsMeal ? (
          <>
            <Field>
              <FieldLabel>Plat choisi</FieldLabel>
              <Select value={form.mealChoice} onValueChange={(mealChoice) => setForm((f) => ({ ...f, mealChoice }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Non renseigné" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Non renseigné</SelectItem>
                  {(Object.keys(MEAL_CHOICE_LABELS) as MealChoice[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {MEAL_CHOICE_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="prestataire-dietary">Régime alimentaire</FieldLabel>
              <Input
                id="prestataire-dietary"
                value={form.dietary}
                onChange={(e) => setForm((f) => ({ ...f, dietary: e.target.value }))}
                placeholder="Ex. pas de porc"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="prestataire-allergies">Allergies</FieldLabel>
              <Input
                id="prestataire-allergies"
                value={form.allergies}
                onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
                placeholder="Ex. crustacés"
              />
            </Field>
          </>
        ) : null}
        <Field>
          <FieldLabel htmlFor="prestataire-notes">Notes</FieldLabel>
          <Textarea
            id="prestataire-notes"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </Field>
      </FieldGroup>
      <DialogFooter className="mt-4">
        {prestataire ? (
          <Button variant="outline" onClick={handleDelete} className="mr-auto text-destructive">
            Supprimer
          </Button>
        ) : null}
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>{prestataire ? "Enregistrer" : "Créer"}</Button>
      </DialogFooter>
    </>
  )
}

interface PrestataireFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prestataire?: Prestataire | null
}

export function PrestataireFormDialog({ open, onOpenChange, prestataire }: PrestataireFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {open ? (
          <PrestataireForm
            key={prestataire?.id ?? "create"}
            prestataire={prestataire}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
