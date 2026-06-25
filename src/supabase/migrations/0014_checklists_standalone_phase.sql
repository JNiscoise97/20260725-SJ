-- Jusqu'ici une checklist devait obligatoirement être rattachée à un
-- référent, une mission ou un élément de logistique. Le plan opérationnel
-- complet fourni par Jordan (~60 checklists organisées par phase × thème, ex.
-- "Avant — Budget & administratif", "Évènement — Parking") ne correspond pas
-- à ce modèle : la moitié de ces checklists ne sont liées à aucun référent ni
-- mission existante (budget, RSVP, tenues...). On ajoute donc un mode
-- "standalone" (aucun owner) et une colonne phase pour les regrouper dans un
-- nouveau module "Feuille de route", indépendant des référents/missions.
create type checklist_phase as enum ('avant', 'installation', 'evenement', 'desinstallation', 'apres');

alter table _20260725_checklists
  alter column owner_id drop not null,
  add column phase checklist_phase;

alter table _20260725_checklists drop constraint _20260725_checklists_owner_type_check;
alter table _20260725_checklists add constraint _20260725_checklists_owner_type_check
  check (owner_type in ('referent', 'mission', 'logistique_item', 'standalone'));

create index _20260725_checklists_phase_idx on _20260725_checklists(phase);
