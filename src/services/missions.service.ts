import type { Mission } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { missionsSeed } from "@/services/mock/data/missions"
import { missionsSupabaseService } from "@/services/supabase/missions"
import { USE_SUPABASE } from "@/supabase/client"

export interface MissionsService {
  list(): Promise<Mission[]>
  getById(id: string): Promise<Mission | null>
  update(id: string, patch: Partial<Mission>): Promise<Mission>
}

const missionsTable = createMockTable<Mission>("sj-missions", missionsSeed)

const missionsMockService: MissionsService = {
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

export const missionsService: MissionsService = USE_SUPABASE ? missionsSupabaseService : missionsMockService
