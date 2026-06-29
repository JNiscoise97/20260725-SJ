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

/** Lie deux invités comme "inséparables", en délink d'abord leur éventuel partenaire précédent — un invité n'a jamais plus d'un partenaire. */
export function usePairGuests() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ guestA, guestB }: { guestA: Guest; guestB: Guest }) => {
      const unlinks: Promise<Guest>[] = []
      if (guestA.pairedWithId && guestA.pairedWithId !== guestB.id) {
        unlinks.push(guestsService.updateGuest(guestA.pairedWithId, { pairedWithId: null }))
      }
      if (guestB.pairedWithId && guestB.pairedWithId !== guestA.id) {
        unlinks.push(guestsService.updateGuest(guestB.pairedWithId, { pairedWithId: null }))
      }
      await Promise.all(unlinks)
      await Promise.all([
        guestsService.updateGuest(guestA.id, { pairedWithId: guestB.id }),
        guestsService.updateGuest(guestB.id, { pairedWithId: guestA.id }),
      ])
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests"] }),
  })
}

/** Délie un invité de son partenaire (des deux côtés). */
export function useUnpairGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (guest: Guest) => {
      const updates = [guestsService.updateGuest(guest.id, { pairedWithId: null })]
      if (guest.pairedWithId) updates.push(guestsService.updateGuest(guest.pairedWithId, { pairedWithId: null }))
      await Promise.all(updates)
    },
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
