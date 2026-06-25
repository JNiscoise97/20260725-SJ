-- Les sous-modules logistique (boissons, décoration, DJ, traiteur...) référencent
-- role_categories plutôt qu'un enum séparé, pour rester cohérents avec les
-- catégories de référents et éviter la dérive entre les deux listes.
create table _20260725_logistique_items (
  id uuid primary key default gen_random_uuid(),
  role_category_id uuid references _20260725_role_categories(id) on delete set null,
  name text not null,
  responsable_id uuid references _20260725_people(id) on delete set null,
  quantity numeric,
  unit text,
  notes text,
  created_at timestamptz not null default now()
);

create index _20260725_logistique_items_role_category_id_idx on _20260725_logistique_items(role_category_id);
