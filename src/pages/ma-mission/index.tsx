import { Navigate } from "react-router-dom"

import { PageHeader } from "@/components/shared/PageHeader"
import { useIdentity } from "@/context/IdentityContext"
import { usePeople } from "@/hooks/queries/use-people"
import { useRoleCategories } from "@/hooks/queries/use-role-categories"
import { useMissions } from "@/hooks/queries/use-missions"
import { useDocuments } from "@/hooks/queries/use-documents"
import { useTasks } from "@/hooks/queries/use-tasks"
import { ReferentCard } from "@/components/referents/ReferentCard"
import { Skeleton } from "@/components/ui/skeleton"

export function MaMissionPage() {
  const { person } = useIdentity()
  const { data: people, isLoading: peopleLoading } = usePeople()
  const { data: roleCategories, isLoading: categoriesLoading } = useRoleCategories()
  const { data: missions, isLoading: missionsLoading } = useMissions()
  const { data: documents, isLoading: documentsLoading } = useDocuments()
  const { data: tasks, isLoading: tasksLoading } = useTasks()

  if (!person || person.role !== "referent") {
    return <Navigate to="/" replace />
  }

  const isLoading = peopleLoading || categoriesLoading || missionsLoading || documentsLoading || tasksLoading

  if (isLoading) {
    return <Skeleton className="h-96 max-w-md rounded-2xl" />
  }

  const roleCategory = roleCategories?.find((c) => c.id === person.referentCategoryId)
  const mission = missions?.find((m) => m.referentId === person.id)
  const partner = (people ?? []).find((p) => p.id === person.partnerReferentId)
  const referentDocuments = (documents ?? []).filter((doc) => doc.category === roleCategory?.name)
  const fiances = (people ?? []).filter((p) => p.role === "fiance")
  const openTaskCount = (tasks ?? []).filter((task) => task.ownerId === person.id && task.status !== "done").length

  return (
    <div className="space-y-6">
      <PageHeader title="Ma mission" description="Tout ce dont vous avez besoin pour le jour J." />
      <div className="max-w-md">
        <ReferentCard
          person={person}
          roleCategory={roleCategory}
          mission={mission}
          partner={partner}
          contacts={fiances}
          documents={referentDocuments}
          openTaskCount={openTaskCount}
        />
      </div>
    </div>
  )
}
