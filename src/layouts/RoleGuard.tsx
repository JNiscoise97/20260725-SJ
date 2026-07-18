import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

import { usePermissions } from "@/hooks/use-permissions"
import { useIdentity } from "@/context/IdentityContext"
import type { Capability } from "@/types/permissions"

interface RoleGuardProps {
  capability: Capability
  children: ReactNode
}

export function RoleGuard({ capability, children }: RoleGuardProps) {
  const { can, role } = usePermissions()
  const { person } = useIdentity()

  if (!can(capability)) {
    // Les invités avec onglets personnalisés évitent la boucle infinie sur "/" :
    // on les renvoie sur infos-pratiques (toujours accessible).
    const fallback = role === "invite" || person?.allowedTabs != null ? "/infos-pratiques" : "/"
    return <Navigate to={fallback} replace />
  }

  return children
}
