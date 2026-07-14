import { CheckCheck, Circle, Clock, EarOff, MessageSquare, Mic, Send, User, Users } from "lucide-react"

import type { Guest, Person, RosMessage, RunOfShowStep } from "@/types/domain"
import { useMarkMessageSent } from "@/hooks/queries/use-ros-messages"
import { useGuests } from "@/hooks/queries/use-guests"
import { usePeople } from "@/hooks/queries/use-people"
import { sortableTime } from "@/lib/run-of-show"
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

function MessageRow({ msg, guests, people }: { msg: RosMessage; guests: Guest[]; people: Person[] }) {
  const markSent = useMarkMessageSent()
  const isSent = msg.sentAt !== null
  const recipient = recipientLabel(msg, guests, people)
  const deliverer = (() => {
    switch (msg.delivererType) {
      case "both_fiances": return "Les deux fiancés"
      case "fiance": return people.find((p) => p.id === msg.delivererPersonId)?.fullName ?? null
      case "guest": return guests.find((g) => g.id === msg.delivererGuestId)?.fullName ?? null
      default: return msg.delivererGuestId ? (guests.find((g) => g.id === msg.delivererGuestId)?.fullName ?? null) : null
    }
  })()

  return (
    <div className={cn(
      "rounded-xl border px-4 py-3 space-y-2 transition-colors",
      isSent ? "border-vert-vegetal/20 bg-vert-vegetal/5" : "border-border bg-card"
    )}>
      {/* En-tête : objet + heure + checkbox */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => markSent.mutate({ id: msg.id, sent: !isSent })}
          className={cn(
            "mt-0.5 shrink-0 transition-colors",
            isSent ? "text-vert-vegetal hover:text-vert-vegetal/70" : "text-muted-foreground hover:text-foreground"
          )}
          title={isSent ? "Marquer comme non envoyé" : "Marquer comme envoyé"}
        >
          {isSent ? <CheckCheck className="size-5" /> : <Circle className="size-5" />}
        </button>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {msg.subject && (
              <span className={cn("font-medium text-sm", isSent ? "line-through text-muted-foreground" : "text-foreground")}>
                {msg.subject}
              </span>
            )}
            {msg.scheduledTime && (
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Clock className="size-3" />{msg.scheduledTime}
              </span>
            )}
            {msg.deliveryMode === "micro" && (
              <span className="flex items-center gap-1 rounded-full bg-bordeaux/10 px-2 py-0.5 text-[10px] font-semibold text-bordeaux">
                <Mic className="size-3" />Micro
              </span>
            )}
            {msg.deliveryMode === "discret" && (
              <span className="flex items-center gap-1 rounded-full bg-lagon/10 px-2 py-0.5 text-[10px] font-semibold text-lagon">
                <EarOff className="size-3" />Discret
              </span>
            )}
            {isSent && msg.sentAt && (
              <span className="text-xs text-vert-vegetal font-medium">
                Envoyé à {new Date(msg.sentAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>

          <p className={cn("text-sm leading-relaxed whitespace-pre-wrap", isSent && "text-muted-foreground")}>{msg.content}</p>

          {/* Méta : délivreur + destinataire */}
          {(deliverer || recipient) && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground pt-0.5">
              {deliverer && (
                <span className="flex items-center gap-1">
                  <Send className="size-3 shrink-0" />
                  <span className="font-medium text-foreground">{deliverer}</span>
                </span>
              )}
              {recipient && (
                <span className="flex items-center gap-1">
                  {(msg.recipientType === "both_fiances" || msg.recipientType === "all_guests") ? <Users className="size-3 shrink-0" /> : <User className="size-3 shrink-0" />}
                  <span className="font-medium text-foreground">{recipient}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface StepMessagesProps {
  step: RunOfShowStep
  messages: RosMessage[]
}

export function StepMessages({ step, messages }: StepMessagesProps) {
  const { data: guests = [] } = useGuests()
  const { data: people = [] } = usePeople()

  const stepMsgs = messages
    .filter((m) => m.stepId === step.id)
    .sort((a, b) => {
      if (a.scheduledTime && b.scheduledTime) return sortableTime(a.scheduledTime) - sortableTime(b.scheduledTime)
      if (a.scheduledTime) return -1
      if (b.scheduledTime) return 1
      return a.sortOrder - b.sortOrder
    })

  if (stepMsgs.length === 0) return null

  const sent = stepMsgs.filter((m) => m.sentAt !== null).length

  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <MessageSquare className="size-3.5" />
        Messages à envoyer
        <span className="ml-auto font-mono normal-case tracking-normal text-muted-foreground/60">
          {sent}/{stepMsgs.length}
        </span>
      </h3>
      <div className="space-y-2">
        {stepMsgs.map((msg) => (
          <MessageRow key={msg.id} msg={msg} guests={guests} people={people} />
        ))}
      </div>
    </div>
  )
}
