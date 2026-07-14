import type { RunOfShowStep } from "@/types/domain"

const GAP_SPLIT_HOURS = 6

export interface PhaseStyle {
  label: string
  barClass: string
  badgeClass: string
}

const PHASE_STYLES: Record<string, PhaseStyle> = {
  LOGISTIQUE: { label: "Logistique", barClass: "bg-brun", badgeClass: "bg-brun/15 text-brun" },
  INSTALLATION: { label: "Installation", barClass: "bg-lagon", badgeClass: "bg-lagon/15 text-lagon" },
  "ACCUEIL": { label: "Accueil", barClass: "bg-corail", badgeClass: "bg-corail/15 text-corail" },
  "CÉRÉMONIE": { label: "Cérémonie", barClass: "bg-bordeaux", badgeClass: "bg-bordeaux/10 text-bordeaux" },
  "SEMI-FORMEL": { label: "Semi-formel", barClass: "bg-dore", badgeClass: "bg-dore/20 text-brun" },
  FESTIF: { label: "Festif", barClass: "bg-vert-vegetal", badgeClass: "bg-vert-vegetal/15 text-vert-vegetal" },
}

const FALLBACK_PHASE_STYLE: PhaseStyle = {
  label: "Programme",
  barClass: "bg-muted-foreground/40",
  badgeClass: "bg-muted text-muted-foreground",
}

export function getPhaseStyle(phase?: string | null): PhaseStyle {
  if (!phase) return FALLBACK_PHASE_STYLE
  return PHASE_STYLES[phase] ?? FALLBACK_PHASE_STYLE
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0 min"
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  if (rest === 0) return `${hours}h`
  return `${hours}h${String(rest).padStart(2, "0")}`
}

function stepEnd(step: RunOfShowStep, startMs: number): number {
  return startMs + (step.durationMinutes ?? 0) * 60_000
}

/** Sépare les étapes sans horaire (préparation libre) de celles datées, puis isole
 * un éventuel bloc de préparation très en amont (ex. la veille) du programme principal :
 * tout écart de plus de {@link GAP_SPLIT_HOURS} entre deux étapes datées consécutives
 * marque la frontière. */
export function splitRunOfShowSteps(steps: RunOfShowStep[]): {
  unscheduled: RunOfShowStep[]
  prep: RunOfShowStep[]
  program: RunOfShowStep[]
} {
  const unscheduled = steps.filter((s) => !s.startsAt)
  const dated = steps
    .filter((s) => s.startsAt)
    .slice()
    .sort((a, b) => new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime())

  let splitIndex = 0
  let maxGap = 0
  for (let i = 1; i < dated.length; i++) {
    const prevEnd = stepEnd(dated[i - 1], new Date(dated[i - 1].startsAt!).getTime())
    const nextStart = new Date(dated[i].startsAt!).getTime()
    const gapHours = (nextStart - prevEnd) / 3_600_000
    if (gapHours > maxGap) {
      maxGap = gapHours
      splitIndex = i
    }
  }

  if (maxGap <= GAP_SPLIT_HOURS) {
    return { unscheduled, prep: [], program: dated }
  }
  return { unscheduled, prep: dated.slice(0, splitIndex), program: dated.slice(splitIndex) }
}

export interface PhaseSegment {
  phase: string | null
  style: PhaseStyle
  minutes: number
  percent: number
  steps: RunOfShowStep[]
}

/** Regroupe des étapes datées consécutives partageant la même phase, et calcule
 * la part de durée (en minutes) que chaque groupe représente sur l'ensemble. */
export function buildPhaseSegments(steps: RunOfShowStep[]): PhaseSegment[] {
  const groups: { phase: string | null; minutes: number; steps: RunOfShowStep[] }[] = []
  for (const step of steps) {
    const phase = step.phase ?? null
    const last = groups[groups.length - 1]
    if (last && last.phase === phase) {
      last.minutes += step.durationMinutes ?? 0
      last.steps.push(step)
    } else {
      groups.push({ phase, minutes: step.durationMinutes ?? 0, steps: [step] })
    }
  }

  const total = groups.reduce((sum, g) => sum + g.minutes, 0)
  return groups.map((g) => ({
    phase: g.phase,
    style: getPhaseStyle(g.phase),
    minutes: g.minutes,
    percent: total > 0 ? (g.minutes / total) * 100 : 0,
    steps: g.steps,
  }))
}

/**
 * Convertit "HH:MM" en minutes depuis le pivot de la journée (07:00 par défaut).
 * Les heures avant le pivot (ex. 01h, 02h = lendemain matin) reçoivent +24h
 * pour qu'elles sortent après les heures du soir dans un tri croissant.
 */
export function sortableTime(hhmm: string, pivotHour = 7): number {
  const [h, m] = hhmm.split(":").map(Number)
  const mins = h * 60 + (m ?? 0)
  return mins < pivotHour * 60 ? mins + 24 * 60 : mins
}

export function formatProgramWindow(steps: RunOfShowStep[]): string | null {
  const dated = steps.filter((s) => s.startsAt)
  if (dated.length === 0) return null

  let start = Infinity
  let end = -Infinity
  for (const step of dated) {
    const startMs = new Date(step.startsAt!).getTime()
    start = Math.min(start, startMs)
    end = Math.max(end, stepEnd(step, startMs))
  }

  const formatTime = (ms: number) => {
    const d = new Date(ms)
    return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`
  }
  const totalMinutes = Math.round((end - start) / 60_000)
  return `${formatTime(start)} → ${formatTime(end)} · ${formatDuration(totalMinutes)} au total`
}
