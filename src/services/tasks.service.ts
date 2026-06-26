import type { Task } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { tasksSeed } from "@/services/mock/data/tasks"
import { tasksSupabaseService } from "@/services/supabase/tasks"
import { USE_SUPABASE } from "@/supabase/client"

export interface TasksService {
  list(): Promise<Task[]>
  getById(id: string): Promise<Task | null>
  create(input: Omit<Task, "id">): Promise<Task>
  update(id: string, patch: Partial<Task>): Promise<Task>
  remove(id: string): Promise<void>
}

const tasksTable = createMockTable<Task>("sj-tasks", tasksSeed)

const tasksMockService: TasksService = {
  async list() {
    return tasksTable.getAll()
  },
  async getById(id) {
    return tasksTable.getById(id)
  },
  async create(input) {
    return tasksTable.insert({ ...input, id: crypto.randomUUID() })
  },
  async update(id, patch) {
    return tasksTable.update(id, patch)
  },
  async remove(id) {
    return tasksTable.remove(id)
  },
}

export const tasksService: TasksService = USE_SUPABASE ? tasksSupabaseService : tasksMockService
