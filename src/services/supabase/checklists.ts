import type { Checklist, ChecklistItem } from "@/types/domain"
import type { ChecklistsService } from "@/services/checklists.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toChecklist(row: {
  id: string
  owner_type: Checklist["ownerType"]
  owner_id: string | null
  title: string | null
}): Checklist {
  return {
    id: row.id,
    ownerType: row.owner_type,
    ownerId: row.owner_id,
    title: row.title,
  }
}

function toChecklistItem(row: {
  id: string
  checklist_id: string
  label: string
  is_done: boolean
  sort_order: number
  priority: ChecklistItem["priority"]
  status: ChecklistItem["status"]
  estimated_start_date: string | null
  estimated_start_time: string | null
  estimated_end_date: string | null
  estimated_end_time: string | null
}): ChecklistItem {
  return {
    id: row.id,
    checklistId: row.checklist_id,
    label: row.label,
    isDone: row.is_done,
    sortOrder: row.sort_order,
    priority: row.priority,
    status: row.status,
    estimatedStartDate: row.estimated_start_date,
    estimatedStartTime: row.estimated_start_time,
    estimatedEndDate: row.estimated_end_date,
    estimatedEndTime: row.estimated_end_time,
  }
}

type ChecklistItemRowPatch = Partial<{
  checklist_id: string
  label: string
  is_done: boolean
  sort_order: number
  priority: ChecklistItem["priority"]
  status: ChecklistItem["status"]
  estimated_start_date: string | null
  estimated_start_time: string | null
  estimated_end_date: string | null
  estimated_end_time: string | null
}>

function toItemRow(input: Partial<ChecklistItem>): ChecklistItemRowPatch {
  const row: ChecklistItemRowPatch = {}
  if (input.checklistId !== undefined) row.checklist_id = input.checklistId
  if (input.label !== undefined) row.label = input.label
  if (input.isDone !== undefined) row.is_done = input.isDone
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder
  if (input.priority !== undefined) row.priority = input.priority
  if (input.status !== undefined) row.status = input.status
  if (input.estimatedStartDate !== undefined) row.estimated_start_date = input.estimatedStartDate
  if (input.estimatedStartTime !== undefined) row.estimated_start_time = input.estimatedStartTime
  if (input.estimatedEndDate !== undefined) row.estimated_end_date = input.estimatedEndDate
  if (input.estimatedEndTime !== undefined) row.estimated_end_time = input.estimatedEndTime
  return row
}

type ChecklistRowPatch = Partial<{
  owner_type: Checklist["ownerType"]
  owner_id: string | null
  title: string | null
}>

function toChecklistRow(input: Partial<Checklist>): ChecklistRowPatch {
  const row: ChecklistRowPatch = {}
  if (input.ownerType !== undefined) row.owner_type = input.ownerType
  if (input.ownerId !== undefined) row.owner_id = input.ownerId ?? null
  if (input.title !== undefined) row.title = input.title ?? null
  return row
}

export const checklistsSupabaseService: ChecklistsService = {
  async listAll() {
    const { data, error } = await db.from("_20260725_checklists").select("*")
    if (error) throw error
    return (data ?? []).map(toChecklist)
  },
  async listForOwner(ownerType, ownerId) {
    const { data, error } = await db
      .from("_20260725_checklists")
      .select("*")
      .eq("owner_type", ownerType)
      .eq("owner_id", ownerId)
    if (error) throw error
    return (data ?? []).map(toChecklist)
  },
  async create(input) {
    const row = toChecklistRow(input) as ChecklistRowPatch & { owner_type: Checklist["ownerType"] }
    const { data, error } = await db.from("_20260725_checklists").insert(row).select("*").single()
    if (error) throw error
    return toChecklist(data)
  },
  async update(id, patch) {
    const { data, error } = await db
      .from("_20260725_checklists")
      .update(toChecklistRow(patch))
      .eq("id", id)
      .select("*")
      .single()
    if (error) throw error
    return toChecklist(data)
  },
  async remove(id) {
    const { error } = await db.from("_20260725_checklists").delete().eq("id", id)
    if (error) throw error
  },
  async listItems(checklistId) {
    const { data, error } = await db
      .from("_20260725_checklist_items")
      .select("*")
      .eq("checklist_id", checklistId)
      .order("sort_order")
    if (error) throw error
    return (data ?? []).map(toChecklistItem)
  },
  async listAllItems() {
    const { data, error } = await db.from("_20260725_checklist_items").select("*")
    if (error) throw error
    return (data ?? []).map(toChecklistItem)
  },
  async createItem(input) {
    const row = toItemRow(input) as ChecklistItemRowPatch & { checklist_id: string; label: string }
    const { data, error } = await db.from("_20260725_checklist_items").insert(row).select("*").single()
    if (error) throw error
    return toChecklistItem(data)
  },
  async updateItem(id, patch) {
    const { data, error } = await db
      .from("_20260725_checklist_items")
      .update(toItemRow(patch))
      .eq("id", id)
      .select("*")
      .single()
    if (error) throw error
    return toChecklistItem(data)
  },
  async removeItem(id) {
    const { error } = await db.from("_20260725_checklist_items").delete().eq("id", id)
    if (error) throw error
  },
  async toggleItem(itemId, isDone) {
    const { data, error } = await db
      .from("_20260725_checklist_items")
      .update({ is_done: isDone })
      .eq("id", itemId)
      .select("*")
      .single()
    if (error) throw error
    return toChecklistItem(data)
  },
}
