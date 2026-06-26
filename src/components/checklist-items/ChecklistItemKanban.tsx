import type { ChecklistItem, ProgressStatus } from "@/types/domain"
import { ChecklistItemCard } from "@/components/checklist-items/ChecklistItemCard"

const COLUMNS: { status: ProgressStatus; label: string }[] = [
  { status: "todo", label: "À faire" },
  { status: "in_progress", label: "En cours" },
  { status: "done", label: "Terminée" },
  { status: "blocked", label: "Bloquée" },
]

interface ChecklistItemKanbanProps {
  items: ChecklistItem[]
  onItemClick: (item: ChecklistItem) => void
  onStatusChange: (item: ChecklistItem, status: ProgressStatus) => void
}

export function ChecklistItemKanban({ items, onItemClick, onStatusChange }: ChecklistItemKanbanProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((column) => {
        const columnItems = items.filter((item) => item.status === column.status)
        return (
          <div key={column.status} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
              <span className="text-xs text-muted-foreground">{columnItems.length}</span>
            </div>
            <div className="space-y-3">
              {columnItems.map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick(item)}
                  onStatusChange={(status) => onStatusChange(item, status)}
                />
              ))}
              {columnItems.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Aucun item
                </p>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
