import { useMemo } from "react"
import { Truck } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLogistiqueItems } from "@/hooks/queries/use-logistique-items"
import { useDomaines } from "@/hooks/queries/use-domaines"
import { usePeople } from "@/hooks/queries/use-people"
import { useDocuments } from "@/hooks/queries/use-documents"
import { LogistiqueItemCard } from "@/components/logistique/LogistiqueItemCard"

export function LogistiquePage() {
  const { data: items, isLoading: itemsLoading } = useLogistiqueItems()
  const { data: domaines, isLoading: domainesLoading } = useDomaines()
  const { data: people } = usePeople()
  const { data: documents } = useDocuments()

  const isLoading = itemsLoading || domainesLoading

  const categoriesWithItems = useMemo(() => {
    if (!items || !domaines) return []
    return domaines
      .map((category) => ({
        category,
        items: items.filter((item) => item.domaineId === category.id),
      }))
      .filter((group) => group.items.length > 0)
  }, [items, domaines])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logistique"
        description="Boissons, décoration, transport, matériel et prestataires."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : categoriesWithItems.length === 0 ? (
        <EmptyState icon={Truck} title="Aucun élément de logistique" />
      ) : (
        <Tabs defaultValue={categoriesWithItems[0].category.id}>
          <TabsList>
            {categoriesWithItems.map(({ category }) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categoriesWithItems.map(({ category, items: categoryItems }) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryItems.map((item) => (
                  <LogistiqueItemCard
                    key={item.id}
                    item={item}
                    responsable={(people ?? []).find((p) => p.id === item.responsableId)}
                    documents={(documents ?? []).filter((doc) => doc.category === category.name)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
