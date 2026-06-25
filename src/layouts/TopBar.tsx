import { useLocation } from "react-router-dom"

import { NAV_ITEMS } from "@/lib/constants"

function useCurrentPageLabel() {
  const { pathname } = useLocation()
  const match = NAV_ITEMS.find((item) =>
    item.path === "/" ? pathname === "/" : pathname.startsWith(item.path)
  )
  return match?.label ?? "Sarah & Jordan"
}

export function TopBar() {
  const label = useCurrentPageLabel()

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
      <span className="font-heading text-base font-medium text-foreground">{label}</span>
    </header>
  )
}
