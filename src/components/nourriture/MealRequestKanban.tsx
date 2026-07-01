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

import type { Guest } from "@/types/domain"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MEAL_CHOICE_LABELS } from "@/lib/meal-choice"

type RequestStatus = "to_ask" | "asked" | "answered"

const COLUMNS: { status: RequestStatus; label: string }[] = [
  { status: "to_ask", label: "À demander" },
  { status: "asked", label: "Demandé" },
  { status: "answered", label: "Répondu" },
]

function statusFor(guest: Guest): RequestStatus {
  if (guest.mealChoice) return "answered"
  if (guest.mealMessageSent) return "asked"
  return "to_ask"
}

function GuestRequestCard({ guest, onSelect }: { guest: Guest; onSelect: (guest: Guest) => void }) {
  const status = statusFor(guest)
  const draggable = status !== "answered"
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: guest.id, disabled: !draggable })

  return (
    <div
      ref={setNodeRef}
      {...(draggable ? attributes : {})}
      {...(draggable ? listeners : {})}
      onClick={() => onSelect(guest)}
      className={cn(
        "rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/50",
        draggable ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-pointer",
        isDragging && "opacity-40"
      )}
    >
      <p className="font-medium text-foreground">{guest.fullName}</p>
      {guest.mealChoice ? (
        <Badge variant="outline" className="mt-1 text-xs">
          {MEAL_CHOICE_LABELS[guest.mealChoice] ?? guest.mealChoice}
        </Badge>
      ) : null}
    </div>
  )
}

function KanbanColumn({
  status,
  label,
  guests,
  onSelect,
}: {
  status: RequestStatus
  label: string
  guests: Guest[]
  onSelect: (guest: Guest) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status, disabled: status === "answered" })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3 transition-shadow",
        isOver && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-medium text-foreground">{label}</h3>
        <span className="text-xs text-muted-foreground">{guests.length}</span>
      </div>
      <div className="space-y-2">
        {guests.map((guest) => (
          <GuestRequestCard key={guest.id} guest={guest} onSelect={onSelect} />
        ))}
        {guests.length === 0 ? (
          <p className="px-1 py-3 text-center text-xs text-muted-foreground">Aucun invité</p>
        ) : null}
      </div>
    </div>
  )
}

interface MealRequestKanbanProps {
  guests: Guest[]
  onUpdateMessageSent: (guestId: string, mealMessageSent: boolean) => void
  onSelectGuest: (guest: Guest) => void
}

/**
 * Suivi du processus de demande de choix de repas, distinct du plat lui-même
 * (vu dans les autres onglets) : "Répondu" se déduit de `mealChoice` et ne
 * peut être atteint que via la fiche (clic sur la carte), pas par glisser-
 * déposer — on ne peut pas "répondre" sans choisir un plat.
 */
export function MealRequestKanban({ guests, onUpdateMessageSent, onSelectGuest }: MealRequestKanbanProps) {
  const [activeGuest, setActiveGuest] = useState<Guest | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const guestsByStatus: Record<RequestStatus, Guest[]> = { to_ask: [], asked: [], answered: [] }
  for (const guest of guests) guestsByStatus[statusFor(guest)].push(guest)

  function handleDragStart(event: DragStartEvent) {
    setActiveGuest(guests.find((g) => g.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveGuest(null)
    const { active, over } = event
    if (!over) return
    const guest = guests.find((g) => g.id === active.id)
    if (!guest) return
    const targetStatus = over.id as RequestStatus
    if (targetStatus === statusFor(guest)) return
    onUpdateMessageSent(guest.id, targetStatus === "asked")
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveGuest(null)}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            guests={guestsByStatus[col.status]}
            onSelect={onSelectGuest}
          />
        ))}
      </div>
      <DragOverlay>
        {activeGuest ? (
          <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-lg">
            {activeGuest.fullName}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
