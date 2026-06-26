import type { LogistiqueItem } from "@/types/domain"
import type { LogistiqueService } from "@/services/logistique.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toLogistiqueItem(row: {
  id: string
  role_category_id: string | null
  name: string
  responsable_id: string | null
  quantity: number | null
  unit: string | null
  notes: string | null
}): LogistiqueItem {
  return {
    id: row.id,
    roleCategoryId: row.role_category_id,
    name: row.name,
    responsableId: row.responsable_id,
    quantity: row.quantity,
    unit: row.unit,
    notes: row.notes,
  }
}

export const logistiqueSupabaseService: LogistiqueService = {
  async list() {
    const { data, error } = await db.from("_20260725_logistique_items").select("*")
    if (error) throw error
    return (data ?? []).map(toLogistiqueItem)
  },
}
