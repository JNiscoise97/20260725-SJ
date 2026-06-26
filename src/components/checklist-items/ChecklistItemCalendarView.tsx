import { useMemo, useState } from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

import type { ChecklistItem } from "@/types/domain"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { ChecklistItemCard } from "@/components/checklist-items/ChecklistItemCard"

function effectiveDate(item: ChecklistItem) {
  return item.estimatedStartDate ?? item.estimatedEndDate ?? null
}

interface ChecklistItemCalendarViewProps {
  items: ChecklistItem[]
  onItemClick: (item: ChecklistItem) => void
}

export function ChecklistItemCalendarView({ items, onItemClick }: ChecklistItemCalendarViewProps) {
  const datesWithItems = useMemo(
    () => items.filter((item) => effectiveDate(item)).map((item) => parseISO(effectiveDate(item)!)),
    [items]
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const itemsForSelectedDate = selectedDate
    ? items.filter((item) => effectiveDate(item) && isSameDay(parseISO(effectiveDate(item)!), selectedDate))
    : []

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
      <Card className="w-fit">
        <CardContent>
          <Calendar
            mode="single"
            locale={fr}
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ hasItems: datesWithItems }}
            modifiersClassNames={{ hasItems: "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-bordeaux" }}
          />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
        </h3>
        {selectedDate && itemsForSelectedDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun item ce jour-là.</p>
        ) : null}
        {itemsForSelectedDate.map((item) => (
          <ChecklistItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
    </div>
  )
}
