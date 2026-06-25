import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import type { Person } from "@/types/domain"
import { peopleService } from "@/services/people.service"

const STORAGE_KEY = "sj-identity"

interface IdentityContextValue {
  person: Person | null
  isLoading: boolean
  login: (code: string) => Promise<Person | null>
  logout: () => void
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [person, setPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    const storedId = localStorage.getItem(STORAGE_KEY)
    const lookup = storedId ? peopleService.getById(storedId) : Promise.resolve(null)

    lookup.then((found) => {
      if (!active) return
      setPerson(found && found.isActive ? found : null)
      setIsLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  async function login(code: string) {
    const found = await peopleService.resolveByAccessCode(code)
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
