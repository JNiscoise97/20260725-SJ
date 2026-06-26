import type { DomaineResponsable } from "@/types/domain"
import type { DomaineResponsablesService } from "@/services/domaine-responsables.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toDomaineResponsable(row: {
  id: string
  domaine_id: string
  person_id: string | null
  guest_id: string | null
  rank: DomaineResponsable["rank"]
}): DomaineResponsable {
  return {
    id: row.id,
    domaineId: row.domaine_id,
    personId: row.person_id,
    guestId: row.guest_id,
    rank: row.rank,
  }
}

export const domaineResponsablesSupabaseService: DomaineResponsablesService = {
  async list() {
    const { data, error } = await db.from("_20260725_domaine_responsables").select("*")
    if (error) throw error
    return (data ?? []).map(toDomaineResponsable)
  },
  async create(responsable) {
    const { data, error } = await db
      .from("_20260725_domaine_responsables")
      .insert({
        domaine_id: responsable.domaineId,
        person_id: responsable.personId ?? null,
        guest_id: responsable.guestId ?? null,
        rank: responsable.rank,
      })
      .select("*")
      .single()
    if (error) throw error
    return toDomaineResponsable(data)
  },
  async remove(id) {
    const { error } = await db.from("_20260725_domaine_responsables").delete().eq("id", id)
    if (error) throw error
  },
}
