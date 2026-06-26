-- Permet de savoir si un invité référent/proche a déjà vu la page
-- d'introduction (mot de Sarah & Jordan) avant de lui donner accès à l'app.
alter table _20260725_guests add column if not exists introduction_seen boolean not null default false;
