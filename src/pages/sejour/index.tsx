import { useMemo, useState } from "react"
import { Car, Luggage, PartyPopper, TriangleAlert } from "lucide-react"

import type { Guest, GuestGroup } from "@/types/domain"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatCard } from "@/components/shared/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { GuestSejourCard } from "@/components/sejour/GuestSejourCard"
import { GuestSejourDialog } from "@/components/sejour/GuestSejourDialog"
import { useGuestGroups, useGuests, useUpdateGuest } from "@/hooks/queries/use-guests"

const NO_FAMILY = "__no_family__"

export function SejourPage() {
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: groups, isLoading: groupsLoading } = useGuestGroups()
  const updateGuest = useUpdateGuest()

  const [search, setSearch] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

  const isLoading = guestsLoading || groupsLoading

  const groupsById = useMemo(() => new Map((groups ?? []).map((g) => [g.id, g])), [groups])
  const guestById = useMemo(() => new Map((guests ?? []).map((g) => [g.id, g])), [guests])

  // Comme pour la nourriture : on garde pending + confirmed, seuls les
  // déclinés ne logent / voyagent / ne participent à rien.
  const attendees = useMemo(() => (guests ?? []).filter((g) => g.rsvpStatus !== "declined"), [guests])

  const summary = useMemo(() => {
    return {
      total: attendees.length,
      missingArrival: attendees.filter((g) => !g.arrivalInfo).length,
      withVehicle: attendees.filter((g) => g.hasVehicle).length,
      parentsAnniversary: attendees.filter((g) => g.attendingParentsAnniversary).length,
      montpellierVisit: attendees.filter((g) => g.attendingMontpellierVisit).length,
    }
  }, [attendees])

  const filteredAttendees = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return attendees
    return attendees.filter((g) => g.fullName.toLowerCase().includes(query))
  }, [attendees, search])

  const families = useMemo(() => {
    const map = new Map<string, { group: GuestGroup | null; guests: Guest[] }>()
    for (const guest of filteredAttendees) {
      const key = guest.groupId ?? NO_FAMILY
      const entry = map.get(key) ?? {
        group: guest.groupId ? groupsById.get(guest.groupId) ?? null : null,
        guests: [] as Guest[],
      }
      entry.guests.push(guest)
      map.set(key, entry)
    }
    return [...map.values()]
      .map((entry) => ({ ...entry, guests: [...entry.guests].sort((a, b) => a.fullName.localeCompare(b.fullName)) }))
      .sort((a, b) => (a.group?.sortOrder ?? Number.POSITIVE_INFINITY) - (b.group?.sortOrder ?? Number.POSITIVE_INFINITY))
  }, [filteredAttendees, groupsById])

  // Les inséparables voyagent et logent ensemble : on applique le même patch
  // aux deux côtés pour ne pas avoir à ressaisir deux fois la même chose.
  async function handleSave(guest: Guest, patch: Partial<Guest>) {
    await updateGuest.mutateAsync({ id: guest.id, patch })
    if (guest.pairedWithId) {
      await updateGuest.mutateAsync({ id: guest.pairedWithId, patch })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Séjour"
        description="Arrivée, départ, hébergement, transport et présence aux activités du vendredi soir, par invité."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : summary.total === 0 ? (
        <EmptyState icon={Luggage} title="Aucun invité à renseigner pour l'instant" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Luggage} label="Invités suivis" value={summary.total} hint="Hors déclinés" />
            <StatCard
              icon={Car}
              label="Véhiculés"
              value={summary.withVehicle}
              accentClassName="bg-vert-vegetal/15 text-vert-vegetal"
            />
            <StatCard
              icon={PartyPopper}
              label="Anniversaire des parents"
              value={summary.parentsAnniversary}
              hint="Vendredi soir"
              accentClassName="bg-dore/15 text-dore"
            />
            <StatCard
              icon={PartyPopper}
              label="Visite de Montpellier"
              value={summary.montpellierVisit}
              hint="Vendredi soir"
              accentClassName="bg-dore/15 text-dore"
            />
          </div>

          {summary.missingArrival > 0 ? (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-bordeaux/40 bg-bordeaux/5 p-3">
              <TriangleAlert className="size-5 shrink-0 text-bordeaux" />
              <p className="text-sm text-foreground">
                {summary.missingArrival} invité{summary.missingArrival === 1 ? "" : "s"} sans information d'arrivée.
              </p>
            </div>
          ) : null}

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un invité..."
            className="max-w-xs"
          />

          {families.length === 0 ? (
            <EmptyState icon={Luggage} title="Aucun invité ne correspond à cette recherche" />
          ) : (
            <div className="space-y-6">
              {families.map((family) => (
                <div key={family.group?.id ?? NO_FAMILY} className="space-y-3">
                  <h2 className="font-heading text-base font-medium text-foreground">
                    {family.group?.familyName ?? "Sans famille"} ({family.guests.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {family.guests.map((guest) => (
                      <GuestSejourCard
                        key={guest.id}
                        guest={guest}
                        partnerName={guest.pairedWithId ? guestById.get(guest.pairedWithId)?.fullName : null}
                        onSelect={setSelectedGuest}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <GuestSejourDialog
        guest={selectedGuest}
        partnerName={selectedGuest?.pairedWithId ? guestById.get(selectedGuest.pairedWithId)?.fullName : null}
        onSave={handleSave}
        onOpenChange={(open) => {
          if (!open) setSelectedGuest(null)
        }}
      />
    </div>
  )
}
