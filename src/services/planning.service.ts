import type { PlanningEvent } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { planningEventsSeed } from "@/services/mock/data/planning-events"

export interface PlanningService {
  list(): Promise<PlanningEvent[]>
}

const planningEventsTable = createMockTable<PlanningEvent>("sj-planning-events", planningEventsSeed)

export const planningService: PlanningService = {
  async list() {
    const events = await planningEventsTable.getAll()
    return [...events].sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? ""))
  },
}
