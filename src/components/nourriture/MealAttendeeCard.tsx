import type { MealAttendee } from "@/lib/meal-attendees"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MEAL_LABEL: Record<string, string> = { poulet: "Poulet", poisson: "Poisson", enfant: "Menu enfant" }
const MEAL_CLASS: Record<string, string> = {
  poulet: "bg-bordeaux/10 text-bordeaux",
  poisson: "bg-vert-vegetal/15 text-vert-vegetal",
  enfant: "bg-dore/15 text-dore",
}

interface MealAttendeeCardProps {
  attendee: MealAttendee
  onSelect: (attendee: MealAttendee) => void
}

export function MealAttendeeCard({ attendee, onSelect }: MealAttendeeCardProps) {
  return (
    <Card onClick={() => onSelect(attendee)} className="cursor-pointer transition-colors hover:bg-muted/50">
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-foreground">{attendee.fullName}</p>
            {attendee.subtitle ? <p className="text-xs text-muted-foreground">{attendee.subtitle}</p> : null}
          </div>
          <Badge className={attendee.mealChoice ? MEAL_CLASS[attendee.mealChoice] : "bg-muted text-muted-foreground"}>
            {attendee.mealChoice ? MEAL_LABEL[attendee.mealChoice] : "Non renseigné"}
          </Badge>
        </div>
        {attendee.dietaryConstraints ? (
          <p className="text-sm text-muted-foreground">Régime : {attendee.dietaryConstraints}</p>
        ) : null}
        {attendee.allergies ? <p className="text-sm text-muted-foreground">Allergies : {attendee.allergies}</p> : null}
      </CardContent>
    </Card>
  )
}
