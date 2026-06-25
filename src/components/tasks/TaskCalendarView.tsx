import { useMemo, useState } from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

import type { Person, Task } from "@/types/domain"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { TaskCard } from "@/components/tasks/TaskCard"

interface TaskCalendarViewProps {
  tasks: Task[]
  peopleById: Map<string, Person>
  onTaskClick: (task: Task) => void
}

export function TaskCalendarView({ tasks, peopleById, onTaskClick }: TaskCalendarViewProps) {
  const datesWithTasks = useMemo(
    () => tasks.filter((t) => t.dueDate).map((t) => parseISO(t.dueDate!)),
    [tasks]
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const tasksForSelectedDate = selectedDate
    ? tasks.filter((task) => task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate))
    : []

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
      <Card className="w-fit">
        <CardContent>
          <Calendar
            mode="single"
            locale={fr}
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ hasTasks: datesWithTasks }}
            modifiersClassNames={{ hasTasks: "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-bordeaux" }}
          />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
        </h3>
        {selectedDate && tasksForSelectedDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune tâche ce jour-là.</p>
        ) : null}
        {tasksForSelectedDate.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            owner={task.ownerId ? peopleById.get(task.ownerId) : null}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  )
}
