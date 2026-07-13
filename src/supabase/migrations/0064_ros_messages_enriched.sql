alter table _20260725_ros_messages
  add column if not exists subject            text,
  add column if not exists deliverer_guest_id uuid references _20260725_guests(id) on delete set null,
  add column if not exists recipient_type     text,   -- 'guest' | 'fiance' | 'both_fiances' | 'other'
  add column if not exists recipient_guest_id uuid references _20260725_guests(id) on delete set null,
  add column if not exists recipient_person_id uuid references _20260725_people(id) on delete set null,
  add column if not exists recipient_label    text,   -- quand recipient_type = 'other'
  add column if not exists scheduled_time     text;   -- 'HH:MM'
