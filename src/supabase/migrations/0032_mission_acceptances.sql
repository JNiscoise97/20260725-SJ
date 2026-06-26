-- Permet à un référent/proche d'accepter ou décliner explicitement chaque
-- mission qui lui est confiée (voir page "Rôle"). Scope volontairement
-- restreint aux invités (guest_id) : les fiancés ne passent jamais par cette
-- page (voir capability "view:role"), donc pas besoin du couple
-- person_id/guest_id polymorphe utilisé par _20260725_domaine_responsables.
create type mission_acceptance_status as enum ('pending', 'accepted', 'declined');

create table _20260725_mission_acceptances (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references _20260725_missions(id) on delete cascade,
  guest_id uuid not null references _20260725_guests(id) on delete cascade,
  status mission_acceptance_status not null default 'pending',
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (mission_id, guest_id)
);

create index _20260725_mission_acceptances_guest_id_idx on _20260725_mission_acceptances(guest_id);

alter table _20260725_mission_acceptances enable row level security;
create policy "temp_anon_all__20260725_mission_acceptances" on _20260725_mission_acceptances for all using (true) with check (true);
