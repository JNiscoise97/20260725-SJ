import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { checklistsService } from "@/services/checklists.service"
import type { ChecklistOwnerType } from "@/types/domain"

export function useChecklistsForOwner(ownerType: ChecklistOwnerType, ownerId: string) {
  return useQuery({
    queryKey: ["checklists", ownerType, ownerId],
    queryFn: () => checklistsService.listForOwner(ownerType, ownerId),
  })
}

export function useChecklistItems(checklistId: string | undefined) {
  return useQuery({
    queryKey: ["checklist-items", checklistId],
    queryFn: () => checklistsService.listItems(checklistId!),
    enabled: !!checklistId,
  })
}

export function useAllChecklistItems() {
  return useQuery({ queryKey: ["checklist-items", "all"], queryFn: () => checklistsService.listAllItems() })
}

export function useAllChecklists() {
  return useQuery({ queryKey: ["checklists", "all"], queryFn: () => checklistsService.listAll() })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, isDone }: { itemId: string; isDone: boolean }) =>
      checklistsService.toggleItem(itemId, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] })
    },
  })
}
