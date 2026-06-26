import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { useCreateMission, useDeleteMission, useMissions, useUpdateMission } from "@/hooks/queries/use-missions"
import { useRoleCategories } from "@/hooks/queries/use-role-categories"
import { usePeople } from "@/hooks/queries/use-people"
import type { Mission, ProgressStatus } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
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
import { StatusBadge } from "@/components/shared/StatusBadge"

const NONE = "__none__"

const STATUS_LABELS: Record<ProgressStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
  blocked: "Bloquée",
}

function MissionDialog({ mission }: { mission?: Mission }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(mission?.title ?? "")
  const [description, setDescription] = useState(mission?.description ?? "")
  const [status, setStatus] = useState<ProgressStatus>(mission?.status ?? "todo")
  const [roleCategoryId, setRoleCategoryId] = useState(mission?.roleCategoryId ?? NONE)
  const [referentId, setReferentId] = useState(mission?.referentId ?? NONE)

  const { data: roleCategories } = useRoleCategories()
  const { data: people } = usePeople()
  const referentOptions = (people ?? []).filter((p) => p.role === "referent" || p.role === "fiance")
  const createMission = useCreateMission()
  const updateMission = useUpdateMission()

  async function handleSubmit() {
    if (!title.trim()) return
    const payload = {
      title,
      description: description.trim() || null,
      status,
      roleCategoryId: roleCategoryId === NONE ? null : roleCategoryId,
      referentId: referentId === NONE ? null : referentId,
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
      <DialogTrigger asChild>
        {mission ? (
          <Button variant="ghost" size="icon-xs" aria-label="Modifier">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nouvelle mission
          </Button>
        )}
      </DialogTrigger>
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
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Catégorie</FieldLabel>
            <Select value={roleCategoryId} onValueChange={setRoleCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucune" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucune</SelectItem>
                {roleCategories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Référent (ou fiancé(e))</FieldLabel>
            <Select value={referentId} onValueChange={setReferentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucun</SelectItem>
                {referentOptions.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.fullName}
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

export function MissionManager() {
  const { data: missions, isLoading } = useMissions()
  const { data: roleCategories } = useRoleCategories()
  const { data: people } = usePeople()
  const deleteMission = useDeleteMission()

  function categoryName(id?: string | null) {
    return id ? roleCategories?.find((c) => c.id === id)?.name : undefined
  }

  function referentName(id?: string | null) {
    return id ? people?.find((p) => p.id === id)?.fullName : undefined
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-heading text-base">Missions</CardTitle>
        <MissionDialog />
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : missions?.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune mission pour l'instant.</p>
        ) : (
          missions?.map((mission) => {
            const category = categoryName(mission.roleCategoryId)
            const referent = referentName(mission.referentId)
            return (
              <div
                key={mission.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{mission.title}</span>
                    <StatusBadge status={mission.status} />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {referent ?? "Pas de responsable"}
                    {category ? ` · ${category}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MissionDialog mission={mission} />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Supprimer"
                    onClick={() => deleteMission.mutate(mission.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
