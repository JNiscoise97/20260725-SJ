import { useEffect, useState } from "react"
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
import { Lock, LockOpen } from "lucide-react"

import type { EquipmentItem, EquipmentStatus } from "@/types/domain"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GuestNameAutocomplete } from "@/components/shared/GuestNameAutocomplete"
import { cn } from "@/lib/utils"

type KanbanStatus = EquipmentStatus | "__none__"

const COLUMNS: { id: KanbanStatus; label: string }[] = [
  { id: "__none__", label: "Non défini" },
  { id: "a_demander_lieu", label: "À demander au lieu" },
  { id: "fourni_lieu", label: "Fourni par le lieu" },
  { id: "apporte_invite", label: "Apporté par un invité" },
  { id: "a_louer", label: "À louer" },
  { id: "a_acheter", label: "À acheter" },
  { id: "achete", label: "Acheté" },
  { id: "a_fabriquer", label: "À fabriquer" },
]

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener("change", handler)
    setMobile(mq.matches)
    return () => mq.removeEventListener("change", handler)
  }, [breakpoint])
  return mobile
}

function statusOf(item: EquipmentItem): KanbanStatus {
  return item.status ?? "__none__"
}

function EquipmentCard({
  item,
  isLocked,
  onGuestNameChange,
}: {
  item: EquipmentItem
  isLocked: boolean
  onGuestNameChange: (id: string, name: string | null) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled: isLocked,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "touch-none rounded-lg border border-border bg-card px-3 py-2",
        isLocked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
      {...attributes}
      {...(isLocked ? {} : listeners)}
    >
      <p className="text-sm font-medium text-foreground">{item.label}</p>
      <Badge variant="outline" className="mt-1 text-xs font-normal text-muted-foreground">
        {item.category}
      </Badge>
      {item.notes ? <p className="mt-0.5 text-xs text-muted-foreground">{item.notes}</p> : null}
      {item.status === "apporte_invite" ? (
        <GuestNameAutocomplete
          className="mt-1.5"
          value={item.guestName ?? ""}
          onChange={(name) => onGuestNameChange(item.id, name || null)}
          stopPropagation
        />
      ) : null}
    </div>
  )
}

function KanbanColumn({
  column,
  items,
  isLocked,
  onGuestNameChange,
}: {
  column: { id: KanbanStatus; label: string }
  items: EquipmentItem[]
  isLocked: boolean
  onGuestNameChange: (id: string, name: string | null) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, disabled: isLocked })

  return (
    <div className="flex w-64 shrink-0 flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{column.label}</h3>
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-col gap-1.5 rounded-xl border border-border bg-muted/30 p-2 transition-shadow",
          !isLocked && isOver && "ring-2 ring-primary"
        )}
      >
        {items.map((item) => (
          <EquipmentCard
            key={item.id}
            item={item}
            isLocked={isLocked}
            onGuestNameChange={onGuestNameChange}
          />
        ))}
        {items.length === 0 ? (
          <p className="flex flex-1 items-center justify-center py-4 text-center text-xs text-muted-foreground">
            Aucun article
          </p>
        ) : null}
      </div>
    </div>
  )
}

interface MaterielKanbanProps {
  items: EquipmentItem[]
  onStatusChange: (id: string, status: EquipmentStatus | null) => void
  onGuestNameChange: (id: string, name: string | null) => void
}

export function MaterielKanban({ items, onStatusChange, onGuestNameChange }: MaterielKanbanProps) {
  const isMobile = useIsMobile()
  const [isLocked, setIsLocked] = useState(isMobile)
  const [activeItem, setActiveItem] = useState<EquipmentItem | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  // Verrouiller automatiquement à l'arrivée sur mobile, déverrouiller sur desktop
  useEffect(() => {
    setIsLocked(isMobile)
  }, [isMobile])

  const byColumn = new Map<KanbanStatus, EquipmentItem[]>(COLUMNS.map((c) => [c.id, []]))
  for (const item of items) byColumn.get(statusOf(item))?.push(item)

  function handleDragStart(event: DragStartEvent) {
    setActiveItem(items.find((i) => i.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    const { active, over } = event
    if (!over) return
    const targetStatus = over.id as KanbanStatus
    if (targetStatus === statusOf(items.find((i) => i.id === active.id)!)) return
    const newStatus: EquipmentStatus | null = targetStatus === "__none__" ? null : targetStatus
    onStatusChange(String(active.id), newStatus)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveItem(null)}
    >
      {/* Bouton cadenas — visible uniquement sur mobile */}
      <div className="mb-3 flex items-center justify-end md:hidden">
        <Button
          variant={isLocked ? "outline" : "secondary"}
          size="sm"
          onClick={() => setIsLocked((v) => !v)}
          className="gap-2"
        >
          {isLocked ? (
            <>
              <Lock className="size-4" />
              Déplacements verrouillés
            </>
          ) : (
            <>
              <LockOpen className="size-4" />
              Déplacements actifs
            </>
          )}
        </Button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4" style={{ minWidth: `${COLUMNS.length * 272}px` }}>
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              items={byColumn.get(col.id) ?? []}
              isLocked={isLocked}
              onGuestNameChange={onGuestNameChange}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="w-64 rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
            <p className="text-sm font-medium text-foreground">{activeItem.label}</p>
            <Badge variant="outline" className="mt-1 text-xs font-normal text-muted-foreground">
              {activeItem.category}
            </Badge>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
