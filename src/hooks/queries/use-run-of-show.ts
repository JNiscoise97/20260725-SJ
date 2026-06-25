import { useQuery } from "@tanstack/react-query"

import { runOfShowService } from "@/services/run-of-show.service"

export function useRunOfShow() {
  return useQuery({ queryKey: ["run-of-show"], queryFn: () => runOfShowService.list() })
}
