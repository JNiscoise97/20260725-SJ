import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { missionAcceptancesService } from "@/services/mission-acceptances.service"
import type { MissionAcceptanceStatus } from "@/types/domain"

export function useMissionAcceptancesForGuest(guestId?: string) {
  return useQuery({
    queryKey: ["mission-acceptances", guestId],
    queryFn: () => missionAcceptancesService.listForGuest(guestId!),
    enabled: !!guestId,
  })
}

export function useRespondToMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      missionId,
      guestId,
      status,
    }: {
      missionId: string
      guestId: string
      status: MissionAcceptanceStatus
    }) => missionAcceptancesService.respond(missionId, guestId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mission-acceptances"] }),
  })
}
