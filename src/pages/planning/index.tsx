import { useState } from "react"
import { CalendarDays, LayoutList } from "lucide-react"
import { parseISO } from "date-fns"

import { useEventConfig } from "@/context/EventConfigContext"
import { EVENT_TYPE_LABELS } from "@/services/settings.service"
import { PageHeader } from "@/components/shared/PageHeader"
import { CalendarView } from "@/components/planning/CalendarView"
import { ListView } from "@/components/planning/ListView"
import { Button } from "@/components/ui/button"

type ViewMode    = "calendar" | "list"
type PhaseFilter = "setup" | "main" | "cleanup" | null
type Granularity = "1h" | "15min"

const FILTER_STYLES: Record<"setup" | "main" | "cleanup", { idle: string; active: string }> = {
  setup: {
    idle:   "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-400",
    active: "border-sky-500 bg-sky-100 text-sky-900 ring-2 ring-sky-400/40 ring-offset-1 dark:border-sky-400 dark:bg-sky-900 dark:text-sky-100",
  },
  main: {
    idle:   "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400",
    active: "border-rose-500 bg-rose-100 text-rose-900 ring-2 ring-rose-400/40 ring-offset-1 dark:border-rose-400 dark:bg-rose-900 dark:text-rose-100",
  },
  cleanup: {
    idle:   "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
    active: "border-amber-500 bg-amber-100 text-amber-900 ring-2 ring-amber-400/40 ring-offset-1 dark:border-amber-400 dark:bg-amber-900 dark:text-amber-100",
  },
}

function GranularityToggle({
  value,
  onChange,
}: {
  value: Granularity
  onChange: (v: Granularity) => void
}) {
  const btn = (g: Granularity, label: string) => (
    <button
      key={g}
      onClick={() => onChange(g)}
      className={`rounded px-2 py-0.5 text-[11px] font-medium transition-all ${
        value === g
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-1">
      {btn("1h",    "1h")}
      {btn("15min", "15m")}
    </div>
  )
}

export function PlanningPage() {
  const { phaseSetup, phaseMain, phaseCleanup, eventType } = useEventConfig()

  const [view,        setView]        = useState<ViewMode>(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? "list" : "calendar"
  )
  const [phaseFilter,   setPhaseFilter]   = useState<PhaseFilter>(null)
  const [messageFilter, setMessageFilter] = useState(false)
  const [granularity,   setGranularity]   = useState<Granularity>("1h")

  const phaseLabels: Record<"setup" | "main" | "cleanup", string> = {
    setup:   "Installation",
    main:    EVENT_TYPE_LABELS[eventType],
    cleanup: "Désinstallation",
  }

  const dateRange = phaseFilter
    ? (() => {
        const r = { setup: phaseSetup, main: phaseMain, cleanup: phaseCleanup }[phaseFilter]
        return { start: parseISO(r.startIso), end: parseISO(r.endIso ?? r.startIso) }
      })()
    : undefined

  function toggleFilter(key: "setup" | "main" | "cleanup") {
    setPhaseFilter((prev) => (prev === key ? null : key))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Planning"
          description="Vue calendrier de l'installation à la désinstallation."
        />
        <div className="flex shrink-0 items-center gap-2">
          <GranularityToggle value={granularity} onChange={setGranularity} />
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-1">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setView("list")}
              title="Vue liste"
            >
              <LayoutList className="size-4" />
            </Button>
            <Button
              variant={view === "calendar" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setView("calendar")}
              title="Vue calendrier"
            >
              <CalendarDays className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(["setup", "main", "cleanup"] as const).map((key) => {
          const isActive = phaseFilter === key
          return (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${FILTER_STYLES[key][isActive ? "active" : "idle"]}`}
            >
              {phaseLabels[key]}
            </button>
          )
        })}
        <div className="h-4 w-px bg-border/60" />
        <button
          onClick={() => setMessageFilter((v) => !v)}
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
            messageFilter
              ? "border-indigo-500 bg-indigo-100 text-indigo-900 ring-2 ring-indigo-400/40 ring-offset-1 dark:border-indigo-400 dark:bg-indigo-900 dark:text-indigo-100"
              : "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-400"
          }`}
        >
          Messages
        </button>
      </div>

      {view === "calendar"
        ? <CalendarView dateRange={dateRange} phaseFilter={phaseFilter} granularity={granularity} messageFilter={messageFilter} />
        : <ListView    dateRange={dateRange} phaseFilter={phaseFilter} granularity={granularity} messageFilter={messageFilter} />
      }
    </div>
  )
}
