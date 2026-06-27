import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { useCreateTable, useDeleteTable, useTables, useUpdateTable } from "@/hooks/queries/use-seating"
import type { SeatingTable } from "@/types/domain"
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

function TableDialog({ table }: { table?: SeatingTable }) {
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
      await createTable.mutateAsync({ name, capacity: capacityNum })
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
      await createTable.mutateAsync({ name: `${prefix} ${existingCount + i + 1}`, capacity: capacityNum })
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

export function SeatingTablesManager() {
  const { data: tables, isLoading } = useTables()
  const deleteTable = useDeleteTable()
  const totalCapacity = (tables ?? []).reduce((acc, t) => acc + t.capacity, 0)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-heading text-base">Plan de table</CardTitle>
        <div className="flex items-center gap-2">
          <BulkAddDialog existingCount={tables?.length ?? 0} />
          <TableDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : tables?.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune table configurée pour l'instant.</p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {tables?.length} table(s) · {totalCapacity} place(s) au total
            </p>
            {tables?.map((table) => (
              <div
                key={table.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <span className="text-sm text-foreground">
                  {table.name} <span className="text-muted-foreground">({table.capacity} places)</span>
                </span>
                <div className="flex items-center gap-1">
                  <TableDialog table={table} />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Supprimer"
                    onClick={() => deleteTable.mutate(table.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}
