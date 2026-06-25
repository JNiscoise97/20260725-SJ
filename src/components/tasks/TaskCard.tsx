import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarDays, MoreVertical, User } from "lucide-react"

import type { Person, ProgressStatus, Task } from "@/types/domain"
import { Card, CardContent } from "@/components/ui/card"
import { PriorityBadge } from "@/components/shared/PriorityBadge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const STATUS_LABELS: Record<ProgressStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
  blocked: "Bloquée",
}

interface TaskCardProps {
  task: Task
  owner?: Person | null
  onClick?: () => void
  onStatusChange?: (status: ProgressStatus) => void
  className?: string
}

export function TaskCard({ task, owner, onClick, onStatusChange, className }: TaskCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn("cursor-pointer transition-shadow hover:shadow-md", className)}
    >
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-foreground">{task.title}</p>
          <div className="flex items-center gap-1">
            <PriorityBadge priority={task.priority} />
            {onStatusChange ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Changer le statut"
                  >
                    <MoreVertical className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  {(Object.keys(STATUS_LABELS) as ProgressStatus[])
                    .filter((status) => status !== task.status)
                    .map((status) => (
                      <DropdownMenuItem key={status} onClick={() => onStatusChange(status)}>
                        Déplacer vers « {STATUS_LABELS[status]} »
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
        {task.category ? <p className="text-xs text-muted-foreground">{task.category}</p> : null}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.dueDate ? (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {format(new Date(task.dueDate), "d MMM", { locale: fr })}
              {task.dueTime ? ` · ${task.dueTime}` : ""}
            </span>
          ) : null}
          {owner ? (
            <span className="flex items-center gap-1">
              <User className="size-3.5" />
              {owner.fullName}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
