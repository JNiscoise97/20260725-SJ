import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { photoGroupsService } from "@/services/photo-groups.service"
import type { PhotoGroup, PhotoGroupMember } from "@/types/domain"

const GROUPS_KEY = ["photo-groups"] as const
const MEMBERS_KEY = ["photo-group-members"] as const

export function usePhotoGroups() {
  return useQuery({ queryKey: GROUPS_KEY, queryFn: () => photoGroupsService.listGroups() })
}

export function useCreatePhotoGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<PhotoGroup, "id">) => photoGroupsService.createGroup(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_KEY }),
  })
}

export function useUpdatePhotoGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<PhotoGroup> }) =>
      photoGroupsService.updateGroup(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GROUPS_KEY }),
  })
}

export function useDeletePhotoGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => photoGroupsService.removeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY })
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEY })
    },
  })
}

/**
 * Réordonnement par drag-and-drop : optimiste pour un retour visuel immédiat — même pattern que useReorderPoles.
 * Patche aussi `sessionId` (pas seulement `sortOrder`) pour pouvoir déplacer un groupe d'une séance à l'autre dans
 * le même geste — un no-op pour les groupes dont la séance n'a pas changé.
 */
export function useReorderPhotoGroups() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (groups: PhotoGroup[]) =>
      Promise.all(
        groups.map((g) => photoGroupsService.updateGroup(g.id, { sortOrder: g.sortOrder, sessionId: g.sessionId }))
      ),
    onMutate: async (groups) => {
      await queryClient.cancelQueries({ queryKey: GROUPS_KEY })
      const previous = queryClient.getQueryData<PhotoGroup[]>(GROUPS_KEY)
      const byId = new Map(groups.map((g) => [g.id, g]))
      queryClient.setQueryData<PhotoGroup[]>(GROUPS_KEY, (current) => (current ?? []).map((g) => byId.get(g.id) ?? g))
      return { previous }
    },
    onError: (_err, _groups, context) => {
      if (context?.previous) queryClient.setQueryData(GROUPS_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: GROUPS_KEY }),
  })
}

export function useAllPhotoGroupMembers() {
  return useQuery({ queryKey: MEMBERS_KEY, queryFn: () => photoGroupsService.listAllMembers() })
}

export function useAddPhotoGroupMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ photoGroupId, guestId }: { photoGroupId: string; guestId: string }) =>
      photoGroupsService.addMember(photoGroupId, guestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY }),
  })
}

export function useRemovePhotoGroupMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => photoGroupsService.removeMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY }),
  })
}

/** Coche/décoche la présence d'un invité sur une photo — optimiste pour rester réactif pendant l'usage en direct le jour J. */
export function useUpdatePhotoGroupMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<PhotoGroupMember> }) =>
      photoGroupsService.updateMember(id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: MEMBERS_KEY })
      const previous = queryClient.getQueryData<PhotoGroupMember[]>(MEMBERS_KEY)
      queryClient.setQueryData<PhotoGroupMember[]>(MEMBERS_KEY, (current) =>
        (current ?? []).map((m) => (m.id === id ? { ...m, ...patch } : m))
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(MEMBERS_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY }),
  })
}
