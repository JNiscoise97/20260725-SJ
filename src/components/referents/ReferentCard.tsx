import { FileText } from "lucide-react"

import type { DocumentItem, Domaine, Identity, Mission, Person } from "@/types/domain"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ContactQuickActions } from "@/components/shared/ContactQuickActions"
import { ChecklistWidget } from "@/components/shared/ChecklistWidget"
import { StatusBadge } from "@/components/shared/StatusBadge"

interface ReferentCardProps {
  identity: Identity
  domaines: Domaine[]
  missions: Mission[]
  contacts: Person[]
  documents: DocumentItem[]
  openItemCount: number
}

function initials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ReferentCard({ identity, domaines, missions, contacts, documents, openItemCount }: ReferentCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            {initials(identity.fullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">{identity.fullName}</p>
          {domaines.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {domaines.map((domaine) => (
                <Badge key={domaine.id} className="bg-dore/20 text-brun">
                  {domaine.name}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ContactQuickActions phone={identity.phone} />

        {missions.length > 0 ? (
          <div className="space-y-2">
            {missions.map((mission) => (
              <div key={mission.id} className="space-y-1 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{mission.title}</p>
                  <StatusBadge status={mission.status} />
                </div>
                {mission.description ? (
                  <p className="text-xs text-muted-foreground">{mission.description}</p>
                ) : null}
                <ChecklistWidget ownerType="mission" ownerId={mission.id} />
              </div>
            ))}
          </div>
        ) : null}

        <p className="text-xs text-muted-foreground">
          Charge estimée : {openItemCount} item{openItemCount === 1 ? "" : "s"} en cours
        </p>

        {documents.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Documents utiles</p>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 text-sm text-foreground">
                <FileText className="size-3.5 text-muted-foreground" />
                {doc.title}
              </div>
            ))}
          </div>
        ) : null}

        {contacts.length > 0 ? (
          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">Interlocuteur principal</p>
            {contacts.map((contact) => (
              <div key={contact.id} className="space-y-1">
                <span className="text-sm text-foreground">{contact.fullName}</span>
                <ContactQuickActions phone={contact.phone} />
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
