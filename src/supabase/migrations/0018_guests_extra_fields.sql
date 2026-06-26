create type meal_choice as enum ('poulet', 'poisson', 'enfant');

alter table _20260725_guests
  add column meal_choice meal_choice,
  add column arrival_info text,
  add column accommodation text,
  add column has_vehicle boolean not null default false,
  add column needs_late_transport boolean not null default false,
  add column is_reduced_mobility boolean not null default false,
  add column is_child boolean not null default false,
  add column child_age integer,
  add column in_cortege boolean not null default false,
  add column communication_j30_sent boolean not null default false,
  add column communication_j15_sent boolean not null default false,
  add column communication_j3_sent boolean not null default false;
