import { useMemo, useState } from "react"
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Camera, GripVertical, Pencil, Plus, Star, Trash2, Users } from "lucide-react"
import { toast } from "sonner"

import type { Guest, PhotoGroup, PhotoGroupMember, PhotoGroupStatus } from "@/types/domain"
import { useGuests } from "@/hooks/queries/use-guests"
import {
  useAddPhotoGroupMember,
  useAllPhotoGroupMembers,
  useCreatePhotoGroup,
  useDeletePhotoGroup,
  usePhotoGroups,
  useRemovePhotoGroupMember,
  useReorderPhotoGroups,
  useUpdatePhotoGroup,
} from "@/hooks/queries/use-photo-groups"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/EmptyState"

const STATUS_LABELS: Record<PhotoGroupStatus, string> = {
  pending: "À faire",
  done: "Faite",
  skipped: "Passée",
}

function GroupDialog({ group, nextSortOrder }: { group?: PhotoGroup; nextSortOrder?: number }) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState(group?.label ?? "")
  const [notes, setNotes] = useState(group?.notes ?? "")
  const [isPriority, setIsPriority] = useState(group?.isPriority ?? false)
  const createGroup = useCreatePhotoGroup()
  const updateGroup = useUpdatePhotoGroup()

  function resetForCreate() {
    setLabel("")
    setNotes("")
    setIsPriority(false)
  }

  async function handleSubmit() {
    if (!label.trim()) return
    if (group) {
      await updateGroup.mutateAsync({
        id: group.id,
        patch: { label: label.trim(), notes: notes.trim() || null, isPriority },
      })
      toast.success("Groupe mis à jour.")
    } else {
      await createGroup.mutateAsync({
        label: label.trim(),
        notes: notes.trim() || null,
        isPriority,
        status: "pending",
        sortOrder: nextSortOrder ?? 0,
      })
      toast.success("Groupe créé.")
      resetForCreate()
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {group ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-xs" aria-label="Modifier le groupe">
                <Pencil className="size-3.5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Modifier</TooltipContent>
        </Tooltip>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-3.5" />
            Nouveau groupe
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">{group ? "Modifier le groupe" : "Nouveau groupe de photo"}</DialogTitle>
          <DialogDescription>
            Les fiancés sont sur chaque photo de groupe : décrivez seulement le reste du groupe attendu.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="pg-label">Nom du groupe</FieldLabel>
            <Input
              id="pg-label"
              placeholder="Ex. Famille proche de Sarah"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="pg-notes">Notes (optionnel)</FieldLabel>
            <Textarea
              id="pg-notes"
              rows={3}
              placeholder="Ex. Inclure les grands-parents s'ils sont disponibles"
              value={notes ?? ""}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Prioritaire</p>
              <p className="text-xs text-muted-foreground">
                À signaler en premier au photographe si le temps manque le jour J.
              </p>
            </div>
            <Switch checked={isPriority} onCheckedChange={setIsPriority} />
          </div>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>{group ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmDeleteGroupButton({ group }: { group: PhotoGroup }) {
  const [open, setOpen] = useState(false)
  const deleteGroup = useDeletePhotoGroup()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon-xs" aria-label="Supprimer le groupe">
              <Trash2 className="size-3.5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Supprimer</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Supprimer ce groupe ?</DialogTitle>
          <DialogDescription>
            « {group.label} » et sa liste d'invités attendus seront définitivement supprimés.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteGroup.mutate(group.id)
              setOpen(false)
            }}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MembersDialog({ group, members, guests }: { group: PhotoGroup; members: PhotoGroupMember[]; guests: Guest[] }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const addMember = useAddPhotoGroupMember()
  const removeMember = useRemovePhotoGroupMember()

  const memberByGuestId = useMemo(() => new Map(members.map((m) => [m.guestId, m])), [members])
  const query = search.trim().toLowerCase()
  const filteredGuests = useMemo(
    () =>
      guests
        .filter((g) => !query || g.fullName.toLowerCase().includes(query))
        .sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [guests, query]
  )

  const allFilteredSelected = filteredGuests.length > 0 && filteredGuests.every((g) => memberByGuestId.has(g.id))

  function toggle(guestId: string) {
    const existing = memberByGuestId.get(guestId)
    if (existing) removeMember.mutate(existing.id)
    else addMember.mutate({ photoGroupId: group.id, guestId })
  }

  async function toggleAllFiltered() {
    if (allFilteredSelected) {
      await Promise.all(
        filteredGuests.map((g) => {
          const existing = memberByGuestId.get(g.id)
          return existing ? removeMember.mutateAsync(existing.id) : Promise.resolve()
        })
      )
    } else {
      await Promise.all(
        filteredGuests
          .filter((g) => !memberByGuestId.has(g.id))
          .map((g) => addMember.mutateAsync({ photoGroupId: group.id, guestId: g.id }))
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2 text-xs">
              <Users className="size-3.5" />
              {members.length}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Invités attendus sur cette photo</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Invités attendus — {group.label}</DialogTitle>
          <DialogDescription>
            Les fiancés sont déjà comptés sur chaque photo. Sélectionnez ici les invités à appeler.
          </DialogDescription>
        </DialogHeader>
        <Input placeholder="Rechercher un invité..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <label className="flex items-center gap-2 rounded-md border border-dashed border-border px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted/50">
          <Checkbox checked={allFilteredSelected} onCheckedChange={toggleAllFiltered} />
          <span>
            {allFilteredSelected ? "Tout désélectionner" : "Tout sélectionner"} ({filteredGuests.length})
          </span>
        </label>
        <ScrollArea className="h-72 rounded-md border border-border">
          <div className="space-y-0.5 p-2">
            {filteredGuests.map((guest) => (
              <label
                key={guest.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
              >
                <Checkbox checked={memberByGuestId.has(guest.id)} onCheckedChange={() => toggle(guest.id)} />
                <span className="truncate text-foreground">{guest.fullName}</span>
              </label>
            ))}
            {filteredGuests.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">Aucun invité trouvé.</p>
            ) : null}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-2">
          <Button onClick={() => setOpen(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function GroupRow({ group, members, guests }: { group: PhotoGroup; members: PhotoGroupMember[]; guests: Guest[] }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const updateGroup = useUpdatePhotoGroup()

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border border-border p-2.5",
        isDragging && "opacity-50"
      )}
    >
      <button
        type="button"
        aria-label="Réordonner"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" />
      </button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={group.isPriority ? "Retirer la priorité" : "Marquer prioritaire"}
            onClick={() => updateGroup.mutate({ id: group.id, patch: { isPriority: !group.isPriority } })}
          >
            <Star className={cn("size-3.5", group.isPriority ? "fill-dore text-dore" : "text-muted-foreground")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{group.isPriority ? "Prioritaire" : "Marquer prioritaire"}</TooltipContent>
      </Tooltip>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{group.label}</p>
        {group.notes ? <p className="truncate text-xs text-muted-foreground">{group.notes}</p> : null}
      </div>

      <Select
        value={group.status}
        onValueChange={(value: PhotoGroupStatus) => updateGroup.mutate({ id: group.id, patch: { status: value } })}
      >
        <SelectTrigger size="sm" className="h-7 w-28 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(STATUS_LABELS) as PhotoGroupStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <MembersDialog group={group} members={members} guests={guests} />
      <GroupDialog group={group} />
      <ConfirmDeleteGroupButton group={group} />
    </div>
  )
}

export function PhotoGroupsManager() {
  const { data: groups, isLoading: groupsLoading } = usePhotoGroups()
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: members, isLoading: membersLoading } = useAllPhotoGroupMembers()
  const reorderGroups = useReorderPhotoGroups()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const isLoading = groupsLoading || guestsLoading || membersLoading

  const sortedGroups = useMemo(() => [...(groups ?? [])].sort((a, b) => a.sortOrder - b.sortOrder), [groups])

  const membersByGroupId = useMemo(() => {
    const map = new Map<string, PhotoGroupMember[]>()
    for (const m of members ?? []) {
      const list = map.get(m.photoGroupId) ?? []
      list.push(m)
      map.set(m.photoGroupId, list)
    }
    return map
  }, [members])

  const uncoveredGuests = useMemo(() => {
    const coveredIds = new Set((members ?? []).map((m) => m.guestId))
    return (guests ?? []).filter((g) => !coveredIds.has(g.id))
  }, [guests, members])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sortedGroups.findIndex((g) => g.id === active.id)
    const newIndex = sortedGroups.findIndex((g) => g.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove(sortedGroups, oldIndex, newIndex).map((g, index) => ({ ...g, sortOrder: index }))
    reorderGroups.mutate(reordered)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 font-heading text-base">
            <Camera className="size-4" />
            Photos de groupe
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Séquencement des photos de groupe pour le jour J — les fiancés sont sur chaque photo.
          </p>
        </div>
        <GroupDialog nextSortOrder={sortedGroups.length} />
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <>
            {uncoveredGuests.length > 0 ? (
              <div className="space-y-1.5 rounded-xl border border-dashed border-bordeaux/40 bg-bordeaux/5 p-3">
                <p className="text-sm font-medium text-bordeaux">
                  {uncoveredGuests.length} invité{uncoveredGuests.length === 1 ? "" : "s"} sans photo de groupe
                </p>
                <p className="text-xs text-muted-foreground">{uncoveredGuests.map((g) => g.fullName).join(", ")}</p>
              </div>
            ) : (guests?.length ?? 0) > 0 && sortedGroups.length > 0 ? (
              <p className="text-xs text-vert-vegetal">Tous les invités sont couverts par au moins un groupe. 🎉</p>
            ) : null}

            {sortedGroups.length === 0 ? (
              <EmptyState icon={Camera} title="Aucun groupe de photo pour l'instant" />
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortedGroups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {sortedGroups.map((group) => (
                      <GroupRow
                        key={group.id}
                        group={group}
                        members={membersByGroupId.get(group.id) ?? []}
                        guests={guests ?? []}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
