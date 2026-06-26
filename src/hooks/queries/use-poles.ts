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

export function useDeletePole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => polesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: POLES_KEY }),
  })
}
