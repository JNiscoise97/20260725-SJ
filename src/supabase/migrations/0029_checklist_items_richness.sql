-- Les checklist items deviennent l'unique unité d'action de l'app (priorité,
-- statut, créneau estimé) — voir 0030 pour la suppression de _20260725_tasks
-- une fois la bascule du code terminée. task_priority/progress_status sont
-- réutilisés tels quels (créés dans 0003).
alter table _20260725_checklist_items
  add column if not exists priority task_priority not null default 'normal',
  add column if not exists status progress_status not null default 'todo',
  add column if not exists estimated_start_date date,
  add column if not exists estimated_start_time time,
  add column if not exists estimated_end_date date,
  add column if not exists estimated_end_time time;
