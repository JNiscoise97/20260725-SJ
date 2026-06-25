import type { Guest, GuestGroup } from "@/types/domain"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RsvpBadge } from "@/components/invites/RsvpBadge"

interface GuestTableProps {
  guests: Guest[]
  groupsById: Map<string, GuestGroup>
}

export function GuestTable({ guests, groupsById }: GuestTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invité</TableHead>
          <TableHead>Famille</TableHead>
          <TableHead>Présence</TableHead>
          <TableHead>Contraintes</TableHead>
          <TableHead>+1</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow key={guest.id}>
            <TableCell className="font-medium text-foreground">{guest.fullName}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {guest.groupId ? groupsById.get(guest.groupId)?.familyName : "—"}
            </TableCell>
            <TableCell>
              <RsvpBadge status={guest.rsvpStatus} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{guest.dietaryConstraints ?? "—"}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{guest.plusOne ? "Oui" : "Non"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
