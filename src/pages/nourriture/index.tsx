import { useMemo, useState } from "react"
import { Utensils, Drumstick, Fish, Baby, AlertTriangle } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatCard } from "@/components/shared/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MealAttendeeCard } from "@/components/nourriture/MealAttendeeCard"
import { MealAttendeeDialog, type MealAttendeePatch } from "@/components/nourriture/MealAttendeeDialog"
import { MealRequestKanban } from "@/components/nourriture/MealRequestKanban"
import { useGuestGroups, useGuests, useUpdateGuest } from "@/hooks/queries/use-guests"
import { usePeople, useUpdatePerson } from "@/hooks/queries/use-people"
import { usePrestataires, useUpdatePrestataire } from "@/hooks/queries/use-prestataires"
import { guestsToAttendees, fiancesToAttendees, prestatairesToAttendees, type MealAttendee } from "@/lib/meal-attendees"
import { MEAL_CHOICES, MEAL_CHOICE_LABELS } from "@/lib/meal-choice"
import type { Guest, MealChoice } from "@/types/domain"

const MEAL_FILTER_NONE = "non_renseigne"
const ALL = "all"

const MEAL_FILTERS: { value: string; label: string }[] = [
  { value: ALL, label: "Tous" },
  ...MEAL_CHOICES.map((choice) => ({ value: choice, label: MEAL_CHOICE_LABELS[choice] })),
  { value: MEAL_FILTER_NONE, label: "Non renseigné" },
]

const VIEW_CHOIX = "choix"
const VIEW_GROUPE = "groupe"
const VIEW_SUIVI = "suivi"

const FIANCE_BUCKET = "__fiance__"
const PRESTATAIRE_BUCKET = "__prestataire__"
const NO_FAMILY = "__no_family__"

export function NourriturePage() {
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: guestGroups, isLoading: guestGroupsLoading } = useGuestGroups()
  const { data: people, isLoading: peopleLoading } = usePeople()
  const { data: prestataires, isLoading: prestatairesLoading } = usePrestataires()
  const updateGuest = useUpdateGuest()
  const updatePerson = useUpdatePerson()
  const updatePrestataire = useUpdatePrestataire()

  const [view, setView] = useState(VIEW_CHOIX)
  const [selectedAttendee, setSelectedAttendee] = useState<MealAttendee | null>(null)
  const [search, setSearch] = useState("")
  const [mealFilter, setMealFilter] = useState(ALL)

  const isLoading = guestsLoading || guestGroupsLoading || peopleLoading || prestatairesLoading

  const guestGroupsById = useMemo(() => new Map((guestGroups ?? []).map((g) => [g.id, g])), [guestGroups])

  const attendees = useMemo(() => {
    if (!guests || !people || !prestataires) return []
    return [
      ...guestsToAttendees(guests),
      ...fiancesToAttendees(people),
      ...prestatairesToAttendees(prestataires),
    ]
  }, [guests, people, prestataires])

  const summary = useMemo(() => {
    const mealCounts: Record<MealChoice, number> = {
      poulet: 0,
      poisson: 0,
      enfant_poulet: 0,
      enfant_poisson: 0,
    }
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

  // Fiancés et prestataires n'ont pas de famille (groupId) : on les range dans
  // deux groupes à part plutôt que de les perdre.
  const groupedByFamily = useMemo(() => {
    const bucketKey = (a: MealAttendee) => {
      if (a.source === "fiance") return FIANCE_BUCKET
      if (a.source === "prestataire") return PRESTATAIRE_BUCKET
      return a.groupId ?? NO_FAMILY
    }
    const map = new Map<string, MealAttendee[]>()
    for (const attendee of filteredAttendees) {
      const key = bucketKey(attendee)
      const list = map.get(key) ?? []
      list.push(attendee)
      map.set(key, list)
    }
    const labelFor = (key: string) => {
      if (key === FIANCE_BUCKET) return "Fiancés"
      if (key === PRESTATAIRE_BUCKET) return "Prestataires"
      if (key === NO_FAMILY) return "Sans famille"
      return guestGroupsById.get(key)?.familyName ?? "Sans famille"
    }
    const sortOrderFor = (key: string) => {
      if (key === FIANCE_BUCKET) return -1
      if (key === PRESTATAIRE_BUCKET) return Number.POSITIVE_INFINITY
      if (key === NO_FAMILY) return Number.POSITIVE_INFINITY - 1
      return guestGroupsById.get(key)?.sortOrder ?? Number.POSITIVE_INFINITY
    }
    return [...map.entries()]
      .map(([key, list]) => ({
        key,
        label: labelFor(key),
        attendees: [...list].sort((a, b) => a.fullName.localeCompare(b.fullName)),
      }))
      .sort((a, b) => sortOrderFor(a.key) - sortOrderFor(b.key))
  }, [filteredAttendees, guestGroupsById])

  const kanbanGuests = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (guests ?? [])
      .filter((g) => g.rsvpStatus !== "declined")
      .filter((g) => !query || g.fullName.toLowerCase().includes(query))
  }, [guests, search])

  function handleSelectKanbanGuest(guest: Guest) {
    const attendee = attendees.find((a) => a.source === "guest" && a.id === guest.id)
    if (attendee) setSelectedAttendee(attendee)
  }

  function handleUpdateMessageSent(guestId: string, mealMessageSent: boolean) {
    updateGuest.mutate({ id: guestId, patch: { mealMessageSent } })
  }

  async function handleSave(attendee: MealAttendee, patch: MealAttendeePatch) {
    if (attendee.source === "guest") {
      // Répondre implique forcément d'avoir été sollicité — évite une carte
      // "Répondu" qui resterait visuellement dans "À demander" sur le kanban.
      const guestPatch = patch.mealChoice ? { ...patch, mealMessageSent: true } : patch
      await updateGuest.mutateAsync({ id: attendee.id, patch: guestPatch })
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : summary.total === 0 ? (
        <EmptyState icon={Utensils} title="Aucune personne à nourrir pour l'instant" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
              label="Menu enfant poulet"
              value={summary.mealCounts.enfant_poulet}
              accentClassName="bg-dore/15 text-dore"
            />
            <StatCard
              icon={Baby}
              label="Menu enfant poisson"
              value={summary.mealCounts.enfant_poisson}
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

          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value={VIEW_CHOIX}>Par choix</TabsTrigger>
              <TabsTrigger value={VIEW_GROUPE}>Par groupe</TabsTrigger>
              <TabsTrigger value={VIEW_SUIVI}>Suivi des demandes</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une personne..."
                className="max-w-xs"
              />
              {view === VIEW_CHOIX ? (
                <div className="flex flex-wrap gap-2">
                  {MEAL_FILTERS.map((filter) => (
                    <Badge key={filter.value} asChild variant={mealFilter === filter.value ? "default" : "outline"}>
                      <button type="button" onClick={() => setMealFilter(filter.value)}>
                        {filter.label}
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
              {view !== VIEW_SUIVI ? (
                <p className="text-xs text-muted-foreground">
                  {filteredAttendees.length} personne{filteredAttendees.length === 1 ? "" : "s"}
                </p>
              ) : null}
            </div>

            {view === VIEW_CHOIX ? (
              groupedAttendees.length === 0 ? (
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
                          <MealAttendeeCard
                            key={`${attendee.source}-${attendee.id}`}
                            attendee={attendee}
                            onSelect={setSelectedAttendee}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : view === VIEW_GROUPE ? (
              groupedByFamily.length === 0 ? (
                <EmptyState icon={Utensils} title="Aucune personne ne correspond à ces filtres" />
              ) : (
                <div className="space-y-6">
                  {groupedByFamily.map((group) => (
                    <div key={group.key} className="space-y-3">
                      <h2 className="font-heading text-base font-medium text-foreground">
                        {group.label} ({group.attendees.length})
                      </h2>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {group.attendees.map((attendee) => (
                          <MealAttendeeCard
                            key={`${attendee.source}-${attendee.id}`}
                            attendee={attendee}
                            onSelect={setSelectedAttendee}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : kanbanGuests.length === 0 ? (
              <EmptyState icon={Utensils} title="Aucun invité ne correspond à cette recherche" />
            ) : (
              <MealRequestKanban
                guests={kanbanGuests}
                onUpdateMessageSent={handleUpdateMessageSent}
                onSelectGuest={handleSelectKanbanGuest}
              />
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
