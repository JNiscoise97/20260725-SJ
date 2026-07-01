import type { MealChoice } from "@/types/domain"

export const MEAL_CHOICE_LABELS: Record<MealChoice, string> = {
  poulet: "Poulet",
  poisson: "Poisson",
  enfant_poulet: "Menu enfant poulet",
  enfant_poisson: "Menu enfant poisson",
}

export const MEAL_CHOICE_BADGE_CLASS: Record<MealChoice, string> = {
  poulet: "bg-bordeaux/10 text-bordeaux",
  poisson: "bg-vert-vegetal/15 text-vert-vegetal",
  enfant_poulet: "bg-dore/15 text-dore",
  enfant_poisson: "bg-dore/15 text-dore",
}

export const MEAL_CHOICES: MealChoice[] = ["poulet", "poisson", "enfant_poulet", "enfant_poisson"]
