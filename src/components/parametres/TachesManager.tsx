import { useState } from "react"
import { RefreshCw, CalendarRange, X } from "lucide-react"

import type { Checklist, ChecklistItem, Domaine, Guest, Mission, TaskSchedulingType } from "@/types/domain"
import { useAllChecklistItems, useAllChecklists, useUpdateChecklistItem } from "@/hooks/queries/use-checklists"
import { useMissions } from "@/hooks/queries/use-missions"
import { useDomaines } from "@/hooks/queries/use-domaines"
import { useGuests } from "@/hooks/queries/use-guests"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { DOMAINE_PHASE_LABELS, DOMAINE_PHASE_ORDER } from "@/lib/constants"
import { cn } from "@/lib/utils"

// ── Types contexte ────────────────────────────────────────────────────────────

interface ItemContext {
  item: ChecklistItem
  checklist: Checklist
  mission: Mission | undefined
  domaine: Domaine | undefined
}

// ── Ligne tâche ───────────────────────────────────────────────────────────────

function ItemRow({ ctx, assignableGuests }: { ctx: ItemContext; assignableGuests: Guest[] }) {
  const { item } = ctx
  const update = useUpdateChecklistItem()

  function patch(p: Partial<ChecklistItem>) {
    update.mutate({ id: item.id, patch: p })
  }

  function setScheduling(type: TaskSchedulingType | null) {
    patch({
      taskSchedulingType: type,
      taskPhase: null,
      estimatedStartDate: null,
      estimatedStartTime: null,
      estimatedEndDate: null,
      estimatedEndTime: null,
    })
  }

  const scheduling = item.taskSchedulingType ?? null

  return (
    <div className="space-y-2 rounded-xl border border-border bg-card px-4 py-3">
      {/* Chemin contextuel */}
      <p className="text-[10px] text-muted-foreground">
        {[ctx.domaine?.name, ctx.mission?.title, ctx.checklist.title].filter(Boolean).join(" › ")}
      </p>

      {/* Intitulé */}
      <p className="text-sm font-medium text-foreground">{item.label}</p>

      {/* Contrôles */}
      <div className="flex flex-wrap items-start gap-3">
        {/* Assigné */}
        <Select
          value={item.assigneeGuestId ?? "__none__"}
          onValueChange={(v) => patch({ assigneeGuestId: v === "__none__" ? null : v })}
        >
          <SelectTrigger className="h-7 w-44 text-xs">
            <SelectValue placeholder="Non assigné" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— Non assigné</SelectItem>
            {assignableGuests.map((g) => (
              <SelectItem key={g.id} value={g.id}>{g.fullName}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Séparateur */}
        <div className="h-7 w-px bg-border/60" />

        {/* Boutons type de planification */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setScheduling(null)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              !scheduling
                ? "border-border bg-muted text-foreground font-semibold"
                : "border-border/50 text-muted-foreground hover:bg-muted/50"
            )}
          >
            Aucun
          </button>
          <button
            type="button"
            onClick={() => setScheduling("en_continu")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              scheduling === "en_continu"
                ? "border-border bg-muted text-foreground font-semibold"
                : "border-border/50 text-muted-foreground hover:bg-muted/50"
            )}
          >
            <RefreshCw className="size-2.5" />
            En continu
          </button>
          <button
            type="button"
            onClick={() => setScheduling("periode")}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              scheduling === "periode"
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 font-semibold dark:border-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300"
                : "border-border/50 text-muted-foreground hover:bg-muted/50"
            )}
          >
            <CalendarRange className="size-2.5" />
            Période
          </button>
        </div>

        {/* Phase (si "en continu") */}
        {scheduling === "en_continu" && (
          <Select
            value={item.taskPhase ?? "__none__"}
            onValueChange={(v) => patch({ taskPhase: v === "__none__" ? null : v })}
          >
            <SelectTrigger className="h-7 w-44 text-xs">
              <SelectValue placeholder="Choisir une phase…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">— Toute la durée</SelectItem>
              {DOMAINE_PHASE_ORDER.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  {DOMAINE_PHASE_LABELS[phase as keyof typeof DOMAINE_PHASE_LABELS]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Période (si "periode") */}
        {scheduling === "periode" && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Input
              type="date"
              className="h-7 w-36 text-xs"
              value={item.estimatedStartDate ?? ""}
              onChange={(e) => patch({ estimatedStartDate: e.target.value || null })}
            />
            <Input
              type="time"
              className="h-7 w-24 text-xs"
              value={item.estimatedStartTime ?? ""}
              onChange={(e) => patch({ estimatedStartTime: e.target.value || null })}
            />
            <span className="text-xs text-muted-foreground">→</span>
            <Input
              type="date"
              className="h-7 w-36 text-xs"
              value={item.estimatedEndDate ?? ""}
              onChange={(e) => patch({ estimatedEndDate: e.target.value || null })}
            />
            <Input
              type="time"
              className="h-7 w-24 text-xs"
              value={item.estimatedEndTime ?? ""}
              onChange={(e) => patch({ estimatedEndTime: e.target.value || null })}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export function TachesManager() {
  const { data: items     = [], isLoading: l1 } = useAllChecklistItems()
  const { data: checklists = [], isLoading: l2 } = useAllChecklists()
  const { data: missions   = [], isLoading: l3 } = useMissions()
  const { data: domaines   = [], isLoading: l4 } = useDomaines()
  const { data: guests     = [], isLoading: l5 } = useGuests()
  const isLoading = l1 || l2 || l3 || l4 || l5

  const [phaseFilter, setPhaseFilter]   = useState<string | null>(null)
  const [assignFilter, setAssignFilter] = useState<"all" | "assigned" | "unassigned">("all")
  const [schedFilter, setSchedFilter]   = useState<TaskSchedulingType | "none" | null>(null)

  const checklistById = new Map(checklists.map((c) => [c.id, c]))
  const missionById   = new Map(missions.map((m) => [m.id, m]))
  const domaineById   = new Map(domaines.map((d) => [d.id, d]))
  const assignableGuests = guests.filter((g) => g.assignable)

  // Construire les contextes
  const contexts: ItemContext[] = items
    .filter((item) => {
      const cl = checklistById.get(item.checklistId)
      return cl?.ownerType === "mission" && cl.ownerId
    })
    .map((item) => {
      const cl      = checklistById.get(item.checklistId)!
      const mission = cl.ownerId ? missionById.get(cl.ownerId) : undefined
      const domaine = mission?.domaineId ? domaineById.get(mission.domaineId) : undefined
      return { item, checklist: cl, mission, domaine }
    })

  // Filtres
  const visible = contexts.filter(({ item, domaine }) => {
    if (phaseFilter && domaine?.phase !== phaseFilter) return false
    if (assignFilter === "assigned"   && !item.assigneeGuestId) return false
    if (assignFilter === "unassigned" && item.assigneeGuestId)  return false
    if (schedFilter === "none"        && item.taskSchedulingType) return false
    if (schedFilter === "en_continu"  && item.taskSchedulingType !== "en_continu") return false
    if (schedFilter === "periode"     && item.taskSchedulingType !== "periode") return false
    return true
  })

  // Tri : domaine phase order → mission sortOrder → checklist → item sortOrder
  const phaseIdx = (phase?: string | null) => {
    const i = DOMAINE_PHASE_ORDER.findIndex((p) => p === phase)
    return i >= 0 ? i : 99
  }
  visible.sort((a, b) => {
    const phDiff = phaseIdx(a.domaine?.phase) - phaseIdx(b.domaine?.phase)
    if (phDiff !== 0) return phDiff
    const mDiff = (a.mission?.sortOrder ?? 999) - (b.mission?.sortOrder ?? 999)
    if (mDiff !== 0) return mDiff
    return a.item.sortOrder - b.item.sortOrder
  })

  // Présences pour les pills de phase
  const presentPhases = DOMAINE_PHASE_ORDER.filter((ph) =>
    contexts.some(({ domaine }) => domaine?.phase === ph)
  )

  const PHASE_PILL: Record<string, string> = {
    avant:           "border-border bg-muted text-muted-foreground",
    installation:    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
    jour_j:          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
    desinstallation: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    apres:           "border-border bg-muted text-muted-foreground",
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    )
  }

  const hasFilter = phaseFilter || assignFilter !== "all" || schedFilter

  return (
    <div className="space-y-4">
      {/* Stats */}
      <p className="text-sm text-muted-foreground">
        {visible.length} tâche{visible.length !== 1 ? "s" : ""}
        {hasFilter ? ` sur ${contexts.length}` : ""}
      </p>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Phase */}
        {presentPhases.map((ph) => (
          <button
            key={ph}
            type="button"
            onClick={() => setPhaseFilter(phaseFilter === ph ? null : ph)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              phaseFilter === ph
                ? cn("font-semibold", PHASE_PILL[ph])
                : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted"
            )}
          >
            {DOMAINE_PHASE_LABELS[ph as keyof typeof DOMAINE_PHASE_LABELS]}
          </button>
        ))}

        {presentPhases.length > 0 && <div className="h-4 w-px bg-border/60" />}

        {/* Assignation */}
        {(["all", "assigned", "unassigned"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setAssignFilter(v)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              assignFilter === v
                ? "border-border bg-muted text-foreground font-semibold"
                : "border-border/50 text-muted-foreground hover:bg-muted/50"
            )}
          >
            {v === "all" ? "Tous" : v === "assigned" ? "Assignés" : "Non assignés"}
          </button>
        ))}

        <div className="h-4 w-px bg-border/60" />

        {/* Planification */}
        {(
          [
            { key: "none",       label: "Sans planning" },
            { key: "en_continu", label: "En continu" },
            { key: "periode",    label: "Période" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSchedFilter(schedFilter === key ? null : key)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
              schedFilter === key
                ? "border-border bg-muted text-foreground font-semibold"
                : "border-border/50 text-muted-foreground hover:bg-muted/50"
            )}
          >
            {label}
          </button>
        ))}

        {hasFilter && (
          <button
            type="button"
            onClick={() => { setPhaseFilter(null); setAssignFilter("all"); setSchedFilter(null) }}
            className="ml-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground underline-offset-2 hover:underline"
          >
            <X className="size-3" />
            Tout afficher
          </button>
        )}
      </div>

      {/* Liste */}
      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          {contexts.length === 0
            ? "Aucune tâche (checklist item) trouvée dans les missions."
            : "Aucune tâche ne correspond aux filtres sélectionnés."}
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map(({ item, checklist, mission, domaine }) => (
            <ItemRow
              key={item.id}
              ctx={{ item, checklist, mission, domaine }}
              assignableGuests={assignableGuests}
            />
          ))}
        </div>
      )}
    </div>
  )
}
