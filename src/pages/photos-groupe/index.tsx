import { useMemo, useState } from "react"
import { Camera, CheckCircle2, PartyPopper, SkipForward, Star, TriangleAlert, Users } from "lucide-react"

import type { Guest, PhotoGroup, PhotoGroupMember, PhotoGroupStatus } from "@/types/domain"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useGuests } from "@/hooks/queries/use-guests"
import {
  useAllPhotoGroupMembers,
  usePhotoGroups,
  useUpdatePhotoGroup,
  useUpdatePhotoGroupMember,
} from "@/hooks/queries/use-photo-groups"

const STATUS_BADGE: Record<PhotoGroupStatus, { label: string; className: string }> = {
  pending: { label: "À faire", className: "bg-muted text-muted-foreground" },
  done: { label: "Faite", className: "bg-vert-vegetal/15 text-vert-vegetal" },
  skipped: { label: "Passée", className: "bg-dore/20 text-brun" },
}

export function PhotosGroupePage() {
  const { data: groups, isLoading: groupsLoading } = usePhotoGroups()
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: members, isLoading: membersLoading } = useAllPhotoGroupMembers()
  const updateGroup = useUpdatePhotoGroup()
  const updateMember = useUpdatePhotoGroupMember()
  const [overrideId, setOverrideId] = useState<string | null>(null)

  const isLoading = groupsLoading || guestsLoading || membersLoading

  const guestById = useMemo(() => new Map((guests ?? []).map((g) => [g.id, g])), [guests])

  const membersByGroupId = useMemo(() => {
    const map = new Map<string, PhotoGroupMember[]>()
    for (const m of members ?? []) {
      const list = map.get(m.photoGroupId) ?? []
      list.push(m)
      map.set(m.photoGroupId, list)
    }
    return map
  }, [members])

  // File active : photos à faire dans l'ordre, puis les photos passées (à
  // rattraper) à la fin — jamais les photos déjà faites.
  const queue = useMemo(() => {
    const sorted = [...(groups ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
    const pending = sorted.filter((g) => g.status === "pending")
    const skipped = sorted.filter((g) => g.status === "skipped")
    return [...pending, ...skipped]
  }, [groups])

  const currentGroup: PhotoGroup | undefined =
    (overrideId ? groups?.find((g) => g.id === overrideId && g.status !== "done") : undefined) ?? queue[0]

  const upcoming = queue.filter((g) => g.id !== currentGroup?.id).slice(0, 3)

  // Pour chaque invité, combien d'AUTRES photos (pas encore faites) l'attendent
  // encore — sert à savoir s'il est sûr de le libérer une fois la photo en cours terminée.
  const otherPendingCountByGuestId = useMemo(() => {
    const map = new Map<string, number>()
    for (const group of queue) {
      if (group.id === currentGroup?.id) continue
      for (const member of membersByGroupId.get(group.id) ?? []) {
        map.set(member.guestId, (map.get(member.guestId) ?? 0) + 1)
      }
    }
    return map
  }, [queue, currentGroup, membersByGroupId])

  const priorityPending = (groups ?? []).filter((g) => g.isPriority && g.status !== "done")
  const doneCount = (groups ?? []).filter((g) => g.status === "done").length
  const total = groups?.length ?? 0
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0

  function handleDone(group: PhotoGroup) {
    updateGroup.mutate({ id: group.id, patch: { status: "done" } })
    setOverrideId(null)
  }

  function handleSkip(group: PhotoGroup) {
    updateGroup.mutate({ id: group.id, patch: { status: "skipped" } })
    setOverrideId(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Photos de groupe"
        description="Appelez les groupes dans l'ordre, cochez les présents, et passez à la photo suivante."
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : total === 0 ? (
        <EmptyState
          icon={Camera}
          title="Aucun groupe de photo configuré"
          description="Les fiancés peuvent créer le séquencement depuis Paramètres."
        />
      ) : (
        <>
          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">Avancement</p>
                <span className="text-sm font-medium text-foreground">
                  {doneCount} / {total} photos faites
                </span>
              </div>
              <Progress value={percent} />
            </CardContent>
          </Card>

          {priorityPending.length > 0 ? (
            <div className="space-y-1.5 rounded-xl border border-dashed border-bordeaux/40 bg-bordeaux/5 p-3">
              <p className="flex items-center gap-1.5 text-sm font-medium text-bordeaux">
                <TriangleAlert className="size-4" />
                Prioritaires restantes — à signaler au photographe
              </p>
              <p className="text-xs text-muted-foreground">{priorityPending.map((g) => g.label).join(", ")}</p>
            </div>
          ) : (groups ?? []).some((g) => g.isPriority) ? (
            <div className="rounded-xl border border-dashed border-vert-vegetal/40 bg-vert-vegetal/5 p-3">
              <p className="text-sm font-medium text-vert-vegetal">
                Toutes les photos prioritaires sont faites — vous pouvez libérer les fiancés pour la suite.
              </p>
            </div>
          ) : null}

          {!currentGroup ? (
            <EmptyState
              icon={PartyPopper}
              title="Toutes les photos de groupe sont terminées !"
              description="Plus aucune photo en attente."
            />
          ) : (
            <Card className="border-2 border-primary/40">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="font-heading text-lg">{currentGroup.label}</CardTitle>
                  {currentGroup.isPriority ? (
                    <Badge className="bg-dore/20 text-brun">
                      <Star className="size-3" />
                      Prioritaire
                    </Badge>
                  ) : null}
                  {currentGroup.status === "skipped" ? (
                    <Badge className={STATUS_BADGE.skipped.className}>Reprise</Badge>
                  ) : null}
                </div>
                {currentGroup.notes ? <p className="text-sm text-muted-foreground">{currentGroup.notes}</p> : null}
                <p className="text-xs text-muted-foreground">Les fiancés sont sur cette photo.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <CurrentGroupMembers
                  members={membersByGroupId.get(currentGroup.id) ?? []}
                  guestById={guestById}
                  otherPendingCountByGuestId={otherPendingCountByGuestId}
                  onToggle={(memberId, isPresent) => updateMember.mutate({ id: memberId, patch: { isPresent } })}
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => handleDone(currentGroup)}>
                    <CheckCircle2 className="size-4" />
                    Photo prise
                  </Button>
                  <Button variant="outline" onClick={() => handleSkip(currentGroup)}>
                    <SkipForward className="size-4" />
                    Passer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {upcoming.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">Prochaines photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcoming.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-1.5">
                      {group.isPriority ? <Star className="size-3.5 shrink-0 fill-dore text-dore" /> : null}
                      <span className="truncate text-sm text-foreground">{group.label}</span>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3.5" />
                      {(membersByGroupId.get(group.id) ?? []).length}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Toutes les photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {[...(groups ?? [])]
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    disabled={group.status === "done"}
                    onClick={() => setOverrideId(group.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                      group.id === currentGroup?.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50 disabled:cursor-default disabled:hover:bg-transparent"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-1.5">
                      {group.isPriority ? <Star className="size-3.5 shrink-0 fill-dore text-dore" /> : null}
                      <span
                        className={cn(
                          "truncate text-sm",
                          group.status === "done" ? "text-muted-foreground line-through" : "text-foreground"
                        )}
                      >
                        {group.label}
                      </span>
                    </div>
                    <Badge className={STATUS_BADGE[group.status].className}>{STATUS_BADGE[group.status].label}</Badge>
                  </button>
                ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function CurrentGroupMembers({
  members,
  guestById,
  otherPendingCountByGuestId,
  onToggle,
}: {
  members: PhotoGroupMember[]
  guestById: Map<string, Guest>
  otherPendingCountByGuestId: Map<string, number>
  onToggle: (memberId: string, isPresent: boolean) => void
}) {
  if (members.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun invité spécifique attendu pour ce groupe.</p>
  }

  const presentCount = members.filter((m) => m.isPresent).length

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        {presentCount} / {members.length} présents
      </p>
      <ul className="space-y-1.5">
        {members.map((member) => {
          const guest = guestById.get(member.guestId)
          const otherCount = otherPendingCountByGuestId.get(member.guestId) ?? 0
          return (
            <li key={member.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5">
              <label className="flex min-w-0 items-center gap-2 text-sm">
                <Checkbox
                  checked={member.isPresent}
                  onCheckedChange={(checked) => onToggle(member.id, checked === true)}
                />
                <span className="truncate text-foreground">{guest?.fullName ?? "Invité"}</span>
              </label>
              {otherCount > 0 ? (
                <Badge variant="outline" className="shrink-0 text-xs text-muted-foreground">
                  +{otherCount} autre{otherCount === 1 ? "" : "s"} photo{otherCount === 1 ? "" : "s"}
                </Badge>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
