import { Link } from "react-router-dom"
import { ClipboardCheck } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { EventConfigForm } from "@/components/parametres/EventConfigForm"
import { ParametresTree } from "@/components/parametres/ParametresTree"
import { SeatingTablesManager } from "@/components/parametres/SeatingTablesManager"
import { PhotoGroupsManager } from "@/components/parametres/PhotoGroupsManager"
import { PersonManager } from "@/components/parametres/PersonManager"
import { ResetIntroductionSeenButton } from "@/components/parametres/ResetIntroductionSeenButton"

export function ParametresPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Pôles, domaines, missions, personnes et configuration de l'événement."
        actions={
          <div className="flex items-center gap-2">
            <ResetIntroductionSeenButton />
            <Button variant="outline" size="sm" asChild>
              <Link to="/parametres/revue-contenu">
                <ClipboardCheck className="size-4" />
                Revue de contenu
              </Link>
            </Button>
          </div>
        }
      />

      <EventConfigForm />
      <ParametresTree />
      <PhotoGroupsManager />
      <SeatingTablesManager />
      <PersonManager />
    </div>
  )
}
