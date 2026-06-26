import type { Mission, MissionAcceptanceStatus } from "@/types/domain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface MissionApprovalCardProps {
  mission: Mission
  domaineName?: string
  poleName?: string
  responsableNames: string[]
  status: MissionAcceptanceStatus
  isResponding: boolean
  onRespond: (missionId: string, accept: boolean) => void
}

export function MissionApprovalCard({
  mission,
  domaineName,
  poleName,
  responsableNames,
  status,
  isResponding,
  onRespond,
}: MissionApprovalCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="font-heading text-base">{mission.title}</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {poleName ? <Badge className="bg-muted text-muted-foreground">{poleName}</Badge> : null}
          {domaineName ? <Badge className="bg-dore/20 text-brun">{domaineName}</Badge> : null}
        </div>
        {responsableNames.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Responsable{responsableNames.length > 1 ? "s" : ""} : {responsableNames.join(", ")}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {mission.description ? (
          <p className="text-sm whitespace-pre-line text-foreground">{mission.description}</p>
        ) : null}
        {mission.prerequisites ? (
          <div className="space-y-1 rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Prérequis</p>
            <p className="text-sm whitespace-pre-line text-foreground">{mission.prerequisites}</p>
          </div>
        ) : null}

        {status === "declined" ? (
          <Badge className="bg-bordeaux/10 text-bordeaux">Vous avez décliné cette mission</Badge>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button disabled={isResponding} onClick={() => onRespond(mission.id, true)}>
            J'accepte cette mission
          </Button>
          <Button
            variant="outline"
            disabled={isResponding}
            onClick={() => onRespond(mission.id, false)}
            className="border-bordeaux/30 text-bordeaux hover:bg-bordeaux/10"
          >
            Je décline cette mission
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
