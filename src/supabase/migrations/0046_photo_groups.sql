-- Pilotage des photos de groupe (gestion du séquencement par les fiancés
-- depuis Paramètres, exécution le jour J par la référente photographe).
-- Les fiancés sont implicitement sur chaque photo : `label` décrit le reste
-- du groupe attendu (ex. "Famille proche de Sarah"), dont les membres sont
-- des invités (_20260725_guests), jamais des fiancés.
create type photo_group_status as enum ('pending', 'done', 'skipped');

create table _20260725_photo_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order integer not null default 0,
  is_priority boolean not null default false,
  status photo_group_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

-- `is_present` est coché en direct le jour J (qui est effectivement là pour
-- cette photo précise), indépendant du statut de la photo elle-même.
create table _20260725_photo_group_members (
  id uuid primary key default gen_random_uuid(),
  photo_group_id uuid not null references _20260725_photo_groups(id) on delete cascade,
  guest_id uuid not null references _20260725_guests(id) on delete cascade,
  is_present boolean not null default false,
  unique (photo_group_id, guest_id)
);

create index _20260725_photo_group_members_photo_group_id_idx on _20260725_photo_group_members(photo_group_id);

alter table _20260725_photo_groups enable row level security;
alter table _20260725_photo_group_members enable row level security;

create policy "temp_anon_all__20260725_photo_groups" on _20260725_photo_groups for all using (true) with check (true);
create policy "temp_anon_all__20260725_photo_group_members" on _20260725_photo_group_members for all using (true) with check (true);
