import { useState } from "react"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"

import { useCreateMission, useUpdateMission } from "@/hooks/queries/use-missions"
import { useDomaines } from "@/hooks/queries/use-domaines"
import type { Mission, ProgressStatus } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const NONE = "__none__"

const STATUS_LABELS: Record<ProgressStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
  blocked: "Bloquée",
}

export function MissionDialog({ mission, initialDomaineId }: { mission?: Mission; initialDomaineId?: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(mission?.title ?? "")
  const [description, setDescription] = useState(mission?.description ?? "")
  const [prerequisites, setPrerequisites] = useState(mission?.prerequisites ?? "")
  const [status, setStatus] = useState<ProgressStatus>(mission?.status ?? "todo")
  const [domaineId, setDomaineId] = useState(mission?.domaineId ?? initialDomaineId ?? NONE)

  const { data: domaines } = useDomaines()
  const createMission = useCreateMission()
  const updateMission = useUpdateMission()

  async function handleSubmit() {
    if (!title.trim()) return
    const payload = {
      title,
      description: description.trim() || null,
      prerequisites: prerequisites.trim() || null,
      status,
      domaineId: domaineId === NONE ? null : domaineId,
    }
    if (mission) {
      await updateMission.mutateAsync({ id: mission.id, patch: payload })
      toast.success("Mission mise à jour.")
    } else {
      await createMission.mutateAsync(payload)
      toast.success("Mission créée.")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mission ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-xs" aria-label="Modifier">
                <Pencil className="size-3.5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Modifier</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-xs" aria-label="Ajouter une mission">
                <Plus className="size-3.5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Ajouter une mission</TooltipContent>
        </Tooltip>
      )}
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">{mission ? "Modifier la mission" : "Nouvelle mission"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="mission-title">Titre</FieldLabel>
            <Input
              id="mission-title"
              placeholder="Ex. Décoration de la salle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="mission-description">Description</FieldLabel>
            <Textarea
              id="mission-description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="mission-prerequisites">Prérequis</FieldLabel>
            <Textarea
              id="mission-prerequisites"
              rows={4}
              placeholder="Ex. Avoir le permis, être disponible la veille en matinée…"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Domaine</FieldLabel>
            <Select value={domaineId} onValueChange={setDomaineId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucun</SelectItem>
                {domaines?.map((domaine) => (
                  <SelectItem key={domaine.id} value={domaine.id}>
                    {domaine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Statut</FieldLabel>
            <Select value={status} onValueChange={(value: ProgressStatus) => setStatus(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABELS) as ProgressStatus[]).map((value) => (
                  <SelectItem key={value} value={value}>
                    {STATUS_LABELS[value]}
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
          <Button onClick={handleSubmit}>{mission ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
