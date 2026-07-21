import { format, addDays, parseISO } from "date-fns"
import { AlertTriangle, RotateCcw, X } from "lucide-react"
import { toast } from "sonner"

import { EVENT_TYPE_LABELS, type EventType } from "@/services/settings.service"
import { type PhaseRange, useEventConfig } from "@/context/EventConfigContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

function save(label: string) { toast.success(`${label} mis à jour.`) }

// ── Détection chevauchement ───────────────────────────────────────────────────

function hmToMin(hm: string): number {
  const [h, m] = hm.split(":").map(Number)
  return h * 60 + (m ?? 0)
}

/**
 * Retourne un message de chevauchement si la phase B commence avant la fin de
 * la phase A. Nécessite que A ait un endTime explicite pour être précis.
 */
function computeOverlap(
  a: PhaseRange,
  b: PhaseRange
): { durationLabel: string; fromLabel: string; toLabel: string } | null {
  if (!a.endTime) return null

  const aEndMs =
    parseISO(a.endIso ?? a.startIso).getTime() + hmToMin(a.endTime) * 60_000
  const bStartMs =
    parseISO(b.startIso).getTime() + (b.time ? hmToMin(b.time) : 0) * 60_000

  if (bStartMs >= aEndMs) return null

  const overlapMin = Math.round((aEndMs - bStartMs) / 60_000)
  const h          = Math.floor(overlapMin / 60)
  const m          = overlapMin % 60
  const durationLabel =
    h > 0 && m > 0 ? `${h}h${m.toString().padStart(2, "0")}`
    : h > 0         ? `${h}h`
                    : `${m}min`

  const bDate  = parseISO(b.startIso)
  const aEnd   = parseISO(a.endIso ?? a.startIso)
  const fromLabel = `${format(bDate, "d/MM")} ${(b.time ?? "00:00").replace(":", "h")}`
  const toLabel   = `${format(aEnd, "d/MM")} ${a.endTime.replace(":", "h")}`

  return { durationLabel, fromLabel, toLabel }
}

// ── Sections Début / Fin ──────────────────────────────────────────────────────

interface RangeFieldsProps {
  phase: PhaseRange
  autoStartLabel?: string
  onStartChange: (iso: string) => void
  onResetStart?: () => void
  onEndChange: (iso: string | undefined) => void
  onTimeChange: (time: string | undefined) => void
  onEndTimeChange: (time: string | undefined) => void
}

function RangeFields({
  phase,
  autoStartLabel,
  onStartChange,
  onResetStart,
  onEndChange,
  onTimeChange,
  onEndTimeChange,
}: RangeFieldsProps) {
  return (
    <div className="divide-y divide-border">

      {/* ── Début ──────────────────────────────────────────────────────── */}
      <div className="pb-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Début
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor={`${phase.startIso}-start`}>
              Date
              {onResetStart && phase.isOverride && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto px-1.5 py-0.5 text-xs text-muted-foreground"
                  onClick={onResetStart}
                >
                  <RotateCcw className="mr-1 size-3" />
                  Réinitialiser ({autoStartLabel})
                </Button>
              )}
            </FieldLabel>
            <Input
              id={`${phase.startIso}-start`}
              type="date"
              value={phase.startIso}
              onChange={(e) => onStartChange(e.target.value)}
            />
            {autoStartLabel && !phase.isOverride && (
              <FieldDescription>Calculé automatiquement ({autoStartLabel})</FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor={`${phase.startIso}-time`}>
              Heure{" "}
              <span className="font-normal text-muted-foreground">(optionnel)</span>
            </FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                id={`${phase.startIso}-time`}
                type="time"
                value={phase.time ?? ""}
                onChange={(e) => onTimeChange(e.target.value || undefined)}
                className="w-full"
              />
              {phase.time && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onTimeChange(undefined)}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
          </Field>
        </div>
      </div>

      {/* ── Fin ────────────────────────────────────────────────────────── */}
      <div className="pt-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Fin
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor={`${phase.startIso}-end`}>
              Date
              {phase.endIso && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto px-1.5 py-0.5 text-xs text-muted-foreground"
                  onClick={() => onEndChange(undefined)}
                >
                  <X className="mr-1 size-3" />
                  Supprimer
                </Button>
              )}
            </FieldLabel>
            <Input
              id={`${phase.startIso}-end`}
              type="date"
              value={phase.endIso ?? ""}
              min={phase.startIso}
              onChange={(e) => onEndChange(e.target.value || undefined)}
            />
            {!phase.endIso && <FieldDescription>Non renseignée — dure 1 jour</FieldDescription>}
          </Field>

          <Field>
            <FieldLabel htmlFor={`${phase.startIso}-end-time`}>
              Heure{" "}
              <span className="font-normal text-muted-foreground">(optionnel)</span>
            </FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                id={`${phase.startIso}-end-time`}
                type="time"
                value={phase.endTime ?? ""}
                onChange={(e) => onEndTimeChange(e.target.value || undefined)}
                className="w-full"
              />
              {phase.endTime && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEndTimeChange(undefined)}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
            {!phase.endTime && <FieldDescription>Non renseignée — fin de journée</FieldDescription>}
          </Field>
        </div>
      </div>

    </div>
  )
}

// ── OverlapAlert ──────────────────────────────────────────────────────────────

function OverlapAlert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 dark:border-amber-800 dark:bg-amber-950/40">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
      <p className="text-sm text-amber-800 dark:text-amber-300">{message}</p>
    </div>
  )
}

// ── Formulaire principal ──────────────────────────────────────────────────────

export function EventConfigForm() {
  const { eventDate, eventType, phaseMain, phaseSetup, phaseCleanup, updateSettings } =
    useEventConfig()

  const autoSetupIso   = format(addDays(eventDate, -1), "yyyy-MM-dd")
  const autoCleanupIso = format(addDays(eventDate, 1),  "yyyy-MM-dd")

  const overlapSetupMain   = computeOverlap(phaseSetup, phaseMain)
  const overlapMainCleanup = computeOverlap(phaseMain, phaseCleanup)

  return (
    <div className="space-y-4">

      {/* Type d'événement */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Événement</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel>Type d'événement</FieldLabel>
            <Select
              value={eventType}
              onValueChange={(v) => { updateSettings({ eventType: v as EventType }); save("Type") }}
            >
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((t) => (
                  <SelectItem key={t} value={t}>{EVENT_TYPE_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {/* Jour J — titre = type d'événement */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">{EVENT_TYPE_LABELS[eventType]}</CardTitle>
        </CardHeader>
        <CardContent>
          <RangeFields
            phase={phaseMain}
            onStartChange={(iso) => { updateSettings({ eventDate: iso }); save("Date de début") }}
            onEndChange={(iso) => { updateSettings({ mainEnd: iso }); save("Date de fin") }}
            onTimeChange={(t) => { updateSettings({ mainTime: t }); save("Heure de début") }}
            onEndTimeChange={(t) => { updateSettings({ mainEndTime: t }); save("Heure de fin") }}
          />
        </CardContent>
      </Card>

      {overlapSetupMain && (
        <OverlapAlert
          message={`L'installation et l'événement se chevauchent de ${overlapSetupMain.durationLabel} (${overlapSetupMain.fromLabel} → ${overlapSetupMain.toLabel}).`}
        />
      )}

      {/* Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Installation</CardTitle>
        </CardHeader>
        <CardContent>
          <RangeFields
            phase={phaseSetup}
            autoStartLabel="J-1"
            onStartChange={(iso) => {
              updateSettings({ setupStart: iso === autoSetupIso ? undefined : iso })
              save("Date de début")
            }}
            onResetStart={() => { updateSettings({ setupStart: undefined }); save("Date réinitialisée") }}
            onEndChange={(iso) => { updateSettings({ setupEnd: iso }); save("Date de fin") }}
            onTimeChange={(t) => { updateSettings({ setupTime: t }); save("Heure de début") }}
            onEndTimeChange={(t) => { updateSettings({ setupEndTime: t }); save("Heure de fin") }}
          />
        </CardContent>
      </Card>

      {overlapMainCleanup && (
        <OverlapAlert
          message={`La désinstallation commence avant la fin de l'événement — chevauchement de ${overlapMainCleanup.durationLabel} (${overlapMainCleanup.fromLabel} → ${overlapMainCleanup.toLabel}).`}
        />
      )}

      {/* Désinstallation */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Désinstallation</CardTitle>
        </CardHeader>
        <CardContent>
          <RangeFields
            phase={phaseCleanup}
            autoStartLabel="J+1"
            onStartChange={(iso) => {
              updateSettings({ cleanupStart: iso === autoCleanupIso ? undefined : iso })
              save("Date de début")
            }}
            onResetStart={() => { updateSettings({ cleanupStart: undefined }); save("Date réinitialisée") }}
            onEndChange={(iso) => { updateSettings({ cleanupEnd: iso }); save("Date de fin") }}
            onTimeChange={(t) => { updateSettings({ cleanupTime: t }); save("Heure de début") }}
            onEndTimeChange={(t) => { updateSettings({ cleanupEndTime: t }); save("Heure de fin") }}
          />
        </CardContent>
      </Card>

    </div>
  )
}
