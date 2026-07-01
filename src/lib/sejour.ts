import type { Guest } from "@/types/domain"

export const ACCOMMODATION_LABELS: Record<NonNullable<Guest["accommodationType"]>, string> = {
  quartier: "Chez quelqu'un",
  hotel: "Hôtel",
  airbnb: "Airbnb",
}

export const TRAVEL_MODE_LABELS: Record<NonNullable<Guest["travelMode"]>, string> = {
  train: "Train",
  avion: "Avion",
  voiture: "Voiture",
  bus: "Bus",
}
