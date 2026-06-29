-- Permet d'assigner un pôle entier à l'un des fiancés (responsable global de
-- toute la zone, indépendamment des responsables par domaine en dessous).
-- Volontairement limité aux fiancés (people), comme pour
-- _20260725_checklists.responsible_person_id (0040) : ce n'est pas le couple
-- polymorphe person/guest utilisé par domaine_responsables.
alter table _20260725_poles
  add column responsible_person_id uuid references _20260725_people(id) on delete set null;

create index _20260725_poles_responsible_person_idx on _20260725_poles(responsible_person_id);
