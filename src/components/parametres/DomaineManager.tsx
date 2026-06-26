import { useState } from "react"
import { Pencil, Plus, User, X } from "lucide-react"
import { toast } from "sonner"

import { useCreateDomaine, useUpdateDomaine } from "@/hooks/queries/use-domaines"
import { usePoles } from "@/hooks/queries/use-poles"
import { usePeople } from "@/hooks/queries/use-people"
import { useGuests } from "@/hooks/queries/use-guests"
import {
  useCreateDomaineResponsable,
  useDeleteDomaineResponsable,
  useDomaineResponsables,
} from "@/hooks/queries/use-domaine-responsables"
import type { Domaine, DomaineResponsable, DomainePhase, PlanningMilestone } from "@/types/domain"
import { MILESTONE_LABELS, MILESTONE_ORDER, DOMAINE_PHASE_LABELS, DOMAINE_PHASE_ORDER } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { ResponsablePicker } from "@/components/parametres/ResponsablePicker"

const NONE = "__none__"

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function DomaineDialog({ domaine, initialPoleId }: { domaine?: Domaine; initialPoleId?: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(domaine?.name ?? "")
  const [description, setDescription] = useState(domaine?.description ?? "")
  const [poleId, setPoleId] = useState(domaine?.poleId ?? initialPoleId ?? NONE)
  const [phase, setPhase] = useState<DomainePhase | typeof NONE>(domaine?.phase ?? NONE)
  const [milestone, setMilestone] = useState<PlanningMilestone | typeof NONE>(domaine?.solicitedMilestone ?? NONE)
  const [contactId, setContactId] = useState(domaine?.preferredContactId ?? NONE)
  const { data: poles } = usePoles()
  const { data: people } = usePeople()
  const fiances = (people ?? []).filter((p) => p.role === "fiance")
  const createDomaine = useCreateDomaine()
  const updateDomaine = useUpdateDomaine()

  async function handleSubmit() {
    if (!name.trim()) return
    const patch = {
      poleId: poleId === NONE ? null : poleId,
      description: description.trim() || null,
      phase: phase === NONE ? null : phase,
      solicitedMilestone: milestone === NONE ? null : milestone,
      preferredContactId: contactId === NONE ? null : contactId,
    }
    if (domaine) {
      await updateDomaine.mutateAsync({ id: domaine.id, patch: { name, slug: slugify(name), ...patch } })
      toast.success("Domaine mis à jour.")
    } else {
      await createDomaine.mutateAsync({ name, slug: slugify(name), sortOrder: 99, ...patch })
      toast.success("Domaine créé.")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {domaine ? (
          <Button variant="ghost" size="icon-xs" aria-label="Modifier">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon-xs" aria-label="Ajouter un domaine">
            <Plus className="size-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">{domaine ? "Modifier le domaine" : "Nouveau domaine"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="domaine-name">Nom</FieldLabel>
            <Input
              id="domaine-name"
              placeholder="Ex. Acheter et stocker les boissons"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="domaine-description">Description</FieldLabel>
            <Textarea
              id="domaine-description"
              rows={4}
              placeholder="En quoi consiste ce domaine, pour la personne qui le découvre."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Pôle</FieldLabel>
            <Select value={poleId} onValueChange={setPoleId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucun</SelectItem>
                {poles?.map((pole) => (
                  <SelectItem key={pole.id} value={pole.id}>
                    {pole.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Phase</FieldLabel>
            <Select value={phase} onValueChange={(value: DomainePhase | typeof NONE) => setPhase(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucune" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucune</SelectItem>
                {DOMAINE_PHASE_ORDER.map((value) => (
                  <SelectItem key={value} value={value}>
                    {DOMAINE_PHASE_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Milestone de sollicitation</FieldLabel>
            <Select value={milestone} onValueChange={(value: PlanningMilestone | typeof NONE) => setMilestone(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucun</SelectItem>
                {MILESTONE_ORDER.map((value) => (
                  <SelectItem key={value} value={value}>
                    {MILESTONE_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Contact préféré</FieldLabel>
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucun</SelectItem>
                {fiances.map((fiance) => (
                  <SelectItem key={fiance.id} value={fiance.id}>
                    {fiance.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>{domaine ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ResponsablesList({ domaineId, responsables }: { domaineId: string; responsables: DomaineResponsable[] }) {
  const { data: people } = usePeople()
  const { data: guests } = useGuests()
  const createResponsable = useCreateDomaineResponsable()
  const deleteResponsable = useDeleteDomaineResponsable()

  function nameFor(r: DomaineResponsable) {
    if (r.personId) return people?.find((p) => p.id === r.personId)?.fullName ?? "Fiancé(e)"
    return guests?.find((g) => g.id === r.guestId)?.fullName ?? "Invité"
  }

  async function handleAdd(selection: { personId?: string | null; guestId?: string | null }) {
    await createResponsable.mutateAsync({
      domaineId,
      rank: responsables.length === 0 ? "principal" : "secondaire",
      ...selection,
    })
    toast.success("Responsable ajouté.")
  }

  return (
    <div className="space-y-2 pl-3">
      {responsables.map((r) => (
        <div key={r.id} className="flex items-center gap-2">
          <Badge className="bg-dore/20 text-brun">
            {nameFor(r)}
            {r.rank === "secondaire" ? " (secondaire)" : ""}
          </Badge>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Retirer"
            onClick={() => deleteResponsable.mutate(r.id)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <ResponsablePicker
        placeholder="Ajouter un responsable..."
        excludePersonIds={responsables.map((r) => r.personId).filter((id): id is string => !!id)}
        excludeGuestIds={responsables.map((r) => r.guestId).filter((id): id is string => !!id)}
        onSelect={handleAdd}
      />
    </div>
  )
}

export function DomaineResponsablesDialog({ domaine }: { domaine: Domaine }) {
  const [open, setOpen] = useState(false)
  const { data: responsables } = useDomaineResponsables()
  const domaineResponsables = (responsables ?? []).filter((r) => r.domaineId === domaine.id)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label="Désigner un responsable">
          <User className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Responsables — {domaine.name}</DialogTitle>
        </DialogHeader>
        <ResponsablesList domaineId={domaine.id} responsables={domaineResponsables} />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
