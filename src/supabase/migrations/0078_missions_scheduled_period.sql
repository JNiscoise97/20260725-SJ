-- Période planifiée d'une mission : date+heure de début et de fin
alter table _20260725_missions
  add column if not exists scheduled_start_date date,
  add column if not exists scheduled_start_time time,
  add column if not exists scheduled_end_date   date,
  add column if not exists scheduled_end_time   time;
