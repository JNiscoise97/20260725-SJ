import type { Mission } from "@/types/domain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChecklistWidget } from "@/components/shared/ChecklistWidget"

interface AcceptedMissionCardProps {
  mission: Mission
  domaineName?: string
  poleName?: string
  isResponding: boolean
  onDecline: (missionId: string) => void
}

export function AcceptedMissionCard({
  mission,
  domaineName,
  poleName,
  isResponding,
  onDecline,
}: AcceptedMissionCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div className="space-y-2">
          <CardTitle className="font-heading text-base">{mission.title}</CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {poleName ? <Badge className="bg-muted text-muted-foreground">{poleName}</Badge> : null}
            {domaineName ? <Badge className="bg-dore/20 text-brun">{domaineName}</Badge> : null}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={isResponding}
          onClick={() => onDecline(mission.id)}
          className="shrink-0 border-bordeaux/30 text-bordeaux hover:bg-bordeaux/10"
        >
          Finalement, je veux décliner cette mission
        </Button>
      </CardHeader>
      <CardContent>
        <ChecklistWidget ownerType="mission" ownerId={mission.id} />
      </CardContent>
    </Card>
  )
}
