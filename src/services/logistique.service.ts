import type { LogistiqueItem } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { logistiqueItemsSeed } from "@/services/mock/data/logistique-items"
import { logistiqueSupabaseService } from "@/services/supabase/logistique"
import { USE_SUPABASE } from "@/supabase/client"

export interface LogistiqueService {
  list(): Promise<LogistiqueItem[]>
}

const logistiqueItemsTable = createMockTable<LogistiqueItem>("sj-logistique-items", logistiqueItemsSeed)

const logistiqueMockService: LogistiqueService = {
  async list() {
    return logistiqueItemsTable.getAll()
  },
}

export const logistiqueService: LogistiqueService = USE_SUPABASE ? logistiqueSupabaseService : logistiqueMockService
