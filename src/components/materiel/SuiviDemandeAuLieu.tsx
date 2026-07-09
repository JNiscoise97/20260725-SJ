import { CheckCircle2, Circle } from "lucide-react"

import type { EquipmentItem } from "@/types/domain"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Props {
  items: EquipmentItem[]
  onUpdate: (id: string, patch: Partial<EquipmentItem>) => void
}

export function SuiviDemandeAuLieu({ items, onUpdate }: Props) {
  const demandeLieu = items
    .filter((i) => i.status === "a_demander_lieu")
    .sort((a, b) => Number(b.demandeAuLieuFaite ?? false) - Number(a.demandeAuLieuFaite ?? false) || a.label.localeCompare(b.label))

  const done = demandeLieu.filter((i) => i.demandeAuLieuFaite).length
  const total = demandeLieu.length

  if (total === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        Aucun article à demander au lieu.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {done} / {total} demande{total > 1 ? "s" : ""} faite{done > 1 ? "s" : ""}
      </p>

      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {demandeLieu.map((item) => {
          const done = !!item.demandeAuLieuFaite
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onUpdate(item.id, { demandeAuLieuFaite: !done })}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                done && "bg-vert-vegetal/5"
              )}
            >
              {done ? (
                <CheckCircle2 className="size-5 shrink-0 text-vert-vegetal" />
              ) : (
                <Circle className="size-5 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-medium", done && "text-muted-foreground line-through")}>
                  {item.label}
                </p>
                {item.notes ? <p className="mt-0.5 text-xs text-muted-foreground">{item.notes}</p> : null}
              </div>
              <Badge variant="outline" className="shrink-0 text-xs font-normal">
                {item.category}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}
