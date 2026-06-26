import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"

import type { ChecklistItem, ProgressStatus } from "@/types/domain"
import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAllChecklistItems, useAllChecklists, useUpdateChecklistItem } from "@/hooks/queries/use-checklists"
import { useMissions } from "@/hooks/queries/use-missions"
import { ChecklistItemListView } from "@/components/checklist-items/ChecklistItemListView"
import { ChecklistItemKanban } from "@/components/checklist-items/ChecklistItemKanban"
import { ChecklistItemCalendarView } from "@/components/checklist-items/ChecklistItemCalendarView"
import { ChecklistItemFormDialog } from "@/components/checklist-items/ChecklistItemFormDialog"

export function TasksPage() {
  const { data: items, isLoading } = useAllChecklistItems()
  const { data: checklists } = useAllChecklists()
  const { data: missions } = useMissions()
  const updateItem = useUpdateChecklistItem()

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null)

  const checklistsById = useMemo(() => new Map((checklists ?? []).map((c) => [c.id, c])), [checklists])
  const missionsById = useMemo(() => new Map((missions ?? []).map((m) => [m.id, m])), [missions])

  const filteredItems = useMemo(() => {
    if (!items) return []
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => item.label.toLowerCase().includes(query))
  }, [items, search])

  function openCreateDialog() {
    setEditingItem(null)
    setDialogOpen(true)
  }

  function openEditDialog(item: ChecklistItem) {
    setEditingItem(item)
    setDialogOpen(true)
  }

  function handleStatusChange(item: ChecklistItem, status: ProgressStatus) {
    updateItem.mutate({ id: item.id, patch: { status, isDone: status === "done" } })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tâches"
        description="Tous les items à accomplir avant le jour J."
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="size-4" />
            Nouvel item
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un item..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="Aucun item pour l'instant"
          description="Créez votre premier item pour commencer."
          action={<Button onClick={openCreateDialog}>Nouvel item</Button>}
        />
      ) : (
        <Tabs defaultValue="liste">
          <TabsList>
            <TabsTrigger value="liste">Liste</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          </TabsList>
          <TabsContent value="liste">
            <ChecklistItemListView
              items={filteredItems}
              checklistsById={checklistsById}
              missionsById={missionsById}
              onItemClick={openEditDialog}
            />
          </TabsContent>
          <TabsContent value="kanban">
            <ChecklistItemKanban
              items={filteredItems}
              onItemClick={openEditDialog}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
          <TabsContent value="calendrier">
            <ChecklistItemCalendarView items={filteredItems} onItemClick={openEditDialog} />
          </TabsContent>
        </Tabs>
      )}

      <ChecklistItemFormDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editingItem} />
    </div>
  )
}
