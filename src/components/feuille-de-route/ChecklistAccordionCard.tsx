import { useState } from "react"
import { ChevronRight } from "lucide-react"

import type { Checklist } from "@/types/domain"
import { useChecklistItems, useToggleChecklistItem } from "@/hooks/queries/use-checklists"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export function ChecklistAccordionCard({ checklist }: { checklist: Checklist }) {
  const [open, setOpen] = useState(false)
  const { data: items, isLoading } = useChecklistItems(checklist.id)
  const toggleItem = useToggleChecklistItem()

  const total = items?.length ?? 0
  const doneCount = items?.filter((item) => item.isDone).length ?? 0
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0

  return (
    <Card>
      <button type="button" className="w-full text-left" onClick={() => setOpen((o) => !o)}>
        <CardHeader className="flex-row items-center justify-between gap-2 py-3">
          <div className="flex items-center gap-2">
            <ChevronRight className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
            <CardTitle className="font-heading text-sm">{checklist.title}</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground">
            {doneCount} / {total}
          </span>
        </CardHeader>
      </button>
      {open ? (
        <CardContent className="space-y-3 pt-0">
          <Progress value={progress} />
          {isLoading ? (
            <Skeleton className="h-16 rounded-lg" />
          ) : (
            <ul className="space-y-1.5">
              {items?.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={item.id}
                    checked={item.isDone}
                    onCheckedChange={(checked) =>
                      toggleItem.mutate({ itemId: item.id, isDone: checked === true })
                    }
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
          )}
        </CardContent>
      ) : null}
    </Card>
  )
}
