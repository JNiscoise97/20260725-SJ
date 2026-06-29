import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { domainesService } from "@/services/domaines.service"
import type { Domaine } from "@/types/domain"

const DOMAINES_KEY = ["domaines"] as const

export function useDomaines() {
  return useQuery({ queryKey: DOMAINES_KEY, queryFn: () => domainesService.list() })
}

export function useCreateDomaine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<Domaine, "id">) => domainesService.create({ ...input, id: crypto.randomUUID() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOMAINES_KEY }),
  })
}

export function useUpdateDomaine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Domaine> }) => domainesService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOMAINES_KEY }),
  })
}

/** Réordonnement par drag-and-drop : met à jour le cache immédiatement (sinon la liste "rebondit" le temps de l'aller-retour réseau), puis persiste en arrière-plan — voir useReorderPoles, même pattern. */
export function useReorderDomaines() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (domaines: Domaine[]) =>
      Promise.all(domaines.map((d) => domainesService.update(d.id, { sortOrder: d.sortOrder }))),
    onMutate: async (domaines) => {
      await queryClient.cancelQueries({ queryKey: DOMAINES_KEY })
      const previous = queryClient.getQueryData<Domaine[]>(DOMAINES_KEY)
      const byId = new Map(domaines.map((d) => [d.id, d]))
      queryClient.setQueryData<Domaine[]>(DOMAINES_KEY, (current) =>
        (current ?? []).map((d) => byId.get(d.id) ?? d)
      )
      return { previous }
    },
    onError: (_err, _domaines, context) => {
      if (context?.previous) queryClient.setQueryData(DOMAINES_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: DOMAINES_KEY }),
  })
}

export function useDeleteDomaine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => domainesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOMAINES_KEY }),
  })
}
