-- La version mock (src/services/people.service.ts) compare les codes d'accès
-- en majuscules ; la fonction RPC ne le faisait pas, ce qui aurait pu refuser
-- une connexion légitime tapée dans une casse différente. On uniformise les
-- deux côtés sur "insensible à la casse" (upper()).
create or replace function _20260725_resolve_access_code(code text)
returns setof _20260725_people
language sql
security definer
set search_path = public, extensions
as $$
  select *
  from _20260725_people
  where is_active
    and access_code_hash = crypt(upper(code), access_code_hash)
  limit 1;
$$;
