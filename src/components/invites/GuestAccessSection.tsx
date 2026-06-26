import { useState } from "react"
import { toast } from "sonner"

import type { Guest } from "@/types/domain"
import { useUpdateGuest } from "@/hooks/queries/use-guests"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

interface GuestAccessSectionProps {
  guest: Guest
}

/**
 * Donne (ou retire) l'accès à l'app à un invité via un code d'accès. Tout
 * invité actif avec un code valide se connecte (accès limité, voir
 * identity.service.ts) ; pour le faire référent d'un domaine, voir Paramètres
 * > Domaines (l'icône responsable), qui ne dépend pas de ce code.
 */
export function GuestAccessSection({ guest }: GuestAccessSectionProps) {
  const [accessCode, setAccessCode] = useState("")
  const updateGuest = useUpdateGuest()

  async function handleSubmit() {
    if (!accessCode.trim()) return
    const patch: Partial<Guest> = { accessCode: accessCode.trim() }
    if (guest.isActive === false) patch.isActive = true
    await updateGuest.mutateAsync({ id: guest.id, patch })
    toast.success("Accès mis à jour.")
    setAccessCode("")
  }

  return (
    <div className="space-y-0.5 rounded-2xl border border-border/60 p-4">
      <p className="pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Accès à l&apos;app</p>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="guest-access-code">Code d&apos;accès</FieldLabel>
          <Input
            id="guest-access-code"
            placeholder="Ex. PAPA1948"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
          />
        </Field>
      </FieldGroup>
      <div className="pt-3">
        <Button size="sm" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </div>
    </div>
  )
}
