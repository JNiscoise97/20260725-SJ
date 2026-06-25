-- Architecture seule : aucun envoi réel n'est implémenté pour l'instant.
-- Ces tables permettent de brancher plus tard push/email/SMS/WhatsApp sans
-- changer le reste du schéma.
create type notification_channel as enum ('push', 'email', 'sms', 'whatsapp');
create type notification_status as enum ('pending', 'sent', 'failed');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references people(id) on delete cascade,
  channel notification_channel not null,
  title text not null,
  body text,
  related_entity_type text,
  related_entity_id uuid,
  status notification_status not null default 'pending',
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index notifications_recipient_id_idx on notifications(recipient_id);

create table notification_log (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references notifications(id) on delete cascade,
  attempted_at timestamptz not null default now(),
  result text not null,
  error_message text
);
