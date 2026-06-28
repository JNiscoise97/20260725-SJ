import { Routes, Route } from "react-router-dom"

import { AppShell } from "@/layouts/AppShell"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"
import { RoleGuard } from "@/layouts/RoleGuard"
import { LoginPage } from "@/pages/auth"
import { GuestInfoPage } from "@/pages/guest"
import { IntroductionPage } from "@/pages/introduction"
import { DashboardPage } from "@/pages/dashboard"
import { TasksPage } from "@/pages/tasks"
import { MissionsPage } from "@/pages/missions"
import { ReferentsPage } from "@/pages/referents"
import { PlanningPage } from "@/pages/planning"
import { DeroulePage } from "@/pages/deroule"
import { LogistiquePage } from "@/pages/logistique"
import { NourriturePage } from "@/pages/nourriture"
import { InvitesPage } from "@/pages/invites"
import { GuestDetailPage } from "@/pages/invites/guest-detail"
import { PlanTablePage } from "@/pages/plan-table"
import { EnfantsPage } from "@/pages/enfants"
import { PersonnesAgeesPage } from "@/pages/personnes-agees"
import { PrestatairesPage } from "@/pages/prestataires"
import { DocumentsPage } from "@/pages/documents"
import { ParametresPage } from "@/pages/parametres"
import { RevueContenuPage } from "@/pages/revue-contenu"
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
            path="introduction"
            element={
              <RoleGuard capability="view:introduction">
                <IntroductionPage />
              </RoleGuard>
            }
          />
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
            path="missions"
            element={
              <RoleGuard capability="view:missions">
                <MissionsPage />
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
            path="logistique"
            element={
              <RoleGuard capability="view:logistique">
                <LogistiquePage />
              </RoleGuard>
            }
          />
          <Route
            path="nourriture"
            element={
              <RoleGuard capability="view:nourriture">
                <NourriturePage />
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
            path="invites/:guestId"
            element={
              <RoleGuard capability="view:guests">
                <GuestDetailPage />
              </RoleGuard>
            }
          />
          <Route
            path="plan-table"
            element={
              <RoleGuard capability="view:guests">
                <PlanTablePage />
              </RoleGuard>
            }
          />
          <Route
            path="enfants"
            element={
              <RoleGuard capability="view:guests">
                <EnfantsPage />
              </RoleGuard>
            }
          />
          <Route
            path="personnes-agees"
            element={
              <RoleGuard capability="view:guests">
                <PersonnesAgeesPage />
              </RoleGuard>
            }
          />
          <Route
            path="prestataires"
            element={
              <RoleGuard capability="view:prestataires">
                <PrestatairesPage />
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
          <Route
            path="parametres/revue-contenu"
            element={
              <RoleGuard capability="manage:settings">
                <RevueContenuPage />
              </RoleGuard>
            }
          />
          <Route
            path="ma-mission"
            element={
              <RoleGuard capability="view:role">
                <MaMissionPage />
              </RoleGuard>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
