import { X } from "lucide-react"

import type { Guest, SeatingTable, TableAssignment } from "@/types/domain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SeatingPlanBoardProps {
  tables: SeatingTable[]
  guests: Guest[]
  assignments: TableAssignment[]
  onAssign: (tableId: string, guestId: string) => void
  onUnassign: (guestId: string) => void
}

export function SeatingPlanBoard({ tables, guests, assignments, onAssign, onUnassign }: SeatingPlanBoardProps) {
  const guestsById = new Map(guests.map((g) => [g.id, g]))
  const assignedGuestIds = new Set(assignments.map((a) => a.guestId))
  const unassignedGuests = guests.filter((g) => !assignedGuestIds.has(g.id))

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Invités non placés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {unassignedGuests.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tout le monde est placé. 🎉</p>
          ) : (
            unassignedGuests.map((guest) => (
              <div key={guest.id} className="flex items-center justify-between gap-2">
                <span className="text-sm text-foreground">{guest.fullName}</span>
                <Select onValueChange={(tableId) => onAssign(tableId, guest.id)}>
                  <SelectTrigger size="sm" className="w-28">
                    <SelectValue placeholder="Placer" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => {
                      const count = assignments.filter((a) => a.tableId === table.id).length
                      const full = count >= table.capacity
                      return (
                        <SelectItem key={table.id} value={table.id} disabled={full}>
                          {table.name} ({count}/{table.capacity})
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
          return (
            <Card key={table.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-heading text-base">
                  {table.name}
                  <span className="text-xs font-normal text-muted-foreground">
                    {tableAssignments.length} / {table.capacity}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tableAssignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun invité assis.</p>
                ) : (
                  tableAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-foreground">
                        {guestsById.get(assignment.guestId)?.fullName ?? "—"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onUnassign(assignment.guestId)}
                        aria-label="Retirer"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
