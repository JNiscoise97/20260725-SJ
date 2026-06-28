-- Permet de définir l'ordre d'affichage des tables (Paramètres et Plan de
-- table), indépendant de leur nom — par défaut on backfille selon le nom pour
-- ne pas casser l'ordre actuel des tables déjà créées.
alter table _20260725_tables add column sort_order integer not null default 0;

update _20260725_tables
set sort_order = sub.rn
from (
  select id, row_number() over (order by name) as rn
  from _20260725_tables
) as sub
where _20260725_tables.id = sub.id;
