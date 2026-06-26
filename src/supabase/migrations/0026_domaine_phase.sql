-- Phase d'organisation du domaine (distincte de solicited_milestone, qui
-- vise une date précise type J-7/J-1 : phase est la grande étape — Avant,
-- Installation, Jour J, Désinstallation, Après — déjà utilisée implicitement
-- dans les noms de domaines ("Boissons (installation)", "Boissons
-- (rangement)"...) et dans les catégories de tâches/missions d'origine.
create type domaine_phase as enum ('avant', 'installation', 'jour_j', 'desinstallation', 'apres');

alter table _20260725_domaines add column phase domaine_phase;

-- Backfill à partir de la convention de nommage existante. Les domaines
-- restants (sans "(installation)"/"(rangement)" dans le nom) sont très
-- majoritairement des domaines du jour J (voir solicited_milestone dans
-- 01_settings.sql) — à corriger au cas par cas depuis Paramètres > Domaines
-- si ce n'est pas le cas (ex. "Imprévus").
update _20260725_domaines set phase = 'installation' where name ilike '%(installation)%';
update _20260725_domaines set phase = 'desinstallation' where name ilike '%(rangement)%';
update _20260725_domaines set phase = 'jour_j' where phase is null;
