import { useMemo } from "react"

import { useTasks } from "@/hooks/queries/use-tasks"
import { useMissions } from "@/hooks/queries/use-missions"
import { usePeople } from "@/hooks/queries/use-people"
import { useRoleCategories } from "@/hooks/queries/use-role-categories"
import { useDocuments } from "@/hooks/queries/use-documents"
import { usePlanningEvents } from "@/hooks/queries/use-planning-events"
import { useAllChecklistItems, useAllChecklists } from "@/hooks/queries/use-checklists"
import type { Person, PlanningEvent, Task } from "@/types/domain"

export interface ReferentReadiness {
  person: Person
  totalItems: number
  doneItems: number
  ready: boolean
}

export interface DashboardSummary {
  tasksTotal: number
  tasksRemaining: number
  nextMilestones: PlanningEvent[]
  referentsReadiness: ReferentReadiness[]
  overdueTasks: Task[]
  missingDocumentCategories: string[]
}

export function useDashboardSummary() {
  const tasksQuery = useTasks()
  const missionsQuery = useMissions()
  const peopleQuery = usePeople()
  const roleCategoriesQuery = useRoleCategories()
  const documentsQuery = useDocuments()
  const planningEventsQuery = usePlanningEvents()
  const checklistsQuery = useAllChecklists()
  const checklistItemsQuery = useAllChecklistItems()

  const isLoading =
    tasksQuery.isLoading ||
    missionsQuery.isLoading ||
    peopleQuery.isLoading ||
    roleCategoriesQuery.isLoading ||
    documentsQuery.isLoading ||
    planningEventsQuery.isLoading ||
    checklistsQuery.isLoading ||
    checklistItemsQuery.isLoading

  const summary = useMemo<DashboardSummary | null>(() => {
    if (
      !tasksQuery.data ||
      !missionsQuery.data ||
      !peopleQuery.data ||
      !roleCategoriesQuery.data ||
      !documentsQuery.data ||
      !planningEventsQuery.data ||
      !checklistsQuery.data ||
      !checklistItemsQuery.data
    ) {
      return null
    }

    const tasks = tasksQuery.data
    const missions = missionsQuery.data
    const people = peopleQuery.data
    const roleCategories = roleCategoriesQuery.data
    const documents = documentsQuery.data
    const planningEvents = planningEventsQuery.data
    const checklists = checklistsQuery.data
    const checklistItems = checklistItemsQuery.data

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const tasksRemaining = tasks.filter((task) => task.status !== "done").length

    const nextMilestones = [...planningEvents]
      .filter((event) => !event.startsAt || new Date(event.startsAt) >= startOfToday)
      .sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? ""))
      .slice(0, 3)

    const referents = people.filter((person) => person.role === "referent")
    const referentsReadiness: ReferentReadiness[] = referents.map((person) => {
      const ownMissionIds = missions.filter((m) => m.referentId === person.id).map((m) => m.id)
      const ownChecklistIds = checklists
        .filter((c) => c.ownerType === "mission" && c.ownerId != null && ownMissionIds.includes(c.ownerId))
        .map((c) => c.id)
      const items = checklistItems.filter((item) => ownChecklistIds.includes(item.checklistId))
      const totalItems = items.length
      const doneItems = items.filter((item) => item.isDone).length
      return { person, totalItems, doneItems, ready: totalItems > 0 && doneItems === totalItems }
    })

    const overdueTasks = tasks.filter(
      (task) => task.status !== "done" && task.dueDate && new Date(task.dueDate) < startOfToday
    )

    const missingDocumentCategories = roleCategories
      .filter((category) => !documents.some((doc) => doc.category === category.name))
      .map((category) => category.name)

    return {
      tasksTotal: tasks.length,
      tasksRemaining,
      nextMilestones,
      referentsReadiness,
      overdueTasks,
      missingDocumentCategories,
    }
  }, [
    tasksQuery.data,
    missionsQuery.data,
    peopleQuery.data,
    roleCategoriesQuery.data,
    documentsQuery.data,
    planningEventsQuery.data,
    checklistsQuery.data,
    checklistItemsQuery.data,
  ])

  return { isLoading, summary }
}
