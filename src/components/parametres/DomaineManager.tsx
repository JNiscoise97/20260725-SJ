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
import { cn } from "@/lib/utils"
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

/**
 * Pastilles inline affichées directement sur la ligne du domaine dans
 * ParametresTree : le principal en premier, les secondaires ensuite, chacune
 * avec un bouton x pour retirer cette personne du domaine sans ouvrir de popup.
 */
export function ResponsablePills({ responsables }: { responsables: DomaineResponsable[] }) {
  const { data: people } = usePeople()
  const { data: guests } = useGuests()
  const deleteResponsable = useDeleteDomaineResponsable()

  function nameFor(r: DomaineResponsable) {
    if (r.personId) return people?.find((p) => p.id === r.personId)?.fullName ?? "Fiancé(e)"
    return guests?.find((g) => g.id === r.guestId)?.fullName ?? "Invité"
  }

  const sorted = [...responsables].sort((a, b) => {
    if (a.rank === b.rank) return 0
    return a.rank === "principal" ? -1 : 1
  })

  if (sorted.length === 0) return null

  return (
    <div className="flex items-center gap-1">
      {sorted.map((r) => (
        <Badge
          key={r.id}
          className={cn(
            "flex items-center gap-1 pr-0.5",
            r.rank === "principal" ? "bg-dore/30 text-brun" : "bg-muted text-muted-foreground"
          )}
        >
          {nameFor(r)}
          <button
            type="button"
            aria-label={`Retirer ${nameFor(r)}`}
            onClick={() => deleteResponsable.mutate(r.id)}
            className="rounded-full p-0.5 hover:bg-black/10"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}

export function DomaineResponsablesDialog({ domaine }: { domaine: Domaine }) {
  const [open, setOpen] = useState(false)
  const { data: responsables } = useDomaineResponsables()
  const domaineResponsables = (responsables ?? []).filter((r) => r.domaineId === domaine.id)
  const createResponsable = useCreateDomaineResponsable()

  async function handleAdd(selection: { personId?: string | null; guestId?: string | null }) {
    await createResponsable.mutateAsync({
      domaineId: domaine.id,
      rank: domaineResponsables.length === 0 ? "principal" : "secondaire",
      ...selection,
    })
    toast.success("Responsable assigné.")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label="Assigner un responsable">
          <User className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Assigner un responsable — {domaine.name}</DialogTitle>
        </DialogHeader>
        <ResponsablePicker
          placeholder="Choisir un responsable..."
          excludePersonIds={domaineResponsables.map((r) => r.personId).filter((id): id is string => !!id)}
          excludeGuestIds={domaineResponsables.map((r) => r.guestId).filter((id): id is string => !!id)}
          onSelect={handleAdd}
        />
      </DialogContent>
    </Dialog>
  )
}
