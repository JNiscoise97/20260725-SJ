import type { EquipmentItem } from "@/types/domain"
import type { EquipmentService } from "@/services/equipment.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toEquipmentItem(row: {
  id: string
  category: string
  label: string
  status: EquipmentItem["status"] | null
  guest_name: string | null
  notes: string | null
  sort_order: number
}): EquipmentItem {
  return {
    id: row.id,
    category: row.category,
    label: row.label,
    status: row.status,
    guestName: row.guest_name,
    notes: row.notes,
    sortOrder: row.sort_order,
  }
}

export const equipmentSupabaseService: EquipmentService = {
  async createItem(input) {
    const { data, error } = await db
      .from("_20260725_equipment")
      .insert({ category: input.category, label: input.label, notes: input.notes ?? null, sort_order: input.sortOrder })
      .select("*")
      .single()
    if (error) throw error
    return toEquipmentItem(data)
  },
  async removeItem(id) {
    const { error } = await db.from("_20260725_equipment").delete().eq("id", id)
    if (error) throw error
  },
  async listItems() {
    const { data, error } = await db.from("_20260725_equipment").select("*").order("category").order("sort_order")
    if (error) throw error
    return (data ?? []).map(toEquipmentItem)
  },
  async updateItem(id, patch) {
    const row: Partial<{ status: EquipmentItem["status"] | null; guest_name: string | null; notes: string | null }> = {}
    if (patch.status !== undefined) row.status = patch.status ?? null
    if (patch.guestName !== undefined) row.guest_name = patch.guestName ?? null
    if (patch.notes !== undefined) row.notes = patch.notes ?? null
    const { data, error } = await db
      .from("_20260725_equipment")
      .update(row)
      .eq("id", id)
      .select("*")
      .single()
    if (error) throw error
    return toEquipmentItem(data)
  },
}
