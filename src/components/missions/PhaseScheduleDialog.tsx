import { useState } from "react"
import { Clock } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useUpdateMission } from "@/hooks/queries/use-missions"
import type { Mission } from "@/types/domain"

type ScheduleMode = "continu" | "ponctuelle"
type ContinuSubtype = "sur_une_phase" | "sur_un_temps_fort"
type EndMode = "duree" | "datetime"

interface Props {
  phaseLabel: string
  missions: Mission[]
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors text-left",
        selected
          ? "border-primary bg-primary/8 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function PhaseScheduleDialog({ phaseLabel, missions }: Props) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<ScheduleMode>("continu")
  const [continuSubtype, setContinuSubtype] = useState<ContinuSubtype>("sur_une_phase")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endMode, setEndMode] = useState<EndMode>("duree")
  const [durationH, setDurationH] = useState("")
  const [durationMin, setDurationMin] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [saving, setSaving] = useState(false)

  const updateMission = useUpdateMission()

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
      const h = parseInt(durationH || "0", 10)
      const m = parseInt(durationMin || "0", 10)
      return h > 0 || m > 0
    }
    return !!endDate && !!endTime
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (mode === "continu") {
        await Promise.all(
          missions.map((m) =>
            updateMission.mutateAsync({
              id: m.id,
              patch: {
                schedulingType: "en_continu",
                scheduledStartDate: null,
                scheduledStartTime: null,
                scheduledEndDate: null,
                scheduledEndTime: null,
              },
            })
          )
        )
      } else {
        const end = endMode === "datetime"
          ? (endDate && endTime ? { date: endDate, time: endTime } : null)
          : computedEnd()
        await Promise.all(
          missions.map((m) =>
            updateMission.mutateAsync({
              id: m.id,
              patch: {
                schedulingType: "planifiee",
                scheduledStartDate: startDate || null,
                scheduledStartTime: startTime || null,
                scheduledEndDate: end?.date ?? null,
                scheduledEndTime: end?.time ?? null,
              },
            })
          )
        )
      }
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const end = computedEnd()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-0.5 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        title={`Planifier · ${phaseLabel}`}
      >
        <Clock className="size-3.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Planifier · {phaseLabel}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Mode */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Type</Label>
              <div className="flex gap-2">
                <OptionButton selected={mode === "continu"} onClick={() => setMode("continu")}>
                  Continue
                </OptionButton>
                <OptionButton selected={mode === "ponctuelle"} onClick={() => setMode("ponctuelle")}>
                  Ponctuelle
                </OptionButton>
              </div>
            </div>

            {/* Continue sub-type */}
            {mode === "continu" && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Portée</Label>
                <div className="flex flex-col gap-2">
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

            {/* Ponctuelle fields */}
            {mode === "ponctuelle" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Début</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-28"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Fin</Label>
                  <div className="flex gap-2">
                    <OptionButton selected={endMode === "duree"} onClick={() => setEndMode("duree")}>
                      Durée estimée
                    </OptionButton>
                    <OptionButton selected={endMode === "datetime"} onClick={() => setEndMode("datetime")}>
                      Date et heure
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
                        Fin calculée : <span className="font-medium text-foreground">{end.label}</span>
                      </p>
                    )}
                  </div>
                )}

                {endMode === "datetime" && (
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-28"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!canSave() || saving}>
              {saving ? "Enregistrement…" : "Planifier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
