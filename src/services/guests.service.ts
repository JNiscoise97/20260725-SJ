import type { Guest, GuestGroup, SeatingTable, TableAssignment } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import {
  guestGroupsSeed,
  guestsSeed,
  tablesSeed,
  tableAssignmentsSeed,
} from "@/services/mock/data/guests"

export interface GuestsService {
  listGroups(): Promise<GuestGroup[]>
  listGuests(): Promise<Guest[]>
  updateGuest(id: string, patch: Partial<Guest>): Promise<Guest>
  listTables(): Promise<SeatingTable[]>
  listAssignments(): Promise<TableAssignment[]>
  assignSeat(tableId: string, guestId: string): Promise<TableAssignment>
  unassignGuest(guestId: string): Promise<void>
}

const guestGroupsTable = createMockTable<GuestGroup>("sj-guest-groups", guestGroupsSeed)
const guestsTable = createMockTable<Guest>("sj-guests", guestsSeed)
const tablesTable = createMockTable<SeatingTable>("sj-tables", tablesSeed)
const tableAssignmentsTable = createMockTable<TableAssignment>("sj-table-assignments", tableAssignmentsSeed)

export const guestsService: GuestsService = {
  async listGroups() {
    return guestGroupsTable.getAll()
  },
  async listGuests() {
    return guestsTable.getAll()
  },
  async updateGuest(id, patch) {
    return guestsTable.update(id, patch)
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
