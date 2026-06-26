import type { Domaine } from "@/types/domain"

export const domainesSeed: Domaine[] = [
  { id: "rc-decoration", poleId: "pole-decoration", name: "Décoration", slug: "decoration", icon: "Flower2", color: "var(--dore)", sortOrder: 1 },
  { id: "rc-boissons", poleId: "pole-logistique", name: "Boissons", slug: "boissons", icon: "GlassWater", color: "var(--bordeaux)", sortOrder: 2 },
  { id: "rc-dj", poleId: "pole-decoration", name: "DJ", slug: "dj", icon: "Music", color: "var(--brun)", sortOrder: 3 },
  { id: "rc-accueil", poleId: "pole-accueil", name: "Accueil", slug: "accueil", icon: "DoorOpen", color: "var(--vert-vegetal)", sortOrder: 4 },
  { id: "rc-parking", poleId: "pole-logistique", name: "Parking", slug: "parking", icon: "ParkingSquare", color: "var(--brun)", sortOrder: 5 },
  { id: "rc-photos", poleId: "pole-ceremonie", name: "Photos", slug: "photos", icon: "Camera", color: "var(--dore)", sortOrder: 6 },
]
