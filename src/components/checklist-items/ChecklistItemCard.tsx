import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarDays, MoreVertical } from "lucide-react"

import type { ChecklistItem, ProgressStatus } from "@/types/domain"
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

function formatDateTime(date: string | null | undefined, time: string | null | undefined) {
  if (!date) return null
  const formatted = format(new Date(date), "d MMM", { locale: fr })
  return time ? `${formatted} · ${time}` : formatted
}

interface ChecklistItemCardProps {
  item: ChecklistItem
  /** Fil d'ariane optionnel affiché au-dessus du libellé (ex. "Domaine · Mission"). */
  context?: string
  onClick?: () => void
  onStatusChange?: (status: ProgressStatus) => void
  className?: string
}

export function ChecklistItemCard({ item, context, onClick, onStatusChange, className }: ChecklistItemCardProps) {
  const start = formatDateTime(item.estimatedStartDate, item.estimatedStartTime)
  const end = formatDateTime(item.estimatedEndDate, item.estimatedEndTime)

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn("cursor-pointer transition-shadow hover:shadow-md", className)}
    >
      <CardContent className="space-y-2">
        {context ? <p className="text-xs text-muted-foreground">{context}</p> : null}
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-foreground">{item.label}</p>
          <div className="flex items-center gap-1">
            <PriorityBadge priority={item.priority} />
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
                    .filter((status) => status !== item.status)
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
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {start || end ? (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {start ?? "—"}
              {end ? ` → ${end}` : ""}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
