import type { Guest, GuestGroup, SeatingTable, TableAssignment } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import {
  guestGroupsSeed,
  guestsSeed,
  tablesSeed,
  tableAssignmentsSeed,
} from "@/services/mock/data/guests"
import { guestsSupabaseService } from "@/services/supabase/guests"
import { USE_SUPABASE } from "@/supabase/client"

export interface GuestsService {
  listGroups(): Promise<GuestGroup[]>
  listGuests(): Promise<Guest[]>
  updateGuest(id: string, patch: Partial<Guest>): Promise<Guest>
  listTables(): Promise<SeatingTable[]>
  listAssignments(): Promise<TableAssignment[]>
  assignSeat(tableId: string, guestId: string): Promise<TableAssignment>
  unassignGuest(guestId: string): Promise<void>
  /** Pour l'identité composée (voir identity.service.ts) : seuls les invités avec un `status` non nul peuvent se connecter. */
  resolveByAccessCode(code: string): Promise<Guest | null>
  getById(id: string): Promise<Guest | null>
}

const guestGroupsTable = createMockTable<GuestGroup>("sj-guest-groups", guestGroupsSeed)
const guestsTable = createMockTable<Guest>("sj-guests", guestsSeed)
const tablesTable = createMockTable<SeatingTable>("sj-tables", tablesSeed)
const tableAssignmentsTable = createMockTable<TableAssignment>("sj-table-assignments", tableAssignmentsSeed)

const guestsMockService: GuestsService = {
  async listGroups() {
    return guestGroupsTable.getAll()
  },
  async listGuests() {
    return guestsTable.getAll()
  },
  async updateGuest(id, patch) {
    return guestsTable.update(id, patch)
  },
  async resolveByAccessCode(code) {
    const guests = await guestsTable.getAll()
    const normalized = code.trim().toUpperCase()
    return (
      guests.find(
        (g) => g.status && g.isActive && g.accessCode && g.accessCode.toUpperCase() === normalized
      ) ?? null
    )
  },
  async getById(id) {
    return guestsTable.getById(id)
  },
  async listTables() {
    return tablesTable.getAll()
  },
  async listAssignments() {
    return tableAssignmentsTable.getAll()
  },
  async assignSeat(tableId, guestId) {
    const assignments = await tableAssignmentsTable.getAll()
    const existing = assignments.find((a) => a.guestId === guestId)
    if (existing) {
      return tableAssignmentsTable.update(existing.id, { tableId })
    }
    return tableAssignmentsTable.insert({ id: crypto.randomUUID(), tableId, guestId })
  },
  async unassignGuest(guestId) {
    const assignments = await tableAssignmentsTable.getAll()
    const existing = assignments.find((a) => a.guestId === guestId)
    if (existing) {
      await tableAssignmentsTable.remove(existing.id)
    }
  },
}

export const guestsService: GuestsService = USE_SUPABASE ? guestsSupabaseService : guestsMockService
