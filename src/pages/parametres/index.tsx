import { PageHeader } from "@/components/shared/PageHeader"
import { EventConfigForm } from "@/components/parametres/EventConfigForm"
import { ParametresTree } from "@/components/parametres/ParametresTree"
import { PersonManager } from "@/components/parametres/PersonManager"

export function ParametresPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Pôles, domaines, missions, personnes et configuration de l'événement."
      />

      <EventConfigForm />
      <ParametresTree />
      <PersonManager />
    </div>
  )
}
