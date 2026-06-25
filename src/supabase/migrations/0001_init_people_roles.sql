-- Extensions
create extension if not exists "pgcrypto";

-- Rôles applicatifs fixes (capacités) — distincts des catégories de référents
-- (configurables, voir role_categories ci-dessous). AppRole est un concept produit
-- stable ; role_categories est du contenu propre à chaque événement.
create type app_role as enum ('fiance', 'referent', 'proche', 'invite');

-- Catégories de référents, configurables depuis l'app (module Paramètres), pas
-- codées en dur. Unifie aussi les sous-modules de Logistique (boissons,
-- décoration, dj...) pour éviter la dérive entre deux listes qui se recouvrent
-- (voir logistique_items dans 0005_logistique.sql).
create table role_categories (
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
-- resolve_access_code() qui évite d'exposer access_code_hash en lecture directe.
create table people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  role app_role not null,
  access_code_hash text not null unique,
  referent_category_id uuid references role_categories(id) on delete set null,
  partner_referent_id uuid references people(id) on delete set null,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on column people.access_code_hash is
  'Hash du code d''accès (crypt/pgcrypto). Ne jamais exposer en lecture directe via la clé anon — voir resolve_access_code() dans 0009_rls_policies.sql.';

-- Configuration globale de l'événement (date, override de mode "jour J" pour les tests).
-- Ligne singleton garantie par une clé primaire à valeur fixe.
create table app_settings (
  id text primary key default 'singleton' check (id = 'singleton'),
  event_name text not null default 'Fiançailles de Sarah & Jordan',
  event_date date not null,
  day_of_override text,
  updated_at timestamptz not null default now()
);
