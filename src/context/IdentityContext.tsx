import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import type { Identity } from "@/types/domain"
import { identityService } from "@/services/identity.service"

const STORAGE_KEY = "sj-identity"

interface IdentityContextValue {
  person: Identity | null
  isLoading: boolean
  login: (code: string) => Promise<Identity | null>
  logout: () => void
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [person, setPerson] = useState<Identity | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    const storedId = localStorage.getItem(STORAGE_KEY)
    const lookup = storedId ? identityService.getById(storedId) : Promise.resolve(null)

    lookup
      .catch(() => {
        // Identifiant invalide ou obsolète (ex. ancien id mock du type "p-sarah"
        // après bascule sur Supabase, où "id" doit être un uuid) : on l'efface
        // plutôt que de planter, l'utilisateur se reconnectera avec son code.
        localStorage.removeItem(STORAGE_KEY)
        return null
      })
      .then((found) => {
        if (!active) return
        setPerson(found && found.isActive ? found : null)
        setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function login(code: string) {
    const found = await identityService.resolveByAccessCode(code)
    if (found) {
      localStorage.setItem(STORAGE_KEY, found.id)
      setPerson(found)
    }
    return found
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setPerson(null)
  }

  return (
    <IdentityContext.Provider value={{ person, isLoading, login, logout }}>
      {children}
    </IdentityContext.Provider>
  )
}

export function useIdentity() {
  const ctx = useContext(IdentityContext)
  if (!ctx) throw new Error("useIdentity doit être utilisé dans IdentityProvider")
  return ctx
}
