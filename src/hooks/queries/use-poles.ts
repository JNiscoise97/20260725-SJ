import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { polesService } from "@/services/poles.service"
import type { Pole } from "@/types/domain"

const POLES_KEY = ["poles"] as const

export function usePoles() {
  return useQuery({ queryKey: POLES_KEY, queryFn: () => polesService.list() })
}

export function useCreatePole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<Pole, "id">) => polesService.create({ ...input, id: crypto.randomUUID() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: POLES_KEY }),
  })
}

export function useUpdatePole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pole> }) => polesService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: POLES_KEY }),
  })
}

/** Réordonnement par drag-and-drop : met à jour le cache immédiatement (sinon la liste "rebondit" le temps de l'aller-retour réseau), puis persiste en arrière-plan. */
export function useReorderPoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (poles: Pole[]) =>
      Promise.all(poles.map((p) => polesService.update(p.id, { sortOrder: p.sortOrder }))),
    onMutate: async (poles) => {
      await queryClient.cancelQueries({ queryKey: POLES_KEY })
      const previous = queryClient.getQueryData<Pole[]>(POLES_KEY)
      queryClient.setQueryData<Pole[]>(POLES_KEY, poles)
      return { previous }
    },
    onError: (_err, _poles, context) => {
      if (context?.previous) queryClient.setQueryData(POLES_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: POLES_KEY }),
  })
}

export function useDeletePole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => polesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: POLES_KEY }),
  })
}
