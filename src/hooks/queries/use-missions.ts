import { useQuery } from "@tanstack/react-query"

import { missionsService } from "@/services/missions.service"

export function useMissions() {
  return useQuery({ queryKey: ["missions"], queryFn: () => missionsService.list() })
}
