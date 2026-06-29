import { useState } from "react"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"

import { useCreateChecklistItem, useUpdateChecklistItem } from "@/hooks/queries/use-checklists"
import type { ChecklistItem, Priority, ProgressStatus } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
  urgent: "Urgente",
}

const STATUS_LABELS: Record<ProgressStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
  blocked: "Bloquée",
}

interface ChecklistItemDialogProps {
  item?: ChecklistItem
  checklistId?: string
}

export function ChecklistItemDialog({ item, checklistId }: ChecklistItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState(item?.label ?? "")
  const [priority, setPriority] = useState<Priority>(item?.priority ?? "normal")
  const [status, setStatus] = useState<ProgressStatus>(item?.status ?? "todo")
  const createItem = useCreateChecklistItem()
  const updateItem = useUpdateChecklistItem()

  async function handleSubmit() {
    if (!label.trim()) return
    if (item) {
      await updateItem.mutateAsync({
        id: item.id,
        patch: { label, priority, status, isDone: status === "done" },
      })
      toast.success("Item mis à jour.")
    } else {
      if (!checklistId) return
      await createItem.mutateAsync({
        checklistId,
        label,
        isDone: status === "done",
        sortOrder: 0,
        priority,
        status,
      })
      toast.success("Item créé.")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            {item ? (
              <Button variant="ghost" size="icon-xs" aria-label="Modifier l'item">
                <Pencil className="size-3.5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon-xs" aria-label="Ajouter un item">
                <Plus className="size-3.5" />
              </Button>
            )}
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{item ? "Modifier l'item" : "Ajouter un item"}</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">{item ? "Modifier l'item" : "Nouvel item"}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="item-label">Libellé</FieldLabel>
            <Textarea id="item-label" rows={3} value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Priorité</FieldLabel>
              <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PRIORITY_LABELS) as Priority[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {PRIORITY_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Statut</FieldLabel>
              <Select value={status} onValueChange={(v: ProgressStatus) => setStatus(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as ProgressStatus[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {STATUS_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>{item ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
