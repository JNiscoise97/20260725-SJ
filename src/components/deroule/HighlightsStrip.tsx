import { Sparkles } from "lucide-react"

import type { RunOfShowStep } from "@/types/domain"

interface HighlightsStripProps {
  steps: RunOfShowStep[]
}

export function HighlightsStrip({ steps }: HighlightsStripProps) {
  if (steps.length === 0) return null

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-1.5 font-heading text-sm font-medium text-foreground">
        <Sparkles className="size-4 text-dore" />
        Temps forts
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {steps.map((step) => (
          <a
            key={step.id}
            href={`#step-${step.id}`}
            className="flex shrink-0 flex-col gap-0.5 rounded-xl border border-dore/40 bg-dore/5 px-3 py-2 transition-colors hover:bg-dore/10"
          >
            <span className="text-xs font-semibold text-bordeaux">{step.timeLabel}</span>
            <span className="max-w-40 truncate text-xs text-foreground">{step.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
