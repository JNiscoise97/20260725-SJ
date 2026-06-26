import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import type { Task } from "@/types/domain"
import { usePeople } from "@/hooks/queries/use-people"
import { useMissions } from "@/hooks/queries/use-missions"
import { useCreateTask, useUpdateTask } from "@/hooks/queries/use-tasks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

const NONE = "__none__"

const taskSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis."),
  description: z.string().trim().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  status: z.enum(["todo", "in_progress", "done", "blocked"]),
  category: z.string().trim().optional(),
  dueDate: z.string().trim().optional(),
  dueTime: z.string().trim().optional(),
  ownerId: z.string().optional(),
  missionId: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

const EMPTY_VALUES: TaskFormValues = {
  title: "",
  description: "",
  priority: "normal",
  status: "todo",
  category: "",
  dueDate: "",
  dueTime: "",
  ownerId: undefined,
  missionId: NONE,
}

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
}

export function TaskFormDialog({ open, onOpenChange, task }: TaskFormDialogProps) {
  const { data: people } = usePeople()
  const { data: missions } = useMissions()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({ resolver: zodResolver(taskSchema), defaultValues: EMPTY_VALUES })

  useEffect(() => {
    if (!open) return
    reset(
      task
        ? {
            title: task.title,
            description: task.description ?? "",
            priority: task.priority,
            status: task.status,
            category: task.category ?? "",
            dueDate: task.dueDate ?? "",
            dueTime: task.dueTime ?? "",
            ownerId: task.ownerId ?? undefined,
            missionId: task.missionId ?? NONE,
          }
        : EMPTY_VALUES
    )
  }, [open, task, reset])

  async function onSubmit(values: TaskFormValues) {
    const payload = {
      title: values.title,
      description: values.description || null,
      priority: values.priority,
      status: values.status,
      category: values.category || null,
      dueDate: values.dueDate || null,
      dueTime: values.dueTime || null,
      ownerId: values.ownerId || null,
      missionId: values.missionId && values.missionId !== NONE ? values.missionId : null,
    }

    if (task) {
      await updateTask.mutateAsync({ id: task.id, patch: payload })
      toast.success("Tâche mise à jour.")
    } else {
      await createTask.mutateAsync(payload)
      toast.success("Tâche créée.")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{task ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Titre</FieldLabel>
              <Input id="title" {...register("title")} />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" rows={3} {...register("description")} />
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
                <FieldLabel htmlFor="dueDate">Date</FieldLabel>
                <Input id="dueDate" type="date" {...register("dueDate")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="dueTime">Heure</FieldLabel>
                <Input id="dueTime" type="time" {...register("dueTime")} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="category">Catégorie</FieldLabel>
                <Input id="category" placeholder="Ex. Décoration" {...register("category")} />
              </Field>

              <Field>
                <FieldLabel>Responsable</FieldLabel>
                <Controller
                  control={control}
                  name="ownerId"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Non assigné" />
                      </SelectTrigger>
                      <SelectContent>
                        {people?.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Mission</FieldLabel>
              <Controller
                control={control}
                name="missionId"
                render={({ field }) => (
                  <Select value={field.value ?? NONE} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Aucune" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Aucune</SelectItem>
                      {missions?.map((mission) => (
                        <SelectItem key={mission.id} value={mission.id}>
                          {mission.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {task ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
