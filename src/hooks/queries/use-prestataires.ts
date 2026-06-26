import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { prestatairesService } from "@/services/prestataires.service"
import type { Prestataire } from "@/types/domain"

const PRESTATAIRES_KEY = ["prestataires"] as const

export function usePrestataires() {
  return useQuery({ queryKey: PRESTATAIRES_KEY, queryFn: () => prestatairesService.list() })
}

export function useCreatePrestataire() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<Prestataire, "id">) =>
      prestatairesService.create({ ...input, id: crypto.randomUUID() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRESTATAIRES_KEY }),
  })
}

export function useUpdatePrestataire() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Prestataire> }) =>
      prestatairesService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRESTATAIRES_KEY }),
  })
}

export function useDeletePrestataire() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => prestatairesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRESTATAIRES_KEY }),
  })
}
