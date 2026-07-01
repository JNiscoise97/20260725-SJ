-- Découpe le menu "enfant" en deux variantes, comme pour les adultes :
-- poulet ou poisson. Postgres ne permet pas de retirer une valeur d'un enum
-- existant, donc on recrée le type. Les choix "enfant" déjà enregistrés ne
-- précisaient pas la viande : on les remet à null plutôt que de deviner —
-- ça les fait réapparaître dans le suivi des demandes (page Nourriture) pour
-- une re-confirmation.
create type meal_choice_new as enum ('poulet', 'poisson', 'enfant_poulet', 'enfant_poisson');

update _20260725_guests set meal_choice = null where meal_choice = 'enfant';
alter table _20260725_guests
  alter column meal_choice type meal_choice_new using meal_choice::text::meal_choice_new;

update _20260725_people set meal_choice = null where meal_choice = 'enfant';
alter table _20260725_people
  alter column meal_choice type meal_choice_new using meal_choice::text::meal_choice_new;

update _20260725_prestataires set meal_choice = null where meal_choice = 'enfant';
alter table _20260725_prestataires
  alter column meal_choice type meal_choice_new using meal_choice::text::meal_choice_new;

drop type meal_choice;
alter type meal_choice_new rename to meal_choice;
