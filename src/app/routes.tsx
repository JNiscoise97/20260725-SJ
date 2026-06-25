import { Routes, Route } from "react-router-dom"

import { AppShell } from "@/layouts/AppShell"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"
import { RoleGuard } from "@/layouts/RoleGuard"
import { LoginPage } from "@/pages/auth"
import { GuestInfoPage } from "@/pages/guest"
import { DashboardPage } from "@/pages/dashboard"
import { TasksPage } from "@/pages/tasks"
import { ReferentsPage } from "@/pages/referents"
import { PlanningPage } from "@/pages/planning"
import { DeroulePage } from "@/pages/deroule"
import { FeuilleDeRoutePage } from "@/pages/feuille-de-route"
import { LogistiquePage } from "@/pages/logistique"
import { InvitesPage } from "@/pages/invites"
import { DocumentsPage } from "@/pages/documents"
import { ParametresPage } from "@/pages/parametres"
import { MaMissionPage } from "@/pages/ma-mission"
import { NotFoundPage } from "@/pages/not-found"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/connexion" element={<LoginPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/infos-pratiques" element={<GuestInfoPage />} />

        <Route element={<AppShell />}>
          <Route
            index
            element={
              <RoleGuard capability="view:dashboard">
                <DashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="taches"
            element={
              <RoleGuard capability="view:tasks">
                <TasksPage />
              </RoleGuard>
            }
          />
          <Route
            path="referents"
            element={
              <RoleGuard capability="view:referents">
                <ReferentsPage />
              </RoleGuard>
            }
          />
          <Route
            path="planning"
            element={
              <RoleGuard capability="view:planning">
                <PlanningPage />
              </RoleGuard>
            }
          />
          <Route
            path="deroule"
            element={
              <RoleGuard capability="view:deroule">
                <DeroulePage />
              </RoleGuard>
            }
          />
          <Route
            path="feuille-de-route"
            element={
              <RoleGuard capability="view:checklists">
                <FeuilleDeRoutePage />
              </RoleGuard>
            }
          />
          <Route
            path="logistique"
            element={
              <RoleGuard capability="view:logistique">
                <LogistiquePage />
              </RoleGuard>
            }
          />
          <Route
            path="invites"
            element={
              <RoleGuard capability="view:guests">
                <InvitesPage />
              </RoleGuard>
            }
          />
          <Route
            path="documents"
            element={
              <RoleGuard capability="view:documents">
                <DocumentsPage />
              </RoleGuard>
            }
          />
          <Route
            path="parametres"
            element={
              <RoleGuard capability="manage:settings">
                <ParametresPage />
              </RoleGuard>
            }
          />
          <Route path="ma-mission" element={<MaMissionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
