-- Permet de réordonner les missions par drag-and-drop dans Paramètres, au sein
-- d'un même domaine (la DoD du domaine n'est pas concernée : c'est une
-- checklist, pas une mission, et elle reste toujours affichée après).
-- Backfill par domaine pour ne pas casser l'ordre actuel des missions déjà créées.
alter table _20260725_missions add column sort_order integer not null default 0;

update _20260725_missions
set sort_order = sub.rn
from (
  select id, row_number() over (partition by domaine_id order by created_at) as rn
  from _20260725_missions
) as sub
where _20260725_missions.id = sub.id;
