import { useMemo, useState } from "react"
import { FolderOpen } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useIdentity } from "@/context/IdentityContext"
import { usePermissions } from "@/hooks/use-permissions"
import { useDocuments } from "@/hooks/queries/use-documents"
import { DocumentCard } from "@/components/documents/DocumentCard"
import { DocumentUploadDialog } from "@/components/documents/DocumentUploadDialog"

export function DocumentsPage() {
  const { person } = useIdentity()
  const { can } = usePermissions()
  const { data: documents, isLoading } = useDocuments()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const visibleDocuments = useMemo(() => {
    if (!documents || !person) return []
    return documents.filter((doc) => doc.visibleToRoles.includes(person.role))
  }, [documents, person])

  const categories = useMemo(
    () => Array.from(new Set(visibleDocuments.map((doc) => doc.category).filter(Boolean))) as string[],
    [visibleDocuments]
  )

  const filteredDocuments = activeCategory
    ? visibleDocuments.filter((doc) => doc.category === activeCategory)
    : visibleDocuments

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Tous les documents utiles à l'organisation."
        actions={can("manage:documents") ? <DocumentUploadDialog /> : undefined}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : visibleDocuments.length === 0 ? (
        <EmptyState icon={FolderOpen} title="Aucun document pour l'instant" />
      ) : (
        <>
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={activeCategory === null ? "default" : "outline"}
                onClick={() => setActiveCategory(null)}
              >
                Tous
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
