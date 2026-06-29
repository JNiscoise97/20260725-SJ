import type { ChecklistOwnerType, Person } from "@/types/domain"
import {
  useChecklistsForOwner,
  useChecklistItems,
  useToggleChecklistItem,
  useUpdateChecklist,
} from "@/hooks/queries/use-checklists"
import { usePeople } from "@/hooks/queries/use-people"
import { useIdentity } from "@/context/IdentityContext"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const NONE = "__none__"

interface ChecklistWidgetProps {
  ownerType: ChecklistOwnerType
  ownerId: string
  /** Permet à un fiancé de se déléguer la checklist (select Sarah/Jordan) — désactivé sur certaines pages où ça n'a pas sa place (ex. /missions). */
  allowAssignment?: boolean
}

function SingleChecklist({
  checklistId,
  title,
  showTitle,
  responsiblePersonId,
  canAssign,
  fiances,
}: {
  checklistId: string
  title: string | null
  showTitle: boolean
  responsiblePersonId: string | null
  canAssign: boolean
  fiances: Person[]
}) {
  const { data: items, isLoading } = useChecklistItems(checklistId)
  const toggleItem = useToggleChecklistItem()
  const updateChecklist = useUpdateChecklist()
  const responsible = fiances.find((f) => f.id === responsiblePersonId)

  if (isLoading || !items) return <Skeleton className="h-20 rounded-xl" />

  const doneCount = items.filter((item) => item.isDone).length
  const progress = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {showTitle ? <p className="text-sm font-medium text-foreground">{title}</p> : null}
          {canAssign ? (
            <Select
              value={responsiblePersonId ?? NONE}
              onValueChange={(value) =>
                updateChecklist.mutate({
                  id: checklistId,
                  patch: { responsiblePersonId: value === NONE ? null : value },
                })
              }
            >
              <SelectTrigger size="sm" className="h-6 w-44 border-dashed text-xs">
                <SelectValue placeholder="Assigner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Non assigné</SelectItem>
                {fiances.map((fiance) => (
                  <SelectItem key={fiance.id} value={fiance.id}>
                    {fiance.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : responsible ? (
            <Badge className="bg-bordeaux/10 text-bordeaux">{responsible.fullName}</Badge>
          ) : null}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {doneCount} / {items.length}
        </span>
      </div>
      <Progress value={progress} />
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <Checkbox
              id={item.id}
              checked={item.isDone}
              onCheckedChange={(checked) => toggleItem.mutate({ itemId: item.id, isDone: checked === true })}
            />
            <label
              htmlFor={item.id}
              className={item.isDone ? "text-sm text-muted-foreground line-through" : "text-sm text-foreground"}
            >
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ChecklistWidget({ ownerType, ownerId, allowAssignment = true }: ChecklistWidgetProps) {
  const { data: checklists, isLoading } = useChecklistsForOwner(ownerType, ownerId)
  const { data: people } = usePeople()
  const { person } = useIdentity()

  if (isLoading) return <Skeleton className="h-24 rounded-xl" />
  if (!checklists || checklists.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune checklist pour le moment.</p>
  }

  // Quand il n'y a qu'une seule checklist pour ce propriétaire, son titre fait
  // doublon avec le titre déjà affiché par l'appelant (mission, élément de
  // logistique...) — on ne le réaffiche que s'il y en a plusieurs (ex.
  // Coordinateur général, qui a 3 checklists distinctes pour la même mission).
  const showTitle = checklists.length > 1
  // Seuls les fiancés peuvent se déléguer une checklist entre eux (voir
  // 0040_checklists_responsible_person.sql) ; les référents/invités la voient
  // en lecture seule via le badge ci-dessus.
  const fiances = (people ?? []).filter((p) => p.role === "fiance")
  const canAssign = allowAssignment && person?.role === "fiance"

  return (
    <div className="space-y-4">
      {checklists.map((checklist) => (
        <SingleChecklist
          key={checklist.id}
          checklistId={checklist.id}
          title={checklist.title ?? null}
          showTitle={showTitle}
          responsiblePersonId={checklist.responsiblePersonId ?? null}
          canAssign={canAssign}
          fiances={fiances}
        />
      ))}
    </div>
  )
}
