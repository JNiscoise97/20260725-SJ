insert into _20260725_app_settings (id, event_name, event_date) values
  ('singleton', 'Fiançailles de Sarah et Jordan', '2026-07-25');

-- Catégories de référents. solicited_milestone indique à quel moment de
-- l'événement la catégorie est sollicitée ('j_moins_1' = la veille, 'jour_j'
-- = le jour J). preferred_contact_id (le fiancé privilégié pour la
-- catégorie) est renseigné via UPDATE dans 02_people.sql, une fois Sarah et
-- Jordan insérés (contrainte de clé étrangère).
insert into _20260725_role_categories (id, name, slug, sort_order, solicited_milestone) values
  ('11111111-1111-1111-1111-111111111101', 'Boissons (installation)', 'boissons-installation', 1, 'j_moins_1'),
  ('11111111-1111-1111-1111-111111111102', 'Logistique (installation)', 'logistique-installation', 2, 'j_moins_1'),
  ('11111111-1111-1111-1111-111111111103', 'Décoration (installation)', 'decoration-installation', 3, 'j_moins_1'),
  ('11111111-1111-1111-1111-111111111104', 'Cuisine', 'cuisine', 4, 'jour_j'),
  ('11111111-1111-1111-1111-111111111105', 'Fleurs', 'fleurs', 5, 'jour_j'),
  ('11111111-1111-1111-1111-111111111106', 'Coordination générale', 'coordination-generale', 6, 'jour_j'),
  ('11111111-1111-1111-1111-111111111107', 'Accueil invités', 'accueil-invites', 7, 'jour_j'),
  ('11111111-1111-1111-1111-111111111108', 'Accueil prestataires', 'accueil-prestataires', 8, 'jour_j'),
  ('11111111-1111-1111-1111-111111111109', 'Enfants', 'enfants', 9, 'jour_j'),
  ('11111111-1111-1111-1111-111111111110', 'Personnes âgées', 'personnes-agees', 10, 'jour_j'),
  ('11111111-1111-1111-1111-111111111111', 'Cortège', 'cortege', 11, 'jour_j'),
  ('11111111-1111-1111-1111-111111111112', 'Coordination des interventions & photos', 'coordination-interventions-photos', 12, 'jour_j'),
  ('11111111-1111-1111-1111-111111111113', 'Coordination DJ', 'coordination-dj', 13, 'jour_j'),
  ('11111111-1111-1111-1111-111111111114', 'Cérémonie', 'ceremonie', 14, 'jour_j'),
  ('11111111-1111-1111-1111-111111111115', 'Enveloppes & cadeaux', 'enveloppes-cadeaux', 15, 'jour_j'),
  ('11111111-1111-1111-1111-111111111116', 'Parking', 'parking', 16, 'jour_j'),
  ('11111111-1111-1111-1111-111111111117', 'Boissons', 'boissons', 17, 'jour_j'),
  ('11111111-1111-1111-1111-111111111118', 'Imprévus', 'imprevus', 18, 'jour_j'),
  ('11111111-1111-1111-1111-111111111119', 'Logistique (rangement)', 'logistique-rangement', 19, 'jour_j'),
  ('11111111-1111-1111-1111-111111111120', 'Décoration (rangement)', 'decoration-rangement', 20, 'jour_j'),
  ('11111111-1111-1111-1111-111111111121', 'Boissons (rangement)', 'boissons-rangement', 21, 'jour_j');
