import type { Guest, GuestGroup, SeatingTable, TableAssignment } from "@/types/domain"
import type { GuestsService } from "@/services/guests.service"
import { supabase } from "@/supabase/client"

const db = supabase!

function toGuestGroup(row: { id: string; family_name: string; notes: string | null }): GuestGroup {
  return { id: row.id, familyName: row.family_name, notes: row.notes }
}

function toGuest(row: {
  id: string
  group_id: string | null
  first_name: string
  last_name: string
  rsvp_status: Guest["rsvpStatus"]
  dietary_constraints: string | null
  meal_choice: Guest["mealChoice"] | null
  arrival_info: string | null
  accommodation: string | null
  has_vehicle: boolean
  needs_late_transport: boolean
  is_reduced_mobility: boolean
  is_child: boolean
  child_age: number | null
  in_cortege: boolean
  communication_j30_sent: boolean
  communication_j15_sent: boolean
  communication_j3_sent: boolean
  side: Guest["side"] | null
  age_range: string | null
  relation_category: string | null
  city: string | null
  meal_message_sent: boolean
  rsvp_responded_at: string | null
  rsvp_channel: string | null
  needs_accommodation: boolean
  guide_sent: boolean
  address_change_sent: boolean
  reservation_done: boolean
  allergies: string | null
  drinks_alcohol: boolean | null
  cultural_origin: string | null
  primary_language: string | null
  has_ceremonial_role: boolean
  likely_traditional_attire: boolean
  notes: string | null
  status: Guest["status"]
  is_active: boolean
  introduction_seen: boolean
}): Guest {
  return {
    id: row.id,
    groupId: row.group_id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: `${row.first_name} ${row.last_name}`.trim(),
    rsvpStatus: row.rsvp_status,
    dietaryConstraints: row.dietary_constraints,
    mealChoice: row.meal_choice,
    arrivalInfo: row.arrival_info,
    accommodation: row.accommodation,
    hasVehicle: row.has_vehicle,
    needsLateTransport: row.needs_late_transport,
    isReducedMobility: row.is_reduced_mobility,
    isChild: row.is_child,
    childAge: row.child_age,
    inCortege: row.in_cortege,
    communicationJ30Sent: row.communication_j30_sent,
    communicationJ15Sent: row.communication_j15_sent,
    communicationJ3Sent: row.communication_j3_sent,
    side: row.side,
    ageRange: row.age_range,
    relationCategory: row.relation_category,
    city: row.city,
    mealMessageSent: row.meal_message_sent,
    rsvpRespondedAt: row.rsvp_responded_at,
    rsvpChannel: row.rsvp_channel,
    needsAccommodation: row.needs_accommodation,
    guideSent: row.guide_sent,
    addressChangeSent: row.address_change_sent,
    reservationDone: row.reservation_done,
    allergies: row.allergies,
    drinksAlcohol: row.drinks_alcohol,
    culturalOrigin: row.cultural_origin,
    primaryLanguage: row.primary_language,
    hasCeremonialRole: row.has_ceremonial_role,
    likelyTraditionalAttire: row.likely_traditional_attire,
    notes: row.notes,
    status: row.status,
    // access_code_hash n'est jamais lisible côté client (voir migration 0024) ;
    // un code vide signale à l'UI qu'il est défini mais masqué.
    accessCode: "",
    isActive: row.is_active,
    introductionSeen: row.introduction_seen,
  }
}

function toTable(row: { id: string; name: string; capacity: number }): SeatingTable {
  return { id: row.id, name: row.name, capacity: row.capacity }
}

function toAssignment(row: { id: string; table_id: string; guest_id: string; seat_number: number | null }): TableAssignment {
  return { id: row.id, tableId: row.table_id, guestId: row.guest_id, seatNumber: row.seat_number }
}

export const guestsSupabaseService: GuestsService = {
  async listGroups() {
    const { data, error } = await db.from("_20260725_guest_groups").select("*")
    if (error) throw error
    return (data ?? []).map(toGuestGroup)
  },
  async listGuests() {
    const { data, error } = await db.from("_20260725_guests").select("*")
    if (error) throw error
    return (data ?? []).map(toGuest)
  },
  async updateGuest(id, patch) {
    const row: Partial<{
      group_id: string | null
      first_name: string
      last_name: string
      rsvp_status: Guest["rsvpStatus"]
      dietary_constraints: string | null
      meal_choice: Guest["mealChoice"] | null
      arrival_info: string | null
      accommodation: string | null
      has_vehicle: boolean
      needs_late_transport: boolean
      is_reduced_mobility: boolean
      is_child: boolean
      child_age: number | null
      in_cortege: boolean
      communication_j30_sent: boolean
      communication_j15_sent: boolean
      communication_j3_sent: boolean
      side: Guest["side"] | null
      age_range: string | null
      relation_category: string | null
      city: string | null
      meal_message_sent: boolean
      rsvp_responded_at: string | null
      rsvp_channel: string | null
      needs_accommodation: boolean
      guide_sent: boolean
      address_change_sent: boolean
      reservation_done: boolean
      allergies: string | null
      drinks_alcohol: boolean | null
      cultural_origin: string | null
      primary_language: string | null
      has_ceremonial_role: boolean
      likely_traditional_attire: boolean
      notes: string | null
      status: Guest["status"]
      is_active: boolean
      introduction_seen: boolean
    }> = {}
    if (patch.groupId !== undefined) row.group_id = patch.groupId
    if (patch.firstName !== undefined) row.first_name = patch.firstName
    if (patch.lastName !== undefined) row.last_name = patch.lastName
    if (patch.rsvpStatus !== undefined) row.rsvp_status = patch.rsvpStatus
    if (patch.dietaryConstraints !== undefined) row.dietary_constraints = patch.dietaryConstraints
    if (patch.mealChoice !== undefined) row.meal_choice = patch.mealChoice
    if (patch.arrivalInfo !== undefined) row.arrival_info = patch.arrivalInfo
    if (patch.accommodation !== undefined) row.accommodation = patch.accommodation
    if (patch.hasVehicle !== undefined) row.has_vehicle = patch.hasVehicle
    if (patch.needsLateTransport !== undefined) row.needs_late_transport = patch.needsLateTransport
    if (patch.isReducedMobility !== undefined) row.is_reduced_mobility = patch.isReducedMobility
    if (patch.isChild !== undefined) row.is_child = patch.isChild
    if (patch.childAge !== undefined) row.child_age = patch.childAge
    if (patch.inCortege !== undefined) row.in_cortege = patch.inCortege
    if (patch.communicationJ30Sent !== undefined) row.communication_j30_sent = patch.communicationJ30Sent
    if (patch.communicationJ15Sent !== undefined) row.communication_j15_sent = patch.communicationJ15Sent
    if (patch.communicationJ3Sent !== undefined) row.communication_j3_sent = patch.communicationJ3Sent
    if (patch.side !== undefined) row.side = patch.side
    if (patch.ageRange !== undefined) row.age_range = patch.ageRange
    if (patch.relationCategory !== undefined) row.relation_category = patch.relationCategory
    if (patch.city !== undefined) row.city = patch.city
    if (patch.mealMessageSent !== undefined) row.meal_message_sent = patch.mealMessageSent
    if (patch.rsvpRespondedAt !== undefined) row.rsvp_responded_at = patch.rsvpRespondedAt
    if (patch.rsvpChannel !== undefined) row.rsvp_channel = patch.rsvpChannel
    if (patch.needsAccommodation !== undefined) row.needs_accommodation = patch.needsAccommodation
    if (patch.guideSent !== undefined) row.guide_sent = patch.guideSent
    if (patch.addressChangeSent !== undefined) row.address_change_sent = patch.addressChangeSent
    if (patch.reservationDone !== undefined) row.reservation_done = patch.reservationDone
    if (patch.allergies !== undefined) row.allergies = patch.allergies
    if (patch.drinksAlcohol !== undefined) row.drinks_alcohol = patch.drinksAlcohol
    if (patch.culturalOrigin !== undefined) row.cultural_origin = patch.culturalOrigin
    if (patch.primaryLanguage !== undefined) row.primary_language = patch.primaryLanguage
    if (patch.hasCeremonialRole !== undefined) row.has_ceremonial_role = patch.hasCeremonialRole
    if (patch.likelyTraditionalAttire !== undefined) row.likely_traditional_attire = patch.likelyTraditionalAttire
    if (patch.notes !== undefined) row.notes = patch.notes
    if (patch.status !== undefined) row.status = patch.status
    if (patch.isActive !== undefined) row.is_active = patch.isActive
    if (patch.introductionSeen !== undefined) row.introduction_seen = patch.introductionSeen
    if (Object.keys(row).length > 0) {
      const { error } = await db.from("_20260725_guests").update(row).eq("id", id)
      if (error) throw error
    }
    if (patch.accessCode) {
      const { error } = await db.rpc("_20260725_set_guest_access_code", {
        p_guest_id: id,
        p_code: patch.accessCode,
      })
      if (error) throw error
    }
    const { data, error } = await db.from("_20260725_guests").select("*").eq("id", id).single()
    if (error) throw error
    return toGuest(data)
  },
  async resolveByAccessCode(code) {
    const { data, error } = await db.rpc("_20260725_resolve_guest_access_code", { code })
    if (error) throw error
    const row = data?.[0]
    return row ? toGuest(row) : null
  },
  async getById(id) {
    const { data, error } = await db.from("_20260725_guests").select("*").eq("id", id).maybeSingle()
    if (error) throw error
    return data ? toGuest(data) : null
  },
  async listTables() {
    const { data, error } = await db.from("_20260725_tables").select("*")
    if (error) throw error
    return (data ?? []).map(toTable)
  },
  async listAssignments() {
    const { data, error } = await db.from("_20260725_table_assignments").select("*")
    if (error) throw error
    return (data ?? []).map(toAssignment)
  },
  async assignSeat(tableId, guestId) {
    const { data: existing, error: findError } = await db
      .from("_20260725_table_assignments")
      .select("*")
      .eq("guest_id", guestId)
      .maybeSingle()
    if (findError) throw findError

    if (existing) {
      const { data, error } = await db
        .from("_20260725_table_assignments")
        .update({ table_id: tableId })
        .eq("id", existing.id)
        .select("*")
        .single()
      if (error) throw error
      return toAssignment(data)
    }

    const { data, error } = await db
      .from("_20260725_table_assignments")
      .insert({ table_id: tableId, guest_id: guestId })
      .select("*")
      .single()
    if (error) throw error
    return toAssignment(data)
  },
  async unassignGuest(guestId) {
    const { error } = await db.from("_20260725_table_assignments").delete().eq("guest_id", guestId)
    if (error) throw error
  },
}
