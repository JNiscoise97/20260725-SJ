-- Checklist matériel pré-peuplée (104 articles, 20 catégories) — fiançailles
-- Sarah & Jordan au Grand Arbre, ≈100 invités. UUIDs fixes pour idempotence.
insert into _20260725_equipment (id, category, label, sort_order, notes) values

-- 1. Mobilier de réception
('e1000001-0000-0000-0000-000000000001', 'Mobilier de réception', 'Tables rondes ou rectangulaires', 0, null),
('e1000001-0000-0000-0000-000000000002', 'Mobilier de réception', 'Table d''honneur', 1, null),
('e1000001-0000-0000-0000-000000000003', 'Mobilier de réception', 'Chaises invités', 2, null),
('e1000001-0000-0000-0000-000000000004', 'Mobilier de réception', 'Chaises des mariés', 3, null),
('e1000001-0000-0000-0000-000000000005', 'Mobilier de réception', 'Tables buffet', 4, null),
('e1000001-0000-0000-0000-000000000006', 'Mobilier de réception', 'Tables techniques DJ', 5, null),
('e1000001-0000-0000-0000-000000000007', 'Mobilier de réception', 'Tables cuisine / office traiteur', 6, null),
('e1000001-0000-0000-0000-000000000008', 'Mobilier de réception', 'Mange-debout cocktail (4 à 8)', 7, null),

-- 2. Linge
('e1000002-0000-0000-0000-000000000001', 'Linge', 'Nappes', 0, null),
('e1000002-0000-0000-0000-000000000002', 'Linge', 'Sur-nappes', 1, null),
('e1000002-0000-0000-0000-000000000003', 'Linge', 'Chemins de table', 2, null),
('e1000002-0000-0000-0000-000000000004', 'Linge', 'Serviettes tissu', 3, null),
('e1000002-0000-0000-0000-000000000005', 'Linge', 'Housses de chaise', 4, null),

-- 3. Vaisselle
('e1000003-0000-0000-0000-000000000001', 'Vaisselle', 'Assiettes entrée (×100)', 0, null),
('e1000003-0000-0000-0000-000000000002', 'Vaisselle', 'Assiettes plat (×100)', 1, null),
('e1000003-0000-0000-0000-000000000003', 'Vaisselle', 'Assiettes dessert (×100)', 2, null),
('e1000003-0000-0000-0000-000000000004', 'Vaisselle', 'Verres eau (×100)', 3, null),
('e1000003-0000-0000-0000-000000000005', 'Vaisselle', 'Verres vin (×100)', 4, null),
('e1000003-0000-0000-0000-000000000006', 'Vaisselle', 'Flûtes champagne (×100)', 5, null),
('e1000003-0000-0000-0000-000000000007', 'Vaisselle', 'Verres cocktail', 6, null),
('e1000003-0000-0000-0000-000000000008', 'Vaisselle', 'Couteaux (×100)', 7, null),
('e1000003-0000-0000-0000-000000000009', 'Vaisselle', 'Fourchettes (×100)', 8, null),
('e1000003-0000-0000-0000-000000000010', 'Vaisselle', 'Cuillères (×100)', 9, null),
('e1000003-0000-0000-0000-000000000011', 'Vaisselle', 'Cuillères dessert (×100)', 10, null),
('e1000003-0000-0000-0000-000000000012', 'Vaisselle', 'Plateaux', 11, null),
('e1000003-0000-0000-0000-000000000013', 'Vaisselle', 'Saladiers', 12, null),
('e1000003-0000-0000-0000-000000000014', 'Vaisselle', 'Corbeilles à pain', 13, null),

-- 4. Matériel buffet
('e1000004-0000-0000-0000-000000000001', 'Matériel buffet', 'Réchauds', 0, null),
('e1000004-0000-0000-0000-000000000002', 'Matériel buffet', 'Chafing dish', 1, null),
('e1000004-0000-0000-0000-000000000003', 'Matériel buffet', 'Bacs gastronormes', 2, null),
('e1000004-0000-0000-0000-000000000004', 'Matériel buffet', 'Louches', 3, null),
('e1000004-0000-0000-0000-000000000005', 'Matériel buffet', 'Pinces', 4, null),
('e1000004-0000-0000-0000-000000000006', 'Matériel buffet', 'Plateaux de service', 5, null),

-- 5. Bar
('e1000005-0000-0000-0000-000000000001', 'Bar', 'Bar mobile', 0, null),
('e1000005-0000-0000-0000-000000000002', 'Bar', 'Seaux à glace', 1, null),
('e1000005-0000-0000-0000-000000000003', 'Bar', 'Vasques à champagne', 2, null),
('e1000005-0000-0000-0000-000000000004', 'Bar', 'Rafraîchisseurs', 3, null),
('e1000005-0000-0000-0000-000000000005', 'Bar', 'Bac à glaçons', 4, null),
('e1000005-0000-0000-0000-000000000006', 'Bar', 'Shakers', 5, null),

-- 6. Froid
('e1000006-0000-0000-0000-000000000001', 'Froid', 'Réfrigérateur supplémentaire', 0, null),
('e1000006-0000-0000-0000-000000000002', 'Froid', 'Congélateur', 1, null),
('e1000006-0000-0000-0000-000000000003', 'Froid', 'Armoire réfrigérée', 2, null),
('e1000006-0000-0000-0000-000000000004', 'Froid', 'Machine à glaçons', 3, null),

-- 7. Sonorisation
('e1000007-0000-0000-0000-000000000001', 'Sonorisation', 'Enceintes cérémonie', 0, null),
('e1000007-0000-0000-0000-000000000002', 'Sonorisation', 'Enceintes cocktail', 1, null),
('e1000007-0000-0000-0000-000000000003', 'Sonorisation', 'Table de mixage', 2, null),
('e1000007-0000-0000-0000-000000000004', 'Sonorisation', 'Micros HF', 3, null),
('e1000007-0000-0000-0000-000000000005', 'Sonorisation', 'Pieds micro', 4, null),

-- 8. Éclairage
('e1000008-0000-0000-0000-000000000001', 'Éclairage', 'Projecteurs LED', 0, null),
('e1000008-0000-0000-0000-000000000002', 'Éclairage', 'Mise en lumière des murs', 1, null),
('e1000008-0000-0000-0000-000000000003', 'Éclairage', 'Éclairage du buffet', 2, null),
('e1000008-0000-0000-0000-000000000004', 'Éclairage', 'Éclairage de la piste', 3, null),
('e1000008-0000-0000-0000-000000000005', 'Éclairage', 'Guirlandes lumineuses terrasse', 4, null),

-- 9. Piste de danse
('e1000009-0000-0000-0000-000000000001', 'Piste de danse', 'Plancher de danse', 0, 'Si le lieu n''en possède pas'),

-- 10. Décoration
('e1000010-0000-0000-0000-000000000001', 'Décoration', 'Arche', 0, null),
('e1000010-0000-0000-0000-000000000002', 'Décoration', 'Colonnes', 1, null),
('e1000010-0000-0000-0000-000000000003', 'Décoration', 'Vases XXL', 2, null),
('e1000010-0000-0000-0000-000000000004', 'Décoration', 'Chandeliers', 3, null),
('e1000010-0000-0000-0000-000000000005', 'Décoration', 'Lanternes', 4, null),
('e1000010-0000-0000-0000-000000000006', 'Décoration', 'Bougeoirs', 5, null),
('e1000010-0000-0000-0000-000000000007', 'Décoration', 'Socles décoratifs', 6, null),
('e1000010-0000-0000-0000-000000000008', 'Décoration', 'Backdrop', 7, null),
('e1000010-0000-0000-0000-000000000009', 'Décoration', 'Cadres', 8, null),
('e1000010-0000-0000-0000-000000000010', 'Décoration', 'Miroirs', 9, null),
('e1000010-0000-0000-0000-000000000011', 'Décoration', 'Pupitre', 10, null),

-- 11. Cérémonie
('e1000011-0000-0000-0000-000000000001', 'Cérémonie', 'Pupitre', 0, null),
('e1000011-0000-0000-0000-000000000002', 'Cérémonie', 'Micro', 1, null),
('e1000011-0000-0000-0000-000000000003', 'Cérémonie', 'Support alliances', 2, null),
('e1000011-0000-0000-0000-000000000004', 'Cérémonie', 'Fauteuils spéciaux familles', 3, null),

-- 12. Signalétique
('e1000012-0000-0000-0000-000000000001', 'Signalétique', 'Chevalet', 0, null),
('e1000012-0000-0000-0000-000000000002', 'Signalétique', 'Porte-plan de table', 1, null),
('e1000012-0000-0000-0000-000000000003', 'Signalétique', 'Panneaux directionnels', 2, null),

-- 13. Extérieur
('e1000013-0000-0000-0000-000000000001', 'Extérieur', 'Parasols', 0, null),
('e1000013-0000-0000-0000-000000000002', 'Extérieur', 'Chauffages extérieurs', 1, 'Si soirée fraîche'),
('e1000013-0000-0000-0000-000000000003', 'Extérieur', 'Salons lounge', 2, null),
('e1000013-0000-0000-0000-000000000004', 'Extérieur', 'Bancs', 3, null),

-- 14. Logistique
('e1000014-0000-0000-0000-000000000001', 'Logistique', 'Portants vêtements', 0, null),
('e1000014-0000-0000-0000-000000000002', 'Logistique', 'Vestiaire', 1, null),
('e1000014-0000-0000-0000-000000000003', 'Logistique', 'Cintres', 2, null),
('e1000014-0000-0000-0000-000000000004', 'Logistique', 'Diables', 3, null),
('e1000014-0000-0000-0000-000000000005', 'Logistique', 'Chariots', 4, null),

-- 15. Électricité
('e1000015-0000-0000-0000-000000000001', 'Électricité', 'Rallonges', 0, null),
('e1000015-0000-0000-0000-000000000002', 'Électricité', 'Multiprises', 1, null),
('e1000015-0000-0000-0000-000000000003', 'Électricité', 'Enrouleurs', 2, null),
('e1000015-0000-0000-0000-000000000004', 'Électricité', 'Passe-câbles', 3, null),

-- 16. Sécurité
('e1000016-0000-0000-0000-000000000001', 'Sécurité', 'Extincteur', 0, null),
('e1000016-0000-0000-0000-000000000002', 'Sécurité', 'Éclairage de secours', 1, null),
('e1000016-0000-0000-0000-000000000003', 'Sécurité', 'Rubalise', 2, 'Si nécessaire'),

-- 17. Sanitaires
('e1000017-0000-0000-0000-000000000001', 'Sanitaires', 'Toilettes mobiles', 0, 'Probablement inutile au Grand Arbre'),

-- 18. Animations
('e1000018-0000-0000-0000-000000000001', 'Animations', 'Photobooth', 0, null),
('e1000018-0000-0000-0000-000000000002', 'Animations', 'Borne photo', 1, null),
('e1000018-0000-0000-0000-000000000003', 'Animations', 'Livre d''or audio', 2, null),
('e1000018-0000-0000-0000-000000000004', 'Animations', 'Machine à bulles', 3, null),
('e1000018-0000-0000-0000-000000000005', 'Animations', 'Machine à fumée lourde', 4, null),
('e1000018-0000-0000-0000-000000000006', 'Animations', 'Étincelles froides', 5, null),

-- 19. Matériel traiteur
('e1000019-0000-0000-0000-000000000001', 'Matériel traiteur', 'Tables inox', 0, 'Si non fourni par le traiteur'),
('e1000019-0000-0000-0000-000000000002', 'Matériel traiteur', 'Étuves', 1, null),
('e1000019-0000-0000-0000-000000000003', 'Matériel traiteur', 'Chariots traiteur', 2, null),
('e1000019-0000-0000-0000-000000000004', 'Matériel traiteur', 'Conteneurs isothermes', 3, null),

-- 20. Divers
('e1000020-0000-0000-0000-000000000001', 'Divers', 'Poubelles design', 0, null),
('e1000020-0000-0000-0000-000000000002', 'Divers', 'Cendriers', 1, null),
('e1000020-0000-0000-0000-000000000003', 'Divers', 'Corbeilles', 2, null),
('e1000020-0000-0000-0000-000000000004', 'Divers', 'Cloches alimentaires', 3, null),
('e1000020-0000-0000-0000-000000000005', 'Divers', 'Paravents cuisine', 4, null)

on conflict (id) do nothing;
