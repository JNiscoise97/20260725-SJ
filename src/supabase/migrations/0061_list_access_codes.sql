-- Retourne tous les comptes (fiancés + invités) avec leur code en clair.
-- security definer pour contourner le revoke select sur access_code (voir 0038).
-- Réservé à l'onglet "Comptes" des paramètres, visible fiancés uniquement.
create or replace function _20260725_list_access_codes()
returns table(
  id          uuid,
  full_name   text,
  kind        text,
  access_code text,
  is_active   boolean
)
language sql
security definer
set search_path = public, extensions
as $$
  select id, full_name, 'fiance'::text, access_code, is_active
  from _20260725_people
  where access_code is not null
  union all
  select id, first_name || ' ' || last_name, 'guest'::text, access_code, is_active
  from _20260725_guests
  where access_code is not null
  order by 3, 2;
$$;
