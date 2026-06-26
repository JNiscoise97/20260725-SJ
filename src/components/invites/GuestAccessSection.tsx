import { useState } from "react"
import { toast } from "sonner"

import type { Guest } from "@/types/domain"
import { useUpdateGuest } from "@/hooks/queries/use-guests"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const NONE = "__none__"

const STATUS_LABELS: Record<string, string> = {
  [NONE]: "Aucun (invité ordinaire)",
  referent: "Référent (délégué sur un domaine)",
  proche: "Proche",
  invite: "Invité avec accès",
}

interface GuestAccessSectionProps {
  guest: Guest
}

/**
 * Donne (ou retire) l'accès à l'app à un invité. Nécessaire pour les
 * référents délégués via Paramètres > Domaines : le statut seul ne suffit
 * pas à se connecter, il faut aussi un code d'accès (voir identity.service.ts).
 */
export function GuestAccessSection({ guest }: GuestAccessSectionProps) {
  const [status, setStatus] = useState(guest.status ?? NONE)
  const [accessCode, setAccessCode] = useState("")
  const updateGuest = useUpdateGuest()

  async function handleSubmit() {
    const patch: Partial<Guest> = {
      status: status === NONE ? null : (status as Guest["status"]),
    }
    if (guest.isActive === false) patch.isActive = true
    if (accessCode.trim()) patch.accessCode = accessCode.trim()
    await updateGuest.mutateAsync({ id: guest.id, patch })
    toast.success("Accès mis à jour.")
    setAccessCode("")
  }

  return (
    <div className="space-y-0.5 rounded-2xl border border-border/60 p-4">
      <p className="pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Accès à l&apos;app</p>
      <FieldGroup>
        <Field>
          <FieldLabel>Statut</FieldLabel>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="guest-access-code">Code d&apos;accès</FieldLabel>
          <Input
            id="guest-access-code"
            placeholder={guest.status ? "Laisser vide pour ne pas changer le code" : "Ex. PAPA1948"}
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
