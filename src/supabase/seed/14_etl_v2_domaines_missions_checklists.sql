-- Généré par scratchpad/gen-etl-v2.js depuis une lecture éditoriale de src/tmp/*.md.
-- Remplace l'ETL v1 (seed 13) : regroupement réel items->missions->domaines->pôles,
-- narratifs de mission, prérequis, DoD par domaine. À exécuter après 0034 et 0035.

insert into _20260725_domaines
  (id, pole_id, name, slug, description, phase, sort_order, solicited_milestone, preferred_contact_id)
values
  ('206811c1-d382-4a37-a70d-a85906499870', '759db7f6-8d47-460f-8754-baea591431a2', 'Organiser la coordination des prestataires et référents', 'organiser-la-coordination-des-prestataires-et-referents', 'Mettre en place l''annuaire et le réseau de référents qui permettront de déléguer sereinement chaque sujet de la soirée.', 'avant', 10, 'j_moins_15', '22222222-2222-2222-2222-222222222301'),
  ('b7f374a1-acfd-45c1-939e-a35a2222acff', '759db7f6-8d47-460f-8754-baea591431a2', 'Rédiger et faire valider le déroulé de la cérémonie', 'rediger-et-faire-valider-le-deroule-de-la-ceremonie', 'Produire le conducteur minuté de la soirée et le faire valider par toutes les parties qui doivent s''y tenir.', 'avant', 20, 'j_moins_15', '22222222-2222-2222-2222-222222222301'),
  ('aa13ce4c-eaae-46d8-8192-444734ed97c5', '759db7f6-8d47-460f-8754-baea591431a2', 'Superviser la salle et les équipes la veille', 'superviser-la-salle-et-les-equipes-la-veille', 'Verrouiller tous les horaires et faire le dernier tour de contrôle de la salle avant le jour J.', 'installation', 30, 'j_moins_1', '22222222-2222-2222-2222-222222222302'),
  ('c0dbe0ef-2c67-4f2f-8dad-b68e1d4c4ee9', '759db7f6-8d47-460f-8754-baea591431a2', 'Piloter le déroulé en direct', 'piloter-le-deroule-en-direct', 'Tenir le conducteur minute par minute le jour J et être l''interlocuteur unique de tous les prestataires sur place.', 'jour_j', 40, 'jour_j', null),
  ('fa5676e2-a69c-4916-93e5-2ff9ac315c02', '759db7f6-8d47-460f-8754-baea591431a2', 'Accompagner la fin de soirée et les départs', 'accompagner-la-fin-de-soiree-et-les-departs', 'Clôturer la soirée côté fiancés : départs, matériel récupéré, valeurs sécurisées.', 'desinstallation', 50, 'j_plus_1', '22222222-2222-2222-2222-222222222302'),
  ('7c508703-130e-4e62-811d-14fbbd87c9bf', '759db7f6-8d47-460f-8754-baea591431a2', 'Organiser le debriefing post-événement', 'organiser-le-debriefing-post-evenement', 'Capitaliser sur les retours des référents pour documenter ce qui a fonctionné et ce qui peut être amélioré.', 'apres', 60, 'j_plus_1', '22222222-2222-2222-2222-222222222301'),
  ('e32539b3-e3b3-46ea-ab6a-83c059100e79', 'bdd44145-ff24-44cb-adf3-4a74b2681ba0', 'Sécuriser les conditions logistiques avec le Grand Arbre', 'securiser-les-conditions-logistiques-avec-le-grand-arbre', 'Verrouiller avec le lieu tout ce qui conditionne le déroulement pratique de la soirée : effectifs, menu, timing, accès, plan de salle.', 'avant', 70, 'j_moins_15', '22222222-2222-2222-2222-222222222301'),
  ('4e903efa-2d9c-48d3-a930-327528a1d3a1', 'bdd44145-ff24-44cb-adf3-4a74b2681ba0', 'Clôturer la location du lieu', 'cloturer-la-location-du-lieu', 'Finaliser administrativement la location du Grand Arbre après l''événement.', 'desinstallation', 80, 'j_plus_1', '22222222-2222-2222-2222-222222222301'),
  ('f599e758-c923-4395-a034-18b1b9935f19', 'ab97c7cf-49ef-4d53-9e64-91f29373261b', 'Centraliser les réponses RSVP', 'centraliser-les-reponses-rsvp', 'Recenser qui vient, avec quel choix de plat et quel horaire d''arrivée, et en faire une référence partagée.', 'avant', 90, 'j_moins_15', '22222222-2222-2222-2222-222222222302'),
  ('7dbe270b-11a3-4f4a-9195-3a8f16c62ec1', 'ab97c7cf-49ef-4d53-9e64-91f29373261b', 'Organiser l''hébergement des invités venant de loin', 'organiser-l-hebergement-des-invites-venant-de-loin', 'S''assurer que chaque invité venant de loin sait où il loge.', 'avant', 100, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('03b6fd37-e7be-4579-8234-dee7967f4905', 'ab97c7cf-49ef-4d53-9e64-91f29373261b', 'Accompagner le départ des invités hébergés', 'accompagner-le-depart-des-invites-heberges', 'S''assurer que les invités hébergés ont tous un retour organisé le lendemain.', 'desinstallation', 110, 'j_plus_1', '22222222-2222-2222-2222-222222222302'),
  ('a77b6bb0-34c3-4007-8966-847eec3e5dd6', 'ab97c7cf-49ef-4d53-9e64-91f29373261b', 'Organiser le transport des invités', 'organiser-le-transport-des-invites', 'Cartographier les besoins de transport jour J et sécuriser une solution de repli pour les retours tardifs.', 'avant', 120, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('fd743a26-3bed-454f-b68c-2d4bd26e5793', 'ab97c7cf-49ef-4d53-9e64-91f29373261b', 'Préparer la communication aux invités', 'preparer-la-communication-aux-invites', 'Tenir les invités informés à chaque étape clé avant la soirée.', 'avant', 130, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('3ec032fd-3bf0-4d2a-92f6-b564a78b7a27', 'ab97c7cf-49ef-4d53-9e64-91f29373261b', 'Accueillir et orienter les invités', 'accueillir-et-orienter-les-invites', 'Être le premier visage que chaque invité voit en arrivant, et s''assurer qu''il trouve sa place sans difficulté.', 'jour_j', 140, 'jour_j', null),
  ('e62b6d0e-e468-4d71-8e31-320d0eb4ef0b', 'f02c7440-3d52-4216-bb63-86928043c6b8', 'Briefer le DJ et préparer la playlist', 'briefer-le-dj-et-preparer-la-playlist', 'Cadrer le matériel, le timing et la musique avec le DJ avant le jour J.', 'avant', 150, 'j_moins_15', '22222222-2222-2222-2222-222222222302'),
  ('1b312d99-5a2e-4b28-9c68-d7ecc8f51adc', 'f02c7440-3d52-4216-bb63-86928043c6b8', 'Préparer les discours et désigner un MC', 'preparer-les-discours-et-designer-un-mc', 'Cadrer en amont qui parle, dans quel ordre, et avec quel micro.', 'avant', 160, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('513b3367-745e-4099-8599-409361d92f61', 'f02c7440-3d52-4216-bb63-86928043c6b8', 'Animer les discours et tenir le micro', 'animer-les-discours-et-tenir-le-micro', 'Faire vivre le moment des discours avec fluidité, du premier au dernier intervenant.', 'jour_j', 170, 'jour_j', null),
  ('59a6511e-c02b-4d7d-93bb-4351f9cb88aa', 'f02c7440-3d52-4216-bb63-86928043c6b8', 'Préparer le plan de table', 'preparer-le-plan-de-table', 'Construire un plan de table qui tient compte des contraintes de chacun, et le rendre visible le jour J.', 'avant', 180, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('4534a9c4-8e1c-4cd2-aaf8-0597e7d6b871', 'f02c7440-3d52-4216-bb63-86928043c6b8', 'Décider d''un cadeau pour les parents', 'decider-d-un-cadeau-pour-les-parents', 'Trancher s''il y a une attention pour les parents et l''organiser si oui.', 'avant', 190, 'j_moins_15', '22222222-2222-2222-2222-222222222301'),
  ('13bef7e0-c96d-4ce4-9121-805aed2e56b1', 'f02c7440-3d52-4216-bb63-86928043c6b8', 'Préparer le cortège', 'preparer-le-cortege', 'Composer le cortège et s''assurer que chaque participant a répété son rôle.', 'avant', 200, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('95e88d3a-6cf4-465e-bbd4-ee9c9c9f37c1', 'f02c7440-3d52-4216-bb63-86928043c6b8', 'Lancer et coordonner le cortège', 'lancer-et-coordonner-le-cortege', 'Faire démarrer le cortège à l''heure exacte prévue, dans l''ordre établi.', 'jour_j', 210, 'jour_j', null),
  ('ceaf3a47-e85e-4588-b63c-41927707a87a', 'f02c7440-3d52-4216-bb63-86928043c6b8', 'Caler une répétition de la cérémonie', 'caler-une-repetition-de-la-ceremonie', 'S''assurer qu''au moins une répétition a eu lieu avec les intervenants clés avant le jour J.', 'avant', 220, 'j_moins_7', '22222222-2222-2222-2222-222222222301'),
  ('4729b1aa-ad15-4b22-8ff2-abdafe73a855', 'bbeb427d-9a6c-41d9-8f8b-624e582f2c72', 'Commander les spécialités et traiteurs externes', 'commander-les-specialites-et-traiteurs-externes', 'Sécuriser l''approvisionnement de toutes les spécialités culturelles du repas, commandées ou faites maison.', 'avant', 230, 'j_moins_15', '22222222-2222-2222-2222-222222222301'),
  ('110474ca-e601-4539-8592-df041cbf7878', 'bbeb427d-9a6c-41d9-8f8b-624e582f2c72', 'Réceptionner et préparer les spécialités', 'receptionner-et-preparer-les-specialites', 'Réceptionner les commandes externes et préparer les spécialités maison la veille de l''événement.', 'installation', 240, 'j_moins_1', null),
  ('31e5aa43-898d-4040-9a49-afcc1ee12a7a', 'bbeb427d-9a6c-41d9-8f8b-624e582f2c72', 'Acheminer et vérifier les spécialités le matin', 'acheminer-et-verifier-les-specialites-le-matin', 'Faire arriver les spécialités maison sur le lieu de réception, prêtes à être servies.', 'jour_j', 250, 'jour_j', null),
  ('253d4f9f-951b-4f08-9c06-eb990a04fe67', 'bbeb427d-9a6c-41d9-8f8b-624e582f2c72', 'Acheter et stocker les boissons', 'acheter-et-stocker-les-boissons', 'Constituer et suivre le stock de boissons, et désigner qui en sera responsable le jour J.', 'avant', 260, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('23e84e36-968b-4a98-bcaa-2f0d02530e2c', 'bbeb427d-9a6c-41d9-8f8b-624e582f2c72', 'Acheminer les boissons au lieu', 'acheminer-les-boissons-au-lieu', 'Transporter, décharger et mettre au froid les boissons la veille de l''événement.', 'installation', 270, 'j_moins_1', null),
  ('f56729a1-8215-40f9-bd1d-86ccd08803de', 'bbeb427d-9a6c-41d9-8f8b-624e582f2c72', 'Servir les boissons toute la soirée', 'servir-les-boissons-toute-la-soiree', 'Assurer un service de boissons continu, du cocktail jusqu''à la fin de la nuit.', 'jour_j', 280, 'jour_j', null),
  ('bab0cc3b-9c36-425e-9975-b7382bf3d641', 'bbeb427d-9a6c-41d9-8f8b-624e582f2c72', 'Préparer la prise en charge des restrictions alimentaires', 'preparer-la-prise-en-charge-des-restrictions-alimentaires', 'Mettre en place un système clair pour identifier et signaler les restrictions et allergies à table.', 'avant', 290, 'j_moins_7', '22222222-2222-2222-2222-222222222301'),
  ('e1e223af-47c8-4da0-9c87-548bf336be97', 'bbeb427d-9a6c-41d9-8f8b-624e582f2c72', 'Signaler les plats spéciaux pendant le service', 'signaler-les-plats-speciaux-pendant-le-service', 'Veiller à ce que chaque plat spécial arrive à la bonne personne pendant le service.', 'jour_j', 300, 'jour_j', null),
  ('b3795650-bc2c-4988-9cd0-6a982e6d8f5e', '6f004e0c-8a42-43fd-9c30-5e4006373c0f', 'Concevoir la décoration', 'concevoir-la-decoration', 'Définir le thème, choisir le fleuriste et commander tous les éléments décoratifs.', 'avant', 310, 'j_moins_15', '22222222-2222-2222-2222-222222222301'),
  ('a0834734-1cd1-4a38-9a99-46d0c633b788', '6f004e0c-8a42-43fd-9c30-5e4006373c0f', 'Installer la décoration', 'installer-la-decoration', 'Monter toute la décoration et réceptionner les fleurs la veille de l''événement.', 'installation', 320, 'j_moins_1', null),
  ('7089f775-76cb-42c7-8a58-fc10919779a5', '6f004e0c-8a42-43fd-9c30-5e4006373c0f', 'Démonter la décoration', 'demonter-la-decoration', 'Démonter, trier et remettre le lieu dans son état initial le lendemain de la soirée.', 'desinstallation', 330, 'j_plus_1', null),
  ('a47788c4-fae6-47c7-a321-d69cfd67bbd1', '6f004e0c-8a42-43fd-9c30-5e4006373c0f', 'Décider du devenir des fleurs et éléments', 'decider-du-devenir-des-fleurs-et-elements', 'Clore le sujet décoration : retours de location et destination des fleurs.', 'apres', 340, 'j_plus_1', '22222222-2222-2222-2222-222222222301'),
  ('008eb27b-f616-43bf-8384-bbf266362568', '9d792a90-9ca5-4b1c-b5fe-afc0f8cc8d5c', 'Briefer le photographe et préparer la shot list', 'briefer-le-photographe-et-preparer-la-shot-list', 'Cadrer avec le photographe/vidéaste les moments à ne pas manquer.', 'avant', 350, 'j_moins_15', '22222222-2222-2222-2222-222222222301'),
  ('b4b4e8b1-5373-44de-8e4f-2f2ac13bea85', '9d792a90-9ca5-4b1c-b5fe-afc0f8cc8d5c', 'Récupérer et partager les photos et vidéos', 'recuperer-et-partager-les-photos-et-videos', 'Récupérer les photos du prestataire et organiser leur diffusion auprès des proches.', 'apres', 360, 'j_plus_1', '22222222-2222-2222-2222-222222222301'),
  ('0a2663a4-a7a2-4959-8647-9a34b1e3faa9', '930afd51-a6dd-47e0-8d73-097b5f72e87d', 'Préparer l''accueil des enfants', 'preparer-l-accueil-des-enfants', 'Préparer l''espace et les conditions d''accueil des enfants présents à la soirée.', 'avant', 370, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('7141bc4a-5a90-4bb0-9a2c-4e9443d4a143', '930afd51-a6dd-47e0-8d73-097b5f72e87d', 'Superviser les enfants pendant la soirée', 'superviser-les-enfants-pendant-la-soiree', 'Veiller au bien-être des enfants présents tout au long de la soirée.', 'jour_j', 380, 'jour_j', null),
  ('3563f17a-7682-4731-b8fe-2d0446e3080c', '930afd51-a6dd-47e0-8d73-097b5f72e87d', 'Préparer l''accueil des personnes âgées', 'preparer-l-accueil-des-personnes-agees', 'Identifier les besoins des invités âgés ou à mobilité réduite et préparer leur placement.', 'avant', 390, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('33b808e9-897d-406c-81ea-ae1fd44e34c4', '930afd51-a6dd-47e0-8d73-097b5f72e87d', 'Veiller au confort des personnes âgées', 'veiller-au-confort-des-personnes-agees', 'Assurer le confort et la sécurité des invités âgés tout au long de la soirée.', 'jour_j', 400, 'jour_j', null),
  ('b931e6aa-64c9-4674-bbb8-dd1f9cd29ff2', '930afd51-a6dd-47e0-8d73-097b5f72e87d', 'Constituer la boîte à urgences', 'constituer-la-boite-a-urgences', 'Préparer la trousse de secours et les contacts d''urgence pour la soirée.', 'avant', 410, 'j_moins_7', '22222222-2222-2222-2222-222222222302'),
  ('029642f2-f45a-496d-a46e-537ed124cd07', '930afd51-a6dd-47e0-8d73-097b5f72e87d', 'Gérer les imprévus de la soirée', 'gerer-les-imprevus-de-la-soiree', 'Absorber tout ce qui sort du plan sans perturber le coordinateur général ni les fiancés.', 'jour_j', 420, 'jour_j', null),
  ('038a14b1-d160-4b9e-adf1-8b29a7c02463', 'cb48860b-9a4b-4b29-bc81-c07868fd3f08', 'Lister et réserver le matériel à louer', 'lister-et-reserver-le-materiel-a-louer', 'Identifier tout le matériel manquant et le réserver avant les délais serrés de l''été.', 'avant', 430, 'j_moins_15', '22222222-2222-2222-2222-222222222302'),
  ('f9f52742-ab38-4772-a5a0-4a8c9dc510e3', 'cb48860b-9a4b-4b29-bc81-c07868fd3f08', 'Ranger et restituer le matériel', 'ranger-et-restituer-le-materiel', 'Trier, ranger et restituer tout le matériel le lendemain de la soirée.', 'desinstallation', 440, 'j_plus_1', null),
  ('2a7d4812-5c92-4192-943b-2a1185d2104b', 'cb48860b-9a4b-4b29-bc81-c07868fd3f08', 'Clôturer le matériel et le stock restant', 'cloturer-le-materiel-et-le-stock-restant', 'Vérifier la restitution finale du matériel et décider du devenir du stock restant.', 'apres', 450, 'j_plus_1', '22222222-2222-2222-2222-222222222302'),
  ('75b6ae27-71f7-4270-80c5-dabc4ca5ab7d', 'cb48860b-9a4b-4b29-bc81-c07868fd3f08', 'Gérer le parking et l''accès', 'gerer-le-parking-et-l-acces', 'Orienter les véhicules à leur arrivée et préserver l''espace réservé aux fiancés.', 'jour_j', 460, 'jour_j', null),
  ('c0c66ee3-d790-4bdb-b38f-3f897f7eca8f', 'cb0d44f8-01c8-40ec-a668-647665f452b8', 'Préparer la tenue de Sarah', 'preparer-la-tenue-de-sarah', 'Finaliser la tenue complète de Sarah : vêtement, accessoires, coiffure, maquillage.', 'avant', 470, 'j_moins_15', '22222222-2222-2222-2222-222222222301'),
  ('44d5cb03-46fc-44aa-a2a7-e492e0a7f275', 'cb0d44f8-01c8-40ec-a668-647665f452b8', 'Préparer la tenue de Jordan', 'preparer-la-tenue-de-jordan', 'Trouver et finaliser la tenue complète de Jordan, après que le premier vêtement reçu n''a pas été retenu.', 'avant', 480, 'j_moins_15', '22222222-2222-2222-2222-222222222302'),
  ('55075177-d63e-4573-99d7-8fb2055b9e57', '79df4bec-f6b7-4e10-b9b8-30c53925de79', 'Suivre le budget et préparer les paiements', 'suivre-le-budget-et-preparer-les-paiements', 'Tenir le tableau de dépenses à jour et préparer l''échéancier des paiements restants.', 'avant', 490, 'j_moins_30', '22222222-2222-2222-2222-222222222301'),
  ('8ecc20ea-8ed8-4510-8e60-a993da2c4702', '79df4bec-f6b7-4e10-b9b8-30c53925de79', 'Régler les prestataires le jour J', 'regler-les-prestataires-le-jour-j', 'Préparer et remettre les paiements en espèces, puis régler les soldes en fin de soirée.', 'jour_j', 500, 'jour_j', '22222222-2222-2222-2222-222222222301'),
  ('f8880271-c2b1-44ee-bb75-cd0b901263c8', '79df4bec-f6b7-4e10-b9b8-30c53925de79', 'Préparer la gestion des enveloppes invités', 'preparer-la-gestion-des-enveloppes-invites', 'Mettre en place l''urne de collecte des enveloppes et désigner un gardien.', 'avant', 510, 'j_moins_7', '22222222-2222-2222-2222-222222222301'),
  ('fe38d0bd-6624-457b-b2d1-12cbd4efb251', '79df4bec-f6b7-4e10-b9b8-30c53925de79', 'Surveiller l''urne pendant la soirée', 'surveiller-l-urne-pendant-la-soiree', 'Garder l''urne sous surveillance constante du début à la fin de la soirée.', 'jour_j', 520, 'jour_j', null),
  ('e80905a0-ff91-464a-9db4-3b61cb7d8ed6', '79df4bec-f6b7-4e10-b9b8-30c53925de79', 'Inventorier et sécuriser le contenu de l''urne', 'inventorier-et-securiser-le-contenu-de-l-urne', 'Faire l''inventaire officiel du contenu de l''urne le lendemain de la soirée.', 'desinstallation', 530, 'j_plus_1', null),
  ('303afd4c-e671-4ae5-9f88-d405e5b6ea8c', '79df4bec-f6b7-4e10-b9b8-30c53925de79', 'Clôturer la comptabilité', 'cloturer-la-comptabilite', 'Mettre à jour, vérifier et archiver l''ensemble de la comptabilité de l''événement.', 'apres', 540, 'j_plus_1', '22222222-2222-2222-2222-222222222301'),
  ('b52c6d06-73f8-42d1-85c0-dd66ca55cb77', '79df4bec-f6b7-4e10-b9b8-30c53925de79', 'Faire les retours aux prestataires', 'faire-les-retours-aux-prestataires', 'Laisser des avis et garder une trace des bons prestataires pour de futurs événements.', 'apres', 550, 'j_plus_1', '22222222-2222-2222-2222-222222222301'),
  ('46dc100f-f7e2-497f-a0f2-34e0b3e706a6', '79df4bec-f6b7-4e10-b9b8-30c53925de79', 'Envoyer les remerciements', 'envoyer-les-remerciements', 'Remercier nommément invités, prestataires bénévoles et donateurs après la soirée.', 'apres', 560, 'j_plus_1', '22222222-2222-2222-2222-222222222301');

insert into _20260725_missions (id, domaine_id, title, description, prerequisites) values
  ('d4835dff-3acb-4468-9afd-b5a72d4d170e', '206811c1-d382-4a37-a70d-a85906499870', 'Lister les prestataires et préparer leurs contacts de secours', 'Tu es responsable de l''annuaire complet de l''événement : qui intervient, pour quoi, et comment le contacter en cas de problème.

Ton rôle est de répertorier tous les prestataires — professionnels et amis mobilisés — avec leur rôle, leur contact et leur horaire d''intervention prévu, et de t''assurer qu''il existe un numéro de secours pour chacun des prestataires clés.', null),
  ('844dab5f-6466-42c6-a596-a595f57dc8c3', '206811c1-d382-4a37-a70d-a85906499870', 'Créer et diffuser le document de coordination aux référents', 'Tu es responsable de l''outil central que tous les référents utiliseront pour savoir qui fait quoi.

Ton rôle est de créer un document de coordination partagé listant chaque rôle de référent à désigner pour les différentes phases (avant, jour J, après), puis de le rendre accessible à tous une fois désignés.', null),
  ('a373906f-17c8-4234-b007-90879dbe7eb8', '206811c1-d382-4a37-a70d-a85906499870', 'Organiser la réunion de coordination avec les référents', 'Tu es responsable de transformer la liste de référents en une équipe qui sait ce qu''elle a à faire.

Ton rôle est de contacter chaque référent pour confirmer son accord et le périmètre de sa mission, de lui fournir une boîte à outils, puis d''organiser une réunion de coordination 1 à 2 semaines avant l''événement, et de désigner un interlocuteur unique sur place pour tous les prestataires.', null),
  ('d91e580a-856e-4eb0-bfc7-9655e8b19ec2', 'b7f374a1-acfd-45c1-939e-a35a2222acff', 'Rédiger le conducteur minuté complet', 'Tu es responsable du fil conducteur de toute la soirée : le document que tout le monde suivra pour savoir ce qui se passe et quand.

Ton rôle est de rédiger le conducteur minuté complet, de l''accueil jusqu''à la fin, en passant par le cortège, la cérémonie, le cocktail, le dîner, la soirée et les remerciements.', null),
  ('2164f7d1-abea-468b-945a-4bc7382958bc', 'b7f374a1-acfd-45c1-939e-a35a2222acff', 'Faire valider le déroulé par les prestataires et les familles', 'Tu es responsable de la cohérence entre ce qui est écrit sur le papier et ce que chacun va réellement faire.

Ton rôle est de valider le conducteur avec les prestataires clés (DJ, traiteur, photographe) et de faire le point avec les parents de Sarah et de Jordan sur leurs interventions respectives.', null),
  ('517a2f72-6e90-487f-aa73-9f149b0c3e27', 'b7f374a1-acfd-45c1-939e-a35a2222acff', 'Sécuriser les plans B et la gestion de la chaleur', 'Tu es responsable d''anticiper ce qui peut mal se passer, pour que la soirée reste fluide même en cas d''imprévu.

Ton rôle est d''identifier les temps morts du déroulé, de prévoir un plan B pour chaque moment critique (météo, retard prestataire, son défaillant), et d''organiser la gestion de la chaleur pendant la cérémonie extérieure.', null),
  ('054279b6-c119-4b1d-848c-4b2880d4d356', 'aa13ce4c-eaae-46d8-8192-444734ed97c5', 'Confirmer les horaires et l''accès de tous les référents', 'Tu es responsable de la bonne mise en route de la journée de veille : que chacun sache où être et quand.

Ton rôle est de confirmer les horaires d''arrivée de chaque référent pour le lendemain, l''accès au Grand Arbre, et l''heure d''arrivée du DJ et du photographe/vidéaste, puis d''imprimer et distribuer le conducteur.', null),
  ('3565e532-9070-4400-a383-3cec481401a2', 'aa13ce4c-eaae-46d8-8192-444734ed97c5', 'Faire le tour de contrôle final de la veille', 'Tu es responsable du dernier filet de sécurité avant le jour J : vérifier que tout ce qui devait être prêt l''est vraiment.

Ton rôle est de faire le tour de contrôle de la salle, de vérifier que les enveloppes de paiement espèces sont prêtes, et de t''assurer que rien ne manque en comparant à la liste de colisage.', null),
  ('a56e6251-d319-45cd-891e-479e524d78fd', 'aa13ce4c-eaae-46d8-8192-444734ed97c5', 'Préparer les tenues et le repos des fiancés', 'Ton rôle, en tant que fiancé(e), est de valider l''installation déco avant de partir, de t''assurer que tous les référents ont reçu le conducteur imprimé, puis de préparer ta tenue pour le lendemain et de te coucher tôt — pas de tâches physiques lourdes, tu dois être reposé(e) pour le jour J.', null),
  ('47218452-2b0f-44a4-bfc1-9eb3c381a45f', 'c0dbe0ef-2c67-4f2f-8dad-b68e1d4c4ee9', 'Préparer l''ouverture (16h30-17h00)', 'Tu es responsable du bon démarrage technique de la soirée, avant l''arrivée du premier invité.

Ton rôle est d''accueillir le DJ à 16h30 et de vérifier branchements et soundcheck, d''accueillir le photographe/vidéaste, de faire le tour de contrôle final de la salle, et de vérifier que le micro est opérationnel.', 'Être disponible dès 16h30, avoir le conducteur imprimé et les contacts prestataires sous la main, ne pas danser et rester disponible toute la soirée.'),
  ('9a2049b6-fe02-46eb-b804-e26cf0264809', 'c0dbe0ef-2c67-4f2f-8dad-b68e1d4c4ee9', 'Piloter la cérémonie (17h00-18h50)', 'Tu es responsable de la bonne synchronisation de tous les acteurs pendant le moment le plus important de la soirée.

Ton rôle est de synchroniser les montres avec le DJ et le photographe, de superviser le positionnement des placeurs, de donner le signal de départ du cortège à 17h30, et de suivre le conducteur minute par minute.', null),
  ('7d0b2fde-49c0-4f21-94a8-23c6369f4ee4', 'c0dbe0ef-2c67-4f2f-8dad-b68e1d4c4ee9', 'Superviser le dîner et la soirée (20h00-04h00)', 'Tu es responsable du bon déroulement de la deuxième moitié de la soirée, jusqu''à la fin officielle.

Ton rôle est de confirmer l''heure de début du service avec le traiteur, de surveiller le timing entre les plats, et de confirmer l''heure de fin de prestation du DJ et la musique de clôture.', null),
  ('2b8cefff-9c1a-4fb2-b501-fd98329c5ea3', 'fa5676e2-a69c-4916-93e5-2ff9ac315c02', 'Valider les départs et la remise du matériel avec les référents', 'Ton rôle, en tant que fiancé(e), est de t''assurer en fin de soirée que tout le matériel a bien été récupéré par les bonnes personnes et que rien n''est resté en plan.', null),
  ('da35eff2-f09f-43fa-b362-20163dc5d001', 'fa5676e2-a69c-4916-93e5-2ff9ac315c02', 'Dire au revoir aux invités', 'Ton rôle, en tant que fiancé(e), est d''être disponible pour les décisions de dernière minute et les au revoir, sans prendre en charge de tâches physiques.', null),
  ('3b34e11d-e3f0-4332-a7f8-4aeb9313495f', '7c508703-130e-4e62-811d-14fbbd87c9bf', 'Rassembler les retours et archiver le conducteur', 'Tu es responsable de transformer l''expérience de cette soirée en apprentissage utile pour la suite.

Ton rôle est de rassembler les retours des référents sur ce qui a bien fonctionné et ce qui aurait pu être mieux géré, de documenter les imprévus rencontrés, et d''archiver le conducteur final annoté.', null),
  ('71edbd0c-b859-43c4-b55d-97bf859338d0', 'e32539b3-e3b3-46ea-ab6a-83c059100e79', 'Communiquer les effectifs, le menu et le timing au lieu', 'Tu es responsable de la relation avec Le Grand Arbre pour tout ce qui concerne le déroulement pratique de la soirée.

Ton rôle est de leur communiquer le nombre définitif d''invités, de valider le menu définitif avec le traiteur du lieu, et de valider le timing de service.', null),
  ('63cc0d76-4b2a-42c8-96e9-477fdf724a92', 'e32539b3-e3b3-46ea-ab6a-83c059100e79', 'Valider le plan de salle et l''accès la veille', 'Tu es responsable de l''organisation spatiale de la soirée.

Ton rôle est d''établir le plan de salle par zones, de planifier la visite technique avec le DJ, et de leur demander l''accès la veille pour la décoration et le dépôt des boissons.', null),
  ('f6d273f6-d58e-4851-860c-6e13df8d0361', 'e32539b3-e3b3-46ea-ab6a-83c059100e79', 'Clarifier le nettoyage, l''état des lieux et la signalétique', 'Tu es responsable des détails contractuels et pratiques qui évitent les mauvaises surprises en fin de soirée.

Ton rôle est de confirmer ce qui est inclus dans la prestation nettoyage, de clarifier la procédure d''état des lieux de sortie, et de mettre en place une signalétique de bienvenue depuis le parking.', null),
  ('3e6c22ce-85cf-40a0-97ae-d6dcf3d509c6', '4e903efa-2d9c-48d3-a930-327528a1d3a1', 'Faire l''état des lieux de sortie et récupérer le dépôt de garantie', 'Tu es responsable de la bonne clôture administrative de la location du lieu.

Ton rôle est de faire l''état des lieux de sortie avec le propriétaire et de vérifier les conditions de restitution du dépôt de garantie.', null),
  ('a66ab037-b70c-44b5-bdc5-e6a5003664d8', 'f599e758-c923-4395-a034-18b1b9935f19', 'Relancer et collecter présence, plat et horaires', 'Tu es responsable du recensement complet des invités confirmés.

Ton rôle est d''envoyer un message à tous les participants confirmés (remerciements + choix du plat), de relancer les retardataires, et de recueillir les horaires d''arrivée de chaque invité.', null),
  ('197c75ea-3738-4632-8a72-efe58c0ad465', 'f599e758-c923-4395-a034-18b1b9935f19', 'Compiler le tableau final et le transmettre au lieu', 'Tu es responsable de la synthèse finale qui servira de référence à tous les autres référents.

Ton rôle est de compiler le tableau final (nom / présence / plat / horaire / besoins transport) et de communiquer les chiffres définitifs au Grand Arbre.', null),
  ('154b3d32-9729-4900-bc2a-4bf7dd53bead', '7dbe270b-11a3-4f4a-9195-3a8f16c62ec1', 'Vérifier la diffusion du guide hébergement et qui loge où', 'Tu es responsable du confort des invités qui viennent de loin pour la soirée.

Ton rôle est de vérifier que tous les invités venant de loin ont bien reçu le guide hébergement, et de savoir qui loge où.', null),
  ('78c5768d-9173-4916-bf9c-0c9baae30e10', '03b6fd37-e7be-4579-8234-dee7967f4905', 'S''assurer que chacun a un retour organisé', 'Tu es responsable du bon départ des invités hébergés le lendemain de la soirée.

Ton rôle est de vérifier que les invités venant de loin ont bien leur moyen de retour organisé, et que les personnes âgées ont un transport retour sécurisé.', null),
  ('8c2dc078-97f9-4477-b2c6-1403b1b902d1', 'a77b6bb0-34c3-4007-8966-847eec3e5dd6', 'Cartographier les besoins et sécuriser un contact VTC nuit', 'Tu es responsable de la logistique de transport des invités le jour J.

Ton rôle est de cartographier les besoins en transport à partir des horaires d''arrivée collectés, d''identifier les invités sans moyen de retour, et de noter un contact VTC/taxi de nuit à avoir sous la main.', null),
  ('2d412b87-bd9b-4329-ab23-ec8345fb3355', 'fd743a26-3bed-454f-b68c-2d4bd26e5793', 'Envoyer les communications clés aux invités', 'Tu es responsable de tenir les invités informés à chaque étape.

Ton rôle est d''envoyer un message individuel de remerciement RSVP + choix du plat + horaire attendu, puis un rappel général J-7, et de préparer le message de remerciement post-événement à l''avance.', null),
  ('e08fbc65-598b-4535-ad20-8576a2f6ac43', '3ec032fd-3bf0-4d2a-92f6-b564a78b7a27', 'Accueillir, pointer les arrivées et orienter vers le cocktail', 'Tu es responsable de la première impression de la soirée pour chaque invité qui arrive.

Ton rôle est de vérifier que la signalétique d''accueil est en place, de pointer les arrivées, d''orienter chaque invité vers la terrasse cocktail, et de t''assurer que les boissons d''accueil sont disponibles dès 17h00.', 'Être présent(e) de 17h00 jusqu''à la fin du cocktail (~19h00), tenue soignée, idéalement à deux personnes.'),
  ('33fdac34-7e83-4011-ab5c-85de226679d1', 'e62b6d0e-e468-4d71-8e31-320d0eb4ef0b', 'Valider le matériel, le timing et les morceaux clés avec Djahman', 'Tu es responsable de la relation avec le DJ pour que tout soit cadré avant le jour J.

Ton rôle est de t''assurer qu''il a répondu au Google Forms, d''obtenir confirmation du matériel adapté à ~90 personnes, de confirmer son heure d''arrivée, et de valider les morceaux clés (entrée du cortège, arrivée de Sarah, présentation de la bague).', null),
  ('4c6ab7c8-dc61-4b96-bc07-eea4717a090b', 'e62b6d0e-e468-4d71-8e31-320d0eb4ef0b', 'Finaliser la playlist et la structure de la soirée dansante', 'Tu es responsable de l''ambiance musicale de la soirée, du cocktail jusqu''à la fin de la nuit.

Ton rôle est de t''assurer que Djahman a ouvert le fichier référentiel, de valider la structure de la soirée dansante, et de confirmer les morceaux prioritaires (Seggae, Salegy, Bollywood, Pop indienne, Arabic).', null),
  ('50d95197-e2fe-40d5-b37f-465847a5068d', '1b312d99-5a2e-4b28-9c68-d7ecc8f51adc', 'Désigner le MC et faire le micro-test avec les parents', 'Tu es responsable de la bonne tenue du moment des discours.

Ton rôle est de désigner un MC / coordinateur discours pour les transitions, et de faire un micro-test avec les parents.', null),
  ('d143c1fb-4b05-4279-9a4e-635ad0b13970', '513b3367-745e-4099-8599-409361d92f61', 'Gérer les transitions, le timing et la coordination DJ', 'Tu es responsable de l''animation du moment des discours : transitions fluides, micro qui fonctionne, timing tenu.

Ton rôle est de tester le micro avant le premier discours, de coordonner avec le DJ la musique de fond, d''annoncer chaque intervenant, et de gérer discrètement le timing si un orateur dépasse.', 'Être à l''aise à l''oral, avoir la liste des intervenants et l''ordre de passage, rester sobre jusqu''à la fin des discours.'),
  ('8e700363-904d-4e71-9ce6-9272bfaa1482', '59a6511e-c02b-4d7d-93bb-4351f9cb88aa', 'Réaliser, valider et imprimer le plan de table', 'Tu es responsable de l''organisation des tables pour le dîner.

Ton rôle est de récupérer le nombre exact de tables et leur capacité, de réaliser un premier plan en intégrant les contraintes (mobilité réduite, personnes âgées, enfants, affinités), de le valider avec Sarah, et de l''imprimer.', null),
  ('d99846b5-a3b2-4bc7-8c20-f665c4dda64f', '4534a9c4-8e1c-4cd2-aaf8-0597e7d6b871', 'Choisir et organiser la distribution du cadeau parents', 'Tu es responsable de cette attention envers les parents, si vous décidez de la faire.

Ton rôle est de décider si un cadeau est prévu, puis, si oui, de choisir le type, de le commander avec un délai compatible, et d''organiser sa distribution le jour J.', null),
  ('a18ded0f-4200-4df4-9ec0-ef9a41307777', '13bef7e0-c96d-4ce4-9121-805aed2e56b1', 'Composer le cortège et préparer chaque participant', 'Tu es responsable de la préparation du moment d''entrée le plus symbolique de la cérémonie.

Ton rôle est de définir la composition et l''ordre du cortège, de prévenir chaque personne de son rôle, de synchroniser les musiques d''entrée avec Djahman, et de prévoir les alternatives pour les personnes à mobilité réduite.', null),
  ('872d1a54-d6b4-405c-910a-63ca7fb39d98', '95e88d3a-6cf4-465e-bbd4-ee9c9c9f37c1', 'Rassembler le cortège et donner le signal de départ', 'Tu es responsable du bon déroulement du cortège le jour J, à l''heure prévue.

Ton rôle est de rassembler les membres du cortège à 17h20, de vérifier que chacun connaît sa place, de coordonner avec le DJ le signal de lancement, et de donner le signal de départ.', 'Bien connaître les familles, avoir répété le déroulé en amont avec chaque participant.'),
  ('e4bfc080-a023-4a7d-84a7-1853e30c68b6', 'ceaf3a47-e85e-4588-b63c-41927707a87a', 'Organiser une répétition avec les intervenants clés', 'Tu es responsable de t''assurer que la cérémonie a été répétée au moins une fois avant le jour J, avec les personnes qui y interviennent directement.', null),
  ('335363c3-c619-40c2-94ff-92109c81b510', '4729b1aa-ad15-4b22-8ff2-abdafe73a855', 'Commander et organiser chaque spécialité', 'Tu es responsable de l''approvisionnement en spécialités culturelles qui font la richesse du repas.

Ton rôle est de commander la spécialité indienne, de formaliser la recette et les quantités de la spécialité malgache, de valider la préparation à la maison des mini bokits guadeloupéens, et de commander les bonbons piments réunionnais.', null),
  ('926ddabb-485a-4158-b319-f688fa425d58', '4729b1aa-ad15-4b22-8ff2-abdafe73a855', 'Planifier qui prépare quoi et quand', 'Tu es responsable de l''organisation logistique de la préparation des spécialités maison.

Ton rôle est d''acheter le matériel nécessaire (grande marmite, boîtes de transport adaptées) et de planifier qui prépare quoi, où et quand.', null),
  ('38116b69-5f16-4395-bc46-72e684e70812', '110474ca-e601-4539-8592-df041cbf7878', 'Réceptionner et vérifier les commandes externes', 'Tu es responsable de la bonne réception des spécialités commandées à l''extérieur.

Ton rôle est de réceptionner les spécialités malgaches et indiennes commandées, et de vérifier leur conformité par rapport à la commande.', 'Être disponible à la maison pour la réception, avoir un véhicule pour acheminer si besoin.'),
  ('6c128e27-5d5b-42ec-b6e5-fd9dd6e48215', '110474ca-e601-4539-8592-df041cbf7878', 'Préparer et conditionner les préparations maison', 'Tu es responsable de la préparation finale des spécialités faites maison, la veille de l''événement.

Ton rôle est de superviser la préparation des spécialités guadeloupéennes, de préparer les fritures en grande quantité, de conditionner toutes les spécialités, et de tout ranger au frais jusqu''au transport.', null),
  ('c31366c1-aa07-44ce-b85b-16c3662e5240', '31e5aa43-898d-4040-9a49-afcc1ee12a7a', 'Acheminer les spécialités maison vers le lieu de réception', 'Tu es responsable du dernier kilomètre : faire arriver les spécialités maison sur le lieu de réception, prêtes à être servies.

Ton rôle est d''acheminer les fritures et préparations guadeloupéennes vers le Grand Arbre, et de vérifier que toutes les commandes sont complètes et conformes.', null),
  ('b747288d-6860-4d7c-b099-7d00550cafe5', '253d4f9f-951b-4f08-9c06-eb990a04fe67', 'Maintenir le stock de boissons à jour', 'Tu es responsable du stock de boissons qui sera servi pendant toute la soirée.

Ton rôle est de maintenir à jour le fichier de suivi du stock local (champagne, despé, eau, jus, coca), et de calculer la quantité de glace nécessaire pour tenir jusqu''à 4h.', null),
  ('a31393c1-4f18-424f-b9eb-4de8e5666189', '253d4f9f-951b-4f08-9c06-eb990a04fe67', 'Désigner le référent boissons jour J', 'Tu es responsable de t''assurer qu''une personne fiable prendra le relais des boissons le jour J.

Ton rôle est de désigner le référent boissons jour J et de louer l''utilitaire nécessaire au transport.', null),
  ('2e563ed0-874f-4796-9c06-ff48c6567ae0', '23e84e36-968b-4a98-bcaa-2f0d02530e2c', 'Charger et transporter les boissons', 'Tu es responsable du transport des boissons depuis le local jusqu''au Grand Arbre.

Ton rôle est de récupérer l''utilitaire loué tôt le matin, d''organiser le chargement avec les cousins mobilisés, et d''acheminer les boissons jusqu''au lieu.', 'Être disponible toute la matinée / l''après-midi la veille, avoir le permis de conduire, pouvoir coordonner quelques personnes pour le chargement et le déchargement.'),
  ('ed94c8ac-61f6-4449-92cc-0360d1050f87', '23e84e36-968b-4a98-bcaa-2f0d02530e2c', 'Décharger, stocker et mettre au froid', 'Tu es responsable de l''installation des boissons sur place, prêtes à être servies dès le lendemain.

Ton rôle est de superviser le déchargement, d''organiser la mise au froid, et de vérifier les quantités à l''arrivée.', null),
  ('4c4e9937-cf3f-4bf3-887d-7ce4e0b1edd7', 'f56729a1-8215-40f9-bd1d-86ccd08803de', 'Superviser le service pendant le cocktail et le dîner', 'Tu es responsable de la disponibilité des boissons pendant tout le cocktail et le dîner.

Ton rôle est de vérifier à l''ouverture que les boissons d''accueil sont en place et au froid, de superviser le service pendant le cocktail, et de t''assurer que les tables sont régulièrement resservies.', 'Être fiable, organisé(e), et rester sobre une bonne partie de la soirée. Connaître les stocks, les emplacements et les glacières.'),
  ('e5d8bd82-1888-4751-b2a7-433a893f4aec', 'f56729a1-8215-40f9-bd1d-86ccd08803de', 'Prendre le relais du bar à 01h00 jusqu''à la fin', 'Tu es responsable de la dernière partie de la nuit, quand le bar officiel termine son service.

Ton rôle est de prendre le relais du bar officiel à 01h00 avec le matériel préparé, et de gérer le réapprovisionnement des glacières jusqu''à 04h00.', null),
  ('1e9d4b24-8442-47ba-8f27-311e51097b88', 'bab0cc3b-9c36-425e-9975-b7382bf3d641', 'Définir le système d''identification et de signalisation', 'Tu es responsable de la sécurité alimentaire des invités ayant des restrictions ou allergies.

Ton rôle est de définir le système d''identification à table, de signaler les allergies sévères à l''équipe de service, et de préparer la signalétique pour les buffets et amuse-bouches.', null),
  ('98b1014d-5203-4712-a72a-2bf2e103acd1', 'e1e223af-47c8-4da0-9c87-548bf336be97', 'Vérifier que les plats spéciaux sont bien signalés', 'Tu es responsable, pendant le service, que les plats spéciaux arrivent à la bonne personne.

Ton rôle est de vérifier que les plats spéciaux liés aux restrictions alimentaires sont bien signalés pour le service.', null),
  ('45c400a6-5fa3-4e06-95c0-491872bec09e', 'b3795650-bc2c-4988-9cd0-6a982e6d8f5e', 'Définir le thème, la palette et le plan par zone', 'Tu es responsable de la vision d''ensemble de la décoration de la soirée.

Ton rôle est de définir le thème visuel et la palette de couleurs, de lister les éléments déco par zone, et de créer le plan de décoration par zone avec photos de référence.', null),
  ('184e97df-1801-42e3-b3c2-7a7b029db4c5', 'b3795650-bc2c-4988-9cd0-6a982e6d8f5e', 'Choisir le fleuriste et valider les compositions', 'Tu es responsable de la partie florale de la décoration.

Ton rôle est de contacter et choisir un fleuriste, de valider les compositions florales et leurs tarifs, et de confirmer les modalités de livraison.', null),
  ('b2f6e045-8c55-4469-9411-dbec086a1c99', 'b3795650-bc2c-4988-9cd0-6a982e6d8f5e', 'Commander tous les éléments avec des délais compatibles', 'Tu es responsable de l''arbitrage et de l''achat de tous les éléments décoratifs.

Ton rôle est de comparer achat / location / DIY pour chaque élément, d''arbitrer, et de commander ou acquérir tous les éléments avec des délais compatibles.', null),
  ('d1640739-0a3d-4286-bc9b-1eb4d60f524e', 'a0834734-1cd1-4a38-9a99-46d0c633b788', 'Installer les éléments structurants et la décoration de table', 'Tu es responsable de la mise en place physique de la décoration le jour de l''installation.

Ton rôle est d''installer les éléments structurants en premier, de disposer la décoration de table, d''installer la signalétique, et de tester l''éclairage décoratif.', 'Arriver dès l''ouverture du lieu, avoir le plan de déco en main avec photos de référence.'),
  ('39ec9554-27a7-4794-a5ba-ee32d23d531c', 'a0834734-1cd1-4a38-9a99-46d0c633b788', 'Réceptionner et installer les fleurs', 'Tu es responsable de la bonne réception et installation des compositions florales.

Ton rôle est de réceptionner les compositions florales du fleuriste, de vérifier leur conformité, et de photographier la salle terminée pour validation par les fiancés.', null),
  ('542c3f2e-e89b-485f-8a52-5fa9dfa3c7db', '7089f775-76cb-42c7-8a58-fc10919779a5', 'Démonter, trier et remettre le lieu en état', 'Tu es responsable du démontage de la décoration le lendemain de la soirée — idéalement la même personne que l''installation.

Ton rôle est de démonter les éléments, de trier ce qui est loué de ce qui est acheté, d''emballer les fleurs à conserver, et de remettre le lieu dans son état initial.', null),
  ('3c5db468-b752-4655-a26c-6a64ab281d08', 'a47788c4-fae6-47c7-a321-d69cfd67bbd1', 'Décider du sort des fleurs et retourner les derniers éléments loués', 'Tu es responsable de la clôture définitive du volet décoration.

Ton rôle est de retourner les derniers éléments de location si pas déjà fait, et de décider du devenir des compositions florales.', null),
  ('43498ff6-d32a-480a-b284-7ba5545e9c00', '008eb27b-f616-43bf-8384-bbf266362568', 'Créer le groupe de contact et rassembler les inspirations', 'Tu es responsable de la relation avec le photographe/vidéaste pour que la couverture de la soirée corresponde à vos attentes.

Ton rôle est de créer le groupe WhatsApp avec les numéros clés, de partager le déroulé une fois finalisé, et de rassembler des inspirations photo/vidéo à partager.', null),
  ('57a78d00-088a-4e94-86e9-09bd1e5d237d', '008eb27b-f616-43bf-8384-bbf266362568', 'Rédiger la shot list et confirmer la logistique jour J', 'Tu es responsable de la check-list des moments à ne pas manquer.

Ton rôle est de rédiger la shot list, de confirmer l''heure d''arrivée souhaitée du photographe, et de prévenir les familles de limiter les téléphones pendant la cérémonie.', null),
  ('eba7d4e7-614b-43df-b842-3c1980b2adf8', 'b4b4e8b1-5373-44de-8e4f-2f2ac13bea85', 'Récupérer, sauvegarder et partager les photos', 'Tu es responsable de la diffusion des souvenirs de la soirée.

Ton rôle est de confirmer les délais de livraison avec le prestataire, de récupérer et sauvegarder les photos dès réception, et de partager une sélection avec les familles et proches.', null),
  ('a65f57dc-5880-452e-b9c5-45df4aaa409e', '0a2663a4-a7a2-4959-8647-9a34b1e3faa9', 'Recenser les enfants et préparer leur espace', 'Tu es responsable du confort des plus jeunes invités pendant la soirée.

Ton rôle est de recenser le nombre d''enfants présents et leurs âges, de prévoir le contenu de l''espace enfants, et de confirmer avec le traiteur le menu enfants et les horaires adaptés.', null),
  ('5a728b4d-c39d-4a26-899a-2a4380350e2f', '7141bc4a-5a90-4bb0-9a2c-4e9443d4a143', 'Installer l''espace et superviser les enfants', 'Tu es responsable du bien-être des enfants tout au long de la soirée.

Ton rôle est d''installer et ouvrir l''espace enfants avant leur arrivée, de les superviser pendant les discours et moments adultes, et d''anticiper les départs des familles avant minuit.', 'Être un parent ou un adulte de confiance patient, disponible en continu jusqu''au départ des familles avec enfants.'),
  ('c45c01f0-9e8f-4d06-bb50-990b383a6a81', '3563f17a-7682-4731-b8fe-2d0446e3080c', 'Identifier les besoins et préparer leur placement', 'Tu es responsable du confort des invités âgés ou à mobilité réduite.

Ton rôle est d''identifier les personnes concernées dans la liste des invités, de prévoir leur placement à une table accessible, et d''anticiper leur départ anticipé.', null),
  ('fc69ab3b-c69a-4095-bbc8-4e33eae82604', '33b808e9-897d-406c-81ea-ae1fd44e34c4', 'Veiller au confort tout au long de la soirée', 'Tu es responsable du bien-être des invités âgés pendant toute la soirée.

Ton rôle est de t''assurer qu''ils sont bien placés, de vérifier régulièrement leur confort, et d''organiser leur départ anticipé si nécessaire.', 'Être disponible ponctuellement tout au long de la soirée, sensible et patient(e).'),
  ('5557f318-1854-455f-896f-160943889f7a', 'b931e6aa-64c9-4674-bbb8-dd1f9cd29ff2', 'Constituer la boîte à urgences et le kit couture', 'Tu es responsable de la trousse de secours de la soirée.

Ton rôle est de constituer la boîte à urgences, de préparer un kit couture / tenue de rechange, et de compiler la liste des contacts d''urgence.', null),
  ('937cee0b-4f0f-4ae4-9183-32103a2dfbc3', '029642f2-f45a-496d-a46e-537ed124cd07', 'Gérer les imprévus sans perturber le coordinateur général', 'Tu es responsable de tout ce qui sort du plan, sans perturber le coordinateur général ni les fiancés.

Ton rôle est d''avoir la boîte à urgences accessible toute la soirée, de gérer les incidents vestimentaires, et de ne remonter que ce qui nécessite une décision des fiancés.', 'Rester calme sous pression, être une personne distincte du coordinateur général.'),
  ('81ab532d-0525-45fa-9ab4-48dd46741143', '038a14b1-d160-4b9e-adf1-8b29a7c02463', 'Lister le matériel et arbitrer achat vs location', 'Tu es responsable de l''inventaire du matériel manquant pour la soirée.

Ton rôle est de lister tout le matériel à louer, de confirmer avec Djahman ce qu''il apporte déjà, et d''arbitrer achat vs location pour chaque élément.', null),
  ('07de0dc2-534f-4729-8ef4-2afe3521a0b6', '038a14b1-d160-4b9e-adf1-8b29a7c02463', 'Réserver le matériel auprès du loueur', 'Tu es responsable de la réservation effective du matériel manquant, dans des délais serrés en plein été.

Ton rôle est de demander des devis et de réserver le matériel lumière manquant sans attendre.', null),
  ('ef1b99b9-b426-4f9d-9a0f-8bbd383f7088', 'f9f52742-ab38-4772-a5a0-4a8c9dc510e3', 'Suivre la liste de colisage et trier', 'Tu es responsable du rangement complet le lendemain de la soirée — idéalement la même personne que la veille.

Ton rôle est de superviser le rangement en suivant la liste de colisage, de trier les éléments, et de vérifier que rien n''est oublié sur place.', 'Être disponible le matin, avoir un véhicule.'),
  ('b9c1c857-2bad-45a4-b9f9-79b9bdf0271f', 'f9f52742-ab38-4772-a5a0-4a8c9dc510e3', 'Restituer le matériel dans les délais', 'Tu es responsable de la bonne restitution du matériel loué dans les délais contractuels.

Ton rôle est d''emballer et étiqueter les caisses, de retourner le matériel loué et l''utilitaire, et de ramener le matériel personnel à la maison.', null),
  ('f57e6cc3-11bd-44a0-ac3b-e5fd9de464e0', '2a7d4812-5c92-4192-943b-2a1185d2104b', 'Vérifier la restitution et ranger le matériel acheté', 'Tu es responsable de la toute dernière étape logistique de l''événement.

Ton rôle est de vérifier que tout le matériel loué a bien été restitué, de signaler tout dommage constaté, de ranger le matériel acheté, et de décider de la destination du stock de boissons restant.', null),
  ('2436ac46-eb60-4e3d-953f-08d49b307919', '75b6ae27-71f7-4270-80c5-dabc4ca5ab7d', 'Orienter les véhicules et préserver l''espace fiancés', 'Tu es responsable de la gestion des arrivées en voiture et de la préservation d''un espace réservé aux fiancés.

Ton rôle est de poser la signalétique directionnelle, de bloquer l''espace fond de parking réservé aux fiancés, et d''orienter chaque voiture.', 'Être disponible de 16h30 à 19h00 (peut rejoindre la fête ensuite).'),
  ('2ed550a7-4839-4cc8-9f05-4e7358f383a8', 'c0c66ee3-d790-4bdb-b38f-3f897f7eca8f', 'Finaliser la tenue, les chaussures et les bijoux', 'Tu es responsable de la finalisation complète de la tenue de Sarah pour le jour J.

Ton rôle est de trouver et commander les chaussures et bijoux assortis, d''organiser un essayage complet, et de faire nettoyer le lehenga chez un pressing.', null),
  ('509db504-876b-4c07-a213-4f348d8a9484', 'c0c66ee3-d790-4bdb-b38f-3f897f7eca8f', 'Organiser la coiffure', 'Tu es responsable de la coiffure du jour J.

Ton rôle est de choisir le style de coiffure, de l''essayer à l''avance, et de réserver la coiffeuse pour le jour J.', null),
  ('0296c165-138c-45a6-bd8f-8353d49aef46', 'c0c66ee3-d790-4bdb-b38f-3f897f7eca8f', 'Organiser le maquillage et les ongles', 'Tu es responsable du maquillage et des ongles du jour J.

Ton rôle est de réaliser un essai maquillage, de prendre le rendez-vous pour le jour J, et de trouver des faux ongles.', null),
  ('2574b27d-fcaa-4ef9-a7b6-a544b1ef8ec5', '44d5cb03-46fc-44aa-a2a7-e492e0a7f275', 'Identifier la tenue définitive et les accessoires', 'Tu es responsable de la finalisation de la tenue de Jordan — tout reste à trouver après que le vêtement reçu n''a pas été retenu.

Ton rôle est d''identifier et commander la tenue définitive avec un délai de livraison confirmé, de prévoir les retouches, et de trouver chaussures et accessoires.', null),
  ('b3b00e88-bacc-4256-a5bd-76185e6e0bec', '44d5cb03-46fc-44aa-a2a7-e492e0a7f275', 'Confirmer la coiffure', 'Tu es responsable de la coiffure du jour J.

Ton rôle est de vérifier si le rendez-vous déjà pris doit être maintenu, décalé ou confirmé.', null),
  ('e2278c8e-2a1c-41db-9be1-4ec5532f3b17', '55075177-d63e-4573-99d7-8fb2055b9e57', 'Tenir le tableau de suivi des dépenses', 'Tu es responsable du suivi financier de l''événement.

Ton rôle est d''alimenter le tableau de suivi des dépenses avec toutes les dépenses engagées à ce jour, et de centraliser tous les contrats dans un dossier unique numérique.', null),
  ('645ca9d9-f6f1-4114-bedc-7bfff27e8e04', '55075177-d63e-4573-99d7-8fb2055b9e57', 'Créer l''échéancier des paiements et vérifier les contrats', 'Tu es responsable de la planification des paiements restants.

Ton rôle est de créer l''échéancier des paiements restants par prestataire avec dates limites, de vérifier les plafonds bancaires, et de vérifier les conditions d''annulation dans chaque contrat.', null),
  ('a931f2e6-7677-45fa-9623-907ab5b8d9fb', '55075177-d63e-4573-99d7-8fb2055b9e57', 'Provisionner l''enveloppe imprévus', 'Tu es responsable de la marge de sécurité financière de l''événement.

Ton rôle est de définir et réserver l''enveloppe imprévus (5 à 10 % du budget total).', null),
  ('4fcbb91b-449e-431b-a5f1-5dcf42ce48be', '8ecc20ea-8ed8-4510-8e60-a993da2c4702', 'Préparer et remettre les enveloppes de paiement espèces', 'Tu es responsable des paiements en espèces à effectuer le jour J.

Ton rôle est de préparer les enveloppes de paiement espèces pour les traiteurs externes si nécessaire, et de les remettre aux bonnes personnes au bon moment.', null),
  ('e4902c97-6306-440d-b9f7-06c57c749812', '8ecc20ea-8ed8-4510-8e60-a993da2c4702', 'Régler les soldes en fin de soirée', 'Tu es responsable de la clôture financière de la soirée même.

Ton rôle est de réaliser les paiements des soldes restants aux prestataires qui partent, et de récupérer les bons de fin de prestation.', null),
  ('e38786e6-8b05-4a5b-982e-4d8481bf1843', 'f8880271-c2b1-44ee-bb75-cd0b901263c8', 'Préparer l''urne et désigner un gardien', 'Tu es responsable de la mise en place du système de collecte des enveloppes des invités.

Ton rôle est de choisir et préparer l''urne ou boîte sécurisée, et de désigner une personne de confiance pour la gérer toute la soirée.', null),
  ('6925ba04-75c2-4692-8e1d-dcbcef0b2328', 'fe38d0bd-6624-457b-b2d1-12cbd4efb251', 'Poser, surveiller et sécuriser l''urne', 'Tu es responsable de la sécurité des enveloppes et cadeaux reçus pendant toute la soirée.

Ton rôle est de poser l''urne à son emplacement visible et surveillé, de la surveiller toute la soirée, de réceptionner les éventuels cadeaux physiques, et de la récupérer en fin de soirée.', 'Être présent(e) du début à la fin, discret(e), personne de confiance absolue.'),
  ('678138e9-de04-475d-b5d5-446e8bee8980', 'e80905a0-ff91-464a-9db4-3b61cb7d8ed6', 'Inventorier l''urne et lister les donateurs', 'Tu es responsable de l''inventaire officiel du contenu de l''urne, le lendemain de la soirée — idéalement la même personne que le jour J.

Ton rôle est d''inventorier le contenu en présence de témoins, de lister les donateurs pour les remerciements personnalisés, et de remettre l''urne et les cadeaux aux fiancés.', null),
  ('815fd831-fad4-4049-835e-f896477e8836', '303afd4c-e671-4ae5-9f88-d405e5b6ea8c', 'Clôturer et archiver la comptabilité', 'Tu es responsable de la clôture financière complète de l''événement.

Ton rôle est de mettre à jour le tableau de dépenses, de vérifier que tous les soldes ont été réglés, de récupérer le dépôt de garantie si besoin, et d''archiver tous les documents et justificatifs.', null),
  ('46a48dc6-e872-446c-90f0-6b269e60f553', 'b52c6d06-73f8-42d1-85c0-dd66ca55cb77', 'Laisser des avis et faire le debriefing prestataires', 'Tu es responsable de la relation prestataires après l''événement.

Ton rôle est de laisser des avis pour les prestataires qui l''ont mérité, de garder leurs coordonnées pour de futurs événements, et de faire un debriefing informel avec le coordinateur général.', null),
  ('57b5e510-eb45-4cc3-b028-e5eb16a1cc94', '46dc100f-f7e2-497f-a0f2-34e0b3e706a6', 'Remercier invités, prestataires et donateurs', 'Tu es responsable du mot de la fin auprès de tous ceux qui ont contribué à la soirée.

Ton rôle est d''envoyer le message de remerciement aux invités, un message personnalisé aux prestataires bénévoles, et de remercier chaque donateur d''enveloppe nommément.', null);

insert into _20260725_checklists (id, owner_type, owner_id, title) values
  ('b0e9e005-8e4e-4e3f-83cd-d51b855e59a9', 'domaine', '206811c1-d382-4a37-a70d-a85906499870', 'Definition of Done'),
  ('ec209a09-ff58-49ce-925a-b885de1f0919', 'mission', 'd4835dff-3acb-4468-9afd-b5a72d4d170e', null),
  ('16dd5058-25b8-479a-9bac-b8f9e7f4daf8', 'mission', '844dab5f-6466-42c6-a596-a595f57dc8c3', null),
  ('34e35648-0bf6-429e-a192-30ccbfc7aac7', 'mission', 'a373906f-17c8-4234-b007-90879dbe7eb8', null),
  ('110e6839-ec1d-4be9-8875-621f6646bfb5', 'domaine', 'b7f374a1-acfd-45c1-939e-a35a2222acff', 'Definition of Done'),
  ('9c34ad26-3c50-420e-8539-390940eadb0a', 'mission', 'd91e580a-856e-4eb0-bfc7-9655e8b19ec2', null),
  ('51ebb4a5-c851-45fd-8023-abf96153c923', 'mission', '2164f7d1-abea-468b-945a-4bc7382958bc', null),
  ('169434b6-24f1-4f81-87b5-c6f364e0f6a4', 'mission', '517a2f72-6e90-487f-aa73-9f149b0c3e27', null),
  ('d3b80bd7-800b-460b-8463-945ce01609bf', 'domaine', 'aa13ce4c-eaae-46d8-8192-444734ed97c5', 'Definition of Done'),
  ('521f2353-e120-4d29-9049-e8d343118ecd', 'mission', '054279b6-c119-4b1d-848c-4b2880d4d356', null),
  ('d1c895a0-55eb-461f-b056-e40ef65a6f56', 'mission', '3565e532-9070-4400-a383-3cec481401a2', null),
  ('1dc72ee9-90b0-463e-af04-ecdb9cbe937d', 'mission', 'a56e6251-d319-45cd-891e-479e524d78fd', null),
  ('d2db7ce0-305e-47b2-962e-681d8126fe8f', 'domaine', 'c0dbe0ef-2c67-4f2f-8dad-b68e1d4c4ee9', 'Definition of Done'),
  ('2a6cbfa4-af8e-4a3a-bf32-de6d8456e834', 'mission', '47218452-2b0f-44a4-bfc1-9eb3c381a45f', null),
  ('43a316e3-599e-4123-a490-7ef3963a7c79', 'mission', '9a2049b6-fe02-46eb-b804-e26cf0264809', null),
  ('c241fb49-3b3e-4d92-85b4-75aec42888cb', 'mission', '7d0b2fde-49c0-4f21-94a8-23c6369f4ee4', null),
  ('100ac0e8-fb7d-4516-a1c2-ba7ff45ec2a8', 'domaine', 'fa5676e2-a69c-4916-93e5-2ff9ac315c02', 'Definition of Done'),
  ('9d15c652-3179-41bd-b3fe-615c5fd47cbc', 'mission', '2b8cefff-9c1a-4fb2-b501-fd98329c5ea3', null),
  ('b74987d2-fae7-4104-ae34-abc610b2ca88', 'mission', 'da35eff2-f09f-43fa-b362-20163dc5d001', null),
  ('aa51f92d-243c-482c-89b2-42f8b97b4ec1', 'domaine', '7c508703-130e-4e62-811d-14fbbd87c9bf', 'Definition of Done'),
  ('e86e79b1-9108-49fe-b7fd-9a6ccfbfdc85', 'mission', '3b34e11d-e3f0-4332-a7f8-4aeb9313495f', null),
  ('d4e7e1d4-6522-46bb-b603-7bf87bc0492f', 'domaine', 'e32539b3-e3b3-46ea-ab6a-83c059100e79', 'Definition of Done'),
  ('bd4f93ff-3ea3-4664-8ffb-9395821735ce', 'mission', '71edbd0c-b859-43c4-b55d-97bf859338d0', null),
  ('f8c1de64-c2e4-489e-8ba1-4e12fc9a8b68', 'mission', '63cc0d76-4b2a-42c8-96e9-477fdf724a92', null),
  ('3ea013ac-35a8-4003-9e06-369e40b521fc', 'mission', 'f6d273f6-d58e-4851-860c-6e13df8d0361', null),
  ('57ddfd38-c8ad-41b6-953e-79e4d52ee9fa', 'domaine', '4e903efa-2d9c-48d3-a930-327528a1d3a1', 'Definition of Done'),
  ('ac6b874f-ea22-4f14-8d6d-91f235753f4d', 'mission', '3e6c22ce-85cf-40a0-97ae-d6dcf3d509c6', null),
  ('e73ea0bb-a4b0-4b6b-9bfe-d7283e4e317a', 'domaine', 'f599e758-c923-4395-a034-18b1b9935f19', 'Definition of Done'),
  ('4d37b59b-9843-4139-a581-1c612e596f29', 'mission', 'a66ab037-b70c-44b5-bdc5-e6a5003664d8', null),
  ('8e0a1a11-23a2-4602-85f6-2135586f3b2a', 'mission', '197c75ea-3738-4632-8a72-efe58c0ad465', null),
  ('0e986c20-5ce8-4d06-bfee-6b4334a18809', 'domaine', '7dbe270b-11a3-4f4a-9195-3a8f16c62ec1', 'Definition of Done'),
  ('ec2da13f-cf00-4b95-8060-b1b90168205d', 'mission', '154b3d32-9729-4900-bc2a-4bf7dd53bead', null),
  ('696a06f8-4631-4699-b29b-5a470d110143', 'domaine', '03b6fd37-e7be-4579-8234-dee7967f4905', 'Definition of Done'),
  ('d6c9a1ac-7410-4205-a79e-2e7f92ad861f', 'mission', '78c5768d-9173-4916-bf9c-0c9baae30e10', null),
  ('188876b4-f46a-4739-85de-fdc33ef38f44', 'domaine', 'a77b6bb0-34c3-4007-8966-847eec3e5dd6', 'Definition of Done'),
  ('42c5a354-7749-49d6-8cf1-9b7aa7d5d3b8', 'mission', '8c2dc078-97f9-4477-b2c6-1403b1b902d1', null),
  ('2e8b2933-9cd4-4797-9dbb-d1e725378b86', 'domaine', 'fd743a26-3bed-454f-b68c-2d4bd26e5793', 'Definition of Done'),
  ('6e6f7e15-aad8-41f1-81bc-faa3ee06d242', 'mission', '2d412b87-bd9b-4329-ab23-ec8345fb3355', null),
  ('53515a6b-57c7-42ff-b4fe-59ee5bbfcf86', 'domaine', '3ec032fd-3bf0-4d2a-92f6-b564a78b7a27', 'Definition of Done'),
  ('7347d78a-a855-4678-823f-3abb095a0918', 'mission', 'e08fbc65-598b-4535-ad20-8576a2f6ac43', null),
  ('14e45d00-64b0-4bab-9bbf-b766f86c6830', 'domaine', 'e62b6d0e-e468-4d71-8e31-320d0eb4ef0b', 'Definition of Done'),
  ('b6df886e-8924-49f2-9b66-38c493969c36', 'mission', '33fdac34-7e83-4011-ab5c-85de226679d1', null),
  ('fc597208-39e9-47a4-b893-0f5e6059e166', 'mission', '4c6ab7c8-dc61-4b96-bc07-eea4717a090b', null),
  ('a536d69b-804d-43a8-a2f7-652b29f08005', 'domaine', '1b312d99-5a2e-4b28-9c68-d7ecc8f51adc', 'Definition of Done'),
  ('65feba68-7970-487c-a66a-e29650be42c3', 'mission', '50d95197-e2fe-40d5-b37f-465847a5068d', null),
  ('5bccb56f-51d9-4542-85a9-54ed65608fed', 'domaine', '513b3367-745e-4099-8599-409361d92f61', 'Definition of Done'),
  ('e71dee72-7344-4876-9c68-2733f122eed5', 'mission', 'd143c1fb-4b05-4279-9a4e-635ad0b13970', null),
  ('8b2c6c2b-0063-42ee-9e6f-e387e9717d05', 'domaine', '59a6511e-c02b-4d7d-93bb-4351f9cb88aa', 'Definition of Done'),
  ('68c0ceb4-12af-4357-b0bf-2937dd5717ff', 'mission', '8e700363-904d-4e71-9ce6-9272bfaa1482', null),
  ('c01e0b03-40e0-4727-b11b-c46155b7c89a', 'domaine', '4534a9c4-8e1c-4cd2-aaf8-0597e7d6b871', 'Definition of Done'),
  ('c1e08713-0de6-4ab4-9d60-2474c5e1ea11', 'mission', 'd99846b5-a3b2-4bc7-8c20-f665c4dda64f', null),
  ('70b824d2-7b07-4103-951b-b108e5ea99f7', 'domaine', '13bef7e0-c96d-4ce4-9121-805aed2e56b1', 'Definition of Done'),
  ('69fdd079-9ed4-48d8-b43c-7914777a123a', 'mission', 'a18ded0f-4200-4df4-9ec0-ef9a41307777', null),
  ('e5c8b08b-969e-4d01-ad75-8d33ce5aec20', 'domaine', '95e88d3a-6cf4-465e-bbd4-ee9c9c9f37c1', 'Definition of Done'),
  ('bcc9be04-bb9b-42ef-902e-fbf7327dda75', 'mission', '872d1a54-d6b4-405c-910a-63ca7fb39d98', null),
  ('87817fe9-1af6-4e25-b9c9-a4ab40143efd', 'domaine', 'ceaf3a47-e85e-4588-b63c-41927707a87a', 'Definition of Done'),
  ('4f8fa0b1-d064-4f5e-b8f3-379caf244c51', 'mission', 'e4bfc080-a023-4a7d-84a7-1853e30c68b6', null),
  ('1984b1fd-c247-4e42-bde5-2d4af2929b9c', 'domaine', '4729b1aa-ad15-4b22-8ff2-abdafe73a855', 'Definition of Done'),
  ('92c7bd3d-bf11-4849-9889-5ef70d69eeec', 'mission', '335363c3-c619-40c2-94ff-92109c81b510', null),
  ('e7a01feb-78e9-4aec-ab11-258584f545f4', 'mission', '926ddabb-485a-4158-b319-f688fa425d58', null),
  ('a7b9e9d5-a102-4863-8828-352d693e1599', 'domaine', '110474ca-e601-4539-8592-df041cbf7878', 'Definition of Done'),
  ('b9a11064-d0ef-407f-89c9-8e0b473a3c9a', 'mission', '38116b69-5f16-4395-bc46-72e684e70812', null),
  ('9d1807ee-c307-4807-a716-f4dba28aad3b', 'mission', '6c128e27-5d5b-42ec-b6e5-fd9dd6e48215', null),
  ('324d22c2-3bb9-4cec-a56e-07cd93b6e94f', 'domaine', '31e5aa43-898d-4040-9a49-afcc1ee12a7a', 'Definition of Done'),
  ('08e3d447-f9a6-49df-8930-58feabe23a98', 'mission', 'c31366c1-aa07-44ce-b85b-16c3662e5240', null),
  ('6f045b46-234c-4553-805f-20e66e8d7be9', 'domaine', '253d4f9f-951b-4f08-9c06-eb990a04fe67', 'Definition of Done'),
  ('bbaf5f73-c7ba-4190-bfbb-d447b76dc59d', 'mission', 'b747288d-6860-4d7c-b099-7d00550cafe5', null),
  ('643443dc-55f7-4502-8ee3-b33a2b424106', 'mission', 'a31393c1-4f18-424f-b9eb-4de8e5666189', null),
  ('bb99f21f-d1e5-496a-97f2-c3f18bb05dac', 'domaine', '23e84e36-968b-4a98-bcaa-2f0d02530e2c', 'Definition of Done'),
  ('39f285f9-3459-4e92-bb00-29885d1da6fd', 'mission', '2e563ed0-874f-4796-9c06-ff48c6567ae0', null),
  ('a4f60243-394f-4ce2-a9c4-0f7231e55e3b', 'mission', 'ed94c8ac-61f6-4449-92cc-0360d1050f87', null),
  ('8a9f7cb4-5c15-4a9d-bb95-37ec89ff858d', 'domaine', 'f56729a1-8215-40f9-bd1d-86ccd08803de', 'Definition of Done'),
  ('b296cf7d-2679-4ae3-8a1b-2099f4e2eaa3', 'mission', '4c4e9937-cf3f-4bf3-887d-7ce4e0b1edd7', null),
  ('2965ebaa-c1d2-4598-ad04-936f5cde5170', 'mission', 'e5d8bd82-1888-4751-b2a7-433a893f4aec', null),
  ('1b2c4c48-bf45-4fde-bb3f-3874d80daefc', 'domaine', 'bab0cc3b-9c36-425e-9975-b7382bf3d641', 'Definition of Done'),
  ('15afe7c7-bfcc-49e6-899c-3a09c228a63f', 'mission', '1e9d4b24-8442-47ba-8f27-311e51097b88', null),
  ('0653e42f-2d95-4a6e-b53f-0496e3ea552c', 'domaine', 'e1e223af-47c8-4da0-9c87-548bf336be97', 'Definition of Done'),
  ('81f8c962-f444-427c-b0c6-ef8d49d986c1', 'mission', '98b1014d-5203-4712-a72a-2bf2e103acd1', null),
  ('2292ee9d-d887-449e-b581-2eaf1f6417d3', 'domaine', 'b3795650-bc2c-4988-9cd0-6a982e6d8f5e', 'Definition of Done'),
  ('ee864cfd-2f4e-423f-a5b6-f589758c3c02', 'mission', '45c400a6-5fa3-4e06-95c0-491872bec09e', null),
  ('d15a4a45-fc3b-4a13-be16-2b8139f9203b', 'mission', '184e97df-1801-42e3-b3c2-7a7b029db4c5', null),
  ('9f2f4260-de6d-4e26-829f-19ba6b4419e2', 'mission', 'b2f6e045-8c55-4469-9411-dbec086a1c99', null),
  ('ab8fb34c-4b35-42f9-9213-9aa94fe9502b', 'domaine', 'a0834734-1cd1-4a38-9a99-46d0c633b788', 'Definition of Done'),
  ('091c3a1a-974b-4642-a08b-f97862d1721b', 'mission', 'd1640739-0a3d-4286-bc9b-1eb4d60f524e', null),
  ('05449475-b0b3-44fc-9933-a143f510b8b1', 'mission', '39ec9554-27a7-4794-a5ba-ee32d23d531c', null),
  ('664f4264-3aac-4c86-a491-4ed0abdbdce5', 'domaine', '7089f775-76cb-42c7-8a58-fc10919779a5', 'Definition of Done'),
  ('4bc68658-b32e-43c1-a466-009b43ca5fa8', 'mission', '542c3f2e-e89b-485f-8a52-5fa9dfa3c7db', null),
  ('5aa05e72-d338-4ee0-9d37-1ec21d54f0d4', 'domaine', 'a47788c4-fae6-47c7-a321-d69cfd67bbd1', 'Definition of Done'),
  ('79fda52f-e74e-4afd-83cf-3ccdda37b30e', 'mission', '3c5db468-b752-4655-a26c-6a64ab281d08', null),
  ('969778f5-bc25-4c79-bcf5-32057355dead', 'domaine', '008eb27b-f616-43bf-8384-bbf266362568', 'Definition of Done'),
  ('342b560f-6cbe-43ce-8960-94712c58511f', 'mission', '43498ff6-d32a-480a-b284-7ba5545e9c00', null),
  ('c1eb784f-aa9e-445b-bc3c-815b96276251', 'mission', '57a78d00-088a-4e94-86e9-09bd1e5d237d', null),
  ('d4398ece-d9f1-4dbe-84aa-a9a5a1a83ba5', 'domaine', 'b4b4e8b1-5373-44de-8e4f-2f2ac13bea85', 'Definition of Done'),
  ('729e83f7-2eb3-4ac5-97bb-98ac20d25966', 'mission', 'eba7d4e7-614b-43df-b842-3c1980b2adf8', null),
  ('22472f3f-69d7-4ebd-893b-c4c52753fc4b', 'domaine', '0a2663a4-a7a2-4959-8647-9a34b1e3faa9', 'Definition of Done'),
  ('358203ee-a7b6-4feb-a4b4-e73b43976958', 'mission', 'a65f57dc-5880-452e-b9c5-45df4aaa409e', null),
  ('7069149b-6e27-4cb8-a310-dc3cb684cc07', 'domaine', '7141bc4a-5a90-4bb0-9a2c-4e9443d4a143', 'Definition of Done'),
  ('b88745fd-0951-4989-8cbe-ab2771e11ccf', 'mission', '5a728b4d-c39d-4a26-899a-2a4380350e2f', null),
  ('8b25d42a-3238-488d-8658-42268f2d2fe5', 'domaine', '3563f17a-7682-4731-b8fe-2d0446e3080c', 'Definition of Done'),
  ('8a03d0f9-9c39-48a9-a6ce-55e8060bd6da', 'mission', 'c45c01f0-9e8f-4d06-bb50-990b383a6a81', null),
  ('6d88895e-5317-4613-a879-e3c4bf1c77f2', 'domaine', '33b808e9-897d-406c-81ea-ae1fd44e34c4', 'Definition of Done'),
  ('3b159aab-67c2-4df0-90f1-f98b1868f2e6', 'mission', 'fc69ab3b-c69a-4095-bbc8-4e33eae82604', null),
  ('56288eb5-cf2d-4f1f-87ad-4255a8aa2b0f', 'domaine', 'b931e6aa-64c9-4674-bbb8-dd1f9cd29ff2', 'Definition of Done'),
  ('255ff81a-0e8f-4093-a17e-d74833335a0f', 'mission', '5557f318-1854-455f-896f-160943889f7a', null),
  ('468a1cf5-cee3-4b38-8fb1-91c2f7f4b026', 'domaine', '029642f2-f45a-496d-a46e-537ed124cd07', 'Definition of Done'),
  ('bd7a57a1-e51f-46b2-90f3-9d972ef254f4', 'mission', '937cee0b-4f0f-4ae4-9183-32103a2dfbc3', null),
  ('c2df5bea-00e3-42df-ab5d-6052325ee60c', 'domaine', '038a14b1-d160-4b9e-adf1-8b29a7c02463', 'Definition of Done'),
  ('09d576a3-5a09-4cb4-bb77-9326279e7e96', 'mission', '81ab532d-0525-45fa-9ab4-48dd46741143', null),
  ('7e365950-9419-4c1d-910d-0704ea9fbf0c', 'mission', '07de0dc2-534f-4729-8ef4-2afe3521a0b6', null),
  ('f9130305-f48d-490c-a38c-77791259bc62', 'domaine', 'f9f52742-ab38-4772-a5a0-4a8c9dc510e3', 'Definition of Done'),
  ('1d0d7b17-ea33-400a-acc4-651c3a1e09ad', 'mission', 'ef1b99b9-b426-4f9d-9a0f-8bbd383f7088', null),
  ('f57476f6-0733-4846-8ae1-dc06be1a1f6f', 'mission', 'b9c1c857-2bad-45a4-b9f9-79b9bdf0271f', null),
  ('e6982603-d9b4-449b-8814-70e846666c8b', 'domaine', '2a7d4812-5c92-4192-943b-2a1185d2104b', 'Definition of Done'),
  ('19cdb7a2-af5c-4153-9e17-3675ca253be8', 'mission', 'f57e6cc3-11bd-44a0-ac3b-e5fd9de464e0', null),
  ('395b23fd-6d16-42bc-91ec-8f7bed120615', 'domaine', '75b6ae27-71f7-4270-80c5-dabc4ca5ab7d', 'Definition of Done'),
  ('c96061ac-8f09-4b78-b6ca-5a9249b4e900', 'mission', '2436ac46-eb60-4e3d-953f-08d49b307919', null),
  ('6e97b09d-4744-4b82-b2d9-2d20d9a03982', 'domaine', 'c0c66ee3-d790-4bdb-b38f-3f897f7eca8f', 'Definition of Done'),
  ('9bf35d94-10de-4946-9b10-d36a8516e86c', 'mission', '2ed550a7-4839-4cc8-9f05-4e7358f383a8', null),
  ('2ccd91aa-4329-4ff3-9aab-6e6045c91a73', 'mission', '509db504-876b-4c07-a213-4f348d8a9484', null),
  ('906808a9-1e40-4ce9-bf57-e7c1ccf59a00', 'mission', '0296c165-138c-45a6-bd8f-8353d49aef46', null),
  ('47ba2e5c-30ea-4ed5-b34b-b57ae084e86f', 'domaine', '44d5cb03-46fc-44aa-a2a7-e492e0a7f275', 'Definition of Done'),
  ('d3f45a2e-c0cd-4f29-8efb-715c0989e411', 'mission', '2574b27d-fcaa-4ef9-a7b6-a544b1ef8ec5', null),
  ('bda06860-c67a-4b6b-8a3f-c50fd48bf77f', 'mission', 'b3b00e88-bacc-4256-a5bd-76185e6e0bec', null),
  ('1a17bf86-c752-4ca8-989b-af62a6297c47', 'domaine', '55075177-d63e-4573-99d7-8fb2055b9e57', 'Definition of Done'),
  ('7d87743e-f7cf-46c0-91a2-4d198bb67684', 'mission', 'e2278c8e-2a1c-41db-9be1-4ec5532f3b17', null),
  ('52e8d0b7-afe4-40c2-868f-cc71f07fd6b8', 'mission', '645ca9d9-f6f1-4114-bedc-7bfff27e8e04', null),
  ('5370b0e9-5b9d-4f5b-a7c7-5713573a9f40', 'mission', 'a931f2e6-7677-45fa-9623-907ab5b8d9fb', null),
  ('d3579939-f5ad-4379-a895-82355c0cc071', 'domaine', '8ecc20ea-8ed8-4510-8e60-a993da2c4702', 'Definition of Done'),
  ('710d5634-d765-49ad-9e1e-0290861d0387', 'mission', '4fcbb91b-449e-431b-a5f1-5dcf42ce48be', null),
  ('09782dfd-b3b6-4444-beef-7eb304b73a49', 'mission', 'e4902c97-6306-440d-b9f7-06c57c749812', null),
  ('1c236b84-2cfa-4058-9b40-cd6d876b79f5', 'domaine', 'f8880271-c2b1-44ee-bb75-cd0b901263c8', 'Definition of Done'),
  ('9a2b6e4c-8725-4f10-a227-697d7cdb6195', 'mission', 'e38786e6-8b05-4a5b-982e-4d8481bf1843', null),
  ('07f7aff8-e56c-483d-abea-a6d7a680b85c', 'domaine', 'fe38d0bd-6624-457b-b2d1-12cbd4efb251', 'Definition of Done'),
  ('2718c011-bd66-465d-af33-642986af3217', 'mission', '6925ba04-75c2-4692-8e1d-dcbcef0b2328', null),
  ('d75ef9de-0cdc-4ac1-aae6-cdada4118039', 'domaine', 'e80905a0-ff91-464a-9db4-3b61cb7d8ed6', 'Definition of Done'),
  ('a479a8b9-229d-4602-8ad7-c025374c723f', 'mission', '678138e9-de04-475d-b5d5-446e8bee8980', null),
  ('8cb2dd9a-efe0-4dfa-bfd4-c33d86ff590a', 'domaine', '303afd4c-e671-4ae5-9f88-d405e5b6ea8c', 'Definition of Done'),
  ('95b258e3-25c3-47f8-a9f9-31652fa2673a', 'mission', '815fd831-fad4-4049-835e-f896477e8836', null),
  ('00ca80ca-435f-498c-83ac-40dd7386f537', 'domaine', 'b52c6d06-73f8-42d1-85c0-dd66ca55cb77', 'Definition of Done'),
  ('ce3df3fa-7924-4876-bbe8-b28f298a8407', 'mission', '46a48dc6-e872-446c-90f0-6b269e60f553', null),
  ('1082ca51-dd09-4968-8c50-302926f42ee6', 'domaine', '46dc100f-f7e2-497f-a0f2-34e0b3e706a6', 'Definition of Done'),
  ('d23bbf25-fb43-475a-b97c-71969776d8a9', 'mission', '57b5e510-eb45-4cc3-b028-e5eb16a1cc94', null);

insert into _20260725_checklist_items (id, checklist_id, label, sort_order, priority) values
  ('651c2944-e25b-4eb8-b768-4e0f90388d32', 'b0e9e005-8e4e-4e3f-83cd-d51b855e59a9', 'Tous les référents nécessaires ont été désignés et ont confirmé leur rôle', 0, 'normal'),
  ('ba12e3bb-a82c-4413-a526-b9a81bc57048', 'b0e9e005-8e4e-4e3f-83cd-d51b855e59a9', 'Le document de coordination est diffusé et à jour', 1, 'normal'),
  ('697f2642-44a7-462f-9269-856d6e48659d', 'b0e9e005-8e4e-4e3f-83cd-d51b855e59a9', 'Chaque prestataire clé a un contact de secours identifié', 2, 'normal'),
  ('e44dced9-1f2d-4395-b2f8-30a8fe4ae7a9', 'ec209a09-ff58-49ce-925a-b885de1f0919', 'Lister tous les prestataires (pro et amis) avec rôle, contact, horaire d''intervention', 0, 'normal'),
  ('d7eba1de-614f-4b97-8bee-03fc0c74f33e', 'ec209a09-ff58-49ce-925a-b885de1f0919', 'Avoir un numéro de contact de secours pour chaque prestataire clé', 1, 'normal'),
  ('d1d88efb-f1b5-4616-ad76-0088eee6ea32', '16dd5058-25b8-479a-9bac-b8f9e7f4daf8', 'Créer un document de coordination partagé accessible à tous les référents', 0, 'high'),
  ('9d99c8d6-aee3-4997-99d4-9418c6ff41dd', '16dd5058-25b8-479a-9bac-b8f9e7f4daf8', 'Lister les rôles de référents à désigner pour chaque phase (avant, jour J, après)', 1, 'normal'),
  ('b3b51e77-b391-416f-8d5c-33af74488f2d', '34e35648-0bf6-429e-a192-30ccbfc7aac7', 'Contacter chaque référent pour confirmer son accord et son périmètre, lui fournir une boîte à outils', 0, 'normal'),
  ('e1a4e820-19a3-4c20-b27e-c8c322846295', '34e35648-0bf6-429e-a192-30ccbfc7aac7', 'Organiser une réunion de coordination 1-2 semaines avant l''événement', 1, 'normal'),
  ('938f6a77-3f28-47f4-83aa-ab564bd2892b', '34e35648-0bf6-429e-a192-30ccbfc7aac7', 'Désigner un interlocuteur unique sur place pour tous les prestataires', 2, 'normal'),
  ('7a5329c3-8821-4fa2-a1b4-be1911cc4f4e', '110e6839-ec1d-4be9-8875-621f6646bfb5', 'Le conducteur minuté est rédigé, validé par les prestataires clés et imprimé en plusieurs exemplaires', 0, 'normal'),
  ('37d3b68e-31bf-4961-8f15-5a9d76f58370', '110e6839-ec1d-4be9-8875-621f6646bfb5', 'Un plan B existe pour chaque moment critique identifié', 1, 'normal'),
  ('d4388941-5573-4172-85b8-00202e93d558', '9c34ad26-3c50-420e-8539-390940eadb0a', 'Rédiger le conducteur minuté complet : accueil → cortège → cérémonie → cocktail → dîner → soirée → remerciements → fin', 0, 'normal'),
  ('33db10a3-a0bd-4b95-af68-24b47a46523e', '51ebb4a5-c851-45fd-8023-abf96153c923', 'Valider le conducteur avec les prestataires clés : DJ, traiteur, photographe', 0, 'normal'),
  ('7416e16f-9f0d-45f5-8838-dd661578771f', '51ebb4a5-c851-45fd-8023-abf96153c923', 'Faire le point avec les parents de Sarah sur leurs interventions pendant la cérémonie', 1, 'normal'),
  ('32e5fe80-3458-436c-b725-9f02b10449ab', '51ebb4a5-c851-45fd-8023-abf96153c923', 'Faire le point avec les parents de Jordan sur leurs interventions pendant la cérémonie', 2, 'normal'),
  ('cdb62ad0-350a-41ba-82f3-1ab5758cdd3b', '51ebb4a5-c851-45fd-8023-abf96153c923', 'Désigner un maître de cérémonie / coordinateur de soirée', 3, 'normal'),
  ('5c0293a9-4dc3-4302-a049-5a31f972f865', '169434b6-24f1-4f81-87b5-c6f364e0f6a4', 'Identifier les temps morts et prévoir des animations ou transitions', 0, 'normal'),
  ('eea66d54-4a8d-48f4-a42d-bb29062d8085', '169434b6-24f1-4f81-87b5-c6f364e0f6a4', 'Gérer la chaleur pour les invités pendant la cérémonie extérieure (espace ombragé, eau fraîche, éventails)', 1, 'normal'),
  ('64b8b9f5-69f7-4656-b8bf-4eafa5d30d98', '169434b6-24f1-4f81-87b5-c6f364e0f6a4', 'Prévoir un plan B pour chaque moment critique (météo, retard prestataire, son défaillant)', 2, 'normal'),
  ('c61f25af-abd0-4f24-b1ea-04f6d964f65e', '169434b6-24f1-4f81-87b5-c6f364e0f6a4', 'Imprimer le conducteur en plusieurs exemplaires pour le jour J', 3, 'normal'),
  ('77820087-0c9a-48a9-a801-3e74a9691ecb', 'd3b80bd7-800b-460b-8463-945ce01609bf', 'Tous les référents ont confirmé leurs horaires et reçu le conducteur', 0, 'normal'),
  ('a013e540-d6d6-4c82-88a5-f6214531214f', 'd3b80bd7-800b-460b-8463-945ce01609bf', 'Le tour de contrôle final de la salle est fait sans anomalie', 1, 'normal'),
  ('4bb477c1-c1a2-41aa-b211-7f0e2c0f877a', '521f2353-e120-4d29-9049-e8d343118ecd', 'Confirmer les horaires d''arrivée de chacun le lendemain avec tous les référents', 0, 'normal'),
  ('6e610211-2b11-4bbc-a4eb-272fdfe5b79d', '521f2353-e120-4d29-9049-e8d343118ecd', 'Confirmer avec le Grand Arbre l''accès pour le lendemain (heure d''ouverture, point d''entrée)', 1, 'normal'),
  ('8263064e-ef19-4e22-8bc5-ff21514cea43', '521f2353-e120-4d29-9049-e8d343118ecd', 'Confirmer l''heure d''arrivée du DJ (16h30) et du photographe/vidéaste', 2, 'normal'),
  ('99b56497-d594-486c-b137-ce023f36aabc', '521f2353-e120-4d29-9049-e8d343118ecd', 'Imprimer et distribuer le conducteur à tous les référents', 3, 'normal'),
  ('af7a7cd7-d60c-4e31-95ce-66f6029adc92', '521f2353-e120-4d29-9049-e8d343118ecd', 'Rappeler aux intervenants des discours leur ordre de passage et durée', 4, 'normal'),
  ('5aa46937-cd1e-48d6-a5ad-a88501fbbd80', 'd1c895a0-55eb-461f-b056-e40ef65a6f56', 'Tour de contrôle de la salle : déco, boissons au froid, mobilier en place', 0, 'normal'),
  ('9110b031-7d75-48b9-bf1c-9ec04b03c8dc', 'd1c895a0-55eb-461f-b056-e40ef65a6f56', 'Vérifier que les enveloppes de paiement espèces jour J sont prêtes', 1, 'normal'),
  ('f117f5e7-f0dd-41c9-a84c-4c0d4648d66b', 'd1c895a0-55eb-461f-b056-e40ef65a6f56', 'S''assurer que rien ne manque en comparant à la liste de colisage', 2, 'normal'),
  ('2674392f-0e61-44c3-b449-3d72d7ce4b06', 'd1c895a0-55eb-461f-b056-e40ef65a6f56', 'Préparer la boîte à urgences (si pas déjà fait)', 3, 'normal'),
  ('57a5005b-0cf7-4c98-88bc-3f1c9045704f', '1dc72ee9-90b0-463e-af04-ecdb9cbe937d', 'Valider l''installation déco avant de partir', 0, 'normal'),
  ('636c848f-5f56-4e28-841c-1efbe58ef7ea', '1dc72ee9-90b0-463e-af04-ecdb9cbe937d', 'S''assurer que tous les référents ont reçu le conducteur imprimé', 1, 'normal'),
  ('f9f5f394-52f9-4230-b460-21a63464b38f', '1dc72ee9-90b0-463e-af04-ecdb9cbe937d', 'Préparer les tenues respectives pour le lendemain (rangées, accessoires prêts)', 2, 'normal'),
  ('c1b29ead-83c7-4b99-a32b-46e9e4063046', '1dc72ee9-90b0-463e-af04-ecdb9cbe937d', 'Confirmer les horaires de chacun pour le lendemain matin', 3, 'normal'),
  ('5d78f21e-c572-4af5-b5a3-c36c5a7cf78b', 'd2db7ce0-305e-47b2-962e-681d8126fe8f', 'Le conducteur a été suivi du début à la fin sans incident majeur non géré', 0, 'normal'),
  ('62c36b12-98e6-480c-be40-fa3ee23cab0e', 'd2db7ce0-305e-47b2-962e-681d8126fe8f', 'Tous les prestataires ont été briefés et accompagnés jusqu''à leur départ', 1, 'normal'),
  ('9fb34e57-c091-44c5-8846-ee1c47da002f', '2a6cbfa4-af8e-4a3a-bf32-de6d8456e834', 'Accueillir le DJ à 16h30 — vérifier branchements et soundcheck', 0, 'normal'),
  ('fa6cd0fc-9b82-4a08-ace6-6d234e378a84', '2a6cbfa4-af8e-4a3a-bf32-de6d8456e834', 'S''assurer que le DJ dispose d''eau et d''un espace de pause', 1, 'normal'),
  ('cb443e8a-36fd-4d34-9e21-3ddcd027bc07', '2a6cbfa4-af8e-4a3a-bf32-de6d8456e834', 'Accueillir le photographe/vidéaste — lui remettre la shot list et le conducteur', 2, 'normal'),
  ('39535a5e-b9cf-4128-b1c7-aca84872f46f', '2a6cbfa4-af8e-4a3a-bf32-de6d8456e834', 'Lui présenter les personnes clés (famille, témoins) dès que possible', 3, 'normal'),
  ('ab1d1f96-e447-4797-b4c4-1798bb2fafa8', '2a6cbfa4-af8e-4a3a-bf32-de6d8456e834', 'Faire le tour de contrôle final de la salle avant l''arrivée des invités', 4, 'normal'),
  ('613080f6-09f9-49d3-bd64-ccf6936deeb1', '2a6cbfa4-af8e-4a3a-bf32-de6d8456e834', 'Vérifier que le micro est opérationnel', 5, 'normal'),
  ('a334ee13-08bf-493d-b533-3420533a9d20', '43a316e3-599e-4123-a490-7ef3963a7c79', 'Synchroniser les montres/téléphones avec le DJ et le photographe', 0, 'normal'),
  ('a93ecfac-b8c4-4461-89bd-09ff4957a6ae', '43a316e3-599e-4123-a490-7ef3963a7c79', 'Superviser le positionnement des placeurs pour l''accueil des invités', 1, 'normal'),
  ('009dfe1f-5c08-4ddd-bd23-578d726319f3', '43a316e3-599e-4123-a490-7ef3963a7c79', 'Donner le signal de départ du cortège à 17h30', 2, 'normal'),
  ('49f88a91-2d50-4e2a-b5b3-524c87d004d2', '43a316e3-599e-4123-a490-7ef3963a7c79', 'Suivre le conducteur minute par minute pendant toute la cérémonie', 3, 'normal'),
  ('f2de5c28-dfb7-44dd-a8b5-0825800f16ef', '43a316e3-599e-4123-a490-7ef3963a7c79', 'Communiquer avec le DJ via signal discret (geste ou intermédiaire défini)', 4, 'normal'),
  ('cab6f669-21b6-4696-a6a2-fe07971054e9', '43a316e3-599e-4123-a490-7ef3963a7c79', 'Alerter discrètement si un retard se creuse', 5, 'normal'),
  ('8c1e8614-bce1-4b6e-a170-def1394ce374', '43a316e3-599e-4123-a490-7ef3963a7c79', 'Superviser la transition cérémonie → cocktail → salle de réception', 6, 'normal'),
  ('611afe4b-fcf6-4b32-80f3-eaf51bb6c1fe', 'c241fb49-3b3e-4d92-85b4-75aec42888cb', 'Confirmer l''heure de début du service avec le responsable traiteur', 0, 'normal'),
  ('dff1e150-98d4-43ea-ad92-17233cdf4e9e', 'c241fb49-3b3e-4d92-85b4-75aec42888cb', 'Surveiller le timing entre les plats pour rester dans le conducteur', 1, 'normal'),
  ('f986dbf8-de28-4916-b4fb-2543803cfd35', 'c241fb49-3b3e-4d92-85b4-75aec42888cb', 'Signaler au traiteur tout changement de programme', 2, 'normal'),
  ('1f7c6123-ce2a-4fbe-af0e-0f9350797efd', 'c241fb49-3b3e-4d92-85b4-75aec42888cb', 'Signaler au DJ les transitions importantes (premier slow, montée dancefloor, clôture)', 3, 'normal'),
  ('6846b1c8-75a7-4f70-8ba5-cb224a74c6a9', 'c241fb49-3b3e-4d92-85b4-75aec42888cb', 'Valider avec le traiteur les horaires du dessert (23h00), café et départ de l''équipe', 4, 'normal'),
  ('2488ed72-a7ae-4e8d-85be-adc86b4b5476', 'c241fb49-3b3e-4d92-85b4-75aec42888cb', 'Confirmer l''heure de fin de prestation du DJ et la musique de clôture', 5, 'normal'),
  ('7c74661f-8f4f-49b5-b43f-5fe8651e58ea', 'c241fb49-3b3e-4d92-85b4-75aec42888cb', 'Relayer les consignes météo en temps réel si la nuit devient fraîche', 6, 'normal'),
  ('083051e2-19f7-4906-b7c1-1c1498256f97', '100ac0e8-fb7d-4516-a1c2-ba7ff45ec2a8', 'Tout le matériel et les valeurs (urne, cadeaux) ont été remis aux fiancés ou sécurisés', 0, 'normal'),
  ('aa19385c-7b05-4f7c-aafb-a87d1fd76cbf', '100ac0e8-fb7d-4516-a1c2-ba7ff45ec2a8', 'Les soldes prestataires du jour J ont été réglés', 1, 'normal'),
  ('8fb27945-362a-4511-bd2f-4061b75b4e11', '9d15c652-3179-41bd-b3fe-615c5fd47cbc', 'Valider avec le référent logistique que tout le matériel a bien été récupéré', 0, 'normal'),
  ('2b020471-ff79-4531-a167-5708b6a5bc72', '9d15c652-3179-41bd-b3fe-615c5fd47cbc', 'Vérifier avec le référent enveloppes l''inventaire du contenu de l''urne', 1, 'normal'),
  ('2db533aa-09e9-47a5-8517-898295b7c746', '9d15c652-3179-41bd-b3fe-615c5fd47cbc', 'Réaliser les paiements des soldes restants aux prestataires qui partent', 2, 'normal'),
  ('282ae4ee-807d-476d-b5fc-0e3b8d978e03', '9d15c652-3179-41bd-b3fe-615c5fd47cbc', 'Récupérer les bons de fin de prestation', 3, 'normal'),
  ('550578e9-7a22-41f0-8244-bff2881e659f', 'b74987d2-fae7-4104-ae34-abc610b2ca88', 'Dire au revoir aux invités qui repartent', 0, 'normal'),
  ('55e8d364-10bd-4417-8fa7-eba35bf13ece', 'b74987d2-fae7-4104-ae34-abc610b2ca88', 'Être disponible pour accompagner les invités vers leur hébergement ou leur transport si besoin', 1, 'normal'),
  ('71599ad2-46ab-4bd5-9749-09834fdfaef5', 'aa51f92d-243c-482c-89b2-42f8b97b4ec1', 'Les retours de tous les référents mobilisés ont été collectés', 0, 'normal'),
  ('4c01cd57-fe8f-4a7b-94a0-698252b8fd0d', 'aa51f92d-243c-482c-89b2-42f8b97b4ec1', 'Le conducteur annoté est archivé', 1, 'normal'),
  ('e71d76f7-18c1-4daa-9e4f-e10b35ca33d5', 'e86e79b1-9108-49fe-b7fd-9a6ccfbfdc85', 'Rassembler les retours des référents sur ce qui a bien fonctionné et ce qui aurait pu être mieux géré', 0, 'normal'),
  ('daf62ac8-17a1-4fe3-80d8-4608c44a8e98', 'e86e79b1-9108-49fe-b7fd-9a6ccfbfdc85', 'Documenter les imprévus rencontrés et les solutions appliquées', 1, 'normal'),
  ('ffe87a73-527b-4544-a723-b13d26e83e70', 'e86e79b1-9108-49fe-b7fd-9a6ccfbfdc85', 'Archiver le conducteur final annoté pour référence future', 2, 'normal'),
  ('45262091-2486-4c8b-9669-de0dd933629b', 'd4e7e1d4-6522-46bb-b603-7bf87bc0492f', 'Le nombre d''invités, le menu et le timing de service sont validés avec le lieu', 0, 'normal'),
  ('b64958bc-000f-4e1d-8df5-280743a6b583', 'd4e7e1d4-6522-46bb-b603-7bf87bc0492f', 'Le plan de salle est établi et la visite technique avec le DJ est faite', 1, 'normal'),
  ('1d4f1d43-f948-4aee-a760-7203df2e5c49', 'bd4f93ff-3ea3-4664-8ffb-9395821735ce', 'Leur communiquer le nombre définitif d''invités', 0, 'normal'),
  ('27614ac9-053a-48ff-b940-1aaabf44bd66', 'bd4f93ff-3ea3-4664-8ffb-9395821735ce', 'Valider le menu définitif avec le traiteur du lieu', 1, 'high'),
  ('f9e04175-3b92-4d5e-ad0a-91aba28c2527', 'bd4f93ff-3ea3-4664-8ffb-9395821735ce', 'Valider le timing de service (cocktail, plat, dessert, café)', 2, 'high'),
  ('14aefcf1-0dd0-4487-989d-eb8694431975', 'bd4f93ff-3ea3-4664-8ffb-9395821735ce', 'Confirmer le nombre exact de tables disponibles', 3, 'high'),
  ('6b1c159a-9806-4307-860e-c48de287ef8c', 'f8c1de64-c2e4-489e-8ba1-4e12fc9a8b68', 'Établir le plan de salle par zones : accueil, cocktail, dîner, danse, enfants', 0, 'normal'),
  ('ba7aadb8-3636-4c6a-a7c1-28a43afc283e', 'f8c1de64-c2e4-489e-8ba1-4e12fc9a8b68', 'Planifier la visite technique avec le DJ — premier week-end de juillet', 1, 'high'),
  ('c99aaaa9-3927-45df-af9e-386f35f996f8', 'f8c1de64-c2e4-489e-8ba1-4e12fc9a8b68', 'Leur demander si accès possible la veille pour décoration et dépôt des boissons', 2, 'normal'),
  ('52dcf833-9db6-4597-a414-b50ba0e8526f', 'f8c1de64-c2e4-489e-8ba1-4e12fc9a8b68', 'Envoyer le déroulé minuté au Grand Arbre', 3, 'normal'),
  ('f6c2d158-5064-495b-b24e-a901f6d7ec07', '3ea013ac-35a8-4003-9e06-369e40b521fc', 'Confirmer exactement ce qui est inclus dans la prestation nettoyage (poubelles)', 0, 'normal'),
  ('9cb8fdea-3d45-4a35-a4af-bdec3c24ac9e', '3ea013ac-35a8-4003-9e06-369e40b521fc', 'Clarifier la procédure d''état des lieux de sortie avec le propriétaire', 1, 'normal'),
  ('9ad3efc6-680b-43fb-8200-33764a8f7e6d', '3ea013ac-35a8-4003-9e06-369e40b521fc', 'Mettre en place signalétique de bienvenue / fléchage depuis le parking', 2, 'normal'),
  ('eb9b7e6c-cffc-4984-a7fb-1be258b7e3fc', '57ddfd38-c8ad-41b6-953e-79e4d52ee9fa', 'L''état des lieux de sortie est fait et signé', 0, 'normal'),
  ('101baceb-3ffe-491b-a285-5b511dbd6b8f', '57ddfd38-c8ad-41b6-953e-79e4d52ee9fa', 'Le dépôt de garantie est récupéré ou son calendrier de restitution est connu', 1, 'normal'),
  ('2be7af68-c07a-4a6a-b253-78320a49aec0', 'ac6b874f-ea22-4f14-8d6d-91f235753f4d', 'Faire l''état des lieux de sortie avec le propriétaire du lieu', 0, 'normal'),
  ('613df5d6-46dd-4561-897d-88c9951d0e02', 'ac6b874f-ea22-4f14-8d6d-91f235753f4d', 'Vérifier les conditions de restitution du dépôt de garantie', 1, 'normal'),
  ('087db538-0d10-4795-8330-1513e6834542', 'e73ea0bb-a4b0-4b6b-9bfe-d7283e4e317a', 'Le tableau RSVP final est complet et transmis au lieu', 0, 'normal'),
  ('8d9fb328-1ded-4199-81cf-60c88fff2cf7', '4d37b59b-9843-4139-a581-1c612e596f29', 'Envoyer un message à tous les participants confirmés : remerciements + choix du plat (poulet ou poisson)', 0, 'normal'),
  ('02dce230-a9d8-4bf4-bc62-2a8fb9a76852', '4d37b59b-9843-4139-a581-1c612e596f29', 'Relancer les retardataires n''ayant pas encore répondu', 1, 'normal'),
  ('a7304a17-cf7b-45c9-b183-d82e2f86a615', '4d37b59b-9843-4139-a581-1c612e596f29', 'Recueillir les horaires d''arrivée de chaque invité (vol, train, voiture)', 2, 'normal'),
  ('445b9486-3e0e-43d9-91be-a22e2114a298', '8e0a1a11-23a2-4602-85f6-2135586f3b2a', 'Compiler le tableau final : nom / présence / plat / horaire d''arrivée / besoins transport', 0, 'normal'),
  ('701640e7-a4b7-4bd9-ae45-82a40c880510', '8e0a1a11-23a2-4602-85f6-2135586f3b2a', 'Communiquer les chiffres définitifs au Grand Arbre (traiteur + salle)', 1, 'normal'),
  ('f05bda53-001a-4d6e-ad57-632d9ab3bed6', '0e986c20-5ce8-4d06-bfee-6b4334a18809', 'Tous les invités hébergés savent où ils logent', 0, 'normal'),
  ('0b1dc023-f222-49c6-a468-88acf3ab8233', 'ec2da13f-cf00-4b95-8060-b1b90168205d', 'Vérifier que tous les invités venant de loin ont bien reçu le guide hébergement', 0, 'normal'),
  ('80f3ed38-6ae0-4b7a-a209-f511ea9ed96e', 'ec2da13f-cf00-4b95-8060-b1b90168205d', 'Demander qui loge où', 1, 'normal'),
  ('a2427352-acc8-4287-a0e4-398cea467230', '696a06f8-4631-4699-b29b-5a470d110143', 'Tous les invités hébergés ont un retour confirmé', 0, 'normal'),
  ('7a3c1bf4-a207-4eb2-bde9-3d7909794314', 'd6c9a1ac-7410-4205-a79e-2e7f92ad861f', 'Vérifier que les invités venant de loin ont bien leur moyen de retour organisé', 0, 'normal'),
  ('ed743fd4-c0f7-4446-8a21-e0089f5d18ca', 'd6c9a1ac-7410-4205-a79e-2e7f92ad861f', 'S''assurer que les personnes âgées ont un transport retour sécurisé', 1, 'normal'),
  ('bebe3912-73be-4b50-8ff1-45048702534f', '188876b4-f46a-4739-85de-fdc33ef38f44', 'Un contact VTC/taxi de nuit est identifié et noté', 0, 'normal'),
  ('57aaf0fb-1430-45a7-9ab2-b2a36a6a09f8', '188876b4-f46a-4739-85de-fdc33ef38f44', 'Tous les invités sans moyen de retour ont une solution', 1, 'normal'),
  ('b086054a-d515-44c2-9281-52d0d2c5856f', '42c5a354-7749-49d6-8cf1-9b7aa7d5d3b8', 'Cartographier les besoins en transport le jour J à partir des horaires d''arrivée collectés', 0, 'normal'),
  ('1ac7f24f-747e-4d68-896b-b2349109a0e6', '42c5a354-7749-49d6-8cf1-9b7aa7d5d3b8', 'Identifier les invités sans moyen de retour (nuit tardive) et prévoir un VTC/taxi', 1, 'normal'),
  ('59a6a05c-5043-4b42-8241-af0e1961045d', '42c5a354-7749-49d6-8cf1-9b7aa7d5d3b8', 'Communiquer les modalités de transport à tous les invités concernés', 2, 'normal'),
  ('34622260-b4ab-4b96-991b-ff6ecd9ceb69', '42c5a354-7749-49d6-8cf1-9b7aa7d5d3b8', 'Noter le contact VTC/taxi de nuit à avoir sous la main le jour J', 3, 'normal'),
  ('c7b02f70-c61d-4e3a-a13e-53ac731d3156', '2e8b2933-9cd4-4797-9dbb-d1e725378b86', 'Le rappel J-7 a été envoyé à tous les invités', 0, 'normal'),
  ('bd5ba5e8-7e1c-4385-a9ed-06d3a1023746', '6e6f7e15-aad8-41f1-81bc-faa3ee06d242', 'Envoyer un message individuel (ou par famille) : remerciement RSVP + choix poulet/poisson + horaire d''arrivée attendu', 0, 'high'),
  ('215c0058-e69f-466b-848f-8d7f4490a534', '6e6f7e15-aad8-41f1-81bc-faa3ee06d242', 'Envoyer un rappel général J-7 avec : programme, accès, parking, dress code, météo anticipée', 1, 'normal'),
  ('b2e20910-079a-4a67-9c0d-8a7b7b87d5f0', '6e6f7e15-aad8-41f1-81bc-faa3ee06d242', 'Rédiger le message de remerciement post-événement (à préparer à l''avance)', 2, 'normal'),
  ('4b2e3dac-7098-4eb9-a6f4-ced78d41d160', '53515a6b-57c7-42ff-b4fe-59ee5bbfcf86', 'Tous les invités attendus ont été pointés à leur arrivée', 0, 'normal'),
  ('06bcc700-316f-4a5d-8c4e-d7ff7ce8a44a', '7347d78a-a855-4678-823f-3abb095a0918', 'Vérifier que la signalétique d''accueil est en place (plan de table affiché, fléchage terrasse)', 0, 'normal'),
  ('7bdfbcee-86bd-4c96-86f0-ba8c5bd77f16', '7347d78a-a855-4678-823f-3abb095a0918', 'Pointer les arrivées sur la liste de présence', 1, 'normal'),
  ('1f85b73b-16dd-4754-99b3-868259b36044', '7347d78a-a855-4678-823f-3abb095a0918', 'Orienter chaque invité vers la terrasse cocktail', 2, 'normal'),
  ('4bf232ff-2f8d-41d0-9822-8b72320eb0d0', '7347d78a-a855-4678-823f-3abb095a0918', 'S''assurer que les boissons d''accueil sont disponibles dès 17h00', 3, 'normal'),
  ('6a878bd0-e42b-4c28-a2b2-d50143d3e0d4', '7347d78a-a855-4678-823f-3abb095a0918', 'Gérer les arrivées tardives avec discrétion pendant la cérémonie', 4, 'normal'),
  ('5cd63649-ff94-4c82-a8b1-b09073a38c1f', '7347d78a-a855-4678-823f-3abb095a0918', 'Faire le tour des tables pour s''assurer que tout le monde a le bon marque-place', 5, 'normal'),
  ('c82c4c96-528a-4b28-a4b2-b29c379e3dd8', '14e45d00-64b0-4bab-9bbf-b766f86c6830', 'Le DJ a confirmé matériel, horaires et morceaux clés', 0, 'normal'),
  ('429046ea-c636-4157-ace8-03f889877f26', '14e45d00-64b0-4bab-9bbf-b766f86c6830', 'La playlist et la structure de la soirée dansante sont validées', 1, 'normal'),
  ('f8c9b773-91b8-4968-afc2-c52e7e9faea8', 'b6df886e-8924-49f2-9b66-38c493969c36', 'S''assurer que Djahman a bien répondu au Google Forms', 0, 'normal'),
  ('59ce8b1b-b58b-44e9-b28b-4c66b991f807', 'b6df886e-8924-49f2-9b66-38c493969c36', 'Obtenir confirmation du matériel : sono mobile extérieur, sono salle, diffusion terrasse, micros sans fil', 1, 'normal'),
  ('6763d173-be89-4197-ba1f-bf3a91920ba4', 'b6df886e-8924-49f2-9b66-38c493969c36', 'Confirmer que le matériel est adapté à ~90 personnes', 2, 'normal'),
  ('03f6472b-18c4-48bd-ad70-372dfa7c55c6', 'b6df886e-8924-49f2-9b66-38c493969c36', 'Confirmer son heure d''arrivée souhaitée et le temps nécessaire à l''installation', 3, 'normal'),
  ('a04178d1-2e62-4ae5-861e-d351f2fabc08', 'b6df886e-8924-49f2-9b66-38c493969c36', 'Planifier sa venue pour la visite technique début juillet', 4, 'normal'),
  ('6daa3312-7b3f-4702-ba9e-596aa66db178', 'b6df886e-8924-49f2-9b66-38c493969c36', 'Valider la version extended (30 min) du morceau d''entrée du cortège', 5, 'normal'),
  ('c2027a21-c486-4529-b8db-7d17c425fc7d', 'b6df886e-8924-49f2-9b66-38c493969c36', 'Confirmer « A love song » – Garth Stevenson pour l''arrivée de Sarah', 6, 'normal'),
  ('f4ed4aea-7b04-4942-8cad-8d615181eb83', 'b6df886e-8924-49f2-9b66-38c493969c36', 'Confirmer « Se pas pou dat » – Zo konpa pour la présentation de la bague', 7, 'normal'),
  ('3c44b694-17e7-4eed-af61-9b32b7067e46', 'b6df886e-8924-49f2-9b66-38c493969c36', 'Convenir du canal de communication discret le jour J', 8, 'normal'),
  ('05e36f13-ba40-4d5f-906c-081ee0f0f3c3', 'fc597208-39e9-47a4-b893-0f5e6059e166', 'S''assurer que Djahman a bien ouvert le fichier Excel référentiel', 0, 'normal'),
  ('0e6b9a04-7705-4d87-986b-00c0b4212aa5', 'fc597208-39e9-47a4-b893-0f5e6059e166', 'Lui transmettre les morceaux disponibles sur YouTube uniquement (hors Spotify)', 1, 'normal'),
  ('25ba5f73-5dcd-4db0-a2aa-fa8125b8e388', 'fc597208-39e9-47a4-b893-0f5e6059e166', 'Valider avec lui la structure de la soirée dansante : blocs, transitions, montée progressive', 2, 'normal'),
  ('17d680a2-e388-431a-8f1e-cefce4e8e54c', 'fc597208-39e9-47a4-b893-0f5e6059e166', 'Confirmer les morceaux « priorité à notre sélection » : Seggae, Salegy malgache, Bollywood, Pop indienne, Arabic', 3, 'normal'),
  ('e4beceb7-29c2-4e20-83ef-0cbb8f5a8f49', 'fc597208-39e9-47a4-b893-0f5e6059e166', 'Définir ensemble les musiques du cocktail et du repas', 4, 'normal'),
  ('1085e847-ebcc-45f7-8dbe-3359fc6fc9dd', 'fc597208-39e9-47a4-b893-0f5e6059e166', 'Obtenir ses recommandations pour l''éclairage soirée dansante', 5, 'normal'),
  ('1bbcaf04-5d34-44fe-be4c-16afdd751672', 'a536d69b-804d-43a8-a2f7-652b29f08005', 'Le MC est désigné et le micro-test est fait', 0, 'normal'),
  ('4c02532a-5ac5-4b7b-8cbd-1c62146a370e', '65feba68-7970-487c-a66a-e29650be42c3', 'Désigner un MC / coordinateur discours pour les transitions', 0, 'normal'),
  ('3ab8b1ad-c96c-4e26-99f1-772df9036dd5', '65feba68-7970-487c-a66a-e29650be42c3', 'Micro-test avec les parents', 1, 'normal'),
  ('ddbd04ca-6384-4466-8ddd-984a2c519444', '5bccb56f-51d9-4542-85a9-54ed65608fed', 'Tous les discours prévus ont eu lieu dans le timing imparti', 0, 'normal'),
  ('78cfa419-8dc3-42d1-965c-8f85b275c46f', 'e71dee72-7344-4876-9c68-2733f122eed5', 'Tester le micro et le retour son avant le premier discours', 0, 'normal'),
  ('64ce669d-8a1a-4c4c-bbf5-3e961ee3b5df', 'e71dee72-7344-4876-9c68-2733f122eed5', 'Coordonner avec le DJ la musique de fond éventuelle', 1, 'normal'),
  ('1d8bfdf2-702e-417b-a7fa-ba7a404b3fc2', 'e71dee72-7344-4876-9c68-2733f122eed5', 'Annoncer et remercier chaque intervenant avec fluidité', 2, 'normal'),
  ('36de82b6-8909-4668-b97a-b94453a7934f', 'e71dee72-7344-4876-9c68-2733f122eed5', 'Gérer le timing discrètement si un orateur dépasse', 3, 'normal'),
  ('baa603fb-231e-4b89-bb88-7895922fbbe6', 'e71dee72-7344-4876-9c68-2733f122eed5', 'S''assurer que chaque orateur a son texte (papier ou téléphone chargé)', 4, 'normal'),
  ('8062cdae-cacf-4d2c-a728-6d10548a334b', '8b2c6c2b-0063-42ee-9e6f-e387e9717d05', 'Le plan de table est validé, imprimé et affiché', 0, 'normal'),
  ('a2a39f68-0104-4054-8808-82e38a5542c3', '68c0ceb4-12af-4357-b0bf-2937dd5717ff', 'Récupérer auprès du Grand Arbre le nombre exact de tables et leur capacité', 0, 'high'),
  ('5d0bcd5d-9d94-40f9-8776-11ffe29dc282', '68c0ceb4-12af-4357-b0bf-2937dd5717ff', 'Réaliser un premier plan de table et le valider avec Sarah', 1, 'normal'),
  ('b98c6991-53cf-45ac-abad-a5fcf6646dc5', '68c0ceb4-12af-4357-b0bf-2937dd5717ff', 'Intégrer les contraintes : mobilité réduite, personnes âgées, enfants, affinités / tensions', 2, 'normal'),
  ('f843a665-ba73-4881-9f9b-5c809532d77f', '68c0ceb4-12af-4357-b0bf-2937dd5717ff', 'Créer les marque-places pour le plat et numéros de table', 3, 'normal'),
  ('a084b155-288b-4849-8a93-1ddd60c17287', '68c0ceb4-12af-4357-b0bf-2937dd5717ff', 'Imprimer le plan de table pour affichage à l''entrée de la salle', 4, 'normal'),
  ('a408a2d5-4cc1-432a-a63d-cf634d17db63', 'c01e0b03-40e0-4727-b11b-c46155b7c89a', 'La décision est prise et, si applicable, le cadeau est prêt pour le jour J', 0, 'normal'),
  ('8dc6908b-113d-4547-b97f-94932398da76', 'c1e08713-0de6-4ab4-9d60-2474c5e1ea11', 'Décider si on prévoit un cadeau / attention pour les parents', 0, 'normal'),
  ('145ebc6f-4a57-47a5-aece-5aa3c7e6e437', 'c1e08713-0de6-4ab4-9d60-2474c5e1ea11', 'Si oui : choisir le type, commander avec délai compatible, organiser la distribution le jour J', 1, 'normal'),
  ('86a5f58a-6ba8-49b3-9e67-bb871c300c15', '70b824d2-7b07-4103-951b-b108e5ea99f7', 'Chaque membre du cortège connaît son rôle et l''a répété', 0, 'normal'),
  ('77b846b3-e648-4cc9-a7dd-05e586dc9ca8', '69fdd079-9ed4-48d8-b43c-7914777a123a', 'Définir la composition et l''ordre du cortège', 0, 'normal'),
  ('3ee004ef-9c9e-4d2d-b559-d1c3b87d23b6', '69fdd079-9ed4-48d8-b43c-7914777a123a', 'Prévenir chaque personne du cortège de son rôle et de ce qu''elle devra faire', 1, 'high'),
  ('37a1128a-fe8a-4f1e-931b-d7c47eed6943', '69fdd079-9ed4-48d8-b43c-7914777a123a', 'Choisir et synchroniser les musiques d''entrée avec Djahman', 2, 'normal'),
  ('e2c0f411-11ed-4f19-a722-f2b2de5eb0e6', '69fdd079-9ed4-48d8-b43c-7914777a123a', 'Prévoir les alternatives pour les personnes à mobilité réduite', 3, 'normal'),
  ('9f5cff8e-7bc2-414b-81f7-3f2bda370ac7', '69fdd079-9ed4-48d8-b43c-7914777a123a', 'Trouver un plateau de présentation et l''orner', 4, 'normal'),
  ('34a19082-f84f-4e6a-97e0-8678dafee61a', 'e5c8b08b-969e-4d01-ad75-8d33ce5aec20', 'Le cortège s''est déroulé dans l''ordre prévu, à l''heure prévue', 0, 'normal'),
  ('45c8d9de-bdcd-417a-89b9-191adf2e485f', 'bcc9be04-bb9b-42ef-902e-fbf7327dda75', 'Rassembler les membres du cortège à 17h20', 0, 'normal'),
  ('f7c11c62-c747-45a1-b20b-dd770fce326c', 'bcc9be04-bb9b-42ef-902e-fbf7327dda75', 'Vérifier que chacun connaît sa place et son rôle', 1, 'normal'),
  ('1bcfdece-c0bb-434e-ab9b-684f42aee427', 'bcc9be04-bb9b-42ef-902e-fbf7327dda75', 'Coordonner avec le DJ le signal de lancement de la musique d''entrée', 2, 'normal'),
  ('b98f3c68-621a-4fda-879b-aa279579adeb', 'bcc9be04-bb9b-42ef-902e-fbf7327dda75', 'Donner le signal de départ au premier rang du cortège', 3, 'normal'),
  ('36311a2c-361d-4df2-9c8f-f6a7c58e35aa', 'bcc9be04-bb9b-42ef-902e-fbf7327dda75', 'Briefer le photographe sur le déroulé du cortège juste avant', 4, 'normal'),
  ('c8344183-2207-4d08-93b1-15554a376eff', '87817fe9-1af6-4e25-b9c9-a4ab40143efd', 'Une répétition a eu lieu avec les intervenants clés', 0, 'normal'),
  ('895f532f-ada4-49b3-8344-475192447c17', '4f8fa0b1-d064-4f5e-b8f3-379caf244c51', 'Organiser une répétition du déroulé avec les intervenants clés de la cérémonie', 0, 'normal'),
  ('f98482a6-f623-40ca-9f64-5f84195d4113', '1984b1fd-c247-4e42-bde5-2d4af2929b9c', 'Toutes les spécialités sont commandées ou leurs ingrédients achetés', 0, 'normal'),
  ('7c8d8372-7c7c-4e01-94fe-475e4e296598', '1984b1fd-c247-4e42-bde5-2d4af2929b9c', 'Le planning de préparation (qui/où/quand) est clair', 1, 'normal'),
  ('a9ec84c0-e47c-42b6-9671-9d2ce237dde7', '92c7bd3d-bf11-4849-9889-5ef70d69eeec', 'Commander la spécialité indienne — identifier le prestataire, quantités, date de livraison', 0, 'normal'),
  ('6ed3fe90-4c04-471e-95ab-714e77d345df', '92c7bd3d-bf11-4849-9889-5ef70d69eeec', 'Formaliser une recette et voir les quantités pour la spécialité malgache', 1, 'normal'),
  ('2c4ec514-6783-42cf-9fd4-8feeaf2d7241', '92c7bd3d-bf11-4849-9889-5ef70d69eeec', 'Acheter les épices et couper les ingrédients de la spécialité malgache (ail, tomates, oignons, cressons)', 2, 'normal'),
  ('aad476f3-67bd-4874-9e8d-74409c3bbfef', '92c7bd3d-bf11-4849-9889-5ef70d69eeec', 'Valider avec Christiana qu''on peut préparer les mini bokits guadeloupéens à la maison', 3, 'normal'),
  ('094cd312-9354-4c67-945d-8cf8f77f28d5', '92c7bd3d-bf11-4849-9889-5ef70d69eeec', 'Acheter les ingrédients et proposer 3 garnitures (jambon halal/fromage, poulet, thon)', 4, 'normal'),
  ('79d1ebc3-084e-426e-b3f1-4b55d159e600', '92c7bd3d-bf11-4849-9889-5ef70d69eeec', 'Commander les bonbons piments réunionnais', 5, 'normal'),
  ('fe067a97-e680-41a3-8da3-9231dd2e941e', 'e7a01feb-78e9-4aec-ab11-258584f545f4', 'Acheter une grande marmite adaptée à la friture en grande quantité (40 cm)', 0, 'normal'),
  ('7789710c-df57-4834-b787-abe2c8514397', 'e7a01feb-78e9-4aec-ab11-258584f545f4', 'Prévoir des boîtes de transport adaptées (friture et spécialités fragiles) — 30 cartons alimentaires', 1, 'normal'),
  ('c3566256-8304-4420-8e04-8762d05b4649', 'e7a01feb-78e9-4aec-ab11-258584f545f4', 'Planifier qui prépare quoi, où et quand (veille ou matin du jour J)', 2, 'normal'),
  ('21eeb1d1-2d23-4993-924b-790e212721c8', 'a7b9e9d5-a102-4863-8828-352d693e1599', 'Toutes les spécialités sont réceptionnées, préparées et conditionnées pour le transport', 0, 'normal'),
  ('5395e485-e415-438f-9130-ff7d7e98e699', 'b9a11064-d0ef-407f-89c9-8e0b473a3c9a', 'Réceptionner les spécialités malgaches et indiennes commandées — vérifier conformité', 0, 'normal'),
  ('eb91857c-6adf-48b8-a992-35b11200e684', '9d1807ee-c307-4807-a716-f4dba28aad3b', 'Superviser la préparation des spécialités guadeloupéennes à la maison', 0, 'normal'),
  ('d7b0d670-b299-4b8e-8e3a-a8aefae2d59c', '9d1807ee-c307-4807-a716-f4dba28aad3b', 'Préparer les fritures en grande quantité avec la marmite dédiée', 1, 'normal'),
  ('583aea7d-b39b-4ffa-b733-676fab019e78', '9d1807ee-c307-4807-a716-f4dba28aad3b', 'Conditionner toutes les spécialités dans les boîtes de transport adaptées', 2, 'normal'),
  ('e2751971-cd70-4d5a-b390-d8ede22f2cb9', '9d1807ee-c307-4807-a716-f4dba28aad3b', 'S''assurer que tout est prêt et conditionné pour le lendemain matin', 3, 'normal'),
  ('c9c61481-1d37-44ab-b0fe-ce2fc6bbf128', '9d1807ee-c307-4807-a716-f4dba28aad3b', 'Ranger dans un endroit frais et sécurisé jusqu''au transport le jour J', 4, 'normal'),
  ('a8062d9d-c632-41a5-9a49-73a0b7759698', '324d22c2-3bb9-4cec-a56e-07cd93b6e94f', 'Toutes les spécialités sont arrivées sur le lieu, complètes et conformes', 0, 'normal'),
  ('d5aa8c01-4ed0-40d0-83bc-b323bd27f569', '08e3d447-f9a6-49df-8930-58feabe23a98', 'Acheminer les spécialités maison (fritures, guadeloupéen) vers le lieu de réception', 0, 'normal'),
  ('beb02f12-2be2-483b-961f-561fee2c4822', '08e3d447-f9a6-49df-8930-58feabe23a98', 'Vérifier que toutes les commandes sont complètes et conformes à la réception', 1, 'normal'),
  ('fa26431e-34e5-4816-8d1a-ebb091673ccf', '6f045b46-234c-4553-805f-20e66e8d7be9', 'Le stock de boissons est connu et à jour', 0, 'normal'),
  ('e9cd2bd5-e878-4a0a-aadd-9737daa58c8e', '6f045b46-234c-4553-805f-20e66e8d7be9', 'Un référent boissons jour J est désigné', 1, 'normal'),
  ('31cd00df-97ac-4586-ae89-d8d5efad3bac', 'bbaf5f73-c7ba-4190-bfbb-d447b76dc59d', 'Maintenir le fichier Excel du stock local (63 bouteilles champagne + despé, eau, jus, coca) à jour', 0, 'normal'),
  ('f083d956-de2d-47fb-be5e-5f92300f3f76', 'bbaf5f73-c7ba-4190-bfbb-d447b76dc59d', 'Calculer la quantité de glace nécessaire pour tenir jusqu''à 4h en plein été', 1, 'normal'),
  ('531c2dc9-f241-4ff6-8f3f-d827a5f25d99', 'bbaf5f73-c7ba-4190-bfbb-d447b76dc59d', 'Louer ou acheter le matériel bar pour la période 1h-4h : glacières, bacs à glaçons, seaux, pinces', 2, 'normal'),
  ('df2d3be6-31b0-4552-868f-5e2c478e5b25', '643443dc-55f7-4502-8ee3-b33a2b424106', 'Désigner le responsable boissons jour J', 0, 'normal'),
  ('002d16c4-a79d-4f69-962a-e5c64f316236', '643443dc-55f7-4502-8ee3-b33a2b424106', 'Louer un utilitaire pour le transport des boissons la veille', 1, 'normal'),
  ('22d6d1e9-590d-458c-b9a3-721985ac0a1f', '643443dc-55f7-4502-8ee3-b33a2b424106', 'Recruter des cousins pour aider au chargement et au déchargement', 2, 'normal'),
  ('7b790837-b2ca-4a3b-bd08-eb65cb05ec3f', 'bb99f21f-d1e5-496a-97f2-c3f18bb05dac', 'Toutes les boissons sont arrivées, stockées et mises au froid', 0, 'normal'),
  ('5da9da8a-eb7d-4be1-af75-6476625c93c7', 'bb99f21f-d1e5-496a-97f2-c3f18bb05dac', 'Le matériel bar de relais est en place', 1, 'normal'),
  ('8e5b0c06-5a25-4d56-a67b-a5e863f82315', '39f285f9-3459-4e92-bb00-29885d1da6fd', 'Récupérer l''utilitaire loué tôt le matin', 0, 'normal'),
  ('b94e735c-36c8-4123-8270-79b560eff10c', '39f285f9-3459-4e92-bb00-29885d1da6fd', 'Organiser le chargement depuis le local avec les cousins mobilisés', 1, 'normal'),
  ('371517b6-f424-40df-9812-4c6d8aaca54e', '39f285f9-3459-4e92-bb00-29885d1da6fd', 'Acheminer les boissons au Grand Arbre', 2, 'normal'),
  ('7a3b5d2a-5e5c-4779-a998-f38deb07342c', 'a4f60243-394f-4ce2-a9c4-0f7231e55e3b', 'Superviser le déchargement et le rangement dans l''espace prévu', 0, 'normal'),
  ('592c0b36-d3e6-421f-8c82-6ec858d614dc', 'a4f60243-394f-4ce2-a9c4-0f7231e55e3b', 'Organiser la mise au froid : champagne, despé, jus, coca dans les glacières / frigo du lieu', 1, 'normal'),
  ('18b97765-9434-4176-8a70-7352b867769f', 'a4f60243-394f-4ce2-a9c4-0f7231e55e3b', 'Ranger et sécuriser le matériel bar de relais (glacières supplémentaires, seaux, pinces)', 2, 'normal'),
  ('031b4961-8431-4049-807d-9aef62cfd114', 'a4f60243-394f-4ce2-a9c4-0f7231e55e3b', 'Vérifier les quantités à l''arrivée vs le fichier Excel de stock', 3, 'normal'),
  ('602ace8b-ee42-4b69-979c-5eb7edd0e65c', 'a4f60243-394f-4ce2-a9c4-0f7231e55e3b', 'Vérifier que le champagne est bien au froid pour le lendemain dès 17h', 4, 'normal'),
  ('c14b641e-26bc-4806-8486-24acf2e9fb74', '8a9f7cb4-5c15-4a9d-bb95-37ec89ff858d', 'Le bar a été tenu sans interruption jusqu''à 4h', 0, 'normal'),
  ('82e55cde-2fcb-4ab1-89bf-ba88bb4caea7', '8a9f7cb4-5c15-4a9d-bb95-37ec89ff858d', 'Les glacières ont été réapprovisionnées toute la soirée', 1, 'normal'),
  ('2f529dd5-b62c-45d9-a464-5bcdb450c0f0', 'b296cf7d-2679-4ae3-8a1b-2099f4e2eaa3', 'Vérifier à l''ouverture que les boissons d''accueil sont en place et au froid', 0, 'normal'),
  ('633ceef9-3058-4310-8d41-26b5c9053fc5', 'b296cf7d-2679-4ae3-8a1b-2099f4e2eaa3', 'Superviser le service des boissons pendant le cocktail', 1, 'normal'),
  ('4035e965-a196-4b62-b7c9-b41c5e38a862', 'b296cf7d-2679-4ae3-8a1b-2099f4e2eaa3', 'S''assurer que les tables sont régulièrement resservies en eau et boissons pendant le dîner', 2, 'normal'),
  ('b92e96d4-486f-44a7-ba96-03f77f0bf2fb', '2965ebaa-c1d2-4598-ad04-936f5cde5170', 'Prendre le relais du bar officiel à 01h00 avec le matériel préparé', 0, 'normal'),
  ('8baf4839-5d47-4c09-8424-b3792218cedf', '2965ebaa-c1d2-4598-ad04-936f5cde5170', 'Gérer le réapprovisionnement des glacières avec de la glace jusqu''à 04h00', 1, 'normal'),
  ('aadceb4d-2733-4a96-9b2a-906071183b6e', '1b2c4c48-bf45-4fde-bb3f-3874d80daefc', 'Le système d''identification des restrictions alimentaires est en place et connu de l''équipe de service', 0, 'normal'),
  ('b923945a-28af-4223-8d0d-8e7567f746e6', '15afe7c7-bfcc-49e6-899c-3a09c228a63f', 'Définir le système d''identification à table : marque-place codé, étiquette discrète, etc.', 0, 'normal'),
  ('86b5c09e-a4b7-4cb8-8c39-7043c433ab3b', '15afe7c7-bfcc-49e6-899c-3a09c228a63f', 'Signaler les allergies sévères (arachides, fruits de mer) à l''ensemble de l''équipe de service', 1, 'normal'),
  ('249e5393-ded1-4b1f-9ca5-3f157fa86626', '15afe7c7-bfcc-49e6-899c-3a09c228a63f', 'Préparer la signalétique pour les plats des buffets et amuse-bouches (allergènes, halal, végé, etc.)', 2, 'normal'),
  ('26ab695c-9e8c-4796-b03b-0c62268ddb03', '0653e42f-2d95-4a6e-b53f-0496e3ea552c', 'Aucun incident lié aux restrictions alimentaires n''a été signalé pendant le service', 0, 'normal'),
  ('56e5439a-b70d-414e-8632-63cb22a8c9d4', '81f8c962-f444-427c-b0c6-ef8d49d986c1', 'Vérifier que les plats spéciaux (restrictions alimentaires) sont signalés pour le service', 0, 'normal'),
  ('94bb568f-634a-4e6f-8fea-fae181baa1f6', '2292ee9d-d887-449e-b581-2eaf1f6417d3', 'Le plan de décoration par zone est finalisé', 0, 'normal'),
  ('8321510c-b2a7-41d9-9900-799663f74cf3', '2292ee9d-d887-449e-b581-2eaf1f6417d3', 'Tous les éléments déco sont commandés ou achetés', 1, 'normal'),
  ('b1175e6c-1ce7-499a-a2ba-8b207a2f17d7', '2292ee9d-d887-449e-b581-2eaf1f6417d3', 'Le fleuriste est confirmé', 2, 'normal'),
  ('2a5b7a15-95b8-4e6d-8a55-d1d762b4b9cb', 'ee864cfd-2f4e-423f-a5b6-f589758c3c02', 'Définir le thème visuel et la palette de couleurs', 0, 'normal'),
  ('dd5bdca2-2153-405c-a8ce-6493d0e00777', 'ee864cfd-2f4e-423f-a5b6-f589758c3c02', 'Lister les éléments déco par zone : entrée, cortège, table d''honneur, tables invités, espace danse', 1, 'normal'),
  ('356b9296-948d-454f-b95c-326b60f9ceea', 'ee864cfd-2f4e-423f-a5b6-f589758c3c02', 'Créer le plan de décoration par zone avec photos de référence', 2, 'normal'),
  ('db3ddbf3-e2cc-4e92-930a-63197bda4dcf', 'd15a4a45-fc3b-4a13-be16-2b8139f9203b', 'Contacter et choisir un fleuriste', 0, 'normal'),
  ('beece649-b899-4a76-859e-906922a98af7', 'd15a4a45-fc3b-4a13-be16-2b8139f9203b', 'Valider les compositions florales et les tarifs', 1, 'normal'),
  ('b6ba8905-5e8b-4789-9feb-54b8c91fa856', 'd15a4a45-fc3b-4a13-be16-2b8139f9203b', 'Confirmer la livraison des fleurs : heure, lieu, référent sur place', 2, 'normal'),
  ('a369fa57-9e64-4c77-8ddf-1759dcf8885c', '9f2f4260-de6d-4e26-829f-19ba6b4419e2', 'Comparer achat / location / DIY pour chaque élément et arbitrer', 0, 'normal'),
  ('5656fc00-c9ba-4a35-99c8-785d185c5ce9', '9f2f4260-de6d-4e26-829f-19ba6b4419e2', 'Commander ou acquérir tous les éléments déco avec délais de livraison compatibles', 1, 'high'),
  ('dfc0266a-3966-4c80-aea2-479116efc5a8', 'ab8fb34c-4b35-42f9-9213-9aa94fe9502b', 'La décoration est entièrement installée et validée par photo avec les fiancés', 0, 'normal'),
  ('f9c4d1ef-8193-4c80-a6db-9e4739578f5c', '091c3a1a-974b-4642-a08b-f97862d1721b', 'Installer les éléments structurants en premier : backdrop, arches, nappes', 0, 'normal'),
  ('ebf320a8-b825-4996-8611-9cc6f7f80b51', '091c3a1a-974b-4642-a08b-f97862d1721b', 'Disposer la décoration de table : centres de table, marque-places, bougies, numéros', 1, 'normal'),
  ('c96dd22b-ef29-4ae2-bc32-51ec5d0df2a9', '091c3a1a-974b-4642-a08b-f97862d1721b', 'Installer la signalétique : plan de table à l''entrée, panneau bienvenue, numéros de table', 2, 'normal'),
  ('867fc902-05a5-4651-9382-3717306d6930', '091c3a1a-974b-4642-a08b-f97862d1721b', 'Tester et ajuster l''éclairage décoratif', 3, 'normal'),
  ('5d73e946-1e05-478e-a3b8-4bd9445ff825', '091c3a1a-974b-4642-a08b-f97862d1721b', 'Préparer les panneaux de signalétique parking', 4, 'normal'),
  ('0d41bce8-f28f-452a-a0fa-4479b6b37a85', '05449475-b0b3-44fc-9933-a143f510b8b1', 'Réceptionner les compositions florales du fleuriste', 0, 'normal'),
  ('bb66fb7c-c156-4925-ae45-42089b232c80', '05449475-b0b3-44fc-9933-a143f510b8b1', 'Vérifier que les compositions sont conformes à la commande', 1, 'normal'),
  ('bca92ab2-0f18-4004-a198-bfab41633a9a', '05449475-b0b3-44fc-9933-a143f510b8b1', 'Mettre de l''eau dans les vases si livraison anticipée', 2, 'normal'),
  ('b7eb08a0-f130-4c1a-a4fa-3c628b68b517', '05449475-b0b3-44fc-9933-a143f510b8b1', 'Photographier la salle terminée (à envoyer aux fiancés pour validation)', 3, 'normal'),
  ('62868180-632c-4a0f-8333-d427b695ca2d', '05449475-b0b3-44fc-9933-a143f510b8b1', 'Confirmer que le plan de décoration par zone est imprimé ou accessible', 4, 'normal'),
  ('f61d9742-a527-4f1c-87de-85d46efe6a4c', '664f4264-3aac-4c86-a491-4ed0abdbdce5', 'La décoration est entièrement démontée et le lieu est remis en état', 0, 'normal'),
  ('28b3a3ad-c50f-41af-8977-16949e293075', '4bc68658-b32e-43c1-a466-009b43ca5fa8', 'Démonter les éléments de décoration', 0, 'normal'),
  ('b873cc65-a358-4347-b44c-5e54f5c83b1b', '4bc68658-b32e-43c1-a466-009b43ca5fa8', 'Trier : éléments loués à rendre vs éléments achetés à conserver', 1, 'normal'),
  ('99613794-e56b-48da-bafc-ec7db5ecf318', '4bc68658-b32e-43c1-a466-009b43ca5fa8', 'Emballer soigneusement les compositions florales à conserver si souhaité', 2, 'normal'),
  ('1c491826-8ba4-40f7-bd32-3539c9214911', '4bc68658-b32e-43c1-a466-009b43ca5fa8', 'S''assurer que le lieu est remis dans son état initial (mobilier replacé, nappes retirées, etc.)', 3, 'normal'),
  ('c821f38d-ccfd-4aeb-8751-6bee5b05803c', '5aa05e72-d338-4ee0-9d37-1ec21d54f0d4', 'Tous les éléments loués sont retournés', 0, 'normal'),
  ('1ea77084-e702-4b70-81d5-cf81a9e93c9d', '5aa05e72-d338-4ee0-9d37-1ec21d54f0d4', 'Le devenir des fleurs est décidé', 1, 'normal'),
  ('474757a0-e2db-4836-bef3-c3dbc4c7ff69', '79fda52f-e74e-4afd-83cf-3ccdda37b30e', 'Retourner les derniers éléments de location si pas encore fait', 0, 'normal'),
  ('5384d0ad-5847-4a6e-9dd3-15f7ad53e53e', '79fda52f-e74e-4afd-83cf-3ccdda37b30e', 'Décider du devenir des compositions florales (conserver, offrir, jeter)', 1, 'normal'),
  ('d6ed665f-0c6d-41b0-a3b7-3c9863a1d88c', '969778f5-bc25-4c79-bcf5-32057355dead', 'La shot list est rédigée et partagée avec le photographe', 0, 'normal'),
  ('32825793-7d71-42d4-8da8-4fdb94867932', '969778f5-bc25-4c79-bcf5-32057355dead', 'Le groupe de contact jour J est créé', 1, 'normal'),
  ('93d47650-c801-4395-9618-ad008a7f1ae7', '342b560f-6cbe-43ce-8960-94712c58511f', 'Créer le groupe WhatsApp — ajouter les deux numéros + contact du photographe', 0, 'high'),
  ('480a1a63-1f4b-4e80-a176-b3a15e7b312f', '342b560f-6cbe-43ce-8960-94712c58511f', 'Partager le déroulé de la journée dans le groupe dès qu''il est finalisé', 1, 'normal'),
  ('32b15cbc-fefa-4d2e-b86a-12e01e761820', '342b560f-6cbe-43ce-8960-94712c58511f', 'Rassembler des inspirations photo/vidéo (style, ambiance, cadrage) à partager', 2, 'normal'),
  ('71b0cf69-c2bf-4de3-a122-b71bfe98f05e', 'c1eb784f-aa9e-445b-bc3c-815b96276251', 'Rédiger la shot list : photos indispensables, familles, moments clés, portraits officiels', 0, 'normal'),
  ('89db6a76-12f5-4d65-9343-0edface9de88', 'c1eb784f-aa9e-445b-bc3c-815b96276251', 'Confirmer l''heure d''arrivée souhaitée (avant les invités pour salle vide + préparatifs)', 1, 'normal'),
  ('ef430268-be95-4238-92d7-917f75925b34', 'c1eb784f-aa9e-445b-bc3c-815b96276251', 'Prévenir les familles en amont : limiter les téléphones pendant la cérémonie', 2, 'normal'),
  ('a45ba906-51ea-4f7a-a5bb-42795aa9fa3a', 'd4398ece-d9f1-4dbe-84aa-a9a5a1a83ba5', 'Les photos du prestataire sont récupérées et sauvegardées', 0, 'normal'),
  ('3a2f7300-15ca-45de-9c0a-ea89572b0dda', 'd4398ece-d9f1-4dbe-84aa-a9a5a1a83ba5', 'Un lien de partage est diffusé aux invités', 1, 'normal'),
  ('6cc951d5-e407-425b-afdf-5bce0872354a', '729e83f7-2eb3-4ac5-97bb-98ac20d25966', 'Confirmer les délais de livraison des photos/vidéos avec le prestataire', 0, 'normal'),
  ('dedaa52c-6a58-4fc3-a858-4984602d4223', '729e83f7-2eb3-4ac5-97bb-98ac20d25966', 'Partager un lien (Google Photos, WeTransfer, etc.) pour que les invités y déposent leurs propres photos', 1, 'normal'),
  ('a412604e-89d6-481c-8105-4e900309ce47', '729e83f7-2eb3-4ac5-97bb-98ac20d25966', 'Récupérer et sauvegarder les photos du prestataire dès réception', 2, 'normal'),
  ('79dbdb90-bbb9-4a7d-b561-55e85e085661', '729e83f7-2eb3-4ac5-97bb-98ac20d25966', 'Partager une sélection de photos avec les familles et proches', 3, 'normal'),
  ('c3b55629-1349-468f-a0f5-afd6460bdc1f', '22472f3f-69d7-4ebd-893b-c4c52753fc4b', 'L''espace enfants est prêt à être installé, le menu enfants est confirmé', 0, 'normal'),
  ('aca4e226-e817-46d9-bd60-520880b34035', '358203ee-a7b6-4feb-a4b4-e73b43976958', 'Recenser le nombre d''enfants présents et leurs âges', 0, 'normal'),
  ('70d236e0-5238-43a3-9ecb-d2de4f1023c2', '358203ee-a7b6-4feb-a4b4-e73b43976958', 'Prévoir le contenu de l''espace enfants : jeux, coloriages, tapis', 1, 'normal'),
  ('7024dad8-36da-49f6-8bde-99bcaa2c44b1', '358203ee-a7b6-4feb-a4b4-e73b43976958', 'Confirmer avec le traiteur le menu enfants et les horaires adaptés', 2, 'normal'),
  ('f0db1462-57c5-4d19-ba9c-a933ff60dc61', '7069149b-6e27-4cb8-a310-dc3cb684cc07', 'Aucun incident concernant les enfants n''a été signalé pendant la soirée', 0, 'normal'),
  ('d59f84b5-9454-47bf-b343-6349f7ac19e5', 'b88745fd-0951-4989-8cbe-ab2771e11ccf', 'Installer et ouvrir l''espace enfants (jeux, coloriages) avant leur arrivée', 0, 'normal'),
  ('9b430d19-66c4-4baa-81b9-f0afdcb7eba2', 'b88745fd-0951-4989-8cbe-ab2771e11ccf', 'Superviser les enfants pendant les discours et moments adultes', 1, 'normal'),
  ('8b7ed4a5-1244-42ab-8005-8c22a233ca59', 'b88745fd-0951-4989-8cbe-ab2771e11ccf', 'Veiller à ce qu''ils dînent à l''heure adaptée', 2, 'normal'),
  ('ce416d9a-28b6-44d1-8312-66b48699fe7e', 'b88745fd-0951-4989-8cbe-ab2771e11ccf', 'Anticiper les départs des familles avant minuit', 3, 'normal'),
  ('95bbe6d2-7a61-4129-a9c3-1b6cf83d32a6', '8b25d42a-3238-488d-8658-42268f2d2fe5', 'Le placement des personnes âgées est prévu et accessible', 0, 'normal'),
  ('9cf20d0f-22f3-4d6d-82d4-362dd7cb2582', '8a03d0f9-9c39-48a9-a6ce-55e8060bd6da', 'Identifier les personnes âgées ou à mobilité réduite dans la liste des invités', 0, 'normal'),
  ('5df17705-728c-4b3f-94a7-7558ccecb355', '8a03d0f9-9c39-48a9-a6ce-55e8060bd6da', 'Prévoir leur placement à une table accessible : proche sortie, sanitaires, sans marche', 1, 'normal'),
  ('0340a9ef-af88-440b-bb7d-31edd1cbb54d', '8a03d0f9-9c39-48a9-a6ce-55e8060bd6da', 'Anticiper leur départ anticipé et prévoir un transport si nécessaire', 2, 'normal'),
  ('9a445c45-712b-47b8-a0ca-84ff47f3b063', '6d88895e-5317-4613-a879-e3c4bf1c77f2', 'Aucun incident de confort ou de santé non géré n''a été signalé', 0, 'normal'),
  ('fc582ced-3a21-4011-aec7-6b34ef1f3e86', '3b159aab-67c2-4df0-90f1-f98b1868f2e6', 'S''assurer que les personnes âgées sont bien placées à leur table à l''installation dans la salle', 0, 'normal'),
  ('8dccc8bc-7d4b-435d-ab9f-c039a71aa35a', '3b159aab-67c2-4df0-90f1-f98b1868f2e6', 'Vérifier leur confort régulièrement (chaleur, volume sonore, accès aux sanitaires)', 1, 'normal'),
  ('9913d567-e777-4801-9d45-b69159da42cd', '3b159aab-67c2-4df0-90f1-f98b1868f2e6', 'Organiser leur départ anticipé et leur transport si nécessaire', 2, 'normal'),
  ('6041903b-df0d-48f2-b654-ae21b5b2ec2d', '3b159aab-67c2-4df0-90f1-f98b1868f2e6', 'Alerter le coordinateur général si un problème de santé survient', 3, 'normal'),
  ('d9edcd66-5351-43b1-ac20-16517ec12d93', '56288eb5-cf2d-4f1f-87ad-4255a8aa2b0f', 'La boîte à urgences est complète et prête pour le jour J', 0, 'normal'),
  ('6e34f9b0-a3a4-4b5e-aed4-435a628d0298', '255ff81a-0e8f-4093-a17e-d74833335a0f', 'Constituer la boîte à urgences : ruban adhésif, épingles, médicaments de base, chargeur, monnaie, anti-moustiques', 0, 'normal'),
  ('5bc31555-07a6-449c-9c10-b350421df814', '255ff81a-0e8f-4093-a17e-d74833335a0f', 'Préparer le kit couture / tenue de rechange pour incidents vestimentaires', 1, 'normal'),
  ('898a7782-4229-4f30-8739-37453d6e28c9', '255ff81a-0e8f-4093-a17e-d74833335a0f', 'Compiler la liste des contacts d''urgence : prestataires, propriétaire du lieu, médecin', 2, 'normal'),
  ('3ab26eb8-5ee0-42aa-976b-a05e2faa6440', '468a1cf5-cee3-4b38-8fb1-91c2f7f4b026', 'Aucun imprévu n''a nécessité d''escalade non gérée', 0, 'normal'),
  ('85bde186-c48a-46da-a070-5df3346e2740', 'bd7a57a1-e51f-46b2-90f3-9d972ef254f4', 'Avoir la boîte à urgences accessible toute la soirée', 0, 'normal'),
  ('a68b4dba-bdcb-4acf-9430-1274d96ed197', 'bd7a57a1-e51f-46b2-90f3-9d972ef254f4', 'Gérer les incidents vestimentaires (kit couture)', 1, 'normal'),
  ('a465203a-5ae4-4b7c-9b69-65a1f73bfd9f', 'bd7a57a1-e51f-46b2-90f3-9d972ef254f4', 'Avoir sous la main les contacts d''urgence (prestataires, propriétaire du lieu, médecin)', 2, 'normal'),
  ('739e6a5f-aa58-4800-8b55-52cb4377da99', 'bd7a57a1-e51f-46b2-90f3-9d972ef254f4', 'Prendre les décisions rapidement selon le protocole établi en amont', 3, 'normal'),
  ('f046819b-a86e-47bc-9903-4eed9c5b58e2', 'bd7a57a1-e51f-46b2-90f3-9d972ef254f4', 'Remonter uniquement ce qui nécessite une décision des fiancés', 4, 'normal'),
  ('96c13476-22f1-4d52-a930-7bb4611aa9da', 'bd7a57a1-e51f-46b2-90f3-9d972ef254f4', 'Surveiller les prévisions météo et relayer un plan B intérieur si besoin', 5, 'normal'),
  ('f587b80e-bdb9-4036-83d7-03752bdb0115', 'c2df5bea-00e3-42df-ab5d-6052325ee60c', 'Tout le matériel manquant est réservé auprès d''un loueur', 0, 'normal'),
  ('51bf2a54-8acf-4985-a486-ceb62aa7dd35', '09d576a3-5a09-4cb4-bb77-9326279e7e96', 'Lister tout le matériel à louer : jeux de lumières, glacières supplémentaires, panneaux de signalétique, mobilier éventuel', 0, 'high'),
  ('adad1784-e566-4507-a88d-b7793948e5e3', '09d576a3-5a09-4cb4-bb77-9326279e7e96', 'Confirmer avec Djahman ce qu''il apporte en éclairage et ce qui reste à prévoir', 1, 'normal'),
  ('d7bc7d39-d512-4989-bf06-3facc0b6b0c0', '09d576a3-5a09-4cb4-bb77-9326279e7e96', 'Arbitrer : acheter vs louer pour chaque élément (glacières, panneaux, etc.)', 2, 'normal'),
  ('157d7662-ac76-4f7c-9c4f-28b98d9aa384', '7e365950-9419-4c1d-910d-0704ea9fbf0c', 'Demander des devis pour la location du matériel lumière manquant', 0, 'normal'),
  ('a0d715ee-6f46-4568-b0f1-f94b93d6162c', '7e365950-9419-4c1d-910d-0704ea9fbf0c', 'Réserver le matériel auprès d''un loueur — délais serrés en plein été, ne pas attendre', 1, 'high'),
  ('8f90402e-ad96-4339-8968-45c5dbca0e49', 'f9130305-f48d-490c-a38c-77791259bc62', 'Tout le matériel loué est restitué dans les délais, sans dommage signalé', 0, 'normal'),
  ('941a613d-c64a-448e-9bb3-a262537fd382', '1d0d7b17-ea33-400a-acc4-651c3a1e09ad', 'Superviser le rangement en suivant la liste de colisage établie en amont', 0, 'normal'),
  ('c92193ad-454d-4600-80c1-546437603c36', '1d0d7b17-ea33-400a-acc4-651c3a1e09ad', 'Trier les éléments : à rendre (location), à conserver, à jeter', 1, 'normal'),
  ('d8ef0d47-eb32-4123-9aec-bdebd5d2c2b9', '1d0d7b17-ea33-400a-acc4-651c3a1e09ad', 'Vérifier que rien n''est oublié sur place : vêtements, cadeaux, matériel photo, effets personnels', 2, 'normal'),
  ('d79dd88a-2414-4ca6-8195-e3e2f0c12a32', '1d0d7b17-ea33-400a-acc4-651c3a1e09ad', 'Prévoir des sacs poubelle pour le tri final des déchets', 3, 'normal'),
  ('70d24414-87ab-45c5-85d7-0b834e67b308', 'f57476f6-0733-4846-8ae1-dc06be1a1f6f', 'Emballer et étiqueter les caisses pour un retour organisé', 0, 'normal'),
  ('405058af-5a41-4b97-bc7a-f17894b31253', 'f57476f6-0733-4846-8ae1-dc06be1a1f6f', 'Retourner le matériel loué dans les délais contractuels', 1, 'normal'),
  ('8829870e-d11f-40f6-9ccb-1dc72e184090', 'f57476f6-0733-4846-8ae1-dc06be1a1f6f', 'Rendre l''utilitaire loué si pas déjà fait la nuit précédente', 2, 'normal'),
  ('d18faa1f-ceb0-423f-b67c-20366770c971', 'f57476f6-0733-4846-8ae1-dc06be1a1f6f', 'Ramener le matériel personnel à la maison', 3, 'normal'),
  ('6b0c1e6e-dd62-494c-aa91-0dea4fd008da', 'e6982603-d9b4-449b-8814-70e846666c8b', 'La restitution du matériel loué est confirmée sans litige', 0, 'normal'),
  ('b654cd56-9c4a-4edf-bac8-9f6a214130e0', 'e6982603-d9b4-449b-8814-70e846666c8b', 'Le devenir du stock restant est décidé', 1, 'normal'),
  ('f52757f4-0ffc-4847-a0dc-2ebeadd932d3', '19cdb7a2-af5c-4153-9e17-3675ca253be8', 'Vérifier que tout le matériel loué a bien été restitué dans les délais', 0, 'normal'),
  ('08fe51e9-e7e7-4c36-96a8-cb095f62f45d', '19cdb7a2-af5c-4153-9e17-3675ca253be8', 'Signaler tout dommage constaté sur du matériel loué', 1, 'normal'),
  ('18250972-2413-44a0-808d-08119c6fdcc6', '19cdb7a2-af5c-4153-9e17-3675ca253be8', 'Ranger et stocker le matériel acheté (marmite, boîtes, accessoires bar, etc.)', 2, 'normal'),
  ('bb06889b-1cb8-4282-8798-3cff0cd0bcea', '19cdb7a2-af5c-4153-9e17-3675ca253be8', 'Décider de la destination du stock de boissons restant (à conserver ? redistribuer ?)', 3, 'normal'),
  ('0c629150-5f01-498a-a3c0-526bf1b3656d', '395b23fd-6d16-42bc-91ec-8f7bed120615', 'L''espace fiancés a été préservé toute la durée des arrivées', 0, 'normal'),
  ('f7612e31-957f-44c6-b2f8-e92fae78dbc3', 'c96061ac-8f09-4b78-b6ca-5a9249b4e900', 'Poser la signalétique directionnelle depuis l''accès principal', 0, 'normal'),
  ('8f3af741-d97b-4b42-bb21-d7dd2ab241a4', 'c96061ac-8f09-4b78-b6ca-5a9249b4e900', 'Bloquer ou signaler l''espace fond de parking réservé aux fiancés', 1, 'normal'),
  ('ffae7ea5-edd8-4a76-b5a2-bc09342c2da8', 'c96061ac-8f09-4b78-b6ca-5a9249b4e900', 'Orienter chaque voiture vers l''entrée du parking', 2, 'normal'),
  ('962aea32-1163-48d6-81c4-1a9334cafe1a', 'c96061ac-8f09-4b78-b6ca-5a9249b4e900', 'Avoir le contact du propriétaire du lieu pour toute voiture à déplacer si nécessaire', 3, 'normal'),
  ('752d24ff-5318-4ae6-950b-54bf30c2dfde', 'c96061ac-8f09-4b78-b6ca-5a9249b4e900', 'Informer le coordinateur général quand les arrivées se stabilisent (vers 18h15)', 4, 'normal'),
  ('f4a82167-5477-4f02-b149-3483703aadab', '6e97b09d-4744-4b82-b2d9-2d20d9a03982', 'La tenue complète (vêtement, chaussures, bijoux), la coiffure et le maquillage sont confirmés pour le jour J', 0, 'normal'),
  ('a9b55f36-195b-4189-978b-6ac4b2a0e5d2', '9bf35d94-10de-4946-9b10-d36a8516e86c', 'Trouver et commander les chaussures assorties', 0, 'normal'),
  ('af281725-3d1f-4aa8-b3de-2dbdb04e6d44', '9bf35d94-10de-4946-9b10-d36a8516e86c', 'Trouver et commander les bijoux assortis', 1, 'normal'),
  ('5e09028c-a6b3-429d-a5f1-545f5c28cce3', '9bf35d94-10de-4946-9b10-d36a8516e86c', 'Organiser un essayage complet tenue + chaussures', 2, 'normal'),
  ('78eb2ebc-05c8-4215-88f4-1b6f8dda6976', '9bf35d94-10de-4946-9b10-d36a8516e86c', 'Laver et repasser le lehenga dans un pressing', 3, 'normal'),
  ('0c5f12cc-6200-482b-83cf-714c981a09de', '2ccd91aa-4329-4ff3-9aab-6e6045c91a73', 'Choisir le style de coiffure', 0, 'high'),
  ('0c7b1518-85d6-45a2-b217-2fd60cb34d93', '2ccd91aa-4329-4ff3-9aab-6e6045c91a73', 'Essayer une coiffure', 1, 'normal'),
  ('6f3bbbf9-4cdf-47bc-bc81-63df5e59ca20', '2ccd91aa-4329-4ff3-9aab-6e6045c91a73', 'Réserver la coiffeuse pour le jour J', 2, 'high'),
  ('a3430fe7-a8a3-4b06-bb30-42d2cc1566cb', '906808a9-1e40-4ce9-bf57-e7c1ccf59a00', 'Essai maquillage à réaliser', 0, 'normal'),
  ('90db2f0d-fca6-41a9-a584-b730f8138c12', '906808a9-1e40-4ce9-bf57-e7c1ccf59a00', 'Prendre le rendez-vous de maquillage pour le jour J', 1, 'normal'),
  ('3560a527-a838-4373-9d97-b28b5163b39c', '906808a9-1e40-4ce9-bf57-e7c1ccf59a00', 'Trouver des faux ongles', 2, 'normal'),
  ('08f83482-0a60-4266-9195-e4299dcdd7c0', '47ba2e5c-30ea-4ed5-b34b-b57ae084e86f', 'La tenue complète et la coiffure sont confirmées pour le jour J', 0, 'normal'),
  ('5c9665ec-bca8-4f55-bde5-e04e85f861a1', 'd3f45a2e-c0cd-4f29-8efb-715c0989e411', 'Identifier et commander la tenue définitive avec délai de livraison confirmé', 0, 'high'),
  ('ce5bfc70-0b40-4a1b-b28c-fe8fd1e7790d', 'd3f45a2e-c0cd-4f29-8efb-715c0989e411', 'Prévoir les retouches si nécessaire', 1, 'normal'),
  ('4ef0e1c1-1445-4862-af3e-1800c5dd6cca', 'd3f45a2e-c0cd-4f29-8efb-715c0989e411', 'Trouver et commander les chaussures assorties', 2, 'normal'),
  ('1283fc37-107a-4817-bd3e-f3cc33f0fb0f', 'd3f45a2e-c0cd-4f29-8efb-715c0989e411', 'Choisir les accessoires (pochette, montre, etc.)', 3, 'normal'),
  ('c05c1bc6-8275-456f-9cb8-5fc98a60530c', 'd3f45a2e-c0cd-4f29-8efb-715c0989e411', 'Faire un essayage complet tenue + chaussures avant le jour J', 4, 'normal'),
  ('4c683d97-56ef-4724-ba32-6b07a02b3866', 'bda06860-c67a-4b6b-8a3f-c50fd48bf77f', 'Vérifier si le rendez-vous existant doit être maintenu, décalé ou confirmé (à décaler la veille)', 0, 'normal'),
  ('dbac6e69-64c2-471f-b416-fe9c8a9c73a1', '1a17bf86-c752-4ca8-989b-af62a6297c47', 'L''échéancier des paiements restants est créé et à jour', 0, 'normal'),
  ('a2e94891-9b0a-44de-9fc3-8283248be991', '1a17bf86-c752-4ca8-989b-af62a6297c47', 'L''enveloppe imprévus est provisionnée', 1, 'normal'),
  ('bf1fe55d-f545-461f-9f5f-dfd7707811c2', '7d87743e-f7cf-46c0-91a2-4d198bb67684', 'Alimenter le tableau de suivi des dépenses avec toutes les dépenses engagées à ce jour', 0, 'normal'),
  ('bcdf8d00-fed2-48bf-8ef4-141c36c43e81', '7d87743e-f7cf-46c0-91a2-4d198bb67684', 'Centraliser tous les contrats dans un dossier unique (numérique)', 1, 'normal'),
  ('f847c6c4-e00b-4d2a-9ee9-43e793019d55', '52e8d0b7-afe4-40c2-868f-cc71f07fd6b8', 'Créer l''échéancier des paiements restants par prestataire avec dates limites', 0, 'high'),
  ('89eb8561-94d9-477a-bcae-1d17e770f83f', '52e8d0b7-afe4-40c2-868f-cc71f07fd6b8', 'Vérifier les plafonds bancaires — contacter la banque si des virements importants sont prévus', 1, 'normal'),
  ('a2571323-0577-43bc-9452-13cacae26890', '52e8d0b7-afe4-40c2-868f-cc71f07fd6b8', 'Vérifier les conditions d''annulation dans chaque contrat', 2, 'normal'),
  ('622339c4-cf61-4ea1-aa47-99a4ba84c8bb', '5370b0e9-5b9d-4f5b-a7c7-5713573a9f40', 'Définir et réserver l''enveloppe imprévus (5–10 % du budget total)', 0, 'normal'),
  ('793568e8-2d0b-4fe5-8f4b-4581898df7df', 'd3579939-f5ad-4379-a895-82355c0cc071', 'Tous les prestataires du jour J ont été réglés avec justificatifs conservés', 0, 'normal'),
  ('438e5ca3-e37f-4d24-8f86-5f0346d9736c', '710d5634-d765-49ad-9e1e-0290861d0387', 'Préparer les enveloppes de paiement espèces (traiteurs ext) pour le jour J si nécessaire', 0, 'normal'),
  ('d7913cb3-555e-4285-b6a3-891972fdc20e', '09782dfd-b3b6-4444-beef-7eb304b73a49', 'Effectuer les paiements aux dates prévues et conserver tous les justificatifs', 0, 'normal'),
  ('04c4c4cd-c22b-4f3f-955d-b6a8066bc443', '09782dfd-b3b6-4444-beef-7eb304b73a49', 'Réaliser les paiements des soldes restants aux prestataires qui partent', 1, 'normal'),
  ('89729bc2-d9b6-4ad6-b416-5ce62e61de07', '09782dfd-b3b6-4444-beef-7eb304b73a49', 'Récupérer les bons de fin de prestation', 2, 'normal'),
  ('d9b786cc-3cc7-4cfc-a2b4-7965b11315fc', '1c236b84-2cfa-4058-9b40-cd6d876b79f5', 'L''urne est prête et un gardien est désigné', 0, 'normal'),
  ('9096ce0f-caa2-42b0-8a8f-819c0428908c', '9a2b6e4c-8725-4f10-a227-697d7cdb6195', 'Choisir et préparer l''urne ou boîte sécurisée', 0, 'normal'),
  ('f9028236-9061-4253-8857-441b0ac85ff6', '9a2b6e4c-8725-4f10-a227-697d7cdb6195', 'Désigner une personne de confiance pour gérer l''urne toute la soirée', 1, 'normal'),
  ('dc69fb89-50b2-44d5-ab70-71758a371ebb', '07f7aff8-e56c-483d-abea-a6d7a680b85c', 'L''urne n''a jamais été laissée sans surveillance', 0, 'normal'),
  ('54db6643-4083-42b9-b23a-c70d77e0514c', '07f7aff8-e56c-483d-abea-a6d7a680b85c', 'Elle a été remise en sécurité aux fiancés en fin de soirée', 1, 'normal'),
  ('32de8eb4-398f-4f3f-9245-8d1a18e110f5', '2718c011-bd66-465d-af33-642986af3217', 'Poser l''urne à son emplacement visible et surveillé dès le début', 0, 'normal'),
  ('cb5f8b0d-c347-45d8-8eb6-cd1ea3c66fb6', '2718c011-bd66-465d-af33-642986af3217', 'Surveiller l''urne tout au long de la soirée', 1, 'normal'),
  ('479102dc-12e1-41a9-8e00-cf93abd1f79e', '2718c011-bd66-465d-af33-642986af3217', 'Réceptionner et sécuriser les éventuels cadeaux physiques', 2, 'normal'),
  ('fd82d4a1-322a-429d-9d41-db5636dd29f0', '2718c011-bd66-465d-af33-642986af3217', 'Récupérer et sécuriser l''urne en fin de soirée (avant les adieux)', 3, 'normal'),
  ('34abdee1-de1e-46df-895f-b53105c2937c', '2718c011-bd66-465d-af33-642986af3217', 'Remettre l''urne et les cadeaux aux fiancés ou à une personne désignée', 4, 'normal'),
  ('ebd31304-3885-427f-bf92-ae63828258c6', 'd75ef9de-0cdc-4ac1-aae6-cdada4118039', 'L''inventaire de l''urne est fait en présence de témoins et la liste des donateurs est établie', 0, 'normal'),
  ('377e6ca3-23df-4646-8200-c4c30e31bbd3', 'a479a8b9-229d-4602-8ad7-c025374c723f', 'Inventorier le contenu de l''urne en présence de témoins (Jordan et/ou Sarah)', 0, 'normal'),
  ('0cb1bd38-5179-4518-82a3-ad3e814b5a9a', 'a479a8b9-229d-4602-8ad7-c025374c723f', 'Lister les donateurs pour les remerciements personnalisés', 1, 'normal'),
  ('161b59e5-5bfb-4b31-b961-4e6469f19b58', 'a479a8b9-229d-4602-8ad7-c025374c723f', 'Remettre l''urne et les cadeaux physiques aux fiancés de façon sécurisée', 2, 'normal'),
  ('0f78a4af-5e6e-47bb-ad0f-82c95a242216', '8cb2dd9a-efe0-4dfa-bfd4-c33d86ff590a', 'La comptabilité est clôturée et archivée', 0, 'normal'),
  ('4e2f99ed-5658-4d7a-b2e4-b01ddf0cda2a', '8cb2dd9a-efe0-4dfa-bfd4-c33d86ff590a', 'Tous les soldes sont réglés', 1, 'normal'),
  ('beb80674-2de1-47c0-9b06-2ce5700092a9', '95b258e3-25c3-47f8-a9f9-31652fa2673a', 'Mettre à jour le tableau de suivi des dépenses avec les dernières dépenses (jour J + lendemain)', 0, 'normal'),
  ('91360cb2-ef28-43fd-8d55-3fd924eb5dff', '95b258e3-25c3-47f8-a9f9-31652fa2673a', 'Vérifier que tous les soldes ont bien été réglés', 1, 'normal'),
  ('f77fceab-83d7-4aa7-a76b-dec4e4a0c939', '95b258e3-25c3-47f8-a9f9-31652fa2673a', 'Récupérer le dépôt de garantie de la salle si non encore restitué', 2, 'normal'),
  ('b153600c-b4e2-4a3e-904a-fccf312899c4', '95b258e3-25c3-47f8-a9f9-31652fa2673a', 'Clôturer la comptabilité complète et archiver tous les documents et justificatifs', 3, 'normal'),
  ('09811370-d68c-4ca6-8761-c1637553e196', '95b258e3-25c3-47f8-a9f9-31652fa2673a', 'Archiver les contrats, devis et bons de prestation dans le dossier dédié', 4, 'normal'),
  ('0feab6f2-3de2-4bf8-bee4-89cd0cb7781d', '00ca80ca-435f-498c-83ac-40dd7386f537', 'Les avis sont laissés et les coordonnées des prestataires sont archivées', 0, 'normal'),
  ('5f6f6feb-eeb2-4130-879b-0c183eb3f888', 'ce3df3fa-7924-4876-bbe8-b28f298a8407', 'Laisser des avis Google / plateformes pour les prestataires qui l''ont mérité', 0, 'normal'),
  ('6bf80345-ddd7-4608-889e-a4c42ade2903', 'ce3df3fa-7924-4876-bbe8-b28f298a8407', 'Garder les coordonnées des prestataires pour de futurs événements', 1, 'normal'),
  ('56ab5b32-7dea-4a7e-ae44-3a6cb806fd96', 'ce3df3fa-7924-4876-bbe8-b28f298a8407', 'Faire un debriefing informel avec le coordinateur général pour noter les points à améliorer', 2, 'normal'),
  ('0339a33c-8781-4e65-9bb2-1f59403651aa', '1082ca51-dd09-4968-8c50-302926f42ee6', 'Tous les remerciements (invités, bénévoles, donateurs, prestataires) ont été envoyés', 0, 'normal'),
  ('9e0d98bb-c7d7-4919-9a96-f1dc44715a76', 'd23bbf25-fb43-475a-b97c-71969776d8a9', 'Envoyer le message de remerciement aux invités (préparé en amont)', 0, 'normal'),
  ('d6ea207c-5cb6-4f89-bcb7-ac38eaf1f9a3', 'd23bbf25-fb43-475a-b97c-71969776d8a9', 'Envoyer un message personnalisé aux prestataires qui ont contribué bénévolement (DJ Djahman, cousins logistique, référents)', 1, 'normal'),
  ('57bc4778-6702-4687-8e47-3f13efd72964', 'd23bbf25-fb43-475a-b97c-71969776d8a9', 'Remercier chaque donateur d''enveloppe nommément', 2, 'normal'),
  ('20f0447e-f68b-493a-b6dd-0d5dbec25201', 'd23bbf25-fb43-475a-b97c-71969776d8a9', 'Remercier les traiteurs et fournisseurs externes avec lesquels tout s''est bien passé', 3, 'normal');
