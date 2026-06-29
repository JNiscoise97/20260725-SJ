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

const ALL_ITEMS_KEY = ["checklist-items", "all"] as const

export function useAllChecklistItems() {
  return useQuery({ queryKey: ALL_ITEMS_KEY, queryFn: () => checklistsService.listAllItems() })
}

/** Réordonnement par drag-and-drop : met à jour le cache immédiatement (sinon la liste "rebondit" le temps de l'aller-retour réseau), puis persiste en arrière-plan — voir useReorderPoles/useReorderDomaines, même pattern. */
export function useReorderChecklistItems() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items: ChecklistItem[]) =>
      Promise.all(items.map((i) => checklistsService.updateItem(i.id, { sortOrder: i.sortOrder }))),
    onMutate: async (items) => {
      await queryClient.cancelQueries({ queryKey: ALL_ITEMS_KEY })
      const previous = queryClient.getQueryData<ChecklistItem[]>(ALL_ITEMS_KEY)
      const byId = new Map(items.map((i) => [i.id, i]))
      queryClient.setQueryData<ChecklistItem[]>(ALL_ITEMS_KEY, (current) =>
        (current ?? []).map((i) => byId.get(i.id) ?? i)
      )
      return { previous }
    },
    onError: (_err, _items, context) => {
      if (context?.previous) queryClient.setQueryData(ALL_ITEMS_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist-items"] }),
  })
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
