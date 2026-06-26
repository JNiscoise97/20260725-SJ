-- À exécuter seulement après avoir confirmé que le seed v2
-- (14_etl_v2_domaines_missions_checklists.sql) tourne bien avec phase
-- portée par domaines et sans assignee_id sur les items.
alter table _20260725_missions drop column if exists phase;
alter table _20260725_checklist_items drop column if exists assignee_id;
