import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { guestsService } from "@/services/guests.service"
import type { Guest } from "@/types/domain"

export function useGuestGroups() {
  return useQuery({ queryKey: ["guest-groups"], queryFn: () => guestsService.listGroups() })
}

export function useGuests() {
  return useQuery({ queryKey: ["guests"], queryFn: () => guestsService.listGuests() })
}

export function useUpdateGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Guest> }) => guestsService.updateGuest(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests"] }),
  })
}

export function useTables() {
  return useQuery({ queryKey: ["tables"], queryFn: () => guestsService.listTables() })
}

export function useTableAssignments() {
  return useQuery({ queryKey: ["table-assignments"], queryFn: () => guestsService.listAssignments() })
}

export function useAssignSeat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tableId, guestId }: { tableId: string; guestId: string }) =>
      guestsService.assignSeat(tableId, guestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["table-assignments"] }),
  })
}

export function useUnassignGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (guestId: string) => guestsService.unassignGuest(guestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["table-assignments"] }),
  })
}
