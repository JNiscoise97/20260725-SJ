import { format } from "date-fns"
import { fr } from "date-fns/locale"

import type { Person, Task } from "@/types/domain"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PriorityBadge } from "@/components/shared/PriorityBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TaskListViewProps {
  tasks: Task[]
  peopleById: Map<string, Person>
  onTaskClick: (task: Task) => void
}

export function TaskListView({ tasks, peopleById, onTaskClick }: TaskListViewProps) {
  const sorted = [...tasks].sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tâche</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Priorité</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Responsable</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((task) => {
          const owner = task.ownerId ? peopleById.get(task.ownerId) : null
          return (
            <TableRow key={task.id} onClick={() => onTaskClick(task)} className="cursor-pointer">
              <TableCell className="font-medium text-foreground">
                {task.title}
                {task.category ? (
                  <span className="ml-2 text-xs text-muted-foreground">{task.category}</span>
                ) : null}
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {task.dueDate ? format(new Date(task.dueDate), "d MMM yyyy", { locale: fr }) : "—"}
                {task.dueTime ? ` · ${task.dueTime}` : ""}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{owner?.fullName ?? "Non assigné"}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
