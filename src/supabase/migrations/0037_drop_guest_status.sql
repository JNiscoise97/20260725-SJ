-- Le statut référent/proche/invite faisait doublon avec _20260725_domaine_responsables
-- (voir 0024, qui dérive déjà le rôle "référent" de l'affectation à un domaine) et
-- bloquait à tort la connexion : un invité avec un code valide mais status = null
-- (cas par défaut, voir seed 09_guests.sql) était rejeté par le RPC ci-dessous.
-- Le rôle "proche" disparaît : un invité avec un code a un accès limité (comme
-- "invite") sauf s'il est référent d'un domaine.

create or replace function _20260725_resolve_guest_access_code(code text)
returns setof _20260725_guests
language sql
security definer
set search_path = public, extensions
as $$
  select *
  from _20260725_guests
  where is_active
    and access_code_hash = crypt(upper(code), access_code_hash)
  limit 1;
$$;

alter table _20260725_guests drop column if exists status;
