import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useIdentity } from "@/context/IdentityContext"

export function ProtectedLayout() {
  const { person, isLoading } = useIdentity()
  const location = useLocation()

  if (isLoading) return null

  if (!person) {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  if (person.role === "invite" && location.pathname !== "/infos-pratiques") {
    return <Navigate to="/infos-pratiques" replace />
  }

  return <Outlet />
}
