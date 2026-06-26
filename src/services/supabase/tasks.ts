import type { Task } from "@/types/domain"
import type { TasksService } from "@/services/tasks.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toTask(row: {
  id: string
  mission_id: string | null
  title: string
  description: string | null
  priority: Task["priority"]
  status: Task["status"]
  category: string | null
  due_date: string | null
  due_time: string | null
  owner_id: string | null
}): Task {
  return {
    id: row.id,
    missionId: row.mission_id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    category: row.category,
    dueDate: row.due_date,
    dueTime: row.due_time,
    ownerId: row.owner_id,
  }
}

type TaskRowPatch = Partial<{
  mission_id: string | null
  title: string
  description: string | null
  priority: Task["priority"]
  status: Task["status"]
  category: string | null
  due_date: string | null
  due_time: string | null
  owner_id: string | null
}>

function toRow(input: Partial<Task>): TaskRowPatch {
  const row: TaskRowPatch = {}
  if (input.missionId !== undefined) row.mission_id = input.missionId
  if (input.title !== undefined) row.title = input.title
  if (input.description !== undefined) row.description = input.description
  if (input.priority !== undefined) row.priority = input.priority
  if (input.status !== undefined) row.status = input.status
  if (input.category !== undefined) row.category = input.category
  if (input.dueDate !== undefined) row.due_date = input.dueDate
  if (input.dueTime !== undefined) row.due_time = input.dueTime
  if (input.ownerId !== undefined) row.owner_id = input.ownerId
  return row
}

export const tasksSupabaseService: TasksService = {
  async list() {
    const { data, error } = await db.from("_20260725_tasks").select("*")
    if (error) throw error
    return (data ?? []).map(toTask)
  },
  async getById(id) {
    const { data, error } = await db.from("_20260725_tasks").select("*").eq("id", id).maybeSingle()
    if (error) throw error
    return data ? toTask(data) : null
  },
  async create(input) {
    const row = toRow(input) as TaskRowPatch & { title: string; priority: Task["priority"] }
    const { data, error } = await db.from("_20260725_tasks").insert(row).select("*").single()
    if (error) throw error
    return toTask(data)
  },
  async update(id, patch) {
    const { data, error } = await db
      .from("_20260725_tasks")
      .update(toRow(patch))
      .eq("id", id)
      .select("*")
      .single()
    if (error) throw error
    return toTask(data)
  },
  async remove(id) {
    const { error } = await db.from("_20260725_tasks").delete().eq("id", id)
    if (error) throw error
  },
}
