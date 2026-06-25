import { FileText, Package } from "lucide-react"

import type { DocumentItem, LogistiqueItem, Person } from "@/types/domain"
import { Card, CardContent } from "@/components/ui/card"
import { ContactQuickActions } from "@/components/shared/ContactQuickActions"
import { ChecklistWidget } from "@/components/shared/ChecklistWidget"

interface LogistiqueItemCardProps {
  item: LogistiqueItem
  responsable?: Person
  documents: DocumentItem[]
}

export function LogistiqueItemCard({ item, responsable, documents }: LogistiqueItemCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-foreground">{item.name}</p>
          {item.quantity ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="size-3.5" />
              {item.quantity} {item.unit}
            </span>
          ) : null}
        </div>
        {item.notes ? <p className="text-sm text-muted-foreground">{item.notes}</p> : null}

        {responsable ? (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Responsable : {responsable.fullName}</p>
            <ContactQuickActions phone={responsable.phone} />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Aucun responsable assigné</p>
        )}

        <ChecklistWidget ownerType="logistique_item" ownerId={item.id} />

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
      </CardContent>
    </Card>
  )
}
