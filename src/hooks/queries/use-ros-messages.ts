import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { rosMessagesService, type RosMessageInput, type RosMessagePatch } from "@/services/ros-messages.service"

const KEY = ["ros-messages"] as const

export function useRosMessages() {
  return useQuery({ queryKey: KEY, queryFn: () => rosMessagesService.list() })
}

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: KEY })
}

export function useCreateRosMessage() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (input: RosMessageInput) => rosMessagesService.create(input),
    onSuccess: invalidate,
  })
}

export function useUpdateRosMessage() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: RosMessagePatch }) =>
      rosMessagesService.update(id, patch),
    onSuccess: invalidate,
  })
}

export function useDeleteRosMessage() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => rosMessagesService.remove(id),
    onSuccess: invalidate,
  })
}

export function useMarkMessageSent() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, sent }: { id: string; sent: boolean }) =>
      rosMessagesService.update(id, { sentAt: sent ? new Date().toISOString() : null }),
    onSuccess: invalidate,
  })
}
