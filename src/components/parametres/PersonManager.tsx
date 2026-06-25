import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import type { AppRole, Person } from "@/types/domain"
import { useCreatePerson, useDeletePerson, usePeople, useUpdatePerson } from "@/hooks/queries/use-people"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ROLE_LABELS: Record<AppRole, string> = {
  fiance: "Fiancé(e)",
  referent: "Référent",
  proche: "Proche",
  invite: "Invité",
}

interface PersonFormState {
  fullName: string
  phone: string
  role: AppRole
  accessCode: string
}

const EMPTY_FORM: PersonFormState = { fullName: "", phone: "", role: "proche", accessCode: "" }

function PersonDialog({ person }: { person?: Person }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<PersonFormState>(
    person
      ? {
          fullName: person.fullName,
          phone: person.phone ?? "",
          role: person.role,
          accessCode: person.accessCode,
        }
      : EMPTY_FORM
  )
  const createPerson = useCreatePerson()
  const updatePerson = useUpdatePerson()

  async function handleSubmit() {
    if (!form.fullName.trim() || !form.accessCode.trim()) return
    const payload = {
      fullName: form.fullName,
      phone: form.phone || undefined,
      role: form.role,
      accessCode: form.accessCode,
      isActive: true,
    }
    if (person) {
      await updatePerson.mutateAsync({ id: person.id, patch: payload })
      toast.success("Personne mise à jour.")
    } else {
      await createPerson.mutateAsync(payload)
      toast.success("Personne ajoutée.")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {person ? (
          <Button variant="ghost" size="icon-xs" aria-label="Modifier">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nouvelle personne
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">{person ? "Modifier" : "Nouvelle personne"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="person-name">Nom</FieldLabel>
            <Input
              id="person-name"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="person-phone">Téléphone</FieldLabel>
            <Input
              id="person-phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </Field>
          <Field>
            <FieldLabel>Rôle</FieldLabel>
            <Select value={form.role} onValueChange={(role: AppRole) => setForm((f) => ({ ...f, role }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABELS) as AppRole[]).map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="person-code">Code d&apos;accès</FieldLabel>
            <Input
              id="person-code"
              value={form.accessCode}
              onChange={(e) => setForm((f) => ({ ...f, accessCode: e.target.value.toUpperCase() }))}
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>{person ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function PersonManager() {
  const { data: people, isLoading } = usePeople()
  const deletePerson = useDeletePerson()

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-heading text-base">Personnes &amp; codes d&apos;accès</CardTitle>
        <PersonDialog />
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : (
          people?.map((person) => (
            <div key={person.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">{person.fullName}</span>
                <Badge className="bg-secondary text-secondary-foreground">{ROLE_LABELS[person.role]}</Badge>
                <span className="font-mono text-xs text-muted-foreground">{person.accessCode}</span>
              </div>
              <div className="flex items-center gap-1">
                <PersonDialog person={person} />
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Supprimer"
                  onClick={() => deletePerson.mutate(person.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
