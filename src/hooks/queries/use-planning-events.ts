import { useQuery } from "@tanstack/react-query"

import { planningService } from "@/services/planning.service"

export function usePlanningEvents() {
  return useQuery({ queryKey: ["planning-events"], queryFn: () => planningService.list() })
}
