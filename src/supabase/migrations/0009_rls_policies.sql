-- ============================================================================
-- RLS — stratégie temporaire et assumée
-- ----------------------------------------------------------------------------
-- Cette application n'utilise pas Supabase Auth : l'identité repose sur un
-- simple code d'accès résolu côté client (voir src/context/IdentityContext.tsx).
-- Sans authentification JWT, auth.uid() n'existe pas : la RLS ne peut donc PAS
-- isoler les données par personne au niveau base de données — la garde-fou
-- réel est entièrement côté application (routes + filtrage dans les hooks de
-- requête), pas côté Postgres.
--
-- On active quand même RLS sur toutes les tables (bonne hygiène) avec des
-- policies permissives `using (true)` : choix pragmatique pour une application
-- privée et éphémère (fiançailles), pas une recommandation pour un produit
-- grand public. Si une vraie isolation par utilisateur est nécessaire plus
-- tard, la vraie solution est d'adopter Supabase Auth (même de simples
-- connexions anonymes) pour que auth.uid() devienne disponible et que des
-- policies réelles puissent être écrites.
-- ============================================================================

alter table role_categories enable row level security;
alter table people enable row level security;
alter table app_settings enable row level security;
alter table missions enable row level security;
alter table tasks enable row level security;
alter table checklists enable row level security;
alter table checklist_items enable row level security;
alter table planning_events enable row level security;
alter table run_of_show_steps enable row level security;
alter table run_of_show_responsibles enable row level security;
alter table logistique_items enable row level security;
alter table guest_groups enable row level security;
alter table guests enable row level security;
alter table tables enable row level security;
alter table table_assignments enable row level security;
alter table attachments enable row level security;
alter table documents enable row level security;
alter table comments enable row level security;
alter table notifications enable row level security;
alter table notification_log enable row level security;

-- TEMPORAIRE : accès anon complet ; l'application est protégée uniquement par
-- le code d'accès côté client et par une URL non indexée/non partagée.
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'role_categories', 'people', 'app_settings', 'missions', 'tasks', 'checklists',
    'checklist_items', 'planning_events', 'run_of_show_steps', 'run_of_show_responsibles',
    'logistique_items', 'guest_groups', 'guests', 'tables', 'table_assignments',
    'attachments', 'documents', 'comments', 'notifications', 'notification_log'
  ])
  loop
    execute format(
      'create policy "temp_anon_all_%1$s" on %1$s for all using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- Durcissement minimal malgré tout : ne jamais exposer access_code_hash via un
-- SELECT direct sur `people`. Toute résolution de code passe par cette fonction
-- SECURITY DEFINER, qui ne renvoie la personne correspondante que si le code
-- fourni correspond au hash stocké.
-- ----------------------------------------------------------------------------
revoke select (access_code_hash) on people from anon, authenticated;

create or replace function resolve_access_code(code text)
returns setof people
language sql
security definer
set search_path = public
as $$
  select *
  from people
  where is_active
    and access_code_hash = crypt(code, access_code_hash)
  limit 1;
$$;
