import type { ProgressStatus } from "@/types/domain"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<ProgressStatus, { label: string; className: string }> = {
  todo: { label: "À faire", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "En cours", className: "bg-dore/20 text-brun" },
  done: { label: "Terminée", className: "bg-vert-vegetal/15 text-vert-vegetal" },
  blocked: { label: "Bloquée", className: "bg-bordeaux/10 text-bordeaux" },
}

export function StatusBadge({ status, className }: { status: ProgressStatus; className?: string }) {
  const config = STATUS_CONFIG[status]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
