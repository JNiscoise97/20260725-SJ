import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { ChecklistAccordionCard } from "@/components/feuille-de-route/ChecklistAccordionCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAllChecklists } from "@/hooks/queries/use-checklists"
import { CHECKLIST_PHASE_LABELS, CHECKLIST_PHASE_ORDER } from "@/lib/constants"
import { ListChecks } from "lucide-react"

export function FeuilleDeRoutePage() {
  const { data: checklists, isLoading } = useAllChecklists()
  const standalone = (checklists ?? []).filter((c) => c.ownerType === "standalone")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feuille de route"
        description="Le plan d'action complet de l'événement, organisé par phase."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue={CHECKLIST_PHASE_ORDER[0]}>
          <TabsList>
            {CHECKLIST_PHASE_ORDER.map((phase) => (
              <TabsTrigger key={phase} value={phase}>
                {CHECKLIST_PHASE_LABELS[phase]}
              </TabsTrigger>
            ))}
          </TabsList>
          {CHECKLIST_PHASE_ORDER.map((phase) => {
            const phaseChecklists = standalone.filter((c) => c.phase === phase)
            return (
              <TabsContent key={phase} value={phase} className="space-y-3">
                {phaseChecklists.length === 0 ? (
                  <EmptyState icon={ListChecks} title="Aucune checklist" description="Rien pour cette phase pour le moment." />
                ) : (
                  phaseChecklists.map((checklist) => (
                    <ChecklistAccordionCard key={checklist.id} checklist={checklist} />
                  ))
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}
