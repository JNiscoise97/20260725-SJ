import { useEffect, useState } from "react"
import { CheckCheck, Circle, EarOff, MessageSquare, Mic, Rocket, User, Users } from "lucide-react"

import type { Guest, Mission, Person, RosLaunch, RosMessage, RunOfShowStep } from "@/types/domain"
import { useMarkMessageSent } from "@/hooks/queries/use-ros-messages"
import { useMarkLaunchLaunched } from "@/hooks/queries/use-ros-launches"
import { useGuests } from "@/hooks/queries/use-guests"
import { usePeople } from "@/hooks/queries/use-people"
import { useMissions } from "@/hooks/queries/use-missions"
import { useAllMissionAcceptances } from "@/hooks/queries/use-mission-acceptances"
import { getPhaseStyle, sortableTime } from "@/lib/run-of-show"
import { cn } from "@/lib/utils"

function recipientLabel(msg: RosMessage, guests: Guest[], people: Person[]): string | null {
  if (!msg.recipientType) return null
  switch (msg.recipientType) {
    case "guest": return guests.find((x) => x.id === msg.recipientGuestId)?.fullName ?? null
    case "fiance": return people.find((x) => x.id === msg.recipientPersonId)?.fullName ?? null
    case "both_fiances": return "Les deux fiancés"
    case "all_guests": return "Tous les invités"
    case "other": return msg.recipientLabel ?? null
  }
}

function countdownLabel(scheduledTime: string, now: Date): string | null {
  const [h, m] = scheduledTime.split(":").map(Number)
  const target = new Date(now)
  target.setHours(h, m, 0, 0)
  if (h < 7 && now.getHours() >= 7) target.setDate(target.getDate() + 1)
  const diffMin = Math.ceil((target.getTime() - now.getTime()) / 60_000)
  if (diffMin <= 0) return null
  if (diffMin < 60) return `dans ${diffMin} min`
  const hrs = Math.floor(diffMin / 60)
  const mins = diffMin % 60
  return mins > 0 ? `dans ${hrs} h ${mins} min` : `dans ${hrs} h`
}

function MessageCard({ msg, guests, people, now }: { msg: RosMessage; guests: Guest[]; people: Person[]; now: Date }) {
  const markSent = useMarkMessageSent()
  const isSent = msg.sentAt !== null
  const recipient = recipientLabel(msg, guests, people)
  const countdown = msg.scheduledTime ? countdownLabel(msg.scheduledTime, now) : null
  const isMulti = msg.recipientType === "both_fiances" || msg.recipientType === "all_guests"

  return (
    <div className={cn(
      "rounded-xl border px-4 py-3 space-y-2 transition-colors",
      isSent ? "border-vert-vegetal/20 bg-vert-vegetal/5 opacity-60" : "border-border bg-card"
    )}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => markSent.mutate({ id: msg.id, sent: !isSent })}
          className={cn(
            "mt-0.5 shrink-0 transition-colors",
            isSent ? "text-vert-vegetal hover:text-vert-vegetal/70" : "text-muted-foreground hover:text-foreground"
          )}
          title={isSent ? "Annuler la transmission" : "Marquer comme transmis"}
        >
          {isSent ? <CheckCheck className="size-5" /> : <Circle className="size-5" />}
        </button>

        <div className="min-w-0 flex-1 space-y-2">

          {/* Ligne 1 : heure prévue + countdown */}
          {msg.scheduledTime && (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs text-muted-foreground">À transmettre à</span>
              <span className="font-mono text-sm font-bold text-foreground">{msg.scheduledTime}</span>
              {countdown && (
                <span className="text-xs font-semibold text-lagon">({countdown})</span>
              )}
            </div>
          )}

          {/* Ligne 2 : mode + destinataire */}
          <div className="flex flex-wrap items-center gap-2">
            {msg.deliveryMode === "micro" && (
              <span className="flex items-center gap-1 rounded-full bg-bordeaux/10 px-2 py-0.5 text-[10px] font-semibold text-bordeaux">
                <Mic className="size-3" />Au micro
              </span>
            )}
            {msg.deliveryMode === "discret" && (
              <span className="flex items-center gap-1 rounded-full bg-lagon/10 px-2 py-0.5 text-[10px] font-semibold text-lagon">
                <EarOff className="size-3" />Discrètement
              </span>
            )}
            {recipient && (
              <span className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-0.5 text-xs">
                <span className="text-muted-foreground">Pour</span>
                {isMulti ? <Users className="size-3 shrink-0 text-muted-foreground" /> : <User className="size-3 shrink-0 text-muted-foreground" />}
                <span className={cn("font-semibold", isSent ? "text-muted-foreground" : "text-foreground")}>{recipient}</span>
              </span>
            )}
          </div>

          {/* Ligne 2 : objet */}
          {msg.subject && (
            <p className={cn("text-sm font-medium", isSent ? "line-through text-muted-foreground" : "text-foreground")}>
              {msg.subject}
            </p>
          )}

          {/* Ligne 3 : contenu — masqué si transmis */}
          {!isSent && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {msg.content}
            </p>
          )}

          {/* Transmis à */}
          {isSent && msg.sentAt && (
            <p className="text-xs font-semibold text-vert-vegetal">
              Transmis à {new Date(msg.sentAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function LaunchCard({ launch, missions, now }: { launch: RosLaunch; missions: Mission[]; now: Date }) {
  const markLaunched = useMarkLaunchLaunched()
  const isDone = launch.launchedAt !== null
  const countdown = launch.scheduledTime ? countdownLabel(launch.scheduledTime, now) : null
  const label = launch.label
    ?? (launch.missionId ? missions.find((m) => m.id === launch.missionId)?.title : null)
    ?? "—"

  return (
    <div className={cn(
      "rounded-xl border px-4 py-3 space-y-2 transition-colors",
      isDone ? "border-vert-vegetal/20 bg-vert-vegetal/5 opacity-60" : "border-dore/30 bg-dore/5"
    )}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => markLaunched.mutate({ id: launch.id, launched: !isDone })}
          className={cn(
            "mt-0.5 shrink-0 transition-colors",
            isDone ? "text-vert-vegetal hover:text-vert-vegetal/70" : "text-muted-foreground hover:text-foreground"
          )}
          title={isDone ? "Annuler le lancement" : "Marquer comme lancé"}
        >
          {isDone ? <CheckCheck className="size-5" /> : <Circle className="size-5" />}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          {launch.scheduledTime && (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs text-muted-foreground">À lancer à</span>
              <span className="font-mono text-sm font-bold text-foreground">{launch.scheduledTime}</span>
              {countdown && (
                <span className="text-xs font-semibold text-lagon">({countdown})</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Rocket className="size-3.5 shrink-0 text-dore" />
            <span className={cn("text-sm font-medium", isDone ? "line-through text-muted-foreground" : "text-foreground")}>{label}</span>
          </div>

          {isDone && launch.launchedAt && (
            <p className="text-xs font-semibold text-vert-vegetal">
              Lancé à {new Date(launch.launchedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface StepGroup {
  step: RunOfShowStep
  messages: RosMessage[]
  launches: RosLaunch[]
}

interface PhaseGroup {
  phase: string | null
  stepGroups: StepGroup[]
}

interface MyMessagesProps {
  personId: string
  messages: RosMessage[]
  launches: RosLaunch[]
  steps: RunOfShowStep[]
  includeBothFiances?: boolean
}

export function MyMessages({ personId, messages, launches, steps, includeBothFiances = false }: MyMessagesProps) {
  const { data: guests = [] } = useGuests()
  const { data: people = [] } = usePeople()
  const { data: missions = [] } = useMissions()
  const { data: acceptances = [] } = useAllMissionAcceptances()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const myMessages = messages
    .filter((m) =>
      m.delivererGuestId === personId ||
      m.delivererPersonId === personId ||
      (includeBothFiances && m.delivererType === "both_fiances")
    )
    .sort((a, b) => {
      if (a.scheduledTime && b.scheduledTime) return sortableTime(a.scheduledTime) - sortableTime(b.scheduledTime)
      if (a.scheduledTime) return -1
      if (b.scheduledTime) return 1
      return a.sortOrder - b.sortOrder
    })

  const myLaunches = launches
    .filter((l) =>
      l.missionId !== null &&
      acceptances.some((a) => a.missionId === l.missionId && a.guestId === personId && a.status === "accepted")
    )
    .sort((a, b) => {
      if (a.scheduledTime && b.scheduledTime) return sortableTime(a.scheduledTime) - sortableTime(b.scheduledTime)
      if (a.scheduledTime) return -1
      if (b.scheduledTime) return 1
      return a.sortOrder - b.sortOrder
    })

  if (myMessages.length === 0 && myLaunches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
        <MessageSquare className="size-8 opacity-30" />
        <p className="text-sm">Aucun message ni lancement ne t'est assigné pour le moment.</p>
      </div>
    )
  }

  const stepMap = new Map(steps.map((s) => [s.id, s]))

  // Build step groups from messages then launches
  const stepGroupMap = new Map<string, StepGroup>()
  function ensureGroup(stepId: string) {
    const step = stepMap.get(stepId)
    if (!step) return null
    if (!stepGroupMap.has(step.id)) stepGroupMap.set(step.id, { step, messages: [], launches: [] })
    return stepGroupMap.get(step.id)!
  }
  for (const msg of myMessages) {
    const g = ensureGroup(msg.stepId)
    if (g) g.messages.push(msg)
  }
  for (const launch of myLaunches) {
    const g = ensureGroup(launch.stepId)
    if (g) g.launches.push(launch)
  }

  // Sort step groups by scheduled time of first item
  const sortedGroups = [...stepGroupMap.values()].sort((a, b) => {
    const aTime = a.step.startsAt ?? a.messages[0]?.scheduledTime ?? a.launches[0]?.scheduledTime
    const bTime = b.step.startsAt ?? b.messages[0]?.scheduledTime ?? b.launches[0]?.scheduledTime
    if (aTime && bTime) return sortableTime(aTime) - sortableTime(bTime)
    return 0
  })

  // Group by phase, preserving order
  const phaseGroups: PhaseGroup[] = []
  for (const stepGroup of sortedGroups) {
    const phase = stepGroup.step.phase ?? null
    const existing = phaseGroups.find((pg) => pg.phase === phase)
    if (existing) {
      existing.stepGroups.push(stepGroup)
    } else {
      phaseGroups.push({ phase, stepGroups: [stepGroup] })
    }
  }

  const sentCount = myMessages.filter((m) => m.sentAt !== null).length
  const launchedCount = myLaunches.filter((l) => l.launchedAt !== null).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {myMessages.length > 0 && (
          <span>{sentCount}/{myMessages.length} message{myMessages.length > 1 ? "s" : ""} transmis</span>
        )}
        {myLaunches.length > 0 && (
          <span>{launchedCount}/{myLaunches.length} lancement{myLaunches.length > 1 ? "s" : ""} effectué{myLaunches.length > 1 ? "s" : ""}</span>
        )}
      </div>

      {phaseGroups.map(({ phase, stepGroups }) => {
        const style = getPhaseStyle(phase)
        return (
          <div key={phase ?? "__none__"} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", style.barClass)} />
              <span className={cn("text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full", style.badgeClass)}>
                {style.label}
              </span>
            </div>

            {stepGroups.map(({ step, messages: stepMsgs, launches: stepLaunches }) => (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center gap-2 pl-4">
                  <span className="font-mono text-xs text-muted-foreground">{step.timeLabel}</span>
                  <span className="text-sm font-medium text-foreground">{step.label}</span>
                </div>
                <div className="space-y-2">
                  {stepMsgs.map((msg) => (
                    <MessageCard key={msg.id} msg={msg} guests={guests} people={people} now={now} />
                  ))}
                  {stepLaunches.map((launch) => (
                    <LaunchCard key={launch.id} launch={launch} missions={missions} now={now} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
