create type task_priority as enum ('low', 'normal', 'high', 'urgent');

create table _20260725_tasks (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid references _20260725_missions(id) on delete set null,
  title text not null,
  description text,
  priority task_priority not null default 'normal',
  status progress_status not null default 'todo',
  category text,
  due_date date,
  due_time time,
  owner_id uuid references _20260725_people(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index _20260725_tasks_owner_id_idx on _20260725_tasks(owner_id);
create index _20260725_tasks_status_idx on _20260725_tasks(status);
create index _20260725_tasks_mission_id_idx on _20260725_tasks(mission_id);

-- Checklists réutilisables : référents, missions, éléments de logistique partagent la même forme.
create table _20260725_checklists (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('referent', 'mission', 'logistique_item')),
  owner_id uuid not null,
  title text not null,
  created_at timestamptz not null default now()
);

create index _20260725_checklists_owner_idx on _20260725_checklists(owner_type, owner_id);

create table _20260725_checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references _20260725_checklists(id) on delete cascade,
  label text not null,
  is_done boolean not null default false,
  sort_order integer not null default 0,
  done_by uuid references _20260725_people(id) on delete set null,
  done_at timestamptz
);

create index _20260725_checklist_items_checklist_id_idx on _20260725_checklist_items(checklist_id);
