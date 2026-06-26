import { useMemo, useState } from "react"
import { Utensils, Drumstick, Fish, Baby, AlertTriangle } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatCard } from "@/components/shared/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MealAttendeeCard } from "@/components/nourriture/MealAttendeeCard"
import { MealAttendeeDialog, type MealAttendeePatch } from "@/components/nourriture/MealAttendeeDialog"
import { useGuests, useUpdateGuest } from "@/hooks/queries/use-guests"
import { usePeople, useUpdatePerson } from "@/hooks/queries/use-people"
import { usePrestataires, useUpdatePrestataire } from "@/hooks/queries/use-prestataires"
import { guestsToAttendees, fiancesToAttendees, prestatairesToAttendees, type MealAttendee } from "@/lib/meal-attendees"
import type { MealChoice } from "@/types/domain"

const MEAL_FILTER_NONE = "non_renseigne"
const ALL = "all"

const MEAL_FILTERS: { value: string; label: string }[] = [
  { value: ALL, label: "Tous" },
  { value: "poulet", label: "Poulet" },
  { value: "poisson", label: "Poisson" },
  { value: "enfant", label: "Menu enfant" },
  { value: MEAL_FILTER_NONE, label: "Non renseigné" },
]

export function NourriturePage() {
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: people, isLoading: peopleLoading } = usePeople()
  const { data: prestataires, isLoading: prestatairesLoading } = usePrestataires()
  const updateGuest = useUpdateGuest()
  const updatePerson = useUpdatePerson()
  const updatePrestataire = useUpdatePrestataire()

  const [selectedAttendee, setSelectedAttendee] = useState<MealAttendee | null>(null)
  const [search, setSearch] = useState("")
  const [mealFilter, setMealFilter] = useState(ALL)

  const isLoading = guestsLoading || peopleLoading || prestatairesLoading

  const attendees = useMemo(() => {
    if (!guests || !people || !prestataires) return []
    return [
      ...guestsToAttendees(guests),
      ...fiancesToAttendees(people),
      ...prestatairesToAttendees(prestataires),
    ]
  }, [guests, people, prestataires])

  const summary = useMemo(() => {
    const mealCounts: Record<MealChoice, number> = { poulet: 0, poisson: 0, enfant: 0 }
    let unset = 0
    attendees.forEach((a) => {
      if (a.mealChoice) mealCounts[a.mealChoice] += 1
      else unset += 1
    })
    return { total: attendees.length, mealCounts, unset }
  }, [attendees])

  const filteredAttendees = useMemo(() => {
    const query = search.trim().toLowerCase()
    return attendees.filter((attendee) => {
      if (mealFilter === MEAL_FILTER_NONE && attendee.mealChoice) return false
      if (mealFilter !== ALL && mealFilter !== MEAL_FILTER_NONE && attendee.mealChoice !== mealFilter) return false
      if (query && !attendee.fullName.toLowerCase().includes(query)) return false
      return true
    })
  }, [attendees, search, mealFilter])

  const groupedAttendees = useMemo(() => {
    const groups: { value: string; label: string; attendees: MealAttendee[] }[] = MEAL_FILTERS.filter(
      (f) => f.value !== ALL
    ).map((f) => ({ ...f, attendees: [] }))
    filteredAttendees.forEach((attendee) => {
      const group = groups.find((g) => g.value === (attendee.mealChoice ?? MEAL_FILTER_NONE))
      group?.attendees.push(attendee)
    })
    return groups.filter((g) => g.attendees.length > 0)
  }, [filteredAttendees])

  async function handleSave(attendee: MealAttendee, patch: MealAttendeePatch) {
    if (attendee.source === "guest") {
      await updateGuest.mutateAsync({ id: attendee.id, patch })
    } else if (attendee.source === "fiance") {
      await updatePerson.mutateAsync({ id: attendee.id, patch })
    } else {
      await updatePrestataire.mutateAsync({ id: attendee.id, patch })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nourriture"
        description="Récapitulatif traiteur : effectifs par plat, régimes et allergies à signaler (invités, fiancés et prestataires qui mangent avec nous)."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : summary.total === 0 ? (
        <EmptyState icon={Utensils} title="Aucune personne à nourrir pour l'instant" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Utensils} label="Personnes à nourrir" value={summary.total} hint="Invités, fiancés et prestataires" />
            <StatCard
              icon={Drumstick}
              label="Poulet"
              value={summary.mealCounts.poulet}
              accentClassName="bg-bordeaux/10 text-bordeaux"
            />
            <StatCard
              icon={Fish}
              label="Poisson"
              value={summary.mealCounts.poisson}
              accentClassName="bg-vert-vegetal/15 text-vert-vegetal"
            />
            <StatCard
              icon={Baby}
              label="Menu enfant"
              value={summary.mealCounts.enfant}
              accentClassName="bg-dore/15 text-dore"
            />
          </div>

          {summary.unset > 0 ? (
            <Card>
              <CardContent className="flex items-center gap-3">
                <AlertTriangle className="size-5 shrink-0 text-bordeaux" />
                <p className="text-sm text-foreground">
                  {summary.unset} personne{summary.unset === 1 ? "" : "s"} à nourrir sans plat renseigné — à relancer.
                </p>
              </CardContent>
            </Card>
          ) : null}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une personne..."
                className="max-w-xs"
              />
              <div className="flex flex-wrap gap-2">
                {MEAL_FILTERS.map((filter) => (
                  <Badge key={filter.value} asChild variant={mealFilter === filter.value ? "default" : "outline"}>
                    <button type="button" onClick={() => setMealFilter(filter.value)}>
                      {filter.label}
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredAttendees.length} personne{filteredAttendees.length === 1 ? "" : "s"}
              </p>
            </div>

            {groupedAttendees.length === 0 ? (
              <EmptyState icon={Utensils} title="Aucune personne ne correspond à ces filtres" />
            ) : (
              <div className="space-y-6">
                {groupedAttendees.map((group) => (
                  <div key={group.value} className="space-y-3">
                    <h2 className="font-heading text-base font-medium text-foreground">
                      {group.label} ({group.attendees.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.attendees.map((attendee) => (
                        <MealAttendeeCard key={`${attendee.source}-${attendee.id}`} attendee={attendee} onSelect={setSelectedAttendee} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <MealAttendeeDialog
        attendee={selectedAttendee}
        onSave={handleSave}
        onOpenChange={(open) => {
          if (!open) setSelectedAttendee(null)
        }}
      />
    </div>
  )
}
