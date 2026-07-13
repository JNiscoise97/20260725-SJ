import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { Sidebar } from "@/layouts/Sidebar"
import { BottomNav } from "@/layouts/BottomNav"
import { TopBar } from "@/layouts/TopBar"
import { DayOfBanner } from "@/layouts/DayOfBanner"

export function AppShell() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar />
        <DayOfBanner />
        <main ref={mainRef} className="flex-1 overflow-y-auto px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
