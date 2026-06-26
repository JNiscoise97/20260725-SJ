import type { Mission } from "@/types/domain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DeclinedMissionCardProps {
  mission: Mission
  domaineName?: string
  poleName?: string
  isResponding: boolean
  onAccept: (missionId: string) => void
}

export function DeclinedMissionCard({
  mission,
  domaineName,
  poleName,
  isResponding,
  onAccept,
}: DeclinedMissionCardProps) {
  return (
    <Card className="opacity-80">
      <CardHeader className="space-y-2">
        <CardTitle className="font-heading text-base">{mission.title}</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {poleName ? <Badge className="bg-muted text-muted-foreground">{poleName}</Badge> : null}
          {domaineName ? <Badge className="bg-dore/20 text-brun">{domaineName}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge className="bg-bordeaux/10 text-bordeaux">Mission déclinée</Badge>
        <div>
          <Button size="sm" disabled={isResponding} onClick={() => onAccept(mission.id)}>
            Finalement, je veux accepter cette mission
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
