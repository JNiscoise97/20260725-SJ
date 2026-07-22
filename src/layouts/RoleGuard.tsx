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
    return <Navigate to="/" replace />
  }

  return children
}
