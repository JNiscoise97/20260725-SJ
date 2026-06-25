create type rsvp_status as enum ('pending', 'confirmed', 'declined');

create table _20260725_guest_groups (
  id uuid primary key default gen_random_uuid(),
  family_name text not null,
  notes text
);

create table _20260725_guests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references _20260725_guest_groups(id) on delete set null,
  full_name text not null,
  phone text,
  email text,
  rsvp_status rsvp_status not null default 'pending',
  dietary_constraints text,
  plus_one boolean not null default false,
  created_at timestamptz not null default now()
);

create index _20260725_guests_group_id_idx on _20260725_guests(group_id);

create table _20260725_tables (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity integer not null check (capacity > 0)
);

create table _20260725_table_assignments (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references _20260725_tables(id) on delete cascade,
  guest_id uuid not null references _20260725_guests(id) on delete cascade,
  seat_number integer,
  unique (table_id, guest_id),
  unique (guest_id)
);
