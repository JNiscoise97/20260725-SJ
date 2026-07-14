create table if not exists _20260725_ros_launches (
  id uuid primary key default gen_random_uuid(),
  step_id uuid not null references _20260725_run_of_show_steps(id) on delete cascade,
  mission_id uuid references _20260725_missions(id) on delete set null,
  label text,
  scheduled_time text,
  deliverer_type text,
  deliverer_guest_id uuid references _20260725_guests(id) on delete set null,
  deliverer_person_id uuid references _20260725_people(id) on delete set null,
  launched_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
