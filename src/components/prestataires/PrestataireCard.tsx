import { Utensils } from "lucide-react"

import type { Prestataire } from "@/types/domain"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MEAL_CHOICE_BADGE_CLASS, MEAL_CHOICE_LABELS } from "@/lib/meal-choice"

interface PrestataireCardProps {
  prestataire: Prestataire
  onSelect: (prestataire: Prestataire) => void
}

export function PrestataireCard({ prestataire, onSelect }: PrestataireCardProps) {
  return (
    <Card onClick={() => onSelect(prestataire)} className="cursor-pointer transition-colors hover:bg-muted/50">
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-foreground">{prestataire.name}</p>
            <p className="text-xs text-muted-foreground">
              {prestataire.role ?? "—"}
              {prestataire.company ? ` · ${prestataire.company}` : ""}
            </p>
          </div>
          {prestataire.needsMeal ? (
            <Badge className="flex items-center gap-1 bg-vert-vegetal/15 text-vert-vegetal">
              <Utensils className="size-3" />
              Repas
            </Badge>
          ) : null}
        </div>
        {prestataire.needsMeal ? (
          <Badge
            className={
              prestataire.mealChoice ? MEAL_CHOICE_BADGE_CLASS[prestataire.mealChoice] : "bg-muted text-muted-foreground"
            }
          >
            {prestataire.mealChoice ? MEAL_CHOICE_LABELS[prestataire.mealChoice] : "Plat non renseigné"}
          </Badge>
        ) : null}
        {prestataire.dietaryConstraints ? (
          <p className="text-sm text-muted-foreground">Régime : {prestataire.dietaryConstraints}</p>
        ) : null}
        {prestataire.allergies ? (
          <p className="text-sm text-muted-foreground">Allergies : {prestataire.allergies}</p>
        ) : null}
        {prestataire.notes ? <p className="text-xs italic text-muted-foreground">{prestataire.notes}</p> : null}
      </CardContent>
    </Card>
  )
}
