import type { RoleCategory } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { roleCategoriesSeed } from "@/services/mock/data/role-categories"

export interface RolesService {
  list(): Promise<RoleCategory[]>
  create(category: RoleCategory): Promise<RoleCategory>
  update(id: string, patch: Partial<RoleCategory>): Promise<RoleCategory>
  remove(id: string): Promise<void>
}

const roleCategoriesTable = createMockTable<RoleCategory>("sj-role-categories", roleCategoriesSeed)

export const rolesService: RolesService = {
  async list() {
    const categories = await roleCategoriesTable.getAll()
    return [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
  },
  async create(category) {
    return roleCategoriesTable.insert(category)
  },
  async update(id, patch) {
    return roleCategoriesTable.update(id, patch)
  },
  async remove(id) {
    return roleCategoriesTable.remove(id)
  },
}
