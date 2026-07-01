import {
  Heart,
  UserCheck,
  Home,
  ListChecks,
  ListTree,
  Users,
  CalendarRange,
  PartyPopper,
  Truck,
  Utensils,
  Armchair,
  LayoutGrid,
  Baby,
  Accessibility,
  FolderOpen,
  Briefcase,
  Settings,
  Camera,
  DoorOpen,
  Luggage,
  Package,
  type LucideIcon,
} from "lucide-react"

import type { Capability } from "@/types/permissions"
import type { AppRole, DomainePhase, PlanningMilestone } from "@/types/domain"

export const EVENT_NAME = "Fiançailles de Sarah & Jordan"

export const EVENT_DATE = import.meta.env.VITE_EVENT_DATE ?? "2026-07-25"

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  capability: Capability
  /** Restreint l'affichage dans la nav à ces rôles, en plus de `capability` — la route reste accessible aux autres rôles (ex. "/" reste la cible de repli de RoleGuard), seul l'onglet est masqué. */
  visibleToRoles?: AppRole[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Introduction", path: "/introduction", icon: Heart, capability: "view:introduction" },
  { label: "Rôle", path: "/ma-mission", icon: UserCheck, capability: "view:role" },
  { label: "Tableau de bord", path: "/", icon: Home, capability: "view:dashboard", visibleToRoles: ["fiance"] },
  {
    label: "Missions",
    path: "/missions",
    icon: ListChecks,
    capability: "view:missions",
    visibleToRoles: ["fiance"],
  },
  { label: "Assignations", path: "/assignations", icon: ListTree, capability: "view:assignations" },
  { label: "Référents", path: "/referents", icon: Users, capability: "view:referents" },
  { label: "Planning", path: "/planning", icon: CalendarRange, capability: "view:planning" },
  { label: "Déroulé", path: "/deroule", icon: PartyPopper, capability: "view:deroule" },
  { label: "Photos de groupe", path: "/photos-groupe", icon: Camera, capability: "view:photos-groupe" },
  { label: "Accueil", path: "/accueil", icon: DoorOpen, capability: "view:accueil" },
  { label: "Logistique", path: "/logistique", icon: Truck, capability: "view:logistique" },
  { label: "Nourriture", path: "/nourriture", icon: Utensils, capability: "view:nourriture" },
  { label: "Matériel", path: "/materiel", icon: Package, capability: "view:materiel" },
  { label: "Séjour", path: "/sejour", icon: Luggage, capability: "view:sejour" },
  { label: "Invités", path: "/invites", icon: Armchair, capability: "view:guests" },
  { label: "Plan de table", path: "/plan-table", icon: LayoutGrid, capability: "view:guests" },
  { label: "Liste des enfants", path: "/enfants", icon: Baby, capability: "view:guests" },
  { label: "Personnes âgées", path: "/personnes-agees", icon: Accessibility, capability: "view:guests" },
  { label: "Prestataires", path: "/prestataires", icon: Briefcase, capability: "view:prestataires" },
  { label: "Documents", path: "/documents", icon: FolderOpen, capability: "view:documents" },
  { label: "Paramètres", path: "/parametres", icon: Settings, capability: "manage:settings" },
]

export const MILESTONE_ORDER: PlanningMilestone[] = [
  "j_moins_30",
  "j_moins_15",
  "j_moins_7",
  "j_moins_1",
  "jour_j",
  "j_plus_1",
]

export const MILESTONE_LABELS: Record<PlanningMilestone, string> = {
  j_moins_30: "J-30",
  j_moins_15: "J-15",
  j_moins_7: "J-7",
  j_moins_1: "J-1",
  jour_j: "Jour J",
  j_plus_1: "J+1",
}

export const DOMAINE_PHASE_ORDER: DomainePhase[] = [
  "avant",
  "installation",
  "jour_j",
  "desinstallation",
  "apres",
]

export const DOMAINE_PHASE_LABELS: Record<DomainePhase, string> = {
  avant: "Avant",
  installation: "Installation",
  jour_j: "Jour J",
  desinstallation: "Désinstallation",
  apres: "Après",
}
