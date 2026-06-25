import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { tasksService } from "@/services/tasks.service"
import type { Task } from "@/types/domain"

const TASKS_KEY = ["tasks"] as const

export function useTasks() {
  return useQuery({ queryKey: TASKS_KEY, queryFn: () => tasksService.list() })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<Task, "id">) => tasksService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Task> }) => tasksService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tasksService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}
