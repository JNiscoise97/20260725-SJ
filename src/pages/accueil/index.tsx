import { useMemo, useState } from "react"
import { CheckCircle2, DoorOpen, Plus, RotateCcw, Search, Sparkles, Users } from "lucide-react"
import { toast } from "sonner"

import type { Guest, GuestGroup } from "@/types/domain"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { useAddWalkInGuest, useCheckInGuest, useGuestGroups, useGuests } from "@/hooks/queries/use-guests"

const NO_FAMILY = "__no_family__"

type Filter = "all" | "pending" | "arrived"

const FILTER_LABELS: Record<Filter, string> = {
  all: "Tous",
  pending: "En attente",
  arrived: "Arrivés",
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

export function AccueilPage() {
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: groups, isLoading: groupsLoading } = useGuestGroups()
  const checkIn = useCheckInGuest()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const isLoading = guestsLoading || groupsLoading

  const groupsById = useMemo(() => new Map((groups ?? []).map((g) => [g.id, g])), [groups])

  const filteredGuests = useMemo(() => {
    if (!guests) return []
    const query = search.trim().toLowerCase()
    return guests.filter((guest) => {
      if (filter === "pending" && guest.checkedInAt) return false
      if (filter === "arrived" && !guest.checkedInAt) return false
      if (query) {
        const familyName = guest.groupId ? groupsById.get(guest.groupId)?.familyName ?? "" : ""
        if (!guest.fullName.toLowerCase().includes(query) && !familyName.toLowerCase().includes(query)) return false
      }
      return true
    })
  }, [guests, search, filter, groupsById])

  const families = useMemo(() => {
    const map = new Map<string, { group: GuestGroup | null; guests: Guest[] }>()
    for (const guest of filteredGuests) {
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
  }, [filteredGuests, groupsById])

  const stats = useMemo(() => {
    if (!guests) return null
    return {
      total: guests.length,
      arrived: guests.filter((g) => g.checkedInAt).length,
      unexpected: guests.filter((g) => g.isUnexpected).length,
    }
  }, [guests])

  function toggleGuest(guest: Guest) {
    checkIn.mutate({ id: guest.id, checkedInAt: guest.checkedInAt ? null : new Date().toISOString() })
  }

  async function markFamily(guestsInFamily: Guest[], arrived: boolean) {
    await Promise.all(
      guestsInFamily.map((g) =>
        checkIn.mutateAsync({ id: g.id, checkedInAt: arrived ? new Date().toISOString() : null })
      )
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accueil"
        description="Pointez les arrivées des invités au fur et à mesure."
        actions={<AddWalkInGuestDialog />}
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : !guests || guests.length === 0 ? (
        <EmptyState icon={DoorOpen} title="Aucun invité à accueillir" />
      ) : (
        <>
          {stats ? (
            <Card>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">Arrivées</p>
                  <span className="text-sm font-medium text-foreground">
                    {stats.arrived} / {stats.total} invités arrivés
                    {stats.unexpected > 0 ? ` · dont ${stats.unexpected} imprévu${stats.unexpected === 1 ? "" : "s"}` : ""}
                  </span>
                </div>
                <Progress value={stats.total > 0 ? Math.round((stats.arrived / stats.total) * 100) : 0} />
              </CardContent>
            </Card>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un invité ou une famille..."
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant={filter === key ? "default" : "ghost"}
                  onClick={() => setFilter(key)}
                >
                  {FILTER_LABELS[key]}
                </Button>
              ))}
            </div>
          </div>

          {families.length === 0 ? (
            <EmptyState icon={Users} title="Aucun invité ne correspond à ces filtres" />
          ) : (
            <div className="space-y-4">
              {families.map((family) => {
                const arrivedCount = family.guests.filter((g) => g.checkedInAt).length
                const allArrived = arrivedCount === family.guests.length
                const key = family.group?.id ?? NO_FAMILY
                const canBulkMark =
                  family.guests.length > 1 && (family.group?.familyName.toLowerCase().includes("famille") ?? false)
                return (
                  <Card key={key}>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="font-heading text-base text-foreground">
                            {family.group?.familyName ?? "Sans famille"}
                          </p>
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            {arrivedCount} / {family.guests.length}
                          </Badge>
                        </div>
                        {canBulkMark ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => markFamily(family.guests, !allArrived)}
                          >
                            {allArrived ? (
                              <>
                                <RotateCcw className="size-3.5" />
                                Annuler le groupe
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="size-3.5" />
                                Marquer toute la famille arrivée
                              </>
                            )}
                          </Button>
                        ) : null}
                      </div>
                      <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                        {family.guests.map((guest) => (
                          <li key={guest.id}>
                            <button
                              type="button"
                              onClick={() => toggleGuest(guest)}
                              className={cn(
                                "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                                guest.checkedInAt
                                  ? "border-vert-vegetal/40 bg-vert-vegetal/10"
                                  : "border-border hover:bg-muted/50"
                              )}
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <CheckCircle2
                                  className={cn(
                                    "size-4 shrink-0",
                                    guest.checkedInAt ? "text-vert-vegetal" : "text-muted-foreground/40"
                                  )}
                                />
                                <span className="truncate text-sm text-foreground">{guest.fullName}</span>
                                {guest.isUnexpected ? (
                                  <Badge className="shrink-0 bg-dore/20 text-xs text-brun">
                                    <Sparkles className="size-3" />
                                    Imprévu
                                  </Badge>
                                ) : null}
                              </span>
                              {guest.checkedInAt ? (
                                <span className="shrink-0 text-xs text-muted-foreground">
                                  {formatTime(guest.checkedInAt)}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function AddWalkInGuestDialog() {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const addWalkInGuest = useAddWalkInGuest()

  async function handleSubmit() {
    if (!firstName.trim() || !lastName.trim()) return
    await addWalkInGuest.mutateAsync({ firstName: firstName.trim(), lastName: lastName.trim() })
    toast.success("Invité imprévu ajouté et pointé arrivé.")
    setFirstName("")
    setLastName("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="size-4" />
          Invité imprévu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Invité non prévu</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Pour une personne qui se présente sans être sur la liste — elle sera ajoutée et pointée arrivée
          immédiatement.
        </p>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="walkin-first-name">Prénom</FieldLabel>
            <Input id="walkin-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="walkin-last-name">Nom</FieldLabel>
            <Input id="walkin-last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!firstName.trim() || !lastName.trim()}>
            Ajouter et marquer arrivé
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
