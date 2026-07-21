-- Ajout des champs type d'événement + plages horaires des phases
alter table _20260725_app_settings
  add column if not exists event_type  text not null default 'fiancailles',
  add column if not exists main_end     date,
  add column if not exists main_time    time,
  add column if not exists setup_start  date,
  add column if not exists setup_end    date,
  add column if not exists setup_time   time,
  add column if not exists cleanup_start date,
  add column if not exists cleanup_end  date,
  add column if not exists cleanup_time time;
