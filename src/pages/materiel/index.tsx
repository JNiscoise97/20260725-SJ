import { useMemo, useState } from "react"
import { Package, ShoppingCart, ShoppingBag, Warehouse, UserCheck, AlertCircle } from "lucide-react"

import type { EquipmentItem, EquipmentStatus } from "@/types/domain"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatCard } from "@/components/shared/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEquipment, useUpdateEquipmentItem } from "@/hooks/queries/use-equipment"

const STATUS_NONE = "__none__"

const STATUS_LABELS: Record<EquipmentStatus, string> = {
  fourni_lieu: "Fourni par le lieu",
  apporte_invite: "Apporté par un(e) invité(e)",
  a_louer: "À louer",
  a_acheter: "À acheter",
  a_fabriquer: "À fabriquer",
  non_necessaire: "Non nécessaire",
}

const STATUS_BADGE: Record<EquipmentStatus, string> = {
  fourni_lieu: "text-vert-vegetal",
  apporte_invite: "text-dore",
  a_louer: "text-bordeaux",
  a_acheter: "text-brun",
  a_fabriquer: "text-bordeaux",
  non_necessaire: "text-muted-foreground",
}

function EquipmentRow({ item, onUpdate }: { item: EquipmentItem; onUpdate: (patch: Partial<EquipmentItem>) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{item.label}</p>
        {item.notes ? <p className="text-xs text-muted-foreground">{item.notes}</p> : null}
      </div>

      <Select
        value={item.status ?? STATUS_NONE}
        onValueChange={(value) => {
          const status = value === STATUS_NONE ? null : (value as EquipmentStatus)
          onUpdate({ status, guestName: status !== "apporte_invite" ? null : item.guestName })
        }}
      >
        <SelectTrigger size="sm" className={`h-7 w-44 shrink-0 text-xs ${item.status ? STATUS_BADGE[item.status] : "text-muted-foreground"}`}>
          <SelectValue placeholder="Non défini" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={STATUS_NONE}>Non défini</SelectItem>
          {(Object.keys(STATUS_LABELS) as EquipmentStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {item.status === "apporte_invite" ? (
        <Input
          value={item.guestName ?? ""}
          onChange={(e) => onUpdate({ guestName: e.target.value || null })}
          placeholder="Qui ?"
          className="h-7 w-36 shrink-0 text-xs"
        />
      ) : null}
    </div>
  )
}

export function MaterielPage() {
  const { data: items, isLoading } = useEquipment()
  const updateItem = useUpdateEquipmentItem()
  const [search, setSearch] = useState("")
  const [showHidden, setShowHidden] = useState(false)

  const summary = useMemo(() => {
    if (!items) return null
    const byStatus = { fourni_lieu: 0, apporte_invite: 0, a_louer: 0, a_acheter: 0, a_fabriquer: 0, non_necessaire: 0, undefined: 0 }
    for (const item of items) {
      if (item.status) byStatus[item.status]++
      else byStatus.undefined++
    }
    return { total: items.length, ...byStatus }
  }, [items])

  const categories = useMemo(() => {
    if (!items) return []
    const query = search.trim().toLowerCase()
    const filtered = items
      .filter((item) => showHidden || item.status !== "non_necessaire")
      .filter((item) => !query || item.label.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))

    const map = new Map<string, EquipmentItem[]>()
    for (const item of filtered) {
      const list = map.get(item.category) ?? []
      list.push(item)
      map.set(item.category, list)
    }
    // Preserve category order from seed (first occurrence)
    const order = [...new Set(items.map((i) => i.category))]
    return order
      .filter((cat) => map.has(cat))
      .map((cat) => ({ category: cat, items: map.get(cat)! }))
  }, [items, search, showHidden])

  function handleUpdate(id: string, patch: Partial<EquipmentItem>) {
    updateItem.mutate({ id, patch })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matériel"
        description="Checklist exhaustive du matériel à prévoir : louer, acheter, apporté par un invité ou fourni par le Grand Arbre."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState icon={Package} title="Aucun article de matériel" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={Package} label="Articles au total" value={summary!.total} />
            <StatCard
              icon={AlertCircle}
              label="Non définis"
              value={summary!.undefined}
              accentClassName="bg-bordeaux/10 text-bordeaux"
            />
            <StatCard
              icon={ShoppingCart}
              label="À louer"
              value={summary!.a_louer}
              accentClassName="bg-bordeaux/10 text-bordeaux"
            />
            <StatCard
              icon={ShoppingBag}
              label="À acheter"
              value={summary!.a_acheter}
              accentClassName="bg-bordeaux/10 text-bordeaux"
            />
            <StatCard
              icon={Warehouse}
              label="Fourni par le lieu"
              value={summary!.fourni_lieu}
              accentClassName="bg-vert-vegetal/15 text-vert-vegetal"
            />
            <StatCard
              icon={UserCheck}
              label="Apporté par un invité"
              value={summary!.apporte_invite}
              accentClassName="bg-dore/15 text-dore"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article ou une catégorie..."
              className="max-w-sm"
            />
            {summary!.non_necessaire > 0 ? (
              <button
                type="button"
                onClick={() => setShowHidden((v) => !v)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {showHidden
                  ? `Masquer les non nécessaires (${summary!.non_necessaire})`
                  : `Afficher les non nécessaires (${summary!.non_necessaire})`}
              </button>
            ) : null}
          </div>

          {categories.length === 0 ? (
            <EmptyState icon={Package} title="Aucun article ne correspond à cette recherche" />
          ) : (
            <div className="space-y-6">
              {categories.map(({ category, items: catItems }) => {
                const definedCount = catItems.filter((i) => i.status).length
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-base font-medium text-foreground">{category}</h2>
                      <span className="text-xs text-muted-foreground">
                        {definedCount} / {catItems.length} défini{definedCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {catItems.map((item) => (
                        <EquipmentRow
                          key={item.id}
                          item={item}
                          onUpdate={(patch) => handleUpdate(item.id, patch)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
