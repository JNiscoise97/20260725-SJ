import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { MapPin } from "lucide-react"

import type { PlanningEvent } from "@/types/domain"
import { MILESTONE_LABELS, MILESTONE_ORDER } from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"

export function MilestoneTimeline({ events }: { events: PlanningEvent[] }) {
  return (
    <div className="space-y-8">
      {MILESTONE_ORDER.map((milestone) => {
        const milestoneEvents = events
          .filter((event) => event.milestone === milestone)
          .sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? ""))

        if (milestoneEvents.length === 0) return null

        return (
          <div key={milestone} className="flex gap-4">
            <div className="flex w-16 shrink-0 flex-col items-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-bordeaux text-xs font-semibold text-primary-foreground">
                {MILESTONE_LABELS[milestone]}
              </span>
              <span className="mt-1 flex-1 w-px bg-border" />
            </div>
            <div className="flex-1 space-y-3 pb-2">
              {milestoneEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground">{event.title}</p>
                      {event.startsAt ? (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {format(new Date(event.startsAt), "d MMMM yyyy", { locale: fr })}
                        </span>
                      ) : null}
                    </div>
                    {event.description ? (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    ) : null}
                    {event.location ? (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {event.location}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
