import { useState } from "react"
import { toast } from "sonner"
import { Link2 } from "lucide-react"

import type { AccommodationType, Guest, TravelMode } from "@/types/domain"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ACCOMMODATION_LABELS, TRAVEL_MODE_LABELS } from "@/lib/sejour"

const NONE = "__none__"

export interface GuestSejourPatch {
  arrivalInfo: string | null
  departureInfo: string | null
  accommodationType: AccommodationType | null
  accommodation: string | null
  travelMode: TravelMode | null
  hasVehicle: boolean
  attendingParentsAnniversary: boolean
  attendingMontpellierVisit: boolean
}

interface GuestSejourFormProps {
  guest: Guest
  partnerName?: string | null
  onSave: (patch: GuestSejourPatch) => Promise<void>
  onClose: () => void
}

function GuestSejourForm({ guest, partnerName, onSave, onClose }: GuestSejourFormProps) {
  const [arrivalInfo, setArrivalInfo] = useState(guest.arrivalInfo ?? "")
  const [departureInfo, setDepartureInfo] = useState(guest.departureInfo ?? "")
  const [accommodationType, setAccommodationType] = useState(guest.accommodationType ?? NONE)
  const [accommodation, setAccommodation] = useState(guest.accommodation ?? "")
  const [travelMode, setTravelMode] = useState(guest.travelMode ?? NONE)
  const [hasVehicle, setHasVehicle] = useState(guest.hasVehicle)
  const [attendingParentsAnniversary, setAttendingParentsAnniversary] = useState(guest.attendingParentsAnniversary)
  const [attendingMontpellierVisit, setAttendingMontpellierVisit] = useState(guest.attendingMontpellierVisit)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    try {
      await onSave({
        arrivalInfo: arrivalInfo.trim() || null,
        departureInfo: departureInfo.trim() || null,
        accommodationType: accommodationType === NONE ? null : (accommodationType as AccommodationType),
        accommodation: accommodation.trim() || null,
        travelMode: travelMode === NONE ? null : (travelMode as TravelMode),
        hasVehicle,
        attendingParentsAnniversary,
        attendingMontpellierVisit,
      })
      toast.success(partnerName ? `${guest.fullName} et ${partnerName} mis à jour.` : `${guest.fullName} mis à jour.`)
      onClose()
    } catch {
      toast.error("Échec de l'enregistrement.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading">{guest.fullName}</DialogTitle>
      </DialogHeader>
      {partnerName ? (
        <p className="-mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link2 className="size-3.5 shrink-0" />
          Inséparable de {partnerName} — ces informations lui seront aussi appliquées.
        </p>
      ) : null}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="sejour-arrival">Arrivée à Montpellier</FieldLabel>
          <Input
            id="sejour-arrival"
            value={arrivalInfo}
            onChange={(e) => setArrivalInfo(e.target.value)}
            placeholder="Ex. Vendredi 18h"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sejour-departure">Départ de Montpellier (optionnel)</FieldLabel>
          <Input
            id="sejour-departure"
            value={departureInfo}
            onChange={(e) => setDepartureInfo(e.target.value)}
            placeholder="Ex. Dimanche 12h"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="sejour-travel-mode">Moyen de transport</FieldLabel>
          <Select value={travelMode} onValueChange={setTravelMode}>
            <SelectTrigger id="sejour-travel-mode" className="w-full">
              <SelectValue placeholder="Non renseigné" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Non renseigné</SelectItem>
              {(Object.keys(TRAVEL_MODE_LABELS) as TravelMode[]).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {TRAVEL_MODE_LABELS[mode]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="sejour-accommodation-type">Type d'hébergement</FieldLabel>
          <Select value={accommodationType} onValueChange={setAccommodationType}>
            <SelectTrigger id="sejour-accommodation-type" className="w-full">
              <SelectValue placeholder="Non renseigné" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Non renseigné</SelectItem>
              {(Object.keys(ACCOMMODATION_LABELS) as AccommodationType[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {ACCOMMODATION_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="sejour-accommodation-detail">Détail (nom de l'hôtel, quartier, adresse...)</FieldLabel>
          <Input
            id="sejour-accommodation-detail"
            value={accommodation}
            onChange={(e) => setAccommodation(e.target.value)}
            placeholder="Ex. Hôtel Ibis Antigone"
          />
        </Field>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <p className="text-sm font-medium text-foreground">Véhiculé sur place</p>
          <Switch checked={hasVehicle} onCheckedChange={setHasVehicle} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <p className="text-sm font-medium text-foreground">Anniversaire de mariage des parents (vendredi soir)</p>
          <Switch checked={attendingParentsAnniversary} onCheckedChange={setAttendingParentsAnniversary} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <p className="text-sm font-medium text-foreground">Visite de Montpellier (vendredi soir)</p>
          <Switch checked={attendingMontpellierVisit} onCheckedChange={setAttendingMontpellierVisit} />
        </div>
      </FieldGroup>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          Enregistrer
        </Button>
      </DialogFooter>
    </>
  )
}

interface GuestSejourDialogProps {
  guest: Guest | null
  partnerName?: string | null
  onOpenChange: (open: boolean) => void
  onSave: (guest: Guest, patch: GuestSejourPatch) => Promise<void>
}

export function GuestSejourDialog({ guest, partnerName, onOpenChange, onSave }: GuestSejourDialogProps) {
  return (
    <Dialog open={guest !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {guest ? (
          <GuestSejourForm
            key={guest.id}
            guest={guest}
            partnerName={partnerName}
            onSave={(patch) => onSave(guest, patch)}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
