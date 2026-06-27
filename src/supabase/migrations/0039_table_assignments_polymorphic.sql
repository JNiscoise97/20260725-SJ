-- Le plan de table doit pouvoir placer des invités, mais aussi les fiancés et
-- des prestataires — pas seulement des _20260725_guests. Même convention que
-- _20260725_domaine_responsables (0024) : colonnes typées nullables + check
-- "exactement une renseignée", plutôt qu'un owner_type/owner_id sans FK.

alter table _20260725_table_assignments
  alter column guest_id drop not null,
  add column person_id uuid references _20260725_people(id) on delete cascade,
  add column prestataire_id uuid references _20260725_prestataires(id) on delete cascade;

-- unique(guest_id) existant (0006) reste valide tel quel : Postgres autorise
-- plusieurs NULL sur une colonne unique, donc les lignes person/prestataire
-- (guest_id null) ne sont pas concernées par cette contrainte.
alter table _20260725_table_assignments
  add constraint _20260725_table_assignments_unique_person unique (person_id),
  add constraint _20260725_table_assignments_unique_prestataire unique (prestataire_id),
  add constraint _20260725_table_assignments_exactly_one_target
    check (
      (case when guest_id is not null then 1 else 0 end) +
      (case when person_id is not null then 1 else 0 end) +
      (case when prestataire_id is not null then 1 else 0 end) = 1
    );
