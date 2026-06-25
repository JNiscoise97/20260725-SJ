-- Pièces jointes polymorphes : soit liées à une entité précise (entity_type/entity_id,
-- ex. une tâche), soit autonomes et seulement référencées par la bibliothèque
-- "documents" ci-dessous (entity_type/entity_id alors null).
create table attachments (
  id uuid primary key default gen_random_uuid(),
  entity_type text,
  entity_id uuid,
  file_path text not null,
  file_name text not null,
  mime_type text,
  uploaded_by uuid references people(id) on delete set null,
  created_at timestamptz not null default now()
);

create index attachments_entity_idx on attachments(entity_type, entity_id);

-- Bibliothèque de documents = métadonnées par-dessus attachments (catégorie, visibilité par rôle).
create table documents (
  id uuid primary key default gen_random_uuid(),
  attachment_id uuid not null references attachments(id) on delete cascade,
  title text not null,
  category text,
  visible_to_roles app_role[] not null default array['fiance', 'referent', 'proche']::app_role[],
  created_at timestamptz not null default now()
);

-- Commentaires polymorphes (tâches, missions, éléments de logistique, étapes du déroulé...).
create table comments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  author_id uuid references people(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create index comments_entity_idx on comments(entity_type, entity_id);
