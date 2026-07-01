import { Car, PartyPopper, Building2, Link2 } from "lucide-react"

import type { Guest } from "@/types/domain"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ACCOMMODATION_LABELS, TRAVEL_MODE_LABELS } from "@/lib/sejour"

interface GuestSejourCardProps {
  guest: Guest
  familyName?: string | null
  partnerName?: string | null
  onSelect: (guest: Guest) => void
}

export function GuestSejourCard({ guest, familyName, partnerName, onSelect }: GuestSejourCardProps) {
  return (
    <Card onClick={() => onSelect(guest)} className="cursor-pointer transition-colors hover:bg-muted/50">
      <CardContent className="space-y-2">
        <div>
          <span className="flex items-center gap-1.5">
            <p className="font-medium text-foreground">{guest.fullName}</p>
            {partnerName ? (
              <Tooltip>
                <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Inséparable de {partnerName} — mêmes informations de séjour</TooltipContent>
              </Tooltip>
            ) : null}
          </span>
          {familyName ? <p className="text-xs text-muted-foreground">{familyName}</p> : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant={guest.travelMode ? "default" : "outline"} className={guest.travelMode ? "" : "text-muted-foreground"}>
            {guest.travelMode ? TRAVEL_MODE_LABELS[guest.travelMode] : "Transport ?"}
          </Badge>
          <Badge
            variant={guest.accommodationType ? undefined : "outline"}
            className={guest.accommodationType ? "bg-dore/20 text-brun" : "text-muted-foreground"}
          >
            <Building2 className="size-3" />
            {guest.accommodationType ? ACCOMMODATION_LABELS[guest.accommodationType] : "Hébergement ?"}
          </Badge>
          {guest.hasVehicle ? (
            <Badge className="bg-vert-vegetal/15 text-vert-vegetal">
              <Car className="size-3" />
              Véhiculé
            </Badge>
          ) : null}
        </div>

        {guest.arrivalInfo || guest.departureInfo ? (
          <p className="text-xs text-muted-foreground">
            {guest.arrivalInfo ? `Arrivée : ${guest.arrivalInfo}` : "Arrivée non renseignée"}
            {guest.departureInfo ? ` · Départ : ${guest.departureInfo}` : ""}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Arrivée/départ non renseignés</p>
        )}

        {guest.attendingParentsAnniversary || guest.attendingMontpellierVisit ? (
          <div className="flex flex-wrap gap-1.5">
            {guest.attendingParentsAnniversary ? (
              <Badge variant="outline" className="gap-1">
                <PartyPopper className="size-3" />
                Anniversaire parents
              </Badge>
            ) : null}
            {guest.attendingMontpellierVisit ? (
              <Badge variant="outline" className="gap-1">
                <PartyPopper className="size-3" />
                Visite Montpellier
              </Badge>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
