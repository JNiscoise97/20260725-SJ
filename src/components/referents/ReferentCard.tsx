import { Users2, FileText } from "lucide-react"

import type { DocumentItem, Mission, Person, RoleCategory } from "@/types/domain"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ContactQuickActions } from "@/components/shared/ContactQuickActions"
import { ChecklistWidget } from "@/components/shared/ChecklistWidget"
import { StatusBadge } from "@/components/shared/StatusBadge"

interface ReferentCardProps {
  person: Person
  roleCategory?: RoleCategory
  mission?: Mission
  partner?: Person
  contacts: Person[]
  documents: DocumentItem[]
  openTaskCount: number
}

function initials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ReferentCard({
  person,
  roleCategory,
  mission,
  partner,
  contacts,
  documents,
  openTaskCount,
}: ReferentCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            {initials(person.fullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">{person.fullName}</p>
          {roleCategory ? (
            <Badge className="bg-dore/20 text-brun">{roleCategory.name}</Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ContactQuickActions phone={person.phone} />

        {mission ? (
          <div className="space-y-1 rounded-xl bg-muted/50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{mission.title}</p>
              <StatusBadge status={mission.status} />
            </div>
            {mission.description ? (
              <p className="text-xs text-muted-foreground">{mission.description}</p>
            ) : null}
          </div>
        ) : null}

        <p className="text-xs text-muted-foreground">
          Charge estimée : {openTaskCount} tâche{openTaskCount === 1 ? "" : "s"} en cours
        </p>

        {mission ? <ChecklistWidget ownerType="mission" ownerId={mission.id} /> : null}

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

        {partner ? (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Users2 className="size-3.5 text-muted-foreground" />
            Binôme : {partner.fullName}
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
