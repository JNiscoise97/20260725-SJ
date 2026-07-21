import { useState } from "react"
import { ChevronDown, ChevronRight, Clock, Plus, RefreshCw, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import type { Checklist, ChecklistItem, Domaine, Guest, Mission, Pole } from "@/types/domain"
import { useMissions, useCreateMission, useDeleteMission } from "@/hooks/queries/use-missions"
import { useDomaines } from "@/hooks/queries/use-domaines"
import { usePoles } from "@/hooks/queries/use-poles"
import { useGuests } from "@/hooks/queries/use-guests"
import { useAllMissionAcceptances, useRespondToMission } from "@/hooks/queries/use-mission-acceptances"
import { useAllChecklists, useAllChecklistItems, useToggleChecklistItem } from "@/hooks/queries/use-checklists"
import { MissionEditDialog } from "@/components/missions/MissionEditDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DOMAINE_PHASE_LABELS, DOMAINE_PHASE_ORDER } from "@/lib/constants"
import { cn } from "@/lib/utils"

// ── Palette phases ────────────────────────────────────────────────────────────

const PHASE_BADGE: Record<string, string> = {
  avant:           "bg-muted text-muted-foreground border-border",
  installation:    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800",
  jour_j:          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
  desinstallation: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  apres:           "bg-muted text-muted-foreground border-border",
}

// ── Dialog création ───────────────────────────────────────────────────────────

interface CreateDialogProps {
  open: boolean
  onClose: () => void
  missions: Mission[]
  domaines: Domaine[]
}

function CreateMissionDialog({ open, onClose, missions, domaines }: CreateDialogProps) {
  const [title,     setTitle]     = useState("")
  const [domaineId, setDomaineId] = useState("")
  const create = useCreateMission()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await create.mutateAsync({
      title: title.trim(),
      domaineId: domaineId || null,
      status: "todo",
      sortOrder: missions.length,
    })
    toast.success("Mission créée.")
    setTitle(""); setDomaineId("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Nouvelle mission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nm-title">Intitulé *</FieldLabel>
              <Input id="nm-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Accueil des invités" required />
            </Field>
            <Field>
              <FieldLabel>Domaine (optionnel)</FieldLabel>
              <Select value={domaineId || "__none__"} onValueChange={(v) => setDomaineId(v === "__none__" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Aucun domaine" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Aucun</SelectItem>
                  {domaines.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={create.isPending || !title.trim()}>Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Sélecteur assigné inline ──────────────────────────────────────────────────

function AssigneeSelect({ missionId, assignableGuests, currentGuestId }: {
  missionId: string
  assignableGuests: Guest[]
  currentGuestId: string | undefined
}) {
  const respondToMission = useRespondToMission()
  const { data: acceptances = [] } = useAllMissionAcceptances()

  async function handleChange(nextGuestId: string) {
    const realNext = nextGuestId === "__none__" ? "" : nextGuestId
    const current = acceptances.find((a) => a.missionId === missionId && a.status === "accepted")
    if (current && current.guestId !== realNext) {
      await respondToMission.mutateAsync({ missionId, guestId: current.guestId, status: "pending" })
    }
    if (realNext) {
      await respondToMission.mutateAsync({ missionId, guestId: realNext, status: "accepted" })
    }
  }

  return (
    <Select
      value={currentGuestId ?? "__none__"}
      onValueChange={handleChange}
      disabled={respondToMission.isPending}
    >
      <SelectTrigger className="h-7 w-40 text-xs">
        <SelectValue placeholder="Non assigné" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__none__">— Non assigné</SelectItem>
        {assignableGuests.map((g) => (
          <SelectItem key={g.id} value={g.id}>{g.fullName}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ── Section checklist expandée ────────────────────────────────────────────────

function ChecklistExpanded({ missionId, checklists, allItems }: {
  missionId: string
  checklists: Checklist[]
  allItems: ChecklistItem[]
}) {
  const toggle = useToggleChecklistItem()
  const missionChecklists = checklists.filter((c) => c.ownerType === "mission" && c.ownerId === missionId)

  if (missionChecklists.length === 0) {
    return <p className="text-xs text-muted-foreground italic">Aucune checklist</p>
  }

  return (
    <div className="space-y-3">
      {missionChecklists.map((cl) => {
        const items = allItems
          .filter((i) => i.checklistId === cl.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
        return (
          <div key={cl.id} className="space-y-1">
            {cl.title && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{cl.title}</p>
            )}
            {items.length === 0
              ? <p className="text-xs text-muted-foreground italic">Aucun item</p>
              : items.map((item) => (
                  <label key={item.id} className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1 hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={item.isDone}
                      disabled={toggle.isPending}
                      onChange={(e) => toggle.mutate({ itemId: item.id, isDone: e.target.checked })}
                      className="mt-0.5 size-3.5 shrink-0 cursor-pointer accent-primary"
                    />
                    <span className={cn("text-xs leading-relaxed", item.isDone && "line-through text-muted-foreground")}>
                      {item.label}
                    </span>
                  </label>
                ))
            }
          </div>
        )
      })}
    </div>
  )
}

// ── Ligne mission ─────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(iso))
}

function fmtTime(t: string): string {
  return t.slice(0, 5).replace(":", "h")
}

function fmtPeriod(m: Mission): string | null {
  const sd = m.scheduledStartDate
  const st = m.scheduledStartTime
  const ed = m.scheduledEndDate
  const et = m.scheduledEndTime
  if (!sd && !st) return null
  const startParts = [sd ? fmtDate(sd) : null, st ? fmtTime(st) : null].filter(Boolean).join(" ")
  if (!ed && !et) return startParts
  const endParts = [ed && ed !== sd ? fmtDate(ed) : null, et ? fmtTime(et) : null].filter(Boolean).join(" ")
  return `${startParts} → ${endParts}`
}

interface MissionRowProps {
  mission: Mission
  domaine?: Domaine
  pole?: Pole
  assignableGuests: Guest[]
  currentGuestId: string | undefined
  itemCount: number
  checklists: Checklist[]
  allItems: ChecklistItem[]
}

function MissionRow({ mission, domaine, pole, assignableGuests, currentGuestId, itemCount, checklists, allItems }: MissionRowProps) {
  const [expanded, setExpanded]   = useState(false)
  const [confirming, setConfirming] = useState(false)
  const deleteMission = useDeleteMission()

  const phase = domaine?.phase
  const schedulingType = mission.schedulingType

  return (
    <div className="border-b border-border/50 last:border-0">
      {/* Ligne principale */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Toggle expand */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          {expanded
            ? <ChevronDown className="size-4" />
            : <ChevronRight className="size-4" />}
        </button>

        {/* Intitulé */}
        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
          {mission.title}
        </span>

        {/* Assigné */}
        <AssigneeSelect
          missionId={mission.id}
          assignableGuests={assignableGuests}
          currentGuestId={currentGuestId}
        />

        {/* Scheduling */}
        <div className="shrink-0 w-40 text-right">
          {schedulingType === "en_continu" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <RefreshCw className="size-2.5" />En continu
            </span>
          )}
          {schedulingType === "planifiee" && (() => {
            const period = fmtPeriod(mission)
            return period
              ? <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"><Clock className="size-2.5 shrink-0" />{period}</span>
              : <span className="text-[10px] text-muted-foreground italic">À planifier</span>
          })()}
        </div>

        {/* Checklist count */}
        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground w-16 text-center">
          {itemCount > 0
            ? <span>{itemCount} item{itemCount > 1 ? "s" : ""}</span>
            : <span className="italic opacity-50">—</span>}
        </span>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5">
          <MissionEditDialog mission={mission} />
          {confirming ? (
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon-xs" onClick={() => setConfirming(false)}>
                <X className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deleteMission.isPending}
                onClick={async () => {
                  await deleteMission.mutateAsync(mission.id)
                  toast.success("Mission supprimée.")
                }}
              >
                Supprimer
              </Button>
            </div>
          ) : (
            <Button type="button" variant="ghost" size="icon-xs" onClick={() => setConfirming(true)}>
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Section expandée */}
      {expanded && (
        <div className="border-t border-border/30 bg-muted/20 px-4 py-4 space-y-4">
          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-2">
            {phase && (
              <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", PHASE_BADGE[phase] ?? PHASE_BADGE["avant"])}>
                {DOMAINE_PHASE_LABELS[phase]}
              </span>
            )}
            {pole && (
              <span className="text-xs text-muted-foreground">{pole.name}</span>
            )}
            {pole && domaine && <span className="text-muted-foreground/40">·</span>}
            {domaine && (
              <span className="text-xs font-medium text-foreground">{domaine.name}</span>
            )}
            {!phase && !pole && !domaine && (
              <span className="text-xs italic text-muted-foreground">Aucun domaine assigné</span>
            )}
          </div>

          {/* Checklists */}
          <ChecklistExpanded missionId={mission.id} checklists={checklists} allItems={allItems} />
        </div>
      )}
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export function MissionsManager() {
  const { data: missions    = [], isLoading: l1 } = useMissions()
  const { data: domaines    = [], isLoading: l2 } = useDomaines()
  const { data: poles       = [], isLoading: l3 } = usePoles()
  const { data: guests      = [], isLoading: l4 } = useGuests()
  const { data: acceptances = [] } = useAllMissionAcceptances()
  const { data: checklists  = [] } = useAllChecklists()
  const { data: allItems    = [] } = useAllChecklistItems()
  const isLoading = l1 || l2 || l3 || l4

  const [createOpen, setCreateOpen] = useState(false)
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null)
  const [schedFilter, setSchedFilter] = useState<"en_continu" | "a_planifier" | "planifie" | null>(null)

  const domaineById = new Map(domaines.map((d) => [d.id, d]))
  const poleById    = new Map(poles.map((p) => [p.id, p]))
  const assignableGuests = guests.filter((g) => g.assignable)

  // Assignee par mission : invité avec status "accepted"
  const assigneeByMission = new Map<string, string>()
  for (const a of acceptances) {
    if (a.status === "accepted") assigneeByMission.set(a.missionId, a.guestId)
  }

  // Checklist items count par mission
  const missionItemCount = new Map<string, number>()
  const missionChecklists = new Map<string, string[]>() // missionId → checklistIds
  for (const cl of checklists) {
    if (cl.ownerType !== "mission" || !cl.ownerId) continue
    const ids = missionChecklists.get(cl.ownerId) ?? []
    ids.push(cl.id)
    missionChecklists.set(cl.ownerId, ids)
  }
  for (const [missionId, clIds] of missionChecklists) {
    const count = allItems.filter((i) => clIds.includes(i.checklistId)).length
    missionItemCount.set(missionId, count)
  }

  // Tri : phase order → pole sortOrder → domaine sortOrder → mission sortOrder
  const phaseIdx = (phase?: string | null) => {
    const i = DOMAINE_PHASE_ORDER.findIndex((p) => p === phase)
    return i >= 0 ? i : 99
  }

  const sorted = [...missions].sort((a, b) => {
    const dA = a.domaineId ? domaineById.get(a.domaineId) : undefined
    const dB = b.domaineId ? domaineById.get(b.domaineId) : undefined
    const pA = dA?.poleId ? poleById.get(dA.poleId) : undefined
    const pB = dB?.poleId ? poleById.get(dB.poleId) : undefined
    const phDiff = phaseIdx(dA?.phase) - phaseIdx(dB?.phase)
    if (phDiff !== 0) return phDiff
    const poleDiff = (pA?.sortOrder ?? 999) - (pB?.sortOrder ?? 999)
    if (poleDiff !== 0) return poleDiff
    const domDiff = (dA?.sortOrder ?? 999) - (dB?.sortOrder ?? 999)
    if (domDiff !== 0) return domDiff
    return a.sortOrder - b.sortOrder
  })

  // Phases présentes dans la liste triée
  const presentPhases = DOMAINE_PHASE_ORDER.filter((phase) =>
    sorted.some((m) => {
      const d = m.domaineId ? domaineById.get(m.domaineId) : undefined
      return d?.phase === phase
    })
  )

  // Application des filtres
  const visible = sorted.filter((m) => {
    if (phaseFilter) {
      const d = m.domaineId ? domaineById.get(m.domaineId) : undefined
      if (d?.phase !== phaseFilter) return false
    }
    if (schedFilter) {
      const st = m.schedulingType
      if (schedFilter === "en_continu" && st !== "en_continu") return false
      if (schedFilter === "a_planifier") {
        if (st !== "planifiee" || fmtPeriod(m) !== null) return false
      }
      if (schedFilter === "planifie") {
        if (st !== "planifiee" || fmtPeriod(m) === null) return false
      }
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barre du haut */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{missions.length} mission{missions.length !== 1 ? "s" : ""}</p>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Nouvelle mission
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Phase */}
        {presentPhases.map((phase) => (
          <button
            key={phase}
            type="button"
            onClick={() => setPhaseFilter(phaseFilter === phase ? null : phase)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              phaseFilter === phase
                ? cn("font-semibold", PHASE_BADGE[phase] ?? PHASE_BADGE["avant"])
                : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted"
            )}
          >
            {DOMAINE_PHASE_LABELS[phase as keyof typeof DOMAINE_PHASE_LABELS]}
          </button>
        ))}

        {/* Séparateur si des phases sont présentes */}
        {presentPhases.length > 0 && (
          <div className="h-4 w-px bg-border/60" />
        )}

        {/* Scheduling */}
        {(
          [
            { key: "en_continu",  label: "En continu",  cls: "border-border/60 bg-muted/40 text-muted-foreground", activeClsDark: "border-border bg-muted text-foreground font-semibold" },
            { key: "a_planifier", label: "À planifier",  cls: "border-amber-200/60 bg-amber-50/40 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-400", activeClsDark: "border-amber-400 bg-amber-100 text-amber-800 font-semibold dark:border-amber-600 dark:bg-amber-900/50 dark:text-amber-200" },
            { key: "planifie",    label: "Planifié",     cls: "border-indigo-200/60 bg-indigo-50/40 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/30 dark:text-indigo-400", activeClsDark: "border-indigo-400 bg-indigo-100 text-indigo-800 font-semibold dark:border-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-200" },
          ] as const
        ).map(({ key, label, cls, activeClsDark }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSchedFilter(schedFilter === key ? null : key)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] transition-all",
              schedFilter === key ? activeClsDark : cls
            )}
          >
            {label}
          </button>
        ))}

        {/* Reset si filtre actif */}
        {(phaseFilter || schedFilter) && (
          <button
            type="button"
            onClick={() => { setPhaseFilter(null); setSchedFilter(null) }}
            className="ml-1 text-[11px] text-muted-foreground underline-offset-2 hover:underline"
          >
            Tout afficher
          </button>
        )}
      </div>

      {/* Légende colonnes */}
      <div className="flex items-center gap-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <div className="size-4 shrink-0" />
        <div className="min-w-0 flex-1">Intitulé</div>
        <div className="w-40 shrink-0">Assigné</div>
        <div className="w-40 shrink-0 text-right">Timing</div>
        <div className="w-16 shrink-0 text-center">Checklist</div>
        <div className="shrink-0 w-16" />
      </div>

      {/* Liste */}
      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          Aucune mission. Cliquez sur « Nouvelle mission » pour commencer.
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
          Aucune mission ne correspond aux filtres sélectionnés.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {visible.map((m) => {
            const domaine = m.domaineId ? domaineById.get(m.domaineId) : undefined
            const pole    = domaine?.poleId ? poleById.get(domaine.poleId) : undefined
            return (
              <MissionRow
                key={m.id}
                mission={m}
                domaine={domaine}
                pole={pole}
                assignableGuests={assignableGuests}
                currentGuestId={assigneeByMission.get(m.id)}
                itemCount={missionItemCount.get(m.id) ?? 0}
                checklists={checklists}
                allItems={allItems}
              />
            )
          })}
        </div>
      )}

      <CreateMissionDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        missions={missions}
        domaines={domaines}
      />
    </div>
  )
}
