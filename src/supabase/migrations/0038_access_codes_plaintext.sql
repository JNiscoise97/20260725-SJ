-- Le hash bcrypt rendait tout débogage impossible (cf. l'incident où un code
-- pourtant correct était refusé pour une autre raison que le code lui-même —
-- impossible à diagnostiquer sans pouvoir relire la valeur stockée). On passe
-- les codes en clair ; la protection contre une lecture directe via la clé
-- anon reste assurée par le revoke select ci-dessous, exactement comme pour
-- l'ancien hash — seule la comparaison change (égalité au lieu de crypt()).
--
-- IMPORTANT : les hash existants ne sont pas réversibles. Tous les codes
-- (Sarah, Jordan, référents/invités) doivent être ressaisis depuis Paramètres
-- après cette migration. Les sessions déjà connectées (identifiant stocké en
-- localStorage) ne sont pas affectées — seule une nouvelle connexion par code
-- échouera tant que le code n'a pas été ressaisi.

alter table _20260725_people add column access_code text unique;
alter table _20260725_people drop column access_code_hash;

alter table _20260725_guests add column access_code text unique;
alter table _20260725_guests drop column access_code_hash;

revoke select (access_code) on _20260725_people from anon, authenticated;
revoke select (access_code) on _20260725_guests from anon, authenticated;

create or replace function _20260725_resolve_access_code(code text)
returns setof _20260725_people
language sql
security definer
set search_path = public, extensions
as $$
  select *
  from _20260725_people
  where access_code = upper(code)
  limit 1;
$$;

create or replace function _20260725_set_access_code(p_person_id uuid, p_code text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update _20260725_people
  set access_code = upper(p_code)
  where id = p_person_id;
$$;

create or replace function _20260725_create_person(
  p_full_name text,
  p_role app_role,
  p_code text,
  p_phone text default null,
  p_avatar_url text default null,
  p_is_active boolean default true
)
returns _20260725_people
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_row _20260725_people;
begin
  insert into _20260725_people (full_name, role, access_code, phone, avatar_url, is_active)
  values (p_full_name, p_role, upper(p_code), p_phone, p_avatar_url, p_is_active)
  returning * into new_row;
  return new_row;
end;
$$;

create or replace function _20260725_resolve_guest_access_code(code text)
returns setof _20260725_guests
language sql
security definer
set search_path = public, extensions
as $$
  select *
  from _20260725_guests
  where is_active
    and access_code = upper(code)
  limit 1;
$$;

create or replace function _20260725_set_guest_access_code(p_guest_id uuid, p_code text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update _20260725_guests
  set access_code = upper(p_code)
  where id = p_guest_id;
$$;
