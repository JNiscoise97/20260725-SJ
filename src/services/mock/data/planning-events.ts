import type { PlanningEvent } from "@/types/domain"

export const planningEventsSeed: PlanningEvent[] = [
  {
    id: "pe-1",
    milestone: "j_moins_30",
    title: "Finaliser le traiteur",
    description: "Signature du contrat traiteur",
    startsAt: "2026-06-25T09:00:00+02:00",
  },
  {
    id: "pe-2",
    milestone: "j_moins_15",
    title: "Confirmer les prestataires",
    description: "DJ, photographe, fleuriste",
    startsAt: "2026-07-10T09:00:00+02:00",
  },
  {
    id: "pe-3",
    milestone: "j_moins_7",
    title: "Récupérer la décoration",
    location: "Chez le fleuriste",
    startsAt: "2026-07-18T09:00:00+02:00",
  },
  {
    id: "pe-4",
    milestone: "j_moins_1",
    title: "Installation de la salle",
    description: "Montage déco, sonorisation, tables",
    location: "Salle de réception",
    startsAt: "2026-07-24T14:00:00+02:00",
  },
  {
    id: "pe-5",
    milestone: "jour_j",
    title: "Cérémonie des fiançailles",
    location: "Salle de réception",
    startsAt: "2026-07-25T17:00:00+02:00",
  },
  {
    id: "pe-6",
    milestone: "j_plus_1",
    title: "Rangement et retours matériel",
    location: "Salle de réception",
    startsAt: "2026-07-26T10:00:00+02:00",
  },
]
