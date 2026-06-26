import { Outlet } from "react-router-dom"

import { Sidebar } from "@/layouts/Sidebar"
import { BottomNav } from "@/layouts/BottomNav"
import { TopBar } from "@/layouts/TopBar"
import { DayOfBanner } from "@/layouts/DayOfBanner"

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar />
        <DayOfBanner />
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
