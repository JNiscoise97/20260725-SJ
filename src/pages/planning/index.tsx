import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarRange, MapPin } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { usePlanningEvents } from "@/hooks/queries/use-planning-events"
import { MilestoneTimeline } from "@/components/planning/MilestoneTimeline"
import { MILESTONE_LABELS } from "@/lib/constants"

export function PlanningPage() {
  const { data: events, isLoading } = usePlanningEvents()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planning"
        description="La chronologie de la préparation, de J-30 à J+1."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <EmptyState icon={CalendarRange} title="Aucun événement planifié" />
      ) : (
        <Tabs defaultValue="jalons">
          <TabsList>
            <TabsTrigger value="jalons">Par jalon</TabsTrigger>
            <TabsTrigger value="detail">Timeline détaillée</TabsTrigger>
          </TabsList>
          <TabsContent value="jalons">
            <MilestoneTimeline events={events} />
          </TabsContent>
          <TabsContent value="detail">
            <div className="space-y-3">
              {[...events]
                .sort((a, b) => (a.startsAt ?? "").localeCompare(b.startsAt ?? ""))
                .map((event) => (
                  <Card key={event.id}>
                    <CardContent className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{event.title}</p>
                        {event.description ? (
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        ) : null}
                        {event.location ? (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3.5" />
                            {event.location}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">{MILESTONE_LABELS[event.milestone]}</p>
                        {event.startsAt ? (
                          <p>{format(new Date(event.startsAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}</p>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
