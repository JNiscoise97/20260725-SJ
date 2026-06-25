import type { AppRole } from "@/types/domain"

export type Capability =
  | "view:dashboard"
  | "view:tasks"
  | "manage:tasks"
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
  | "view:documents"
  | "manage:documents"
  | "view:checklists"
  | "manage:checklists"
  | "manage:settings"

const FIANCE_CAPABILITIES: Capability[] = [
  "view:dashboard",
  "view:tasks",
  "manage:tasks",
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
  "view:documents",
  "manage:documents",
  "view:checklists",
  "manage:checklists",
  "manage:settings",
]

const REFERENT_CAPABILITIES: Capability[] = [
  "view:dashboard",
  "view:tasks",
  "view:referents",
  "view:planning",
  "view:deroule",
  "view:logistique",
  "view:documents",
  "view:checklists",
]

const PROCHE_CAPABILITIES: Capability[] = ["view:dashboard", "view:tasks", "view:documents", "view:checklists"]

const INVITE_CAPABILITIES: Capability[] = []

export const PERMISSIONS: Record<AppRole, ReadonlySet<Capability>> = {
  fiance: new Set(FIANCE_CAPABILITIES),
  referent: new Set(REFERENT_CAPABILITIES),
  proche: new Set(PROCHE_CAPABILITIES),
  invite: new Set(INVITE_CAPABILITIES),
}

export function hasCapability(role: AppRole, capability: Capability): boolean {
  return PERMISSIONS[role].has(capability)
}
