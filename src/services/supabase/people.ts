import type { Person } from "@/types/domain"
import type { PeopleService } from "@/services/people.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toPerson(row: {
  id: string
  full_name: string
  phone: string | null
  role: Person["role"]
  avatar_url: string | null
  is_active: boolean
}): Person {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone ?? undefined,
    role: row.role,
    // access_code_hash n'est jamais lisible côté client (voir 0009/0012) ;
    // un code vide signale à l'UI qu'il est défini mais masqué.
    accessCode: "",
    avatarUrl: row.avatar_url,
    isActive: row.is_active,
  }
}

export const peopleSupabaseService: PeopleService = {
  async resolveByAccessCode(code) {
    const { data, error } = await db.rpc("_20260725_resolve_access_code", { code })
    if (error) throw error
    const row = data?.[0]
    return row ? toPerson(row) : null
  },
  async getById(id) {
    const { data, error } = await db.from("_20260725_people").select("*").eq("id", id).maybeSingle()
    if (error) throw error
    return data ? toPerson(data) : null
  },
  async list() {
    const { data, error } = await db.from("_20260725_people").select("*")
    if (error) throw error
    return (data ?? []).map(toPerson)
  },
  async create(person) {
    const { data, error } = await db.rpc("_20260725_create_person", {
      p_full_name: person.fullName,
      p_role: person.role,
      p_code: person.accessCode,
      p_phone: person.phone ?? null,
      p_avatar_url: person.avatarUrl ?? null,
      p_is_active: person.isActive,
    })
    if (error) throw error
    return toPerson(data)
  },
  async update(id, patch) {
    if (patch.accessCode) {
      const { error } = await db.rpc("_20260725_set_access_code", { p_person_id: id, p_code: patch.accessCode })
      if (error) throw error
    }
    const fields: Partial<{
      full_name: string
      phone: string | null
      role: Person["role"]
      avatar_url: string | null | undefined
      is_active: boolean
    }> = {}
    if (patch.fullName !== undefined) fields.full_name = patch.fullName
    if (patch.phone !== undefined) fields.phone = patch.phone ?? null
    if (patch.role !== undefined) fields.role = patch.role
    if (patch.avatarUrl !== undefined) fields.avatar_url = patch.avatarUrl
    if (patch.isActive !== undefined) fields.is_active = patch.isActive
    if (Object.keys(fields).length > 0) {
      const { error } = await db.from("_20260725_people").update(fields).eq("id", id)
      if (error) throw error
    }
    const updated = await peopleSupabaseService.getById(id)
    if (!updated) throw new Error(`Personne ${id} introuvable après mise à jour.`)
    return updated
  },
  async remove(id) {
    const { error } = await db.from("_20260725_people").delete().eq("id", id)
    if (error) throw error
  },
}
