import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { rosDelaysService } from "@/services/ros-delays.service"

const KEY = ["ros-delays"] as const

export function useRosDelays() {
  return useQuery({ queryKey: KEY, queryFn: () => rosDelaysService.list() })
}

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: KEY })
}

export function useCreateRosDelay() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (input: { stepId: string | null; delayMinutes: number; reason: string | null }) =>
      rosDelaysService.create(input),
    onSuccess: invalidate,
  })
}

export function useDeleteRosDelay() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => rosDelaysService.remove(id),
    onSuccess: invalidate,
  })
}
