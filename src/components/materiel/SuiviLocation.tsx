import { useState } from "react"
import { CheckCircle2, Circle } from "lucide-react"

import type { EquipmentItem } from "@/types/domain"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

function BoolToggle({
  checked,
  label,
  onToggle,
}: {
  checked: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
        checked
          ? "border-vert-vegetal/40 bg-vert-vegetal/10 text-vert-vegetal"
          : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60"
      )}
    >
      {checked ? <CheckCircle2 className="size-3.5" /> : <Circle className="size-3.5" />}
      {label}
    </button>
  )
}

function TextField({
  label,
  value,
  onSave,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onSave: (v: string) => void
  placeholder?: string
  type?: string
}) {
  const [local, setLocal] = useState(value)

  return (
    <Field>
      <FieldLabel className="text-xs">{label}</FieldLabel>
      <Input
        type={type}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => onSave(local)}
        placeholder={placeholder}
        className="h-8 text-xs"
      />
    </Field>
  )
}

function LocationCard({
  item,
  onUpdate,
}: {
  item: EquipmentItem
  onUpdate: (patch: Partial<EquipmentItem>) => void
}) {
  const reserve = !!item.locationReserve
  const livraison = !!item.locationLivraison

  return (
    <div
      className={cn(
        "rounded-xl border p-4 space-y-4",
        reserve ? "border-vert-vegetal/30 bg-vert-vegetal/5" : "border-border bg-card"
      )}
    >
      {/* En-tête */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 space-y-1">
          <p className="font-medium text-foreground">{item.label}</p>
          <Badge variant="outline" className="text-xs font-normal">
            {item.category}
          </Badge>
        </div>
        <BoolToggle
          checked={reserve}
          label="Réservé"
          onToggle={() => onUpdate({ locationReserve: !reserve })}
        />
        <BoolToggle
          checked={livraison}
          label="Livraison"
          onToggle={() => onUpdate({ locationLivraison: !livraison })}
        />
      </div>

      {/* Grille de champs */}
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Fournisseur / Loueur"
          value={item.locationFournisseur ?? ""}
          placeholder="Ex. Kiloutou, Loxam…"
          onSave={(v) => onUpdate({ locationFournisseur: v || null })}
        />
        <TextField
          label="Caution"
          value={item.locationCaution ?? ""}
          placeholder="Ex. 200 €"
          onSave={(v) => onUpdate({ locationCaution: v || null })}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border p-3">
          <p className="text-xs font-semibold text-foreground">Entrée (prise en charge)</p>
          <TextField
            label="Date et heure"
            value={item.locationEntreeAt ?? ""}
            type="datetime-local"
            onSave={(v) => onUpdate({ locationEntreeAt: v || null })}
          />
          <TextField
            label="Lieu"
            value={item.locationEntreeLieu ?? ""}
            placeholder="Ex. Agence Montpellier centre"
            onSave={(v) => onUpdate({ locationEntreeLieu: v || null })}
          />
        </div>
        <div className="space-y-2 rounded-xl border border-border p-3">
          <p className="text-xs font-semibold text-foreground">Sortie (restitution)</p>
          <TextField
            label="Date et heure"
            value={item.locationSortieAt ?? ""}
            type="datetime-local"
            onSave={(v) => onUpdate({ locationSortieAt: v || null })}
          />
          <TextField
            label="Lieu"
            value={item.locationSortieLieu ?? ""}
            placeholder="Ex. Agence Montpellier centre"
            onSave={(v) => onUpdate({ locationSortieLieu: v || null })}
          />
        </div>
      </div>

      {item.notes ? (
        <p className="text-xs italic text-muted-foreground">{item.notes}</p>
      ) : null}
    </div>
  )
}

interface Props {
  items: EquipmentItem[]
  onUpdate: (id: string, patch: Partial<EquipmentItem>) => void
}

export function SuiviLocation({ items, onUpdate }: Props) {
  const locationItems = items
    .filter((i) => i.status === "a_louer")
    .sort((a, b) => Number(b.locationReserve ?? false) - Number(a.locationReserve ?? false) || a.label.localeCompare(b.label))

  const reserved = locationItems.filter((i) => i.locationReserve).length
  const total = locationItems.length

  if (total === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        Aucun article à louer.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {reserved} / {total} réservation{total > 1 ? "s" : ""} faite{reserved > 1 ? "s" : ""}
      </p>
      <div className="space-y-4">
        {locationItems.map((item) => (
          <LocationCard key={item.id} item={item} onUpdate={(patch) => onUpdate(item.id, patch)} />
        ))}
      </div>
    </div>
  )
}
