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

alter table _20260725_role_categories enable row level security;
alter table _20260725_people enable row level security;
alter table _20260725_app_settings enable row level security;
alter table _20260725_missions enable row level security;
alter table _20260725_tasks enable row level security;
alter table _20260725_checklists enable row level security;
alter table _20260725_checklist_items enable row level security;
alter table _20260725_planning_events enable row level security;
alter table _20260725_run_of_show_steps enable row level security;
alter table _20260725_run_of_show_responsibles enable row level security;
alter table _20260725_logistique_items enable row level security;
alter table _20260725_guest_groups enable row level security;
alter table _20260725_guests enable row level security;
alter table _20260725_tables enable row level security;
alter table _20260725_table_assignments enable row level security;
alter table _20260725_attachments enable row level security;
alter table _20260725_documents enable row level security;
alter table _20260725_comments enable row level security;
alter table _20260725_notifications enable row level security;
alter table _20260725_notification_log enable row level security;

-- TEMPORAIRE : accès anon complet ; l'application est protégée uniquement par
-- le code d'accès côté client et par une URL non indexée/non partagée.
do $$
declare
  t text;
begin
  for t in select unnest(array[
    '_20260725_role_categories', '_20260725_people', '_20260725_app_settings', '_20260725_missions',
    '_20260725_tasks', '_20260725_checklists', '_20260725_checklist_items', '_20260725_planning_events',
    '_20260725_run_of_show_steps', '_20260725_run_of_show_responsibles', '_20260725_logistique_items',
    '_20260725_guest_groups', '_20260725_guests', '_20260725_tables', '_20260725_table_assignments',
    '_20260725_attachments', '_20260725_documents', '_20260725_comments', '_20260725_notifications',
    '_20260725_notification_log'
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
-- SELECT direct sur `_20260725_people`. Toute résolution de code passe par cette
-- fonction SECURITY DEFINER, qui ne renvoie la personne correspondante que si le
-- code fourni correspond au hash stocké.
-- ----------------------------------------------------------------------------
revoke select (access_code_hash) on _20260725_people from anon, authenticated;

create or replace function _20260725_resolve_access_code(code text)
returns setof _20260725_people
language sql
security definer
set search_path = public, extensions
as $$
  select *
  from _20260725_people
  where is_active
    and access_code_hash = crypt(code, access_code_hash)
  limit 1;
$$;
