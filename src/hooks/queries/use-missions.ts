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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MISSIONS_KEY }),
  })
}

export function useDeleteMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => missionsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MISSIONS_KEY }),
  })
}
