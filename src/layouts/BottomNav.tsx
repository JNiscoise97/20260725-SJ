import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { MoreHorizontal } from "lucide-react"

import { NAV_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/hooks/use-permissions"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const PRIMARY_PATHS = ["/", "/referents", "/deroule"]

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const { can, role } = usePermissions()

  const visibleItems = NAV_ITEMS.filter(
    (item) => can(item.capability) && (!item.visibleToRoles || (role && item.visibleToRoles.includes(role)))
  )
  const primaryItems = visibleItems.filter((item) => PRIMARY_PATHS.includes(item.path))
  const moreItems = visibleItems.filter((item) => !PRIMARY_PATHS.includes(item.path))
  const isMoreActive = moreItems.some((item) => location.pathname.startsWith(item.path))

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {primaryItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors",
                isActive && "text-primary"
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors",
            isMoreActive && "text-primary"
          )}
        >
          <MoreHorizontal className="size-5" />
          Plus
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="font-heading">Plus de modules</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 px-4 pb-6">
            {moreItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-3 py-4 text-xs font-medium text-foreground transition-colors",
                    isActive && "border-primary text-primary"
                  )
                }
              >
                <item.icon className="size-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
