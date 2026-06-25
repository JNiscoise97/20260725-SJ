import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"

import type { ProgressStatus, Task } from "@/types/domain"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTasks, useUpdateTask } from "@/hooks/queries/use-tasks"
import { usePeople } from "@/hooks/queries/use-people"
import { TaskListView } from "@/components/tasks/TaskListView"
import { TaskKanban } from "@/components/tasks/TaskKanban"
import { TaskCalendarView } from "@/components/tasks/TaskCalendarView"
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog"

export function TasksPage() {
  const { data: tasks, isLoading } = useTasks()
  const { data: people } = usePeople()
  const updateTask = useUpdateTask()

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const peopleById = useMemo(() => new Map((people ?? []).map((p) => [p.id, p])), [people])

  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    const query = search.trim().toLowerCase()
    if (!query) return tasks
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.category?.toLowerCase().includes(query)
    )
  }, [tasks, search])

  function openCreateDialog() {
    setEditingTask(null)
    setDialogOpen(true)
  }

  function openEditDialog(task: Task) {
    setEditingTask(task)
    setDialogOpen(true)
  }

  function handleStatusChange(task: Task, status: ProgressStatus) {
    updateTask.mutate({ id: task.id, patch: { status } })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tâches"
        description="Toutes les tâches à accomplir avant le jour J."
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="size-4" />
            Nouvelle tâche
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher une tâche..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="Aucune tâche pour l'instant"
          description="Créez votre première tâche pour commencer."
          action={<Button onClick={openCreateDialog}>Nouvelle tâche</Button>}
        />
      ) : (
        <Tabs defaultValue="liste">
          <TabsList>
            <TabsTrigger value="liste">Liste</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          </TabsList>
          <TabsContent value="liste">
            <TaskListView tasks={filteredTasks} peopleById={peopleById} onTaskClick={openEditDialog} />
          </TabsContent>
          <TabsContent value="kanban">
            <TaskKanban
              tasks={filteredTasks}
              peopleById={peopleById}
              onTaskClick={openEditDialog}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
          <TabsContent value="calendrier">
            <TaskCalendarView tasks={filteredTasks} peopleById={peopleById} onTaskClick={openEditDialog} />
          </TabsContent>
        </Tabs>
      )}

      <TaskFormDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editingTask} />
    </div>
  )
}
