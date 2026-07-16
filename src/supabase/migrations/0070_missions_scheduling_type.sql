alter table _20260725_missions
  add column if not exists scheduling_type text; -- 'planifiee' | 'en_continu'
