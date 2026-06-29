import { useMemo, useState } from "react"
import { ListChecks, LayoutGrid, FolderTree, CheckCircle2, TriangleAlert, Clock, Ban, ArrowRight } from "lucide-react"

import type { ChecklistItem, Domaine, Mission, ProgressStatus } from "@/types/domain"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatCard } from "@/components/shared/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { ChecklistWidget } from "@/components/shared/ChecklistWidget"
import { ChecklistItemCard } from "@/components/checklist-items/ChecklistItemCard"
import { useMissions } from "@/hooks/queries/use-missions"
import { useDomaines } from "@/hooks/queries/use-domaines"
import { usePoles } from "@/hooks/queries/use-poles"
import { useAllChecklists, useAllChecklistItems, useUpdateChecklistItem } from "@/hooks/queries/use-checklists"
import { useIdentity } from "@/context/IdentityContext"
import { useResponsableEntries } from "@/hooks/use-responsable-entries"
import { DOMAINE_PHASE_LABELS, DOMAINE_PHASE_ORDER } from "@/lib/constants"

const NO_POLE = "__no_pole__"
const DASHBOARD_TAB = "__dashboard__"

function itemStats(items: ChecklistItem[]) {
  const total = items.length
  const done = items.filter((item) => item.isDone).length
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  return { total, done, percent }
}

function effectiveDueDate(item: ChecklistItem) {
  return item.estimatedEndDate ?? item.estimatedStartDate ?? null
}

function contextLabel(mission?: Mission, domaine?: Domaine) {
  return [domaine?.name, mission?.title].filter(Boolean).join(" · ") || undefined
}

export function MissionsPage() {
  const { data: missions, isLoading: missionsLoading } = useMissions()
  const { data: domaines, isLoading: domainesLoading } = useDomaines()
  const { data: poles, isLoading: polesLoading } = usePoles()
  const { data: checklists, isLoading: checklistsLoading } = useAllChecklists()
  const { data: checklistItems, isLoading: itemsLoading } = useAllChecklistItems()
  const updateItem = useUpdateChecklistItem()
  const { person } = useIdentity()
  const { isLoading: entriesLoading, entries } = useResponsableEntries()

  const isLoading =
    missionsLoading || domainesLoading || polesLoading || checklistsLoading || itemsLoading || entriesLoading

  // Un fiancé voit l'ensemble des missions (vue d'organisation) ; un
  // référent ne voit que celles des domaines qui lui sont confiés.
  const myDomaineIds = useMemo(() => {
    if (!person || person.role === "fiance") return null
    return entries.find((e) => e.identity.id === person.id)?.domaineIds ?? []
  }, [person, entries])

  const visibleMissions = useMemo(() => {
    if (!missions) return undefined
    if (myDomaineIds === null) return missions
    return missions.filter((m) => m.domaineId && myDomaineIds.includes(m.domaineId))
  }, [missions, myDomaineIds])

  const itemsByMissionId = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>()
    if (!checklists || !checklistItems) return map
    const checklistsByMissionId = new Map<string, string[]>()
    for (const checklist of checklists) {
      if (checklist.ownerType !== "mission" || !checklist.ownerId) continue
      const ids = checklistsByMissionId.get(checklist.ownerId) ?? []
      ids.push(checklist.id)
      checklistsByMissionId.set(checklist.ownerId, ids)
    }
    for (const [missionId, checklistIds] of checklistsByMissionId) {
      map.set(
        missionId,
        checklistItems.filter((item) => checklistIds.includes(item.checklistId))
      )
    }
    return map
  }, [checklists, checklistItems])

  const poleGroups = useMemo(() => {
    if (!visibleMissions || !domaines || !poles) return []

    const sortedPoles = [...poles].sort((a, b) => a.sortOrder - b.sortOrder)
    const poleList: { id: string; name: string }[] = [
      ...sortedPoles.map((p) => ({ id: p.id, name: p.name })),
      { id: NO_POLE, name: "Sans pôle" },
    ]

    return poleList
      .map((pole) => {
        const poleDomaines = domaines
          .filter((d) => (pole.id === NO_POLE ? !d.poleId : d.poleId === pole.id))
          .sort((a, b) => {
            const phaseDiff =
              DOMAINE_PHASE_ORDER.indexOf(a.phase ?? DOMAINE_PHASE_ORDER[0]) -
              DOMAINE_PHASE_ORDER.indexOf(b.phase ?? DOMAINE_PHASE_ORDER[0])
            return phaseDiff !== 0 ? phaseDiff : a.sortOrder - b.sortOrder
          })
          .map((domaine) => ({
            domaine,
            missions: visibleMissions.filter((m) => m.domaineId === domaine.id).sort((a, b) => a.sortOrder - b.sortOrder),
          }))
          .filter((group) => group.missions.length > 0)

        const poleMissions = poleDomaines.flatMap((g) => g.missions)
        const poleItems = poleMissions.flatMap((m) => itemsByMissionId.get(m.id) ?? [])

        return {
          pole,
          domaineGroups: poleDomaines,
          stats: {
            domaineCount: poleDomaines.length,
            missionCount: poleMissions.length,
            ...itemStats(poleItems),
          },
        }
      })
      .filter((group) => group.domaineGroups.length > 0)
  }, [visibleMissions, domaines, poles, itemsByMissionId])

  const globalStats = useMemo(() => {
    const allItems = [...itemsByMissionId.values()].flat()
    return {
      poleCount: poleGroups.length,
      domaineCount: poleGroups.reduce((sum, g) => sum + g.domaineGroups.length, 0),
      missionCount: (visibleMissions ?? []).length,
      ...itemStats(allItems),
    }
  }, [poleGroups, visibleMissions, itemsByMissionId])

  const itemsWithContext = useMemo(() => {
    if (!visibleMissions || !domaines) return []
    const missionById = new Map(visibleMissions.map((m) => [m.id, m]))
    const domaineById = new Map(domaines.map((d) => [d.id, d]))
    const visibleMissionIds = new Set(visibleMissions.map((m) => m.id))
    const result: { item: ChecklistItem; mission?: Mission; domaine?: Domaine }[] = []
    for (const [missionId, items] of itemsByMissionId) {
      if (!visibleMissionIds.has(missionId)) continue
      const mission = missionById.get(missionId)
      const domaine = mission?.domaineId ? domaineById.get(mission.domaineId) : undefined
      for (const item of items) result.push({ item, mission, domaine })
    }
    return result
  }, [itemsByMissionId, visibleMissions, domaines])

  const dashboard = useMemo(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const notDone = itemsWithContext.filter(({ item }) => item.status !== "done")
    const urgent = notDone
      .filter(({ item }) => item.priority === "urgent")
      .sort((a, b) => (effectiveDueDate(a.item) ?? "9999").localeCompare(effectiveDueDate(b.item) ?? "9999"))
    const overdue = notDone
      .filter(({ item }) => {
        const due = effectiveDueDate(item)
        return due && new Date(due) < startOfToday
      })
      .sort((a, b) => (effectiveDueDate(a.item) ?? "9999").localeCompare(effectiveDueDate(b.item) ?? "9999"))
    const blocked = notDone.filter(({ item }) => item.status === "blocked")

    return { urgent, overdue, blocked }
  }, [itemsWithContext])

  function handleStatusChange(item: ChecklistItem, status: ProgressStatus) {
    updateItem.mutate({ id: item.id, patch: { status, isDone: status === "done" } })
  }

  const [activeTab, setActiveTab] = useState(DASHBOARD_TAB)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Missions"
        description={
          myDomaineIds === null
            ? "Toutes les missions, regroupées par pôle et domaine, avec leurs checklists."
            : "Les missions qui vous ont été confiées, avec leurs checklists."
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : poleGroups.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={myDomaineIds === null ? "Aucune mission pour l'instant" : "Aucune mission ne vous a été confiée pour le moment"}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={LayoutGrid}
              label="Pôles"
              value={globalStats.poleCount}
              hint={`${globalStats.domaineCount} domaines`}
              accentClassName="bg-dore/20 text-brun"
            />
            <StatCard
              icon={FolderTree}
              label="Missions"
              value={globalStats.missionCount}
              accentClassName="bg-bordeaux/10 text-bordeaux"
            />
            <StatCard
              icon={CheckCircle2}
              label="Items terminés"
              value={`${globalStats.done} / ${globalStats.total}`}
              hint={`${globalStats.percent}% complété`}
              accentClassName="bg-vert-vegetal/15 text-vert-vegetal"
            />
            <Card>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Avancement global</p>
                <Progress value={globalStats.percent} />
                <p className="text-xs text-muted-foreground">{globalStats.percent}%</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="min-w-0">
          <div className="min-w-0 max-w-full overflow-x-auto">
            <TabsList>
              <TabsTrigger value={DASHBOARD_TAB} className="flex-none">
                Dashboard
              </TabsTrigger>
              {poleGroups.map(({ pole }) => (
                <TabsTrigger key={pole.id} value={pole.id} className="flex-none">
                  {pole.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={DASHBOARD_TAB} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                icon={TriangleAlert}
                label="Urgents"
                value={dashboard.urgent.length}
                accentClassName="bg-bordeaux/10 text-bordeaux"
              />
              <StatCard
                icon={Clock}
                label="En retard"
                value={dashboard.overdue.length}
                accentClassName="bg-dore/20 text-brun"
              />
              <StatCard
                icon={Ban}
                label="Bloqués"
                value={dashboard.blocked.length}
                accentClassName="bg-muted text-muted-foreground"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">Avancement par pôle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {poleGroups.map(({ pole, stats }) => (
                  <div
                    key={pole.id}
                    className="flex items-center gap-3 rounded-xl border border-border px-3 py-2"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{pole.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {stats.done} / {stats.total} ({stats.percent}%)
                        </span>
                      </div>
                      <Progress value={stats.percent} />
                      <p className="text-xs text-muted-foreground">
                        {stats.domaineCount} domaine{stats.domaineCount === 1 ? "" : "s"} ·{" "}
                        {stats.missionCount} mission{stats.missionCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab(pole.id)}>
                      Voir
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">Urgents</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard.urgent.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Rien d&apos;urgent. 🎉</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {dashboard.urgent.map(({ item, mission, domaine }) => (
                      <ChecklistItemCard
                        key={item.id}
                        item={item}
                        context={contextLabel(mission, domaine)}
                        onStatusChange={(status) => handleStatusChange(item, status)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">En retard</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard.overdue.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Rien en retard. 🎉</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {dashboard.overdue.map(({ item, mission, domaine }) => (
                      <ChecklistItemCard
                        key={item.id}
                        item={item}
                        context={contextLabel(mission, domaine)}
                        onStatusChange={(status) => handleStatusChange(item, status)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-base">Bloqués</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard.blocked.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun item bloqué.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {dashboard.blocked.map(({ item, mission, domaine }) => (
                      <ChecklistItemCard
                        key={item.id}
                        item={item}
                        context={contextLabel(mission, domaine)}
                        onStatusChange={(status) => handleStatusChange(item, status)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {poleGroups.map(({ pole, domaineGroups, stats }) => (
            <TabsContent key={pole.id} value={pole.id} className="space-y-4">
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {stats.domaineCount} domaine{stats.domaineCount === 1 ? "" : "s"}
                    </span>
                    <span aria-hidden>·</span>
                    <span>
                      {stats.missionCount} mission{stats.missionCount === 1 ? "" : "s"}
                    </span>
                    <span aria-hidden>·</span>
                    <span>
                      {stats.done} / {stats.total} items terminés ({stats.percent}%)
                    </span>
                  </div>
                  <Progress value={stats.percent} />
                </CardContent>
              </Card>
              {domaineGroups.map(({ domaine, missions: domaineMissions }) => (
                <Card key={domaine.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="font-heading text-base">{domaine.name}</CardTitle>
                      {domaine.phase ? (
                        <Badge className="bg-muted text-muted-foreground">{DOMAINE_PHASE_LABELS[domaine.phase]}</Badge>
                      ) : null}
                    </div>
                    {domaine.description ? (
                      <p className="text-xs text-muted-foreground">{domaine.description}</p>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {domaineMissions.map((mission) => (
                      <div key={mission.id} className="space-y-2 rounded-xl bg-muted/50 p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{mission.title}</p>
                          <StatusBadge status={mission.status} />
                        </div>
                        {mission.description ? (
                          <p className="text-xs text-muted-foreground">{mission.description}</p>
                        ) : null}
                        <ChecklistWidget ownerType="mission" ownerId={mission.id} />
                      </div>
                    ))}
                    <div className="space-y-1.5 rounded-xl border border-dashed border-border p-3">
                      <p className="text-xs font-medium text-muted-foreground">Definition of Done du domaine</p>
                      <ChecklistWidget ownerType="domaine" ownerId={domaine.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
          </Tabs>
        </>
      )}
    </div>
  )
}
