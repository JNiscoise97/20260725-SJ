import type { Checklist, ChecklistItem } from "@/types/domain"

export const checklistsSeed: Checklist[] = [
  { id: "cl-decoration", ownerType: "mission", ownerId: "m-decoration", title: "Checklist décoration" },
  { id: "cl-boissons", ownerType: "mission", ownerId: "m-boissons", title: "Checklist boissons" },
]

export const checklistItemsSeed: ChecklistItem[] = [
  { id: "cli-1", checklistId: "cl-decoration", label: "Choisir les couleurs", isDone: true, sortOrder: 1 },
  { id: "cli-2", checklistId: "cl-decoration", label: "Commander les fleurs", isDone: false, sortOrder: 2 },
  { id: "cli-3", checklistId: "cl-decoration", label: "Installer la déco le matin", isDone: false, sortOrder: 3 },
  { id: "cli-4", checklistId: "cl-boissons", label: "Lister les boissons", isDone: true, sortOrder: 1 },
  { id: "cli-5", checklistId: "cl-boissons", label: "Commander", isDone: false, sortOrder: 2 },
  { id: "cli-6", checklistId: "cl-boissons", label: "Prévoir les glaçons", isDone: false, sortOrder: 3 },
]
