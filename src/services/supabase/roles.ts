import type { RoleCategory } from "@/types/domain"
import type { RolesService } from "@/services/roles.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toRoleCategory(row: {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
  sort_order: number
  solicited_milestone: RoleCategory["solicitedMilestone"]
  preferred_contact_id: string | null
  primary_referent_id: string | null
  secondary_referent_id: string | null
}): RoleCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon ?? undefined,
    color: row.color ?? undefined,
    sortOrder: row.sort_order,
    solicitedMilestone: row.solicited_milestone,
    preferredContactId: row.preferred_contact_id,
    primaryReferentId: row.primary_referent_id,
    secondaryReferentId: row.secondary_referent_id,
  }
}

type RoleCategoryRowPatch = Partial<{
  name: string
  slug: string
  icon: string | null
  color: string | null
  sort_order: number
  solicited_milestone: RoleCategory["solicitedMilestone"]
  preferred_contact_id: string | null
  primary_referent_id: string | null
  secondary_referent_id: string | null
}>

function toRow(input: Partial<RoleCategory>): RoleCategoryRowPatch {
  const row: RoleCategoryRowPatch = {}
  if (input.name !== undefined) row.name = input.name
  if (input.slug !== undefined) row.slug = input.slug
  if (input.icon !== undefined) row.icon = input.icon ?? null
  if (input.color !== undefined) row.color = input.color ?? null
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder
  if (input.solicitedMilestone !== undefined) row.solicited_milestone = input.solicitedMilestone
  if (input.preferredContactId !== undefined) row.preferred_contact_id = input.preferredContactId
  if (input.primaryReferentId !== undefined) row.primary_referent_id = input.primaryReferentId
  if (input.secondaryReferentId !== undefined) row.secondary_referent_id = input.secondaryReferentId
  return row
}

export const rolesSupabaseService: RolesService = {
  async list() {
    const { data, error } = await db.from("_20260725_role_categories").select("*").order("sort_order")
    if (error) throw error
    return (data ?? []).map(toRoleCategory)
  },
  async create(category) {
    const row = toRow(category) as RoleCategoryRowPatch & { name: string; slug: string }
    const { data, error } = await db.from("_20260725_role_categories").insert(row).select("*").single()
    if (error) throw error
    return toRoleCategory(data)
  },
  async update(id, patch) {
    const { data, error } = await db
      .from("_20260725_role_categories")
      .update(toRow(patch))
      .eq("id", id)
      .select("*")
      .single()
    if (error) throw error
    return toRoleCategory(data)
  },
  async remove(id) {
    const { error } = await db.from("_20260725_role_categories").delete().eq("id", id)
    if (error) throw error
  },
}
