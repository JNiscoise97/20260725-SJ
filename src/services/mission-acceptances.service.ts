import type { MissionAcceptance, MissionAcceptanceStatus } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { missionAcceptancesSeed } from "@/services/mock/data/mission-acceptances"
import { missionAcceptancesSupabaseService } from "@/services/supabase/mission-acceptances"
import { USE_SUPABASE } from "@/supabase/client"

export interface MissionAcceptancesService {
  listForGuest(guestId: string): Promise<MissionAcceptance[]>
  respond(missionId: string, guestId: string, status: MissionAcceptanceStatus): Promise<MissionAcceptance>
}

const missionAcceptancesTable = createMockTable<MissionAcceptance>("sj-mission-acceptances", missionAcceptancesSeed)

const missionAcceptancesMockService: MissionAcceptancesService = {
  async listForGuest(guestId) {
    const rows = await missionAcceptancesTable.getAll()
    return rows.filter((r) => r.guestId === guestId)
  },
  async respond(missionId, guestId, status) {
    const rows = await missionAcceptancesTable.getAll()
    const existing = rows.find((r) => r.missionId === missionId && r.guestId === guestId)
    const respondedAt = new Date().toISOString()
    if (existing) {
      return missionAcceptancesTable.update(existing.id, { status, respondedAt })
    }
    return missionAcceptancesTable.insert({
      id: crypto.randomUUID(),
      missionId,
      guestId,
      status,
      respondedAt,
    })
  },
}

export const missionAcceptancesService: MissionAcceptancesService = USE_SUPABASE
  ? missionAcceptancesSupabaseService
  : missionAcceptancesMockService
