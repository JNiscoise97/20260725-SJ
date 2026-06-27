import { X } from "lucide-react"

import type { Guest, Person, Prestataire, SeatingTable, TableAssignment } from "@/types/domain"
import type { SeatTarget } from "@/services/seating.service"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RsvpBadge } from "@/components/invites/RsvpBadge"

type SeatableKind = "guest" | "person" | "prestataire"

interface Seatable {
  kind: SeatableKind
  id: string
  label: string
  rsvpStatus?: Guest["rsvpStatus"]
}

const KIND_BADGES: Record<SeatableKind, { label: string; className: string }> = {
  guest: { label: "Invité", className: "bg-secondary text-secondary-foreground" },
  person: { label: "Fiancé", className: "bg-bordeaux/10 text-bordeaux" },
  prestataire: { label: "Prestataire", className: "bg-dore/20 text-brun" },
}

function targetFor(seatable: Seatable): SeatTarget {
  if (seatable.kind === "guest") return { guestId: seatable.id }
  if (seatable.kind === "person") return { personId: seatable.id }
  return { prestataireId: seatable.id }
}

function keyFor(target: SeatTarget) {
  return `guest:${target.guestId ?? ""}|person:${target.personId ?? ""}|prestataire:${target.prestataireId ?? ""}`
}

function assignmentKey(a: TableAssignment) {
  return keyFor({ guestId: a.guestId, personId: a.personId, prestataireId: a.prestataireId })
}

interface SeatingPlanBoardProps {
  tables: SeatingTable[]
  guests: Guest[]
  people: Person[]
  prestataires: Prestataire[]
  assignments: TableAssignment[]
  onAssign: (tableId: string, target: SeatTarget) => void
  onUnassign: (assignmentId: string) => void
}

export function SeatingPlanBoard({
  tables,
  guests,
  people,
  prestataires,
  assignments,
  onAssign,
  onUnassign,
}: SeatingPlanBoardProps) {
  const seatables: Seatable[] = [
    ...guests.map((g): Seatable => ({ kind: "guest", id: g.id, label: g.fullName, rsvpStatus: g.rsvpStatus })),
    ...people.map((p): Seatable => ({ kind: "person", id: p.id, label: p.fullName })),
    ...prestataires.map((p): Seatable => ({ kind: "prestataire", id: p.id, label: p.name })),
  ]

  const assignmentByKey = new Map(assignments.map((a) => [assignmentKey(a), a]))
  const unassigned = seatables.filter((s) => !assignmentByKey.has(keyFor(targetFor(s))))

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Non placés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {unassigned.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tout le monde est placé. 🎉</p>
          ) : (
            unassigned.map((seatable) => (
              <div key={`${seatable.kind}:${seatable.id}`} className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <Badge className={KIND_BADGES[seatable.kind].className}>{KIND_BADGES[seatable.kind].label}</Badge>
                  <span className="truncate text-sm text-foreground">{seatable.label}</span>
                </div>
                <Select onValueChange={(tableId) => onAssign(tableId, targetFor(seatable))}>
                  <SelectTrigger size="sm" className="w-28 shrink-0">
                    <SelectValue placeholder="Placer" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => {
                      const count = assignments.filter((a) => a.tableId === table.id).length
                      const full = count >= table.capacity
                      return (
                        <SelectItem key={table.id} value={table.id}>
                          <span className={full ? "text-destructive" : undefined}>
                            {table.name} ({count}/{table.capacity})
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tables.map((table) => {
          const tableAssignments = assignments.filter((a) => a.tableId === table.id)
          const overCapacity = tableAssignments.length > table.capacity
          return (
            <Card key={table.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-heading text-base">
                  {table.name}
                  <span className={cn("text-xs font-normal", overCapacity ? "text-destructive" : "text-muted-foreground")}>
                    {tableAssignments.length} / {table.capacity}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tableAssignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Personne assis ici.</p>
                ) : (
                  tableAssignments.map((assignment, index) => {
                    const seatable = seatables.find((s) => keyFor(targetFor(s)) === assignmentKey(assignment))
                    const isOverflow = index >= table.capacity
                    return (
                      <div key={assignment.id} className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                          {seatable ? (
                            <Badge className={KIND_BADGES[seatable.kind].className}>
                              {KIND_BADGES[seatable.kind].label}
                            </Badge>
                          ) : null}
                          <span
                            className={cn("truncate text-sm", isOverflow ? "font-medium text-destructive" : "text-foreground")}
                          >
                            {seatable?.label ?? "—"}
                          </span>
                          {seatable?.kind === "guest" && seatable.rsvpStatus && seatable.rsvpStatus !== "confirmed" ? (
                            <RsvpBadge status={seatable.rsvpStatus} />
                          ) : null}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onUnassign(assignment.id)}
                          aria-label="Retirer"
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
