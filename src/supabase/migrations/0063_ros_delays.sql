create table if not exists _20260725_ros_delays (
  id             uuid primary key default gen_random_uuid(),
  step_id        uuid references _20260725_run_of_show_steps(id) on delete set null,
  delay_minutes  integer not null,
  reason         text,
  logged_at      timestamptz not null default now()
);
