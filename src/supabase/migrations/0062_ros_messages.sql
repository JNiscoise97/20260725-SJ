create table if not exists _20260725_ros_messages (
  id          uuid primary key default gen_random_uuid(),
  step_id     uuid not null references _20260725_run_of_show_steps(id) on delete cascade,
  content     text not null,
  sort_order  integer not null default 0,
  sent_at     timestamptz
);
