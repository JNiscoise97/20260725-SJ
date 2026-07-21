import type { Mission, MissionSchedulingType } from "@/types/domain"
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
  scheduling_type: string | null
  scheduled_start_date: string | null
  scheduled_start_time: string | null
  scheduled_end_date: string | null
  scheduled_end_time: string | null
  sort_order: number
}): Mission {
  return {
    id: row.id,
    domaineId: row.domaine_id,
    title: row.title,
    description: row.description,
    prerequisites: row.prerequisites,
    status: row.status,
    schedulingType: (row.scheduling_type as MissionSchedulingType) ?? null,
    scheduledStartDate: row.scheduled_start_date,
    scheduledStartTime: row.scheduled_start_time,
    scheduledEndDate: row.scheduled_end_date,
    scheduledEndTime: row.scheduled_end_time,
    sortOrder: row.sort_order,
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
        scheduled_start_date: mission.scheduledStartDate ?? null,
        scheduled_start_time: mission.scheduledStartTime ?? null,
        scheduled_end_date: mission.scheduledEndDate ?? null,
        scheduled_end_time: mission.scheduledEndTime ?? null,
        sort_order: mission.sortOrder,
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
      scheduling_type: string | null
      scheduled_start_date: string | null
      scheduled_start_time: string | null
      scheduled_end_date: string | null
      scheduled_end_time: string | null
      sort_order: number
    }> = {}
    if (patch.domaineId !== undefined) row.domaine_id = patch.domaineId
    if (patch.title !== undefined) row.title = patch.title
    if (patch.description !== undefined) row.description = patch.description
    if (patch.prerequisites !== undefined) row.prerequisites = patch.prerequisites
    if (patch.status !== undefined) row.status = patch.status
    if (patch.schedulingType !== undefined) row.scheduling_type = patch.schedulingType ?? null
    if (patch.scheduledStartDate !== undefined) row.scheduled_start_date = patch.scheduledStartDate ?? null
    if (patch.scheduledStartTime !== undefined) row.scheduled_start_time = patch.scheduledStartTime ?? null
    if (patch.scheduledEndDate !== undefined) row.scheduled_end_date = patch.scheduledEndDate ?? null
    if (patch.scheduledEndTime !== undefined) row.scheduled_end_time = patch.scheduledEndTime ?? null
    if (patch.sortOrder !== undefined) row.sort_order = patch.sortOrder
    const { data, error } = await db.from("_20260725_missions").update(row).eq("id", id).select("*").single()
    if (error) throw error
    return toMission(data)
  },
}
