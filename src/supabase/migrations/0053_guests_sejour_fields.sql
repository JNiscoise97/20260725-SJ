-- Logistique de séjour par invité, pour le nouvel onglet "Séjour" : départ
-- (en complément de l'arrivée déjà existante), type d'hébergement, moyen de
-- transport pour venir à Montpellier, et présence aux deux activités du
-- vendredi soir (anniversaire de mariage des parents / visite de Montpellier).
create type accommodation_type as enum ('quartier', 'hotel', 'airbnb');
create type travel_mode as enum ('train', 'avion', 'voiture', 'bus');

alter table _20260725_guests
  add column departure_info text,
  add column accommodation_type accommodation_type,
  add column travel_mode travel_mode,
  add column attending_parents_anniversary boolean not null default false,
  add column attending_montpellier_visit boolean not null default false;
