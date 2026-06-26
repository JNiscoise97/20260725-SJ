import type { Guest, GuestGroup, SeatingTable, TableAssignment } from "@/types/domain"

export const guestGroupsSeed: GuestGroup[] = [
  { id: "gg-bluker", familyName: "Famille Bluker" },
  { id: "gg-martin", familyName: "Famille Martin" },
  { id: "gg-amis", familyName: "Amis" },
]

const guestDefaults = {
  hasVehicle: false,
  needsLateTransport: false,
  isReducedMobility: false,
  isChild: false,
  inCortege: false,
  communicationJ30Sent: false,
  communicationJ15Sent: false,
  communicationJ3Sent: false,
  mealMessageSent: false,
  needsAccommodation: false,
  guideSent: false,
  addressChangeSent: false,
  reservationDone: false,
  hasCeremonialRole: false,
  likelyTraditionalAttire: false,
}

function guest(firstName: string, lastName: string, rest: Omit<Guest, "id" | "firstName" | "lastName" | "fullName" | keyof typeof guestDefaults> & { id: string }): Guest {
  return { firstName, lastName, fullName: `${firstName} ${lastName}`, ...guestDefaults, ...rest }
}

export const guestsSeed: Guest[] = [
  guest("Paul", "Bluker", { id: "g-paul", groupId: "gg-bluker", rsvpStatus: "confirmed" }),
  guest("Claire", "Bluker", { id: "g-claire", groupId: "gg-bluker", rsvpStatus: "confirmed", dietaryConstraints: "Végétarienne" }),
  guest("Anne", "Martin", { id: "g-anne", groupId: "gg-martin", rsvpStatus: "confirmed" }),
  guest("Marc", "Martin", { id: "g-marc", groupId: "gg-martin", rsvpStatus: "pending" }),
  guest("Inès", "Dupont", { id: "g-ines", groupId: "gg-amis", rsvpStatus: "confirmed", dietaryConstraints: "Sans gluten" }),
  guest("Yanis", "Cohen", { id: "g-yanis", groupId: "gg-amis", rsvpStatus: "declined" }),
  guest("Sofia", "Rossi", { id: "g-sofia", groupId: "gg-amis", rsvpStatus: "confirmed" }),
  guest("Karim", "Haddad", { id: "g-karim", groupId: "gg-amis", rsvpStatus: "pending" }),
  // Invités avec un accès à l'app : Camille/Hugo/Nina sont référents (voir domaine-responsables.ts), Léa a un accès simple.
  guest("Camille", "Rivière", { id: "g-ref-deco", groupId: "gg-amis", rsvpStatus: "confirmed", accessCode: "DECO2026", isActive: true }),
  guest("Hugo", "Lenoir", { id: "g-ref-boissons", groupId: "gg-amis", rsvpStatus: "confirmed", accessCode: "BOISSON2026", isActive: true }),
  guest("Nina", "Castel", { id: "g-ref-dj", groupId: "gg-amis", rsvpStatus: "confirmed", accessCode: "DJ2026", isActive: true }),
  guest("Léa", "Fontaine", { id: "g-proche-1", groupId: "gg-amis", rsvpStatus: "confirmed", accessCode: "LEA2026", isActive: true }),
]

export const tablesSeed: SeatingTable[] = [
  { id: "tb-1", name: "Table 1", capacity: 8 },
  { id: "tb-2", name: "Table 2", capacity: 6 },
]

export const tableAssignmentsSeed: TableAssignment[] = [
  { id: "ta-1", tableId: "tb-1", guestId: "g-paul", seatNumber: 1 },
  { id: "ta-2", tableId: "tb-1", guestId: "g-claire", seatNumber: 2 },
  { id: "ta-3", tableId: "tb-1", guestId: "g-anne", seatNumber: 3 },
  { id: "ta-4", tableId: "tb-2", guestId: "g-ines", seatNumber: 1 },
]
