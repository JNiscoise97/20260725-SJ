import type { Pole } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { polesSeed } from "@/services/mock/data/poles"
import { polesSupabaseService } from "@/services/supabase/poles"
import { USE_SUPABASE } from "@/supabase/client"

export interface PolesService {
  list(): Promise<Pole[]>
  create(pole: Pole): Promise<Pole>
  update(id: string, patch: Partial<Pole>): Promise<Pole>
  remove(id: string): Promise<void>
}

const polesTable = createMockTable<Pole>("sj-poles", polesSeed)

const polesMockService: PolesService = {
  async list() {
    const poles = await polesTable.getAll()
    return [...poles].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  async create(pole) {
    return polesTable.insert(pole)
  },
  async update(id, patch) {
    return polesTable.update(id, patch)
  },
  async remove(id) {
    return polesTable.remove(id)
  },
}

export const polesService: PolesService = USE_SUPABASE ? polesSupabaseService : polesMockService
