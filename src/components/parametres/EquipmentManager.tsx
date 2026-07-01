import { useMemo, useState } from "react"
import { Package, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import type { EquipmentItem } from "@/types/domain"
import {
  useCreateEquipmentItem,
  useDeleteEquipmentItem,
  useEquipment,
  useUpdateEquipmentItem,
} from "@/hooks/queries/use-equipment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const NEW_CATEGORY = "__nouvelle_categorie__"

/** Dialogue de création/édition d'un article. */
function ItemDialog({
  item,
  categories,
  defaultCategory,
  nextSortOrder,
  compact = false,
}: {
  item?: EquipmentItem
  categories: string[]
  defaultCategory?: string
  nextSortOrder: number
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState(item?.label ?? "")
  const [notes, setNotes] = useState(item?.notes ?? "")
  const [categorySelect, setCategorySelect] = useState(item?.category ?? defaultCategory ?? categories[0] ?? "")
  const [newCategory, setNewCategory] = useState("")
  const createItem = useCreateEquipmentItem()
  const updateItem = useUpdateEquipmentItem()

  const isNewCategory = categorySelect === NEW_CATEGORY
  const effectiveCategory = isNewCategory ? newCategory.trim() : categorySelect

  function resetForCreate() {
    setLabel("")
    setNotes("")
    setCategorySelect(defaultCategory ?? categories[0] ?? "")
    setNewCategory("")
  }

  async function handleSubmit() {
    if (!label.trim() || !effectiveCategory) return
    if (item) {
      await updateItem.mutateAsync({ id: item.id, patch: { label: label.trim(), notes: notes.trim() || null, category: effectiveCategory } })
      toast.success("Article mis à jour.")
    } else {
      await createItem.mutateAsync({
        category: effectiveCategory,
        label: label.trim(),
        notes: notes.trim() || null,
        status: null,
        guestName: null,
        sortOrder: nextSortOrder,
      })
      toast.success("Article créé.")
      resetForCreate()
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {item ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-xs" aria-label="Modifier">
                <Pencil className="size-3.5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Modifier</TooltipContent>
        </Tooltip>
      ) : compact ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-xs" aria-label="Ajouter un article">
                <Plus className="size-3.5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Ajouter un article</TooltipContent>
        </Tooltip>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            Nouvel article
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">{item ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
          {!item ? (
            <DialogDescription>L'article sera ajouté à la checklist matériel.</DialogDescription>
          ) : null}
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Catégorie</FieldLabel>
            <Select value={categorySelect} onValueChange={setCategorySelect}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value={NEW_CATEGORY}>Nouvelle catégorie…</SelectItem>
              </SelectContent>
            </Select>
            {isNewCategory ? (
              <Input
                className="mt-2"
                placeholder="Nom de la catégorie"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                autoFocus
              />
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="eq-label">Libellé</FieldLabel>
            <Input
              id="eq-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex. Arche fleurie"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="eq-notes">Notes (optionnel)</FieldLabel>
            <Textarea
              id="eq-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex. Si le lieu n'en possède pas"
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!label.trim() || !effectiveCategory}>
            {item ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmDeleteButton({ item }: { item: EquipmentItem }) {
  const [open, setOpen] = useState(false)
  const deleteItem = useDeleteEquipmentItem()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon-xs" aria-label="Supprimer">
              <Trash2 className="size-3.5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Supprimer</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Supprimer cet article ?</DialogTitle>
          <DialogDescription>« {item.label} » sera définitivement supprimé de la checklist.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteItem.mutate(item.id)
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

export function EquipmentManager() {
  const { data: items, isLoading } = useEquipment()
  const [search, setSearch] = useState("")

  const { categories, grouped } = useMemo(() => {
    if (!items) return { categories: [], grouped: new Map<string, EquipmentItem[]>() }
    const query = search.trim().toLowerCase()
    const filtered = query
      ? items.filter((i) => i.label.toLowerCase().includes(query) || i.category.toLowerCase().includes(query))
      : items

    const map = new Map<string, EquipmentItem[]>()
    for (const item of filtered) {
      const list = map.get(item.category) ?? []
      list.push(item)
      map.set(item.category, list)
    }
    // Preserve original category order
    const order = [...new Set(items.map((i) => i.category))]
    const cats = order.filter((c) => map.has(c))
    return { categories: order, grouped: new Map(cats.map((c) => [c, map.get(c)!])) }
  }, [items, search])

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 font-heading text-base">
          <Package className="size-4" />
          Articles de matériel
        </CardTitle>
        <ItemDialog categories={categories} nextSortOrder={items?.length ?? 0} />
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : (
          <>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="max-w-xs"
            />
            {grouped.size === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun article ne correspond.</p>
            ) : (
              <div className="space-y-4">
                {[...grouped.entries()].map(([category, catItems]) => (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {category}
                      </h3>
                      <ItemDialog
                        categories={categories}
                        defaultCategory={category}
                        nextSortOrder={items?.filter((i) => i.category === category).length ?? 0}
                        compact
                      />
                    </div>
                    <div className="space-y-1">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-foreground">{item.label}</p>
                            {item.notes ? (
                              <p className="truncate text-xs text-muted-foreground">{item.notes}</p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <ItemDialog item={item} categories={categories} nextSortOrder={0} />
                            <ConfirmDeleteButton item={item} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
