import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { domaineResponsablesService } from "@/services/domaine-responsables.service"
import type { DomaineResponsable } from "@/types/domain"

const DOMAINE_RESPONSABLES_KEY = ["domaine-responsables"] as const

export function useDomaineResponsables() {
  return useQuery({ queryKey: DOMAINE_RESPONSABLES_KEY, queryFn: () => domaineResponsablesService.list() })
}

export function useCreateDomaineResponsable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<DomaineResponsable, "id">) =>
      domaineResponsablesService.create({ ...input, id: crypto.randomUUID() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOMAINE_RESPONSABLES_KEY }),
  })
}

export function useDeleteDomaineResponsable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => domaineResponsablesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOMAINE_RESPONSABLES_KEY }),
  })
}
