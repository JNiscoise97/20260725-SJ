import { toast } from "sonner"

import { useCreateDomaineResponsable, useDeleteDomaineResponsable, useDomaineResponsables } from "@/hooks/queries/use-domaine-responsables"
import { usePeople } from "@/hooks/queries/use-people"
import { useGuests } from "@/hooks/queries/use-guests"
import type { Domaine } from "@/types/domain"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const NONE = "__none__"

/**
 * Source de vérité unique pour le responsable d'un domaine : reflète l'unique
 * responsable actuel (principal) et le remplace au changement — plus de
 * pastilles séparées à maintenir en plus du select.
 */
export function DomaineResponsableSelect({ domaine, className }: { domaine: Domaine; className?: string }) {
  const { data: people } = usePeople()
  const { data: guests } = useGuests()
  const { data: responsables } = useDomaineResponsables()
  const createResponsable = useCreateDomaineResponsable()
  const deleteResponsable = useDeleteDomaineResponsable()
  const domaineResponsables = (responsables ?? []).filter((r) => r.domaineId === domaine.id)
  const current = domaineResponsables.find((r) => r.rank === "principal") ?? domaineResponsables[0]
  const currentValue = current ? `${current.personId ? "person" : "guest"}:${current.personId ?? current.guestId}` : NONE
  const fiances = people ?? []
  const referents = (guests ?? []).filter((g) => g.assignable)

  async function handleChange(value: string) {
    await Promise.all(domaineResponsables.map((r) => deleteResponsable.mutateAsync(r.id)))
    if (value === NONE) return
    const [kind, id] = value.split(":")
    await createResponsable.mutateAsync({
      domaineId: domaine.id,
      rank: "principal",
      ...(kind === "guest" ? { guestId: id } : { personId: id }),
    })
    toast.success("Responsable mis à jour.")
  }

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger size="sm" className={cn("h-6 w-44 border-dashed text-xs", className)}>
        <SelectValue placeholder="Assigner..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>Non assigné</SelectItem>
        {fiances.length > 0 ? (
          <SelectGroup>
            <SelectLabel>Fiancés</SelectLabel>
            {fiances.map((person) => (
              <SelectItem key={person.id} value={`person:${person.id}`}>
                {person.fullName}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : null}
        {referents.length > 0 ? (
          <SelectGroup>
            <SelectLabel>Référents</SelectLabel>
            {referents.map((g) => (
              <SelectItem key={g.id} value={`guest:${g.id}`}>
                {g.fullName}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : null}
      </SelectContent>
    </Select>
  )
}
