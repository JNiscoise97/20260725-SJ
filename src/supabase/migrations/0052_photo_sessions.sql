-- Une séance photo regroupe plusieurs groupes de photo sous un même nom
-- (ex. "Avant cérémonie", "Cocktail") — purement organisationnel, chaque
-- groupe garde son propre séquencement, mais scopé à sa séance.
create table _20260725_photo_sessions (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table _20260725_photo_groups
  add column session_id uuid references _20260725_photo_sessions(id) on delete cascade;

-- Rattrapage : les groupes déjà créés (avant l'existence des séances) sont
-- regroupés dans une séance par défaut pour ne rien perdre, en conservant
-- leur sort_order existant tel quel.
insert into _20260725_photo_sessions (label, sort_order)
select 'Séance', 0
where exists (select 1 from _20260725_photo_groups);

update _20260725_photo_groups
set session_id = (select id from _20260725_photo_sessions order by created_at limit 1)
where session_id is null;

alter table _20260725_photo_groups alter column session_id set not null;

create index _20260725_photo_groups_session_id_idx on _20260725_photo_groups(session_id);

alter table _20260725_photo_sessions enable row level security;
create policy "temp_anon_all__20260725_photo_sessions" on _20260725_photo_sessions for all using (true) with check (true);
