import { useState } from "react"
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { useCreateTable, useDeleteTable, useTables, useUpdateTable } from "@/hooks/queries/use-seating"
import type { SeatingTable } from "@/types/domain"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

function TableDialog({ table, nextSortOrder }: { table?: SeatingTable; nextSortOrder: number }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(table?.name ?? "")
  const [capacity, setCapacity] = useState(String(table?.capacity ?? 8))
  const createTable = useCreateTable()
  const updateTable = useUpdateTable()

  async function handleSubmit() {
    const capacityNum = Number(capacity)
    if (!name.trim() || !capacityNum || capacityNum <= 0) return
    if (table) {
      await updateTable.mutateAsync({ id: table.id, patch: { name, capacity: capacityNum } })
      toast.success("Table mise à jour.")
    } else {
      await createTable.mutateAsync({ name, capacity: capacityNum, sortOrder: nextSortOrder })
      toast.success("Table créée.")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {table ? (
          <Button variant="ghost" size="icon-xs" aria-label="Modifier">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nouvelle table
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">{table ? "Modifier la table" : "Nouvelle table"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="table-name">Nom</FieldLabel>
            <Input id="table-name" placeholder="Ex. Table 1" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="table-capacity">Capacité (places)</FieldLabel>
            <Input
              id="table-capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>{table ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function BulkAddDialog({ existingCount }: { existingCount: number }) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState("4")
  const [capacity, setCapacity] = useState("8")
  const [prefix, setPrefix] = useState("Table")
  const createTable = useCreateTable()

  async function handleSubmit() {
    const countNum = Number(count)
    const capacityNum = Number(capacity)
    if (!countNum || countNum <= 0 || !capacityNum || capacityNum <= 0) return
    for (let i = 0; i < countNum; i++) {
      await createTable.mutateAsync({
        name: `${prefix} ${existingCount + i + 1}`,
        capacity: capacityNum,
        sortOrder: existingCount + i,
      })
    }
    toast.success(`${countNum} table(s) créée(s).`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          Ajouter plusieurs tables
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Ajouter plusieurs tables</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="bulk-count">Nombre de tables</FieldLabel>
            <Input id="bulk-count" type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="bulk-capacity">Capacité (places)</FieldLabel>
            <Input
              id="bulk-capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="bulk-prefix">Préfixe du nom</FieldLabel>
            <Input id="bulk-prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SortableTableRow({
  table,
  nextSortOrder,
  onDelete,
}: {
  table: SeatingTable
  nextSortOrder: number
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: table.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Réordonner"
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </button>
        <span className="text-sm text-foreground">
          {table.name} <span className="text-muted-foreground">({table.capacity} places)</span>
        </span>
      </div>
      <div className="flex items-center gap-1">
        <TableDialog table={table} nextSortOrder={nextSortOrder} />
        <Button variant="ghost" size="icon-xs" aria-label="Supprimer" onClick={onDelete}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

export function SeatingTablesManager() {
  const { data: tables, isLoading } = useTables()
  const deleteTable = useDeleteTable()
  const updateTable = useUpdateTable()
  const totalCapacity = (tables ?? []).reduce((acc, t) => acc + t.capacity, 0)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleDragEnd(event: DragEndEvent) {
    if (!tables) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = tables.findIndex((t) => t.id === active.id)
    const newIndex = tables.findIndex((t) => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    arrayMove(tables, oldIndex, newIndex).forEach((table, index) => {
      if (table.sortOrder !== index) updateTable.mutate({ id: table.id, patch: { sortOrder: index } })
    })
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-heading text-base">Plan de table</CardTitle>
        <div className="flex items-center gap-2">
          <BulkAddDialog existingCount={tables?.length ?? 0} />
          <TableDialog nextSortOrder={tables?.length ?? 0} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : !tables || tables.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune table configurée pour l'instant.</p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {tables?.length} table(s) · {totalCapacity} place(s) au total
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={tables.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {tables.map((table) => (
                    <SortableTableRow
                      key={table.id}
                      table={table}
                      nextSortOrder={tables.length}
                      onDelete={() => deleteTable.mutate(table.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}
      </CardContent>
    </Card>
  )
}
