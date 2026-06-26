-- Le comptage repas (page Nourriture) ne couvrait que les invités RSVP.
-- Les fiancés et les prestataires qui mangent avec nous (photographe,
-- vidéaste, DJ...) doivent aussi être comptés dans les effectifs traiteur.
alter table _20260725_people
  add column meal_choice meal_choice,
  add column dietary_constraints text,
  add column allergies text;

create table _20260725_prestataires (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  role text,
  needs_meal boolean not null default false,
  meal_choice meal_choice,
  dietary_constraints text,
  allergies text,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS temporaire et permissive, même logique que 0009_rls_policies.sql
-- (pas de Supabase Auth, garde-fou réel côté application).
alter table _20260725_prestataires enable row level security;
create policy "temp_anon_all__20260725_prestataires" on _20260725_prestataires for all using (true) with check (true);
