-- Permet de réordonner les groupes/familles d'invités par drag-and-drop dans Paramètres.
-- Backfill alphabétique (pas de created_at sur cette table) pour ne pas changer
-- l'ordre actuellement affiché à l'écran.
alter table _20260725_guest_groups add column sort_order integer not null default 0;

update _20260725_guest_groups
set sort_order = sub.rn
from (
  select id, row_number() over (order by family_name) as rn
  from _20260725_guest_groups
) as sub
where _20260725_guest_groups.id = sub.id;
