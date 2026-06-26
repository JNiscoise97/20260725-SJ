-- access_code_hash n'est jamais exposé en lecture (voir 0009/0012), donc créer
-- une personne ou changer son code ne peut pas passer par un simple
-- insert/update PostgREST (le hash doit être calculé côté Postgres avec
-- crypt()/gen_salt(), inaccessibles depuis le client). Ces deux RPC
-- SECURITY DEFINER permettent à l'app de le faire sans jamais voir le hash.
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
  insert into _20260725_people (full_name, role, access_code_hash, phone, avatar_url, is_active)
  values (p_full_name, p_role, crypt(upper(p_code), gen_salt('bf')), p_phone, p_avatar_url, p_is_active)
  returning * into new_row;
  return new_row;
end;
$$;

create or replace function _20260725_set_access_code(p_person_id uuid, p_code text)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  update _20260725_people
  set access_code_hash = crypt(upper(p_code), gen_salt('bf'))
  where id = p_person_id;
$$;
