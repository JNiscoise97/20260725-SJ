-- Seed de démonstration. Même forme que src/services/mock/data/*, pour
-- vérifier la parité mock <-> Supabase avant de basculer USE_SUPABASE à true.

insert into app_settings (id, event_name, event_date) values
  ('singleton', 'Fiançailles de Sarah & Jordan', '2026-07-25');

insert into role_categories (id, name, slug, icon, color, sort_order) values
  ('11111111-1111-1111-1111-111111111101', 'Décoration', 'decoration', 'Flower2', 'var(--dore)', 1),
  ('11111111-1111-1111-1111-111111111102', 'Boissons', 'boissons', 'GlassWater', 'var(--bordeaux)', 2),
  ('11111111-1111-1111-1111-111111111103', 'DJ', 'dj', 'Music', 'var(--brun)', 3),
  ('11111111-1111-1111-1111-111111111104', 'Accueil', 'accueil', 'DoorOpen', 'var(--vert-vegetal)', 4),
  ('11111111-1111-1111-1111-111111111105', 'Parking', 'parking', 'ParkingSquare', 'var(--brun)', 5),
  ('11111111-1111-1111-1111-111111111106', 'Photos', 'photos', 'Camera', 'var(--dore)', 6);

-- Les codes d'accès en clair ci-dessous (ex. SARAH2026) ne sont utilisés QUE pour
-- générer le hash stocké en base ; voir 0009_rls_policies.sql / resolve_access_code().
insert into people (id, full_name, phone, role, access_code_hash, referent_category_id, partner_referent_id, is_active) values
  ('22222222-2222-2222-2222-222222222201', 'Sarah', '+33600000001', 'fiance', crypt('SARAH2026', gen_salt('bf')), null, null, true),
  ('22222222-2222-2222-2222-222222222202', 'Jordan', '+33600000002', 'fiance', crypt('JORDAN2026', gen_salt('bf')), null, null, true),
  ('22222222-2222-2222-2222-222222222203', 'Camille', '+33600000003', 'referent', crypt('DECO2026', gen_salt('bf')), '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222204', true),
  ('22222222-2222-2222-2222-222222222204', 'Hugo', '+33600000004', 'referent', crypt('BOISSON2026', gen_salt('bf')), '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222203', true),
  ('22222222-2222-2222-2222-222222222205', 'Nina', '+33600000005', 'referent', crypt('DJ2026', gen_salt('bf')), '11111111-1111-1111-1111-111111111103', null, true),
  ('22222222-2222-2222-2222-222222222206', 'Léa', '+33600000006', 'proche', crypt('LEA2026', gen_salt('bf')), null, null, true);

insert into missions (id, role_category_id, referent_id, title, description, status) values
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203', 'Décoration de la salle', 'Nappes, centres de table, arche florale', 'in_progress'),
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222204', 'Bar et boissons', 'Commande, glace, verres, stock', 'todo'),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222205', 'Playlist et sonorisation', 'Playlist, matériel son, micro pour les discours', 'todo');

insert into tasks (mission_id, title, description, priority, status, category, due_date, due_time, owner_id) values
  ('33333333-3333-3333-3333-333333333301', 'Commander les fleurs', 'Bouquets bordeaux et doré', 'high', 'in_progress', 'Décoration', '2026-07-18', '10:00', '22222222-2222-2222-2222-222222222203'),
  ('33333333-3333-3333-3333-333333333301', 'Installer l''arche florale', null, 'normal', 'todo', 'Décoration', '2026-07-25', '14:00', '22222222-2222-2222-2222-222222222203'),
  ('33333333-3333-3333-3333-333333333302', 'Commander les boissons', 'Champagne, softs, vin', 'urgent', 'todo', 'Boissons', '2026-07-15', null, '22222222-2222-2222-2222-222222222204'),
  (null, 'Réserver le traiteur', null, 'urgent', 'done', 'Traiteur', '2026-06-01', null, '22222222-2222-2222-2222-222222222201'),
  (null, 'Valider la liste des invités', null, 'high', 'done', 'Invités', '2026-06-10', null, '22222222-2222-2222-2222-222222222202'),
  (null, 'Envoyer les faire-part', null, 'normal', 'blocked', 'Invités', '2026-06-20', null, '22222222-2222-2222-2222-222222222202'),
  ('33333333-3333-3333-3333-333333333303', 'Préparer la playlist cocktail', null, 'normal', 'todo', 'DJ', '2026-07-20', null, '22222222-2222-2222-2222-222222222205'),
  (null, 'Confirmer le plan de table', null, 'normal', 'in_progress', 'Invités', '2026-07-10', null, '22222222-2222-2222-2222-222222222201'),
  (null, 'Préparer les discours', null, 'low', 'todo', 'Cérémonie', '2026-07-24', null, '22222222-2222-2222-2222-222222222202'),
  ('33333333-3333-3333-3333-333333333302', 'Prévoir les glaçons', null, 'low', 'todo', 'Boissons', '2026-07-24', '16:00', '22222222-2222-2222-2222-222222222204');

insert into checklists (id, owner_type, owner_id, title) values
  ('44444444-4444-4444-4444-444444444401', 'mission', '33333333-3333-3333-3333-333333333301', 'Checklist décoration'),
  ('44444444-4444-4444-4444-444444444402', 'mission', '33333333-3333-3333-3333-333333333302', 'Checklist boissons');

insert into checklist_items (checklist_id, label, is_done, sort_order) values
  ('44444444-4444-4444-4444-444444444401', 'Choisir les couleurs', true, 1),
  ('44444444-4444-4444-4444-444444444401', 'Commander les fleurs', false, 2),
  ('44444444-4444-4444-4444-444444444401', 'Installer la déco le matin', false, 3),
  ('44444444-4444-4444-4444-444444444402', 'Lister les boissons', true, 1),
  ('44444444-4444-4444-4444-444444444402', 'Commander', false, 2),
  ('44444444-4444-4444-4444-444444444402', 'Prévoir les glaçons', false, 3);

insert into planning_events (milestone, title, description, location, starts_at, sort_order) values
  ('j_moins_30', 'Finaliser le traiteur', 'Signature du contrat traiteur', null, '2026-06-25 09:00+02', 1),
  ('j_moins_15', 'Confirmer les prestataires', 'DJ, photographe, fleuriste', null, '2026-07-10 09:00+02', 1),
  ('j_moins_7', 'Récupérer la décoration', null, 'Chez le fleuriste', '2026-07-18 09:00+02', 1),
  ('j_moins_1', 'Installation de la salle', 'Montage déco, sonorisation, tables', 'Salle de réception', '2026-07-24 14:00+02', 1),
  ('jour_j', 'Cérémonie des fiançailles', null, 'Salle de réception', '2026-07-25 17:00+02', 1),
  ('j_plus_1', 'Rangement et retours matériel', null, 'Salle de réception', '2026-07-26 10:00+02', 1);

insert into run_of_show_steps (id, time_label, starts_at, label, duration_minutes, location, sort_order) values
  ('55555555-5555-5555-5555-555555555501', '17h00', '2026-07-25 17:00+02', 'Accueil', 30, 'Entrée', 1),
  ('55555555-5555-5555-5555-555555555502', '17h30', '2026-07-25 17:30+02', 'Procession', 30, 'Jardin', 2),
  ('55555555-5555-5555-5555-555555555503', '18h00', '2026-07-25 18:00+02', 'Demande officielle', 30, 'Jardin', 3),
  ('55555555-5555-5555-5555-555555555504', '18h30', '2026-07-25 18:30+02', 'Échange des bagues', 30, 'Jardin', 4),
  ('55555555-5555-5555-5555-555555555505', '19h00', '2026-07-25 19:00+02', 'Cocktail', 90, 'Terrasse', 5);

insert into run_of_show_responsibles (run_of_show_step_id, person_id) values
  ('55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222203'),
  ('55555555-5555-5555-5555-555555555505', '22222222-2222-2222-2222-222222222204');

insert into logistique_items (role_category_id, name, responsable_id, quantity, unit, notes) values
  ('11111111-1111-1111-1111-111111111101', 'Arche florale', '22222222-2222-2222-2222-222222222203', 1, 'pièce', 'À récupérer chez le fleuriste J-7'),
  ('11111111-1111-1111-1111-111111111102', 'Champagne', '22222222-2222-2222-2222-222222222204', 24, 'bouteilles', null),
  ('11111111-1111-1111-1111-111111111103', 'Enceintes', '22222222-2222-2222-2222-222222222205', 2, 'pièces', 'Prévoir micro pour les discours'),
  ('11111111-1111-1111-1111-111111111104', 'Panneau de bienvenue', null, 1, 'pièce', null),
  ('11111111-1111-1111-1111-111111111105', 'Fléchage parking', null, 6, 'pièces', null),
  ('11111111-1111-1111-1111-111111111106', 'Carte mémoire appareil photo', null, 2, 'pièces', null);

insert into guest_groups (id, family_name) values
  ('66666666-6666-6666-6666-666666666601', 'Famille Bluker'),
  ('66666666-6666-6666-6666-666666666602', 'Famille Martin'),
  ('66666666-6666-6666-6666-666666666603', 'Amis');

insert into guests (id, group_id, full_name, phone, rsvp_status, dietary_constraints, plus_one) values
  ('88888888-8888-8888-8888-888888888801', '66666666-6666-6666-6666-666666666601', 'Paul Bluker', '+33600000010', 'confirmed', null, false),
  ('88888888-8888-8888-8888-888888888802', '66666666-6666-6666-6666-666666666601', 'Claire Bluker', '+33600000011', 'confirmed', 'Végétarienne', false),
  ('88888888-8888-8888-8888-888888888803', '66666666-6666-6666-6666-666666666602', 'Anne Martin', '+33600000012', 'confirmed', null, true),
  ('88888888-8888-8888-8888-888888888804', '66666666-6666-6666-6666-666666666602', 'Marc Martin', '+33600000013', 'pending', null, false),
  ('88888888-8888-8888-8888-888888888805', '66666666-6666-6666-6666-666666666603', 'Inès Dupont', '+33600000014', 'confirmed', 'Sans gluten', false),
  ('88888888-8888-8888-8888-888888888806', '66666666-6666-6666-6666-666666666603', 'Yanis Cohen', '+33600000015', 'declined', null, false),
  ('88888888-8888-8888-8888-888888888807', '66666666-6666-6666-6666-666666666603', 'Sofia Rossi', '+33600000016', 'confirmed', null, true),
  ('88888888-8888-8888-8888-888888888808', '66666666-6666-6666-6666-666666666603', 'Karim Haddad', '+33600000017', 'pending', null, false);

insert into tables (id, name, capacity) values
  ('77777777-7777-7777-7777-777777777701', 'Table 1', 8),
  ('77777777-7777-7777-7777-777777777702', 'Table 2', 6);

insert into table_assignments (table_id, guest_id, seat_number) values
  ('77777777-7777-7777-7777-777777777701', '88888888-8888-8888-8888-888888888801', 1),
  ('77777777-7777-7777-7777-777777777701', '88888888-8888-8888-8888-888888888802', 2),
  ('77777777-7777-7777-7777-777777777701', '88888888-8888-8888-8888-888888888803', 3),
  ('77777777-7777-7777-7777-777777777702', '88888888-8888-8888-8888-888888888805', 1);

insert into attachments (id, entity_type, entity_id, file_path, file_name, mime_type, uploaded_by) values
  ('99999999-9999-9999-9999-999999999901', null, null, 'documents/planning.pdf', 'Planning général.pdf', 'application/pdf', '22222222-2222-2222-2222-222222222201'),
  ('99999999-9999-9999-9999-999999999902', null, null, 'documents/inventaire-boissons.pdf', 'Inventaire boissons.pdf', 'application/pdf', '22222222-2222-2222-2222-222222222204'),
  ('99999999-9999-9999-9999-999999999903', null, null, 'documents/playlist-dj.pdf', 'Playlist DJ.pdf', 'application/pdf', '22222222-2222-2222-2222-222222222205');

insert into documents (attachment_id, title, category, visible_to_roles) values
  ('99999999-9999-9999-9999-999999999901', 'Planning général', 'Planning', array['fiance', 'referent', 'proche']::app_role[]),
  ('99999999-9999-9999-9999-999999999902', 'Inventaire boissons', 'Logistique', array['fiance', 'referent']::app_role[]),
  ('99999999-9999-9999-9999-999999999903', 'Playlist DJ', 'Logistique', array['fiance', 'referent']::app_role[]);

insert into comments (entity_type, entity_id, author_id, body) values
  ('task', (select id from tasks where title = 'Commander les fleurs'), '22222222-2222-2222-2222-222222222201', 'Pense à vérifier la couleur exacte du bordeaux avec le fleuriste !'),
  ('mission', '33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', 'On reste sur 24 bouteilles de champagne, ça devrait suffire.');

insert into notifications (recipient_id, channel, title, body, status) values
  ('22222222-2222-2222-2222-222222222203', 'email', 'Nouvelle tâche assignée', 'Une nouvelle tâche "Commander les fleurs" vous a été assignée.', 'pending');
