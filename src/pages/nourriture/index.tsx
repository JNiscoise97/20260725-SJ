import { useMemo, useState } from "react"
import { Utensils, Drumstick, Fish, Baby, AlertTriangle } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatCard } from "@/components/shared/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { GuestMealCard } from "@/components/nourriture/GuestMealCard"
import { GuestMealDialog } from "@/components/nourriture/GuestMealDialog"
import { useGuests } from "@/hooks/queries/use-guests"
import type { Guest, MealChoice } from "@/types/domain"

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
  const { data: guests, isLoading } = useGuests()
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [search, setSearch] = useState("")
  const [mealFilter, setMealFilter] = useState(ALL)

  const summary = useMemo(() => {
    if (!guests) return null
    const catered = guests.filter((g) => g.rsvpStatus !== "declined")
    const mealCounts: Record<MealChoice, number> = { poulet: 0, poisson: 0, enfant: 0 }
    let unset = 0
    catered.forEach((g) => {
      if (g.mealChoice) mealCounts[g.mealChoice] += 1
      else unset += 1
    })
    return { total: catered.length, mealCounts, unset, catered }
  }, [guests])

  const filteredGuests = useMemo(() => {
    if (!summary) return []
    const query = search.trim().toLowerCase()
    return summary.catered.filter((guest) => {
      if (mealFilter === MEAL_FILTER_NONE && guest.mealChoice) return false
      if (mealFilter !== ALL && mealFilter !== MEAL_FILTER_NONE && guest.mealChoice !== mealFilter) return false
      if (query && !guest.fullName.toLowerCase().includes(query)) return false
      return true
    })
  }, [summary, search, mealFilter])

  const groupedGuests = useMemo(() => {
    const groups: { value: string; label: string; guests: Guest[] }[] = MEAL_FILTERS.filter(
      (f) => f.value !== ALL
    ).map((f) => ({ ...f, guests: [] }))
    filteredGuests.forEach((guest) => {
      const group = groups.find((g) => g.value === (guest.mealChoice ?? MEAL_FILTER_NONE))
      group?.guests.push(guest)
    })
    return groups.filter((g) => g.guests.length > 0)
  }, [filteredGuests])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nourriture"
        description="Récapitulatif traiteur : effectifs par plat, régimes et allergies à signaler."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : !summary || summary.total === 0 ? (
        <EmptyState icon={Utensils} title="Aucun invité pour l'instant" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Utensils} label="Invités à nourrir" value={summary.total} hint="Hors invités déclinés" />
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
                  {summary.unset} invité{summary.unset === 1 ? "" : "s"} à nourrir sans plat renseigné — à relancer.
                </p>
              </CardContent>
            </Card>
          ) : null}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un invité..."
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
                {filteredGuests.length} invité{filteredGuests.length === 1 ? "" : "s"}
              </p>
            </div>

            {groupedGuests.length === 0 ? (
              <EmptyState icon={Utensils} title="Aucun invité ne correspond à ces filtres" />
            ) : (
              <div className="space-y-6">
                {groupedGuests.map((group) => (
                  <div key={group.value} className="space-y-3">
                    <h2 className="font-heading text-base font-medium text-foreground">
                      {group.label} ({group.guests.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.guests.map((guest) => (
                        <GuestMealCard key={guest.id} guest={guest} onSelect={setSelectedGuest} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <GuestMealDialog
        guest={selectedGuest}
        onOpenChange={(open) => {
          if (!open) setSelectedGuest(null)
        }}
      />
    </div>
  )
}
