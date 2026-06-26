-- Permet de mettre en avant les "temps forts" du déroulé (page Déroulé) sans
-- avoir à déduire ça du texte des notes.
alter table _20260725_run_of_show_steps
  add column is_highlight boolean not null default false;
