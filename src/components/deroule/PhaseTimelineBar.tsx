import type { PhaseSegment } from "@/lib/run-of-show"
import { formatDuration } from "@/lib/run-of-show"

interface PhaseTimelineBarProps {
  segments: PhaseSegment[]
  windowLabel: string | null
}

export function PhaseTimelineBar({ segments, windowLabel }: PhaseTimelineBarProps) {
  const visible = segments.filter((s) => s.minutes > 0)
  if (visible.length === 0) return null

  return (
    <div className="space-y-2">
      {windowLabel ? <p className="text-sm text-muted-foreground">{windowLabel}</p> : null}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {visible.map((segment, i) => (
          <div
            key={i}
            className={`${segment.style.barClass} h-full first:rounded-l-full last:rounded-r-full`}
            style={{ width: `${segment.percent}%` }}
            title={`${segment.style.label} — ${formatDuration(segment.minutes)} (${Math.round(segment.percent)}%)`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {visible.map((segment, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`size-2 shrink-0 rounded-full ${segment.style.barClass}`} />
            {segment.style.label} · {formatDuration(segment.minutes)} ({Math.round(segment.percent)}%)
          </span>
        ))}
      </div>
    </div>
  )
}
