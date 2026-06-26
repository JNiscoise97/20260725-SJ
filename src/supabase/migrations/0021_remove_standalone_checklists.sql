-- Les checklists "standalone" (module Feuille de route) étaient en réalité
-- des tâches d'après Jordan — leurs items sont repris dans
-- seed/04_tasks.sql. On retire le mode standalone et la colonne phase qui
-- n'avaient été ajoutés que pour ce module (voir 0014).
delete from _20260725_checklists where owner_type = 'standalone';

alter table _20260725_checklists drop constraint _20260725_checklists_owner_type_check;
alter table _20260725_checklists add constraint _20260725_checklists_owner_type_check
  check (owner_type in ('referent', 'mission', 'logistique_item'));

alter table _20260725_checklists
  alter column owner_id set not null,
  drop column phase;

drop type checklist_phase;
