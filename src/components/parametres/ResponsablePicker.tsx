import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { usePeople } from "@/hooks/queries/use-people"
import { useGuests } from "@/hooks/queries/use-guests"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export interface ResponsableSelection {
  personId?: string | null
  guestId?: string | null
}

interface ResponsablePickerProps {
  onSelect: (selection: ResponsableSelection) => void
  placeholder?: string
  /** Personnes déjà responsables du domaine — exclues de la liste pour éviter les doublons. */
  excludePersonIds?: string[]
  excludeGuestIds?: string[]
}

export function ResponsablePicker({
  onSelect,
  placeholder = "Choisir un responsable...",
  excludePersonIds = [],
  excludeGuestIds = [],
}: ResponsablePickerProps) {
  const [open, setOpen] = useState(false)
  const { data: people } = usePeople()
  const { data: guests } = useGuests()

  const fiances = (people ?? []).filter((p) => !excludePersonIds.includes(p.id))
  // N'importe quel invité peut être délégué : c'est l'affectation qui en fait
  // un référent (voir identity.service.ts), pas un statut préexistant.
  const eligibleGuests = (guests ?? []).filter((g) => !excludeGuestIds.includes(g.id))

  function handleSelect(selection: ResponsableSelection) {
    onSelect(selection)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {placeholder}
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Rechercher un fiancé ou un invité..." />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            {fiances.length > 0 ? (
              <CommandGroup heading="Fiancés">
                {fiances.map((person) => (
                  <CommandItem
                    key={person.id}
                    value={person.fullName}
                    onSelect={() => handleSelect({ personId: person.id })}
                  >
                    <Check className={cn("size-4", "opacity-0")} />
                    {person.fullName}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {eligibleGuests.length > 0 ? (
              <CommandGroup heading="Invités">
                {eligibleGuests.map((guest) => (
                  <CommandItem
                    key={guest.id}
                    value={guest.fullName}
                    onSelect={() => handleSelect({ guestId: guest.id })}
                  >
                    <Check className={cn("size-4", "opacity-0")} />
                    {guest.fullName}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
