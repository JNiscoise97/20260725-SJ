import { Routes, Route, Navigate } from "react-router-dom"

import { AppShell } from "@/layouts/AppShell"
import { ProtectedLayout } from "@/layouts/ProtectedLayout"
import { RoleGuard } from "@/layouts/RoleGuard"
import { LoginPage } from "@/pages/auth"
import { GuestInfoPage } from "@/pages/guest"
import { IntroductionPage } from "@/pages/introduction"
import { DashboardPage } from "@/pages/dashboard"
import { MissionsPage } from "@/pages/missions"
import { ReferentsPage } from "@/pages/referents"
import { PlanningPage } from "@/pages/planning"
import { DeroulePage } from "@/pages/deroule"
import { PhotosGroupePage } from "@/pages/photos-groupe"
import { AccueilPage } from "@/pages/accueil"
import { LogistiquePage } from "@/pages/logistique"
import { NourriturePage } from "@/pages/nourriture"
import { MaterielPage } from "@/pages/materiel"
import { SejourPage } from "@/pages/sejour"
import { InvitesPage } from "@/pages/invites"
import { GuestDetailPage } from "@/pages/invites/guest-detail"
import { PrestatairesPage } from "@/pages/prestataires"
import { DocumentsPage } from "@/pages/documents"
import { ParametresPage } from "@/pages/parametres"
import { RevueContenuPage } from "@/pages/revue-contenu"
import { MaMissionPage } from "@/pages/ma-mission"
import { MesResponsabilitesPage } from "@/pages/mes-responsabilites"
import { NotFoundPage } from "@/pages/not-found"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/connexion" element={<LoginPage />} />

      <Route element={<ProtectedLayout />}>
        <Route element={<AppShell />}>
          <Route path="/infos-pratiques" element={<GuestInfoPage />} />
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
            path="missions"
            element={
              <RoleGuard capability="view:missions">
                <MissionsPage />
              </RoleGuard>
            }
          />
          <Route path="assignations" element={<Navigate to="/referents" replace />} />
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
          <Route path="timing" element={<Navigate to="/deroule" replace />} />
          <Route
            path="photos-groupe"
            element={
              <RoleGuard capability="view:photos-groupe">
                <PhotosGroupePage />
              </RoleGuard>
            }
          />
          <Route
            path="accueil"
            element={
              <RoleGuard capability="view:accueil">
                <AccueilPage />
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
            path="materiel"
            element={
              <RoleGuard capability="view:materiel">
                <MaterielPage />
              </RoleGuard>
            }
          />
          <Route
            path="sejour"
            element={
              <RoleGuard capability="view:sejour">
                <SejourPage />
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
          <Route path="plan-table" element={<Navigate to="/invites" replace />} />
          <Route path="enfants" element={<Navigate to="/invites" replace />} />
          <Route path="personnes-agees" element={<Navigate to="/invites" replace />} />
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
          <Route
            path="mes-responsabilites"
            element={
              <RoleGuard capability="view:briefing">
                <MesResponsabilitesPage />
              </RoleGuard>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
