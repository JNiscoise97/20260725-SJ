import { useMemo } from "react"

import { useMissions } from "@/hooks/queries/use-missions"
import { useDomaines } from "@/hooks/queries/use-domaines"
import { useDocuments } from "@/hooks/queries/use-documents"
import { usePlanningEvents } from "@/hooks/queries/use-planning-events"
import { useAllChecklistItems, useAllChecklists } from "@/hooks/queries/use-checklists"
import { useResponsableEntries, type ResponsableEntry } from "@/hooks/use-responsable-entries"
import type { ChecklistItem, PlanningEvent } from "@/types/domain"

export interface ReferentReadiness {
  entry: ResponsableEntry
  totalItems: number
  doneItems: number
  ready: boolean
}

export interface DashboardSummary {
  itemsTotal: number
  itemsRemaining: number
  nextMilestones: PlanningEvent[]
  referentsReadiness: ReferentReadiness[]
  overdueItems: ChecklistItem[]
  missingDocumentCategories: string[]
}

function effectiveDueDate(item: ChecklistItem) {
  return item.estimatedEndDate ?? item.estimatedStartDate ?? null
}

export function useDashboardSummary() {
  const missionsQuery = useMissions()
  const domainesQuery = useDomaines()
  const documentsQuery = useDocuments()
  const planningEventsQuery = usePlanningEvents()
  const checklistsQuery = useAllChecklists()
  const checklistItemsQuery = useAllChecklistItems()
  const { isLoading: entriesLoading, entries } = useResponsableEntries()

  const isLoading =
    missionsQuery.isLoading ||
    domainesQuery.isLoading ||
    documentsQuery.isLoading ||
    planningEventsQuery.isLoading ||
    checklistsQuery.isLoading ||
    checklistItemsQuery.isLoading ||
    entriesLoading

  const summary = useMemo<DashboardSummary | null>(() => {
    if (
      !missionsQuery.data ||
      !domainesQuery.data ||
      !documentsQuery.data ||
      !planningEventsQuery.data ||
      !checklistsQuery.data ||
      !checklistItemsQuery.data
    ) {
      return null
    }

    const missions = missionsQuery.data
    const domaines = domainesQuery.data
    const documents = documentsQuery.data
    const planningEvents = planningEventsQuery.data
    const checklists = checklistsQuery.data
    const checklistItems = checklistItemsQuery.data

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const itemsRemaining = checklistItems.filter((item) => item.status !== "done").length

    const nextMilestones = [...planningEvents]
      .filter((event) => !event.startsAt || new Date(event.startsAt) >= startOfToday)
      .sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? ""))
      .slice(0, 3)

    // Référents uniquement (les fiancés gardent leurs domaines mais ne sont pas "prêts à valider" au même sens).
    const referentEntries = entries.filter((entry) => entry.identity.role === "referent")
    const referentsReadiness: ReferentReadiness[] = referentEntries.map((entry) => {
      const ownMissionIds = missions.filter((m) => m.domaineId && entry.domaineIds.includes(m.domaineId)).map((m) => m.id)
      const ownChecklistIds = checklists
        .filter((c) => c.ownerType === "mission" && c.ownerId != null && ownMissionIds.includes(c.ownerId))
        .map((c) => c.id)
      const items = checklistItems.filter((item) => ownChecklistIds.includes(item.checklistId))
      const totalItems = items.length
      const doneItems = items.filter((item) => item.isDone).length
      return { entry, totalItems, doneItems, ready: totalItems > 0 && doneItems === totalItems }
    })

    const overdueItems = checklistItems.filter((item) => {
      const dueDate = effectiveDueDate(item)
      return item.status !== "done" && dueDate && new Date(dueDate) < startOfToday
    })

    const missingDocumentCategories = domaines
      .filter((domaine) => !documents.some((doc) => doc.category === domaine.name))
      .map((domaine) => domaine.name)

    return {
      itemsTotal: checklistItems.length,
      itemsRemaining,
      nextMilestones,
      referentsReadiness,
      overdueItems,
      missingDocumentCategories,
    }
  }, [
    missionsQuery.data,
    domainesQuery.data,
    documentsQuery.data,
    planningEventsQuery.data,
    checklistsQuery.data,
    checklistItemsQuery.data,
    entries,
  ])

  return { isLoading, summary }
}
