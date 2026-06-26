import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { checklistsService } from "@/services/checklists.service"
import type { Checklist, ChecklistItem, ChecklistOwnerType } from "@/types/domain"

export function useChecklistsForOwner(ownerType: ChecklistOwnerType, ownerId: string) {
  return useQuery({
    queryKey: ["checklists", ownerType, ownerId],
    queryFn: () => checklistsService.listForOwner(ownerType, ownerId),
  })
}

export function useCreateChecklist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<Checklist, "id">) => checklistsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] })
    },
  })
}

export function useUpdateChecklist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Checklist> }) => checklistsService.update(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] })
    },
  })
}

export function useDeleteChecklist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => checklistsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] })
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] })
    },
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

export function useCreateChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<ChecklistItem, "id">) => checklistsService.createItem(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklist-items"] }),
  })
}

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ChecklistItem> }) =>
      checklistsService.updateItem(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklist-items"] }),
  })
}

export function useDeleteChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => checklistsService.removeItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklist-items"] }),
  })
}
