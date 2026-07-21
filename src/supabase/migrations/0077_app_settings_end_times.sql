-- Heures de fin pour chaque phase (Jour J, Installation, Désinstallation)
alter table _20260725_app_settings
  add column if not exists main_end_time    time,
  add column if not exists setup_end_time   time,
  add column if not exists cleanup_end_time time;
