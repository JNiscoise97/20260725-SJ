import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { missionsService } from "@/services/missions.service"
import type { Mission } from "@/types/domain"

const MISSIONS_KEY = ["missions"] as const

export function useMissions() {
  return useQuery({ queryKey: MISSIONS_KEY, queryFn: () => missionsService.list() })
}

export function useCreateMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<Mission, "id">) => missionsService.create({ ...input, id: crypto.randomUUID() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MISSIONS_KEY }),
  })
}

export function useUpdateMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Mission> }) => missionsService.update(id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: MISSIONS_KEY })
      const previous = queryClient.getQueryData<Mission[]>(MISSIONS_KEY)
      queryClient.setQueryData<Mission[]>(MISSIONS_KEY, (cur) =>
        (cur ?? []).map((m) => (m.id === id ? { ...m, ...patch } : m))
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(MISSIONS_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: MISSIONS_KEY }),
  })
}

/** Réordonnement par drag-and-drop : met à jour le cache immédiatement (sinon la liste "rebondit" le temps de l'aller-retour réseau), puis persiste en arrière-plan — voir useReorderPoles/useReorderDomaines, même pattern. */
export function useReorderMissions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (missions: Mission[]) =>
      Promise.all(missions.map((m) => missionsService.update(m.id, { sortOrder: m.sortOrder }))),
    onMutate: async (missions) => {
      await queryClient.cancelQueries({ queryKey: MISSIONS_KEY })
      const previous = queryClient.getQueryData<Mission[]>(MISSIONS_KEY)
      const byId = new Map(missions.map((m) => [m.id, m]))
      queryClient.setQueryData<Mission[]>(MISSIONS_KEY, (current) =>
        (current ?? []).map((m) => byId.get(m.id) ?? m)
      )
      return { previous }
    },
    onError: (_err, _missions, context) => {
      if (context?.previous) queryClient.setQueryData(MISSIONS_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: MISSIONS_KEY }),
  })
}

export function useDeleteMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => missionsService.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: MISSIONS_KEY })
      const previous = queryClient.getQueryData<Mission[]>(MISSIONS_KEY)
      queryClient.setQueryData<Mission[]>(MISSIONS_KEY, (cur) => (cur ?? []).filter((m) => m.id !== id))
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(MISSIONS_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: MISSIONS_KEY }),
  })
}
