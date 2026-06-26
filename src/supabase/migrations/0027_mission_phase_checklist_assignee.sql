-- Correction de 0026 : la phase varie par Mission, pas par Domaine. Un même
-- domaine (ex. "Décoration") peut avoir une mission Installation et une
-- mission Désinstallation avec des phases différentes ; un même responsable
-- de domaine peut couvrir plusieurs phases. `domaine_phase` (créé dans 0026)
-- est réutilisé, juste déplacé de domaines vers missions.
do $$ begin
  create type domaine_phase as enum ('avant', 'installation', 'jour_j', 'desinstallation', 'apres');
exception
  when duplicate_object then null;
end $$;

alter table _20260725_domaines drop column if exists phase;
alter table _20260725_missions add column if not exists phase domaine_phase;

-- Le document "avant" assigne explicitement certaines tâches à Sarah ou
-- Jordan nommément (contrairement aux autres phases, où les rôles sont
-- "à désigner"). ChecklistItem n'avait pas de notion d'assigné — seulement
-- done_by/done_at (qui a coché l'item, pas à qui il est destiné).
alter table _20260725_checklist_items
  add column if not exists assignee_id uuid references _20260725_people(id) on delete set null;
