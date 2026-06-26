import type { Checklist, ChecklistItem } from "@/types/domain"
import type { ChecklistsService } from "@/services/checklists.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toChecklist(row: {
  id: string
  owner_type: Checklist["ownerType"]
  owner_id: string | null
  title: string
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
}): ChecklistItem {
  return {
    id: row.id,
    checklistId: row.checklist_id,
    label: row.label,
    isDone: row.is_done,
    sortOrder: row.sort_order,
  }
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
