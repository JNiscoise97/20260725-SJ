-- Téléphone volontairement omis (tout le monde se connaît déjà). Les codes
-- d'accès en clair ci-dessous ne servent qu'à générer le hash stocké ; voir
-- 0012_resolve_access_code_case_insensitive.sql (comparaison insensible à la casse).
insert into _20260725_people (id, full_name, role, access_code_hash, is_active) values
  ('22222222-2222-2222-2222-222222222301', 'Sarah', 'fiance', crypt(upper('SARAH1999'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222302', 'Jordan', 'fiance', crypt(upper('JORDAN1995'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222303', 'Papa Fidaly', 'referent', crypt(upper('PAPA1948'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222304', 'Maman Nini', 'referent', crypt(upper('MAMAN1979'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222305', 'Papa Georges', 'referent', crypt(upper('PAPA1964'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222306', 'Maman Corine', 'proche', crypt(upper('MAMAN1968'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222307', 'Coraline', 'referent', crypt(upper('COCO1997'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222308', 'Lisa', 'referent', crypt(upper('MAY1999'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222309', 'Charlotte', 'referent', crypt(upper('CHACHA'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222310', 'Maxime', 'referent', crypt(upper('MAXOU1995'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222311', 'Julien', 'referent', crypt(upper('JU1994'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222312', 'William', 'referent', crypt(upper('WILL2001'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222313', 'Florine', 'referent', crypt(upper('FLO1981'), gen_salt('bf')), true),
  ('22222222-2222-2222-2222-222222222314', 'Tatie Patricia', 'referent', crypt(upper('TATIE1967'), gen_salt('bf')), true);

-- Assignation référent principal / secondaire par catégorie.
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222303' where slug = 'enveloppes-cadeaux'; -- Papa Fidaly
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222304' where slug = 'cuisine'; -- Maman Nini
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222305' where slug = 'boissons-installation'; -- Papa Georges
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222307' where slug in ('cortege', 'coordination-interventions-photos'); -- Coraline
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222308' where slug = 'coordination-generale'; -- Lisa
-- Accueil invités : binôme Charlotte (principale) / Maxime (secondaire) — à confirmer, l'ordre n'a pas été précisé.
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222309', secondary_referent_id = '22222222-2222-2222-2222-222222222310' where slug = 'accueil-invites';
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222311' where slug in ('boissons-rangement', 'parking'); -- Julien
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222312' where slug = 'coordination-dj'; -- William
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222313' where slug = 'enfants'; -- Florine
update _20260725_role_categories set primary_referent_id = '22222222-2222-2222-2222-222222222314' where slug = 'fleurs'; -- Tatie Patricia

-- preferred_contact_id sur les catégories (qui contacter en priorité — voir 01_settings.sql).
update _20260725_role_categories set preferred_contact_id = '22222222-2222-2222-2222-222222222302' -- Jordan
  where slug in ('boissons-installation', 'logistique-installation', 'cuisine', 'accueil-invites',
                 'accueil-prestataires', 'enfants', 'personnes-agees', 'cortege',
                 'coordination-interventions-photos', 'coordination-dj', 'ceremonie', 'parking',
                 'boissons', 'logistique-rangement', 'boissons-rangement');
update _20260725_role_categories set preferred_contact_id = '22222222-2222-2222-2222-222222222301' -- Sarah
  where slug in ('decoration-installation', 'fleurs', 'coordination-generale',
                 'enveloppes-cadeaux', 'imprevus', 'decoration-rangement');

-- TODO : catégories encore sans référent assigné — à dispatcher :
-- Logistique (installation), Décoration (installation), Accueil prestataires,
-- Personnes âgées, Cérémonie, Boissons, Imprévus, Logistique (rangement),
-- Décoration (rangement).
