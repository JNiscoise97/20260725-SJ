import { useRef, useState } from "react"

import { useGuests } from "@/hooks/queries/use-guests"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface GuestNameAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  /** Arrêter la propagation des événements pointeur (utile quand le parent est draggable). */
  stopPropagation?: boolean
}

export function GuestNameAutocomplete({
  value,
  onChange,
  placeholder = "Qui ?",
  className,
  stopPropagation = false,
}: GuestNameAutocompleteProps) {
  const { data: guests } = useGuests()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const query = value.trim().toLowerCase()
  const suggestions =
    query.length >= 3
      ? (guests ?? [])
          .filter((g) => g.fullName.toLowerCase().includes(query))
          .slice(0, 8)
      : []

  function handlePointer(e: React.PointerEvent) {
    if (stopPropagation) e.stopPropagation()
  }
  function handleClick(e: React.MouseEvent) {
    if (stopPropagation) e.stopPropagation()
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="h-7 text-xs"
        onPointerDown={handlePointer}
        onClick={handleClick}
      />
      {open && suggestions.length > 0 ? (
        <ul
          className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          onPointerDown={(e) => e.preventDefault()}
        >
          {suggestions.map((g) => (
            <li
              key={g.id}
              className="cursor-pointer px-3 py-1.5 text-xs hover:bg-muted"
              onClick={(e) => {
                if (stopPropagation) e.stopPropagation()
                onChange(g.fullName)
                setOpen(false)
              }}
            >
              {g.fullName}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
