import type { Priority } from "@/types/domain"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> = {
  low: { label: "Basse", className: "bg-muted text-muted-foreground" },
  normal: { label: "Normale", className: "bg-secondary text-secondary-foreground" },
  high: { label: "Haute", className: "bg-dore/20 text-brun" },
  urgent: { label: "Urgente", className: "bg-bordeaux/10 text-bordeaux" },
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const config = PRIORITY_CONFIG[priority]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
