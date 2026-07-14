import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { rosLaunchesService, type RosLaunchInput, type RosLaunchPatch } from "@/services/ros-launches.service"

const KEY = ["ros-launches"] as const

export function useRosLaunches() {
  return useQuery({ queryKey: KEY, queryFn: () => rosLaunchesService.list() })
}

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: KEY })
}

export function useCreateRosLaunch() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (input: RosLaunchInput) => rosLaunchesService.create(input),
    onSuccess: invalidate,
  })
}

export function useUpdateRosLaunch() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: RosLaunchPatch }) =>
      rosLaunchesService.update(id, patch),
    onSuccess: invalidate,
  })
}

export function useDeleteRosLaunch() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => rosLaunchesService.remove(id),
    onSuccess: invalidate,
  })
}

export function useMarkLaunchLaunched() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, launched }: { id: string; launched: boolean }) =>
      rosLaunchesService.update(id, { launchedAt: launched ? new Date().toISOString() : null }),
    onSuccess: invalidate,
  })
}
