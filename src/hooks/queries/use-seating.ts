import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { seatingService, type SeatTarget } from "@/services/seating.service"
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

export function useAssignSeat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tableId, target }: { tableId: string; target: SeatTarget }) => seatingService.assign(tableId, target),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY }),
  })
}

export function useUnassignSeat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (assignmentId: string) => seatingService.unassign(assignmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY }),
  })
}
