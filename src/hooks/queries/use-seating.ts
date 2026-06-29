import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { seatingService, type SeatTarget } from "@/services/seating.service"
import { guestsService } from "@/services/guests.service"
import type { SeatingTable } from "@/types/domain"

const TABLES_KEY = ["tables"] as const
const ASSIGNMENTS_KEY = ["table-assignments"] as const

export function useTables() {
  return useQuery({ queryKey: TABLES_KEY, queryFn: () => seatingService.listTables() })
}

export function useCreateTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<SeatingTable, "id">) => seatingService.createTable(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TABLES_KEY }),
  })
}

export function useUpdateTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<SeatingTable> }) => seatingService.updateTable(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TABLES_KEY }),
  })
}

export function useDeleteTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => seatingService.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TABLES_KEY })
      queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY })
    },
  })
}

export function useTableAssignments() {
  return useQuery({ queryKey: ASSIGNMENTS_KEY, queryFn: () => seatingService.listAssignments() })
}

/** Place quelqu'un à une table puis, si c'est un invité "inséparable" (voir 0045_guests_paired_with.sql), place aussi son partenaire à la même table. */
export function useAssignSeat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tableId, target }: { tableId: string; target: SeatTarget }) => {
      const result = await seatingService.assign(tableId, target)
      if (target.guestId) {
        const guest = await guestsService.getById(target.guestId)
        if (guest?.pairedWithId) {
          await seatingService.assign(tableId, { guestId: guest.pairedWithId })
        }
      }
      return result
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY }),
  })
}

/** Retire quelqu'un d'une table puis, si c'est un invité "inséparable", retire aussi son partenaire — symétrique de useAssignSeat. */
export function useUnassignSeat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const assignments = await seatingService.listAssignments()
      const assignment = assignments.find((a) => a.id === assignmentId)
      await seatingService.unassign(assignmentId)
      if (assignment?.guestId) {
        const guest = await guestsService.getById(assignment.guestId)
        const partnerAssignment = guest?.pairedWithId
          ? assignments.find((a) => a.guestId === guest.pairedWithId)
          : undefined
        if (partnerAssignment) await seatingService.unassign(partnerAssignment.id)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY }),
  })
}
