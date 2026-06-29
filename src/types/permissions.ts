import type { AppRole } from "@/types/domain"

export type Capability =
  | "view:introduction"
  | "view:role"
  | "view:dashboard"
  | "view:tasks"
  | "manage:tasks"
  | "view:missions"
  | "view:assignations"
  | "view:referents"
  | "manage:referents"
  | "view:planning"
  | "manage:planning"
  | "view:deroule"
  | "manage:deroule"
  | "view:logistique"
  | "manage:logistique"
  | "view:guests"
  | "manage:guests"
  | "view:nourriture"
  | "view:documents"
  | "manage:documents"
  | "view:prestataires"
  | "manage:prestataires"
  | "manage:settings"
  | "view:photos-groupe"
  | "view:accueil"

const FIANCE_CAPABILITIES: Capability[] = [
  "view:dashboard",
  "view:tasks",
  "manage:tasks",
  "view:missions",
  "view:assignations",
  "view:referents",
  "manage:referents",
  "view:planning",
  "manage:planning",
  "view:deroule",
  "manage:deroule",
  "view:logistique",
  "manage:logistique",
  "view:guests",
  "manage:guests",
  "view:nourriture",
  "view:documents",
  "manage:documents",
  "view:prestataires",
  "manage:prestataires",
  "manage:settings",
  "view:photos-groupe",
  "view:accueil",
]

const REFERENT_CAPABILITIES: Capability[] = [
  "view:introduction",
  "view:role",
  "view:dashboard",
  "view:tasks",
  "view:missions",
  "view:referents",
  "view:planning",
  "view:deroule",
  "view:logistique",
  "view:documents",
  "view:prestataires",
  "view:photos-groupe",
  "view:accueil",
]

const INVITE_CAPABILITIES: Capability[] = ["view:introduction"]

export const PERMISSIONS: Record<AppRole, ReadonlySet<Capability>> = {
  fiance: new Set(FIANCE_CAPABILITIES),
  referent: new Set(REFERENT_CAPABILITIES),
  invite: new Set(INVITE_CAPABILITIES),
}

export function hasCapability(role: AppRole, capability: Capability): boolean {
  return PERMISSIONS[role].has(capability)
}
