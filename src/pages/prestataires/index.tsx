import { useMemo, useState } from "react"
import { Briefcase, Plus, Utensils } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { StatCard } from "@/components/shared/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePrestataires } from "@/hooks/queries/use-prestataires"
import { PrestataireCard } from "@/components/prestataires/PrestataireCard"
import { PrestataireFormDialog } from "@/components/prestataires/PrestataireFormDialog"
import type { Prestataire } from "@/types/domain"

export function PrestatairesPage() {
  const { data: prestataires, isLoading } = usePrestataires()
  const [search, setSearch] = useState("")
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Prestataire | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return prestataires ?? []
    return (prestataires ?? []).filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.company?.toLowerCase().includes(query) ||
        p.role?.toLowerCase().includes(query)
    )
  }, [prestataires, search])

  const needsMealCount = (prestataires ?? []).filter((p) => p.needsMeal).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prestataires"
        description="Photographe, vidéaste, DJ... et qui d'entre eux mange avec nous."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            Nouveau prestataire
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : !prestataires || prestataires.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Aucun prestataire pour l'instant"
          action={<Button onClick={() => setCreating(true)}>Nouveau prestataire</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard icon={Briefcase} label="Prestataires" value={prestataires.length} />
            <StatCard
              icon={Utensils}
              label="Mangent avec nous"
              value={needsMealCount}
              accentClassName="bg-vert-vegetal/15 text-vert-vegetal"
            />
          </div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un prestataire..."
            className="max-w-xs"
          />

          {filtered.length === 0 ? (
            <EmptyState icon={Briefcase} title="Aucun prestataire ne correspond à cette recherche" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((prestataire) => (
                <PrestataireCard key={prestataire.id} prestataire={prestataire} onSelect={setEditing} />
              ))}
            </div>
          )}
        </>
      )}

      <PrestataireFormDialog open={creating} onOpenChange={setCreating} />
      <PrestataireFormDialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} prestataire={editing} />
    </div>
  )
}
