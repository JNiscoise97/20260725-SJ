import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  useCreateRoleCategory,
  useDeleteRoleCategory,
  useRoleCategories,
  useUpdateRoleCategory,
} from "@/hooks/queries/use-role-categories"
import { usePeople } from "@/hooks/queries/use-people"
import type { RoleCategory } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const NONE = "__none__"

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function CategoryDialog({ category }: { category?: RoleCategory }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category?.name ?? "")
  const [primaryReferentId, setPrimaryReferentId] = useState(category?.primaryReferentId ?? NONE)
  const [secondaryReferentId, setSecondaryReferentId] = useState(category?.secondaryReferentId ?? NONE)
  const { data: people } = usePeople()
  const referents = people?.filter((p) => p.role === "referent") ?? []
  const createCategory = useCreateRoleCategory()
  const updateCategory = useUpdateRoleCategory()

  async function handleSubmit() {
    if (!name.trim()) return
    const referentPatch = {
      primaryReferentId: primaryReferentId === NONE ? null : primaryReferentId,
      secondaryReferentId: secondaryReferentId === NONE ? null : secondaryReferentId,
    }
    if (category) {
      await updateCategory.mutateAsync({ id: category.id, patch: { name, slug: slugify(name), ...referentPatch } })
      toast.success("Catégorie mise à jour.")
    } else {
      await createCategory.mutateAsync({ name, slug: slugify(name), sortOrder: 99, ...referentPatch })
      toast.success("Catégorie créée.")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {category ? (
          <Button variant="ghost" size="icon-xs" aria-label="Modifier">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" />
            Nouvelle catégorie
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="category-name">Nom</FieldLabel>
            <Input
              id="category-name"
              placeholder="Ex. Fleuriste"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Référent principal</FieldLabel>
            <Select value={primaryReferentId} onValueChange={setPrimaryReferentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucun</SelectItem>
                {referents.map((referent) => (
                  <SelectItem key={referent.id} value={referent.id}>
                    {referent.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Référent secondaire</FieldLabel>
            <Select value={secondaryReferentId} onValueChange={setSecondaryReferentId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Aucun</SelectItem>
                {referents.map((referent) => (
                  <SelectItem key={referent.id} value={referent.id}>
                    {referent.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>{category ? "Enregistrer" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function RoleCategoryManager() {
  const { data: categories, isLoading } = useRoleCategories()
  const { data: people } = usePeople()
  const deleteCategory = useDeleteRoleCategory()

  function referentName(id?: string | null) {
    return id ? people?.find((p) => p.id === id)?.fullName : undefined
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-heading text-base">Catégories de référents</CardTitle>
        <CategoryDialog />
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : (
          categories?.map((category) => {
            const primaryName = referentName(category.primaryReferentId)
            const secondaryName = referentName(category.secondaryReferentId)
            return (
              <div key={category.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-sm text-foreground">{category.name}</span>
                  {primaryName || secondaryName ? (
                    <span className="text-xs text-muted-foreground">
                      {primaryName ? `Principal : ${primaryName}` : "Pas de référent principal"}
                      {secondaryName ? ` · Secondaire : ${secondaryName}` : ""}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <CategoryDialog category={category} />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Supprimer"
                    onClick={() => deleteCategory.mutate(category.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
