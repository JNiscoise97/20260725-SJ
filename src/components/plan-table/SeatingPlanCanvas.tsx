import { useEffect, useMemo, useState } from "react"
import { DndContext, PointerSensor, useDraggable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { RotateCcw } from "lucide-react"

import type { Guest, Person, Prestataire, SeatingTable, TableAssignment } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TABLE_D = 110
const TABLE_R = TABLE_D / 2
const SEAT_D = 26
const SEAT_R = SEAT_D / 2
const ORBIT_R = TABLE_R + 8 + SEAT_R
const CONTAINER = ORBIT_R * 2 + SEAT_D
const CENTER = CONTAINER / 2

function seatPos(i: number, n: number) {
  const angle = (i / n) * 2 * Math.PI - Math.PI / 2
  return {
    left: Math.round(CENTER + Math.cos(angle) * ORBIT_R - SEAT_R),
    top: Math.round(CENTER + Math.sin(angle) * ORBIT_R - SEAT_R),
  }
}

function autoPos(index: number) {
  const cols = 4
  return {
    x: 100 + (index % cols) * 250,
    y: 100 + Math.floor(index / cols) * 270,
  }
}

function initials(label: string): string {
  const parts = label.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return label.slice(0, 2).toUpperCase()
}

type Seat = { label: string; kind: "guest" | "person" | "prestataire" }

function DraggableTable({
  table,
  pos,
  seats,
}: {
  table: SeatingTable
  pos: { x: number; y: number }
  seats: Seat[]
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: table.id })

  const style: React.CSSProperties = {
    position: "absolute",
    left: pos.x,
    top: pos.y,
    width: CONTAINER,
    height: CONTAINER,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 1,
    touchAction: "none",
    userSelect: "none",
  }

  const count = seats.length
  const cap = table.capacity
  const isOver = count > cap
  const isFull = cap > 0 && count === cap

  const slots = cap > 0 ? Array.from({ length: cap }, (_, i) => seats[i] ?? null) : []

  return (
    <div ref={setNodeRef} style={style}>
      {/* Seat dots */}
      {slots.map((seat, i) => {
        const { left, top } = seatPos(i, cap)
        const cls = seat
          ? seat.kind === "person"
            ? "bg-dore text-brun border-dore"
            : seat.kind === "prestataire"
            ? "bg-brun text-white border-brun"
            : "bg-bordeaux/80 text-white border-bordeaux"
          : "bg-muted/60 border-border"
        return (
          <div
            key={i}
            className={cn(
              "absolute flex items-center justify-center rounded-full border text-[9px] font-bold leading-none",
              cls,
            )}
            style={{ left, top, width: SEAT_D, height: SEAT_D }}
            title={seat?.label}
          >
            {seat ? initials(seat.label) : null}
          </div>
        )
      })}

      {/* Table circle (drag handle) */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute flex cursor-grab flex-col items-center justify-center rounded-full border-2 transition-colors active:cursor-grabbing",
          isOver
            ? "border-bordeaux bg-bordeaux/10"
            : isFull
            ? "border-vert-vegetal/60 bg-vert-vegetal/10"
            : count > 0
            ? "border-dore/50 bg-dore/5"
            : "border-border bg-card hover:border-muted-foreground/40",
          isDragging && "opacity-70 shadow-2xl",
        )}
        style={{
          left: CENTER - TABLE_R,
          top: CENTER - TABLE_R,
          width: TABLE_D,
          height: TABLE_D,
        }}
      >
        <p className="line-clamp-2 px-2 text-center text-xs font-semibold leading-tight text-foreground">
          {table.name}
        </p>
        <p className={cn("mt-0.5 text-[10px]", isOver ? "font-semibold text-bordeaux" : "text-muted-foreground")}>
          {count}&thinsp;/&thinsp;{cap}
        </p>
      </div>
    </div>
  )
}

interface Props {
  tables: SeatingTable[]
  assignments: TableAssignment[]
  guests: Guest[]
  people: Person[]
  prestataires: Prestataire[]
  onMoveTable: (id: string, posX: number, posY: number) => void
}

export function SeatingPlanCanvas({ tables, assignments, guests, people, prestataires, onMoveTable }: Props) {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const pos: Record<string, { x: number; y: number }> = {}
    tables.forEach((t, i) => {
      pos[t.id] = { x: t.posX ?? autoPos(i).x, y: t.posY ?? autoPos(i).y }
    })
    return pos
  })

  useEffect(() => {
    setPositions((prev) => {
      const next = { ...prev }
      tables.forEach((t, i) => {
        if (!(t.id in next)) next[t.id] = { x: t.posX ?? autoPos(i).x, y: t.posY ?? autoPos(i).y }
      })
      return next
    })
  }, [tables])

  const guestMap = useMemo(() => new Map(guests.map((g) => [g.id, g])), [guests])
  const personMap = useMemo(() => new Map(people.map((p) => [p.id, p])), [people])
  const prestataireMap = useMemo(() => new Map(prestataires.map((p) => [p.id, p])), [prestataires])

  const seatsByTable = useMemo(() => {
    const map = new Map<string, Seat[]>()
    for (const a of assignments) {
      const arr = map.get(a.tableId) ?? []
      if (a.guestId) {
        const g = guestMap.get(a.guestId)
        if (g) arr.push({ label: `${g.firstName} ${g.lastName}`, kind: "guest" })
      } else if (a.personId) {
        const p = personMap.get(a.personId)
        if (p) arr.push({ label: p.fullName, kind: "person" })
      } else if (a.prestataireId) {
        const p = prestataireMap.get(a.prestataireId)
        if (p) arr.push({ label: p.name, kind: "prestataire" })
      }
      map.set(a.tableId, arr)
    }
    return map
  }, [assignments, guestMap, personMap, prestataireMap])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event
    const id = String(active.id)
    const current = positions[id]
    if (!current) return
    const newX = Math.max(0, Math.round(current.x + delta.x))
    const newY = Math.max(0, Math.round(current.y + delta.y))
    setPositions((prev) => ({ ...prev, [id]: { x: newX, y: newY } }))
    onMoveTable(id, newX, newY)
  }

  function handleReset() {
    const next: Record<string, { x: number; y: number }> = {}
    tables.forEach((t, i) => {
      next[t.id] = autoPos(i)
      onMoveTable(t.id, next[t.id].x, next[t.id].y)
    })
    setPositions(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Glissez les tables pour les repositionner. Les sièges autour de chaque table indiquent les invités placés.
        </p>
        <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
          <RotateCcw className="size-3.5" />
          Réinitialiser
        </Button>
      </div>

      <div className="overflow-auto rounded-2xl border border-border">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="relative bg-card"
            style={{
              minWidth: 1200,
              minHeight: 700,
              backgroundImage:
                "radial-gradient(circle, color-mix(in srgb, currentColor 15%, transparent) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          >
            {tables.map((table, i) => (
              <DraggableTable
                key={table.id}
                table={table}
                pos={positions[table.id] ?? autoPos(i)}
                seats={seatsByTable.get(table.id) ?? []}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-bordeaux/70" /> Invité
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-dore" /> Fiancé(e)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full bg-brun" /> Prestataire
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full border border-border bg-muted/60" /> Siège libre
        </span>
      </div>
    </div>
  )
}
