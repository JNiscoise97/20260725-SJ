import { Link } from "react-router-dom"
import { ClipboardCheck } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { EventConfigForm } from "@/components/parametres/EventConfigForm"
import { ParametresTree } from "@/components/parametres/ParametresTree"
import { SeatingTablesManager } from "@/components/parametres/SeatingTablesManager"
import { PersonManager } from "@/components/parametres/PersonManager"

export function ParametresPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Pôles, domaines, missions, personnes et configuration de l'événement."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to="/parametres/revue-contenu">
              <ClipboardCheck className="size-4" />
              Revue de contenu
            </Link>
          </Button>
        }
      />

      <EventConfigForm />
      <ParametresTree />
      <SeatingTablesManager />
      <PersonManager />
    </div>
  )
}
