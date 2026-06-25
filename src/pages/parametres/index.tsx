import { PageHeader } from "@/components/shared/PageHeader"
import { EventConfigForm } from "@/components/parametres/EventConfigForm"
import { RoleCategoryManager } from "@/components/parametres/RoleCategoryManager"
import { PersonManager } from "@/components/parametres/PersonManager"

export function ParametresPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Catégories de référents, personnes et configuration de l'événement."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EventConfigForm />
        <RoleCategoryManager />
      </div>

      <PersonManager />
    </div>
  )
}
