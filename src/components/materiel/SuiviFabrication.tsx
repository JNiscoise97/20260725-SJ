import { useState } from "react"

import type { EquipmentItem, FabricationStatut } from "@/types/domain"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const FABRICATION_LABELS: Record<FabricationStatut, string> = {
  non_commence: "Non commencé",
  en_cours: "En cours",
  termine: "Terminé",
}

const FABRICATION_CLASS: Record<FabricationStatut, string> = {
  non_commence: "bg-muted text-muted-foreground",
  en_cours: "bg-dore/20 text-brun",
  termine: "bg-vert-vegetal/15 text-vert-vegetal",
}

const STATUT_ORDER: FabricationStatut[] = ["non_commence", "en_cours", "termine"]

const NONE = "__none__"

function NotesField({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [local, setLocal] = useState(value)
  return (
    <Field>
      <FieldLabel className="text-xs">Notes / Avancement</FieldLabel>
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => onSave(local)}
        placeholder="Ex. Panneau de bois acheté, peinture à faire…"
        className="h-8 text-xs"
      />
    </Field>
  )
}

function FabricationCard({
  item,
  onUpdate,
}: {
  item: EquipmentItem
  onUpdate: (patch: Partial<EquipmentItem>) => void
}) {
  const statut = item.fabricationStatut ?? null
  const isDone = statut === "termine"

  return (
    <div
      className={cn(
        "rounded-xl border p-4 space-y-3",
        isDone ? "border-vert-vegetal/30 bg-vert-vegetal/5" : "border-border bg-card"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className={cn("flex-1 font-medium text-foreground", isDone && "text-muted-foreground line-through")}>
          {item.label}
        </p>
        {statut ? (
          <Badge className={cn("text-xs font-medium", FABRICATION_CLASS[statut])}>
            {FABRICATION_LABELS[statut]}
          </Badge>
        ) : null}
        <Badge variant="outline" className="text-xs font-normal">
          {item.category}
        </Badge>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44 shrink-0">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Statut de fabrication</p>
          <Select
            value={statut ?? NONE}
            onValueChange={(v) =>
              onUpdate({ fabricationStatut: v === NONE ? null : (v as FabricationStatut) })
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Non défini" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Non défini</SelectItem>
              {STATUT_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {FABRICATION_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <NotesField
            value={item.notes ?? ""}
            onSave={(v) => onUpdate({ notes: v || null })}
          />
        </div>
      </div>
    </div>
  )
}

interface Props {
  items: EquipmentItem[]
  onUpdate: (id: string, patch: Partial<EquipmentItem>) => void
}

export function SuiviFabrication({ items, onUpdate }: Props) {
  const fabItems = items
    .filter((i) => i.status === "a_fabriquer")
    .sort((a, b) => {
      const aIdx = STATUT_ORDER.indexOf(a.fabricationStatut ?? "non_commence")
      const bIdx = STATUT_ORDER.indexOf(b.fabricationStatut ?? "non_commence")
      if (aIdx !== bIdx) return aIdx - bIdx
      return a.label.localeCompare(b.label)
    })

  const done = fabItems.filter((i) => i.fabricationStatut === "termine").length
  const inProgress = fabItems.filter((i) => i.fabricationStatut === "en_cours").length
  const total = fabItems.length

  if (total === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        Aucun article à fabriquer.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{total} article{total > 1 ? "s" : ""} au total</span>
        {inProgress > 0 ? (
          <span className="text-dore">{inProgress} en cours</span>
        ) : null}
        <span className="text-vert-vegetal">{done} terminé{done > 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-3">
        {fabItems.map((item) => (
          <FabricationCard key={item.id} item={item} onUpdate={(patch) => onUpdate(item.id, patch)} />
        ))}
      </div>
    </div>
  )
}
