-- Checklist matériel à prévoir pour la réception (louer, acheter, apporté par
-- un invité, fourni par le lieu) — les articles sont pré-peuplés via seed SQL
-- ou insérés depuis l'interface, et mis à jour au fil de la préparation.
create type equipment_status as enum ('fourni_lieu', 'apporte_invite', 'a_louer', 'a_acheter');

create table _20260725_equipment (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  label text not null,
  status equipment_status,
  guest_name text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index _20260725_equipment_category_idx on _20260725_equipment(category);

alter table _20260725_equipment enable row level security;
create policy "temp_anon_all__20260725_equipment" on _20260725_equipment for all using (true) with check (true);
