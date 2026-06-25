import { motion } from "framer-motion"
import { PartyPopper } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { useRunOfShow } from "@/hooks/queries/use-run-of-show"
import { usePeople } from "@/hooks/queries/use-people"
import { RunOfShowStepCard } from "@/components/deroule/RunOfShowStepCard"

export function DeroulePage() {
  const { data: steps, isLoading: stepsLoading } = useRunOfShow()
  const { data: people, isLoading: peopleLoading } = usePeople()

  const isLoading = stepsLoading || peopleLoading

  return (
    <div className="space-y-6">
      <PageHeader
        title="Déroulé"
        description="Le déroulé minute par minute du jour J."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !steps || steps.length === 0 ? (
        <EmptyState icon={PartyPopper} title="Le déroulé n'est pas encore défini" />
      ) : (
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
              responsibles={(people ?? []).filter((p) => step.responsibleIds.includes(p.id))}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
