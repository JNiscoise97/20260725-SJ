-- Permet à un fiancé de déléguer une checklist entière (mission ou DoD de
-- domaine) à l'autre fiancé, sans toucher au responsable du domaine
-- (_20260725_domaine_responsables) ni redescendre au niveau de l'item.
-- Volontairement limité aux fiancés (people) : ce n'est pas le couple
-- polymorphe person/guest utilisé par domaine_responsables.
alter table _20260725_checklists
  add column responsible_person_id uuid references _20260725_people(id) on delete set null;

create index _20260725_checklists_responsible_person_idx on _20260725_checklists(responsible_person_id);
