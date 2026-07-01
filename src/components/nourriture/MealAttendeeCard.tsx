import type { MealAttendee } from "@/lib/meal-attendees"
import { MEAL_CHOICE_BADGE_CLASS, MEAL_CHOICE_LABELS } from "@/lib/meal-choice"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
          <Badge
            className={attendee.mealChoice ? MEAL_CHOICE_BADGE_CLASS[attendee.mealChoice] : "bg-muted text-muted-foreground"}
          >
            {attendee.mealChoice ? MEAL_CHOICE_LABELS[attendee.mealChoice] : "Non renseigné"}
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
