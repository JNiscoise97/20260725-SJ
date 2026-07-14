alter table _20260725_ros_messages
  add column if not exists deliverer_type text,
  add column if not exists deliverer_person_id uuid references _20260725_people(id) on delete set null;
