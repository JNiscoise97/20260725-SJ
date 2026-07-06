import { Clock, MapPin, Music, Sparkles } from "lucide-react"

import type { Person, RunOfShowStep } from "@/types/domain"
import { buildPhaseSegments, formatDuration, splitRunOfShowSteps } from "@/lib/run-of-show"

function toTime(startsAt: string): string {
  const d = new Date(startsAt)
  return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`
}

function toEndTime(step: RunOfShowStep): string | null {
  if (!step.startsAt || !step.durationMinutes) return null
  const endMs = new Date(step.startsAt).getTime() + step.durationMinutes * 60_000
  const d = new Date(endMs)
  return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`
}

interface Props {
  steps: RunOfShowStep[]
  people: Person[]
}

export function MaitreTempsPrep({ steps, people }: Props) {
  const { prep, program } = splitRunOfShowSteps(steps)
  const allDated = [...prep, ...program]
  const segments = buildPhaseSegments(allDated).filter((s) => s.steps.length > 0)

  const attentionSteps = allDated.filter((s) => s.notes || s.music)

  return (
    <div className="space-y-8">
      {/* Synthèse par phase */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {segments.map((seg, i) => (
          <div key={i} className={`rounded-xl px-4 py-3 ${seg.style.badgeClass}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{seg.style.label}</p>
            <p className="mt-0.5 text-xl font-bold tabular-nums">{formatDuration(seg.minutes)}</p>
            <p className="text-xs opacity-60">
              {seg.steps.length} étape{seg.steps.length > 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Points d'attention */}
      {attentionSteps.length > 0 ? (
        <div className="rounded-xl border border-dore/40 bg-dore/5 p-4 space-y-3">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brun">
            <Sparkles className="size-3.5 text-dore" />
            Points d'attention ({attentionSteps.length})
          </h3>
          <div className="space-y-2">
            {attentionSteps.map((step) => (
              <div key={step.id} className="flex gap-2 text-xs">
                <span className="w-12 shrink-0 font-mono font-semibold text-bordeaux">
                  {step.startsAt ? toTime(step.startsAt) : step.timeLabel}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{step.label}</p>
                  {step.music ? (
                    <p className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                      <Music className="size-3 shrink-0" />
                      {step.music}
                    </p>
                  ) : null}
                  {step.notes ? (
                    <p className="mt-0.5 italic text-muted-foreground">{step.notes}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Déroulé complet phase par phase */}
      {segments.map((seg, gi) => (
        <div key={gi} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${seg.style.barClass}`} />
            <h3 className="font-heading font-semibold text-foreground">{seg.style.label}</h3>
            <span className="text-xs text-muted-foreground">· {formatDuration(seg.minutes)}</span>
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {seg.steps.map((step) => {
              const responsibles = people.filter((p) => step.responsibleIds.includes(p.id))
              const end = toEndTime(step)

              return (
                <div
                  key={step.id}
                  className={`flex gap-4 px-4 py-3 ${step.isHighlight ? "bg-dore/5" : ""}`}
                >
                  {/* Plage horaire */}
                  <div className="w-20 shrink-0 text-right">
                    <p className="font-mono text-sm font-bold text-bordeaux">
                      {step.startsAt ? toTime(step.startsAt) : step.timeLabel}
                    </p>
                    {end ? (
                      <p className="font-mono text-xs text-muted-foreground">→ {end}</p>
                    ) : null}
                  </div>

                  {/* Contenu */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      {step.isHighlight ? (
                        <Sparkles className="size-3.5 shrink-0 translate-y-0.5 text-dore" />
                      ) : null}
                      <p className="text-sm font-medium text-foreground">{step.label}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                      {step.durationMinutes ? (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDuration(step.durationMinutes)}
                        </span>
                      ) : null}
                      {step.location ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {step.location}
                        </span>
                      ) : null}
                      {responsibles.map((p) => (
                        <span key={p.id} className="font-medium text-foreground/70">
                          {p.fullName}
                        </span>
                      ))}
                    </div>

                    {step.music ? (
                      <p className="flex items-center gap-1 text-xs italic text-muted-foreground">
                        <Music className="size-3 shrink-0" />
                        {step.music}
                      </p>
                    ) : null}

                    {step.notes ? (
                      <p className="rounded-md bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground">
                        {step.notes}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
