import { useMemo, useState } from "react"
import { Armchair } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useAssignSeat,
  useGuestGroups,
  useGuests,
  useTableAssignments,
  useTables,
  useUnassignGuest,
} from "@/hooks/queries/use-guests"
import { GuestTable } from "@/components/invites/GuestTable"
import { SeatingPlanBoard } from "@/components/invites/SeatingPlanBoard"

const ALL_GROUPS = "all"

export function InvitesPage() {
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: groups, isLoading: groupsLoading } = useGuestGroups()
  const { data: tables, isLoading: tablesLoading } = useTables()
  const { data: assignments, isLoading: assignmentsLoading } = useTableAssignments()
  const assignSeat = useAssignSeat()
  const unassignGuest = useUnassignGuest()
  const [search, setSearch] = useState("")
  const [groupFilter, setGroupFilter] = useState(ALL_GROUPS)

  const isLoading = guestsLoading || groupsLoading || tablesLoading || assignmentsLoading

  const groupsById = useMemo(() => new Map((groups ?? []).map((g) => [g.id, g])), [groups])

  const filteredGuests = useMemo(() => {
    if (!guests) return []
    const query = search.trim().toLowerCase()
    return guests.filter((guest) => {
      if (groupFilter !== ALL_GROUPS && guest.groupId !== groupFilter) return false
      if (query && !guest.fullName.toLowerCase().includes(query)) return false
      return true
    })
  }, [guests, search, groupFilter])

  const stats = useMemo(() => {
    if (!guests) return null
    return {
      total: guests.length,
      confirmed: guests.filter((g) => g.rsvpStatus === "confirmed").length,
      pending: guests.filter((g) => g.rsvpStatus === "pending").length,
      declined: guests.filter((g) => g.rsvpStatus === "declined").length,
    }
  }, [guests])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invités"
        description="Liste des invités, présence et plan de table."
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : !guests || guests.length === 0 ? (
        <EmptyState icon={Armchair} title="Aucun invité pour l'instant" />
      ) : (
        <Tabs defaultValue="liste">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="plan">Plan de table</TabsTrigger>
            </TabsList>
            {stats ? (
              <p className="text-xs text-muted-foreground">
                {stats.confirmed} confirmés · {stats.pending} en attente · {stats.declined} déclinés · {stats.total} au total
              </p>
            ) : null}
          </div>
          <TabsContent value="liste" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un invité..."
                className="max-w-xs"
              />
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Tous les groupes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_GROUPS}>Tous les groupes</SelectItem>
                  {(groups ?? []).map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.familyName}
                      {group.notes ? ` (${group.notes})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {filteredGuests.length} invité{filteredGuests.length === 1 ? "" : "s"} affiché{filteredGuests.length === 1 ? "" : "s"}
              </p>
            </div>
            {filteredGuests.length === 0 ? (
              <EmptyState icon={Armchair} title="Aucun invité ne correspond à ces filtres" />
            ) : (
              <GuestTable guests={filteredGuests} groupsById={groupsById} />
            )}
          </TabsContent>
          <TabsContent value="plan">
            <SeatingPlanBoard
              tables={tables ?? []}
              guests={guests}
              assignments={assignments ?? []}
              onAssign={(tableId, guestId) => assignSeat.mutate({ tableId, guestId })}
              onUnassign={(guestId) => unassignGuest.mutate(guestId)}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
