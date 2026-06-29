import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { checklistsService } from "@/services/checklists.service"
import { missionsService } from "@/services/missions.service"
import type { Checklist, ChecklistItem, ChecklistOwnerType, ProgressStatus } from "@/types/domain"

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

/**
 * Coche/décoche un item, puis recalcule le statut de la mission propriétaire
 * de sa checklist (todo si aucun item fait, in_progress si certains, done si
 * tous) — sauf si la mission est "blocked", un état manuel qu'on ne veut pas
 * écraser silencieusement au prochain item coché.
 */
async function syncMissionStatusForItem(item: ChecklistItem) {
  const checklists = await checklistsService.listAll()
  const checklist = checklists.find((c) => c.id === item.checklistId)
  if (!checklist || checklist.ownerType !== "mission" || !checklist.ownerId) return

  const missionId = checklist.ownerId
  const missionChecklistIds = new Set(
    checklists.filter((c) => c.ownerType === "mission" && c.ownerId === missionId).map((c) => c.id)
  )
  const allItems = await checklistsService.listAllItems()
  const missionItems = allItems.filter((i) => missionChecklistIds.has(i.checklistId))
  if (missionItems.length === 0) return

  const missions = await missionsService.list()
  const mission = missions.find((m) => m.id === missionId)
  if (!mission || mission.status === "blocked") return

  const allDone = missionItems.every((i) => i.isDone)
  const someDone = missionItems.some((i) => i.isDone)
  const newStatus: ProgressStatus = allDone ? "done" : someDone ? "in_progress" : "todo"
  if (newStatus !== mission.status) {
    await missionsService.update(missionId, { status: newStatus })
  }
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ itemId, isDone }: { itemId: string; isDone: boolean }) => {
      const item = await checklistsService.toggleItem(itemId, isDone)
      await syncMissionStatusForItem(item)
      return item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] })
      queryClient.invalidateQueries({ queryKey: ["missions"] })
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
