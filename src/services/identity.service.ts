import type { Guest, Identity } from "@/types/domain"
import { peopleService } from "@/services/people.service"
import { guestsService } from "@/services/guests.service"

/**
 * La notion de "référent" est purement fonctionnelle (avoir des domaines
 * assignés) et n'a aucun impact sur l'authentification. Tous les invités
 * se connectent avec le rôle "invite" ; l'accès aux onglets est contrôlé
 * exclusivement via `allowedTabs` (voir GuestTabsManager).
 * Le champ `assignable` est transmis dans l'identité pour adapter l'UI
 * (ex. redirection dashboard → ma-mission le jour J).
 */
function guestToIdentity(guest: Guest): Identity | null {
  if (!guest.isActive) return null
  return {
    id: guest.id,
    fullName: guest.fullName,
    role: "invite",
    accessCode: guest.accessCode ?? "",
    isActive: guest.isActive,
    mealChoice: guest.mealChoice,
    dietaryConstraints: guest.dietaryConstraints,
    allergies: guest.allergies,
    introductionSeen: guest.introductionSeen,
    allowedTabs: guest.allowedTabs ?? null,
    assignable: guest.assignable,
  }
}

export const identityService = {
  async resolveByAccessCode(code: string): Promise<Identity | null> {
    const person = await peopleService.resolveByAccessCode(code)
    if (person) return person
    const guest = await guestsService.resolveByAccessCode(code)
    return guest ? guestToIdentity(guest) : null
  },
  async getById(id: string): Promise<Identity | null> {
    const person = await peopleService.getById(id)
    if (person) return person
    const guest = await guestsService.getById(id)
    return guest ? guestToIdentity(guest) : null
  },
}
