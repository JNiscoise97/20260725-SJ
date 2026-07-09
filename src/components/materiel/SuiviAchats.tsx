import { CheckCircle2, Circle } from "lucide-react"

import type { EquipmentItem } from "@/types/domain"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Props {
  items: EquipmentItem[]
  onUpdate: (id: string, patch: Partial<EquipmentItem>) => void
}

export function SuiviAchats({ items, onUpdate }: Props) {
  const achatItems = items
    .filter((i) => i.status === "a_acheter" || i.status === "achete")
    .sort((a, b) => {
      // Triés : non réceptionné en premier, puis par statut, puis alphabétique
      const aRec = Number(a.achatReceptionne ?? false)
      const bRec = Number(b.achatReceptionne ?? false)
      if (aRec !== bRec) return aRec - bRec
      return a.label.localeCompare(b.label)
    })

  const recu = achatItems.filter((i) => i.achatReceptionne).length
  const total = achatItems.length

  if (total === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        Aucun article à acheter.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {recu} / {total} article{total > 1 ? "s" : ""} réceptionné{recu > 1 ? "s" : ""}
      </p>

      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {achatItems.map((item) => {
          const recuItem = !!item.achatReceptionne
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onUpdate(item.id, { achatReceptionne: !recuItem })}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                recuItem && "bg-vert-vegetal/5"
              )}
            >
              {recuItem ? (
                <CheckCircle2 className="size-5 shrink-0 text-vert-vegetal" />
              ) : (
                <Circle className="size-5 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-medium", recuItem && "text-muted-foreground line-through")}>
                  {item.label}
                </p>
                {item.notes ? <p className="mt-0.5 text-xs text-muted-foreground">{item.notes}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {item.status === "achete" ? (
                  <Badge className="bg-vert-vegetal/15 text-xs font-normal text-vert-vegetal">Acheté</Badge>
                ) : null}
                <Badge variant="outline" className="text-xs font-normal">
                  {item.category}
                </Badge>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
