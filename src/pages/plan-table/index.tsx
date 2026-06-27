import { Armchair } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { useGuests } from "@/hooks/queries/use-guests"
import { usePeople } from "@/hooks/queries/use-people"
import { usePrestataires } from "@/hooks/queries/use-prestataires"
import { useAssignSeat, useTableAssignments, useTables, useUnassignSeat } from "@/hooks/queries/use-seating"
import { SeatingPlanBoard } from "@/components/plan-table/SeatingPlanBoard"

export function PlanTablePage() {
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: people, isLoading: peopleLoading } = usePeople()
  const { data: prestataires, isLoading: prestatairesLoading } = usePrestataires()
  const { data: tables, isLoading: tablesLoading } = useTables()
  const { data: assignments, isLoading: assignmentsLoading } = useTableAssignments()
  const assignSeat = useAssignSeat()
  const unassignSeat = useUnassignSeat()

  const isLoading = guestsLoading || peopleLoading || prestatairesLoading || tablesLoading || assignmentsLoading

  return (
    <div className="space-y-6">
      <PageHeader title="Plan de table" description="Placement des invités, des fiancés et des prestataires." />

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : !tables || tables.length === 0 ? (
        <EmptyState
          icon={Armchair}
          title="Aucune table configurée"
          description="Configurez le nombre de tables et leur capacité depuis Paramètres."
        />
      ) : (
        <SeatingPlanBoard
          tables={tables}
          guests={guests ?? []}
          people={people ?? []}
          prestataires={prestataires ?? []}
          assignments={assignments ?? []}
          onAssign={(tableId, target) => assignSeat.mutate({ tableId, target })}
          onUnassign={(assignmentId) => unassignSeat.mutate(assignmentId)}
        />
      )}
    </div>
  )
}
