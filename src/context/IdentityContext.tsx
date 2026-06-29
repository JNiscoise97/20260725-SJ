import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import type { Identity } from "@/types/domain"
import { identityService } from "@/services/identity.service"

const STORAGE_KEY = "sj-identity"

interface IdentityContextValue {
  person: Identity | null
  isLoading: boolean
  login: (code: string) => Promise<Identity | null>
  logout: () => void
  /** Met à jour l'identité en mémoire sans refaire d'appel réseau (ex. après avoir marqué l'introduction vue). */
  patchPerson: (patch: Partial<Identity>) => void
  /**
   * Vrai juste après un clic sur "Déconnexion", jusqu'à la connexion
   * suivante — voir ProtectedLayout, qui s'en sert pour ne pas attacher
   * `state.from` à son redirect vers /connexion dans ce cas précis. Porté ici
   * (et pas un simple `navigate()` dans TopBar) parce que ce flag doit être
   * mis à jour dans le même rendu que `person` : sinon ProtectedLayout peut
   * re-rendre avec `person` déjà à null mais la route du routeur pas encore
   * à jour, et émettre son propre redirect avec l'ancienne page avant que la
   * navigation explicite n'ait eu le temps de s'appliquer.
   */
  justLoggedOut: boolean
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [person, setPerson] = useState<Identity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [justLoggedOut, setJustLoggedOut] = useState(false)

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
      setJustLoggedOut(false)
      setPerson(found)
    }
    return found
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setJustLoggedOut(true)
    setPerson(null)
  }

  function patchPerson(patch: Partial<Identity>) {
    setPerson((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <IdentityContext.Provider value={{ person, isLoading, login, logout, patchPerson, justLoggedOut }}>
      {children}
    </IdentityContext.Provider>
  )
}

export function useIdentity() {
  const ctx = useContext(IdentityContext)
  if (!ctx) throw new Error("useIdentity doit être utilisé dans IdentityProvider")
  return ctx
}
