export type AppRole = "fiance" | "referent" | "proche" | "invite"

export interface Person {
  id: string
  fullName: string
  phone?: string
  role: AppRole
  accessCode: string
  avatarUrl?: string | null
  isActive: boolean
}

export interface RoleCategory {
  id: string
  name: string
  slug: string
  icon?: string
  color?: string
  sortOrder: number
  solicitedMilestone?: PlanningMilestone | null
  preferredContactId?: string | null
  primaryReferentId?: string | null
  secondaryReferentId?: string | null
}

export type ProgressStatus = "todo" | "in_progress" | "done" | "blocked"
export type TaskPriority = "low" | "normal" | "high" | "urgent"

export interface Mission {
  id: string
  roleCategoryId?: string | null
  referentId?: string | null
  title: string
  description?: string | null
  status: ProgressStatus
}

export interface Task {
  id: string
  missionId?: string | null
  title: string
  description?: string | null
  priority: TaskPriority
  status: ProgressStatus
  category?: string | null
  dueDate?: string | null
  dueTime?: string | null
  ownerId?: string | null
}

export type ChecklistOwnerType = "referent" | "mission" | "logistique_item" | "standalone"

export type ChecklistPhase = "avant" | "installation" | "evenement" | "desinstallation" | "apres"

export interface Checklist {
  id: string
  ownerType: ChecklistOwnerType
  ownerId?: string | null
  title: string
  phase?: ChecklistPhase | null
}

export interface ChecklistItem {
  id: string
  checklistId: string
  label: string
  isDone: boolean
  sortOrder: number
}

export type PlanningMilestone = "j_moins_30" | "j_moins_15" | "j_moins_7" | "j_moins_1" | "jour_j" | "j_plus_1"

export interface PlanningEvent {
  id: string
  milestone: PlanningMilestone
  title: string
  description?: string | null
  location?: string | null
  startsAt?: string | null
  endsAt?: string | null
}

export interface RunOfShowStep {
  id: string
  timeLabel: string
  startsAt?: string | null
  label: string
  durationMinutes?: number | null
  location?: string | null
  phase?: string | null
  music?: string | null
  notes?: string | null
  responsibleIds: string[]
}

export interface LogistiqueItem {
  id: string
  roleCategoryId?: string | null
  name: string
  responsableId?: string | null
  quantity?: number | null
  unit?: string | null
  notes?: string | null
}

export type RsvpStatus = "pending" | "confirmed" | "declined"

export interface GuestGroup {
  id: string
  familyName: string
  notes?: string | null
}

export interface Guest {
  id: string
  groupId?: string | null
  fullName: string
  phone?: string | null
  email?: string | null
  rsvpStatus: RsvpStatus
  dietaryConstraints?: string | null
  plusOne: boolean
}

export interface SeatingTable {
  id: string
  name: string
  capacity: number
}

export interface TableAssignment {
  id: string
  tableId: string
  guestId: string
  seatNumber?: number | null
}

export interface DocumentItem {
  id: string
  title: string
  category?: string | null
  fileName: string
  filePath: string
  visibleToRoles: AppRole[]
}
