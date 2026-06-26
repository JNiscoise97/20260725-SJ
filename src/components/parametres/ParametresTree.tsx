import { useMemo, useState } from "react"
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Search, Trash2 } from "lucide-react"

import { usePoles, useDeletePole } from "@/hooks/queries/use-poles"
import { useDomaines, useDeleteDomaine } from "@/hooks/queries/use-domaines"
import { useMissions, useDeleteMission } from "@/hooks/queries/use-missions"
import {
  useAllChecklists,
  useAllChecklistItems,
  useDeleteChecklist,
  useDeleteChecklistItem,
} from "@/hooks/queries/use-checklists"
import type { Checklist, ChecklistItem, Domaine, Mission, Pole } from "@/types/domain"
import { DOMAINE_PHASE_LABELS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PoleDialog } from "@/components/parametres/PoleManager"
import { DomaineDialog, DomaineResponsablesDialog } from "@/components/parametres/DomaineManager"
import { MissionDialog } from "@/components/parametres/MissionManager"
import { ChecklistDialog } from "@/components/parametres/ChecklistDialog"
import { ChecklistItemDialog } from "@/components/parametres/ChecklistItemDialog"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PriorityBadge } from "@/components/shared/PriorityBadge"

const NO_POLE = "__no_pole__"

type Level = "pole" | "domaine" | "mission" | "checklist" | "item"

const TYPE_BADGES: Record<Level, { label: string; className: string }> = {
  pole: { label: "Pôle", className: "bg-bordeaux/10 text-bordeaux" },
  domaine: { label: "Domaine", className: "bg-dore/20 text-brun" },
  mission: { label: "Mission", className: "bg-vert-vegetal/15 text-vert-vegetal" },
  checklist: { label: "Checklist", className: "bg-muted text-muted-foreground" },
  item: { label: "Item", className: "bg-secondary text-secondary-foreground" },
}

function TypeBadge({ level }: { level: Level }) {
  const config = TYPE_BADGES[level]
  return <Badge className={config.className}>{config.label}</Badge>
}

interface TreeRowProps {
  depth: number
  level: Level
  expandable?: boolean
  expanded?: boolean
  onToggle?: () => void
  label: React.ReactNode
  meta?: React.ReactNode
  actions?: React.ReactNode
}

function TreeRow({ depth, level, expandable, expanded, onToggle, label, meta, actions }: TreeRowProps) {
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-lg border border-border px-2 py-1.5 hover:bg-muted/50"
      style={{ marginLeft: depth * 20 }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {expandable ? (
          <Button variant="ghost" size="icon-xs" aria-label={expanded ? "Réduire" : "Développer"} onClick={onToggle}>
            {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </Button>
        ) : (
          <span className="inline-block size-6" />
        )}
        <TypeBadge level={level} />
        <span className="truncate text-sm text-foreground">{label}</span>
        {meta}
      </div>
      <div className="flex shrink-0 items-center gap-0.5">{actions}</div>
    </div>
  )
}

export function ParametresTree() {
  const { data: poles, isLoading: polesLoading } = usePoles()
  const { data: domaines, isLoading: domainesLoading } = useDomaines()
  const { data: missions, isLoading: missionsLoading } = useMissions()
  const { data: checklists, isLoading: checklistsLoading } = useAllChecklists()
  const { data: items, isLoading: itemsLoading } = useAllChecklistItems()

  const deletePole = useDeletePole()
  const deleteDomaine = useDeleteDomaine()
  const deleteMission = useDeleteMission()
  const deleteChecklist = useDeleteChecklist()
  const deleteItem = useDeleteChecklistItem()

  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /** `expanded` ne stocke que les nœuds basculés hors de leur état par défaut (toggle = XOR). */
  function effectiveOpen(id: string, defaultOpen: boolean) {
    return expanded.has(id) ? !defaultOpen : defaultOpen
  }

  function expandAll() {
    const next = new Set<string>()
    for (const p of poles ?? []) next.add(p.id)
    next.add(NO_POLE)
    for (const d of domaines ?? []) next.add(d.id)
    for (const m of missions ?? []) next.add(m.id)
    for (const c of checklists ?? []) {
      if (c.title) next.add(c.id)
    }
    setExpanded(next)
  }

  function collapseAll() {
    const next = new Set<string>()
    for (const c of checklists ?? []) {
      if (!c.title) next.add(c.id)
    }
    setExpanded(next)
  }

  const search = searchQuery.trim().toLowerCase()
  const isSearching = search.length > 0

  const isLoading = polesLoading || domainesLoading || missionsLoading || checklistsLoading || itemsLoading

  const domainesByPoleId = useMemo(() => {
    const map = new Map<string, Domaine[]>()
    for (const d of domaines ?? []) {
      const key = d.poleId ?? NO_POLE
      const list = map.get(key) ?? []
      list.push(d)
      map.set(key, list)
    }
    for (const list of map.values()) list.sort((a, b) => a.sortOrder - b.sortOrder)
    return map
  }, [domaines])

  const missionsByDomaineId = useMemo(() => {
    const map = new Map<string, Mission[]>()
    for (const m of missions ?? []) {
      if (!m.domaineId) continue
      const list = map.get(m.domaineId) ?? []
      list.push(m)
      map.set(m.domaineId, list)
    }
    return map
  }, [missions])

  const checklistsByOwner = useMemo(() => {
    const map = new Map<string, Checklist[]>()
    for (const c of checklists ?? []) {
      if (!c.ownerId) continue
      const key = `${c.ownerType}:${c.ownerId}`
      const list = map.get(key) ?? []
      list.push(c)
      map.set(key, list)
    }
    return map
  }, [checklists])

  const itemsByChecklistId = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>()
    for (const i of items ?? []) {
      const list = map.get(i.checklistId) ?? []
      list.push(i)
      map.set(i.checklistId, list)
    }
    for (const list of map.values()) list.sort((a, b) => a.sortOrder - b.sortOrder)
    return map
  }, [items])

  function checklistMatches(checklist: Checklist) {
    if (!isSearching) return true
    return (checklist.title ?? "").toLowerCase().includes(search)
  }

  function missionMatches(mission: Mission) {
    if (!isSearching) return true
    if (mission.title.toLowerCase().includes(search)) return true
    return (checklistsByOwner.get(`mission:${mission.id}`) ?? []).some(checklistMatches)
  }

  function domaineMatches(domaine: Domaine) {
    if (!isSearching) return true
    if (domaine.name.toLowerCase().includes(search)) return true
    if ((missionsByDomaineId.get(domaine.id) ?? []).some(missionMatches)) return true
    return (checklistsByOwner.get(`domaine:${domaine.id}`) ?? []).some(checklistMatches)
  }

  function poleMatches(pole: Pole | { id: string; name: string }) {
    if (!isSearching) return true
    if (pole.name.toLowerCase().includes(search)) return true
    return (domainesByPoleId.get(pole.id) ?? []).some(domaineMatches)
  }

  function renderChecklistNode(checklist: Checklist, depth: number) {
    const checklistItems = itemsByChecklistId.get(checklist.id) ?? []
    const isOpen = effectiveOpen(checklist.id, !checklist.title)
    return (
      <div key={checklist.id} className="space-y-1">
        <TreeRow
          depth={depth}
          level="checklist"
          expandable
          expanded={isOpen}
          onToggle={() => toggle(checklist.id)}
          label={checklist.title ?? <span className="italic text-muted-foreground">Sans titre</span>}
          meta={<span className="text-xs text-muted-foreground">{checklistItems.length} item(s)</span>}
          actions={
            <>
              <ChecklistItemDialog checklistId={checklist.id} />
              <ChecklistDialog checklist={checklist} />
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Supprimer la checklist"
                onClick={() => deleteChecklist.mutate(checklist.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </>
          }
        />
        {isOpen
          ? checklistItems.map((item) => (
              <TreeRow
                key={item.id}
                depth={depth + 1}
                level="item"
                label={item.label}
                meta={
                  <span className="flex items-center gap-1">
                    <StatusBadge status={item.status} />
                    <PriorityBadge priority={item.priority} />
                  </span>
                }
                actions={
                  <>
                    <ChecklistItemDialog item={item} checklistId={checklist.id} />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Supprimer l'item"
                      onClick={() => deleteItem.mutate(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </>
                }
              />
            ))
          : null}
      </div>
    )
  }

  function renderMissionNode(mission: Mission, depth: number) {
    const missionChecklists = (checklistsByOwner.get(`mission:${mission.id}`) ?? []).filter(checklistMatches)
    const isOpen = effectiveOpen(mission.id, false) || isSearching
    return (
      <div key={mission.id} className="space-y-1">
        <TreeRow
          depth={depth}
          level="mission"
          expandable
          expanded={isOpen}
          onToggle={() => toggle(mission.id)}
          label={mission.title}
          meta={<StatusBadge status={mission.status} />}
          actions={
            <>
              <ChecklistDialog ownerType="mission" ownerId={mission.id} />
              <MissionDialog mission={mission} />
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Supprimer la mission"
                onClick={() => deleteMission.mutate(mission.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </>
          }
        />
        {isOpen ? missionChecklists.map((c) => renderChecklistNode(c, depth + 1)) : null}
      </div>
    )
  }

  function renderDomaineNode(domaine: Domaine, depth: number) {
    const domaineMissions = (missionsByDomaineId.get(domaine.id) ?? []).filter(missionMatches)
    const domaineChecklists = (checklistsByOwner.get(`domaine:${domaine.id}`) ?? []).filter(checklistMatches)
    const isOpen = effectiveOpen(domaine.id, false) || isSearching
    return (
      <div key={domaine.id} className="space-y-1">
        <TreeRow
          depth={depth}
          level="domaine"
          expandable
          expanded={isOpen}
          onToggle={() => toggle(domaine.id)}
          label={domaine.name}
          meta={
            domaine.phase ? (
              <Badge className="bg-muted text-muted-foreground">{DOMAINE_PHASE_LABELS[domaine.phase]}</Badge>
            ) : undefined
          }
          actions={
            <>
              <DomaineResponsablesDialog domaine={domaine} />
              <ChecklistDialog ownerType="domaine" ownerId={domaine.id} />
              <MissionDialog initialDomaineId={domaine.id} />
              <DomaineDialog domaine={domaine} />
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Supprimer le domaine"
                onClick={() => deleteDomaine.mutate(domaine.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </>
          }
        />
        {isOpen ? (
          <>
            {domaineMissions.map((m) => renderMissionNode(m, depth + 1))}
            {domaineChecklists.map((c) => renderChecklistNode(c, depth + 1))}
          </>
        ) : null}
      </div>
    )
  }

  function renderPoleNode(pole: Pole | { id: string; name: string }, depth: number) {
    const poleDomaines = (domainesByPoleId.get(pole.id) ?? []).filter(domaineMatches)
    const isOpen = effectiveOpen(pole.id, false) || isSearching
    return (
      <div key={pole.id} className="space-y-1">
        <TreeRow
          depth={depth}
          level="pole"
          expandable
          expanded={isOpen}
          onToggle={() => toggle(pole.id)}
          label={pole.name}
          meta={<span className="text-xs text-muted-foreground">{poleDomaines.length} domaine(s)</span>}
          actions={
            <>
              <DomaineDialog initialPoleId={pole.id !== NO_POLE ? pole.id : undefined} />
              {"sortOrder" in pole ? (
                <>
                  <PoleDialog pole={pole} />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Supprimer le pôle"
                    onClick={() => deletePole.mutate(pole.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </>
              ) : null}
            </>
          }
        />
        {isOpen ? poleDomaines.map((d) => renderDomaineNode(d, depth + 1)) : null}
      </div>
    )
  }

  const sortedPoles = [...(poles ?? [])].sort((a, b) => a.sortOrder - b.sortOrder).filter(poleMatches)
  const hasUnassignedDomaines = (domainesByPoleId.get(NO_POLE) ?? []).filter(domaineMatches).length > 0

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-heading text-base">Pôles, domaines, missions &amp; checklists</CardTitle>
        <PoleDialog />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un pôle, un domaine, une mission, une checklist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="sm" onClick={expandAll}>
            <ChevronsUpDown className="size-3.5" />
            Tout déplier
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <ChevronsDownUp className="size-3.5" />
            Tout replier
          </Button>
        </div>
        <div className="space-y-1.5">
          {isLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <>
              {sortedPoles.map((pole) => renderPoleNode(pole, 0))}
              {hasUnassignedDomaines ? renderPoleNode({ id: NO_POLE, name: "Sans pôle" }, 0) : null}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
