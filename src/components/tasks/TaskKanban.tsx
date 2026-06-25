import type { Person, ProgressStatus, Task } from "@/types/domain"
import { TaskCard } from "@/components/tasks/TaskCard"

const COLUMNS: { status: ProgressStatus; label: string }[] = [
  { status: "todo", label: "À faire" },
  { status: "in_progress", label: "En cours" },
  { status: "done", label: "Terminée" },
  { status: "blocked", label: "Bloquée" },
]

interface TaskKanbanProps {
  tasks: Task[]
  peopleById: Map<string, Person>
  onTaskClick: (task: Task) => void
  onStatusChange: (task: Task, status: ProgressStatus) => void
}

export function TaskKanban({ tasks, peopleById, onTaskClick, onStatusChange }: TaskKanbanProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status)
        return (
          <div key={column.status} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
              <span className="text-xs text-muted-foreground">{columnTasks.length}</span>
            </div>
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  owner={task.ownerId ? peopleById.get(task.ownerId) : null}
                  onClick={() => onTaskClick(task)}
                  onStatusChange={(status) => onStatusChange(task, status)}
                />
              ))}
              {columnTasks.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Aucune tâche
                </p>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
