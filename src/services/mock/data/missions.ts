import type { Mission } from "@/types/domain"

export const missionsSeed: Mission[] = [
  {
    id: "m-decoration",
    roleCategoryId: "rc-decoration",
    referentId: "p-ref-deco",
    title: "Décoration de la salle",
    description: "Nappes, centres de table, arche florale",
    status: "in_progress",
  },
  {
    id: "m-boissons",
    roleCategoryId: "rc-boissons",
    referentId: "p-ref-boissons",
    title: "Bar et boissons",
    description: "Commande, glace, verres, stock",
    status: "todo",
  },
  {
    id: "m-dj",
    roleCategoryId: "rc-dj",
    referentId: "p-ref-dj",
    title: "Playlist et sonorisation",
    description: "Playlist, matériel son, micro pour les discours",
    status: "todo",
  },
]
