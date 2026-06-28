import { useMemo } from "react"
import { Accessibility } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGuestGroups, useGuests } from "@/hooks/queries/use-guests"
import type { Guest } from "@/types/domain"

/**
 * `isReducedMobility` n'est quasiment jamais renseigné dans les données
 * sources (pas de colonne dédiée dans le seed réel) : on complète avec la
 * borne basse de `ageRange` ("70-90 ans" et plus) pour ne pas rater les
 * invités âgés faute de coche manuelle.
 */
function isElderly(guest: Guest): boolean {
  if (guest.isReducedMobility) return true
  const match = guest.ageRange?.match(/(\d+)\s*-\s*(\d+)/)
  return match ? Number(match[1]) >= 70 : false
}

function ageSortValue(guest: Guest): number {
  const match = guest.ageRange?.match(/(\d+)/)
  return match ? -Number(match[1]) : 0
}

export function PersonnesAgeesPage() {
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: groups, isLoading: groupsLoading } = useGuestGroups()
  const isLoading = guestsLoading || groupsLoading

  const groupsById = useMemo(() => new Map((groups ?? []).map((g) => [g.id, g])), [groups])

  const elders = useMemo(() => {
    if (!guests) return []
    return guests
      .filter((g) => g.rsvpStatus === "confirmed" && isElderly(g))
      .sort((a, b) => ageSortValue(a) - ageSortValue(b))
  }, [guests])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Liste des personnes âgées"
        description="Invités âgés ou à mobilité réduite dont la présence est confirmée."
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : elders.length === 0 ? (
        <EmptyState icon={Accessibility} title="Aucune personne âgée confirmée pour l'instant" />
      ) : (
        <div className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invité</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Famille</TableHead>
                <TableHead>Mobilité réduite</TableHead>
                <TableHead>Hébergement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elders.map((elder) => (
                <TableRow key={elder.id}>
                  <TableCell className="font-medium text-foreground">{elder.fullName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{elder.ageRange ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {elder.groupId ? groupsById.get(elder.groupId)?.familyName ?? "—" : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        elder.isReducedMobility
                          ? "bg-vert-vegetal/15 text-vert-vegetal"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {elder.isReducedMobility ? "Oui" : "Non"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {elder.needsAccommodation ? elder.accommodation ?? "À organiser" : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground">
            {elders.length} personne{elders.length === 1 ? "" : "s"} âgée{elders.length === 1 ? "" : "s"} présente
            {elders.length === 1 ? "" : "s"}.
          </p>
        </div>
      )}
    </div>
  )
}
