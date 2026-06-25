-- Statut de progression partagé par les missions et les tâches (évite deux enums quasi identiques).
create type progress_status as enum ('todo', 'in_progress', 'done', 'blocked');

-- Une mission regroupe les tâches d'un référent/d'une catégorie (ex: "Décoration de la salle").
create table _20260725_missions (
  id uuid primary key default gen_random_uuid(),
  role_category_id uuid references _20260725_role_categories(id) on delete set null,
  referent_id uuid references _20260725_people(id) on delete set null,
  title text not null,
  description text,
  status progress_status not null default 'todo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index _20260725_missions_referent_id_idx on _20260725_missions(referent_id);
