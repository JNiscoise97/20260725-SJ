import type { DocumentItem } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { documentsSeed } from "@/services/mock/data/documents"

export interface DocumentsService {
  list(): Promise<DocumentItem[]>
  create(input: Omit<DocumentItem, "id">): Promise<DocumentItem>
}

const documentsTable = createMockTable<DocumentItem>("sj-documents", documentsSeed)

export const documentsService: DocumentsService = {
  async list() {
    return documentsTable.getAll()
  },
  async create(input) {
    return documentsTable.insert({ ...input, id: crypto.randomUUID() })
  },
}
