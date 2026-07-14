import type { RosDelivererType, RosLaunch } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { supabase, USE_SUPABASE } from "@/supabase/client"

const mock = createMockTable<RosLaunch>("sj-ros-launches", [])

function rowToLaunch(r: {
  id: string; step_id: string; mission_id: string | null; label: string | null
  scheduled_time: string | null; deliverer_type: string | null
  deliverer_guest_id: string | null; deliverer_person_id: string | null
  launched_at: string | null; sort_order: number
}): RosLaunch {
  return {
    id: r.id,
    stepId: r.step_id,
    missionId: r.mission_id,
    label: r.label,
    scheduledTime: r.scheduled_time,
    delivererType: r.deliverer_type as RosDelivererType | null,
    delivererGuestId: r.deliverer_guest_id,
    delivererPersonId: r.deliverer_person_id,
    launchedAt: r.launched_at,
    sortOrder: r.sort_order,
  }
}

export interface RosLaunchInput {
  stepId: string
  missionId?: string | null
  label?: string | null
  scheduledTime?: string | null
  delivererType?: RosDelivererType | null
  delivererGuestId?: string | null
  delivererPersonId?: string | null
  sortOrder?: number
}

export interface RosLaunchPatch {
  missionId?: string | null
  label?: string | null
  scheduledTime?: string | null
  delivererType?: RosDelivererType | null
  delivererGuestId?: string | null
  delivererPersonId?: string | null
  launchedAt?: string | null
  sortOrder?: number
}

export const rosLaunchesService = {
  async list(): Promise<RosLaunch[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase!
        .from("_20260725_ros_launches")
        .select("*")
        .order("sort_order")
      if (error) throw error
      return (data ?? []).map(rowToLaunch)
    }
    return mock.getAll()
  },

  async create(input: RosLaunchInput): Promise<RosLaunch> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase!
        .from("_20260725_ros_launches")
        .insert({
          step_id: input.stepId,
          mission_id: input.missionId ?? null,
          label: input.label ?? null,
          scheduled_time: input.scheduledTime ?? null,
          deliverer_type: input.delivererType ?? null,
          deliverer_guest_id: input.delivererGuestId ?? null,
          deliverer_person_id: input.delivererPersonId ?? null,
          sort_order: input.sortOrder ?? 0,
        })
        .select()
        .single()
      if (error) throw error
      return rowToLaunch(data)
    }
    const launch: RosLaunch = {
      id: crypto.randomUUID(),
      stepId: input.stepId,
      missionId: input.missionId ?? null,
      label: input.label ?? null,
      scheduledTime: input.scheduledTime ?? null,
      delivererType: input.delivererType ?? null,
      delivererGuestId: input.delivererGuestId ?? null,
      delivererPersonId: input.delivererPersonId ?? null,
      launchedAt: null,
      sortOrder: input.sortOrder ?? 0,
    }
    return mock.insert(launch)
  },

  async update(id: string, patch: RosLaunchPatch): Promise<void> {
    if (USE_SUPABASE) {
      const row: {
        mission_id?: string | null; label?: string | null; scheduled_time?: string | null
        deliverer_type?: string | null; deliverer_guest_id?: string | null
        deliverer_person_id?: string | null; launched_at?: string | null; sort_order?: number
      } = {}
      if ("missionId" in patch) row.mission_id = patch.missionId
      if ("label" in patch) row.label = patch.label
      if ("scheduledTime" in patch) row.scheduled_time = patch.scheduledTime
      if ("delivererType" in patch) row.deliverer_type = patch.delivererType
      if ("delivererGuestId" in patch) row.deliverer_guest_id = patch.delivererGuestId
      if ("delivererPersonId" in patch) row.deliverer_person_id = patch.delivererPersonId
      if ("launchedAt" in patch) row.launched_at = patch.launchedAt
      if (patch.sortOrder !== undefined) row.sort_order = patch.sortOrder
      const { error } = await supabase!.from("_20260725_ros_launches").update(row).eq("id", id)
      if (error) throw error
      return
    }
    const mockPatch: Partial<RosLaunch> = {}
    if ("missionId" in patch) mockPatch.missionId = patch.missionId ?? null
    if ("label" in patch) mockPatch.label = patch.label ?? null
    if ("scheduledTime" in patch) mockPatch.scheduledTime = patch.scheduledTime ?? null
    if ("delivererType" in patch) mockPatch.delivererType = patch.delivererType ?? null
    if ("delivererGuestId" in patch) mockPatch.delivererGuestId = patch.delivererGuestId ?? null
    if ("delivererPersonId" in patch) mockPatch.delivererPersonId = patch.delivererPersonId ?? null
    if ("launchedAt" in patch) mockPatch.launchedAt = patch.launchedAt ?? null
    if (patch.sortOrder !== undefined) mockPatch.sortOrder = patch.sortOrder
    await mock.update(id, mockPatch)
  },

  async remove(id: string): Promise<void> {
    if (USE_SUPABASE) {
      const { error } = await supabase!.from("_20260725_ros_launches").delete().eq("id", id)
      if (error) throw error
      return
    }
    await mock.remove(id)
  },
}
