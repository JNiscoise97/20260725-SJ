-- Déroulé minute par minute fourni par Jordan. La colonne CULTURE n'avait
-- presque jamais de valeur dans la source et a été omise ; PHASE/MUSIQUE/NOTES
-- ORGANISATEURS sont repris dans les colonnes phase/music/notes (voir
-- 0015_run_of_show_phase_music_notes.sql).
insert into _20260725_run_of_show_steps
  (id, time_label, starts_at, label, duration_minutes, location, phase, music, notes, is_highlight, sort_order) values
  ('55555555-5555-5555-5555-555555555601', 'La veille', null, 'Dépôt des boissons', null, 'Lieu de réception', 'LOGISTIQUE', null, 'Prévoir accès et stockage froid si besoin.', false, 1),
  ('55555555-5555-5555-5555-555555555602', '11h00', '2026-07-24 11:00+02', 'Installation décoration et matériel son/lumière', 180, 'Salle de réception', 'LOGISTIQUE', 'Soundcheck DJ', 'Vérifier retours DJ, micros discours, sono terrasse.', false, 2),
  ('55555555-5555-5555-5555-555555555603', '16h00', '2026-07-25 16:00+02', 'Arrivée de Sarah et ses parents — ils restent dans la salle de réception jusqu''à la cérémonie', null, null, null, null, null, false, 3),
  ('55555555-5555-5555-5555-555555555604', '16h30', '2026-07-25 16:30+02', 'Accueil équipe et derniers préparatifs ; arrivée des premiers invités, accueil par Charlotte et Maxime', 30, 'Lieu de réception', 'LOGISTIQUE', null, 'Brief final avec DJ, traiteur, décorateur, photographe et vidéaste.', false, 4),
  ('55555555-5555-5555-5555-555555555605', '17h00', '2026-07-25 17:00+02', 'Ouverture du lieu', 25, 'Entrée + terrasse', 'CÉRÉMONIE', 'Fond musical doux – Afro chill lounge', 'Petite enceinte : volume très bas. Conversations libres.', false, 5),
  ('55555555-5555-5555-5555-555555555606', '17h20', '2026-07-25 17:20+02', 'Point de RDV cortège au parking (15 proches de Jordan)', 10, 'Parking', 'CÉRÉMONIE', null, null, false, 6),
  ('55555555-5555-5555-5555-555555555607', '17h30', '2026-07-25 17:30+02', 'Les invités présents sortent accueillir le cortège, prise de position', 10, 'Allée parking', 'CÉRÉMONIE', 'https://www.youtube.com/watch?v=OLuLY4bQJu0&t=9s', 'Coordonner avec le DJ : silence pour que le tambour soit audible.', false, 7),
  ('55555555-5555-5555-5555-555555555608', '17h30', '2026-07-25 17:30+02', 'Départ du cortège avec tambour', 10, 'Trajet parking → terrasse', 'CÉRÉMONIE', 'https://www.youtube.com/watch?v=OLuLY4bQJu0&t=9s', 'Cortège limité à 15 personnes. Le tambour rythme la marche. Jordan porte le plateau avec bague et fleurs.', true, 8),
  ('55555555-5555-5555-5555-555555555609', '17h40', '2026-07-25 17:40+02', 'Arrivée du cortège au lieu de réception', 5, 'Entrée du lieu', 'CÉRÉMONIE', 'https://www.youtube.com/watch?v=OLuLY4bQJu0&t=9s', 'Moment d''acclamation des invités déjà présents.', false, 9),
  ('55555555-5555-5555-5555-555555555610', '17h50', '2026-07-25 17:50+02', 'Les invités se placent de part et d''autre de l''allée centrale (terrasse)', 5, 'Terrasse', 'CÉRÉMONIE', 'Montée musicale douce – Gwoka / Biguine instrumentale', 'Placement orchestré. Allée centrale dégagée.', false, 10),
  ('55555555-5555-5555-5555-555555555611', '17h55', '2026-07-25 17:55+02', 'Signal donné, entrée imminente du cortège', 2, 'Terrasse', 'CÉRÉMONIE', 'Silence ou roulement de tambour', 'Signal visuel ou sonore (tambour) pour préparer l''entrée.', false, 11),
  ('55555555-5555-5555-5555-555555555612', '17h57', '2026-07-25 17:57+02', 'Entrée du cortège sur la terrasse, mise en place', 3, 'Allée terrasse', 'CÉRÉMONIE', 'https://www.youtube.com/watch?v=OLuLY4bQJu0&t=9s', 'Ambiance festive contrôlée.', false, 12),
  ('55555555-5555-5555-5555-555555555613', '18h00', '2026-07-25 18:00+02', 'Entrée de Sarah avec ses parents dans l''allée centrale', 5, 'Allée terrasse', 'CÉRÉMONIE', 'A love song – Garth Stevenson', 'Moment clé fort.', true, 13),
  ('55555555-5555-5555-5555-555555555614', '18h05', '2026-07-25 18:05+02', 'Présentation des familles par les parents respectifs, puis des futurs fiancés par leurs parents', 10, 'Terrasse', 'CÉRÉMONIE', 'Fond très doux', 'Micro nécessaire. Musique de fond.', false, 14),
  ('55555555-5555-5555-5555-555555555615', '18h15', '2026-07-25 18:15+02', 'Expression par les parents de Jordan du souhait d''union', 2, 'Terrasse', 'CÉRÉMONIE', 'Fond très doux', 'Moment solennel.', false, 15),
  ('55555555-5555-5555-5555-555555555616', '18h17', '2026-07-25 18:17+02', 'Présentation symbolique de la bague par Jordan', 5, 'Allée terrasse', 'CÉRÉMONIE', 'Se pas pou dat – Zo konpa, Konpa Lakay', 'Moment clé émotion.', true, 16),
  ('55555555-5555-5555-5555-555555555617', '18h22', '2026-07-25 18:22+02', 'Négociation familiale, joute humoristique', 3, 'Terrasse', 'CÉRÉMONIE', 'Fond très doux', 'Ambiance décontractée. Le DJ peut accompagner les rires.', false, 17),
  ('55555555-5555-5555-5555-555555555618', '18h25', '2026-07-25 18:25+02', 'Acceptation de l''union par les parents de Sarah', 2, 'Terrasse', 'CÉRÉMONIE', 'Montée musicale douce', 'Retour au sérieux. Moment émouvant.', false, 18),
  ('55555555-5555-5555-5555-555555555619', '18h27', '2026-07-25 18:27+02', 'Demande en mariage par Jordan', 2, 'Terrasse', 'CÉRÉMONIE', 'Silence', 'Le moment.', true, 19),
  ('55555555-5555-5555-5555-555555555620', '18h29', '2026-07-25 18:29+02', 'Réponse de Sarah', 1, 'Terrasse', 'CÉRÉMONIE', 'Mr Fete – Machel Montano', 'Le DJ doit être prêt à déclencher immédiatement.', true, 20),
  ('55555555-5555-5555-5555-555555555621', '18h30', '2026-07-25 18:30+02', 'Embrassades, photos, félicitations', 10, 'Terrasse', 'CÉRÉMONIE', 'Ambiance joyeuse', 'Énergie montante. Laisser les invités s''exprimer.', false, 21),
  ('55555555-5555-5555-5555-555555555622', '18h40', '2026-07-25 18:40+02', 'Toast : bienvenue et séance photo', 45, 'Terrasse / Salon', 'SEMI-FORMEL', null, 'Musique douce pendant le discours du toast.', false, 22),
  ('55555555-5555-5555-5555-555555555623', '18h50', '2026-07-25 18:50+02', 'Ouverture du cocktail, DJ chill', 70, 'Salon / Terrasse', 'SEMI-FORMEL', null, 'Volume modéré pour permettre la conversation.', false, 23),
  ('55555555-5555-5555-5555-555555555624', '20h00', '2026-07-25 20:00+02', 'Installation des invités selon le plan de table', 15, 'Salle buffet', 'SEMI-FORMEL', 'Musique douce – transition', 'Annonce micro pour guider le placement. DJ maintient fond musical.', false, 24),
  ('55555555-5555-5555-5555-555555555625', '20h30', '2026-07-25 20:30+02', 'Petits discours éventuels', 5, 'Salle buffet', 'SEMI-FORMEL', null, 'Volume conversationnel. Varier les cultures progressivement.', false, 25),
  ('55555555-5555-5555-5555-555555555626', '20h45', '2026-07-25 20:45+02', 'Service du plat chaud', 45, 'Scène / espace dédié', 'SEMI-FORMEL', null, null, false, 26),
  ('55555555-5555-5555-5555-555555555627', '21h45', '2026-07-25 21:45+02', 'Ouverture du bal : Afindrafindrao, puis musique lancée', 60, 'Salle buffet', 'SEMI-FORMEL', null, null, true, 27),
  ('55555555-5555-5555-5555-555555555628', '23h00', '2026-07-25 23:00+02', 'Présentation et dégustation du gâteau', 30, 'Salle buffet', 'FESTIF', 'Musique plus calme', null, true, 28),
  ('55555555-5555-5555-5555-555555555629', '23h30', '2026-07-25 23:30+02', 'Dancefloor', 30, 'Dancefloor', 'FESTIF', null, 'Énergie maximale. Invitations à danser.', false, 29),
  ('55555555-5555-5555-5555-555555555630', '01h00', '2026-07-26 01:00+02', 'Annonce : remerciements et soirée continue ; départ des serveurs, logistique des boissons', 180, 'Dancefloor', 'FESTIF', 'DJ set libre jusqu''à 4h', 'Fin officielle pour les familles. Les noctambules restent. Le DJ joue jusqu''à 4h du matin.', false, 30);

-- Responsables explicitement nommés dans le déroulé.
insert into _20260725_run_of_show_responsibles (run_of_show_step_id, person_id) values
  ('55555555-5555-5555-5555-555555555604', '22222222-2222-2222-2222-222222222309'), -- Accueil équipe : Charlotte
  ('55555555-5555-5555-5555-555555555604', '22222222-2222-2222-2222-222222222310'), -- Accueil équipe : Maxime
  ('55555555-5555-5555-5555-555555555608', '22222222-2222-2222-2222-222222222302'), -- Départ du cortège : Jordan porte le plateau
  ('55555555-5555-5555-5555-555555555613', '22222222-2222-2222-2222-222222222301'), -- Entrée de Sarah
  ('55555555-5555-5555-5555-555555555616', '22222222-2222-2222-2222-222222222302'), -- Présentation de la bague : Jordan
  ('55555555-5555-5555-5555-555555555619', '22222222-2222-2222-2222-222222222302'), -- Demande en mariage : Jordan
  ('55555555-5555-5555-5555-555555555620', '22222222-2222-2222-2222-222222222301'); -- Réponse de Sarah
