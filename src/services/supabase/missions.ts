import type { Mission } from "@/types/domain"
import type { MissionsService } from "@/services/missions.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toMission(row: {
  id: string
  domaine_id: string | null
  title: string
  description: string | null
  prerequisites: string | null
  status: Mission["status"]
}): Mission {
  return {
    id: row.id,
    domaineId: row.domaine_id,
    title: row.title,
    description: row.description,
    prerequisites: row.prerequisites,
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
        domaine_id: mission.domaineId ?? null,
        title: mission.title,
        description: mission.description ?? null,
        prerequisites: mission.prerequisites ?? null,
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
      domaine_id: string | null
      title: string
      description: string | null
      prerequisites: string | null
      status: Mission["status"]
    }> = {}
    if (patch.domaineId !== undefined) row.domaine_id = patch.domaineId
    if (patch.title !== undefined) row.title = patch.title
    if (patch.description !== undefined) row.description = patch.description
    if (patch.prerequisites !== undefined) row.prerequisites = patch.prerequisites
    if (patch.status !== undefined) row.status = patch.status
    const { data, error } = await db.from("_20260725_missions").update(row).eq("id", id).select("*").single()
    if (error) throw error
    return toMission(data)
  },
}
