import type { RoleCategory } from "@/types/domain"

export const roleCategoriesSeed: RoleCategory[] = [
  { id: "rc-decoration", name: "Décoration", slug: "decoration", icon: "Flower2", color: "var(--dore)", sortOrder: 1 },
  { id: "rc-boissons", name: "Boissons", slug: "boissons", icon: "GlassWater", color: "var(--bordeaux)", sortOrder: 2 },
  { id: "rc-dj", name: "DJ", slug: "dj", icon: "Music", color: "var(--brun)", sortOrder: 3 },
  { id: "rc-accueil", name: "Accueil", slug: "accueil", icon: "DoorOpen", color: "var(--vert-vegetal)", sortOrder: 4 },
  { id: "rc-parking", name: "Parking", slug: "parking", icon: "ParkingSquare", color: "var(--brun)", sortOrder: 5 },
  { id: "rc-photos", name: "Photos", slug: "photos", icon: "Camera", color: "var(--dore)", sortOrder: 6 },
]
