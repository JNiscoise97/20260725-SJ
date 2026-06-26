-- Refonte Pôle → Domaine → Responsable(s)/Mission → Checklist → Item (voir
-- plan dans .claude/plans, partagé hors repo). Cette migration est purement
-- additive : les anciennes colonnes referent restent en place pour servir de
-- source de vérité pendant la réconciliation manuelle (voir 0025 pour le
-- nettoyage, appliqué seulement une fois cette réconciliation terminée).

create table _20260725_poles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- "Domaine" est le nouveau nom de _20260725_role_categories : un domaine peut
-- être délégué à un invité de confiance (qui en devient référent) ou gardé
-- par un fiancé. Les colonnes primary/secondary_referent_id sont conservées
-- pour l'instant (voir 0025) ; la responsabilité réelle passe maintenant par
-- _20260725_domaine_responsables ci-dessous, qui autorise plusieurs
-- responsables par domaine.
alter table _20260725_role_categories rename to _20260725_domaines;
alter table _20260725_domaines add column pole_id uuid references _20260725_poles(id) on delete set null;

-- Un responsable est soit un fiancé (person_id), soit un invité de confiance
-- (guest_id) — jamais les deux. C'est cette table qui fait qu'un invité
-- "devient référent" d'un domaine : le statut est dérivé de la présence d'une
-- ligne ici, pas d'un attribut permanent sur la personne.
create table _20260725_domaine_responsables (
  id uuid primary key default gen_random_uuid(),
  domaine_id uuid not null references _20260725_domaines(id) on delete cascade,
  person_id uuid references _20260725_people(id) on delete cascade,
  guest_id uuid references _20260725_guests(id) on delete cascade,
  rank text not null default 'principal' check (rank in ('principal', 'secondaire')),
  created_at timestamptz not null default now(),
  constraint _20260725_domaine_responsables_exactly_one_target
    check ((person_id is null) <> (guest_id is null)),
  unique (domaine_id, person_id),
  unique (domaine_id, guest_id)
);

create index _20260725_domaine_responsables_domaine_id_idx on _20260725_domaine_responsables(domaine_id);

-- Les missions appartiennent au domaine, pas à un référent (voir 0025 pour la
-- suppression de missions.referent_id une fois la réconciliation faite).
alter table _20260725_missions add column domaine_id uuid references _20260725_domaines(id) on delete set null;
update _20260725_missions set domaine_id = role_category_id;

alter table _20260725_logistique_items rename column role_category_id to domaine_id;

-- Les invités peuvent désormais porter un statut spécial (référent d'un ou
-- plusieurs domaines, ou proche) et, le cas échéant, se connecter avec un
-- code d'accès — sans dupliquer leurs infos dans _20260725_people, qui reste
-- réservée à Sarah & Jordan.
alter table _20260725_guests
  add column status text check (status in ('referent', 'proche', 'invite')),
  add column access_code_hash text unique,
  add column is_active boolean not null default true;

alter table _20260725_poles enable row level security;
alter table _20260725_domaine_responsables enable row level security;

create policy "temp_anon_all__20260725_poles" on _20260725_poles for all using (true) with check (true);
create policy "temp_anon_all__20260725_domaine_responsables" on _20260725_domaine_responsables for all using (true) with check (true);

revoke select (access_code_hash) on _20260725_guests from anon, authenticated;

-- Mêmes RPC SECURITY DEFINER que pour _20260725_people (voir 0009/0012/0016),
-- pour que les invités référents/proches puissent se connecter sans jamais
-- exposer access_code_hash en lecture directe.
create or replace function _20260725_resolve_guest_access_code(code text)
returns setof _20260725_guests
language sql
security definer
set search_path = public, extensions
as $$
  select *
  from _20260725_guests
  where is_active
    and status is not null
    and access_code_hash = crypt(upper(code), access_code_hash)
  limit 1;
$$;

create or replace function _20260725_set_guest_access_code(p_guest_id uuid, p_code text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update _20260725_guests
  set access_code_hash = crypt(upper(p_code), gen_salt('bf'))
  where id = p_guest_id;
$$;
