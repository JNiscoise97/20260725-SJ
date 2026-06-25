import type { RunOfShowStep } from "@/types/domain"

export const runOfShowStepsSeed: RunOfShowStep[] = [
  {
    id: "rs-accueil",
    timeLabel: "17h00",
    startsAt: "2026-07-25T17:00:00+02:00",
    label: "Accueil",
    durationMinutes: 30,
    location: "Entrée",
    responsibleIds: ["p-ref-deco"],
  },
  {
    id: "rs-procession",
    timeLabel: "17h30",
    startsAt: "2026-07-25T17:30:00+02:00",
    label: "Procession",
    durationMinutes: 30,
    location: "Jardin",
    responsibleIds: [],
  },
  {
    id: "rs-demande",
    timeLabel: "18h00",
    startsAt: "2026-07-25T18:00:00+02:00",
    label: "Demande officielle",
    durationMinutes: 30,
    location: "Jardin",
    responsibleIds: [],
  },
  {
    id: "rs-bagues",
    timeLabel: "18h30",
    startsAt: "2026-07-25T18:30:00+02:00",
    label: "Échange des bagues",
    durationMinutes: 30,
    location: "Jardin",
    responsibleIds: [],
  },
  {
    id: "rs-cocktail",
    timeLabel: "19h00",
    startsAt: "2026-07-25T19:00:00+02:00",
    label: "Cocktail",
    durationMinutes: 90,
    location: "Terrasse",
    responsibleIds: ["p-ref-boissons"],
  },
]
