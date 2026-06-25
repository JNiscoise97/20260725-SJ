import type { Person } from "@/types/domain"

export const peopleSeed: Person[] = [
  {
    id: "p-sarah",
    fullName: "Sarah",
    role: "fiance",
    accessCode: "SARAH2026",
    isActive: true,
    phone: "+33600000001",
  },
  {
    id: "p-jordan",
    fullName: "Jordan",
    role: "fiance",
    accessCode: "JORDAN2026",
    isActive: true,
    phone: "+33600000002",
  },
  {
    id: "p-ref-deco",
    fullName: "Camille",
    role: "referent",
    accessCode: "DECO2026",
    isActive: true,
    phone: "+33600000003",
  },
  {
    id: "p-ref-boissons",
    fullName: "Hugo",
    role: "referent",
    accessCode: "BOISSON2026",
    isActive: true,
    phone: "+33600000004",
  },
  {
    id: "p-ref-dj",
    fullName: "Nina",
    role: "referent",
    accessCode: "DJ2026",
    isActive: true,
    phone: "+33600000005",
  },
  {
    id: "p-proche-1",
    fullName: "Léa",
    role: "proche",
    accessCode: "LEA2026",
    isActive: true,
    phone: "+33600000006",
  },
]
