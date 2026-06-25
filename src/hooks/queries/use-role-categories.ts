import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { rolesService } from "@/services/roles.service"
import type { RoleCategory } from "@/types/domain"

const ROLE_CATEGORIES_KEY = ["role-categories"] as const

export function useRoleCategories() {
  return useQuery({ queryKey: ROLE_CATEGORIES_KEY, queryFn: () => rolesService.list() })
}

export function useCreateRoleCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<RoleCategory, "id">) =>
      rolesService.create({ ...input, id: crypto.randomUUID() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLE_CATEGORIES_KEY }),
  })
}

export function useUpdateRoleCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<RoleCategory> }) =>
      rolesService.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLE_CATEGORIES_KEY }),
  })
}

export function useDeleteRoleCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rolesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLE_CATEGORIES_KEY }),
  })
}
