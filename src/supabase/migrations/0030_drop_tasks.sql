-- Task est remplacé par ChecklistItem (priorité/statut/créneau estimé ajoutés
-- dans 0029) comme unique unité d'action de l'app. _20260725_tasks a déjà été
-- vidée par 0028 (rebuild ETL) : aucune donnée à perdre.
drop table if exists _20260725_tasks;
