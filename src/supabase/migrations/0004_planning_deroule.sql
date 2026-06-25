create type planning_milestone as enum ('j_moins_30', 'j_moins_15', 'j_moins_7', 'j_moins_1', 'jour_j', 'j_plus_1');

-- Chronologie de préparation (module Planning), groupée par jalon.
create table planning_events (
  id uuid primary key default gen_random_uuid(),
  milestone planning_milestone not null,
  title text not null,
  description text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index planning_events_milestone_idx on planning_events(milestone);

-- Déroulé minute par minute du jour J (module Déroulé).
create table run_of_show_steps (
  id uuid primary key default gen_random_uuid(),
  time_label text not null, -- affichage libre (ex: "17h00") ; starts_at sert au tri/calculs
  starts_at timestamptz,
  label text not null,
  duration_minutes integer,
  location text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table run_of_show_responsibles (
  run_of_show_step_id uuid not null references run_of_show_steps(id) on delete cascade,
  person_id uuid not null references people(id) on delete cascade,
  primary key (run_of_show_step_id, person_id)
);
