-- Vide les données issues de l'ancien ETL ad-hoc pour repartir des 5 fichiers
-- .md (src/tmp) via le nouvel ETL strict (voir seed/13_etl_domaines_missions_checklists.sql).
-- DELETE explicites dans l'ordre des dépendances plutôt que TRUNCATE ... CASCADE,
-- qui viderait aussi _20260725_logistique_items (FK domaine_id) sans qu'on le veuille.
--
-- À exécuter AVANT d'insérer seed/13_etl_domaines_missions_checklists.sql.

delete from _20260725_checklist_items
where checklist_id in (select id from _20260725_checklists where owner_type = 'mission');

delete from _20260725_checklists where owner_type = 'mission';

delete from _20260725_tasks;

delete from _20260725_missions;

delete from _20260725_domaine_responsables;

delete from _20260725_domaines;
