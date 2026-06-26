import {
  Home,
  CheckSquare,
  Users,
  CalendarRange,
  PartyPopper,
  Truck,
  Utensils,
  Armchair,
  FolderOpen,
  Briefcase,
  Settings,
  type LucideIcon,
} from "lucide-react"

import type { Capability } from "@/types/permissions"
import type { PlanningMilestone } from "@/types/domain"

export const EVENT_NAME = "Fiançailles de Sarah & Jordan"

export const EVENT_DATE = import.meta.env.VITE_EVENT_DATE ?? "2026-07-25"

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  capability: Capability
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", path: "/", icon: Home, capability: "view:dashboard" },
  { label: "Tâches", path: "/taches", icon: CheckSquare, capability: "view:tasks" },
  { label: "Référents", path: "/referents", icon: Users, capability: "view:referents" },
  { label: "Planning", path: "/planning", icon: CalendarRange, capability: "view:planning" },
  { label: "Déroulé", path: "/deroule", icon: PartyPopper, capability: "view:deroule" },
  { label: "Logistique", path: "/logistique", icon: Truck, capability: "view:logistique" },
  { label: "Nourriture", path: "/nourriture", icon: Utensils, capability: "view:nourriture" },
  { label: "Invités", path: "/invites", icon: Armchair, capability: "view:guests" },
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
