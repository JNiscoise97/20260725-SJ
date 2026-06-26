import type { Mission } from "@/types/domain"
import type { MissionsService } from "@/services/missions.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toMission(row: {
  id: string
  role_category_id: string | null
  referent_id: string | null
  title: string
  description: string | null
  status: Mission["status"]
}): Mission {
  return {
    id: row.id,
    roleCategoryId: row.role_category_id,
    referentId: row.referent_id,
    title: row.title,
    description: row.description,
    status: row.status,
  }
}

export const missionsSupabaseService: MissionsService = {
  async list() {
    const { data, error } = await db.from("_20260725_missions").select("*")
    if (error) throw error
    return (data ?? []).map(toMission)
  },
  async getById(id) {
    const { data, error } = await db.from("_20260725_missions").select("*").eq("id", id).maybeSingle()
    if (error) throw error
    return data ? toMission(data) : null
  },
  async create(mission) {
    const { data, error } = await db
      .from("_20260725_missions")
      .insert({
        id: mission.id,
        role_category_id: mission.roleCategoryId ?? null,
        referent_id: mission.referentId ?? null,
        title: mission.title,
        description: mission.description ?? null,
        status: mission.status,
      })
      .select("*")
      .single()
    if (error) throw error
    return toMission(data)
  },
  async remove(id) {
    const { error } = await db.from("_20260725_missions").delete().eq("id", id)
    if (error) throw error
  },
  async update(id, patch) {
    const row: Partial<{
      role_category_id: string | null
      referent_id: string | null
      title: string
      description: string | null
      status: Mission["status"]
    }> = {}
    if (patch.roleCategoryId !== undefined) row.role_category_id = patch.roleCategoryId
    if (patch.referentId !== undefined) row.referent_id = patch.referentId
    if (patch.title !== undefined) row.title = patch.title
    if (patch.description !== undefined) row.description = patch.description
    if (patch.status !== undefined) row.status = patch.status
    const { data, error } = await db.from("_20260725_missions").update(row).eq("id", id).select("*").single()
    if (error) throw error
    return toMission(data)
  },
}
