import { useState } from "react"
import { Clock } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PHASE_DAYS } from "@/lib/constants"
import { useUpdateChecklistItem } from "@/hooks/queries/use-checklists"
import type { ChecklistItem } from "@/types/domain"

type ScheduleMode = "continu" | "ponctuelle"
type ContinuSubtype = "sur_une_phase" | "sur_un_temps_fort"
type EndMode = "duree" | "datetime"

// ── Composants internes ───────────────────────────────────────────────────────

function OptionButton({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm font-medium transition-colors text-left",
        selected
          ? "border-primary bg-primary/8 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

function DayPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (date: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {PHASE_DAYS.map(({ date, label }) => (
        <OptionButton
          key={date}
          selected={value === date}
          onClick={() => onChange(date)}
        >
          {label}
        </OptionButton>
      ))}
    </div>
  )
}

// ── Dialog ────────────────────────────────────────────────────────────────────

interface Props {
  item: ChecklistItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ItemScheduleDialog({ item, open, onOpenChange }: Props) {
  const existing = item.taskSchedulingType
  const [mode, setMode] = useState<ScheduleMode>(existing === "periode" ? "ponctuelle" : "continu")
  const [continuSubtype, setContinuSubtype] = useState<ContinuSubtype>(
    (item.taskPhase as ContinuSubtype | null) ?? "sur_une_phase"
  )
  const [startDate, setStartDate] = useState(item.estimatedStartDate ?? "")
  const [startTime, setStartTime] = useState(item.estimatedStartTime ?? "")
  const [endMode, setEndMode] = useState<EndMode>(item.estimatedEndDate ? "datetime" : "duree")
  const [durationH, setDurationH] = useState("")
  const [durationMin, setDurationMin] = useState("")
  const [endDate, setEndDate] = useState(item.estimatedEndDate ?? "")
  const [endTime, setEndTime] = useState(item.estimatedEndTime ?? "")
  const [saving, setSaving] = useState(false)

  const updateItem = useUpdateChecklistItem()

  function computedEnd(): { date: string; time: string; label: string } | null {
    if (endMode !== "duree" || !startDate || !startTime) return null
    const h = parseInt(durationH || "0", 10)
    const m = parseInt(durationMin || "0", 10)
    if (h === 0 && m === 0) return null
    const dt = new Date(`${startDate}T${startTime}`)
    dt.setHours(dt.getHours() + h, dt.getMinutes() + m)
    return {
      date: dt.toISOString().slice(0, 10),
      time: dt.toTimeString().slice(0, 5),
      label: dt.toLocaleString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  function canSave() {
    if (mode === "continu") return true
    if (!startDate || !startTime) return false
    if (endMode === "duree") {
      return parseInt(durationH || "0", 10) > 0 || parseInt(durationMin || "0", 10) > 0
    }
    return !!endDate && !!endTime
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (mode === "continu") {
        await updateItem.mutateAsync({
          id: item.id,
          patch: {
            taskSchedulingType: "en_continu",
            taskPhase: continuSubtype,
            estimatedStartDate: null,
            estimatedStartTime: null,
            estimatedEndDate: null,
            estimatedEndTime: null,
          },
        })
      } else {
        const end =
          endMode === "datetime"
            ? endDate && endTime
              ? { date: endDate, time: endTime }
              : null
            : computedEnd()
        await updateItem.mutateAsync({
          id: item.id,
          patch: {
            taskSchedulingType: "periode",
            taskPhase: null,
            estimatedStartDate: startDate || null,
            estimatedStartTime: startTime || null,
            estimatedEndDate: end?.date ?? null,
            estimatedEndTime: end?.time ?? null,
          },
        })
      }
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const end = computedEnd()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="leading-snug">{item.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mode */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <div className="flex gap-2">
              <OptionButton
                selected={mode === "continu"}
                onClick={() => setMode("continu")}
                className="flex-1"
              >
                Continue
              </OptionButton>
              <OptionButton
                selected={mode === "ponctuelle"}
                onClick={() => setMode("ponctuelle")}
                className="flex-1"
              >
                Ponctuelle
              </OptionButton>
            </div>
          </div>

          {/* Continue sub-type */}
          {mode === "continu" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Portée</Label>
              <div className="flex flex-col gap-1.5">
                <OptionButton
                  selected={continuSubtype === "sur_une_phase"}
                  onClick={() => setContinuSubtype("sur_une_phase")}
                >
                  Sur une phase
                </OptionButton>
                <OptionButton
                  selected={continuSubtype === "sur_un_temps_fort"}
                  onClick={() => setContinuSubtype("sur_un_temps_fort")}
                >
                  Sur un temps fort
                </OptionButton>
              </div>
            </div>
          )}

          {/* Ponctuelle */}
          {mode === "ponctuelle" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Jour de début</Label>
                <DayPicker value={startDate} onChange={setStartDate} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Heure de début</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-32"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Fin</Label>
                <div className="flex gap-2">
                  <OptionButton
                    selected={endMode === "duree"}
                    onClick={() => setEndMode("duree")}
                    className="flex-1"
                  >
                    Durée estimée
                  </OptionButton>
                  <OptionButton
                    selected={endMode === "datetime"}
                    onClick={() => setEndMode("datetime")}
                    className="flex-1"
                  >
                    Jour et heure
                  </OptionButton>
                </div>
              </div>

              {endMode === "duree" && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={durationH}
                      onChange={(e) => setDurationH(e.target.value)}
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">h</span>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      placeholder="00"
                      value={durationMin}
                      onChange={(e) => setDurationMin(e.target.value)}
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                  {end && (
                    <p className="text-xs text-muted-foreground">
                      Fin calculée :{" "}
                      <span className="font-medium text-foreground">{end.label}</span>
                    </p>
                  )}
                </div>
              )}

              {endMode === "datetime" && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Jour de fin</Label>
                    <DayPicker value={endDate} onChange={setEndDate} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Heure de fin</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-32"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!canSave() || saving}>
            {saving ? "Enregistrement…" : "Planifier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(time: string | null | undefined) {
  if (!time) return null
  return time.slice(0, 5).replace(":", "h")
}

function fmtDay(date: string | null | undefined) {
  if (!date) return null
  const match = PHASE_DAYS.find((d) => d.date === date)
  if (match) {
    // "Installation · ven. 24 juil." → "ven."
    const parts = match.label.split(" · ")
    return parts[1]?.split(" ")[0] ?? parts[0]
  }
  return new Date(date).toLocaleDateString("fr-FR", { weekday: "short" })
}

function schedulingLabel(item: ChecklistItem): string | null {
  if (!item.taskSchedulingType) return null
  if (item.taskSchedulingType === "en_continu") {
    return item.taskPhase === "sur_un_temps_fort" ? "Continue · temps fort" : "Continue · phase"
  }
  // periode
  const startDay = fmtDay(item.estimatedStartDate)
  const startTime = fmtTime(item.estimatedStartTime)
  const endDay = fmtDay(item.estimatedEndDate)
  const endTime = fmtTime(item.estimatedEndTime)

  if (!startDay && !startTime) return "Ponctuelle"
  const start = [startDay, startTime].filter(Boolean).join(" ")
  if (!endTime) return start
  const endStr = endDay && endDay !== startDay ? `${endDay} ${endTime}` : endTime
  return `${start} → ${endStr}`
}

// ── Trigger (icône ou résumé dans la liste) ───────────────────────────────────

export function ItemScheduleTrigger({ item }: { item: ChecklistItem }) {
  const [open, setOpen] = useState(false)
  const label = schedulingLabel(item)
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        title="Modifier la planification"
        className={cn(
          "shrink-0 rounded transition-colors",
          label
            ? "px-1.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/8"
            : "p-0.5 text-muted-foreground/40 hover:text-muted-foreground"
        )}
      >
        {label ?? <Clock className="size-3.5" />}
      </button>
      {open && <ItemScheduleDialog item={item} open={open} onOpenChange={setOpen} />}
    </>
  )
}
