import { useState } from "react"
import { PartyPopper } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRunOfShow } from "@/hooks/queries/use-run-of-show"
import { usePeople } from "@/hooks/queries/use-people"
import { useRosMessages } from "@/hooks/queries/use-ros-messages"
import { useRosLaunches } from "@/hooks/queries/use-ros-launches"
import { useRosDelays } from "@/hooks/queries/use-ros-delays"
import { useAllMissionAcceptances } from "@/hooks/queries/use-mission-acceptances"
import { useIdentity } from "@/context/IdentityContext"
import { LiveDashboard } from "@/components/timing/LiveDashboard"
import { MessagesConfig } from "@/components/timing/MessagesConfig"
import { DelayJournal } from "@/components/timing/DelayJournal"
import { MyMessages } from "@/components/timing/MyMessages"

type TabId = "en-direct" | "mes-messages" | "messages" | "retards"

export function TimingPage() {
  const { person, realPerson } = useIdentity()
  const isFiance = realPerson?.role === "fiance"
  // Référent = invité assignable connecté avec ses propres credentials (ou impersonné par un fiancé)
  const isReferent = person?.role === "referent"

  const [tab, setTab] = useState<TabId>(isReferent ? "mes-messages" : "en-direct")
  const showMyMessages = isReferent || isFiance

  const { data: steps, isLoading: stepsLoading } = useRunOfShow()
  const { data: people, isLoading: peopleLoading } = usePeople()
  const { data: messages, isLoading: messagesLoading } = useRosMessages()
  const { data: launches, isLoading: launchesLoading } = useRosLaunches()
  const { data: delays, isLoading: delaysLoading } = useRosDelays()
  const { data: acceptances = [] } = useAllMissionAcceptances()

  const isLoading = stepsLoading || peopleLoading || messagesLoading || launchesLoading || delaysLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Timing" description="Suivi en direct, messages clés et gestion des retards." />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Timing" description="Suivi en direct, messages clés et gestion des retards." />
        <EmptyState icon={PartyPopper} title="Le déroulé n'est pas encore défini" />
      </div>
    )
  }

  const peopleList = people ?? []
  const messageList = messages ?? []
  const launchList = launches ?? []
  const delayList = delays ?? []

  return (
    <div className="space-y-6">
      <PageHeader title="Timing" description="Suivi en direct, messages clés et gestion des retards." />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList>
          {showMyMessages && (
            <TabsTrigger value="mes-messages">
              Mes messages
              {(() => {
                const mine = messageList.filter((m) =>
                  m.delivererGuestId === person?.id ||
                  m.delivererPersonId === person?.id ||
                  (isFiance && m.delivererType === "both_fiances")
                )
                const myLaunches = launchList.filter((l) =>
                  l.missionId !== null &&
                  acceptances.some((a) => a.missionId === l.missionId && a.guestId === person?.id && a.status === "accepted")
                )
                const pending = mine.filter((m) => m.sentAt === null).length +
                  myLaunches.filter((l) => l.launchedAt === null).length
                return pending > 0 ? (
                  <span className="ml-1.5 rounded-full bg-bordeaux/20 px-1.5 py-0.5 text-[10px] font-bold text-bordeaux tabular-nums">
                    {pending}
                  </span>
                ) : null
              })()}
            </TabsTrigger>
          )}
          <TabsTrigger value="en-direct">En direct</TabsTrigger>
          {isFiance && <TabsTrigger value="messages">Messages</TabsTrigger>}
          <TabsTrigger value="retards">
            Retards
            {delayList.length > 0 && (
              <span className="ml-1.5 rounded-full bg-bordeaux/20 px-1.5 py-0.5 text-[10px] font-bold text-bordeaux tabular-nums">
                {delayList.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "mes-messages" && showMyMessages && person && (
        <MyMessages personId={person.id} messages={messageList} launches={launchList} steps={steps} includeBothFiances={isFiance} />
      )}
      {tab === "en-direct" && (
        <LiveDashboard steps={steps} people={peopleList} messages={messageList} />
      )}
      {tab === "messages" && isFiance && (
        <MessagesConfig steps={steps} messages={messageList} launches={launchList} />
      )}
      {tab === "retards" && (
        <DelayJournal delays={delayList} steps={steps} />
      )}
    </div>
  )
}
