import type { Identity } from "@/types/domain"
import { useMissions } from "@/hooks/queries/use-missions"
import { useResponsableEntries } from "@/hooks/use-responsable-entries"

/**
 * Détermine où envoyer un invité après connexion : la page "Rôle" s'il a au
 * moins une mission assignée (via son/ses domaine(s) de responsabilité — pas
 * seulement le statut "référent", qui peut être attribué à un domaine sans
 * mission encore créée), sinon le tableau de bord comme pour un fiancé.
 */
export function useDefaultLandingPath(identity: Identity | null) {
  const { entries, isLoading: entriesLoading } = useResponsableEntries()
  const { data: missions, isLoading: missionsLoading } = useMissions()

  if (!identity || identity.role === "fiance") {
    return { path: "/", isLoading: false }
  }

  if (entriesLoading || missionsLoading) {
    return { path: "/", isLoading: true }
  }

  const domaineIds = entries.find((e) => e.identity.id === identity.id)?.domaineIds ?? []
  const hasMission = (missions ?? []).some((m) => m.domaineId && domaineIds.includes(m.domaineId))
  return { path: hasMission ? "/ma-mission" : "/", isLoading: false }
}
