export type AppRole = "fiance" | "referent" | "invite"

/**
 * Réservée à Sarah & Jordan : ce n'est pas une table d'identité générique.
 * Les référents sont des `Guest` affectés à un domaine (voir
 * `domaine_responsables`) — on fait la jointure plutôt que de dupliquer leurs
 * infos ici.
 */
export interface Person {
  id: string
  fullName: string
  phone?: string
  role: "fiance"
  accessCode: string
  avatarUrl?: string | null
  isActive: boolean
  /** Pertinent pour les fiancés : pris en compte dans le comptage repas (page Nourriture). */
  mealChoice?: MealChoice | null
  dietaryConstraints?: string | null
  allergies?: string | null
}

/** Forme unifiée de l'identité connectée, que la personne soit un fiancé (Person) ou un invité délégué (Guest). */
export interface Identity {
  id: string
  fullName: string
  phone?: string | null
  role: AppRole
  accessCode: string
  avatarUrl?: string | null
  isActive: boolean
  mealChoice?: MealChoice | null
  dietaryConstraints?: string | null
  allergies?: string | null
  /** Toujours `undefined` pour un fiancé (Person) — seuls les invités (Guest) ont une page d'introduction à voir. */
  introductionSeen?: boolean
}

export interface Pole {
  id: string
  name: string
  sortOrder: number
  /** Responsable global de tout le pôle — uniquement un fiancé, voir 0042_poles_responsible_person.sql. */
  responsiblePersonId?: string | null
}

export type DomainePhase = "avant" | "installation" | "jour_j" | "desinstallation" | "apres"

export interface Domaine {
  id: string
  poleId?: string | null
  name: string
  slug: string
  description?: string | null
  phase?: DomainePhase | null
  icon?: string
  color?: string
  sortOrder: number
  solicitedMilestone?: PlanningMilestone | null
  preferredContactId?: string | null
}

/** Un responsable de domaine est soit un fiancé (`personId`), soit un invité de confiance qui en devient "référent" (`guestId`) — jamais les deux. */
export interface DomaineResponsable {
  id: string
  domaineId: string
  personId?: string | null
  guestId?: string | null
  rank: "principal" | "secondaire"
}

export type ProgressStatus = "todo" | "in_progress" | "done" | "blocked"
export type Priority = "low" | "normal" | "high" | "urgent"

export interface Mission {
  id: string
  domaineId?: string | null
  title: string
  description?: string | null
  prerequisites?: string | null
  status: ProgressStatus
  sortOrder: number
}

export type MissionAcceptanceStatus = "pending" | "accepted" | "declined"

/** Réponse d'un invité référent/proche à une mission qui lui est confiée (voir page "Rôle"). */
export interface MissionAcceptance {
  id: string
  missionId: string
  guestId: string
  status: MissionAcceptanceStatus
  respondedAt?: string | null
}

export type ChecklistOwnerType = "mission" | "logistique_item" | "domaine"

export interface Checklist {
  id: string
  ownerType: ChecklistOwnerType
  ownerId?: string | null
  title?: string | null
  /** Délégation fiancé à fiancé d'une checklist entière — voir 0040_checklists_responsible_person.sql. */
  responsiblePersonId?: string | null
}

export interface ChecklistItem {
  id: string
  checklistId: string
  label: string
  isDone: boolean
  sortOrder: number
  priority: Priority
  status: ProgressStatus
  estimatedStartDate?: string | null
  estimatedStartTime?: string | null
  estimatedEndDate?: string | null
  estimatedEndTime?: string | null
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
  isHighlight: boolean
  responsibleIds: string[]
}

export interface LogistiqueItem {
  id: string
  domaineId?: string | null
  name: string
  responsableId?: string | null
  quantity?: number | null
  unit?: string | null
  notes?: string | null
}

export type RsvpStatus = "pending" | "confirmed" | "declined"

export type MealChoice = "poulet" | "poisson" | "enfant"

export type GuestSide = "sarah" | "jordan"

export interface GuestGroup {
  id: string
  familyName: string
  notes?: string | null
  sortOrder: number
}

export interface Guest {
  id: string
  groupId?: string | null
  firstName: string
  lastName: string
  /** Dérivé de firstName + lastName, en lecture uniquement. */
  fullName: string
  rsvpStatus: RsvpStatus
  dietaryConstraints?: string | null
  mealChoice?: MealChoice | null
  arrivalInfo?: string | null
  accommodation?: string | null
  hasVehicle: boolean
  needsLateTransport: boolean
  isReducedMobility: boolean
  isChild: boolean
  childAge?: number | null
  inCortege: boolean
  communicationJ30Sent: boolean
  communicationJ15Sent: boolean
  communicationJ3Sent: boolean
  side?: GuestSide | null
  ageRange?: string | null
  relationCategory?: string | null
  city?: string | null
  mealMessageSent: boolean
  rsvpRespondedAt?: string | null
  rsvpChannel?: string | null
  needsAccommodation: boolean
  guideSent: boolean
  addressChangeSent: boolean
  reservationDone: boolean
  allergies?: string | null
  drinksAlcohol?: boolean | null
  culturalOrigin?: string | null
  primaryLanguage?: string | null
  hasCeremonialRole: boolean
  likelyTraditionalAttire: boolean
  notes?: string | null
  /** Présent uniquement à l'écriture (code en clair saisi dans l'UI) — jamais relu depuis Supabase, voir `services/supabase/guests.ts`. */
  accessCode?: string | null
  isActive?: boolean
  /** A déjà vu la page Introduction (mot de Sarah & Jordan) lors d'une connexion précédente. */
  introductionSeen?: boolean
  /** Proposé comme candidat responsable de domaine dans Paramètres — voir 0043_guests_assignable.sql. */
  assignable: boolean
  /** Lien symétrique vers l'autre invité d'une paire "inséparable" (ex. couple) — voir 0045_guests_paired_with.sql. Toujours mis à jour des deux côtés ensemble. */
  pairedWithId?: string | null
  /** Horodatage de pointage à l'accueil le jour J, null si pas encore arrivé — voir 0047_guests_checked_in_at.sql. */
  checkedInAt?: string | null
  /** Invité ajouté sur place à l'accueil, absent de la liste prévue — voir 0048_guests_unexpected.sql. */
  isUnexpected?: boolean
}

export type PhotoGroupStatus = "pending" | "done" | "skipped"

/** Un groupe de photo de mariage : les fiancés sont implicitement sur chaque photo, `label` décrit le reste du groupe (ex. "Famille proche de Sarah") — voir 0046_photo_groups.sql. */
export interface PhotoGroup {
  id: string
  label: string
  sortOrder: number
  isPriority: boolean
  status: PhotoGroupStatus
  notes?: string | null
}

/** Invité attendu sur un groupe de photo — `isPresent` est coché en direct le jour J, indépendamment du statut (faite/passée) du groupe. */
export interface PhotoGroupMember {
  id: string
  photoGroupId: string
  guestId: string
  isPresent: boolean
}

export interface Prestataire {
  id: string
  name: string
  company?: string | null
  role?: string | null
  /** Doit-il être nourri ? (ex. photographe et vidéaste de la même société, même devis). */
  needsMeal: boolean
  mealChoice?: MealChoice | null
  dietaryConstraints?: string | null
  allergies?: string | null
  notes?: string | null
}

export interface SeatingTable {
  id: string
  name: string
  capacity: number
  sortOrder: number
}

/** Le siège est attribué à un invité, un fiancé ou un prestataire — jamais plusieurs à la fois. */
export interface TableAssignment {
  id: string
  tableId: string
  guestId?: string | null
  personId?: string | null
  prestataireId?: string | null
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
