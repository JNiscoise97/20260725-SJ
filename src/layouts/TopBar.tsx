import { useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"

import { NAV_ITEMS } from "@/lib/constants"
import { useIdentity } from "@/context/IdentityContext"
import { Button } from "@/components/ui/button"

function useCurrentPageLabel() {
  const { pathname } = useLocation()
  const match = NAV_ITEMS.find((item) =>
    item.path === "/" ? pathname === "/" : pathname.startsWith(item.path)
  )
  return match?.label ?? "Sarah & Jordan"
}

export function TopBar() {
  const label = useCurrentPageLabel()
  const { logout } = useIdentity()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
      <span className="font-heading text-base font-medium text-foreground">{label}</span>
      <Button variant="ghost" size="sm" onClick={logout} aria-label="Déconnexion">
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Déconnexion</span>
      </Button>
    </header>
  )
}
