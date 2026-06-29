import type { Mission } from "@/types/domain"

export const missionsSeed: Mission[] = [
  {
    id: "m-decoration",
    domaineId: "rc-decoration",
    title: "Décoration de la salle",
    description: "Nappes, centres de table, arche florale",
    status: "in_progress",
    sortOrder: 0,
  },
  {
    id: "m-boissons",
    domaineId: "rc-boissons",
    title: "Bar et boissons",
    description: "Commande, glace, verres, stock",
    status: "todo",
    sortOrder: 0,
  },
  {
    id: "m-dj",
    domaineId: "rc-dj",
    title: "Playlist et sonorisation",
    description: "Playlist, matériel son, micro pour les discours",
    status: "todo",
    sortOrder: 0,
  },
]
