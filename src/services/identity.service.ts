import type { Guest, Identity } from "@/types/domain"
import { peopleService } from "@/services/people.service"
import { guestsService } from "@/services/guests.service"
import { domaineResponsablesService } from "@/services/domaine-responsables.service"

/**
 * Un invité "devient référent" d'un domaine par affectation (voir
 * _20260725_domaine_responsables), pas par un attribut permanent : son rôle
 * effectif prime donc sur son `status` déclaratif s'il porte au moins une
 * responsabilité de domaine.
 */
async function guestToIdentity(guest: Guest): Promise<Identity | null> {
  if (!guest.isActive) return null
  const responsables = await domaineResponsablesService.list()
  const isResponsable = responsables.some((r) => r.guestId === guest.id)
  if (!guest.status && !isResponsable) return null
  return {
    id: guest.id,
    fullName: guest.fullName,
    role: isResponsable ? "referent" : (guest.status as Identity["role"]),
    accessCode: guest.accessCode ?? "",
    isActive: guest.isActive,
    mealChoice: guest.mealChoice,
    dietaryConstraints: guest.dietaryConstraints,
    allergies: guest.allergies,
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
