import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  accentClassName?: string
}

export function StatCard({ icon: Icon, label, value, hint, accentClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground",
            accentClassName
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-semibold text-foreground">{value}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
