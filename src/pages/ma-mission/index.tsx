import { useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import { ClipboardCheck, ListChecks, XCircle } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { useIdentity } from "@/context/IdentityContext"
import { usePeople } from "@/hooks/queries/use-people"
import { useGuests } from "@/hooks/queries/use-guests"
import { useDomaines } from "@/hooks/queries/use-domaines"
import { usePoles } from "@/hooks/queries/use-poles"
import { useDomaineResponsables } from "@/hooks/queries/use-domaine-responsables"
import { useMissions } from "@/hooks/queries/use-missions"
import { useResponsableEntries } from "@/hooks/use-responsable-entries"
import { useMissionAcceptancesForGuest, useRespondToMission } from "@/hooks/queries/use-mission-acceptances"
import { MissionApprovalCard } from "@/components/role/MissionApprovalCard"
import { AcceptedMissionCard } from "@/components/role/AcceptedMissionCard"
import { DeclinedMissionCard } from "@/components/role/DeclinedMissionCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { MissionAcceptanceStatus } from "@/types/domain"

export function MaMissionPage() {
  const { person } = useIdentity()
  const { data: people, isLoading: peopleLoading } = usePeople()
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: domaines, isLoading: domainesLoading } = useDomaines()
  const { data: poles, isLoading: polesLoading } = usePoles()
  const { data: responsables, isLoading: responsablesLoading } = useDomaineResponsables()
  const { data: missions, isLoading: missionsLoading } = useMissions()
  const { isLoading: entriesLoading, entries } = useResponsableEntries()
  const { data: acceptances } = useMissionAcceptancesForGuest(person?.id)
  const respondToMission = useRespondToMission()
  const [respondingMissionId, setRespondingMissionId] = useState<string | null>(null)

  const statusByMissionId = useMemo(() => {
    const map = new Map<string, MissionAcceptanceStatus>()
    for (const acceptance of acceptances ?? []) {
      map.set(acceptance.missionId, acceptance.status)
    }
    return map
  }, [acceptances])

  if (!person || person.role !== "referent") {
    return <Navigate to="/" replace />
  }

  const handleRespond = (missionId: string, accept: boolean) => {
    setRespondingMissionId(missionId)
    respondToMission.mutate(
      { missionId, guestId: person.id, status: accept ? "accepted" : "declined" },
      { onSettled: () => setRespondingMissionId(null) }
    )
  }

  const isLoading =
    peopleLoading ||
    guestsLoading ||
    domainesLoading ||
    polesLoading ||
    responsablesLoading ||
    missionsLoading ||
    entriesLoading

  if (isLoading) {
    return <Skeleton className="h-96 max-w-2xl rounded-2xl" />
  }

  const entry = entries.find((e) => e.identity.id === person.id)
  const domaineIds = entry?.domaineIds ?? []
  const myMissions = (missions ?? []).filter((m) => m.domaineId != null && domaineIds.includes(m.domaineId))

  function domaineOf(domaineId?: string | null) {
    return domaineId ? domaines?.find((d) => d.id === domaineId) : undefined
  }

  function poleNameOf(poleId?: string | null) {
    return poleId ? poles?.find((p) => p.id === poleId)?.name : undefined
  }

  function responsableNamesOf(domaineId?: string | null) {
    if (!domaineId) return []
    return (responsables ?? [])
      .filter((r) => r.domaineId === domaineId)
      .map((r) => {
        if (r.personId) return people?.find((p) => p.id === r.personId)?.fullName
        if (r.guestId) return guests?.find((g) => g.id === r.guestId)?.fullName
        return undefined
      })
      .filter((name): name is string => Boolean(name))
  }

  const pendingMissions = myMissions.filter((m) => {
    const status = statusByMissionId.get(m.id)
    return status === undefined || status === "pending"
  })
  const acceptedMissions = myMissions.filter((m) => statusByMissionId.get(m.id) === "accepted")
  const declinedMissions = myMissions.filter((m) => statusByMissionId.get(m.id) === "declined")

  return (
    <div className="space-y-8">
      <PageHeader title="Mon rôle" description="Tout ce dont vous avez besoin pour le jour J." />

      {pendingMissions.length > 0 ? (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <ClipboardCheck className="size-5 text-dore" />
            Missions en attente d'approbation
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pendingMissions.map((mission) => {
              const domaine = domaineOf(mission.domaineId)
              return (
                <MissionApprovalCard
                  key={mission.id}
                  mission={mission}
                  domaineName={domaine?.name}
                  poleName={poleNameOf(domaine?.poleId)}
                  responsableNames={responsableNamesOf(mission.domaineId)}
                  status={statusByMissionId.get(mission.id) ?? "pending"}
                  isResponding={respondingMissionId === mission.id}
                  onRespond={handleRespond}
                />
              )
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <ListChecks className="size-5 text-vert-vegetal" />
          Missions acceptées
        </h2>
        {acceptedMissions.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Aucune mission acceptée"
            description="Les missions que vous acceptez apparaîtront ici avec leur checklist."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {acceptedMissions.map((mission) => {
              const domaine = domaineOf(mission.domaineId)
              return (
                <AcceptedMissionCard
                  key={mission.id}
                  mission={mission}
                  domaineName={domaine?.name}
                  poleName={poleNameOf(domaine?.poleId)}
                  isResponding={respondingMissionId === mission.id}
                  onDecline={(missionId) => handleRespond(missionId, false)}
                />
              )
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <XCircle className="size-5 text-bordeaux" />
          Missions déclinées
        </h2>
        {declinedMissions.length === 0 ? (
          <EmptyState icon={XCircle} title="Aucune mission déclinée" />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {declinedMissions.map((mission) => {
              const domaine = domaineOf(mission.domaineId)
              return (
                <DeclinedMissionCard
                  key={mission.id}
                  mission={mission}
                  domaineName={domaine?.name}
                  poleName={poleNameOf(domaine?.poleId)}
                  isResponding={respondingMissionId === mission.id}
                  onAccept={(missionId) => handleRespond(missionId, true)}
                />
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
