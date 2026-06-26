import { format } from "date-fns"
import { fr } from "date-fns/locale"

import type { Checklist, ChecklistItem, Mission } from "@/types/domain"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { PriorityBadge } from "@/components/shared/PriorityBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ChecklistItemListViewProps {
  items: ChecklistItem[]
  checklistsById: Map<string, Checklist>
  missionsById: Map<string, Mission>
  onItemClick: (item: ChecklistItem) => void
}

function effectiveDate(item: ChecklistItem) {
  return item.estimatedStartDate ?? item.estimatedEndDate ?? null
}

export function ChecklistItemListView({
  items,
  checklistsById,
  missionsById,
  onItemClick,
}: ChecklistItemListViewProps) {
  const sorted = [...items].sort((a, b) => (effectiveDate(a) ?? "9999").localeCompare(effectiveDate(b) ?? "9999"))

  function missionTitleFor(item: ChecklistItem) {
    const checklist = checklistsById.get(item.checklistId)
    if (!checklist || checklist.ownerType !== "mission" || !checklist.ownerId) return null
    return missionsById.get(checklist.ownerId)?.title ?? null
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Mission</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Priorité</TableHead>
          <TableHead>Début</TableHead>
          <TableHead>Fin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((item) => (
          <TableRow key={item.id} onClick={() => onItemClick(item)} className="cursor-pointer">
            <TableCell className="font-medium text-foreground">{item.label}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{missionTitleFor(item) ?? "—"}</TableCell>
            <TableCell>
              <StatusBadge status={item.status} />
            </TableCell>
            <TableCell>
              <PriorityBadge priority={item.priority} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {item.estimatedStartDate ? format(new Date(item.estimatedStartDate), "d MMM yyyy", { locale: fr }) : "—"}
              {item.estimatedStartTime ? ` · ${item.estimatedStartTime}` : ""}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {item.estimatedEndDate ? format(new Date(item.estimatedEndDate), "d MMM yyyy", { locale: fr }) : "—"}
              {item.estimatedEndTime ? ` · ${item.estimatedEndTime}` : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
