import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { guestsService, type CreateGuestInput } from "@/services/guests.service"
import type { Guest } from "@/types/domain"

export function useGuestGroups() {
  return useQuery({ queryKey: ["guest-groups"], queryFn: () => guestsService.listGroups() })
}

export function useGuests() {
  return useQuery({ queryKey: ["guests"], queryFn: () => guestsService.listGuests() })
}

export function useCreateGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGuestInput) => guestsService.createGuest(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests"] }),
  })
}

export function useUpdateGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Guest> }) => guestsService.updateGuest(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests"] }),
  })
}

export function useDeleteGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => guestsService.deleteGuest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests"] }),
  })
}

export function useResetIntroductionSeenForAll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => guestsService.resetIntroductionSeenForAll(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests"] }),
  })
}
