import type { LogistiqueItem } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { logistiqueItemsSeed } from "@/services/mock/data/logistique-items"

export interface LogistiqueService {
  list(): Promise<LogistiqueItem[]>
}

const logistiqueItemsTable = createMockTable<LogistiqueItem>("sj-logistique-items", logistiqueItemsSeed)

export const logistiqueService: LogistiqueService = {
  async list() {
    return logistiqueItemsTable.getAll()
  },
}
