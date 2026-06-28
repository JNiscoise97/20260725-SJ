import type { SeatingTable, TableAssignment } from "@/types/domain"

export const tablesSeed: SeatingTable[] = [
  { id: "tb-1", name: "Table 1", capacity: 8, sortOrder: 0 },
  { id: "tb-2", name: "Table 2", capacity: 6, sortOrder: 1 },
]

export const tableAssignmentsSeed: TableAssignment[] = [
  { id: "ta-1", tableId: "tb-1", guestId: "g-paul", seatNumber: 1 },
  { id: "ta-2", tableId: "tb-1", guestId: "g-claire", seatNumber: 2 },
  { id: "ta-3", tableId: "tb-1", guestId: "g-anne", seatNumber: 3 },
  { id: "ta-4", tableId: "tb-2", guestId: "g-ines", seatNumber: 1 },
]
