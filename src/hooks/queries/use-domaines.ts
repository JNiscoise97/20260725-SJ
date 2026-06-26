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

export function useDeleteDomaine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => domainesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOMAINES_KEY }),
  })
}
