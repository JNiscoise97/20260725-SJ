-- Deux informations utiles ajoutées après coup aux catégories de référents :
-- - solicited_milestone : à quel moment de l'événement cette catégorie est
--   sollicitée (réutilise l'enum planning_milestone déjà défini pour le
--   planning dans 0004_planning_deroule.sql, pour éviter une deuxième
--   taxonomie de phases qui dériverait de la première).
-- - preferred_contact_id : la personne (typiquement l'un des fiancés) qui est
--   le contact privilégié pour cette catégorie.
alter table _20260725_role_categories
  add column solicited_milestone planning_milestone,
  add column preferred_contact_id uuid references _20260725_people(id) on delete set null;
