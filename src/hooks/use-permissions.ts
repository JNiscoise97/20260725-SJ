import { useIdentity } from "@/context/IdentityContext"
import { PERMISSIONS, type Capability } from "@/types/permissions"

export function usePermissions() {
  const { person } = useIdentity()

  function can(capability: Capability): boolean {
    if (!person) return false
    return PERMISSIONS[person.role].has(capability)
  }

  return { can, role: person?.role ?? null }
}
