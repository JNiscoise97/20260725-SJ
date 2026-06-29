import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { GripVertical, Link2, TriangleAlert, X } from "lucide-react"

import type { Guest, Person, Prestataire, SeatingTable, TableAssignment } from "@/types/domain"
import type { SeatTarget } from "@/services/seating.service"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RsvpBadge } from "@/components/invites/RsvpBadge"

type SeatableKind = "guest" | "person" | "prestataire"

interface Seatable {
  kind: SeatableKind
  id: string
  label: string
  rsvpStatus?: Guest["rsvpStatus"]
  /** Invité "inséparable" d'un autre — voir 0045_guests_paired_with.sql. `sameTable` vaut faux si le partenaire est ailleurs ou pas encore placé. */
  pairInfo?: { partnerName: string; sameTable: boolean }
}

interface DragData {
  seatable: Seatable
  assignmentId?: string
}

const UNASSIGNED_ZONE = "__unassigned__"

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

function dragIdFor(seatable: Seatable) {
  return `seatable:${seatable.kind}:${seatable.id}`
}

function SeatableLabel({
  seatable,
  isOverflow,
  showRsvpBadge = true,
}: {
  seatable: Seatable
  isOverflow?: boolean
  showRsvpBadge?: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Badge className={KIND_BADGES[seatable.kind].className}>{KIND_BADGES[seatable.kind].label}</Badge>
      <span className={cn("truncate text-sm", isOverflow ? "font-medium text-destructive" : "text-foreground")}>
        {seatable.label}
      </span>
      {seatable.pairInfo ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {seatable.pairInfo.sameTable ? (
              <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <TriangleAlert className="size-3.5 shrink-0 text-destructive" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {seatable.pairInfo.sameTable
              ? `Inséparable de ${seatable.pairInfo.partnerName} (même table)`
              : `Inséparable de ${seatable.pairInfo.partnerName} — pas encore réunis`}
          </TooltipContent>
        </Tooltip>
      ) : null}
      {showRsvpBadge && seatable.kind === "guest" && seatable.rsvpStatus && seatable.rsvpStatus !== "confirmed" ? (
        <RsvpBadge status={seatable.rsvpStatus} />
      ) : null}
    </div>
  )
}

function DragHandle({
  attributes,
  listeners,
}: {
  attributes: ReturnType<typeof useDraggable>["attributes"]
  listeners: ReturnType<typeof useDraggable>["listeners"]
}) {
  return (
    <button
      type="button"
      aria-label="Déplacer"
      className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-3.5" />
    </button>
  )
}

function UnassignedRow({
  seatable,
  tables,
  assignments,
  onAssign,
}: {
  seatable: Seatable
  tables: SeatingTable[]
  assignments: TableAssignment[]
  onAssign: (tableId: string, target: SeatTarget) => void
}) {
  const data: DragData = { seatable }
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: dragIdFor(seatable), data })

  return (
    <div ref={setNodeRef} className={cn("flex items-center justify-between gap-2", isDragging && "opacity-40")}>
      <div className="flex min-w-0 items-center gap-1.5">
        <DragHandle attributes={attributes} listeners={listeners} />
        <SeatableLabel seatable={seatable} showRsvpBadge={false} />
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
  )
}

function AssignedRow({
  assignment,
  seatable,
  isOverflow,
  onUnassign,
}: {
  assignment: TableAssignment
  seatable?: Seatable
  isOverflow: boolean
  onUnassign: (assignmentId: string) => void
}) {
  const data: DragData | undefined = seatable ? { seatable, assignmentId: assignment.id } : undefined
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: seatable ? dragIdFor(seatable) : assignment.id,
    data,
    disabled: !seatable,
  })

  return (
    <div ref={setNodeRef} className={cn("flex items-center justify-between gap-2", isDragging && "opacity-40")}>
      <div className="flex min-w-0 items-center gap-1.5">
        {seatable ? <DragHandle attributes={attributes} listeners={listeners} /> : null}
        {seatable ? <SeatableLabel seatable={seatable} isOverflow={isOverflow} /> : <span className="text-sm">—</span>}
      </div>
      <Button variant="ghost" size="icon-xs" onClick={() => onUnassign(assignment.id)} aria-label="Retirer">
        <X className="size-3.5" />
      </Button>
    </div>
  )
}

function DropZone({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className={cn("rounded-xl transition-shadow", isOver && "ring-2 ring-primary")}>
      {children}
    </div>
  )
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
  const [activeSeatable, setActiveSeatable] = useState<Seatable | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const assignmentByKey = new Map(assignments.map((a) => [assignmentKey(a), a]))
  const guestById = new Map(guests.map((g) => [g.id, g]))

  function tableIdForGuest(guestId: string) {
    return assignmentByKey.get(keyFor({ guestId }))?.tableId
  }

  function pairInfoFor(guest: Guest): Seatable["pairInfo"] {
    if (!guest.pairedWithId) return undefined
    const partner = guestById.get(guest.pairedWithId)
    if (!partner) return undefined
    const myTableId = tableIdForGuest(guest.id)
    const partnerTableId = tableIdForGuest(partner.id)
    return { partnerName: partner.fullName, sameTable: myTableId !== undefined && myTableId === partnerTableId }
  }

  const seatables: Seatable[] = [
    ...guests.map((g): Seatable => ({
      kind: "guest",
      id: g.id,
      label: g.fullName,
      rsvpStatus: g.rsvpStatus,
      pairInfo: pairInfoFor(g),
    })),
    ...people.map((p): Seatable => ({ kind: "person", id: p.id, label: p.fullName })),
    ...prestataires.map((p): Seatable => ({ kind: "prestataire", id: p.id, label: p.name })),
  ]

  const unassigned = seatables.filter((s) => !assignmentByKey.has(keyFor(targetFor(s))))

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DragData | undefined
    setActiveSeatable(data?.seatable ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveSeatable(null)
    const { active, over } = event
    if (!over) return
    const data = active.data.current as DragData | undefined
    if (!data) return
    if (over.id === UNASSIGNED_ZONE) {
      if (data.assignmentId) onUnassign(data.assignmentId)
      return
    }
    onAssign(String(over.id), targetFor(data.seatable))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveSeatable(null)}
    >
      <div className="space-y-4">
        <DropZone id={UNASSIGNED_ZONE}>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-base">Non placés</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {unassigned.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tout le monde est placé. 🎉</p>
              ) : (
                unassigned.map((seatable) => (
                  <UnassignedRow
                    key={`${seatable.kind}:${seatable.id}`}
                    seatable={seatable}
                    tables={tables}
                    assignments={assignments}
                    onAssign={onAssign}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </DropZone>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tables.map((table) => {
            const tableAssignments = assignments.filter((a) => a.tableId === table.id)
            const overCapacity = tableAssignments.length > table.capacity
            return (
              <DropZone key={table.id} id={table.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between font-heading text-base">
                      {table.name}
                      <span
                        className={cn("text-xs font-normal", overCapacity ? "text-destructive" : "text-muted-foreground")}
                      >
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
                        return (
                          <AssignedRow
                            key={assignment.id}
                            assignment={assignment}
                            seatable={seatable}
                            isOverflow={index >= table.capacity}
                            onUnassign={onUnassign}
                          />
                        )
                      })
                    )}
                  </CardContent>
                </Card>
              </DropZone>
            )
          })}
        </div>
      </div>

      <DragOverlay>
        {activeSeatable ? (
          <div className="rounded-lg border border-border bg-card px-2 py-1.5 shadow-lg">
            <SeatableLabel seatable={activeSeatable} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
