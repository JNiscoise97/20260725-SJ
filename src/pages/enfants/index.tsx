import { useMemo } from "react"
import { Baby } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGuestGroups, useGuests } from "@/hooks/queries/use-guests"
import type { Guest } from "@/types/domain"

/**
 * `childAge` est rarement renseigné (la plupart des invités n'ont qu'une
 * tranche `ageRange` du style "13-17 ans") : seul `isChild` est garanti pour
 * la tranche "0-12 ans" des données sources, donc on complète avec la borne
 * haute de `ageRange` pour ne pas rater les ados de 13 à 17 ans.
 */
function isUnder18(guest: Guest): boolean {
  if (guest.isChild) return true
  const match = guest.ageRange?.match(/(\d+)\s*-\s*(\d+)/)
  return match ? Number(match[2]) < 18 : false
}

function ageSortValue(guest: Guest): number {
  if (guest.childAge != null) return guest.childAge
  const match = guest.ageRange?.match(/(\d+)/)
  return match ? Number(match[1]) : 999
}

export function EnfantsPage() {
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: groups, isLoading: groupsLoading } = useGuestGroups()
  const isLoading = guestsLoading || groupsLoading

  const groupsById = useMemo(() => new Map((groups ?? []).map((g) => [g.id, g])), [groups])

  const children = useMemo(() => {
    if (!guests) return []
    return guests
      .filter((g) => g.rsvpStatus === "confirmed" && isUnder18(g))
      .sort((a, b) => ageSortValue(a) - ageSortValue(b))
  }, [guests])

  return (
    <div className="space-y-6">
      <PageHeader title="Liste des enfants" description="Enfants de moins de 18 ans dont la présence est confirmée." />

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : children.length === 0 ? (
        <EmptyState icon={Baby} title="Aucun enfant confirmé pour l'instant" />
      ) : (
        <div className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enfant</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Famille</TableHead>
                <TableHead>Allergies / régime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children.map((child) => (
                <TableRow key={child.id}>
                  <TableCell className="font-medium text-foreground">{child.fullName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {child.childAge ?? child.ageRange ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {child.groupId ? groupsById.get(child.groupId)?.familyName ?? "—" : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {[child.allergies, child.dietaryConstraints].filter(Boolean).join(" · ") || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground">
            {children.length} enfant{children.length === 1 ? "" : "s"} présent{children.length === 1 ? "" : "s"} de
            moins de 18 ans.
          </p>
        </div>
      )}
    </div>
  )
}
