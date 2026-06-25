import { useMemo } from "react"
import { Users } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { useIdentity } from "@/context/IdentityContext"
import { usePeople } from "@/hooks/queries/use-people"
import { useRoleCategories } from "@/hooks/queries/use-role-categories"
import { useMissions } from "@/hooks/queries/use-missions"
import { useDocuments } from "@/hooks/queries/use-documents"
import { useTasks } from "@/hooks/queries/use-tasks"
import { ReferentCard } from "@/components/referents/ReferentCard"

export function ReferentsPage() {
  const { person } = useIdentity()
  const { data: people, isLoading: peopleLoading } = usePeople()
  const { data: roleCategories, isLoading: categoriesLoading } = useRoleCategories()
  const { data: missions, isLoading: missionsLoading } = useMissions()
  const { data: documents, isLoading: documentsLoading } = useDocuments()
  const { data: tasks, isLoading: tasksLoading } = useTasks()

  const isLoading = peopleLoading || categoriesLoading || missionsLoading || documentsLoading || tasksLoading

  const referents = useMemo(() => {
    const allReferents = (people ?? []).filter((p) => p.role === "referent")
    if (person?.role === "referent") {
      return allReferents.filter((r) => r.id === person.id)
    }
    return allReferents
  }, [people, person])

  const fiances = useMemo(() => (people ?? []).filter((p) => p.role === "fiance"), [people])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Référents"
        description="Les personnes qui pilotent chaque mission."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : referents.length === 0 ? (
        <EmptyState icon={Users} title="Aucun référent" description="Ajoutez des référents depuis Paramètres." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {referents.map((referent) => {
            const roleCategory = roleCategories?.find((c) => c.id === referent.referentCategoryId)
            const mission = missions?.find((m) => m.referentId === referent.id)
            const partner = (people ?? []).find((p) => p.id === referent.partnerReferentId)
            const referentDocuments = (documents ?? []).filter((doc) => doc.category === roleCategory?.name)
            const openTaskCount = (tasks ?? []).filter(
              (task) => task.ownerId === referent.id && task.status !== "done"
            ).length

            return (
              <ReferentCard
                key={referent.id}
                person={referent}
                roleCategory={roleCategory}
                mission={mission}
                partner={partner}
                contacts={fiances}
                documents={referentDocuments}
                openTaskCount={openTaskCount}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
