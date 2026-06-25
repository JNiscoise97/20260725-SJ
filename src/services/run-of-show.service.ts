import type { RunOfShowStep } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { runOfShowStepsSeed } from "@/services/mock/data/run-of-show"

export interface RunOfShowService {
  list(): Promise<RunOfShowStep[]>
}

const runOfShowTable = createMockTable<RunOfShowStep>("sj-run-of-show", runOfShowStepsSeed)

export const runOfShowService: RunOfShowService = {
  async list() {
    const steps = await runOfShowTable.getAll()
    return [...steps].sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? ""))
  },
}
