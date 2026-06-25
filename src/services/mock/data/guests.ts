import type { Guest, GuestGroup, SeatingTable, TableAssignment } from "@/types/domain"

export const guestGroupsSeed: GuestGroup[] = [
  { id: "gg-bluker", familyName: "Famille Bluker" },
  { id: "gg-martin", familyName: "Famille Martin" },
  { id: "gg-amis", familyName: "Amis" },
]

export const guestsSeed: Guest[] = [
  { id: "g-paul", groupId: "gg-bluker", fullName: "Paul Bluker", phone: "+33600000010", rsvpStatus: "confirmed", plusOne: false },
  { id: "g-claire", groupId: "gg-bluker", fullName: "Claire Bluker", phone: "+33600000011", rsvpStatus: "confirmed", dietaryConstraints: "Végétarienne", plusOne: false },
  { id: "g-anne", groupId: "gg-martin", fullName: "Anne Martin", phone: "+33600000012", rsvpStatus: "confirmed", plusOne: true },
  { id: "g-marc", groupId: "gg-martin", fullName: "Marc Martin", phone: "+33600000013", rsvpStatus: "pending", plusOne: false },
  { id: "g-ines", groupId: "gg-amis", fullName: "Inès Dupont", phone: "+33600000014", rsvpStatus: "confirmed", dietaryConstraints: "Sans gluten", plusOne: false },
  { id: "g-yanis", groupId: "gg-amis", fullName: "Yanis Cohen", phone: "+33600000015", rsvpStatus: "declined", plusOne: false },
  { id: "g-sofia", groupId: "gg-amis", fullName: "Sofia Rossi", phone: "+33600000016", rsvpStatus: "confirmed", plusOne: true },
  { id: "g-karim", groupId: "gg-amis", fullName: "Karim Haddad", phone: "+33600000017", rsvpStatus: "pending", plusOne: false },
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
