import { useMemo } from "react"

import type { Identity } from "@/types/domain"
import { usePeople } from "@/hooks/queries/use-people"
import { useGuests } from "@/hooks/queries/use-guests"
import { useDomaineResponsables } from "@/hooks/queries/use-domaine-responsables"

export interface ResponsableEntry {
  identity: Identity
  domaineIds: string[]
}

/**
 * Un responsable par domaine peut être un fiancé (Person, déjà au format
 * Identity) ou un invité délégué (Guest, qui "devient référent" par cette
 * affectation — voir identity.service.ts pour la même règle côté auth).
 * Dédupliqué par identité : un responsable de plusieurs domaines n'apparaît
 * qu'une fois, avec la liste de ses domaines.
 */
export function useResponsableEntries() {
  const { data: people, isLoading: peopleLoading } = usePeople()
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: responsables, isLoading: responsablesLoading } = useDomaineResponsables()

  const isLoading = peopleLoading || guestsLoading || responsablesLoading

  const entries = useMemo<ResponsableEntry[]>(() => {
    if (!people || !guests || !responsables) return []
    const byIdentityId = new Map<string, ResponsableEntry>()
    for (const r of responsables) {
      let identity: Identity | null = null
      if (r.personId) {
        identity = people.find((p) => p.id === r.personId) ?? null
      } else if (r.guestId) {
        const guest = guests.find((g) => g.id === r.guestId)
        identity = guest
          ? {
              id: guest.id,
              fullName: guest.fullName,
              role: "referent",
              accessCode: guest.accessCode ?? "",
              isActive: guest.isActive ?? true,
              mealChoice: guest.mealChoice,
              dietaryConstraints: guest.dietaryConstraints,
              allergies: guest.allergies,
            }
          : null
      }
      if (!identity) continue
      const existing = byIdentityId.get(identity.id)
      if (existing) existing.domaineIds.push(r.domaineId)
      else byIdentityId.set(identity.id, { identity, domaineIds: [r.domaineId] })
    }
    return [...byIdentityId.values()]
  }, [people, guests, responsables])

  return { isLoading, entries }
}
