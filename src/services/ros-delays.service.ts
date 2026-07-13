import type { RosDelay } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { supabase, USE_SUPABASE } from "@/supabase/client"

const mock = createMockTable<RosDelay>("sj-ros-delays", [])

export const rosDelaysService = {
  async list(): Promise<RosDelay[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase!
        .from("_20260725_ros_delays")
        .select("*")
        .order("logged_at", { ascending: false })
      if (error) throw error
      return (data ?? []).map((r) => ({
        id: r.id,
        stepId: r.step_id,
        delayMinutes: r.delay_minutes,
        reason: r.reason,
        loggedAt: r.logged_at,
      }))
    }
    const all = await mock.getAll()
    return [...all].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
  },

  async create(input: { stepId: string | null; delayMinutes: number; reason: string | null }): Promise<RosDelay> {
    const delay: RosDelay = {
      id: crypto.randomUUID(),
      stepId: input.stepId,
      delayMinutes: input.delayMinutes,
      reason: input.reason,
      loggedAt: new Date().toISOString(),
    }
    if (USE_SUPABASE) {
      const { data, error } = await supabase!
        .from("_20260725_ros_delays")
        .insert({ step_id: input.stepId, delay_minutes: input.delayMinutes, reason: input.reason })
        .select()
        .single()
      if (error) throw error
      return { id: data.id, stepId: data.step_id, delayMinutes: data.delay_minutes, reason: data.reason, loggedAt: data.logged_at }
    }
    return mock.insert(delay)
  },

  async remove(id: string): Promise<void> {
    if (USE_SUPABASE) {
      const { error } = await supabase!.from("_20260725_ros_delays").delete().eq("id", id)
      if (error) throw error
      return
    }
    await mock.remove(id)
  },
}
