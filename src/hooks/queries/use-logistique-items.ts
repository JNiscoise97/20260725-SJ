import { useQuery } from "@tanstack/react-query"

import { logistiqueService } from "@/services/logistique.service"

export function useLogistiqueItems() {
  return useQuery({ queryKey: ["logistique-items"], queryFn: () => logistiqueService.list() })
}
