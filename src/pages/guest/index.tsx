import { Info } from "lucide-react"

import { EVENT_NAME } from "@/lib/constants"
import { EmptyState } from "@/components/shared/EmptyState"

export function GuestInfoPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-10">
      <div className="space-y-1 text-center">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{EVENT_NAME}</h1>
        <p className="text-sm text-muted-foreground">Informations pratiques pour les invités.</p>
      </div>
      <EmptyState
        icon={Info}
        title="Informations à venir"
        description="Horaires, plan d'accès, hébergements et infos utiles seront bientôt disponibles ici."
      />
    </div>
  )
}
