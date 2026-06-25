import type { ChecklistOwnerType } from "@/types/domain"
import { useChecklistsForOwner, useChecklistItems, useToggleChecklistItem } from "@/hooks/queries/use-checklists"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface ChecklistWidgetProps {
  ownerType: ChecklistOwnerType
  ownerId: string
}

function SingleChecklist({ checklistId, title }: { checklistId: string; title: string }) {
  const { data: items, isLoading } = useChecklistItems(checklistId)
  const toggleItem = useToggleChecklistItem()

  if (isLoading || !items) return <Skeleton className="h-20 rounded-xl" />

  const doneCount = items.filter((item) => item.isDone).length
  const progress = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <span className="text-xs text-muted-foreground">
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

export function ChecklistWidget({ ownerType, ownerId }: ChecklistWidgetProps) {
  const { data: checklists, isLoading } = useChecklistsForOwner(ownerType, ownerId)

  if (isLoading) return <Skeleton className="h-24 rounded-xl" />
  if (!checklists || checklists.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune checklist pour le moment.</p>
  }

  return (
    <div className="space-y-4">
      {checklists.map((checklist) => (
        <SingleChecklist key={checklist.id} checklistId={checklist.id} title={checklist.title} />
      ))}
    </div>
  )
}
