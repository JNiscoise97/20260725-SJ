import type { Guest } from "@/types/domain"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MEAL_LABEL: Record<string, string> = { poulet: "Poulet", poisson: "Poisson", enfant: "Menu enfant" }
const MEAL_CLASS: Record<string, string> = {
  poulet: "bg-bordeaux/10 text-bordeaux",
  poisson: "bg-vert-vegetal/15 text-vert-vegetal",
  enfant: "bg-dore/15 text-dore",
}

interface GuestMealCardProps {
  guest: Guest
  onSelect: (guest: Guest) => void
}

export function GuestMealCard({ guest, onSelect }: GuestMealCardProps) {
  return (
    <Card
      onClick={() => onSelect(guest)}
      className="cursor-pointer transition-colors hover:bg-muted/50"
    >
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-foreground">{guest.fullName}</p>
          <Badge className={guest.mealChoice ? MEAL_CLASS[guest.mealChoice] : "bg-muted text-muted-foreground"}>
            {guest.mealChoice ? MEAL_LABEL[guest.mealChoice] : "Non renseigné"}
          </Badge>
        </div>
        {guest.dietaryConstraints ? (
          <p className="text-sm text-muted-foreground">Régime : {guest.dietaryConstraints}</p>
        ) : null}
        {guest.allergies ? (
          <p className="text-sm text-muted-foreground">Allergies : {guest.allergies}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
