import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { equipmentService } from "@/services/equipment.service"
import type { EquipmentItem } from "@/types/domain"

const EQUIPMENT_KEY = ["equipment"] as const

export function useEquipment() {
  return useQuery({ queryKey: EQUIPMENT_KEY, queryFn: () => equipmentService.listItems() })
}

export function useCreateEquipmentItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<EquipmentItem, "id">) => equipmentService.createItem(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEY }),
  })
}

export function useDeleteEquipmentItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => equipmentService.removeItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEY }),
  })
}

export function useUpdateEquipmentItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<EquipmentItem> }) =>
      equipmentService.updateItem(id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: EQUIPMENT_KEY })
      const previous = queryClient.getQueryData<EquipmentItem[]>(EQUIPMENT_KEY)
      queryClient.setQueryData<EquipmentItem[]>(EQUIPMENT_KEY, (current) =>
        (current ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item))
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(EQUIPMENT_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEY }),
  })
}
