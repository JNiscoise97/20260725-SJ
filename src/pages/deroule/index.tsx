import { useState } from "react"
import { motion } from "framer-motion"
import { PartyPopper } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRunOfShow } from "@/hooks/queries/use-run-of-show"
import { usePeople } from "@/hooks/queries/use-people"
import { RunOfShowStepCard } from "@/components/deroule/RunOfShowStepCard"
import { PhaseTimelineBar } from "@/components/deroule/PhaseTimelineBar"
import { HighlightsStrip } from "@/components/deroule/HighlightsStrip"
import { MaitreTempsPrep } from "@/components/deroule/MaitreTempsPrep"
import { MaitreTempsRun } from "@/components/deroule/MaitreTempsRun"
import { buildPhaseSegments, formatProgramWindow, splitRunOfShowSteps } from "@/lib/run-of-show"
import type { Person, RunOfShowStep } from "@/types/domain"

type TabId = "programme" | "preparation" | "en-direct"

function StepList({ steps, people }: { steps: RunOfShowStep[]; people: Person[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-4"
    >
      {steps.map((step) => (
        <RunOfShowStepCard
          key={step.id}
          step={step}
          responsibles={people.filter((p) => step.responsibleIds.includes(p.id))}
        />
      ))}
    </motion.div>
  )
}

export function DeroulePage() {
  const { data: steps, isLoading: stepsLoading } = useRunOfShow()
  const { data: people, isLoading: peopleLoading } = usePeople()
  const [tab, setTab] = useState<TabId>("programme")

  const isLoading = stepsLoading || peopleLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Déroulé" description="Le déroulé minute par minute du jour J." />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Déroulé" description="Le déroulé minute par minute du jour J." />
        <EmptyState icon={PartyPopper} title="Le déroulé n'est pas encore défini" />
      </div>
    )
  }

  const peopleList = people ?? []
  const { unscheduled, prep, program } = splitRunOfShowSteps(steps)
  const segments = buildPhaseSegments(program)
  const windowLabel = formatProgramWindow(program)
  const programGroups = segments.filter((s) => s.steps.length > 0)
  const highlights = [...prep, ...program].filter((s) => s.isHighlight)

  return (
    <div className="space-y-6">
      <PageHeader title="Déroulé" description="Le déroulé minute par minute du jour J." />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList>
          <TabsTrigger value="programme">Programme</TabsTrigger>
          <TabsTrigger value="preparation">Préparation</TabsTrigger>
          <TabsTrigger value="en-direct">En direct</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "programme" ? (
        <div className="space-y-6">
          <PhaseTimelineBar segments={segments} windowLabel={windowLabel} />
          <HighlightsStrip steps={highlights} />

          {prep.length > 0 ? (
            <div className="space-y-3">
              <h2 className="font-heading text-sm font-medium text-muted-foreground">
                Préparatifs (en amont)
              </h2>
              <StepList steps={prep} people={peopleList} />
            </div>
          ) : null}

          <div className="space-y-6">
            {programGroups.map((group, i) => (
              <div key={i} className="space-y-3">
                <h2 className="flex items-center gap-2 font-heading text-base font-medium text-foreground">
                  <span className={`size-2 shrink-0 rounded-full ${group.style.barClass}`} />
                  {group.style.label}
                </h2>
                <StepList steps={group.steps} people={peopleList} />
              </div>
            ))}
          </div>

          {unscheduled.length > 0 ? (
            <div className="space-y-3">
              <h2 className="font-heading text-sm font-medium text-muted-foreground">
                Sans horaire fixe
              </h2>
              <StepList steps={unscheduled} people={peopleList} />
            </div>
          ) : null}
        </div>
      ) : tab === "preparation" ? (
        <MaitreTempsPrep steps={steps} people={peopleList} />
      ) : (
        <MaitreTempsRun steps={steps} people={peopleList} />
      )}
    </div>
  )
}
