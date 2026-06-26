import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, UserX } from "lucide-react"

import { PageHeader } from "@/components/shared/PageHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RsvpBadge } from "@/components/invites/RsvpBadge"
import { useGuestGroups, useGuests } from "@/hooks/queries/use-guests"
import type { Guest } from "@/types/domain"

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5 divide-y divide-border/60 rounded-2xl border border-border/60 p-4">
      <p className="pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

function YesNo({ value }: { value: boolean }) {
  return (
    <Badge className={value ? "bg-vert-vegetal/15 text-vert-vegetal" : "bg-muted text-muted-foreground"}>
      {value ? "Oui" : "Non"}
    </Badge>
  )
}

const SIDE_LABEL: Record<string, string> = { sarah: "Sarah", jordan: "Jordan" }
const MEAL_LABEL: Record<string, string> = { poulet: "Poulet", poisson: "Poisson", enfant: "Menu enfant" }

export function GuestDetailPage() {
  const { guestId } = useParams<{ guestId: string }>()
  const navigate = useNavigate()
  const { data: guests, isLoading: guestsLoading } = useGuests()
  const { data: groups, isLoading: groupsLoading } = useGuestGroups()

  const isLoading = guestsLoading || groupsLoading
  const guest: Guest | undefined = guests?.find((g) => g.id === guestId)
  const group = guest?.groupId ? groups?.find((g) => g.id === guest.groupId) : null

  if (isLoading) {
    return <Skeleton className="h-96 rounded-2xl" />
  }

  if (!guest) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/invites")} className="gap-1.5">
          <ArrowLeft className="size-4" />
          Retour à la liste
        </Button>
        <EmptyState icon={UserX} title="Invité introuvable" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/invites")} className="gap-1.5">
        <ArrowLeft className="size-4" />
        Retour à la liste
      </Button>

      <PageHeader
        title={guest.fullName}
        description={`${group ? group.familyName : "Sans groupe"}${guest.side ? ` · Côté ${SIDE_LABEL[guest.side]}` : ""}`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Section title="Identité">
          <Field label="Âge" value={guest.ageRange} />
          <Field label="Relation" value={guest.relationCategory} />
          <Field label="Ville" value={guest.city} />
          <Field label="Enfant" value={guest.isChild ? <YesNo value={true} /> : null} />
          {guest.isChild && guest.childAge != null ? <Field label="Âge de l'enfant" value={guest.childAge} /> : null}
          <Field label="Mobilité réduite / personne âgée" value={guest.isReducedMobility ? <YesNo value={true} /> : null} />
        </Section>

        <Section title="RSVP">
          <Field label="Présence" value={<RsvpBadge status={guest.rsvpStatus} />} />
          <Field label="Date de réponse" value={guest.rsvpRespondedAt} />
          <Field label="Canal" value={guest.rsvpChannel} />
        </Section>

        <Section title="Repas">
          <Field label="Message envoyé" value={<YesNo value={guest.mealMessageSent} />} />
          <Field label="Plat choisi" value={guest.mealChoice ? MEAL_LABEL[guest.mealChoice] : null} />
          <Field label="Régime alimentaire" value={guest.dietaryConstraints} />
          <Field label="Allergies" value={guest.allergies} />
          <Field label="Alcool" value={guest.drinksAlcohol == null ? null : <YesNo value={guest.drinksAlcohol} />} />
        </Section>

        <Section title="Logistique">
          <Field label="Hébergement nécessaire" value={<YesNo value={guest.needsAccommodation} />} />
          <Field label="Hôtel / logement" value={guest.accommodation} />
          <Field label="Réservation effectuée" value={<YesNo value={guest.reservationDone} />} />
          <Field label="Véhiculé" value={<YesNo value={guest.hasVehicle} />} />
          <Field label="Besoin retour tardif" value={<YesNo value={guest.needsLateTransport} />} />
          <Field label="Heure / jour d'arrivée" value={guest.arrivalInfo} />
        </Section>

        <Section title="Communications">
          <Field label="Guide invité envoyé" value={<YesNo value={guest.guideSent} />} />
          <Field label="Changement d'adresse envoyé" value={<YesNo value={guest.addressChangeSent} />} />
          <Field label="Communication J-30" value={<YesNo value={guest.communicationJ30Sent} />} />
          <Field label="Communication J-15" value={<YesNo value={guest.communicationJ15Sent} />} />
          <Field label="Communication J-3" value={<YesNo value={guest.communicationJ3Sent} />} />
        </Section>

        <Section title="Culture & cérémonie">
          <Field label="Origine / culture" value={guest.culturalOrigin} />
          <Field label="Langue principale" value={guest.primaryLanguage} />
          <Field label="Fait partie du cortège" value={<YesNo value={guest.inCortege} />} />
          <Field label="Rôle cérémoniel" value={<YesNo value={guest.hasCeremonialRole} />} />
          <Field label="Tenue traditionnelle probable" value={<YesNo value={guest.likelyTraditionalAttire} />} />
        </Section>

        {guest.notes ? (
          <Section title="Notes">
            <p className="py-2 text-sm text-foreground">{guest.notes}</p>
          </Section>
        ) : null}
      </div>
    </div>
  )
}
