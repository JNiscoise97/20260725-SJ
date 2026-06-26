import { useNavigate } from "react-router-dom"

import type { Guest, GuestGroup } from "@/types/domain"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RsvpBadge } from "@/components/invites/RsvpBadge"

interface GuestTableProps {
  guests: Guest[]
  groupsById: Map<string, GuestGroup>
}

export function GuestTable({ guests, groupsById }: GuestTableProps) {
  const navigate = useNavigate()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invité</TableHead>
          <TableHead>Famille</TableHead>
          <TableHead>Présence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.map((guest) => (
          <TableRow
            key={guest.id}
            onClick={() => navigate(`/invites/${guest.id}`)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell className="font-medium text-foreground">{guest.fullName}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {guest.groupId ? groupsById.get(guest.groupId)?.familyName : "—"}
            </TableCell>
            <TableCell>
              <RsvpBadge status={guest.rsvpStatus} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
