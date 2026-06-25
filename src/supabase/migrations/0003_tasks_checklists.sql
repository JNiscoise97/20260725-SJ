create type task_priority as enum ('low', 'normal', 'high', 'urgent');

create table tasks (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid references missions(id) on delete set null,
  title text not null,
  description text,
  priority task_priority not null default 'normal',
  status progress_status not null default 'todo',
  category text,
  due_date date,
  due_time time,
  owner_id uuid references people(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_owner_id_idx on tasks(owner_id);
create index tasks_status_idx on tasks(status);
create index tasks_mission_id_idx on tasks(mission_id);

-- Checklists réutilisables : référents, missions, éléments de logistique partagent la même forme.
create table checklists (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('referent', 'mission', 'logistique_item')),
  owner_id uuid not null,
  title text not null,
  created_at timestamptz not null default now()
);

create index checklists_owner_idx on checklists(owner_type, owner_id);

create table checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references checklists(id) on delete cascade,
  label text not null,
  is_done boolean not null default false,
  sort_order integer not null default 0,
  done_by uuid references people(id) on delete set null,
  done_at timestamptz
);

create index checklist_items_checklist_id_idx on checklist_items(checklist_id);
