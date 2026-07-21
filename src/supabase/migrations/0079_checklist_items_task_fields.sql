-- Assignation et planification des tâches (checklist items)
alter table _20260725_checklist_items
  add column if not exists assignee_guest_id    uuid references _20260725_guests(id) on delete set null,
  add column if not exists task_scheduling_type text,   -- 'en_continu' | 'periode'
  add column if not exists task_phase           text;   -- DomainePhase : avant | installation | jour_j | desinstallation | apres
