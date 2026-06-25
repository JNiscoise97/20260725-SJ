import type { LogistiqueItem } from "@/types/domain"

export const logistiqueItemsSeed: LogistiqueItem[] = [
  {
    id: "li-arche",
    roleCategoryId: "rc-decoration",
    name: "Arche florale",
    responsableId: "p-ref-deco",
    quantity: 1,
    unit: "pièce",
    notes: "À récupérer chez le fleuriste J-7",
  },
  {
    id: "li-champagne",
    roleCategoryId: "rc-boissons",
    name: "Champagne",
    responsableId: "p-ref-boissons",
    quantity: 24,
    unit: "bouteilles",
  },
  {
    id: "li-enceintes",
    roleCategoryId: "rc-dj",
    name: "Enceintes",
    responsableId: "p-ref-dj",
    quantity: 2,
    unit: "pièces",
    notes: "Prévoir micro pour les discours",
  },
  {
    id: "li-panneau",
    roleCategoryId: "rc-accueil",
    name: "Panneau de bienvenue",
    quantity: 1,
    unit: "pièce",
  },
  {
    id: "li-flechage",
    roleCategoryId: "rc-parking",
    name: "Fléchage parking",
    quantity: 6,
    unit: "pièces",
  },
  {
    id: "li-carte-memoire",
    roleCategoryId: "rc-photos",
    name: "Carte mémoire appareil photo",
    quantity: 2,
    unit: "pièces",
  },
]
