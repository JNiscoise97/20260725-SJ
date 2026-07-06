import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, Music, Sparkles, Timer } from "lucide-react"

import type { Person, RunOfShowStep } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { formatDuration, getPhaseStyle, splitRunOfShowSteps } from "@/lib/run-of-show"
import { cn } from "@/lib/utils"

function clockStr(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`
}

function countdownStr(ms: number): string {
  if (ms <= 0) return "0:00"
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, "0")}`
}

function offsetStr(ms: number): string {
  const s = Math.floor(Math.abs(ms) / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}min${sec > 0 ? ` ${sec}s` : ""}` : `${sec}s`
}

interface Props {
  steps: RunOfShowStep[]
  people: Person[]
}

export function MaitreTempsRun({ steps, people }: Props) {
  const [now, setNow] = useState(() => new Date())
  const [manualIndex, setManualIndex] = useState<number | null>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const { prep, program } = splitRunOfShowSteps(steps)
  const datedSteps = [...prep, ...program]

  if (datedSteps.length === 0) {
    return <p className="text-muted-foreground">Aucune étape avec horaire défini.</p>
  }

  const nowMs = now.getTime()

  // Auto-détection : dernière étape dont l'heure de début est passée
  const autoIndex = (() => {
    let idx = 0
    for (let i = 0; i < datedSteps.length; i++) {
      if (nowMs >= new Date(datedSteps[i].startsAt!).getTime()) idx = i
    }
    return idx
  })()

  const activeIndex = manualIndex ?? autoIndex
  const isManual = manualIndex !== null

  const current = datedSteps[activeIndex]
  const upcoming = datedSteps.slice(activeIndex + 1, activeIndex + 4)

  const startMs = new Date(current.startsAt!).getTime()
  const endMs = current.durationMinutes ? startMs + current.durationMinutes * 60_000 : startMs
  const beforeStep = nowMs < startMs
  const elapsed = nowMs - startMs
  const totalMs = current.durationMinutes ? current.durationMinutes * 60_000 : 0
  const progress = totalMs > 0 ? Math.min(100, Math.max(0, (elapsed / totalMs) * 100)) : 0
  const remainingMs = Math.max(0, endMs - nowMs)
  const overdueMs = nowMs - endMs  // > 0 si dépassé
  const isOverdue = !isManual && current.durationMinutes !== null && overdueMs > 0

  const style = getPhaseStyle(current.phase)
  const responsibles = people.filter((p) => current.responsibleIds.includes(p.id))

  return (
    <div className="space-y-5">
      {/* Horloge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-5xl font-bold tabular-nums tracking-tight text-foreground">
            {clockStr(now)}
          </p>
          {isManual ? (
            <button
              type="button"
              onClick={() => setManualIndex(null)}
              className="mt-1.5 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              ← Retour au mode automatique
            </button>
          ) : null}
        </div>

        {/* Indicateur retard */}
        {isOverdue ? (
          <div className="rounded-xl bg-bordeaux/10 px-4 py-3 text-center">
            <p className="text-xs font-medium text-bordeaux">Retard</p>
            <p className="font-mono text-lg font-bold text-bordeaux">+{offsetStr(overdueMs)}</p>
          </div>
        ) : beforeStep ? (
          <div className="rounded-xl bg-lagon/10 px-4 py-3 text-center">
            <p className="text-xs font-medium text-lagon">Démarre dans</p>
            <p className="font-mono text-lg font-bold text-lagon">{offsetStr(startMs - nowMs)}</p>
          </div>
        ) : null}
      </div>

      {/* Étape courante */}
      <div
        className={cn(
          "rounded-2xl border-2 p-5 space-y-3",
          isOverdue
            ? "border-bordeaux/30 bg-bordeaux/5"
            : beforeStep
              ? "border-lagon/30 bg-lagon/5"
              : "border-current/20"
        )}
        style={!isOverdue && !beforeStep ? { borderColor: "transparent" } : undefined}
      >
        {/* Phase badge + highlight */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2",
            style.badgeClass
          )}
        >
          <span className={`size-2 rounded-full ${style.barClass}`} />
          <span className="text-xs font-semibold">{style.label}</span>
          {current.isHighlight ? <Sparkles className="size-3.5 text-dore" /> : null}
          {isManual ? (
            <span className="ml-auto text-xs font-normal opacity-60">mode manuel</span>
          ) : null}
        </div>

        {/* Titre */}
        <p className="font-heading text-2xl font-bold leading-snug text-foreground">
          {current.label}
        </p>

        {/* Méta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="font-mono font-semibold text-bordeaux">{current.timeLabel}</span>
          {current.durationMinutes ? (
            <span className="flex items-center gap-1">
              <Timer className="size-4" />
              {formatDuration(current.durationMinutes)}
            </span>
          ) : null}
          {current.location ? (
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {current.location}
            </span>
          ) : null}
          {responsibles.map((p) => (
            <span key={p.id} className="font-medium text-foreground">
              {p.fullName}
            </span>
          ))}
        </div>

        {current.music ? (
          <p className="flex items-center gap-1.5 text-sm italic text-muted-foreground">
            <Music className="size-4 shrink-0" />
            {current.music}
          </p>
        ) : null}

        {current.notes ? (
          <p className="rounded-xl bg-card/60 px-4 py-2.5 text-sm italic text-muted-foreground">
            {current.notes}
          </p>
        ) : null}

        {/* Barre de progression */}
        {current.durationMinutes ? (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span className={cn("font-mono font-bold tabular-nums", isOverdue ? "text-bordeaux" : "text-foreground")}>
                {isOverdue
                  ? `+${offsetStr(overdueMs)} de retard`
                  : beforeStep
                    ? `démarre dans ${offsetStr(startMs - nowMs)}`
                    : `${countdownStr(remainingMs)} restant`}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  isOverdue ? "bg-bordeaux" : style.barClass
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setManualIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="gap-1.5"
        >
          <ChevronLeft className="size-4" />
          Précédente
        </Button>
        <span className="text-xs text-muted-foreground">
          {activeIndex + 1} / {datedSteps.length}
        </span>
        <Button
          variant="outline"
          onClick={() => setManualIndex(Math.min(datedSteps.length - 1, activeIndex + 1))}
          disabled={activeIndex === datedSteps.length - 1}
          className="gap-1.5"
        >
          Suivante
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* File d'attente */}
      {upcoming.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            À venir
          </h3>
          {upcoming.map((step, i) => {
            const s = step
            const upStyle = getPhaseStyle(s.phase)
            const upStartMs = new Date(s.startsAt!).getTime()
            const waitMs = upStartMs - nowMs
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setManualIndex(activeIndex + 1 + i)}
                className="flex w-full items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <span className={cn("mt-1 size-2 shrink-0 rounded-full", upStyle.barClass)} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-xs font-bold text-bordeaux">{s.timeLabel}</span>
                    <span className="text-sm text-foreground">{s.label}</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    {s.durationMinutes ? <span>{formatDuration(s.durationMinutes)}</span> : null}
                    {s.location ? (
                      <span className="flex items-center gap-0.5">
                        <MapPin className="size-3" />
                        {s.location}
                      </span>
                    ) : null}
                    {!isManual && waitMs > 0 ? (
                      <span className="text-lagon">dans {offsetStr(waitMs)}</span>
                    ) : null}
                  </div>
                  {s.music ? (
                    <p className="mt-0.5 flex items-center gap-1 text-xs italic text-muted-foreground">
                      <Music className="size-3 shrink-0" />
                      {s.music}
                    </p>
                  ) : null}
                </div>
                {s.isHighlight ? <Sparkles className="mt-0.5 size-3.5 shrink-0 text-dore" /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
