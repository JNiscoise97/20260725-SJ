-- Deuxième refonte de l'ETL : la phase redevient une propriété du domaine
-- (et non de la mission) — un même thème qui traverse plusieurs phases
-- (Boissons, Décoration...) devient désormais plusieurs domaines distincts,
-- un par phase, chacun avec son propre responsable. Ceci inverse
-- délibérément le choix fait dans 0027 (décision produit assumée).
alter table _20260725_domaines
  add column if not exists description text,
  add column if not exists phase domaine_phase;

-- Les checklists peuvent désormais porter la "Definition of Done" d'un
-- domaine entier, en plus d'une mission ou d'un élément de logistique.
alter table _20260725_checklists drop constraint _20260725_checklists_owner_type_check;
alter table _20260725_checklists add constraint _20260725_checklists_owner_type_check
  check (owner_type in ('mission', 'logistique_item', 'domaine'));

-- Le titre d'une checklist de mission fait doublon avec mission.title (déjà
-- masqué côté UI) — autant le laisser vide plutôt que recopié.
alter table _20260725_checklists alter column title drop not null;
