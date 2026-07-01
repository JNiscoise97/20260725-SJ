import type { PhotoSession } from "@/types/domain"
import type { PhotoSessionsService } from "@/services/photo-sessions.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toPhotoSession(row: { id: string; label: string; sort_order: number }): PhotoSession {
  return { id: row.id, label: row.label, sortOrder: row.sort_order }
}

type PhotoSessionRowPatch = Partial<{ label: string; sort_order: number }>

function toPhotoSessionRow(input: Partial<PhotoSession>): PhotoSessionRowPatch {
  const row: PhotoSessionRowPatch = {}
  if (input.label !== undefined) row.label = input.label
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder
  return row
}

export const photoSessionsSupabaseService: PhotoSessionsService = {
  async listSessions() {
    const { data, error } = await db.from("_20260725_photo_sessions").select("*")
    if (error) throw error
    return (data ?? []).map(toPhotoSession)
  },
  async createSession(input) {
    const row = toPhotoSessionRow(input) as PhotoSessionRowPatch & { label: string }
    const { data, error } = await db.from("_20260725_photo_sessions").insert(row).select("*").single()
    if (error) throw error
    return toPhotoSession(data)
  },
  async updateSession(id, patch) {
    const { data, error } = await db
      .from("_20260725_photo_sessions")
      .update(toPhotoSessionRow(patch))
      .eq("id", id)
      .select("*")
      .single()
    if (error) throw error
    return toPhotoSession(data)
  },
  async removeSession(id) {
    const { error } = await db.from("_20260725_photo_sessions").delete().eq("id", id)
    if (error) throw error
  },
}
