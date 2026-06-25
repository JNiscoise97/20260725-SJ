import type { Mission } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { missionsSeed } from "@/services/mock/data/missions"

export interface MissionsService {
  list(): Promise<Mission[]>
  getById(id: string): Promise<Mission | null>
  update(id: string, patch: Partial<Mission>): Promise<Mission>
}

const missionsTable = createMockTable<Mission>("sj-missions", missionsSeed)

export const missionsService: MissionsService = {
  async list() {
    return missionsTable.getAll()
  },
  async getById(id) {
    return missionsTable.getById(id)
  },
  async update(id, patch) {
    return missionsTable.update(id, patch)
  },
}
