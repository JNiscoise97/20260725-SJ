import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { peopleService } from "@/services/people.service"
import type { Person } from "@/types/domain"

const PEOPLE_KEY = ["people"] as const

export function usePeople() {
  return useQuery({ queryKey: PEOPLE_KEY, queryFn: () => peopleService.list() })
}

export function useCreatePerson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<Person, "id">) => peopleService.create({ ...input, id: crypto.randomUUID() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PEOPLE_KEY }),
  })
}

export function useUpdatePerson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Person> }) => peopleService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PEOPLE_KEY }),
  })
}

export function useDeletePerson() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => peopleService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PEOPLE_KEY }),
  })
}
