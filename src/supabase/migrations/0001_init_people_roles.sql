-- Extensions
create extension if not exists "pgcrypto";

-- Rôles applicatifs fixes (capacités) — distincts des catégories de référents
-- (configurables, voir _20260725_role_categories ci-dessous). AppRole est un concept produit
-- stable ; _20260725_role_categories est du contenu propre à chaque événement.
create type app_role as enum ('fiance', 'referent', 'proche', 'invite');

-- Catégories de référents, configurables depuis l'app (module Paramètres), pas
-- codées en dur. Unifie aussi les sous-modules de Logistique (boissons,
-- décoration, dj...) pour éviter la dérive entre deux listes qui se recouvrent
-- (voir _20260725_logistique_items dans 0005_logistique.sql).
-- Tables préfixées par _20260725_ pour ne pas entrer en collision avec les
-- tables déjà présentes dans ce projet Supabase partagé.
create table _20260725_role_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  color text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Identité par code d'accès personnel (pas de Supabase Auth). Voir
-- 0009_rls_policies.sql pour le tradeoff de sécurité assumé et la fonction
-- _20260725_resolve_access_code() qui évite d'exposer access_code_hash en lecture directe.
create table _20260725_people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  role app_role not null,
  access_code_hash text not null unique,
  referent_category_id uuid references _20260725_role_categories(id) on delete set null,
  partner_referent_id uuid references _20260725_people(id) on delete set null,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on column _20260725_people.access_code_hash is
  'Hash du code d''accès (crypt/pgcrypto). Ne jamais exposer en lecture directe via la clé anon — voir _20260725_resolve_access_code() dans 0009_rls_policies.sql.';

-- Configuration globale de l'événement (date, override de mode "jour J" pour les tests).
-- Ligne singleton garantie par une clé primaire à valeur fixe.
create table _20260725_app_settings (
  id text primary key default 'singleton' check (id = 'singleton'),
  event_name text not null default 'Fiançailles de Sarah & Jordan',
  event_date date not null,
  day_of_override text,
  updated_at timestamptz not null default now()
);
