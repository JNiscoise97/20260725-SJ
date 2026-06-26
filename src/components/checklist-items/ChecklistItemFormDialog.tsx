import { useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import type { ChecklistItem } from "@/types/domain"
import { useMissions } from "@/hooks/queries/use-missions"
import { useAllChecklists } from "@/hooks/queries/use-checklists"
import { useCreateChecklistItem, useUpdateChecklistItem } from "@/hooks/queries/use-checklists"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const itemSchema = z.object({
  label: z.string().trim().min(1, "Le libellé est requis."),
  checklistId: z.string().min(1, "La checklist est requise."),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  status: z.enum(["todo", "in_progress", "done", "blocked"]),
  estimatedStartDate: z.string().trim().optional(),
  estimatedStartTime: z.string().trim().optional(),
  estimatedEndDate: z.string().trim().optional(),
  estimatedEndTime: z.string().trim().optional(),
})

type ItemFormValues = z.infer<typeof itemSchema>

const EMPTY_VALUES: ItemFormValues = {
  label: "",
  checklistId: "",
  priority: "normal",
  status: "todo",
  estimatedStartDate: "",
  estimatedStartTime: "",
  estimatedEndDate: "",
  estimatedEndTime: "",
}

interface ChecklistItemFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: ChecklistItem | null
}

export function ChecklistItemFormDialog({ open, onOpenChange, item }: ChecklistItemFormDialogProps) {
  const { data: missions } = useMissions()
  const { data: checklists } = useAllChecklists()
  const createItem = useCreateChecklistItem()
  const updateItem = useUpdateChecklistItem()

  const missionTitleByMissionId = useMemo(() => new Map((missions ?? []).map((m) => [m.id, m.title])), [missions])
  const checklistOptions = useMemo(
    () =>
      (checklists ?? []).map((checklist) => {
        const missionTitle =
          checklist.ownerType === "mission" && checklist.ownerId
            ? missionTitleByMissionId.get(checklist.ownerId)
            : null
        return {
          id: checklist.id,
          label: missionTitle ? `${missionTitle} — ${checklist.title}` : checklist.title,
        }
      }),
    [checklists, missionTitleByMissionId]
  )

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({ resolver: zodResolver(itemSchema), defaultValues: EMPTY_VALUES })

  useEffect(() => {
    if (!open) return
    reset(
      item
        ? {
            label: item.label,
            checklistId: item.checklistId,
            priority: item.priority,
            status: item.status,
            estimatedStartDate: item.estimatedStartDate ?? "",
            estimatedStartTime: item.estimatedStartTime ?? "",
            estimatedEndDate: item.estimatedEndDate ?? "",
            estimatedEndTime: item.estimatedEndTime ?? "",
          }
        : EMPTY_VALUES
    )
  }, [open, item, reset])

  async function onSubmit(values: ItemFormValues) {
    const payload = {
      label: values.label,
      checklistId: values.checklistId,
      priority: values.priority,
      status: values.status,
      isDone: values.status === "done",
      sortOrder: item?.sortOrder ?? 0,
      estimatedStartDate: values.estimatedStartDate || null,
      estimatedStartTime: values.estimatedStartTime || null,
      estimatedEndDate: values.estimatedEndDate || null,
      estimatedEndTime: values.estimatedEndTime || null,
    }

    if (item) {
      await updateItem.mutateAsync({ id: item.id, patch: payload })
      toast.success("Item mis à jour.")
    } else {
      await createItem.mutateAsync(payload)
      toast.success("Item créé.")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{item ? "Modifier l'item" : "Nouvel item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.label}>
              <FieldLabel htmlFor="label">Libellé</FieldLabel>
              <Input id="label" {...register("label")} />
              <FieldError errors={[errors.label]} />
            </Field>

            <Field data-invalid={!!errors.checklistId}>
              <FieldLabel>Checklist</FieldLabel>
              <Controller
                control={control}
                name="checklistId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisir une checklist" />
                    </SelectTrigger>
                    <SelectContent>
                      {checklistOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.checklistId]} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Priorité</FieldLabel>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Statut</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">À faire</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="done">Terminée</SelectItem>
                        <SelectItem value="blocked">Bloquée</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="estimatedStartDate">Début estimé</FieldLabel>
                <Input id="estimatedStartDate" type="date" {...register("estimatedStartDate")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="estimatedStartTime">Heure de début</FieldLabel>
                <Input id="estimatedStartTime" type="time" {...register("estimatedStartTime")} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="estimatedEndDate">Fin estimée</FieldLabel>
                <Input id="estimatedEndDate" type="date" {...register("estimatedEndDate")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="estimatedEndTime">Heure de fin</FieldLabel>
                <Input id="estimatedEndTime" type="time" {...register("estimatedEndTime")} />
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {item ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
